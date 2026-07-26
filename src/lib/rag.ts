/**
 * RAG engine — بازیابی دانش از اسناد آموزشی (PDF / یوتیوب / متن)
 * ذخیره: جدول ai_chunks در Neon (embedding به‌صورت JSON)
 * شباهت: کسینوسی در JS — سبک، قابل حمل، نیازی به pgvector extension ندارد.
 * نکتهٔ رشد: اگر تعداد قطعات از ~۱۰٬۰۰۰ گذشت، مهاجرت به pgvector (CREATE EXTENSION vector در Neon) توصیه می‌شود.
 */

import { db } from "@/db";
import { aiDocuments, aiChunks } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { embedTexts, chatCompletion, type ChatMessage } from "@/lib/ai";

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
    const vectors = await embedTexts(batch);
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

/** جستجوی معنایی: embedding پرسش + شباهت کسینوسی روی همهٔ قطعه‌ها */
export async function searchChunks(query: string, k = 5, minScore = 0.25): Promise<SearchHit[]> {
  const [qVec] = await embedTexts([query]);
  const rows = await db
    .select({ content: aiChunks.content, embedding: aiChunks.embedding, title: aiDocuments.title })
    .from(aiChunks)
    .innerJoin(aiDocuments, eq(aiChunks.documentId, aiDocuments.id));

  const hits: SearchHit[] = [];
  for (const r of rows) {
    try {
      const score = cosineSimilarity(qVec, JSON.parse(r.embedding || "[]"));
      if (score >= minScore) hits.push({ content: r.content, title: r.title, score });
    } catch {
      /* نادیده بگیر */
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
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
