import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aiLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const isAdmin = (r?: string) => r === "admin" || r === "manager";

/** GET — آمار کلی (admin) */
export async function GET() {
  const session = await getSession().catch(() => null);
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "فقط مدیر" }, { status: 403 });
  }
  try {
    const rows = await db.select().from(aiLogs).orderBy(desc(aiLogs.createdAt)).limit(200);
    return NextResponse.json({ count: rows.length, logs: rows });
  } catch {
    return NextResponse.json({ error: "دیتابیس در دسترس نیست" }, { status: 503 });
  }
}

/** POST {format:"jsonl"} — خروجی دیتاست پرسش‌وپاسخ (برای W&B Artifact / fine-tune) */
export async function POST(req: NextRequest) {
  const session = await getSession().catch(() => null);
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: "فقط مدیر" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  if (body?.format !== "jsonl") {
    return NextResponse.json({ error: 'format باید "jsonl" باشد' }, { status: 400 });
  }
  try {
    const rows = await db.select().from(aiLogs).orderBy(desc(aiLogs.createdAt)).limit(5000);
    const jsonl = rows
      .filter((r) => r.answer)
      .map((r) =>
        JSON.stringify({
          ts: r.createdAt,
          question: r.question,
          answer: r.answer,
          sources: JSON.parse(r.sources || "[]"),
          scores: JSON.parse(r.scores || "[]"),
          backend: r.backend,
          latency_ms: r.latencyMs,
        })
      )
      .join("\n");
    return new Response(jsonl + "\n", {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Content-Disposition": 'attachment; filename="digiamoozesh-qa-dataset.jsonl"',
      },
    });
  } catch {
    return NextResponse.json({ error: "دیتابیس در دسترس نیست" }, { status: 503 });
  }
}
