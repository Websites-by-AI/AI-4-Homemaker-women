import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listDocuments, deleteDocument } from "@/lib/rag";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const docs = await listDocuments();
  return NextResponse.json({ documents: docs });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "manager")) {
    return NextResponse.json({ error: "فقط مدیر می‌تواند سند حذف کند" }, { status: 403 });
  }
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "شناسهٔ سند نامعتبر است" }, { status: 400 });
  }
  await deleteDocument(id);
  return NextResponse.json({ ok: true });
}
