"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

const quizQuestions = [
  {
    id: 1,
    question: "بیشتر وقت آزادت رو چطور می‌گذرونی؟",
    options: [
      { text: "آشپزی و شیرینی‌پزی", tags: ["food", "baking", "cooking"] },
      { text: "کارهای هنری و دستی", tags: ["art", "craft", "jewelry"] },
      { text: "باغبانی و گل‌کاری", tags: ["garden", "plant"] },
      { text: "یاد دادن به بقیه", tags: ["teach", "education"] },
    ],
  },
  {
    id: 2,
    question: "دوستات وقتی ازت کمک می‌خوان معمولاً در چه زمینه‌ایه؟",
    options: [
      { text: "پختن کیک یا غذا برای مهمونی", tags: ["food", "baking"] },
      { text: "درست کردن کاردستی یا هدیه", tags: ["craft", "jewelry", "soap"] },
      { text: "رسیدگی به گل و گیاه", tags: ["garden", "plant"] },
      { text: "توضیح دادن یک موضوع یا درس", tags: ["teach", "education"] },
    ],
  },
  {
    id: 3,
    question: "کدوم جمله بیشتر بهت نزدیکه؟",
    options: [
      { text: "عاشقم وقتی بوی کیک تازه خونه رو پر می‌کنه", tags: ["food", "baking"] },
      { text: "از ساختن چیزی با دستام لذت می‌برم", tags: ["craft", "sewing", "candle"] },
      { text: "آرامش من توی باغچه‌ست", tags: ["garden", "plant"] },
      { text: "وقتی چیزی رو به کسی یاد میدم حس خوبی دارم", tags: ["teach", "education"] },
    ],
  },
  {
    id: 4,
    question: "با ۵۰۰ هزار تومان سرمایه اولیه، کدوم کار رو شروع می‌کنی؟",
    options: [
      { text: "خرید مواد اولیه شیرینی‌پزی", tags: ["food", "baking"] },
      { text: "خرید مهره و نخ برای زیورآلات", tags: ["jewelry", "craft"] },
      { text: "خرید گلدان و خاک", tags: ["garden", "plant"] },
      { text: "ضبط ویدیوی آموزشی با موبایل", tags: ["teach", "education"] },
    ],
  },
  {
    id: 5,
    question: "در اینستاگرام بیشتر چه محتوایی رو دنبال می‌کنی؟",
    options: [
      { text: "آشپزی و دستور پخت", tags: ["food", "baking"] },
      { text: "هنرهای دستی و DIY", tags: ["craft", "candle", "soap", "paint"] },
      { text: "گل و گیاه و باغبانی", tags: ["garden", "plant"] },
      { text: "آموزش و انگیزشی", tags: ["teach", "education", "consult"] },
    ],
  },
];

const tagToCategoryMap: Record<string, number[]> = {
  food: [1, 2],
  baking: [1],
  cooking: [1, 2, 11],
  craft: [4, 6, 7, 9],
  jewelry: [6],
  soap: [5],
  candle: [4],
  sewing: [8, 12],
  paint: [9],
  garden: [10],
  plant: [10],
  teach: [11, 12, 13],
  education: [11, 12, 13],
  consult: [13],
};

const difficultyLabels: Record<string, { text: string; color: string }> = {
  easy: { text: "آسان", color: "bg-green-100 text-green-700" },
  medium: { text: "متوسط", color: "bg-amber-100 text-amber-700" },
  hard: { text: "پیشرفته", color: "bg-red-100 text-red-700" },
};

const learningSteps = [
  { num: "۱", icon: "🔍", title: "کشف مهارت و علاقه", desc: "با پاسخ به چند سوال ساده، کسب‌وکار مناسب خودت رو پیدا کن" },
  { num: "۲", icon: "🎯", title: "انتخاب کسب‌وکار", desc: "از بین ۱۳ کسب‌وکار خانگی، یکی رو انتخاب کن که به علاقه و مهارتت نزدیکه" },
  { num: "۳", icon: "📚", title: "آموزش مهارت", desc: "ویدیوهای آموزشی مرتبط با کسب‌وکارت رو ببین و مهارت‌های لازم رو یاد بگیر" },
  { num: "۴", icon: "🤖", title: "هوش مصنوعی برای کسب‌وکار", desc: "یاد بگیر چطور با ChatGPT و AI ایده پیدا کنی، کپشن بنویسی و محتوا بسازی" },
  { num: "۵", icon: "📱", title: "ساخت پیج و برند شخصی", desc: "پیج حرفه‌ای اینستاگرام بساز، بایو بنویس و هویت بصری برندت رو طراحی کن" },
  { num: "۶", icon: "🎬", title: "تولید محتوا و جذب مشتری", desc: "ریلز، استوری و پست بساز. با محتوای جذاب مخاطب جذب کن و جامعه بساز" },
  { num: "۷", icon: "💰", title: "فروش و کسب‌درآمد", desc: "محصول یا خدمتت رو آنلاین بفروش، سفارش بگیر و درآمد واقعی ایجاد کن" },
];

