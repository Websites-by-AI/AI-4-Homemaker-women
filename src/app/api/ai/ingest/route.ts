import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai";
import { addDocument } from "@/lib/rag";
import pdfParse from "@/lib/pdf";
import { YoutubeTranscript } from "youtube-transcript";
import { hasRealDatabase } from "@/lib/demo";

export const runtime = "nodejs";
export const maxDuration = 60;

function isAdmin(role?: string) {
  return role === "admin" || role === "manager";
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "فقط مدیر می‌تواند سند آموزشی اضافه کند" }, { status: 403 });
  }
  if (!aiConfigured()) {
    return NextResponse.json(
      { error: "ابتدا کلید OPENROUTER_API_KEY یا HF_TOKEN را در تنظیمات Vercel اضافه کنید" },
      { status: 503 }
    );
  }
  if (!hasRealDatabase()) {
    return NextResponse.json(
      { error: "برای ذخیره و جست‌وجوی PDF و یوتیوبِ اختصاصی، ابتدا DATABASE_URL واقعی را در Vercel اضافه کنید" },
      { status: 503 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // ── الف) آپلود PDF ──
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "فایل PDF ارسال نشد" }, { status: 400 });
      }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ error: "فقط فایل PDF قابل قبول است" }, { status: 400 });
      }
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json({ error: "حجم PDF باید کمتر از ۸ مگابایت باشد" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const parsed = await pdfParse(buffer);
      const title = (form.get("title") as string) || file.name.replace(/\.pdf$/i, "");
      const result = await addDocument({
        title,
        sourceType: "pdf",
        sourceRef: file.name,
        text: parsed.text,
        uploadedBy: session.userId,
      });
      return NextResponse.json({ ok: true, title, ...result });
    }

    // ── ب) یوتیوب یا متن خام ──
    const body = await req.json().catch(() => null) as {
      type?: string; url?: string; text?: string; title?: string;
    } | null;
    if (!body?.type) {
      return NextResponse.json({ error: "فرمت درخواست نامعتبر است" }, { status: 400 });
    }

    if (body.type === "youtube") {
      if (!body.url || !/youtu\.?be/.test(body.url)) {
        return NextResponse.json({ error: "لینک یوتیوب معتبر نیست" }, { status: 400 });
      }
      const transcript = await YoutubeTranscript.fetchTranscript(body.url).catch(() => null);
      if (!transcript || transcript.length === 0) {
        return NextResponse.json({ error: "زیرنویس/ترنسکرایپت برای این ویدیو پیدا نشد" }, { status: 404 });
      }
      const text = transcript.map((t) => t.text).join(" ");
      const title = body.title || `ویدیوی یوتیوب: ${body.url.slice(-20)}`;
      const result = await addDocument({
        title,
        sourceType: "youtube",
        sourceRef: body.url,
        text,
        uploadedBy: session.userId,
      });
      return NextResponse.json({ ok: true, title, ...result });
    }

    if (body.type === "text") {
      if (!body.text || body.text.trim().length < 100 || !body.title) {
        return NextResponse.json({ error: "عنوان و متن (حداقل ۱۰۰ نویسه) لازم است" }, { status: 400 });
      }
      const result = await addDocument({
        title: body.title.trim(),
        sourceType: "text",
        text: body.text,
        uploadedBy: session.userId,
      });
      return NextResponse.json({ ok: true, title: body.title.trim(), ...result });
    }

    return NextResponse.json({ error: "نوع سند پشتیبانی نمی‌شود" }, { status: 400 });
  } catch (e) {
    console.error("Ingest error:", e);
    return NextResponse.json({ error: "خطا در پردازش سند؛ دوباره تلاش کنید" }, { status: 500 });
  }
}
