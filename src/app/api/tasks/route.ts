import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, users, projects, projectMembers } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc, or, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let tasksList;

    if (session.role === "admin" || session.role === "manager") {
      tasksList = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          priority: tasks.priority,
          dueDate: tasks.dueDate,
          projectId: tasks.projectId,
          projectTitle: projects.title,
          assignedTo: tasks.assignedTo,
          assigneeName: users.name,
          createdAt: tasks.createdAt,
        })
        .from(tasks)
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .leftJoin(users, eq(tasks.assignedTo, users.id))
        .orderBy(desc(tasks.createdAt));
    } else {
      tasksList = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          priority: tasks.priority,
          dueDate: tasks.dueDate,
          projectId: tasks.projectId,
          projectTitle: projects.title,
          assignedTo: tasks.assignedTo,
          assigneeName: users.name,
          createdAt: tasks.createdAt,
        })
        .from(tasks)
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .leftJoin(users, eq(tasks.assignedTo, users.id))
        .where(
          or(
            eq(tasks.assignedTo, session.userId),
            eq(projects.ownerId, session.userId)
          )
        )
        .orderBy(desc(tasks.createdAt));
    }

    return NextResponse.json({ tasks: tasksList });
  } catch (error) {
    console.error("Tasks GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت وظایف" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, title, description, assignedTo, priority, dueDate } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: "پروژه و عنوان وظیفه الزامی است" },
        { status: 400 }
      );
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        projectId,
        title,
        description,
        assignedTo: assignedTo || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning();

    // Create notification for assigned user
    if (assignedTo) {
      const [project] = await db
        .select({ title: projects.title })
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      await db.execute(sql`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (${assignedTo}, 'وظیفه جدید', ${`وظیفه "${title}" در پروژه "${project?.title}" به شما اختصاص داده شد`}, 'task')
      `);
    }

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json({ error: "خطا در ایجاد وظیفه" }, { status: 500 });
  }
}
