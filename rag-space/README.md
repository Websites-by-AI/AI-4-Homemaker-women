---
title: DigiAmoozesh AI Tutor
emoji: 🎓
colorFrom: purple
colorTo: yellow
sdk: gradio
sdk_version: 5.34.2
app_file: app.py
pinned: false
license: mit
---

# 🎓 مربی هوشمند دیجی‌آموزش — DigiAmoozesh AI Tutor

چت‌بات **RAG فارسی** که از روی منابع آموزشی آکادمی **دیجی‌آموزش** (۱۸ مقاله + ۱۵ کسب‌وکار خانگی + ۱۵ سناریوی ویدیو + ۱۰ قسمت دوره) جواب می‌دهد — ادامهٔ نسخهٔ نمایشگاهی قدیمی، حالا برای پلتفرم آموزشی.

## قابلیت‌ها

- 💬 چت فارسی RTL با فونت وزیرمتن و برند دیجی‌آموزش
- 📖 پاسخ بر اساس منابع واقعی + نمایش نام منبع‌ها
- 🔊 خواندن صوتی پاسخ (gTTS فارسی)
- 📜 تاریخچهٔ گفت‌وگو (قابل پاک‌کردن)
- 📕 افزودن منبع بیشتر با متغیرهای محیطی: اکسل (`EXCEL_URL`)، وبلاگ زنده (`BLOG_BASE`)، یوتیوب (`YOUTUBE_URLS`)

## تنظیمات (Settings → Variables and secrets)

| متغیر | نوع | توضیح |
|---|---|---|
| `OPENROUTER_API_KEY` | **Secret (اجباری)** | کلید از openrouter.ai/keys |
| `OPENROUTER_CHAT_MODEL` | متغیر | پیش‌فرض `google/gemini-2.0-flash-001` |
| `OPENROUTER_EMBED_MODEL` | متغیر | پیش‌فرض `openai/text-embedding-3-small` |
| `EXCEL_URL` | متغیر (اختیاری) | لینک فایل xlsx برای افزودن به دانش |
| `BLOG_BASE` | متغیر (اختیاری) | آدرس سایت برای لود زندهٔ مقالات |
| `YOUTUBE_URLS` | متغیر (اختیاری) | چند لینک، جدا با ویرگول |

## اجرای محلی

```bash
pip install -r requirements.txt
export OPENROUTER_API_KEY=sk-or-...
python app.py
# → http://127.0.0.1:7860
```

برای بک‌اند محلی با Ollama: `LLM_BACKEND=ollama` و `ollama pull llama3 && ollama pull nomic-embed-text`

## نسخهٔ وب (Vercel)

نسخهٔ React/Next.js همین مربی روی پلتفرم اصلی در مسیر `/assistant` اجرا می‌شود — با همان موتور RAG و OpenRouter روی Neon Postgres.
