"use client";

import Link from "next/link";

const roles = [
  {
    icon: "👩‍🍳",
    title: "خانم خانه‌دار",
    gradient: "from-pink-400 to-rose-500",
    strengths: ["محصول و مهارت", "تجربه و اعتماد", "وقت کافی"],
    desc: "محصول خانگی، هنر دست، آشپزی، خیاطی یا هر مهارتی که دارید",
  },
  {
    icon: "🧑‍💻",
    title: "نسل Z",
    gradient: "from-blue-400 to-indigo-500",
    strengths: ["تولید ویدیو", "ترند و تدوین", "اجرا جلوی دوربین"],
    desc: "فیلم‌برداری، تدوین، انتشار ریلز و مدیریت پیج اینستاگرام",
  },
];

const pageRoles = [
  { icon: "📄", title: "رزومه", desc: "نمونه ریلزها و پروژه‌های انجام‌شده" },
  { icon: "🛒", title: "فروشگاه", desc: "فروش محصول خانگی، دست‌ساز یا خدمات" },
  { icon: "🎓", title: "کلاس آموزشی", desc: "آموزش همان مهارتی که یاد گرفته‌اید" },
];

const steps = [
  { num: "۱", icon: "📝", title: "ثبت‌نام", desc: "فرم همکاری را تکمیل کنید" },
  { num: "۲", icon: "🎬", title: "نمونه‌کار", desc: "۲ تا ۳ ریلز یا لینک پیج بفرستید" },
  { num: "۳", icon: "🎓", title: "آموزش ۲۴ ساعته", desc: "ویدیوهای یوتیوب + هوش مصنوعی" },
  { num: "۴", icon: "🏗️", title: "ساخت پیج", desc: "پیج شخصی = رزومه + فروشگاه + کلاس" },
  { num: "۵", icon: "🎥", title: "تولید ریلز", desc: "با کمک دوست یا فرزند نسل Z" },
  { num: "۶", icon: "💰", title: "فروش", desc: "محصول یا خدمات خود را آنلاین بفروشید" },
  { num: "۷", icon: "📊", title: "رزومه دیجیتال", desc: "نمونه‌کار واقعی جمع کنید" },
  { num: "۸", icon: "🎓", title: "مربی‌گری", desc: "به دیگران آموزش دهید" },
  { num: "۹", icon: "🤝", title: "همکاری فروش", desc: "از معرفی واقعی آموزش کمیسیون بگیرید" },
];

const incomeWays = [
  { icon: "📦", title: "فروش محصول", desc: "محصول خانگی، دست‌ساز یا خدمات", potential: "۲ تا ۱۰ میلیون/ماه" },
  { icon: "🎓", title: "آموزش", desc: "آموزش مهارتی که یاد گرفتید به دیگران", potential: "۱ تا ۵ میلیون/ماه" },
  { icon: "🤝", title: "همکاری فروش", desc: "معرفی آموزش با کد اختصاصی و دریافت کمیسیون", potential: "۲۰ تا ۳۰ درصد" },
  { icon: "🎬", title: "تولید محتوا", desc: "ریلز تبلیغاتی برای برندها و کسب‌وکارها", potential: "۵۰۰ هزار تا ۳ میلیون/ریلز" },
];

const commissionTiers = [
  { level: "شروع", sales: "اولین فروش", rate: "۲۰٪", color: "from-blue-400 to-blue-600" },
  { level: "نقره‌ای", sales: "۵ فروش موفق", rate: "۲۵٪", color: "from-violet-400 to-purple-600" },
  { level: "طلایی", sales: "۲۰ فروش موفق", rate: "۳۰٪", color: "from-amber-400 to-orange-500" },
];

const example = {
  mother: "مادر ۴۰ ساله — شیرینی‌پز خانگی",
  daughter: "دختر ۱۷ ساله — دانش‌آموز",
  work: [
    "مادر: پخت شیرینی، دستور، پاسخ مشتری",
    "دختر: فیلم‌برداری، تدوین CapCut، انتشار ریلز، هشتگ",
  ],
  results: [
    "۲۰ ریلز در ۳۰ روز",
    "۱۰۰۰+ فالوور",
    "۳۰+ سفارش شیرینی",
    "هایلایت آموزش شیرینی",
    "رزومه دیجیتال واقعی!",
  ],
};

