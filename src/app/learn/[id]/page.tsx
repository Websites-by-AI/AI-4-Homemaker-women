"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { buildEducationLinks } from "@/lib/education-resources";

interface Business {
  id: number;
  name: string;
  icon: string;
  description: string;
  difficulty: string;
  startupCost: string;
  monthlyIncome: string;
  skillsNeeded: string;
  aiToolsUsage: string;
  contentIdeas: string;
}

interface Step {
  num: number;
  title: string;
  icon: string;
  description: string;
  aiTools: { name: string; usage: string }[];
  tasks: string[];
  tip: string;
}

// ── Full 10-step curriculum generator per business ──
function getCurriculum(biz: Business): Step[] {
  const name = biz.name;
  return [
    {
      num: 1,
      title: `آشنایی با کسب‌وکار ${name}`,
      icon: "🔍",
      description: `در این مرحله با ماهیت کسب‌وکار ${name} آشنا می‌شوید. بازار هدف، رقبا، نقاط قوت و ضعف این حوزه را بررسی می‌کنیم و می‌فهمیم آیا این کسب‌وکار واقعاً مناسب شماست.`,
      aiTools: [
        { name: "ChatGPT", usage: `تحلیل بازار ${name} و شناسایی رقبای اصلی` },
        { name: "Gemini", usage: "بررسی ترندهای روز و نیاز مخاطبان فارسی‌زبان" },
      ],
      tasks: [
        "جستجوی ۱۰ پیج موفق در این حوزه در اینستاگرام",
        "نوشتن ۵ نقطه قوت و ۵ چالش این کسب‌وکار",
        "مشخص کردن مخاطب هدف: سن، جنسیت، شهر، نیاز",
      ],
      tip: "از ChatGPT بخواهید: «من می‌خوام کسب‌وکار [نام] رو شروع کنم. لطفاً تحلیل SWOT بنویس و رقبای اصلی رو معرفی کن.»",
    },
    {
      num: 2,
      title: "انتخاب محصول یا خدمت",
      icon: "🎯",
      description: `از بین محصولات و خدمات مختلف ${name}، بهترین گزینه را برای شروع انتخاب می‌کنید. محصولی که هم به آن علاقه دارید، هم بازار خوبی دارد و هم با سرمایه اولیه شما سازگار است.`,
      aiTools: [
        { name: "ChatGPT", usage: `لیست محصولات پرفروش ${name} + حاشیه سود هر کدام` },
        { name: "Gemini", usage: "مقایسه محصولات مختلف از نظر تقاضای بازار" },
      ],
      tasks: [
        "لیست کردن حداقل ۵ محصول/خدمت قابل ارائه",
        "مقایسه سودآوری هر کدام",
        "انتخاب ۱ تا ۳ محصول اصلی برای شروع",
      ],
      tip: "از ChatGPT بخواهید: «لیست ۱۰ محصول پرفروش در حوزه [نام] بنویس و حاشیه سود هر کدام رو تخمین بزن.»",
    },
    {
      num: 3,
      title: "معرفی ابزارهای هوش مصنوعی",
      icon: "🤖",
      description: "ابزارهای هوش مصنوعی که در مسیر کسب‌وکارتان به کارتان می‌آیند را یاد می‌گیرید: ChatGPT برای متن، Canva AI برای طراحی، CapCut برای تدوین و Gemini برای تحلیل.",
      aiTools: [
        { name: "ChatGPT", usage: "نوشتن متن، ایده‌پردازی، سناریو، کپشن" },
        { name: "Canva AI", usage: "طراحی لوگو، بنر، کاور ریلز، لیبل محصول" },
        { name: "CapCut", usage: "تدوین ریلز، افزودن متن و موزیک، خروجی عمودی" },
        { name: "Gemini", usage: "تحلیل بازار، هشتگ، ترند، پاسخ سوالات" },
      ],
      tasks: [
        "ساخت اکانت ChatGPT و Canva",
        "نصب CapCut روی موبایل",
        "تست یک پرامپت ساده در هر ابزار",
      ],
      tip: "همه این ابزارها رایگان هستند. با نسخه رایگان شروع کنید و بعد از نیاز، ارتقا دهید.",
    },
    {
      num: 4,
      title: "ساخت برند و لوگو",
      icon: "🏷️",
      description: "نام برند، شعار، رنگ‌بندی و لوگوی کسب‌وکارتان را طراحی می‌کنید. هویت بصری باعث اعتماد مشتری و تمایز شما از رقبا می‌شود.",
      aiTools: [
        { name: "ChatGPT", usage: `پیشنهاد ۱۰ نام برند خلاقانه برای ${name}` },
        { name: "Canva AI", usage: "طراحی لوگو با قالب‌های آماده حرفه‌ای" },
        { name: "ChatGPT", usage: "نوشتن شعار تبلیغاتی و بیانیه برند" },
      ],
      tasks: [
        "انتخاب نام برند و ثبت آیدی اینستاگرام",
        "طراحی لوگو با Canva",
        "انتخاب ۳ رنگ اصلی برند",
        "نوشتن شعار کوتاه و به‌یادماندنی",
      ],
      tip: "از ChatGPT بخواهید: «برای کسب‌وکار [نام] با موضوع [توضیح]، ۱۰ نام برند فارسی خلاقانه پیشنهاد بده.»",
    },
    {
      num: 5,
      title: "طراحی محصول و بسته‌بندی",
      icon: "📦",
      description: "محصول نهایی خود را آماده می‌کنید: کیفیت، ظاهر، بسته‌بندی و قیمت‌گذاری. بسته‌بندی حرفه‌ای می‌تواند ارزش محصول شما را ۲ تا ۳ برابر کند.",
      aiTools: [
        { name: "ChatGPT", usage: "محاسبه قیمت تمام‌شده و قیمت فروش پیشنهادی" },
        { name: "Canva AI", usage: "طراحی لیبل، کارت تشکر، کارت ویزیت" },
        { name: "ChatGPT", usage: "نوشتن متن بسته‌بندی و کارت تشکر مشتری" },
      ],
      tasks: [
        "تهیه مواد اولیه و ساخت اولین محصول",
        "طراحی لیبل و بسته‌بندی",
        "قیمت‌گذاری نهایی با فرمول سود",
        "عکاسی از محصول نهایی",
      ],
      tip: "قیمت = هزینه مواد + هزینه بسته‌بندی + ارزش کار شما + سود. هرگز فقط روی هزینه مواد قیمت نگذارید!",
    },
    {
      num: 6,
      title: "ساخت پیج اینستاگرام حرفه‌ای",
      icon: "📱",
      description: "پیج اینستاگرام خود را از صفر می‌سازید: بیزینس اکانت، عکس پروفایل، بایو جذاب، هایلایت‌ها و تنظیمات حرفه‌ای.",
      aiTools: [
        { name: "ChatGPT", usage: "نوشتن بایو حرفه‌ای و جذاب برای پیج" },
        { name: "Canva AI", usage: "طراحی عکس پروفایل و کاور هایلایت‌ها" },
        { name: "ChatGPT", usage: "برنامه‌ریزی بخش‌بندی هایلایت‌ها" },
      ],
      tasks: [
        "تبدیل حساب به بیزینس اکانت",
        "تنظیم عکس پروفایل و بایو",
        "ساخت حداقل ۵ هایلایت (رزومه، محصولات، نظرات، آموزش، سفارش)",
        "لینک بیو و دکمه تماس",
      ],
      tip: "بایو شما باید در ۳ ثانیه بگوید: کی هستید، چه می‌فروشید، چرا باید از شما بخرند.",
    },
    {
      num: 7,
      title: "تولید محتوا: ریلز و استوری",
      icon: "🎬",
      description: "تولید محتوای جذاب را شروع می‌کنید: ریلز معرفی محصول، استوری روزانه، پست آموزشی و محتوای تعاملی. با کمک AI ایده بگیرید و با CapCut تدوین کنید.",
      aiTools: [
        { name: "ChatGPT", usage: `ایده‌پردازی ۳۰ ریلز برای ${name}` },
        { name: "ChatGPT", usage: "نوشتن سناریو و کپشن هر ریلز" },
        { name: "CapCut", usage: "تدوین ریلز با متن، موزیک و افکت" },
        { name: "Canva AI", usage: "طراحی کاور ریلز و قالب استوری" },
      ],
      tasks: [
        "تهیه تقویم محتوایی ۳۰ روزه",
        "ساخت و انتشار اولین ریلز",
        "گذاشتن حداقل ۳ استوری روزانه",
        "تولید ۱۰ ریلز در ۲ هفته اول",
      ],
      tip: "از ChatGPT بخواهید: «برای کسب‌وکار [نام]، تقویم محتوایی ۳۰ روزه اینستاگرام بنویس با ترکیب ریلز، استوری و پست.»",
    },
    {
      num: 8,
      title: "فروش و پاسخ به مشتری",
      icon: "💬",
      description: "تکنیک‌های فروش از طریق دایرکت و استوری: نحوه پاسخ‌دهی، مذاکره، ارسال منو/کاتالوگ، ثبت سفارش و ایجاد اعتماد در مشتری.",
      aiTools: [
        { name: "ChatGPT", usage: "نوشتن پاسخ‌های آماده برای سوالات متداول مشتریان" },
        { name: "ChatGPT", usage: "نوشتن متن معرفی محصول و منوی فروش" },
        { name: "Canva AI", usage: "طراحی کاتالوگ محصولات و منوی قیمت" },
      ],
      tasks: [
        "ساخت منو/کاتالوگ محصولات",
        "نوشتن پاسخ ۱۰ سوال متداول مشتری",
        "تنظیم سفارش اول و ارسال محصول",
        "درخواست نظر و رضایت مشتری",
      ],
      tip: "از ChatGPT بخواهید: «لیست ۱۰ سوال رایج مشتریان [نام کسب‌وکار] رو بنویس و برای هر کدام پاسخ حرفه‌ای بده.»",
    },
    {
      num: 9,
      title: "مدیریت سفارش‌ها و ارسال",
      icon: "📋",
      description: "سیستم مدیریت سفارش را راه‌اندازی می‌کنید: ثبت سفارش، زمان‌بندی تولید، بسته‌بندی، ارسال و پیگیری تحویل.",
      aiTools: [
        { name: "ChatGPT", usage: "ساخت فرم ثبت سفارش و چک‌لیست ارسال" },
        { name: "Google Sheets + AI", usage: "مدیریت سفارش‌ها و محاسبه سود ماهانه" },
      ],
      tasks: [
        "ساخت فرم سفارش (گوگل فرم یا دایرکت)",
        "لیست بسته‌بندی و ارسال",
        "پیگیری تحویل و رضایت مشتری",
        "محاسبه سود و زیان ماه اول",
      ],
      tip: "از همان روز اول همه سفارش‌ها را ثبت کنید. این داده‌ها برای رشد کسب‌وکار حیاتی هستند.",
    },
    {
      num: 10,
      title: "توسعه کسب‌وکار و مقیاس‌پذیری",
      icon: "🚀",
      description: "مرحله رشد: افزایش تنوع محصولات، همکاری با پیج‌های دیگر، تبلیغات، فروش عمده و تبدیل شدن به برند شناخته‌شده. از مربی‌گری و آموزش هم می‌توانید درآمد کسب کنید.",
      aiTools: [
        { name: "ChatGPT", usage: "استراتژی رشد و برنامه ۶ ماهه کسب‌وکار" },
        { name: "ChatGPT", usage: "نوشتن پیشنهاد همکاری به پیج‌های بزرگ‌تر" },
        { name: "Canva AI", usage: "طراحی رسانه‌کیت و کاتالوگ حرفه‌ای" },
      ],
      tasks: [
        "برنامه‌ریزی رشد ۶ ماهه",
        "ایجاد تنوع در محصولات",
        "همکاری با اینفلوئنسرها",
        "شروع آموزش به دیگران (مربی‌گری)",
        "ثبت برند و قانونی‌سازی",
      ],
      tip: "از ChatGPT بخواهید: «برای کسب‌وکار [نام] که الان [تعداد] مشتری دارم، یک برنامه رشد ۶ ماهه بنویس.»",
    },
  ];
}

