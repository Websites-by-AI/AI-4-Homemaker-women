# -*- coding: utf-8 -*-
"""
🎓 مربی هوشمند دیجی‌آموزش — RAG چت‌بات آموزشی
نسخهٔ ادامه‌یافتهٔ بات نمایشگاهی (iran-oil) → آکادمی کسب‌وکارهای خانگی دیجی‌آموزش

منابع دانش:
  ۱) educational-data.json  (همیشه: ۱۸ مقاله + ۱۵ کسب‌وکار + ۱۵ سناریوی ویدیو + ۱۰ قسمت دوره)
  ۲) EXCEL_URL (اختیاری) — مثل نسخهٔ قدیمی، ایکسل هم لود می‌شود (با pandas؛ سبک و پایدار)
  ۳) BLOG_BASE (اختیاری) — لود زندهٔ مقالات سایت
  ۴) YOUTUBE_URLS (اختیاری) — ترنسکرایپت ویدیوها (جدا با ویرگول)

بک‌اند مدل:
  - پیش‌فرض OpenRouter (روی هاگینگ‌فیس: کافی است Secret بگذاری)
  - LLM_BACKEND=ollama برای اجرای محلی با llama3 + nomic-embed-text

متغیرها:
  OPENROUTER_API_KEY   required (در حالت openrouter)
  OPENROUTER_CHAT_MODEL   default google/gemini-2.0-flash-001
  OPENROUTER_EMBED_MODEL  default openai/text-embedding-3-small
  LLM_BACKEND  openrouter | ollama   (default: openrouter)
"""

import os
import re
import json
import base64
import uuid
import time
import threading
from datetime import datetime

# ── تنظیمات ───────────────────────────────────────────────
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
HF_TOKEN = os.environ.get("HF_TOKEN", os.environ.get("HF_API_KEY", ""))
OPENROUTER_URL = "https://openrouter.ai/api/v1"
HF_ROUTER = "https://router.huggingface.co"

# انتخاب خودکار بک‌اند: openrouter → huggingface inference → ollama محلی
_default_backend = "openrouter" if OPENROUTER_API_KEY else ("hf" if HF_TOKEN else "ollama")
LLM_BACKEND = os.environ.get("LLM_BACKEND", _default_backend).strip().lower()

CHAT_MODEL = os.environ.get("OPENROUTER_CHAT_MODEL", "google/gemini-2.0-flash-001")
EMBED_MODEL = os.environ.get("OPENROUTER_EMBED_MODEL", "openai/text-embedding-3-small")
HF_CHAT_MODEL = os.environ.get("HF_CHAT_MODEL", "Qwen/Qwen2.5-72B-Instruct:featherless-ai")
HF_EMBED_MODEL = os.environ.get("HF_EMBED_MODEL", "intfloat/multilingual-e5-large")
OLLAMA_CHAT_MODEL = os.environ.get("OLLAMA_CHAT_MODEL", "llama3")
OLLAMA_EMBED_MODEL = os.environ.get("OLLAMA_EMBED_MODEL", "nomic-embed-text")

EXCEL_URL = os.environ.get("EXCEL_URL", "").strip()          # اختیاری
BLOG_BASE = os.environ.get("BLOG_BASE", "").strip()          # اختیاری: https://...vercel.app
YOUTUBE_URLS = [u.strip() for u in os.environ.get("YOUTUBE_URLS", "").split(",") if u.strip()]

APP_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_JSON = os.path.join(APP_DIR, "educational-data.json")
HISTORY_FILE = "/tmp/digiamoozesh_chat_history.json"         # روی HF Spaces فقط /tmp قابل‌نوشتن است
QA_LOG_FILE = "/tmp/digiamoozesh_qa_dataset.jsonl"           # دیتاست در حال رشد پرسش‌وپاسخ (برای fine-tune آینده)

# ── W&B (wandb): مانیتورینگ RAG + دیتاست تمرینی (اختیاری) ──
WANDB_API_KEY = os.environ.get("WANDB_API_KEY", "")
_wandb_run = None