const outcomes = [
  { icon: "🏷️", text: "یک برند شخصی منحصربه‌فرد" },
  { icon: "📱", text: "پیج اینستاگرام حرفه‌ای" },
  { icon: "🎬", text: "حداقل ۱۰ تا ۲۰ ریلز" },
  { icon: "📄", text: "رزومه دیجیتال و نمونه‌کار" },
  { icon: "📦", text: "محصول یا خدمت آماده فروش" },
  { icon: "💪", text: "توانایی ادامه مستقل تولید محتوا" },
];

export default function DiscoverPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "results" | "catalog">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [recommendations, setRecommendations] = useState<Business[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchCategories() {
    try {
      // First try to seed
      await fetch("/api/business-categories", { method: "POST" });
      const res = await fetch("/api/business-categories");
      if (res.ok) {
        const data = await res.json();
        setAllBusinesses(data.categories);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  function handleAnswer(optionTags: string[]) {
    const newAnswers = [...answers, optionTags];
    setAnswers(newAnswers);

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate results
      setLoading(true);
      const tagScores: Record<string, number> = {};
      newAnswers.flat().forEach((tag) => {
        tagScores[tag] = (tagScores[tag] || 0) + 1;
      });

      const categoryScores: Record<number, number> = {};
      Object.entries(tagScores).forEach(([tag, score]) => {
        const catIds = tagToCategoryMap[tag] || [];
        catIds.forEach((id) => {
          categoryScores[id] = (categoryScores[id] || 0) + score;
        });
      });

      const sorted = Object.entries(categoryScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => parseInt(id));

      const recommended = allBusinesses.filter((b) => sorted.includes(b.id));
      setRecommendations(recommended);
      setTimeout(() => {
        setLoading(false);
        setStep("results");
      }, 800);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">دیجی‌آموزش</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/academy" className="px-4 py-2 text-violet-700 font-medium hover:text-violet-800 text-sm">آکادمی</Link>
            <Link href="/collaborate#apply" className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors text-sm">ثبت‌نام</Link>
          </div>
        </div>
      </header>

      {/* ═══ INTRO ═══ */}
      {step === "intro" && (
        <div className="animate-fadeIn">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
            <div className="absolute top-20 right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
            <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-14 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-emerald-200 text-emerald-700 rounded-full text-sm font-semibold mb-8 shadow-sm">
                🔍 کشف کسب‌وکار خانگی مناسب شما
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                مهارتت رو کشف کن،{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  کسب‌وکارت
                </span>{" "}
                رو بساز
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
                با پاسخ به ۵ سوال ساده، کسب‌وکار خانگی مناسب علاقه و مهارتت رو پیدا کن.
                بدون سرمایه زیاد، فقط با موبایل و ابزارهای ساده‌ای مثل Arena.ai.
              </p>
              <button
                onClick={() => setStep("quiz")}
                className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                🚀 شروع تست کشف کسب‌وکار
              </button>
            </div>
          </section>

          {/* Learning Steps */}
          <section className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-3">مسیر از صفر تا فروش</h2>
            <p className="text-gray-500 text-center mb-12">۷ مرحله ساده — قدم‌به‌قدم با شما هستیم</p>
            <div className="space-y-4">
              {learningSteps.map((s) => (
                <div key={s.num} className="flex items-center gap-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black">{s.num}</span>
                      <h3 className="font-bold text-gray-900">{s.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Expected Outcomes */}
          <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-black text-white text-center mb-3">خروجی نهایی دوره</h2>
              <p className="text-emerald-100 text-center mb-10">در پایان این مسیر، این‌ها رو خواهید داشت</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {outcomes.map((o) => (
                  <div key={o.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <span className="text-2xl">{o.icon}</span>
                    <span className="text-white font-medium text-sm">{o.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Business Catalog Preview */}
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-3">کاتالوگ کسب‌وکارهای خانگی</h2>
              <p className="text-gray-500">۱۳ ایده کسب‌وکار قابل اجرا از خانه</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allBusinesses.slice(0, 6).map((b) => (
                <div key={b.id} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer" onClick={() => { setSelectedBusiness(b); setStep("catalog"); }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{b.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${difficultyLabels[b.difficulty]?.color}`}>
                        {difficultyLabels[b.difficulty]?.text}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{b.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>💰 {b.monthlyIncome}</span>
                    <span>📦 {b.startupCost?.split("(")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={() => setStep("catalog")} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                مشاهده همه ۱۳ کسب‌وکار ←
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ═══ QUIZ ═══ */}
      {step === "quiz" && (
        <div className="max-w-2xl mx-auto px-6 py-16 animate-fadeIn">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">سوال {currentQ + 1} از {quizQuestions.length}</span>
              <span className="text-sm font-bold text-emerald-600">{Math.round(((currentQ) / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${(currentQ / quizQuestions.length) * 100}%` }} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">در حال تحلیل پاسخ‌های شما...</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">
                {quizQuestions[currentQ].question}
              </h2>
              <div className="space-y-4">
                {quizQuestions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.tags)}
                    className="w-full text-right p-5 bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-medium text-gray-800">{opt.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ RESULTS ═══ */}
      {step === "results" && (
        <div className="max-w-3xl mx-auto px-6 py-16 animate-fadeIn">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">کسب‌وکارهای مناسب شما</h2>
            <p className="text-gray-500">بر اساس پاسخ‌هایتان، این کسب‌وکارها بیشترین تناسب را با شما دارند</p>
          </div>

          <div className="space-y-5">
            {recommendations.map((b, i) => (
              <div key={b.id} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <span className="text-4xl">{b.icon}</span>
                      {i === 0 && <span className="absolute -top-2 -left-2 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-black">⭐</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{b.name}</h3>
                        {i === 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">بهترین پیشنهاد</span>}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{b.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">💰 {b.monthlyIncome}</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">📦 {b.startupCost}</span>
                        <span className={`px-3 py-1 rounded-full ${difficultyLabels[b.difficulty]?.color}`}>
                          {difficultyLabels[b.difficulty]?.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Tools */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-500 mb-2">🤖 نقش هوش مصنوعی:</h4>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(b.aiToolsUsage || "[]").slice(0, 3).map((t: string) => (
                        <span key={t} className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded-lg">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Content Ideas */}
                  <div className="mt-3">
                    <h4 className="text-xs font-bold text-gray-500 mb-2">🎬 ایده محتوایی:</h4>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(b.contentIdeas || "[]").slice(0, 3).map((c: string) => (
                        <span key={c} className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-lg">{c}</span>
                      ))}
                    </div>
                  </div>

                  <Link href={`/learn/${b.id}`} className="block mt-3 text-center py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">
                    مشاهده مسیر آموزشی ۱۰ مرحله‌ای ←
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 space-y-3">
            <div className="flex flex-wrap justify-center gap-4">
              {recommendations[0] && (
                <Link href={`/learn/${recommendations[0].id}`} className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition-all">
                  🚀 مسیر آموزشی بهترین پیشنهاد
                </Link>
              )}
              <Link href="/collaborate#apply" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                ثبت‌نام در آکادمی
              </Link>
            </div>
            <div>
              <button onClick={() => { setStep("catalog"); }} className="text-sm text-gray-500 hover:text-emerald-600">
                مشاهده همه کسب‌وکارها
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FULL CATALOG ═══ */}
      {step === "catalog" && (
        <div className="max-w-6xl mx-auto px-6 py-16 animate-fadeIn">
          <button onClick={() => setStep("intro")} className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600">
            ← بازگشت
          </button>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">کاتالوگ کامل کسب‌وکارهای خانگی</h2>
            <p className="text-gray-500">روی هر کسب‌وکار کلیک کن تا جزئیات ببینی</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allBusinesses.map((b) => {
              const isOpen = selectedBusiness?.id === b.id;
              return (
                <div key={b.id} className={`bg-white/70 backdrop-blur-xl rounded-2xl border shadow-sm overflow-hidden transition-all ${isOpen ? "border-emerald-300 shadow-lg" : "border-white/80 hover:shadow-md"}`}>
                  <div className="p-5 cursor-pointer" onClick={() => setSelectedBusiness(isOpen ? null : b)}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{b.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{b.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyLabels[b.difficulty]?.color}`}>{difficultyLabels[b.difficulty]?.text}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{b.startupCost?.split("(")[0]}</span>
                        </div>
                      </div>
                      <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 space-y-4 animate-fadeIn border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-600">{b.description}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-50 rounded-xl p-3">
                          <p className="text-xs text-emerald-600 font-medium">درآمد ماهانه</p>
                          <p className="font-bold text-emerald-800 text-sm">{b.monthlyIncome}</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3">
                          <p className="text-xs text-blue-600 font-medium">سرمایه اولیه</p>
                          <p className="font-bold text-blue-800 text-sm">{b.startupCost}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-700 mb-2">🛠 مهارت‌های مورد نیاز:</h4>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(b.skillsNeeded || "[]").map((s: string) => (
                            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-violet-700 mb-2">🤖 کاربرد هوش مصنوعی:</h4>
                        <div className="space-y-1">
                          {JSON.parse(b.aiToolsUsage || "[]").map((a: string) => (
                            <div key={a} className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="w-4 h-4 bg-violet-100 rounded flex items-center justify-center text-violet-600">✓</span>
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-pink-700 mb-2">🎬 ایده ریلز و محتوا:</h4>
                        <div className="space-y-1">
                          {JSON.parse(b.contentIdeas || "[]").map((c: string) => (
                            <div key={c} className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="w-4 h-4 bg-pink-100 rounded flex items-center justify-center text-pink-600">▶</span>
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/learn/${b.id}`} className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-center font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all">
                          مسیر آموزشی ۱۰ مرحله‌ای 🚀
                        </Link>
                        <Link href="/collaborate#apply" className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
                          ثبت‌نام
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">دیجی‌آموزش — کشف مسیر کسب‌وکار خانگی © ۲۰۲۶</p>
        </div>
      </footer>
    </div>
  );
}
