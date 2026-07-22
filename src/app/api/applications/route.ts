import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, trainingModules, trainingProgress } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin" && session.role !== "manager") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const apps = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));

    // Get training progress stats for each application
    const appsWithProgress = await Promise.all(
      apps.map(async (app) => {
        const totalModules = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(trainingModules)
          .where(sql`${trainingModules.isActive} = true`);

        const completedModules = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(trainingProgress)
          .where(
            sql`${trainingProgress.applicationId} = ${app.id} AND ${trainingProgress.isCompleted} = true`
          );

        return {
          ...app,
          totalModules: totalModules[0]?.count || 0,
          completedModules: completedModules[0]?.count || 0,
        };
      })
    );

    return NextResponse.json({ applications: appsWithProgress });
  } catch (error) {
    console.error("Applications GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت درخواست‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      age,
      city,
      instagramHandle,
      hasActivePage,
      hasReelsExperience,
      canWorkWithFriends,
      portfolioLinks,
      sampleVideoUrls,
      motivationText,
      skillsDescription,
    } = body;

    // Validation
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "نام، ایمیل و شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await db.execute(sql`
      SELECT id FROM applications WHERE email = ${email} LIMIT 1
    `);

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "شما قبلاً درخواست همکاری ثبت کرده‌اید" },
        { status: 409 }
      );
    }

    const [newApp] = await db
      .insert(applications)
      .values({
        fullName,
        email,
        phone,
        age: age ? parseInt(age) : null,
        city,
        instagramHandle,
        hasActivePage: hasActivePage || false,
        hasReelsExperience: hasReelsExperience || false,
        canWorkWithFriends: canWorkWithFriends || false,
        portfolioLinks: portfolioLinks ? JSON.stringify(portfolioLinks) : null,
        sampleVideoUrls: sampleVideoUrls ? JSON.stringify(sampleVideoUrls) : null,
        motivationText,
        skillsDescription,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "درخواست همکاری شما با موفقیت ثبت شد. به زودی بررسی خواهد شد.",
        application: { id: newApp.id, status: newApp.status },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Applications POST error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت درخواست" },
      { status: 500 }
    );
  }
}