const tools = [
  { name: "CapCut", icon: "✂️", desc: "تدوین ویدیو رایگان" },
  { name: "ChatGPT", icon: "🤖", desc: "ایده و کپشن" },
  { name: "Gemini", icon: "✨", desc: "هشتگ و ترند" },
  { name: "Canva", icon: "🎨", desc: "طراحی کاور" },
  { name: "Instagram", icon: "📸", desc: "انتشار و فروش" },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">TeamCoder</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/collaborate" className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">ثبت‌نام در آکادمی</Link>
          </div>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-violet-200 text-violet-700 rounded-full text-sm font-semibold mb-8 shadow-sm">
            🌟 آکادمی اقتصاد خالق
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            با موبایل و کمک یک دوست،{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
              کسب‌وکار آنلاین
            </span>{" "}
            بسازید
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-10">
            آکادمی اقتصاد خالق برای خانم‌های خانه‌دار و نسل Z.
            مهارت واقعی یاد بگیرید، پیج حرفه‌ای بسازید، محصول بفروشید و درآمد ایجاد کنید.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/collaborate#apply" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300">
              🚀 شروع رایگان
            </Link>
            <a href="#how" className="px-8 py-4 bg-white/70 backdrop-blur text-gray-700 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-white transition-all">
              مراحل کار ↓
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Two Roles ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">ترکیب قدرتمند دو نسل</h2>
          <p className="text-gray-500">هر کسی نقطه قوتی دارد — ترکیب این دو = مینی استودیوی خانگی</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <div key={role.title} className="group bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${role.gradient}`} />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-black text-gray-900">{role.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">{role.desc}</p>
                <div className="space-y-2">
                  {role.strengths.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-violet-50 border border-violet-200 rounded-2xl">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-violet-800">مادر + دختر / خاله + خواهرزاده / دو دوست = تیم دو نفره تولید محتوا</span>
          </div>
        </div>
      </section>

      {/* ═══ Page = Resume + Shop + Class ═══ */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">پیج شما فقط پیج نیست!</h2>
            <p className="text-gray-500">یک پیج اینستاگرام می‌تواند همزمان سه نقش داشته باشد</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageRoles.map((r, i) => (
              <div key={i} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-5xl mb-4">{r.icon}</div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Real Example ═══ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">مثال واقعی</h2>
            <p className="text-gray-500">مادر + دختر ۱۷ ساله — شیرینی خانگی</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-2xl">
                  <span className="text-3xl">👩‍🍳</span>
                  <div>
                    <p className="font-bold text-gray-900">مادر</p>
                    <p className="text-sm text-gray-500">{example.mother}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <span className="text-3xl">👧</span>
                  <div>
                    <p className="font-bold text-gray-900">دختر</p>
                    <p className="text-sm text-gray-500">{example.daughter}</p>
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-3">تقسیم کار:</h4>
              <div className="space-y-2 mb-6">
                {example.work.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-xs">{i + 1}</span>
                    {w}
                  </div>
                ))}
              </div>
              <h4 className="font-bold text-gray-900 mb-3">نتیجه بعد از ۳۰ روز:</h4>
              <div className="flex flex-wrap gap-3">
                {example.results.map((r) => (
                  <span key={r} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200">
                    ✅ {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Steps ═══ */}
      <section id="how" className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">مسیر کامل از صفر تا درآمد</h2>
            <p className="text-violet-200">۹ مرحله ساده — قدم‌به‌قدم با شما هستیم</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((step) => (
              <div key={step.num} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-black text-white">
                    {step.num}
                  </span>
                  <span className="text-2xl group-hover:scale-110 transition-transform">{step.icon}</span>
                  <h3 className="font-bold text-white text-sm">{step.title}</h3>
                </div>
                <p className="text-sm text-violet-200">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Income Ways ═══ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">مسیرهای درآمدی واقعی</h2>
            <p className="text-gray-500">درآمد از فروش محصول و خدمات خودتان — نه زیرمجموعه‌گیری</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incomeWays.map((way) => (
              <div key={way.title} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{way.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{way.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{way.desc}</p>
                    <span className="text-xs font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full">
                      💰 {way.potential}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Affiliate Commission ═══ */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              🤝 برنامه همکاری در فروش
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">کد اختصاصی، کمیسیون واقعی</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              هر فرد یک کد دعوت اختصاصی دارد. از معرفی واقعی آموزش به دیگران، کمیسیون دریافت کنید.
            </p>
          </div>

          {/* Commission Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {commissionTiers.map((tier) => (
              <div key={tier.level} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white text-2xl font-black">{tier.rate}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{tier.level}</h3>
                <p className="text-sm text-gray-500">{tier.sales}</p>
              </div>
            ))}
          </div>

          {/* Example Code */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">مثال: کد اختصاصی شما</h3>
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-mono text-lg tracking-wider mb-3">
                SAHRA20
              </div>
              <p className="text-sm text-gray-500">
                هر ثبت‌نام با این کد = <strong className="text-green-600">۲۰٪ کمیسیون</strong> برای شما.
                قابل پیگیری، شفاف و واقعی.
              </p>
            </div>
            <div className="text-amber-600 bg-amber-50 px-4 py-3 rounded-xl text-sm font-medium">
              ⚠️ پرداخت فقط برای فروش‌های ثبت‌شده و قابل رهگیری
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Important Note ═══ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-7 flex gap-4">
            <span className="text-3xl flex-shrink-0">💡</span>
            <div>
              <h3 className="font-black text-blue-900 mb-2">پیام ما</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                ما مهارت واقعی (ساخت پیج، ریلز، فروش آنلاین و برند شخصی) آموزش می‌دهیم.
                درآمد از فروش محصول، خدمات یا آموزش خود فرد ایجاد می‌شود؛
                برنامه همکاری در فروش فقط برای معرفی واقعی آموزش استفاده می‌شود.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Tools ═══ */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">ابزارهای رایگان مورد نیاز</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool) => (
              <div key={tool.name} className="flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{tool.name}</p>
                  <p className="text-xs text-gray-500">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">آماده‌اید شروع کنید؟</h2>
          <p className="text-gray-500 text-lg mb-8">
            همین الان فرم همکاری را تکمیل کنید و اولین قدم را بردارید
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/collaborate#apply" className="px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300">
              📝 ثبت‌نام در آکادمی
            </Link>
            <Link href="/collaborate" className="px-10 py-5 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
              مشاهده جزئیات بیشتر
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <span className="text-lg font-bold">TeamCoder Academy</span>
          </div>
          <p className="text-gray-500 text-sm">آکادمی اقتصاد خالق — © ۲۰۲۴</p>
        </div>
      </footer>
    </div>
  );
}
