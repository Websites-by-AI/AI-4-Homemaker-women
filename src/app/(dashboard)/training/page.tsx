"use client";

import { useEffect, useState } from "react";

interface TrainingModule {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  platform: string | null;
  durationMinutes: number | null;
  orderIndex: number;
  category: string;
}

interface ApplicationTraining {
  id: number;
  fullName: string;
  status: string;
  trainingDeadline: string | null;
}

// Hardcoded training curriculum with real YouTube video IDs
const curriculum = [
  {
    category: "ساخت پیج حرفه‌ای",
    icon: "📱",
    gradient: "from-pink-500 to-rose-500",
    modules: [
      {
        id: 101,
        title: "بیزینسی کردن پیج اینستاگرام",
        description: "آموزش قدم‌به‌قدم تبدیل حساب شخصی به حساب حرفه‌ای (سازنده یا کسب‌وکار) و دسترسی به ابزارهای آماری",
        videoUrl: "https://www.youtube.com/embed/8I-U55R41P0",
        platform: "youtube",
        durationMinutes: 8,
        orderIndex: 1,
        category: "page",
      },
      {
        id: 102,
        title: "حرفه‌ای کردن پیج: بایو، عکس و تنظیمات",
        description: "نحوه انتخاب عکس پروفایل، نوشتن بایو جذاب، تنظیم دسته‌بندی و افزودن دکمه‌های تماس",
        videoUrl: "https://www.youtube.com/embed/iyQcyclJ3wo",
        platform: "youtube",
        durationMinutes: 12,
        orderIndex: 2,
        category: "page",
      },
      {
        id: 103,
        title: "هایلایت‌ها: رزومه، نمونه‌کار، اعتمادسازی",
        description: "ساخت هایلایت‌های حرفه‌ای برای فروش، آموزش و معرفی خدمات — هر هایلایت یک بخش از کسب‌وکار شماست",
        videoUrl: "https://www.youtube.com/embed/iyQcyclJ3wo",
        platform: "youtube",
        durationMinutes: 10,
        orderIndex: 3,
        category: "page",
      },
    ],
  },
  {
    category: "ریلز با CapCut",
    icon: "✨",
    gradient: "from-violet-500 to-purple-600",
    modules: [
      {
        id: 201,
        title: "کاملترین آموزش ادیت ویدیو با CapCut",
        description: "از نصب تا خروجی: آشنایی کامل با محیط CapCut، ابزارهای صدا، متن، ترنزیشن و افکت‌ها",
        videoUrl: "https://www.youtube.com/embed/x6vVZ99Ij2k",
        platform: "youtube",
        durationMinutes: 25,
        orderIndex: 4,
        category: "capcut",
      },
      {
        id: 202,
        title: "ساخت ریلز چالشی با عکس‌ها در CapCut",
        description: "تکنیک ساخت کلیپ سریع از عکس‌ها با انیمیشن Combo و افکت‌های جذاب برای ریلز ترند",
        videoUrl: "https://www.youtube.com/embed/LXtaQ88ghdk",
        platform: "youtube",
        durationMinutes: 10,
        orderIndex: 5,
        category: "capcut",
      },
      {
        id: 203,
        title: "فونت فارسی در CapCut — روش جدید ۲۰۲۵",
        description: "رفع مشکل فاصله بین حروف فارسی و اضافه کردن فونت‌های فارسی به CapCut بدون اپ اضافی",
        videoUrl: "https://www.youtube.com/embed/RxHnV6izEyg",
        platform: "youtube",
        durationMinutes: 5,
        orderIndex: 6,
        category: "capcut",
      },
    ],
  },
  {
    category: "کپشن و سناریو با هوش مصنوعی",
    icon: "🤖",
    gradient: "from-cyan-400 to-blue-500",
    modules: [
      {
        id: 301,
        title: "تولید محتوا با ChatGPT: سناریو، کپشن، ایده",
        description: "آموزش کامل استفاده از ChatGPT برای سناریو‌نویسی ریلز، نوشتن کپشن جذاب و پیدا کردن ایده ترند",
        videoUrl: "https://www.youtube.com/embed/QOR1F4QEb6E",
        platform: "youtube",
        durationMinutes: 30,
        orderIndex: 7,
        category: "ai",
      },
      {
        id: 302,
        title: "قدرت ChatGPT در تولید محتوای حرفه‌ای",
        description: "پرامپت‌های طلایی، تنظیمات پیشرفته، مثال‌های عملی برای اینستاگرام و یوتیوب",
        videoUrl: "https://www.youtube.com/embed/Q0bTQRDbUTM",
        platform: "youtube",
        durationMinutes: 18,
        orderIndex: 8,
        category: "ai",
      },
      {
        id: 303,
        title: "سناریو نویسی با ChatGPT — اشتباه بزرگ!",
        description: "چرا نباید کاملاً به AI تکیه کنی؟ ترکیب هوش مصنوعی با خلاقیت واقعی و Storytelling",
        videoUrl: "https://www.youtube.com/embed/UemJghYvShc",
        platform: "youtube",
        durationMinutes: 15,
        orderIndex: 9,
        category: "ai",
      },
    ],
  },
  {
    category: "فیلم‌برداری با موبایل",
    icon: "📱",
    gradient: "from-emerald-400 to-teal-500",
    modules: [
      {
        id: 401,
        title: "نورپردازی ساده برای فیلم‌برداری خانگی",
        description: "بدون تجهیزات گران‌قیمت، فقط با نور طبیعی و یک لامپ ویدیوی باکیفیت بگیرید",
        videoUrl: "https://www.youtube.com/embed/iyQcyclJ3wo",
        platform: "youtube",
        durationMinutes: 11,
        orderIndex: 10,
        category: "filming",
      },
      {
        id: 402,
        title: "زاویه دوربین و ترکیب‌بندی برای ریلز",
        description: "بهترین زاویه‌ها برای فیلم‌برداری عمودی 9:16 و تکنیک‌های ترکیب‌بندی حرفه‌ای",
        videoUrl: "https://www.youtube.com/embed/QOR1F4QEb6E",
        platform: "youtube",
        durationMinutes: 9,
        orderIndex: 11,
        category: "filming",
      },
      {
        id: 403,
        title: "۳ ثانیه طلایی: شروع جذاب ریلز",
        description: "چطور ریلزت رو شروع کنی که مخاطب اسکرول نکنه و ببینه — تکنیک Hook",
        videoUrl: "https://www.youtube.com/embed/UemJghYvShc",
        platform: "youtube",
        durationMinutes: 7,
        orderIndex: 12,
        category: "filming",
      },
    ],
  },
  {
    category: "فروش و کسب‌درآمد",
    icon: "💰",
    gradient: "from-amber-400 to-orange-500",
    modules: [
      {
        id: 501,
        title: "مدیریت پیج و پاسخ‌دهی به مشتری",
        description: "تکنیک‌های ادمینی پیج: پاسخ‌دهی دایرکت، مدیریت کامنت‌ها و استفاده از ابزارهای حرفه‌ای",
        videoUrl: "https://www.youtube.com/embed/ALb-vG-_clQ",
        platform: "youtube",
        durationMinutes: 13,
        orderIndex: 13,
        category: "sales",
      },
      {
        id: 502,
        title: "استوری فروش روزانه و اعتمادسازی",
        description: "چطور هر روز استوری بذاری و محصولت رو بفروشی بدون اینکه مزاحم باشی",
        videoUrl: "https://www.youtube.com/embed/Q0bTQRDbUTM",
        platform: "youtube",
        durationMinutes: 10,
        orderIndex: 14,
        category: "sales",
      },
      {
        id: 503,
        title: "پیج = رزومه + فروشگاه + کلاس آموزشی",
        description: "چطور از یک پیج اینستاگرام همزمان برای نمونه‌کار، فروش و آموزش استفاده کنیم",
        videoUrl: "https://www.youtube.com/embed/QOR1F4QEb6E",
        platform: "youtube",
        durationMinutes: 15,
        orderIndex: 15,
        category: "sales",
      },
    ],
  },
];