def _wandb_init():
    """اتصال به Weights & Biases — اگر کلید بود"""
    global _wandb_run
    if _wandb_run is not None or not WANDB_API_KEY:
        return _wandb_run
    try:
        import wandb
        _wandb_run = wandb.init(
            project=os.environ.get("WANDB_PROJECT", "digiamoozesh-rag"),
            config={"backend": LLM_BACKEND, "chat_model": CHAT_MODEL if LLM_BACKEND == "openrouter" else HF_CHAT_MODEL,
                    "embed_model": EMBED_MODEL if LLM_BACKEND == "openrouter" else HF_EMBED_MODEL},
            reinit=True,
        )
        print("[wandb] connected ✅")
    except Exception as e:
        print(f"[wandb] init failed: {e}")
    return _wandb_run


def wandb_track(question: str, answer: str, sources: list, latency_s: float, scores=None):
    """ثبت هر گفت‌وگو: متریک‌ها + دیتاست JSONL + Artifact در W&B"""
    entry = {
        "ts": datetime.now().isoformat(),
        "question": question,
        "answer": answer,
        "answer_len": len(answer),
        "sources": sources,
        "backend": LLM_BACKEND,
        "latency_s": round(latency_s, 2),
    }
    # ۱) دیتاست محلی (در حال رشد — دادهٔ تمرین آینده)
    try:
        with open(QA_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception:
        pass
    # ۲) W&B
    run = _wandb_init()
    if run:
        try:
            import wandb
            run.log({
                "chat/answer_len": len(answer),
                "chat/sources_count": len(sources),
                "chat/latency_s": round(latency_s, 2),
                "chat/top_score": (scores or [0])[0] if scores else 0,
            })
            # هر ۵ گفت‌وگو: آپلود دیتاست به‌عنوان Artifact (نسخه‌بندی خودکار W&B)
            with open(QA_LOG_FILE, encoding="utf-8") as f:
                n = sum(1 for _ in f)
            if n % 5 == 0:
                art = wandb.Artifact("rag-qa-dataset", type="dataset",
                                     description=f"Q&A pairs, n={n}")
                art.add_file(QA_LOG_FILE, name="qa_dataset.jsonl")
                run.log_artifact(art)
                print(f"[wandb] artifact v{n//5} uploaded ✅")
        except Exception as e:
            print(f"[wandb] track error: {e}")

SYSTEM_PROMPT = """تو «مربی هوشمند دیجی‌آموزش» هستی؛ دستیار آموزشی آکادمی کسب‌وکارهای خانگی با هوش مصنوعی.
قوانین:
۱. همیشه فارسی، گرم، صمیمی و تشویق‌کننده جواب بده (مثل مربی دلسوز برای خانم‌های خانه‌دار).
۲. پاسخ فقط بر اساس «منابع آموزشی» ارائه‌شده باشد؛ اگر جواب نبود، صادقانه بگو و راهنمایی کلی بده.
۳. کوتاه، عملی و مرحله‌ای بنویس؛ از بولت استفاده کن.
۴. مثال‌ها را به کسب‌وکارهای خانگی (شیرینی، شمع‌سازی، خیاطی…) و ابزارهای AI (جمینای، Veo) پیوند بزن."""

# ── لود تنبیهی وابستگی‌ها (تا لانچ اسپیس سریع بماند) ────────
_vectorstore = None
_build_error = ""
_build_lock = threading.Lock()


class OpenRouterEmbeddings:
    """کلاس سبک embedding با OpenRouter — سازگار با FAISS لنگچین"""

    def _call(self, texts):
        import requests
        res = requests.post(
            f"{OPENROUTER_URL}/embeddings",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
            json={"model": EMBED_MODEL, "input": texts},
            timeout=120,
        )
        res.raise_for_status()
        data = res.json()["data"]
        return [d["embedding"] for d in sorted(data, key=lambda x: x["index"])]

    def embed_documents(self, texts):
        out = []
        for i in range(0, len(texts), 32):       # دسته‌های ۳۲تایی
            out.extend(self._call(texts[i:i + 32]))
        return out

    def embed_query(self, text):
        return self._call([text])[0]

    # برای langchain FAISS
    def __call__(self, text):
        return self.embed_query(text)


class HFEmbeddings:
    """امبدینگ با HuggingFace Inference Router — مدل e5 چندزبانه (فارسی عالی)
    کانوانسیون e5: سندها با پیشوند «passage: » و پرسش با «query: »"""

    def _call(self, texts):
        import requests
        res = requests.post(
            f"{HF_ROUTER}/hf-inference/models/{HF_EMBED_MODEL}",
            headers={"Authorization": f"Bearer {HF_TOKEN}", "Content-Type": "application/json"},
            json={"inputs": texts},
            timeout=120,
        )
        res.raise_for_status()
        return res.json()

    def embed_documents(self, texts):
        out = []
        for i in range(0, len(texts), 16):
            out.extend(self._call(["passage: " + t for t in texts[i:i + 16]]))
        return out

    def embed_query(self, text):
        return self._call(["query: " + text])[0]

    def __call__(self, text):
        return self.embed_query(text)


def _get_embeddings():
    if LLM_BACKEND == "ollama":
        from langchain_ollama import OllamaEmbeddings
        return OllamaEmbeddings(model=OLLAMA_EMBED_MODEL)
    if LLM_BACKEND == "hf":
        return HFEmbeddings()
    return OpenRouterEmbeddings()


def _chat_llm(question: str, context: str) -> str:
    """پاسخ مدل چت — OpenRouter یا HuggingFace Inference یا Ollama"""
    user_prompt = f"{SYSTEM_PROMPT}\n\nمنابع آموزشی:\n{context}\n\nپرسش کاربر: {question}"
    if LLM_BACKEND == "ollama":
        import ollama
        r = ollama.chat(model=OLLAMA_CHAT_MODEL, messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"منابع آموزشی:\n{context}\n\nپرسش: {question}"},
        ])
        return r["message"]["content"]

    import requests
    if LLM_BACKEND == "hf":
        res = requests.post(
            f"{HF_ROUTER}/v1/chat/completions",
            headers={"Authorization": f"Bearer {HF_TOKEN}", "Content-Type": "application/json"},
            json={"model": HF_CHAT_MODEL,
                  "messages": [{"role": "user", "content": user_prompt}],
                  "temperature": 0.4, "max_tokens": 1400},
            timeout=120,
        )
    else:
        res = requests.post(
            f"{OPENROUTER_URL}/chat/completions",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://huggingface.co", "X-Title": "DigiAmoozesh AI Tutor"},
            json={"model": CHAT_MODEL,
                  "messages": [{"role": "user", "content": user_prompt}],
                  "temperature": 0.4, "max_tokens": 1400},
            timeout=120,
        )
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"].strip()


