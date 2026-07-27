import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai";
import { answerWithRag } from "@/lib/rag";
import { suggestYoutubeVideos } from "@/lib/youtube-suggestions";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getSession().catch(() => null);

  let body: { message?: string; history?: { role: "user" | "assistant"; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
  }

  const message = (body.message || "").trim();
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "متن پرسش معتبر نیست (حداکثر ۲۰۰۰ نویسه)" }, { status: 400 });
  }

  if (!aiConfigured()) {
    return NextResponse.json({
      demo: true,
      answer:
        "سلام! 🌸 من مربی هوشمند دیجی‌آموزش هستم. فعلاً موتور هوش مصنوعی وصل نشده (کلید OPENROUTER_API_KEY یا HF_TOKEN لازم است)، " +
        "به‌همین خاطر در حالت نمایشی‌ام. بعد از اتصال، بر اساس PDFها، ویدیوها و مقالات آموزشی، قدم‌به‌قدم جوابت می‌دهم! 🤖",
      sources: [],
      videos: suggestYoutubeVideos(message, []),
    });
  }

  try {
    const history = Array.isArray(body.history)
      ? body.history
          .filter((h) => (h.role === "user" || h.role === "assistant") && typeof h.content === "string")
          .slice(-6)
      : [];
    const { answer, sources } = await answerWithRag({
      question: message,
      history,
      userName: session?.name,
      userId: session?.userId,
    });
    return NextResponse.json({
      answer,
      sources,
      videos: suggestYoutubeVideos(message, sources),
    });
  } catch (e) {
    console.error("AI chat error:", e);
    return NextResponse.json(
      { error: "مربی هوشمند فعلاً در دسترس نیست؛ کمی بعد دوباره تلاش کن 🙏" },
      { status: 502 }
    );
  }
}