export default function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [business, setBusiness] = useState<Business | null>(null);
  const [curriculum, setCurriculum] = useState<Step[]>([]);
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [eduQuery, setEduQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBiz() {
      try {
        await fetch("/api/business-categories", { method: "POST" });
        const res = await fetch("/api/business-categories");
        if (res.ok) {
          const data = await res.json();
          const biz = data.categories.find(
            (c: Business) => c.id === parseInt(id)
          );
          if (biz) {
            setBusiness(biz);
            setCurriculum(getCurriculum(biz));
            setEduQuery(biz.name);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchBiz();
  }, [id]);

  function toggleComplete(stepNum: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(stepNum)) next.delete(stepNum);
      else next.add(stepNum);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">کسب‌وکار یافت نشد</p>
        <Link href="/discover" className="text-emerald-600 font-medium">
          بازگشت ←
        </Link>
      </div>
    );
  }

  const progress = Math.round((completed.size / 10) * 100);
  const educationResources = buildEducationLinks(
    business.name,
    eduQuery.trim() && eduQuery.trim() !== business.name ? eduQuery.trim() : "آموزش"
  );

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/discover" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">دیجی‌آموزش</span>
          </Link>
          <Link href="/discover" className="text-sm text-gray-500 hover:text-emerald-600">
            ← بازگشت به کشف کسب‌وکار
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        <div className="absolute top-10 left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 pt-14 pb-10">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center text-5xl shadow-xl shadow-emerald-500/20">
              {business.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                مسیر آموزشی {business.name}
              </h1>
              <p className="text-gray-500 mt-1">
                از صفر تا راه‌اندازی و فروش — ۱۰ مرحله عملی
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">درآمد ماهانه</p>
              <p className="font-bold text-emerald-700">{business.monthlyIncome}</p>
            </div>
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">سرمایه اولیه</p>
              <p className="font-bold text-blue-700">{business.startupCost}</p>
            </div>
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">پیشرفت شما</p>
              <p className="font-bold text-violet-700">{completed.size}/۱۰ ({progress}%)</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* AI Tools Overview */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="font-bold text-lg mb-3">🤖 ابزارهای هوش مصنوعی این مسیر</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["ChatGPT", "Canva AI", "CapCut", "Gemini"].map((tool) => (
              <div key={tool} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <p className="font-bold text-sm">{tool}</p>
              </div>
            ))}
          </div>
          <p className="text-violet-200 text-xs mt-3">
            همه ابزارها رایگان هستند. در هر مرحله مشخص شده که از کدام ابزار استفاده کنید.
          </p>
        </div>
      </section>

      {/* More education search */}
      <section className="max-w-4xl mx-auto px-6 pb-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm p-6 md:p-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-1">🔎 آموزش‌های بیشتر در همین حوزه</h3>
              <p className="text-sm text-gray-500 leading-7">
                اگر می‌خواهی بیرون از سایت هم آموزش بیشتری ببینی، موضوع موردنظرت را بنویس تا لینک جست‌وجوی آماده در
                <b> یوتیوب</b>، <b>آپارات</b> و <b>فرادرس</b> داشته باشی.
              </p>
            </div>
            <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-2 self-start md:self-auto">
              مخصوص حوزه: {business.name}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <input
              value={eduQuery}
              onChange={(e) => setEduQuery(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-gray-50/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none transition-all text-sm"
              placeholder="مثلاً: کپشن‌نویسی، فروش لباس، خیاطی مانتو، بسته‌بندی هدیه"
            />
            <button
              type="button"
              onClick={() => setEduQuery(business.name)}
              className="px-4 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              بازگشت به موضوع اصلی
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {educationResources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {resource.provider === "youtube" ? "YouTube" : resource.provider === "aparat" ? "Aparat" : "Faradars"}
                  </span>
                  <span className="text-gray-400">↗</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm leading-7 mb-2">{resource.title}</h4>
                <p className="text-xs text-gray-500 leading-6">{resource.reason}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 10-Step Curriculum */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="space-y-4">
          {curriculum.map((step) => {
            const isOpen = openStep === step.num;
            const isDone = completed.has(step.num);

            return (
              <div
                key={step.num}
                className={`bg-white/70 backdrop-blur-xl rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  isOpen
                    ? "border-emerald-300 shadow-lg"
                    : isDone
                    ? "border-green-200"
                    : "border-white/80 hover:shadow-md"
                }`}
              >
                {/* Step Header */}
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer"
                  onClick={() => setOpenStep(isOpen ? null : step.num)}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(step.num);
                    }}
                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    {isDone && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-xl shadow-md flex-shrink-0">
                    {step.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black">
                        {step.num}
                      </span>
                      <h3 className={`font-bold text-sm ${isDone ? "text-green-700 line-through" : "text-gray-900"}`}>
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-gray-400 text-sm">{isOpen ? "▲" : "▼"}</span>
                </div>

                {/* Step Detail */}
                {isOpen && (
                  <div className="px-5 pb-6 space-y-5 animate-fadeIn border-t border-gray-100 pt-5">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* AI Tools */}
                    <div>
                      <h4 className="text-xs font-bold text-violet-700 mb-3 flex items-center gap-1">
                        🤖 ابزارهای هوش مصنوعی این مرحله
                      </h4>
                      <div className="space-y-2">
                        {step.aiTools.map((tool, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-violet-50/80 rounded-xl p-3"
                          >
                            <span className="px-2 py-1 bg-violet-600 text-white text-[10px] font-bold rounded-md">
                              {tool.name}
                            </span>
                            <span className="text-xs text-gray-700">{tool.usage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tasks */}
                    <div>
                      <h4 className="text-xs font-bold text-emerald-700 mb-3 flex items-center gap-1">
                        ✅ تکالیف عملی
                      </h4>
                      <div className="space-y-2">
                        {step.tasks.map((task, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-sm text-gray-700"
                          >
                            <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {i + 1}
                            </span>
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                      <span className="text-xl flex-shrink-0">💡</span>
                      <div>
                        <p className="text-xs font-bold text-amber-800 mb-1">پرامپت پیشنهادی</p>
                        <p className="text-xs text-amber-700 leading-relaxed" dir="ltr">{step.tip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion CTA */}
        {progress === 100 && (
          <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-3">تبریک! مسیر آموزشی را کامل کردید!</h3>
            <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
              حالا کسب‌وکار {business.name} شما آماده فروش است.
              برند دارید، پیج ساختید، محتوا تولید کردید و سیستم فروش دارید.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/collaborate#apply" className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                ارسال نمونه‌کار
              </Link>
              <Link href="/academy" className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-900 transition-colors">
                آکادمی دیجی‌آموزش
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">مسیر آموزشی {business.name} — دیجی‌آموزش © ۲۰۲۶</p>
        </div>
      </footer>
    </div>
  );
}
