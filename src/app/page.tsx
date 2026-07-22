import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">TeamCoder</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              ثبت‌نام
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            🚀 پلتفرم مدیریت تیم برنامه‌نویسی
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            تیم خود را{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              هوشمندانه
            </span>{" "}
            مدیریت کنید
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            با TeamCoder پروژه‌ها، وظایف، پرداخت‌ها و ارتباطات تیم خود را در یک
            پلتفرم واحد مدیریت کنید. مناسب تیم‌های کوچک و بزرگ.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
            >
              شروع رایگان
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-medium text-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              ورود به حساب
            </Link>
            <Link
              href="/collaborate"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium text-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25"
            >
              🎬 همکاری با ما
            </Link>
            <Link
              href="/academy"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
            >
              🌟 آکادمی
            </Link>
            <Link
              href="/discover"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
            >
              🔍 کشف کسب‌وکار
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">امکانات کلیدی</h2>
          <p className="text-gray-500 mt-3">هر آنچه برای مدیریت تیم نیاز دارید</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon="📁"
            title="مدیریت پروژه‌ها"
            desc="ایجاد، پیگیری و مدیریت پروژه‌ها با جزئیات کامل شامل بودجه، مهلت و اعضای تیم"
          />
          <FeatureCard
            icon="✅"
            title="مدیریت وظایف"
            desc="تعریف وظایف، تعیین اولویت و مسئول، و پیگیری وضعیت انجام هر وظیفه"
          />
          <FeatureCard
            icon="💬"
            title="پیام‌رسانی"
            desc="ارتباط مستقیم بین اعضای تیم با سیستم پیام‌رسانی داخلی"
          />
          <FeatureCard
            icon="💰"
            title="مدیریت پرداخت‌ها"
            desc="ثبت و پیگیری پرداخت‌ها به اعضای تیم برای هر پروژه"
          />
          <FeatureCard
            icon="🔔"
            title="اعلان‌ها"
            desc="دریافت اعلان‌های لحظه‌ای برای وظایف جدید، پیام‌ها و پرداخت‌ها"
          />
          <FeatureCard
            icon="👥"
            title="مدیریت تیم"
            desc="مشاهده اعضای تیم با نقش‌های مختلف: کارفرما، برنامه‌نویس و مدیر پروژه"
          />
        </div>
      </section>

      {/* Roles */}
      <section className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">نقش‌های کاربری</h2>
            <p className="text-gray-500 mt-3">هر نقش دسترسی‌های مخصوص خود را دارد</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">کارفرما</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">✓ ایجاد پروژه جدید</li>
                <li className="flex items-center gap-2">✓ مشاهده پیشرفت پروژه‌ها</li>
                <li className="flex items-center gap-2">✓ مدیریت پرداخت‌ها</li>
                <li className="flex items-center gap-2">✓ ارتباط با تیم</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="text-4xl mb-4">👨‍💻</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">برنامه‌نویس</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">✓ مشاهده وظایف اختصاص داده شده</li>
                <li className="flex items-center gap-2">✓ بروزرسانی وضعیت وظایف</li>
                <li className="flex items-center gap-2">✓ مشاهده پروژه‌ها</li>
                <li className="flex items-center gap-2">✓ ارتباط با تیم</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">مدیر پروژه</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">✓ مدیریت کامل پروژه‌ها</li>
                <li className="flex items-center gap-2">✓ ایجاد و تخصیص وظایف</li>
                <li className="flex items-center gap-2">✓ مدیریت اعضای تیم</li>
                <li className="flex items-center gap-2">✓ مشاهده آمار و گزارش‌ها</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            به تیم تولید محتوای ما بپیوندید!
          </h2>
          <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            اگر به ساخت ریلز و تولید محتوای ویدیویی علاقه‌مندید، با ما همکاری کنید.
            آموزش رایگان، پروژه آزمایشی و شروع همکاری حرفه‌ای.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/collaborate"
              className="px-8 py-4 bg-white text-violet-700 rounded-xl font-bold text-lg hover:bg-violet-50 transition-all shadow-lg"
            >
              مشاهده مراحل همکاری ←
            </Link>
            <Link
              href="/academy"
              className="px-8 py-4 bg-violet-800 text-white rounded-xl font-bold text-lg hover:bg-violet-900 transition-all shadow-lg"
            >
              🌟 آکادمی اقتصاد خالق ←
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-lg font-bold">TeamCoder</span>
          </div>
          <p className="text-gray-400 text-sm">
            پلتفرم مدیریت تیم برنامه‌نویسی و پروژه‌ها
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © ۲۰۲۴ TeamCoder. تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
