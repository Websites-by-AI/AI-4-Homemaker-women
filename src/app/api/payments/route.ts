import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payments, projects, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let paymentsList;

    if (session.role === "admin" || session.role === "manager") {
      paymentsList = await db
        .select({
          id: payments.id,
          amount: payments.amount,
          status: payments.status,
          description: payments.description,
          paymentDate: payments.paymentDate,
          createdAt: payments.createdAt,
          projectId: payments.projectId,
          projectTitle: projects.title,
          userId: payments.userId,
          userName: users.name,
        })
        .from(payments)
        .leftJoin(projects, eq(payments.projectId, projects.id))
        .leftJoin(users, eq(payments.userId, users.id))
        .orderBy(desc(payments.createdAt));
    } else {
      paymentsList = await db
        .select({
          id: payments.id,
          amount: payments.amount,
          status: payments.status,
          description: payments.description,
          paymentDate: payments.paymentDate,
          createdAt: payments.createdAt,
          projectId: payments.projectId,
          projectTitle: projects.title,
          userId: payments.userId,
          userName: users.name,
        })
        .from(payments)
        .leftJoin(projects, eq(payments.projectId, projects.id))
        .leftJoin(users, eq(payments.userId, users.id))
        .where(eq(payments.userId, session.userId))
        .orderBy(desc(payments.createdAt));
    }

    return NextResponse.json({ payments: paymentsList });
  } catch (error) {
    console.error("Payments GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت پرداخت‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin" && session.role !== "manager" && session.role !== "client") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const { projectId, userId, amount, description } = body;

    if (!projectId || !userId || !amount) {
      return NextResponse.json(
        { error: "پروژه، کاربر و مبلغ الزامی است" },
        { status: 400 }
      );
    }

    const [newPayment] = await db
      .insert(payments)
      .values({
        projectId,
        userId,
        amount: String(amount),
        description,
      })
      .returning();

    // Notify user
    await db.execute(sql`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (${userId}, 'پرداخت جدید', ${`پرداخت ${amount} تومان برای شما ثبت شد`}, 'payment')
    `);

    return NextResponse.json({ payment: newPayment }, { status: 201 });
  } catch (error) {
    console.error("Payments POST error:", error);
    return NextResponse.json({ error: "خطا در ثبت پرداخت" }, { status: 500 });
  }
}
