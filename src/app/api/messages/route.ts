import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, or, and, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get conversations (latest message per contact)
    const conversations = await db.execute(sql`
      WITH ranked_messages AS (
        SELECT 
          m.*,
          CASE 
            WHEN m.sender_id = ${session.userId} THEN m.receiver_id
            ELSE m.sender_id
          END as contact_id,
          ROW_NUMBER() OVER (
            PARTITION BY 
              CASE 
                WHEN m.sender_id = ${session.userId} THEN m.receiver_id
                ELSE m.sender_id
              END
            ORDER BY m.created_at DESC
          ) as rn
        FROM messages m
        WHERE m.sender_id = ${session.userId} OR m.receiver_id = ${session.userId}
      )
      SELECT 
        rm.id,
        rm.content,
        rm.created_at,
        rm.is_read,
        rm.sender_id,
        rm.receiver_id,
        rm.contact_id,
        u.name as contact_name,
        u.email as contact_email,
        u.avatar as contact_avatar,
        u.role as contact_role,
        (SELECT COUNT(*) FROM messages 
         WHERE sender_id = rm.contact_id 
         AND receiver_id = ${session.userId} 
         AND is_read = false)::int as unread_count
      FROM ranked_messages rm
      JOIN users u ON u.id = rm.contact_id
      WHERE rm.rn = 1
      ORDER BY rm.created_at DESC
    `);

    return NextResponse.json({ conversations: conversations.rows });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت پیام‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "گیرنده و متن پیام الزامی است" },
        { status: 400 }
      );
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        senderId: session.userId,
        receiverId,
        content,
      })
      .returning();

    // Create notification for receiver
    await db.execute(sql`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (${receiverId}, 'پیام جدید', ${`پیام جدید از ${session.name}`}, 'message')
    `);

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "خطا در ارسال پیام" }, { status: 500 });
  }
}
