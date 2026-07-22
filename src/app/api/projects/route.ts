import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectMembers, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc, and, or, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let projectsList;

    if (session.role === "admin" || session.role === "manager") {
      // Admins and managers see all projects
      projectsList = await db
        .select({
          id: projects.id,
          title: projects.title,
          description: projects.description,
          budget: projects.budget,
          status: projects.status,
          deadline: projects.deadline,
          createdAt: projects.createdAt,
          ownerName: users.name,
          ownerId: projects.ownerId,
        })
        .from(projects)
        .leftJoin(users, eq(projects.ownerId, users.id))
        .orderBy(desc(projects.createdAt));
    } else {
      // Others see only their projects (owned or member)
      projectsList = await db
        .selectDistinct({
          id: projects.id,
          title: projects.title,
          description: projects.description,
          budget: projects.budget,
          status: projects.status,
          deadline: projects.deadline,
          createdAt: projects.createdAt,
          ownerName: users.name,
          ownerId: projects.ownerId,
        })
        .from(projects)
        .leftJoin(users, eq(projects.ownerId, users.id))
        .leftJoin(projectMembers, eq(projects.id, projectMembers.projectId))
        .where(
          or(
            eq(projects.ownerId, session.userId),
            eq(projectMembers.userId, session.userId)
          )
        )
        .orderBy(desc(projects.createdAt));
    }

    // Get member counts for each project
    const projectsWithCounts = await Promise.all(
      projectsList.map(async (project) => {
        const memberCount = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(projectMembers)
          .where(eq(projectMembers.projectId, project.id));

        const taskCounts = await db.execute(sql`
          SELECT 
            COUNT(*)::int as total,
            COUNT(*) FILTER (WHERE status = 'done')::int as completed
          FROM tasks 
          WHERE project_id = ${project.id}
        `);

        return {
          ...project,
          memberCount: memberCount[0]?.count || 0,
          taskTotal: (taskCounts.rows[0] as Record<string, number>)?.total || 0,
          taskCompleted: (taskCounts.rows[0] as Record<string, number>)?.completed || 0,
        };
      })
    );

    return NextResponse.json({ projects: projectsWithCounts });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت پروژه‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "developer") {
      return NextResponse.json({ error: "برنامه‌نویسان نمی‌توانند پروژه ایجاد کنند" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, budget, deadline } = body;

    if (!title) {
      return NextResponse.json({ error: "عنوان پروژه الزامی است" }, { status: 400 });
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        title,
        description,
        budget: budget ? String(budget) : null,
        ownerId: session.userId,
        deadline: deadline ? new Date(deadline) : null,
      })
      .returning();

    // Add owner as a project member
    await db.insert(projectMembers).values({
      projectId: newProject.id,
      userId: session.userId,
      role: "owner",
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "خطا در ایجاد پروژه" }, { status: 500 });
  }
}
