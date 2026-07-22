import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  users,
  projects,
  projectMembers,
  tasks,
  messages,
  payments,
  notifications,
  applications,
  trainingModules,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    // Clear existing data
    await db.execute(sql`DELETE FROM training_progress`);
    await db.delete(trainingModules);
    await db.delete(applications);
    await db.delete(notifications);
    await db.delete(messages);
    await db.delete(payments);
    await db.delete(tasks);
    await db.delete(projectMembers);
    await db.delete(projects);
    await db.delete(users);

    // Reset sequences
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE projects_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE tasks_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE messages_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE payments_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE notifications_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE project_members_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE applications_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE training_modules_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE training_progress_id_seq RESTART WITH 1`);

    const hashedPassword = await hashPassword("123456");

    // Create users
    const [admin] = await db
      .insert(users)
      .values({
        name: "علی محمدی",
        email: "admin@teamcoder.com",
        password: hashedPassword,
        role: "admin",
        phone: "09121234567",
        bio: "مدیر سیستم TeamCoder",
      })
      .returning();

    const [manager] = await db
      .insert(users)
      .values({
        name: "سارا احمدی",
        email: "manager@teamcoder.com",
        password: hashedPassword,
        role: "manager",
        phone: "09131234567",
        bio: "مدیر پروژه با ۵ سال تجربه",
      })
      .returning();

    const [dev1] = await db
      .insert(users)
      .values({
        name: "رضا کریمی",
        email: "dev@teamcoder.com",
        password: hashedPassword,
        role: "developer",
        phone: "09141234567",
        bio: "برنامه‌نویس فول‌استک - React و Node.js",
      })
      .returning();

    const [dev2] = await db
      .insert(users)
      .values({
        name: "مریم حسینی",
        email: "dev2@teamcoder.com",
        password: hashedPassword,
        role: "developer",
        bio: "برنامه‌نویس فرانت‌اند",
      })
      .returning();

    const [client] = await db
      .insert(users)
      .values({
        name: "حسن رضایی",
        email: "client@teamcoder.com",
        password: hashedPassword,
        role: "client",
        phone: "09151234567",
        bio: "کارفرما - شرکت فناوری نوین",
      })
      .returning();

    // Create projects
    const [project1] = await db
      .insert(projects)
      .values({
        title: "فروشگاه آنلاین",
        description: "طراحی و توسعه فروشگاه آنلاین با قابلیت پرداخت آنلاین، مدیریت محصولات و سبد خرید",
        budget: "50000000",
        status: "in_progress",
        ownerId: client.id,
        deadline: new Date("2024-06-01"),
      })
      .returning();

    const [project2] = await db
      .insert(projects)
      .values({
        title: "اپلیکیشن مدیریت مالی",
        description: "اپلیکیشن موبایل برای مدیریت هزینه‌ها و درآمدهای شخصی",
        budget: "35000000",
        status: "pending",
        ownerId: manager.id,
        deadline: new Date("2024-08-15"),
      })
      .returning();

    const [project3] = await db
      .insert(projects)
      .values({
        title: "وبسایت شرکتی",
        description: "طراحی وبسایت شرکتی مدرن با سیستم مدیریت محتوا",
        budget: "20000000",
        status: "completed",
        ownerId: client.id,
      })
      .returning();

    // Add project members
    await db.insert(projectMembers).values([
      { projectId: project1.id, userId: client.id, role: "owner" },
      { projectId: project1.id, userId: manager.id, role: "manager" },
      { projectId: project1.id, userId: dev1.id, role: "developer" },
      { projectId: project1.id, userId: dev2.id, role: "developer" },
      { projectId: project2.id, userId: manager.id, role: "owner" },
      { projectId: project2.id, userId: dev1.id, role: "developer" },
      { projectId: project3.id, userId: client.id, role: "owner" },
      { projectId: project3.id, userId: dev2.id, role: "developer" },
    ]);

    // Create tasks
    await db.insert(tasks).values([
      {
        projectId: project1.id,
        assignedTo: dev1.id,
        title: "طراحی صفحه اصلی",
        description: "طراحی و پیاده‌سازی صفحه اصلی فروشگاه",
        status: "done",
        priority: "high",
      },
      {
        projectId: project1.id,
        assignedTo: dev2.id,
        title: "سیستم سبد خرید",
        description: "پیاده‌سازی سبد خرید با قابلیت افزودن و حذف محصولات",
        status: "in_progress",
        priority: "high",
      },
      {
        projectId: project1.id,
        assignedTo: dev1.id,
        title: "سیستم پرداخت آنلاین",
        description: "اتصال به درگاه پرداخت و مدیریت تراکنش‌ها",
        status: "todo",
        priority: "urgent",
      },
      {
        projectId: project1.id,
        assignedTo: dev2.id,
        title: "پنل مدیریت محصولات",
        description: "ایجاد پنل مدیریت برای افزودن و ویرایش محصولات",
        status: "todo",
        priority: "medium",
      },
      {
        projectId: project2.id,
        assignedTo: dev1.id,
        title: "طراحی دیتابیس",
        description: "طراحی ساختار دیتابیس اپلیکیشن مالی",
        status: "in_progress",
        priority: "high",
      },
      {
        projectId: project2.id,
        assignedTo: dev1.id,
        title: "API گزارش‌های مالی",
        description: "پیاده‌سازی API برای تولید گزارش‌های مالی",
        status: "todo",
        priority: "medium",
      },
      {
        projectId: project3.id,
        assignedTo: dev2.id,
        title: "طراحی ریسپانسیو",
        description: "اطمینان از نمایش صحیح در تمام دستگاه‌ها",
        status: "done",
        priority: "medium",
      },
    ]);

    // Create messages
    await db.insert(messages).values([
      { senderId: manager.id, receiverId: dev1.id, content: "سلام رضا، پیشرفت صفحه اصلی چطوره؟" },
      { senderId: dev1.id, receiverId: manager.id, content: "سلام سارا، تقریباً تموم شده. تا فردا آماده می‌شه." },
      { senderId: manager.id, receiverId: dev1.id, content: "عالیه! لطفاً ریسپانسیو هم چک کن." },
      { senderId: client.id, receiverId: manager.id, content: "سلام، گزارش پیشرفت پروژه رو می‌خوام." },
      { senderId: manager.id, receiverId: client.id, content: "سلام، بله حتماً. تا امروز عصر براتون ارسال می‌کنم." },
      { senderId: dev2.id, receiverId: dev1.id, content: "رضا، API سبد خرید آماده‌ست. می‌تونی تست کنی." },
    ]);

    // Create payments
    await db.insert(payments).values([
      { projectId: project1.id, userId: dev1.id, amount: "15000000", status: "completed", description: "پیش‌پرداخت - فاز اول", paymentDate: new Date() },
      { projectId: project1.id, userId: dev2.id, amount: "10000000", status: "completed", description: "پیش‌پرداخت - فاز اول", paymentDate: new Date() },
      { projectId: project1.id, userId: dev1.id, amount: "10000000", status: "pending", description: "پرداخت فاز دوم" },
      { projectId: project3.id, userId: dev2.id, amount: "20000000", status: "completed", description: "پرداخت کامل پروژه وبسایت", paymentDate: new Date() },
    ]);

    // Create notifications
    await db.insert(notifications).values([
      { userId: dev1.id, title: "وظیفه جدید", message: "وظیفه \"طراحی صفحه اصلی\" به شما اختصاص داده شد", type: "task" },
      { userId: dev1.id, title: "پرداخت تکمیل شد", message: "پرداخت ۱۵,۰۰۰,۰۰۰ تومان برای پروژه فروشگاه آنلاین انجام شد", type: "payment" },
      { userId: manager.id, title: "پیام جدید", message: "پیام جدید از حسن رضایی", type: "message" },
      { userId: dev2.id, title: "پروژه جدید", message: "شما به پروژه \"فروشگاه آنلاین\" اضافه شدید", type: "project" },
    ]);

    // Create training modules
    await db.insert(trainingModules).values([
      {
        title: "آموزش ساخت ریلز اینستاگرام",
        description: "اصول پایه ساخت ریلز: نورپردازی، زاویه دوربین و ترکیب‌بندی",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        platform: "youtube",
        durationMinutes: 15,
        orderIndex: 1,
      },
      {
        title: "تدوین ساده با موبایل",
        description: "آموزش تدوین ویدیو با اپلیکیشن‌های رایگان موبایل",
        videoUrl: "https://www.youtube.com/watch?v=example2",
        platform: "youtube",
        durationMinutes: 20,
        orderIndex: 2,
      },
      {
        title: "کپشن‌نویسی و هشتگ‌گذاری",
        description: "نحوه نوشتن کپشن جذاب و استفاده از هشتگ‌های موثر",
        videoUrl: "https://www.youtube.com/watch?v=example3",
        platform: "youtube",
        durationMinutes: 10,
        orderIndex: 3,
      },
      {
        title: "ترندهای روز اینستاگرام",
        description: "آشنایی با ترندهای فعلی و نحوه استفاده از آن‌ها",
        videoUrl: "https://www.youtube.com/watch?v=example4",
        platform: "youtube",
        durationMinutes: 12,
        orderIndex: 4,
      },
    ]);

    // Create sample applications
    await db.insert(applications).values([
      {
        fullName: "نیلوفر محمدی",
        email: "niloofar@example.com",
        phone: "09121112233",
        age: 21,
        city: "تهران",
        instagramHandle: "@niloofar_creates",
        hasActivePage: true,
        hasReelsExperience: true,
        canWorkWithFriends: true,
        portfolioLinks: JSON.stringify(["https://instagram.com/reel/sample1", "https://instagram.com/reel/sample2"]),
        motivationText: "عاشق تولید محتوا هستم و ۲ سال تجربه دارم",
        skillsDescription: "تدوین با CapCut، فیلم‌برداری با آیفون، اجرا جلوی دوربین",
        status: "submitted",
      },
      {
        fullName: "امیرحسین رضایی",
        email: "amir@example.com",
        phone: "09133334455",
        age: 19,
        city: "اصفهان",
        instagramHandle: "@amir.reels",
        hasActivePage: true,
        hasReelsExperience: false,
        canWorkWithFriends: true,
        portfolioLinks: JSON.stringify(["https://instagram.com/reel/sample3"]),
        motivationText: "می‌خوام وارد دنیای تولید محتوا بشم",
        skillsDescription: "عکاسی، آشنایی با Lightroom",
        status: "portfolio_review",
      },
      {
        fullName: "زهرا کریمی",
        email: "zahra@example.com",
        phone: "09145556677",
        age: 23,
        city: "شیراز",
        instagramHandle: "@zahra.life",
        hasActivePage: true,
        hasReelsExperience: true,
        canWorkWithFriends: true,
        portfolioLinks: JSON.stringify(["https://instagram.com/reel/sample4", "https://instagram.com/reel/sample5"]),
        motivationText: "ترجیح می‌دم با تیم کار کنم تا پیشرفت کنم",
        skillsDescription: "تدوین با Premiere Pro، فیلم‌برداری حرفه‌ای",
        status: "training",
        trainingAssignedAt: new Date(),
        trainingDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "داده‌های نمونه با موفقیت ایجاد شد",
      users: [
        { email: "admin@teamcoder.com", password: "123456", role: "admin" },
        { email: "manager@teamcoder.com", password: "123456", role: "manager" },
        { email: "dev@teamcoder.com", password: "123456", role: "developer" },
        { email: "client@teamcoder.com", password: "123456", role: "client" },
      ],
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد داده‌های نمونه", details: String(error) },
      { status: 500 }
    );
  }
}
