import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, trainingModules, trainingProgress } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin" && session.role !== "manager") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const appId = parseInt(id);

    const [app] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, appId))
      .limit(1);

    if (!app) {
      return NextResponse.json({ error: "درخواست یافت نشد" }, { status: 404 });
    }

    // Get training modules with progress for this application
    const modules = await db
      .select({
        id: trainingModules.id,
        title: trainingModules.title,
        description: trainingModules.description,
        videoUrl: trainingModules.videoUrl,
        platform: trainingModules.platform,
        durationMinutes: trainingModules.durationMinutes,
        orderIndex: trainingModules.orderIndex,
        isCompleted: sql<boolean>`COALESCE(${trainingProgress.isCompleted}, false)`,
        completedAt: trainingProgress.completedAt,
      })
      .from(trainingModules)
      .leftJoin(
        trainingProgress,
        sql`${trainingModules.id} = ${trainingProgress.moduleId} AND ${trainingProgress.applicationId} = ${appId}`
      )
      .where(sql`${trainingModules.isActive} = true`)
      .orderBy(trainingModules.orderIndex);

    return NextResponse.json({ application: app, trainingModules: modules });
  } catch (error) {
    console.error("Application GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت اطلاعات" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin" && session.role !== "manager") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const appId = parseInt(id);
    const body = await request.json();

    const now = new Date();

    // Build update data based on status transitions
    const updateData: Record<string, unknown> = {
      status: body.status,
      reviewNotes: body.reviewNotes,
      reviewedBy: session.userId,
      updatedAt: now,
    };

    // Handle status-specific transitions
    if (body.status === "training") {
      updateData.trainingAssignedAt = now;
      // Set deadline to 24 hours from now
      const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      updateData.trainingDeadline = deadline;

      // Create training progress records for all active modules
      const modules = await db
        .select({ id: trainingModules.id })
        .from(trainingModules)
        .where(eq(trainingModules.isActive, true));

      for (const mod of modules) {
        // Check if progress already exists
        const existing = await db.execute(sql`
          SELECT id FROM training_progress 
          WHERE application_id = ${appId} AND module_id = ${mod.id}
          LIMIT 1
        `);

        if (existing.rows.length === 0) {
          await db.insert(trainingProgress).values({
            applicationId: appId,
            moduleId: mod.id,
          });
        }
      }
    }

    if (body.status === "test_project") {
      updateData.testProjectAssignedAt = now;
      const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      updateData.testProjectDeadline = deadline;
    }

    const [updated] = await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, appId))
      .returning();

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error("Application PUT error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی درخواست" }, { status: 500 });
  }
}