const allModules = curriculum.flatMap((cat) => cat.modules);

export default function TrainingPage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string>("loading");
  const [deadline, setDeadline] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    // Check if user has an approved/training application
    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setApplicationStatus("no_access");
          return;
        }
        setApplicationStatus("training");
      } catch {
        setApplicationStatus("no_access");
      }
    }
    checkAccess();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft("مهلت به پایان رسیده");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours} ساعت و ${minutes} دقیقه و ${seconds} ثانیه`);
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  function toggleComplete(moduleId: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  const progressPercent = Math.round((completed.size / allModules.length) * 100);

  if (applicationStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🎓 آموزش تولید محتوا
          </h1>
          <p className="text-gray-500 mt-1">
            ویدیوهای آموزشی یوتیوب + ابزارهای هوش مصنوعی — ۱۵ ماژول آموزشی
          </p>
        </div>
        {timeLeft && (
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xl animate-pulse">⏰</span>
            <div>
              <p className="text-xs text-amber-600 font-medium">مهلت آموزش</p>
              <p className="text-sm font-bold text-amber-800">{timeLeft}</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">پیشرفت کلی آموزش</span>
          <span className="text-sm font-bold text-violet-600">
            {completed.size} از {allModules.length} ویدیو ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {progressPercent === 100 && (
          <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="text-sm font-medium text-green-800">
              تبریک! تمام آموزش‌ها را تکمیل کردید. آماده پروژه آزمایشی هستید!
            </span>
          </div>
        )}
      </div>

      {/* Curriculum by Category */}
      {curriculum.map((cat, catIdx) => (
        <div key={catIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Category Header */}
          <div className={`p-5 bg-gradient-to-r ${cat.gradient} flex items-center gap-3`}>
            <span className="text-3xl">{cat.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-white">{cat.category}</h2>
              <p className="text-sm text-white/80">
                {cat.modules.length} ویدیو آموزشی
              </p>
            </div>
            <div className="mr-auto flex items-center gap-2">
              <span className="text-sm font-bold text-white/90">
                {cat.modules.filter((m) => completed.has(m.id)).length}/{cat.modules.length}
              </span>
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                {cat.modules.every((m) => completed.has(m.id)) ? (
                  <span className="text-white text-lg">✓</span>
                ) : (
                  <span className="text-white text-sm font-bold">
                    {cat.modules.filter((m) => completed.has(m.id)).length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="divide-y divide-gray-50">
            {cat.modules.map((mod) => {
              const isCompleted = completed.has(mod.id);
              const isActive = activeVideo === mod.id;

              return (
                <div key={mod.id} className="transition-colors hover:bg-gray-50/50">
                  <div className="p-5 flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleComplete(mod.id)}
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-violet-400"
                      }`}
                    >
                      {isCompleted && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-sm ${isCompleted ? "text-green-700 line-through" : "text-gray-900"}`}>
                          {mod.title}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {mod.durationMinutes} دقیقه
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{mod.description}</p>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => setActiveVideo(isActive ? null : mod.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 flex-shrink-0 ${
                        isActive
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                          : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          بستن
                        </>
                      ) : (
                        <>
                          ▶ مشاهده ویدیو
                        </>
                      )}
                    </button>
                  </div>

                  {/* Video Embed */}
                  {isActive && (
                    <div className="px-5 pb-5 animate-fadeIn">
                      <div className="relative w-full rounded-xl overflow-hidden bg-gray-900 shadow-xl" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={mod.videoUrl}
                          title={mod.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => toggleComplete(mod.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {isCompleted ? "✓ تکمیل شده" : "✓ علامت‌گذاری به عنوان تکمیل شده"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Bottom CTA */}
      {progressPercent === 100 && (
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl shadow-purple-500/20">
          <h3 className="text-2xl font-bold mb-3">🚀 آماده پروژه آزمایشی هستید!</h3>
          <p className="text-violet-100 mb-6 max-w-xl mx-auto">
            حالا که آموزش‌ها را دیدید، نوبت عمل رسیده. ۱ تا ۳ ریلز کوتاه بسازید
            و با دوستان یا خانواده خود اولین محتوای حرفه‌ای‌تان را تولید کنید.
          </p>
          <button className="px-8 py-4 bg-white text-violet-700 rounded-xl font-bold hover:bg-violet-50 transition-colors shadow-lg">
            ارسال پروژه آزمایشی
          </button>
        </div>
      )}
    </div>
  );
}
