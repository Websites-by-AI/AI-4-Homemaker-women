import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, signToken } from "@/lib/auth";
import { buildDemoAccountFromRegister, hasRealDatabase } from "@/lib/demo";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role = "client" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "نام، ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    if (!hasRealDatabase()) {
      const demoUser = buildDemoAccountFromRegister({ name, email, role });
      const token = await signToken({
        userId: demoUser.userId,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name,
      });

      const response = NextResponse.json({
        demo: true,
        message: "ثبت‌نام نمایشی انجام شد. برای ثبت‌نام دائمی کافی است DATABASE_URL واقعی را در Vercel اضافه کنیم.",
        user: {
          id: demoUser.userId,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
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

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: role as "admin" | "manager" | "developer" | "client",
      })
      .returning();

    const token = await signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت‌نام" },
      { status: 500 }
    );
  }
}
