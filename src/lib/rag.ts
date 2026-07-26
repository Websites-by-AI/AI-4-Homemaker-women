/**
 * RAG engine — بازیابی دانش از اسناد آموزشی (PDF / یوتیوب / متن)
 * ذخیره: جدول ai_chunks در Neon (embedding به‌صورت JSON)
 * شباهت: کسینوسی در JS — سبک، قابل حمل، نیازی به pgvector extension ندارد.
 * نکتهٔ رشد: اگر تعداد قطعات از ~۱۰٬۰۰۰ گذشت، مهاجرت به pgvector (CREATE EXTENSION vector در Neon) توصیه می‌شود.
 */

import { db } from "@/db";
import { aiDocuments, aiChunks } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { embedTexts, chatCompletion, aiBackend, type ChatMessage } from "@/lib/ai";
import seedData from "@/data/knowledge-seed.json";

/** کانوانسیون e5: برای بک‌اند HF به query/passage پیشوند می‌زنیم */
const qPrefix = (t: string) => (aiBackend() === "hf" ? "query: " + t : t);
const pPrefix = (t: string) => (aiBackend() === "hf" ? "passage: " + t : t);

// ── دانش آمادهٔ سایت (بدون نیاز به دیتابیس — برای Vercel قبل از Neon) ──
type SeedChunk = { content: string; title: string; vec: number[] | null };
let seedTexts: SeedChunk[] | null = null;
let seedVecsReady: Promise<SeedChunk[]> | null = null;

function buildSeedTexts(): SeedChunk[] {
  const out: SeedChunk[] = [];
  for (const a of seedData.articles as { slug: string; title: string; category: string; introducer: string; need: string[]; content: string[]; site: string[]; tip: string }[]) {
    const body = `عنوان: ${a.title} (${a.category})\nمقدمه: ${a.introducer}\nآموزش‌های لازم: ${a.need.join("؛ ")}\nتکنیک‌های تولید محتوا: ${a.content.join("؛ ")}\nتکنیک‌های ساخت سایت: ${a.site.join("؛ ")}\nنکتهٔ طلایی: ${a.tip}`;
    out.push(...chunkText(body, 1200, 150).map((c) => ({ content: c, title: `مقاله: ${a.title}`, vec: null })));
  }
  for (const b of seedData.businesses as { name: string; items: string[] }[]) {
    out.push({ content: `کسب‌وکار خانگی «${b.name}»: ${b.items.join("؛ ")}`, title: `کسب‌وکار: ${b.name}`, vec: null });
  }
  for (const e of seedData.episodes as { title: string; description: string }[]) {
    out.push({ content: `قسمت دوره — ${e.title}: ${e.description}`, title: `دوره: ${e.title}`, vec: null });
  }
  for (const v of seedData.videoScenarios as unknown as { name: string; title: string; hook: string; story: string[][]; veoPrompt: string }[]) {
    const story = v.story.map((s) => (Array.isArray(s) ? s.join(" — ") : String(s))).join(" | ");
    out.push(...chunkText(`سناریوی ویدیو «${v.name}» (${v.title})\nقلاب: ${v.hook}\nاستوری‌برد: ${story}\nپرامپت Veo: ${v.veoPrompt}`, 1200, 150)
      .map((c) => ({ content: c, title: `سناریو: ${v.name}`, vec: null })));
  }
  return out;
}

/** embedding قطعات seed — یک‌بار در حافظهٔ هر instance */
async function ensureSeedVecs(): Promise<SeedChunk[]> {
  if (!seedTexts) seedTexts = buildSeedTexts();
  if (seedTexts.every((s) => s.vec)) return seedTexts;
  if (!seedVecsReady) {
    seedVecsReady = (async () => {
      const missing = seedTexts!.map((s, i) => ({ s, i })).filter((x) => !x.s.vec);
      for (let i = 0; i < missing.length; i += 16) {
        const batch = missing.slice(i, i + 16);
        const vecs = await embedTexts(batch.map((x) => pPrefix(x.s.content)));
        batch.forEach((x, j) => { x.s.vec = vecs[j]; });
      }
      return seedTexts!;
    })().catch((e) => { seedVecsReady = null; throw e; });
  }
  return seedVecsReady;
}

function searchSeedHits(qVec: number[], k: number, minScore: number): SearchHit[] {
  if (!seedTexts) return [];
  return seedTexts
    .filter((s) => s.vec)
    .map((s) => ({ content: s.content, title: s.title, score: cosineSimilarity(qVec, s.vec!) }))
    .filter((h) => h.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/** تقسیم متن به قطعات با هم‌پوشانی (مناسب فارسی) */
export function chunkText(text: string, size = 1200, overlap = 200): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length) {
    let end = Math.min(i + size, clean.length);
    // تا نقطه/علامت سؤال نزدیک انتها بریم تا جمله نشکند
    if (end < clean.length) {
      const slice = clean.slice(i, end);
      const lastStop = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("؟"), slice.lastIndexOf("!"), slice.lastIndexOf("؛"));
      if (lastStop > size * 0.5) end = i + lastStop + 1;
    }
    const c = clean.slice(i, end).trim();
    if (c.length > 30) chunks.push(c);
    i = end - overlap > i ? end - overlap : end;
  }
  return chunks;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

