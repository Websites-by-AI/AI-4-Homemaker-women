"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";

type Msg = { role: "user" | "assistant"; content: string; sources?: string[]; demo?: boolean };
type Doc = { id: number; title: string; sourceType: string; sourceRef: string | null; chunkCount: number; createdAt: string };

const SUGGESTIONS = [
  "چطور برای شیرینی خانگی‌ام برند بسازم؟ 🍰",
  "با جمینای چطور ایدهٔ محصول پیدا کنم؟",
  "اولین فروش آنلاینم را چطور انجام بدهم؟",
  "برای ویدیوی کسب‌وکارم سناریو می‌خواهم 🎬",
];

const TYPE_ICON: Record<string, string> = { pdf: "📕", youtube: "🎬", text: "📝" };

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "سلام! من مربی هوشمند دیجی‌آموزش هستم 🤖🎓\nبر اساس PDFها، ویدیوها و منابع آموزشی سایت، قدم‌به‌قدم و شخصی‌سازی‌شده جوابت می‌دهم. چه چیزی می‌خواهی یاد بگیری?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [ingestMsg, setIngestMsg] = useState("");
  const [ytUrl, setYtUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 💾 ذخیرهٔ تاریخچهٔ گفت‌وگو در مرورگر (مثل chat_history.json نسخهٔ قدیمی)
  useEffect(() => {
    try { localStorage.setItem("digi-chat", JSON.stringify(messages.slice(-50))); } catch { /* بی‌اثر */ }
  }, [messages]);

  // 🔊 خواندن صوتی پاسخ با صدای فارسی مرورگر (جایگزین gTTS — رایگان و آفلاین)
  function speak(text: string, idx: number) {
    try {
      const synth = window.speechSynthesis;
      if (speakingIdx === idx) { synth.cancel(); setSpeakingIdx(null); return; }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[*#_~`]/g, "").slice(0, 1200));
      u.lang = "fa-IR";
      const faVoice = synth.getVoices().find((v) => v.lang.startsWith("fa"));
      if (faVoice) u.voice = faVoice;
      u.rate = 0.95;
      u.onend = () => setSpeakingIdx(null);
      u.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      synth.speak(u);
    } catch { /* مرورگر پشتیبانی نمی‌کند */ }
  }

  function clearChat() {
    window.speechSynthesis?.cancel();
    setSpeakingIdx(null);
    setMessages([{
      role: "assistant",
      content: "تاریخچه پاک شد ✨ از نو شروع کنیم — چه چیزی می‌خواهی یاد بگیری؟",
    }]);
  }

  async function loadDocs() {
    try {
      const r = await fetch("/api/ai/documents");
      if (r.ok) {
        const d = await r.json();
        setDocs(d.documents || []);
      }
    } catch { /* بی‌اثر */ }
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try {
      const saved = localStorage.getItem("digi-chat");
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* بی‌اثر */ }
    loadDocs();
  }, []);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const r = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          history: messages.slice(-6).map(({ role, content }) => ({ role, content })),
        }),
      });
      if (r.status === 401) { setNeedLogin(true); setMessages((m) => m.slice(0, -1)); return; }
      const d = await r.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: d.answer || d.error || "متأسفم، خطایی پیش آمد 🙏", sources: d.sources, demo: d.demo },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "ارتباط برقرار نشد؛ دوباره تلاش کن 🔄" }]);
    } finally {
      setLoading(false);
    }
  }

  async function uploadPdf(file: File) {
    setBusy(true); setIngestMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/ai/ingest", { method: "POST", body: fd });
      const d = await r.json();
      setIngestMsg(r.ok ? `✅ «${d.title}» با ${d.chunks} قطعه به دانش اضافه شد` : `⚠️ ${d.error}`);
      if (r.ok) loadDocs();
    } catch { setIngestMsg("⚠️ خطا در آپلود"); }
    finally { setBusy(false); }
  }

  async function addYoutube() {
    if (!ytUrl.trim() || busy) return;
    setBusy(true); setIngestMsg("");
    try {
      const r = await fetch("/api/ai/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "youtube", url: ytUrl.trim() }),
      });
      const d = await r.json();
      setIngestMsg(r.ok ? `✅ «${d.title}» با ${d.chunks} قطعه به دانش اضافه شد` : `⚠️ ${d.error}`);
      if (r.ok) { setYtUrl(""); loadDocs(); }
    } catch { setIngestMsg("⚠️ خطا در افزودن ویدیو"); }
    finally { setBusy(false); }
  }

  async function removeDoc(id: number) {
    const r = await fetch(`/api/ai/documents?id=${id}`, { method: "DELETE" });
    if (r.ok) loadDocs(); else setIngestMsg("⚠️ فقط مدیر می‌تواند حذف کند");
  }

  return (
    <SiteChrome active="assistant">
      <main className="as-main">
        <div className="container as-wrap">
          {/* ── ستون چت ── */}
          <section className="as-chat">
            <div className="as-head">
              <div className="as-avatar">🤖</div>
              <div>
                <h1>مربی هوشمند دیجی‌آموزش</h1>
                <p>RAG — جواب از روی PDFها و ویدیوهای آموزشی خودت 📚</p>
              </div>
              <span className="as-badge">{docs.length} سند آموزشی</span>
              <button className="as-clear-btn" onClick={clearChat} title="پاک‌کردن تاریخچهٔ گفت‌وگو">🗑</button>
            </div>

            {needLogin && (
              <div className="as-login-cta">
                🔐 برای گفت‌وگو با مربی هوشمند باید وارد شوی —{" "}
                <Link href="/login">ورود</Link> یا <Link href="/register">ثبت‌نام رایگان</Link>
              </div>
            )}

            <div className="as-msgs">
              {messages.map((m, i) => (
                <div key={i} className={`as-msg ${m.role}`}>
                  {m.role === "assistant" && <span className="as-mini-avatar">🤖</span>}
                  <div className="as-bubble">
                    <div className="as-text">{m.content}</div>
                    {m.role === "assistant" && i > 0 && (
                      <button
                        className={`as-audio-btn${speakingIdx === i ? " speaking" : ""}`}
                        onClick={() => speak(m.content, i)}
                        title="خواندن صوتی پاسخ"
                      >
                        {speakingIdx === i ? "⏹ توقف صدا" : "🔊 گوش دادن"}
                      </button>
                    )}
                    {m.demo && <span className="as-demo-tag">حالت نمایشی — کلید API تنظیم نشده</span>}
                    {!!m.sources?.length && (
                      <div className="as-sources">
                        <b>📖 منابع:</b>
                        {m.sources.map((s) => <span key={s} className="as-source-chip">{s}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="as-msg assistant">
                  <span className="as-mini-avatar">🤖</span>
                  <div className="as-bubble as-typing"><span /><span /><span /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="as-suggests">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} disabled={loading}>{s}</button>
              ))}
            </div>

            <form
              className="as-inputbar"
              onSubmit={(e) => { e.preventDefault(); send(); }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="پرسشتو دربارهٔ کسب‌وکار خانگی تو بپرس…"
                maxLength={2000}
                dir="rtl"
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="ارسال">↩︎</button>
            </form>
          </section>

          {/* ── ستون کتابخانهٔ دانش ── */}
          <aside className="as-lib">
            <button className="as-lib-toggle" onClick={() => setLibraryOpen((v) => !v)}>
              📚 کتابخانهٔ دانش {libraryOpen ? "▲" : "▼"}
            </button>
            <div className={`as-lib-body${libraryOpen ? " open" : ""}`}>
              <p className="as-lib-hint">
                مدیر می‌تواند PDF آموزشی آپلود کند یا لینک ویدیوی یوتیوب بدهد تا مربی از روی همان‌ها جواب دهد.
              </p>

              <label className={`as-drop${busy ? " busy" : ""}`}>
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  disabled={busy}
                  onChange={(e) => e.target.files?.[0] && uploadPdf(e.target.files[0])}
                />
                📕 <b>آپلود PDF آموزشی</b>
                <small>تا ۸ مگابایت</small>
              </label>

              <div className="as-yt">
                <input
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  placeholder="لینک ویدیوی یوتیوب…"
                  dir="ltr"
                />
                <button onClick={addYoutube} disabled={busy || !ytUrl.trim()}>🎬 افزودن</button>
              </div>

              {ingestMsg && <div className="as-ingest-msg">{ingestMsg}</div>}

              <ul className="as-docs">
                {docs.map((d) => (
                  <li key={d.id}>
                    <span className="as-doc-ico">{TYPE_ICON[d.sourceType] || "📄"}</span>
                    <span className="as-doc-title">{d.title}</span>
                    <span className="as-doc-meta">{d.chunkCount} قطعه</span>
                    <button className="as-doc-del" onClick={() => removeDoc(d.id)} aria-label="حذف">✕</button>
                  </li>
                ))}
                {docs.length === 0 && <li className="as-doc-empty">هنوز سندی اضافه نشده است</li>}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </SiteChrome>
  );
}