# ── ساخت پایگاه دانش ─────────────────────────────────────
def _load_docs():
    """متن‌ها را از منابع مختلف جمع می‌کند"""
    from langchain_core.documents import Document
    docs = []

    # ۱) داده‌های آموزشی دیجی‌آموزش (همیشه موجود)
    with open(DATA_JSON, encoding="utf-8") as f:
        data = json.load(f)
    for a in data["articles"]:
        body = f"عنوان: {a['title']} ({a['category']})\nمقدمه: {a['introducer']}\n"
        body += "آموزش‌های لازم: " + "؛ ".join(a["need"]) + "\n"
        body += "تکنیک‌های تولید محتوا: " + "؛ ".join(a["content"]) + "\n"
        body += "تکنیک‌های ساخت سایت: " + "؛ ".join(a["site"]) + f"\nنکتهٔ طلایی: {a['tip']}"
        docs.append(Document(page_content=body, metadata={"source": f"مقاله: {a['title']}"}))
    for b in data["businesses"]:
        docs.append(Document(
            page_content=f"کسب‌وکار خانگی «{b['name']}»: " + "؛ ".join(b["items"]),
            metadata={"source": f"کسب‌وکار: {b['name']}"}))
    for e in data["episodes"]:
        docs.append(Document(page_content=f"قسمت دوره — {e['title']}: {e['description']}",
                             metadata={"source": f"دوره: {e['title']}"}))
    for v in data["videoScenarios"]:
        story = " | ".join(" — ".join(s) if isinstance(s, list) else str(s) for s in v["story"])
        docs.append(Document(
            page_content=f"سناریوی ویدیو «{v['name']}» ({v.get('title','')})\nقلاب: {v.get('hook','')}\nاستوری‌برد: {story}\nپرامپت Veo: {v.get('veoPrompt','')}",
            metadata={"source": f"سناریو: {v['name']}"}))
    print(f"[RAG] educational-data: {len(docs)} docs")

    # ۲) اکسل اختیاری — مثل نسخهٔ نمایشگاهی ولی با pandas (سبک‌تر از unstructured)
    if EXCEL_URL:
        try:
            import pandas as pd
            xls = pd.read_excel(EXCEL_URL, sheet_name=None)
            n0 = len(docs)
            for sheet, df in xls.items():
                text = df.to_csv(index=False)
                docs.append(Document(page_content=f"داده‌های اکسل — شیت {sheet}:\n{text}",
                                     metadata={"source": f"اکسل: {sheet}"}))
            print(f"[RAG] excel: +{len(docs) - n0} docs")
        except Exception as e:
            print(f"[RAG] excel error: {e}")

    # ۳) لود زندهٔ وبلاگ سایت (اختیاری)
    if BLOG_BASE:
        try:
            from langchain_community.document_loaders import WebBaseLoader
            n0 = len(docs)
            urls = [f"{BLOG_BASE.rstrip('/')}/blog/{s}" for s in
                    [a["slug"] for a in json.load(open(DATA_JSON))["articles"]]]
            docs.extend(WebBaseLoader(urls).load())
            print(f"[RAG] blog: +{len(docs) - n0} docs")
        except Exception as e:
            print(f"[RAG] blog error: {e}")

    # ۴) ترنسکرایپت یوتیوب (اختیاری)
    for url in YOUTUBE_URLS:
        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            vid = re.search(r"(?:v=|be/)([\w-]{11})", url)
            if vid:
                tr = YouTubeTranscriptApi.get_transcript(vid.group(1), languages=["fa", "en"])
                docs.append(Document(
                    page_content="ترنسکرایپت ویدیو: " + " ".join(t["text"] for t in tr),
                    metadata={"source": f"یوتیوب: {url}"}))
                print(f"[RAG] youtube: {url} ok")
        except Exception as e:
            print(f"[RAG] youtube error {url}: {e}")

    return docs


