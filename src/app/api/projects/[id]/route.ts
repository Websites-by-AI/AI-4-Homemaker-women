import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectMembers, users, tasks } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const projectId = parseInt(id);

    const [project] = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        budget: projects.budget,
        status: projects.status,
        deadline: projects.deadline,
        createdAt: projects.createdAt,
        ownerId: projects.ownerId,
        ownerName: users.name,
        ownerEmail: users.email,
      })
      .from(projects)
      .leftJoin(users, eq(projects.ownerId, users.id))
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "پروژه یافت نشد" }, { status: 404 });
    }

    // Get project members
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: projectMembers.role,
        avatar: users.avatar,
        userRole: users.role,
      })
      .from(projectMembers)
      .leftJoin(users, eq(projectMembers.userId, users.id))
      .where(eq(projectMembers.projectId, projectId));

    // Get project tasks
    const projectTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
        assignedTo: tasks.assignedTo,
        assigneeName: users.name,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(eq(tasks.projectId, projectId));

    return NextResponse.json({ project, members, tasks: projectTasks });
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت پروژه" }, { status: 500 });
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

    const { id } = await params;
    const projectId = parseInt(id);
    const body = await request.json();

    // Check permission
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "پروژه یافت نشد" }, { status: 404 });
    }

    if (project.ownerId !== session.userId && session.role !== "admin" && session.role !== "manager") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const [updated] = await db
      .update(projects)
      .set({
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("Project PUT error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی پروژه" }, { status: 500 });
  }
}

export async function DELETE(
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
    const projectId = parseInt(id);

    await db.delete(projects).where(eq(projects.id, projectId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json({ error: "خطا در حذف پروژه" }, { status: 500 });
  }
}
