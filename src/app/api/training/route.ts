import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainingModules, trainingProgress } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const modules = await db
      .select()
      .from(trainingModules)
      .where(eq(trainingModules.isActive, true))
      .orderBy(trainingModules.orderIndex);

    return NextResponse.json({ modules });
  } catch (error) {
    console.error("Training GET error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin" && session.role !== "manager") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, videoUrl, platform, durationMinutes } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "عنوان و لینک ویدیو الزامی است" },
        { status: 400 }
      );
    }

    // Get max order index
    const maxOrder = await db.execute(sql`
      SELECT COALESCE(MAX(order_index), 0) + 1 as next_order 
      FROM training_modules
    `);
    const nextOrder = (maxOrder.rows[0] as Record<string, number>)?.next_order || 1;

    const [newModule] = await db
      .insert(trainingModules)
      .values({
        title,
        description,
        videoUrl,
        platform: platform || "youtube",
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
        orderIndex: nextOrder,
      })
      .returning();

    return NextResponse.json({ module: newModule }, { status: 201 });
  } catch (error) {
    console.error("Training POST error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

// Mark a training module as complete for an application
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, moduleId } = body;

    if (!applicationId || !moduleId) {
      return NextResponse.json(
        { error: "شناسه درخواست و ماژول الزامی است" },
        { status: 400 }
      );
    }

    await db
      .update(trainingProgress)
      .set({
        isCompleted: true,
        completedAt: new Date(),
      })
      .where(
        and(
          eq(trainingProgress.applicationId, applicationId),
          eq(trainingProgress.moduleId, moduleId)
        )
      );

    // Check if all modules are completed
    const totalModules = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(trainingModules)
      .where(eq(trainingModules.isActive, true));

    const completedModules = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(trainingProgress)
      .where(
        and(
          eq(trainingProgress.applicationId, applicationId),
          eq(trainingProgress.isCompleted, true)
        )
      );

    const allDone =
      (totalModules[0]?.count || 0) > 0 &&
      totalModules[0]?.count === completedModules[0]?.count;

    if (allDone) {
      await db.execute(sql`
        UPDATE applications 
        SET training_completed_at = NOW(), updated_at = NOW()
        WHERE id = ${applicationId}
      `);
    }

    return NextResponse.json({
      success: true,
      allTrainingCompleted: allDone,
    });
  } catch (error) {
    console.error("Training PUT error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