def _build_vectorstore():
    """ساخت اولیه در پس‌زمینه — یک‌بار"""
    global _vectorstore, _build_error
    with _build_lock:
        if _vectorstore is not None or _build_error:
            return
        try:
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            from langchain_community.vectorstores import FAISS
            t0 = time.time()
            docs = _load_docs()
            splits = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200).split_documents(docs)
            _vectorstore = FAISS.from_documents(splits, _get_embeddings())
            print(f"[RAG] vectorstore ready: {len(splits)} chunks in {time.time()-t0:.0f}s")
        except Exception as e:
            _build_error = str(e)
            print(f"[RAG] build failed: {e}")


def _ensure_ready():
    if _vectorstore is None and not _build_error:
        _build_vectorstore()
    return _vectorstore is not None


def rag_chain(question: str) -> tuple[str, list[str]]:
    vs = _vectorstore
    docs = vs.as_retriever(search_kwargs={"k": 5}).invoke(question)
    context = "\n\n".join(d.page_content for d in docs)
    sources = sorted({d.metadata.get("source", "نامشخص") for d in docs})
    return _chat_llm(question, context), sources


# ── تاریخچهٔ گفت‌وگو (مانند نسخهٔ قدیمی) ────────────────────
def load_chat_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def save_chat_history(history):
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history[-50:], f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"history save error: {e}")


