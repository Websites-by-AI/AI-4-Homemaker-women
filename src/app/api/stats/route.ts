import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects, tasks, users, payments, messages } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { demoStatsFor, hasRealDatabase } from "@/lib/demo";
import { sql, eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasRealDatabase()) {
      return NextResponse.json({
        demo: true,
        ...demoStatsFor(session.role),
      });
    }

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      totalUsers,
      totalPayments,
      unreadMessages,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(projects),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(sql`${projects.status} IN ('in_progress', 'review')`),
      db.select({ count: sql<number>`count(*)::int` }).from(tasks),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(eq(tasks.status, "done")),
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db
        .select({
          total: sql<string>`COALESCE(SUM(amount::numeric), 0)::text`,
        })
        .from(payments)
        .where(eq(payments.status, "completed")),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(messages)
        .where(
          and(
            eq(messages.receiverId, session.userId),
            eq(messages.isRead, false)
          )
        ),
    ]);

    const recentProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        status: projects.status,
        deadline: projects.deadline,
      })
      .from(projects)
      .orderBy(sql`${projects.createdAt} DESC`)
      .limit(5);

    const myTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        status: tasks.status,
        priority: tasks.priority,
        projectTitle: projects.title,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(tasks.assignedTo, session.userId))
      .orderBy(sql`${tasks.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      stats: {
        totalProjects: totalProjects[0]?.count || 0,
        activeProjects: activeProjects[0]?.count || 0,
        totalTasks: totalTasks[0]?.count || 0,
        completedTasks: completedTasks[0]?.count || 0,
        totalUsers: totalUsers[0]?.count || 0,
        totalPayments: totalPayments[0]?.total || "0",
        unreadMessages: unreadMessages[0]?.count || 0,
      },
      recentProjects,
      myTasks,
    });
  } catch (error) {
    console.error("Stats GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت آمار" }, { status: 500 });
  }
}
