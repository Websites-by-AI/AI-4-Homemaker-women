import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai";
import { answerWithRag } from "@/lib/rag";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "برای گفت‌وگو با مربی هوشمند ابتدا وارد شوید" }, { status: 401 });
  }

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
        "سلام! 🌸 من مربی هوشمند دیجی‌آموزش هستم. فعلاً کلید OpenRouter تنظیم نشده، " +
        "به‌همین خاطر در حالت نمایشی‌ام. وقتی مدیر سایت متغیر OPENROUTER_API_KEY را در Vercel اضافه کند، " +
        "بر اساس PDFها و ویدیوهای آموزشیِ کتابخانهٔ دانش، شخصی‌سازی‌شده جوابت را می‌دهم! 🤖",
      sources: [],
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
      userName: session.name,
    });
    return NextResponse.json({ answer, sources });
  } catch (e) {
    console.error("AI chat error:", e);
    return NextResponse.json(
      { error: "مربی هوشمند فعلاً در دسترس نیست؛ کمی بعد دوباره تلاش کن 🙏" },
      { status: 502 }
    );
  }
}
