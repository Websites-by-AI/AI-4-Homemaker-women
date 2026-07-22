import { NextResponse } from "next/server";
import { db } from "@/db";
import { businessCategories } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(businessCategories)
      .where(eq(businessCategories.isActive, true))
      .orderBy(businessCategories.sortOrder);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Business categories GET error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

export async function POST() {
  // Seed business categories
  try {
    const existing = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(businessCategories);

    if ((existing[0]?.count || 0) > 0) {
      return NextResponse.json({ message: "قبلاً ایجاد شده" });
    }

    const data = [
      {
        name: "شیرینی، کیک و دسر خانگی",
        icon: "🎂",
        description: "پخت شیرینی، کیک تولد، دسر و شیرینی‌های سنتی در خانه و فروش آنلاین",
        difficulty: "easy",
        startupCost: "کم (۵۰۰ هزار تا ۲ میلیون تومان)",
        monthlyIncome: "۳ تا ۱۵ میلیون تومان",
        skillsNeeded: JSON.stringify(["آشپزی پایه", "دستور پخت", "تزئین"]),
        aiToolsUsage: JSON.stringify([
          "ایده‌پردازی برای طعم‌های جدید با ChatGPT",
          "نوشتن دستور پخت خلاقانه",
          "نام‌گذاری برند شیرینی",
          "کپشن‌نویسی برای عکس محصولات",
          "تقویم محتوایی ماهانه",
        ]),
        contentIdeas: JSON.stringify([
          "ویدیوی پخت کیک از صفر تا صد",
          "ترفند تزئین شیرینی با ۳ ماده ساده",
          "مقایسه شیرینی خانگی vs قنادی",
          "بسته‌بندی سفارش مشتری",
          "نظرات مشتریان راضی",
        ]),
        sortOrder: 1,
      },
      {
        name: "غذای خانگی و کترینگ",
        icon: "🍲",
        description: "پخت غذاهای خانگی، پک ناهار، غذای شرکتی و سفارشی",
        difficulty: "easy",
        startupCost: "کم (۳۰۰ هزار تا ۱ میلیون تومان)",
        monthlyIncome: "۵ تا ۲۰ میلیون تومان",
        skillsNeeded: JSON.stringify(["آشپزی", "مدیریت زمان", "بسته‌بندی"]),
        aiToolsUsage: JSON.stringify([
          "نوشتن منوی هفتگی با ChatGPT",
          "ایده غذاهای ترند و فصلی",
          "محاسبه قیمت تمام‌شده",
          "متن تبلیغاتی برای پک ناهار",
          "برنامه‌ریزی تولید محتوا",
        ]),
        contentIdeas: JSON.stringify([
          "آموزش یک غذای ساده در ۶۰ ثانیه",
          "پشت صحنه آشپزخانه",
          "بسته‌بندی سفارش کترینگ",
          "غذای امروز vs غذای دیروز",
          "ترفند نگهداری غذا",
        ]),
        sortOrder: 2,
      },
      {
        name: "ترشی، مربا و محصولات سنتی",
        icon: "🫙",
        description: "تهیه ترشی خانگی، مربا، سبزی خشک، ادویه و محصولات محلی",
        difficulty: "easy",
        startupCost: "خیلی کم (زیر ۵۰۰ هزار تومان)",
        monthlyIncome: "۲ تا ۸ میلیون تومان",
        skillsNeeded: JSON.stringify(["آشپزی سنتی", "بسته‌بندی", "نگهداری"]),
        aiToolsUsage: JSON.stringify([
          "نوشتن داستان برند سنتی",
          "ایده محصولات فصلی",
          "متن بسته‌بندی و لیبل",
          "کپشن اینستاگرام با لحن صمیمی",
          "هشتگ‌های مرتبط با غذای سنتی",
        ]),
        contentIdeas: JSON.stringify([
          "روش ساخت ترشی فلفل در ۳ دقیقه",
          "مادربزرگ و دستور مربای گل سرخ",
          "از باغچه تا سفره",
          "بسته هدیه محصولات سنتی",
          "مقایسه صنعتی vs خانگی",
        ]),
        sortOrder: 3,
      },
      {
        name: "شمع‌سازی",
        icon: "🕯️",
        description: "ساخت شمع‌های تزئینی، معطر، ژله‌ای و سفارشی",
        difficulty: "medium",
        startupCost: "کم تا متوسط (۱ تا ۳ میلیون تومان)",
        monthlyIncome: "۳ تا ۱۰ میلیون تومان",
        skillsNeeded: JSON.stringify(["دقت و ظرافت", "سلیقه بصری", "صبر"]),
        aiToolsUsage: JSON.stringify([
          "ایده طرح‌های جدید شمع",
          "نام محصول و برندسازی",
          "عکاسی محصولی با AI",
          "متن کاتالوگ محصولات",
          "ایده هدیه و مناسبت‌ها",
        ]),
        contentIdeas: JSON.stringify([
          "ساخت شمع ژله‌ای در ۶۰ ثانیه",
          "هدیه ولنتاین دست‌ساز",
          "شمع‌های مناسبتی محرم و نوروز",
          "پشت صحنه کارگاه شمع‌سازی",
          "مقایسه شمع دست‌ساز vs کارخانه‌ای",
        ]),
        sortOrder: 4,
      },
      {
        name: "صابون و محصولات بهداشتی دست‌ساز",
        icon: "🧼",
        description: "ساخت صابون گیاهی، شامپو طبیعی، کرم و لوسیون خانگی",
        difficulty: "medium",
        startupCost: "متوسط (۲ تا ۵ میلیون تومان)",
        monthlyIncome: "۳ تا ۱۲ میلیون تومان",
        skillsNeeded: JSON.stringify(["شیمی پایه", "رعایت بهداشت", "طراحی بسته‌بندی"]),
        aiToolsUsage: JSON.stringify([
          "فرمولاسیون محصول جدید با ChatGPT",
          "نوشتن مزایای محصول برای تبلیغ",
          "طراحی لیبل و بسته‌بندی",
          "محتوای آموزشی مراقبت پوست",
          "تحلیل بازار و رقبا",
        ]),
        contentIdeas: JSON.stringify([
          "ساخت صابون رزماری از صفر",
          "۵ فایده صابون گیاهی",
          "هدیه عروسی دست‌ساز",
          "روتین مراقبت پوست طبیعی",
          "از مواد اولیه تا محصول نهایی",
        ]),
        sortOrder: 5,
      },
      {
        name: "زیورآلات دست‌ساز",
        icon: "💎",
        description: "ساخت گردنبند، دستبند، گوشواره و ست زیورآلات با مهره و سنگ",
        difficulty: "medium",
        startupCost: "کم تا متوسط (۱ تا ۳ میلیون تومان)",
        monthlyIncome: "۴ تا ۱۵ میلیون تومان",
        skillsNeeded: JSON.stringify(["ظرافت دست", "سلیقه رنگ", "صبر"]),
        aiToolsUsage: JSON.stringify([
          "طراحی مدل جدید با AI",
          "نام‌گذاری کلکسیون‌ها",
          "کپشن عاشقانه برای زیورآلات",
          "ایده هدیه مناسبتی",
          "طراحی لوگوی برند جواهرات",
        ]),
        contentIdeas: JSON.stringify([
          "ساخت گردنبند مهره‌ای در ۳۰ ثانیه",
          "ست عروس و داماد",
          "کلکسیون بهاره",
          "هدیه روز مادر",
          "مقایسه دست‌ساز vs ماشینی",
        ]),
        sortOrder: 6,
      },
      {
        name: "بافتنی و قلاب‌بافی",
        icon: "🧶",
        description: "بافت لباس، کلاه، شال، عروسک و دکوری با میل و قلاب",
        difficulty: "medium",
        startupCost: "خیلی کم (زیر ۵۰۰ هزار تومان)",
        monthlyIncome: "۳ تا ۱۰ میلیون تومان",
        skillsNeeded: JSON.stringify(["بافتنی مقدماتی", "خواندن الگو", "صبر"]),
        aiToolsUsage: JSON.stringify([
          "پیدا کردن الگوهای جدید",
          "نوشتن دستور بافت",
          "ایده محصولات زمستانی",
          "قیمت‌گذاری محصول",
          "محتوای آموزشی بافت",
        ]),
        contentIdeas: JSON.stringify([
          "آموزش بافت کلاه ساده",
          "عروسک قلاب‌بافی ترند",
          "لباس زمستانی دست‌ساز",
          "از کلاف تا محصول نهایی",
          "هدیه دست‌ساز برای نوزاد",
        ]),
        sortOrder: 7,
      },
      {
        name: "خیاطی و تعمیر لباس",
        icon: "🧵",
        description: "دوخت لباس سفارشی، تعمیر، تغییر سایز و بازسازی لباس قدیمی",
        difficulty: "medium",
        startupCost: "متوسط (۲ تا ۸ میلیون تومان)",
        monthlyIncome: "۵ تا ۲۰ میلیون تومان",
        skillsNeeded: JSON.stringify(["خیاطی پایه", "الگوسازی", "شناخت پارچه"]),
        aiToolsUsage: JSON.stringify([
          "طراحی مدل لباس با AI",
          "الگوسازی دیجیتال",
          "محتوای قبل و بعد تعمیر لباس",
          "کپشن برای نمونه‌کارها",
          "ایده بازسازی لباس قدیمی",
        ]),
        contentIdeas: JSON.stringify([
          "تبدیل لباس قدیمی به جدید در ۶۰ ثانیه",
          "قبل و بعد تعمیر لباس",
          "آموزش دوخت ماسک ساده",
          "پشت صحنه کارگاه خیاطی",
          "ترفند خیاطی بدون چرخ",
        ]),
        sortOrder: 8,
      },
      {
        name: "نقاشی روی سفال و پارچه",
        icon: "🎨",
        description: "نقاشی روی بشقاب، لیوان، تی‌شرت، کیف و محصولات دکوری",
        difficulty: "medium",
        startupCost: "کم تا متوسط (۱ تا ۴ میلیون تومان)",
        monthlyIncome: "۳ تا ۱۲ میلیون تومان",
        skillsNeeded: JSON.stringify(["نقاشی پایه", "سلیقه رنگ", "خلاقیت"]),
        aiToolsUsage: JSON.stringify([
          "ایده طرح‌های جدید روی سفال",
          "طراحی الگوی پارچه",
          "نام‌گذاری کلکسیون‌ها",
          "کپشن هنری و الهام‌بخش",
          "ایده محصولات مناسبتی",
        ]),
        contentIdeas: JSON.stringify([
          "نقاشی روی لیوان در ۶۰ ثانیه",
          "ست ظروف عروسی سفارشی",
          "تی‌شرت طرح سفارشی",
          "از سفال خام تا اثر هنری",
          "هدیه تولد شخصی‌سازی شده",
        ]),
        sortOrder: 9,
      },
      {
        name: "گل و گیاه و تراریوم",
        icon: "🌿",
        description: "ساخت تراریوم، نگهداری گیاهان آپارتمانی، فروش گلدان و باغچه کوچک",
        difficulty: "easy",
        startupCost: "کم (۱ تا ۳ میلیون تومان)",
        monthlyIncome: "۳ تا ۱۰ میلیون تومان",
        skillsNeeded: JSON.stringify(["شناخت گیاهان", "طراحی فضای سبز", "صبر"]),
        aiToolsUsage: JSON.stringify([
          "راهنمای نگهداری گیاهان",
          "ایده تراریوم جدید",
          "متن آموزشی مراقبت گیاه",
          "نام‌گذاری محصولات",
          "تقویم کاشت فصلی",
        ]),
        contentIdeas: JSON.stringify([
          "ساخت تراریوم در ۶۰ ثانیه",
          "۵ گیاه مناسب آپارتمان",
          "هدیه روز مادر: باغچه کوچک",
          "آبیاری صحیح گیاهان",
          "از قلمه زدن تا گلدان زیبا",
        ]),
        sortOrder: 10,
      },
      {
        name: "آموزش آشپزی آنلاین",
        icon: "👩‍🍳",
        description: "آموزش آنلاین آشپزی، کیک‌پزی و شیرینی‌پزی از طریق لایو و ویدیو",
        difficulty: "easy",
        startupCost: "خیلی کم (فقط موبایل)",
        monthlyIncome: "۲ تا ۱۰ میلیون تومان",
        skillsNeeded: JSON.stringify(["آشپزی ماهر", "فن بیان", "صبر در آموزش"]),
        aiToolsUsage: JSON.stringify([
          "نوشتن سرفصل کلاس آنلاین",
          "ایده دوره‌های آموزشی",
          "برنامه‌ریزی لایو هفتگی",
          "متن تبلیغاتی دوره",
          "ساخت PDF دستور پخت",
        ]),
        contentIdeas: JSON.stringify([
          "آموزش آشپزی لایو شبانه",
          "۱۰ غذای ۱۰ دقیقه‌ای",
          "ترفند آشپزی مادربزرگ",
          "چالش آشپزی با ۳ ماده",
          "پشت صحنه یک کلاس آنلاین",
        ]),
        sortOrder: 11,
      },
      {
        name: "آموزش خیاطی و هنر",
        icon: "📐",
        description: "آموزش خیاطی، بافتنی، نقاشی و هنرهای دستی به صورت آنلاین",
        difficulty: "medium",
        startupCost: "خیلی کم (فقط موبایل)",
        monthlyIncome: "۳ تا ۱۲ میلیون تومان",
        skillsNeeded: JSON.stringify(["تسلط بر هنر مورد نظر", "فن بیان", "صبر"]),
        aiToolsUsage: JSON.stringify([
          "نوشتن سرفصل آموزشی",
          "ساخت جزوه الکترونیکی",
          "ایده چالش‌های هنری",
          "متن معرفی دوره",
          "برنامه‌ریزی محتوای آموزشی",
        ]),
        contentIdeas: JSON.stringify([
          "آموزش دوخت کیف ساده",
          "نقاشی روی پارچه در ۶۰ ثانیه",
          "بافت عروسک قلاب‌بافی",
          "از صفر تا خیاط حرفه‌ای",
          "چالش هفتگی هنری",
        ]),
        sortOrder: 12,
      },
      {
        name: "مشاوره و خدمات آنلاین",
        icon: "💼",
        description: "مشاوره تغذیه، روانشناسی، تحصیلی، طراحی گرافیک یا خدمات مجازی",
        difficulty: "hard",
        startupCost: "خیلی کم (فقط اینترنت)",
        monthlyIncome: "۵ تا ۲۵ میلیون تومان",
        skillsNeeded: JSON.stringify(["تخصص در حوزه مورد نظر", "ارتباط موثر", "سواد دیجیتال"]),
        aiToolsUsage: JSON.stringify([
          "ساخت پروفایل حرفه‌ای",
          "نوشتن بروشور خدمات",
          "محتوای آموزشی رایگان",
          "پاسخ به سوالات متداول",
          "تحلیل نیاز مخاطبان",
        ]),
        contentIdeas: JSON.stringify([
          "۳ نکته تغذیه سالم در ۳۰ ثانیه",
          "مشاوره رایگان لایو",
          "سوال و جواب هفتگی",
          "داستان موفقیت مراجعین",
          "آموزش رایگان مهارت",
        ]),
        sortOrder: 13,
      },
    ];

    await db.insert(businessCategories).values(data);

    return NextResponse.json({
      success: true,
      message: `${data.length} کسب‌وکار خانگی ایجاد شد`,
    });
  } catch (error) {
    console.error("Business categories seed error:", error);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
