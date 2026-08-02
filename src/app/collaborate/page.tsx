"use client";

import { useState } from "react";
import Link from "next/link";

/* ──────────────────────────── Data ──────────────────────────── */

const steps = [
  { num: "۱", icon: "📝", title: "ثبت فرم", desc: "فرم همکاری را تکمیل کنید و اطلاعات اولیه خود را وارد نمایید." },
  { num: "۲", icon: "🎬", title: "ارسال نمونه‌کار", desc: "۲ تا ۳ نمونه ویدیوی کوتاه (ریلز) یا لینک پیج اینستاگرام خود را بفرستید." },
  { num: "۳", icon: "🔍", title: "بررسی و انتخاب", desc: "تیم ما نمونه‌کارها را بررسی می‌کند. در صورت مناسب بودن، وارد آموزش می‌شوید." },
  { num: "۴", icon: "🎓", title: "آموزش رایگان", desc: "ویدیوهای آموزشی یوتیوب + ابزارهای AI. مهلت: ۲۴ ساعت." },
  { num: "۵", icon: "🎥", title: "پروژه آزمایشی", desc: "تولید ۱ تا ۳ ریلز کوتاه با دوستان یا خانواده. مهلت: ۲۴ ساعت." },
  { num: "۶", icon: "🤝", title: "شروع همکاری", desc: "پس از تایید، همکاری رسمی آغاز می‌شود!" },
];

const trainingCards = [
  {
    icon: "💡",
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-orange-500/20",
    title: "ایده‌پردازی ریلز با Arena.ai و Gemini",
    desc: "یاد بگیرید چطور با ابزارهای هوش مصنوعی مثل Arena.ai ایده‌های خلاقانه برای ریلز پیدا کنید، سناریو بنویسید و موضوعات ترند را شناسایی کنید.",
    badge: "AI",
  },
  {
    icon: "✂️",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-purple-500/20",
    title: "تدوین سریع با CapCut",
    desc: "از صفر تا صد تدوین ریلز با اپلیکیشن CapCut: برش، افکت، موزیک، ترنزیشن و خروجی با کیفیت.",
    badge: "تدوین",
  },
  {
    icon: "✍️",
    gradient: "from-cyan-400 to-blue-500",
    shadow: "shadow-blue-500/20",
    title: "ساخت کپشن و هشتگ با هوش مصنوعی",
    desc: "با ChatGPT کپشن‌های جذاب بنویسید و هشتگ‌های موثر پیدا کنید تا ریلز شما بیشتر دیده شود.",
    badge: "AI",
  },
  {
    icon: "📱",
    gradient: "from-emerald-400 to-teal-500",
    shadow: "shadow-teal-500/20",
    title: "فیلم‌برداری حرفه‌ای با موبایل",
    desc: "نورپردازی، زاویه دوربین، فوکوس و تکنیک‌های فیلم‌برداری حرفه‌ای فقط با گوشی موبایل.",
    badge: "فیلم‌برداری",
  },
];

const checklist = [
  { icon: "📐", text: "ویدیو عمودی 9:16" },
  { icon: "🔊", text: "کیفیت مناسب صدا و تصویر" },
  { icon: "📝", text: "استفاده از متن روی تصویر" },
  { icon: "⚡", text: "شروع جذاب در ۳ ثانیه اول" },
  { icon: "💬", text: "پایان با دعوت به تعامل (کامنت یا فالو)" },
];

const tools = [
  { name: "CapCut", icon: "✂️", color: "from-violet-500 to-purple-600", desc: "تدوین ویدیو" },
  { name: "Canva", icon: "🎨", color: "from-cyan-400 to-blue-500", desc: "طراحی گرافیک" },
  { name: "Arena.ai", icon: "🟣", color: "from-emerald-400 to-green-500", desc: "ایده و سناریو" },
  { name: "Gemini", icon: "✨", color: "from-blue-400 to-indigo-500", desc: "هوش مصنوعی گوگل" },
  { name: "Instagram", icon: "📸", color: "from-pink-500 to-rose-500", desc: "انتشار ریلز" },
];

/* ──────────────────────────── Page ──────────────────────────── */

