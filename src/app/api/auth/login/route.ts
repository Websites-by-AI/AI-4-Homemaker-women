import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, signToken } from "@/lib/auth";
import { DEMO_PASSWORD, findDemoAccount, hasRealDatabase } from "@/lib/demo";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    if (!hasRealDatabase()) {
      const demoUser = findDemoAccount(email, password);
      if (!demoUser) {
        return NextResponse.json(
          { error: `در حالت دمو فقط حساب‌های نمایشی با رمز ${DEMO_PASSWORD} فعال هستند` },
          { status: 401 }
        );
      }

      const token = await signToken({
        userId: demoUser.userId,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name,
      });

      const response = NextResponse.json({
        demo: true,
        message: "ورود نمایشی با موفقیت انجام شد",
        user: {
          id: demoUser.userId,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          avatar: null,
        },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "خطا در ورود" },
      { status: 500 }
    );
  }
}