/** افزودن سند + ساخت embedding قطعه‌ها (دسته‌های ۳۲تایی) */
export async function addDocument(params: {
  title: string;
  sourceType: "pdf" | "youtube" | "text";
  sourceRef?: string;
  text: string;
  uploadedBy?: number;
}): Promise<{ documentId: number; chunks: number }> {
  const chunks = chunkText(params.text);
  if (chunks.length === 0) throw new Error("متن قابل استخراجی پیدا نشد");

  const [doc] = await db
    .insert(aiDocuments)
    .values({
      title: params.title,
      sourceType: params.sourceType,
      sourceRef: params.sourceRef || null,
      chunkCount: chunks.length,
      uploadedBy: params.uploadedBy ?? null,
    })
    .returning({ id: aiDocuments.id });

  for (let s = 0; s < chunks.length; s += 32) {
    const batch = chunks.slice(s, s + 32);
    const vectors = await embedTexts(batch.map(pPrefix));
    await db.insert(aiChunks).values(
      batch.map((content, j) => ({
        documentId: doc.id,
        chunkIndex: s + j,
        content,
        embedding: JSON.stringify(vectors[j]),
      }))
    );
  }
  return { documentId: doc.id, chunks: chunks.length };
}

export type SearchHit = { content: string; title: string; score: number };

/** جستجوی معنایی: embedding پرسش + کسینوسی روی قطعه‌ها (دیتابیس؛ fallback: دانش آمادهٔ JSON) */
export async function searchChunks(query: string, k = 5, minScore = 0.25): Promise<SearchHit[]> {
  const [qVec] = await embedTexts([qPrefix(query)]);

  // اول: دیتابیس (اسناد آپلودی مدیر)
  let dbHits: SearchHit[] = [];
  try {
    const rows = await db
      .select({ content: aiChunks.content, embedding: aiChunks.embedding, title: aiDocuments.title })
      .from(aiChunks)
      .innerJoin(aiDocuments, eq(aiChunks.documentId, aiDocuments.id));
    for (const r of rows) {
      try {
        const score = cosineSimilarity(qVec, JSON.parse(r.embedding || "[]"));
        if (score >= minScore) dbHits.push({ content: r.content, title: r.title, score });
      } catch { /* نادیده بگیر */ }
    }
  } catch {
    dbHits = []; // دیتابیس هنوز وصل نیست (مثلاً قبل از Neon)
  }

  // دوم: دانش آمادهٔ سایت — همیشه در دسترس
  let seedHits: SearchHit[] = [];
  try {
    await ensureSeedVecs();
    seedHits = searchSeedHits(qVec, k, minScore);
  } catch (e) {
    console.error("seed knowledge error:", e);
  }

  return [...dbHits, ...seedHits]
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export const ASSISTANT_SYSTEM_PROMPT = `تو «مربی هوشمند دیجی‌آموزش» هستی؛ دستیار آموزشی فارسی‌زبانِ آکادمی کسب‌وکارهای خانگی با هوش مصنوعی.

قوانین:
۱. فقط فارسی و با لحنی گرم، صمیمی و تشویق‌کننده جواب بده (مثل یک مربی دلسوز برای خانم‌های خانه‌دار).
۲. پاسخ را فقط بر اساس «منابع آموزشی» زیر بده. اگر جواب در منابع نبود، صادقانه بگو «در منابع آموزشی نداریم» و یک راهنمایی کلی مرتبط پیشنهاد بده.
۳. پاسخ‌ها را کوتاه، عملی و مرحله‌ای بنویس؛ از بولت و ایموجی ملایم استفاده کن.
۴. اگر نام کاربر را می‌دانی، خطاب به اسم خودش حرف بزن.
۵. مثال‌ها را به کسب‌وکارهای خانگی (شیرینی، شمع‌سازی، خیاطی و...) و ابزارهای AI (جمینای، Veo) پیوند بزن.

منابع آموزشی:
{CONTEXT}`;

/** پاسخ نهایی RAG */
export async function answerWithRag(params: {
  question: string;
  history: ChatMessage[];
  userName?: string;
}): Promise<{ answer: string; sources: string[] }> {
  const hits = await searchChunks(params.question, 5);
  const context = hits.length
    ? hits.map((h, i) => `--- منبع ${i + 1}: «${h.title}» ---\n${h.content}`).join("\n\n")
    : "（منبعی در کتابخانهٔ دانش موجود نیست）";

  const system = ASSISTANT_SYSTEM_PROMPT.replace("{CONTEXT}", context) +
    (params.userName ? `\n\nنام کاربر: ${params.userName}` : "");

  const answer = await chatCompletion([
    { role: "system", content: system },
    ...params.history.slice(-6),
    { role: "user", content: params.question },
  ]);

  const sources = [...new Set(hits.map((h) => h.title))];
  return { answer, sources };
}

/** فهرست اسناد کتابخانهٔ دانش */
export async function listDocuments() {
  return db.select().from(aiDocuments).orderBy(desc(aiDocuments.createdAt));
}

export async function deleteDocument(id: number) {
  await db.delete(aiChunks).where(eq(aiChunks.documentId, id));
  await db.delete(aiDocuments).where(eq(aiDocuments.id, id));
}
