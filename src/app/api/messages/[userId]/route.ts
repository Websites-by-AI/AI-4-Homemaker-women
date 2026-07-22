import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, or, asc, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const contactId = parseInt(userId);

    // Get messages between two users
    const chatMessages = await db
      .select({
        id: messages.id,
        content: messages.content,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, session.userId),
            eq(messages.receiverId, contactId)
          ),
          and(
            eq(messages.senderId, contactId),
            eq(messages.receiverId, session.userId)
          )
        )
      )
      .orderBy(asc(messages.createdAt));

    // Mark messages as read
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.senderId, contactId),
          eq(messages.receiverId, session.userId),
          eq(messages.isRead, false)
        )
      );

    // Get contact info
    const [contact] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, contactId))
      .limit(1);

    return NextResponse.json({ messages: chatMessages, contact });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت پیام‌ها" }, { status: 500 });
  }
}
