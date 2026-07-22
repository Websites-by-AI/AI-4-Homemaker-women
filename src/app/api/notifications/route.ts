import { NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    const unreadCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        sql`${notifications.userId} = ${session.userId} AND ${notifications.isRead} = false`
      );

    return NextResponse.json({
      notifications: notifs,
      unreadCount: unreadCount[0]?.count || 0,
    });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت اعلان‌ها" }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark all as read
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, session.userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications PUT error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی اعلان‌ها" }, { status: 500 });
  }
}