# ── متن‌به‌گفتار فارسی (اصلاح باگ escaping نسخهٔ قدیمی) ──────
def text_to_speech(text: str) -> str:
    try:
        from gtts import gTTS
        clean = re.sub(r"<[^>]+>", "", text)[:800]   # گوگل محدودیت طول دارد
        tts = gTTS(text=clean, lang="fa")
        path = f"/tmp/tts_{uuid.uuid4().hex}.mp3"
        tts.save(path)
        with open(path, "rb") as f:
            audio_b64 = base64.b64encode(f.read()).decode()
        os.remove(path)
        return f'<audio controls style="width:100%"><source src="data:audio/mp3;base64,{audio_b64}" type="audio/mp3"></audio>'
    except Exception as e:
        print(f"TTS error: {e}")
        return "<small>🔇 تولید صدا فعلاً ممکن نیست</small>"


def format_response(response: str) -> str:
    """تبدیل لینک‌ها و عکس‌ها به HTML واقعی (باگ &lt; نسخهٔ قدیمی رفع شد)"""
    safe = (response.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
    safe = re.sub(r"(https?://[^\s&]+\.(?:jpg|png|gif|webp))",
                  r'<img src="\1" alt="image" style="max-width:280px;border-radius:12px">', safe)
    safe = re.sub(r"(https?://[^\s&<]+)", r'<a href="\1" target="_blank" style="color:#6C4CF1">\1</a>', safe)
    return safe.replace("\n", "<br>")


# ── منطق اصلی چت ───────────────────────────────────────────
def _backend_ready_msg() -> str | None:
    if LLM_BACKEND == "openrouter" and not OPENROUTER_API_KEY:
        return "کلید OPENROUTER_API_KEY تنظیم نشده است! در تنظیمات اسپیس اضافه‌ش کنید. 🔑"
    if LLM_BACKEND == "hf" and not HF_TOKEN:
        return "کلید HF_TOKEN تنظیم نشده است! در Settings → Secrets اسپیس اضافه‌ش کنید. 🔑"
    return None


def api_chat(question: str) -> str:
    """API ساده برای پروکسی Vercel: متن خالص + منابع — endpoint: /gradio_api/call/chat"""
    err = _backend_ready_msg()
    if err:
        return json.dumps({"error": err}, ensure_ascii=False)
    if not question or not question.strip():
        return json.dumps({"error": "پرسش خالی است"}, ensure_ascii=False)
    if not _ensure_ready():
        return json.dumps({"error": "پایگاه دانش در حال آماده‌شدن است", "building": True}, ensure_ascii=False)
    try:
        t0 = time.time()
        answer, sources = rag_chain(question.strip())
        wandb_track(question.strip(), answer, sources, time.time() - t0)
        return json.dumps({"answer": answer, "sources": sources, "backend": LLM_BACKEND}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": f"خطای مدل: {str(e)[:200]}"}, ensure_ascii=False)


def chatbot_function(question, _state):
    if not question or not question.strip():
        return "لطفاً یک پرسش معتبر بنویس 🌸", None

    err = _backend_ready_msg()
    if err:
        return err, None

    if not _ensure_ready():
        return (f"پایگاه دانش هنوز آماده نیست. یک‌بار دیگر چند لحظهٔ دیگر تلاش کن 🙏<br><small>{_build_error[:200]}</small>"), None

    try:
        t0 = time.time()
        answer, sources = rag_chain(question.strip())
        wandb_track(question.strip(), answer, sources, time.time() - t0)
    except Exception as e:
        return f"مربی هوشمند فعلاً در دسترس نیست 🙏<br><small>{str(e)[:200]}</small>", None

    formatted = format_response(answer)
    if sources:
        formatted += "<div class='sources'><b>📖 منابع:</b> " + "، ".join(sources) + "</div>"

    history = load_chat_history()
    history.append({"user": question, "bot": formatted, "timestamp": datetime.now().isoformat()})
    save_chat_history(history)

    audio_html = text_to_speech(answer)
    display = f"<div class='qa'><b>👤 شما:</b> {question}</div><div class='qa bot'><b>🤖 مربی:</b> {formatted}</div>"
    return display, audio_html


def show_history():
    history = load_chat_history()
    if not history:
        return "هنوز گفت‌وگویی نیست 🌸"
    out = ""
    for entry in reversed(history[-20:]):
        out += (f"<div class='qa'><b>👤 شما:</b> {entry['user']}</div>"
                f"<div class='qa bot'><b>🤖 مربی:</b> {entry['bot']}</div>")
    return out


def clear_history():
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)
    return "تاریخچهٔ گفت‌وگو پاک شد ✨", ""


# ── رابط کاربری — برند دیجی‌آموزش ──────────────────────────
CUSTOM_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;800&display=swap');
body, .gradio-container { font-family: 'Vazirmatn', Tahoma, sans-serif !important;
  background: #FFF9F3 !important; direction: rtl; text-align: right; }
.gradio-container { max-width: 860px; margin: auto; }
h1, h2, h3 { font-family: 'Vazirmatn' !important; }
input[type=text], textarea { direction: rtl !important; border: 2px solid #6C4CF1 !important;
  border-radius: 14px !important; padding: 12px !important; font-family: 'Vazirmatn' !important; }
button { font-family: 'Vazirmatn' !important; }
#send-btn { background: linear-gradient(135deg,#6C4CF1,#8B5CF6) !important; color: #fff !important;
  border: none !important; border-radius: 999px !important; padding: 12px 34px !important; font-weight: 800 !important; }
#send-btn:hover { filter: brightness(1.08); }
.qa { background: #fff; border-radius: 16px; padding: 12px 18px; margin: 8px 0;
  box-shadow: 0 6px 18px -8px rgba(43,36,64,.14); direction: rtl; }
.qa.bot { background: #F1EAFE; }
.sources { margin-top: 10px; font-size: 12px; color: #0C5E54; background: #DFF7F4;
  border-radius: 10px; padding: 6px 10px; }
mark { background: #FFD66B; }
"""

def build_ui():
    import gradio as gr

    with gr.Blocks(css=CUSTOM_CSS, title="مربی هوشمند دیجی‌آموزش") as iface:
        gr.Markdown("<h1 style='text-align:center'>🎓 مربی هوشمند دیجی‌آموزش</h1>")
        gr.Markdown("<p style='text-align:center'>پرسش‌ات را دربارهٔ کسب‌وکار خانگی، "
                    "هوش مصنوعی، برند و فروش آنلاین بپرس — جواب از روی منابع آموزشی دیجی‌آموزش می‌آید 📚</p>")

        with gr.Row():
            question_input = gr.Textbox(
                placeholder="مثلاً: برای شیرینی خانگی‌ام چطور برند بسازم؟ 🍰",
                label="پرسش تو", scale=4, lines=2)
        with gr.Row():
            submit_btn = gr.Button("ارسال 🚀", elem_id="send-btn", scale=2)
            history_btn = gr.Button("📜 تاریخچه", scale=1)
            clear_btn = gr.Button("🗑 پاک‌کردن تاریخچه", scale=1)

        output_text = gr.HTML(label="پاسخ")
        output_audio = gr.HTML(label="🔊 گوش دادن به پاسخ")

        api_input = gr.Textbox(visible=False)
        api_output = gr.Textbox(visible=False)

        submit_btn.click(fn=chatbot_function, inputs=question_input, outputs=[output_text, output_audio],
                         api_name=False)
        question_input.submit(fn=chatbot_function, inputs=question_input, outputs=[output_text, output_audio],
                              api_name=False)
        history_btn.click(fn=show_history, outputs=output_text, api_name=False)
        clear_btn.click(fn=clear_history, outputs=[output_text, output_audio], api_name=False)

        # ── API عمومی برای اتصال Vercel ──
        api_trigger = gr.Button(visible=False)
        api_trigger.click(fn=api_chat, inputs=api_input, outputs=api_output, api_name="chat")

        gr.Examples(examples=[
            "چطور برای شیرینی خانگی‌ام برند بسازم؟",
            "۱۰ قسمت دورهٔ دیجی‌آموزش چیست؟",
            "برای شمع‌سازی چه محتوایی در اینستاگرام بگذارم؟",
            "چطور با جمینای سناریوی ریلز بنویسم؟",
        ], inputs=question_input)

    return iface


if __name__ == "__main__":
    # ساخت پایگاه دانش در پس‌زمینه تا لانچ اسپیس سریع بماند
    threading.Thread(target=_build_vectorstore, daemon=True).start()
    iface = build_ui()
    iface.launch(debug=False)
