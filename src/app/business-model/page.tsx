import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "مدل کسب‌وکار دیجی‌آموزش | بوم مدل کسب‌وکار (BMC)",
  description:
    "بوم مدل کسب‌وکار پلتفرم دیجی‌آموزش: از بخش‌های مشتریان و ارزش پیشنهادی تا کانال‌ها، منابع، هزینه‌ها و جریان‌های درآمدی — شفاف و یک‌نگاه.",
};

type Block = {
  cls: string;
  icon: string;
  title: string;
  color: string;
  soft: string;
  items: string[];
};

const BLOCKS: Block[] = [
  {
    cls: "bmc-segments",
    icon: "🧕",
    title: "بخش‌های مشتریان",
    color: "#FF6B5B",
    soft: "#FFE9E6",
    items: [
      "خانم‌های خانه‌دار که می‌خواهند از خانه درآمد بسازند",
      "صاحبان مهارت دستی بدون تجربهٔ فروش آنلاین",
      "مادران کارآفرین با زمان محدود",
      "مربیان و مشاوران آنلاین تازه‌کار",
    ],
  },
  {
    cls: "bmc-relationships",
    icon: "❤️",
    title: "روابط با مشتریان",
    color: "#12B5A5",
    soft: "#DFF7F4",
    items: [
      "تمرین و بازخورد شخصی در هر قسمت دوره",
      "جامعهٔ حمایتی فارسی‌زبان",
      "خبرنامهٔ هفتگی با نکته‌های عملی",
      "همراهی در مسیر ۵ مرحله‌ای تا اولین فروش",
    ],
  },
  {
    cls: "bmc-channels",
    icon: "📢",
    title: "کانال‌های ارتباطی",
    color: "#FFB020",
    soft: "#FFF4DE",
    items: [
      "سایت و وبلاگ (سئو + محتوای رایگان)",
      "اینستاگرام و ریلز آموزشی",
      "گروه‌های تلگرامی و واتس‌اپی",
      "معرفی کاربران راضی (ریفرال)",
    ],
  },
  {
    cls: "bmc-activities",
    icon: "⚙️",
    title: "فعالیت‌های کلیدی",
    color: "#6C4CF1",
    soft: "#EEE9FE",
    items: [
      "تولید و به‌روزرسانی دوره‌ها با کمک هوش مصنوعی",
      "توسعه و نگهداری پلتفرم وب",
      "بازاریابی محتوایی و سئو",
      "پشتیبانی و بازخورد به کاربران",
    ],
  },
  {
    cls: "bmc-resources",
    icon: "🧰",
    title: "منابع کلیدی",
    color: "#4C9CF1",
    soft: "#E3F1FE",
    items: [
      "پلتفرم وب (Next.js + PostgreSQL)",
      "کتابخانهٔ محتوا: ۱۸ مقاله، ۱۵ سناریوی ویدیو، دورهٔ ۱۰ قسمتی هر حوزه",
      "تیم محتوا و متخصصان AI",
      "جامعهٔ کاربران و دادهٔ یادگیری‌شان",
    ],
  },
  {
    cls: "bmc-partners",
    icon: "🤝",
    title: "شرکای کلیدی",
    color: "#8B5CF6",
    soft: "#F1EAFE",
    items: [
      "ارائه‌دهندگان هوش مصنوعی (Gemini، Veo/Flow)",
      "بازارهای فروش (باسلام، اینستاگرام شاپ)",
      "مدرسان و متخصصان هر حوزه",
      "درگاه پرداخت و زیرساخت ابری",
    ],
  },
];

const COSTS = [
  "زیرساخت ابری (شروع رایگان: Vercel + Neon)",
  "تولید محتوا و تجهیزات ضبط",
  "تبلیغات و جذب کاربر",
  "پشتیبانی و توسعهٔ تیم",
];

const REVENUES = [
  "اشتراک ماهانهٔ دوره‌های پریمیوم",
  "کارگاه‌های زندهٔ تک‌جلسه‌ای",
  "قالب‌ها و ابزارهای آمادهٔ پولی",
  "کمیسیون همکاری در فروش ابزارها",
];

function BmcBlock({ b }: { b: Block }) {
  return (
    <div
      className={`bmc-block ${b.cls}`}
      style={{ ["--bc" as string]: b.color, ["--bbs" as string]: b.soft } as React.CSSProperties}
    >
      <h3>
        <span className="bi">{b.icon}</span> {b.title}
      </h3>
      <ul>
        {b.items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export default function BusinessModelPage() {
  return (
    <SiteChrome active="model">
      <main className="bmc-hero">
        <div className="container">
          <span className="kicker">📋 بوم مدل کسب‌وکار (Business Model Canvas)</span>
          <h1>
            نقشهٔ یک‌نگاهٔ <span className="hl">دیجی‌آموزش</span>
          </h1>
          <p>
            این بوم نشان می‌دهد دیجی‌آموزش چطور برای چه کسانی، با چه ارزشی، از چه راهی و با چه
            هزینه و درآمدی کار می‌کند — دقیقاً همان ابزاری که در مسیر «ساخت برند» به کسب‌وکارهای
            خانگی هم یاد می‌دهیم!
          </p>
        </div>
      </main>

      <section className="bmc-wrap">
        <div className="container">
          <div className="bmc-grid">
            {BLOCKS.map((b) => (
              <BmcBlock key={b.cls} b={b} />
            ))}

            {/* ارزش پیشنهادی — قلب بوم */}
            <div
              className="bmc-block bmc-vp"
              style={{ ["--bc" as string]: "#5237D6" } as React.CSSProperties}
            >
              <h3>
                <span className="bi">💎</span> ارزش پیشنهادی
              </h3>
              <ul>
                <li>تنها آکادمی فارسی‌زبان: کسب‌وکار خانگی + هوش مصنوعی، در یک مسیر واحد</li>
                <li>مسیر ۵ مرحله‌ای از یادگیری مهارت تا فروش آنلاین</li>
                <li>دورهٔ ۱۰ قسمتی برای ۱۵ حوزهٔ پرتقاضا</li>
                <li>ابزارهای آماده: پرامپت جمینای، سناریو و استوری‌برد Veo</li>
                <li>شروع رایگان — ارتقا وقتی درآمد ساختی</li>
              </ul>
            </div>

            <div
              className="bmc-block bmc-cost"
              style={{ ["--bc" as string]: "#F25C7A", ["--bbs" as string]: "#FEEAF0" } as React.CSSProperties}
            >
              <h3>
                <span className="bi">💸</span> ساختار هزینه‌ها
              </h3>
              <ul>
                {COSTS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div
              className="bmc-block bmc-revenue"
              style={{ ["--bc" as string]: "#12B5A5", ["--bbs" as string]: "#DFF7F4" } as React.CSSProperties}
            >
              <h3>
                <span className="bi">💰</span> جریان‌های درآمدی
              </h3>
              <ul>
                {REVENUES.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bmc-note">
            <span>💡</span>
            <div>
              <b>نکتهٔ آموزشی:</b> همین بوم را می‌توانی برای کسب‌وکار خانگی خودت هم بکشی! در قسمت
              سوم مسیر رشد (ساخت برند) قدم‌به‌قدم یاد می‌گیری چطور این ۹ خانه را برای حوزهٔ خودت پر
              کنی. <Link href="/register" style={{ color: "var(--primary)", fontWeight: 800 }}>شروع مسیر ←</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