export default function CollaboratePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", age: "", city: "",
    instagramHandle: "", hasActivePage: false, hasReelsExperience: false,
    canWorkWithFriends: false, portfolioLink1: "", portfolioLink2: "",
    portfolioLink3: "", motivationText: "", skillsDescription: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const portfolioLinks = [form.portfolioLink1, form.portfolioLink2, form.portfolioLink3].filter(Boolean);
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName, email: form.email, phone: form.phone,
          age: form.age, city: form.city, instagramHandle: form.instagramHandle,
          hasActivePage: form.hasActivePage, hasReelsExperience: form.hasReelsExperience,
          canWorkWithFriends: form.canWorkWithFriends, portfolioLinks,
          motivationText: form.motivationText, skillsDescription: form.skillsDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "خطا در ثبت درخواست"); return; }
      setSubmitted(true);
    } catch { setError("خطا در اتصال به سرور"); } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* ═══ Header ═══ */}
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">دیجی‌آموزش</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 text-gray-600 font-medium hover:text-blue-600 transition-colors">ورود</Link>
            <Link href="/register" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">ثبت‌نام</Link>
          </div>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-violet-200 text-violet-700 rounded-full text-sm font-semibold mb-8 shadow-sm">
            🎬 به تیم تولید محتوای ما بپیوندید
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            مراحل{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
              همکاری
            </span>{" "}
            با تیم ما
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            فرم ثبت‌نام → نمونه‌کار → آموزش رایگان با AI و Arena.ai → پروژه آزمایشی → همکاری رسمی
          </p>
        </div>
      </section>

      {/* ═══ Steps ═══ */}
      <section className="max-w-6xl mx-auto px-6 -mt-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div key={step.num} className="group relative bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <span className="w-7 h-7 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-black">{step.num}</span>
                <h3 className="font-bold text-gray-900 text-sm">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           آموزش رایگان و پروژه آزمایشی — سکشن اصلی جدید
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/40 to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-violet-100/50 via-purple-50/30 to-blue-100/40 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 space-y-16">

          {/* ── Title Block ── */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-md border border-violet-200/60 text-violet-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
              🎓 مرحله ۴ و ۵ همکاری
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-5">
              آموزش رایگان تولید ریلز{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                با کمک هوش مصنوعی
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
              پس از بررسی فرم و نمونه‌کار، در صورت مناسب بودن، دسترسی به آموزش‌های رایگان برای شما فعال می‌شود.
              این آموزش‌ها شامل ویدیوهای منتخب یوتیوب و راهنمای استفاده از ابزارهای هوش مصنوعی برای
              ایده‌پردازی، نوشتن سناریو، تدوین و ساخت ریلز است.
            </p>
          </div>

          {/* ── 4 Training Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingCards.map((card, i) => (
              <div
                key={i}
                className="group relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${card.gradient}`} />

                <div className="p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-xl ${card.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-base">{card.title}</h3>
                      </div>
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${card.gradient} text-white shadow-sm`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{card.desc}</p>
                  <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${card.gradient} text-white text-sm font-bold shadow-lg ${card.shadow} hover:brightness-110 active:scale-[0.98] transition-all duration-200`}>
                    مشاهده آموزش ▸
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Timer Box ── */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-xl" />
            <div className="relative bg-white/70 backdrop-blur-xl border-2 border-amber-200/60 rounded-3xl p-8 flex items-center gap-6 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-5xl shadow-xl shadow-orange-500/20 flex-shrink-0 animate-pulse">
                ⏰
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">مهلت مشاهده آموزش‌ها</h3>
                <p className="text-gray-600 leading-relaxed">
                  حداکثر <span className="font-black text-amber-600 text-lg">۲۴ ساعت</span> پس از فعال شدن دسترسی.
                  در این مدت باید ویدیوهای آموزشی را مشاهده کرده و با اصول اولیه تولید ریلز،
                  تدوین ساده، کپشن‌نویسی و انتشار محتوا آشنا شوید.
                </p>
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4 max-w-lg mx-auto">
            <div className="flex-1 h-px bg-gradient-to-l from-violet-300 to-transparent" />
            <span className="text-violet-400 text-2xl">▼</span>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-300 to-transparent" />
          </div>

          {/* ── Test Project Section ── */}
          <div>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-md border border-purple-200/60 text-purple-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
                🎥 پروژه آزمایشی
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5">
                اولین پروژه شما
              </h2>
              <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
                پس از پایان آموزش، باید <span className="font-bold text-gray-700">۱ تا ۳ ریلز کوتاه (۱۵ تا ۶۰ ثانیه)</span> تولید کنید.
                می‌توانید از دوستان، خواهر یا برادر، اعضای خانواده یا هم‌تیمی‌های هم‌سن خود
                برای ضبط ویدیو کمک بگیرید. هدف این مرحله سنجش خلاقیت، اجرای جلوی دوربین
                و توانایی تولید محتوای واقعی است.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Checklist Card */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-8">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">✓</span>
                  چک‌لیست پروژه
                </h3>
                <div className="space-y-4">
                  {checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-2xl hover:bg-violet-50/60 transition-colors group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs + Info Card */}
              <div className="space-y-6">
                {/* Quick Specs */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-8">
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">📋</span>
                    مشخصات ریلز
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "تعداد", value: "۱ تا ۳ ویدیو" },
                      { label: "مدت", value: "۱۵ تا ۶۰ ثانیه" },
                      { label: "فرمت", value: "عمودی (9:16)" },
                      { label: "موضوع", value: "آموزشی، ترند، روزمره یا تبلیغاتی" },
                      { label: "مهلت", value: "۲۴ ساعت پس از دریافت پروژه" },
                    ].map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-500">{spec.label}</span>
                        <span className="text-sm font-bold text-gray-800">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-lg shadow-purple-500/20 p-7 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💡</span>
                    <h3 className="font-black">نکته طلایی</h3>
                  </div>
                  <p className="text-sm text-violet-100 leading-relaxed">
                    لازم نیست ویدیوی شما کاملاً حرفه‌ای باشد. مهم خلاقیت، انرژی و توانایی
                    ارتباط با مخاطب است. از هوش مصنوعی برای ایده‌پردازی و سناریو کمک بگیرید!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Recommended Tools ── */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 mb-2">ابزارهای پیشنهادی</h3>
              <p className="text-gray-500 text-sm">از این ابزارها برای تولید محتوای حرفه‌ای استفاده کنید</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="group bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-40 text-center"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{tool.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA Button ── */}
          <div className="text-center pt-4">
            <a
              href="#apply"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <span className="text-2xl">🚀</span>
              شروع آموزش و دریافت پروژه آزمایشی
            </a>
            <p className="text-sm text-gray-400 mt-4">پس از ثبت فرم و تأیید اولیه، دسترسی فعال می‌شود</p>
          </div>
        </div>
      </section>

      {/* ═══ Ideal Candidates ═══ */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydjJoMnY0aC0ydjJoMnY0aDJ2Mmg0di0yaDJ2LTJoLTJ2LTRoMnYtMmgtNHYtMnpNMzAgMzBoMnYyaC0yek0zNiAzMGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white text-center mb-3">چه افرادی شانس بیشتری دارند؟</h2>
          <p className="text-violet-200 text-center mb-10">اگر این ویژگی‌ها را دارید، منتظرتان هستیم!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "پیج فعال اینستاگرام دارند",
              "به ریلز و ترندهای روز علاقه‌مندند",
              "می‌توانند با دوستان محتوا تولید کنند",
              "از موبایل برای فیلم‌برداری و تدوین استفاده می‌کنند",
              "آموزش را سریع یاد می‌گیرند و اجرا می‌کنند",
              "توانایی اجرا جلوی دوربین دارند",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-colors">
                <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">✓</span>
                <span className="text-white text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Important Note ═══ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-amber-50/80 backdrop-blur-md border border-amber-200/60 rounded-3xl p-7 flex gap-4 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">⚠️</div>
            <div>
              <h3 className="font-black text-amber-900 mb-2">نکته مهم</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                این همکاری پروژه‌ای و مهارت‌محور است. پذیرش نهایی بر اساس کیفیت نمونه‌کار،
                انجام پروژه آزمایشی و توانایی تولید محتوای واقعی انجام می‌شود، نه صرفاً
                داشتن سابقه کاری.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Application Form ═══ */}
      <section id="apply" className="py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-6">
              📝 فرم ثبت‌نام
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">فرم درخواست همکاری</h2>
            <p className="text-gray-500">اطلاعات خود را با دقت تکمیل کنید</p>
          </div>

          {submitted ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl p-12 text-center animate-fadeIn">
              <div className="text-7xl mb-6">🎉</div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">درخواست شما ثبت شد!</h3>
              <p className="text-gray-500 mb-8 text-lg">
                از اینکه علاقه‌مند به همکاری با ما هستید متشکریم. تیم ما درخواست شما
                را بررسی خواهد کرد و نتیجه از طریق ایمیل یا تلفن اطلاع‌رسانی می‌شود.
              </p>
              <Link href="/" className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all">
                بازگشت به صفحه اصلی
              </Link>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl p-8 md:p-10">
              {error && <div className="mb-6 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-sm">👤</span>
                    اطلاعات شخصی
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="نام و نام خانوادگی *" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="مثال: علی رضایی" />
                    <Input label="ایمیل *" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="email@example.com" dir="ltr" />
                    <Input label="شماره تلفن *" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="0912XXXXXXX" dir="ltr" />
                    <Input label="سن" name="age" type="number" min={14} max={40} value={form.age} onChange={handleChange} placeholder="مثال: ۲۲" />
                    <div className="md:col-span-2">
                      <Input label="شهر" name="city" value={form.city} onChange={handleChange} placeholder="مثال: تهران" />
                    </div>
                  </div>
                </div>

                {/* Instagram */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-sm">📱</span>
                    اطلاعات اینستاگرام
                  </h3>
                  <div className="space-y-4">
                    <Input label="آیدی اینستاگرام" name="instagramHandle" value={form.instagramHandle} onChange={handleChange} placeholder="@your_username" dir="ltr" />
                    <div className="space-y-3">
                      <Checkbox label="پیج فعال اینستاگرام دارم" name="hasActivePage" checked={form.hasActivePage} onChange={handleChange} />
                      <Checkbox label="تجربه ساخت ریلز دارم" name="hasReelsExperience" checked={form.hasReelsExperience} onChange={handleChange} />
                      <Checkbox label="می‌توانم با دوستان و خانواده محتوا تولید کنم" name="canWorkWithFriends" checked={form.canWorkWithFriends} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">🎬</span>
                    نمونه‌کار
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">لینک ۲ تا ۳ نمونه ویدیو (ریلز، شورتز و...)</p>
                  <div className="space-y-3">
                    <input type="url" name="portfolioLink1" value={form.portfolioLink1} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 outline-none transition-all text-sm" placeholder="https://instagram.com/reel/..." dir="ltr" />
                    <input type="url" name="portfolioLink2" value={form.portfolioLink2} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 outline-none transition-all text-sm" placeholder="https://instagram.com/reel/..." dir="ltr" />
                    <input type="url" name="portfolioLink3" value={form.portfolioLink3} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 outline-none transition-all text-sm" placeholder="https://instagram.com/reel/... (اختیاری)" dir="ltr" />
                  </div>
                </div>

                {/* Motivation */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">💬</span>
                    درباره شما
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">چرا می‌خواهید با ما همکاری کنید؟</label>
                      <textarea name="motivationText" value={form.motivationText} onChange={handleChange} rows={3} className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 outline-none resize-none transition-all text-sm" placeholder="انگیزه خود را بنویسید..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">مهارت‌ها و توانایی‌های شما</label>
                      <textarea name="skillsDescription" value={form.skillsDescription} onChange={handleChange} rows={3} className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 outline-none resize-none transition-all text-sm" placeholder="تدوین، فیلم‌برداری، اجرا جلوی دوربین و..." />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full py-4.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0">
                  {submitting ? "⏳ در حال ثبت..." : "🚀 ثبت درخواست همکاری"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <span className="text-lg font-bold">دیجی‌آموزش</span>
          </div>
          <p className="text-gray-500 text-sm">© ۲۰۲۶ دیجی‌آموزش. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────── Reusable Components ───────────────────── */

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input {...props} className={`w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 outline-none transition-all text-sm ${props.className || ""}`} />
    </div>
  );
}

function Checkbox({ label, name, checked, onChange }: { label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group px-4 py-3 rounded-xl hover:bg-violet-50/50 transition-colors">
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-violet-600 border-violet-600" : "border-gray-300 group-hover:border-violet-400"}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}
