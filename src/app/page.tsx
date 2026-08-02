"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ARTICLES, businesses, episodes } from "@/lib/digi-content";
import { HERO_IMG } from "@/lib/hero-img";
import "./digi.css";

const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

const STEPS = [
  { c: "#6C4CF1", s: "#EEE9FE", t: "یادگیری مهارت", d: "آموزش اصولی حرفه‌ات؛ از مبانی تا نکته‌های حرفه‌ای بازار." },
  { c: "#F2503E", s: "#FFE9E6", t: "استفاده از هوش مصنوعی", d: "کار با ابزارهای AI برای ایده، طراحی، متن و تصویر." },
  { c: "#0FA896", s: "#DFF7F4", t: "ساخت برند", d: "نام، لوگو، رنگ و شخصیت برند که ماندگار می‌شود." },
  { c: "#E8920C", s: "#FFF1DA", t: "تولید محتوا", d: "ریلز، استوری، کپشن و تقویم محتوایی حرفه‌ای." },
  { c: "#5D63EA", s: "#E9EBFE", t: "فروش آنلاین", d: "راه‌اندازی فروش، پاسخ به مشتری و مدیریت سفارش‌ها." },
];
const PALETTE = [
  ["#6C4CF1", "#EEE9FE"], ["#F2503E", "#FFE9E6"], ["#0FA896", "#DFF7F4"], ["#E8920C", "#FFF1DA"],
  ["#5D63EA", "#E9EBFE"], ["#D43D96", "#FCE9F4"], ["#2E90D4", "#E4F2FB"], ["#7A9E1E", "#F0F7DF"],
];
const FEATURED = [
  { href: "/blog/roadmap-first-sale", c: "#6C4CF1", s: "#EEE9FE", tag: "🗺️ شروع مسیر", t: "از ایده تا اولین فروش؛ نقشهٔ راه کسب‌وکار خانگی", p: "قبل از هر ابزاری، نقشهٔ راه لازم داری: چه آموزشی، چه محتوایی و سایتت را کجا بگذاری تا به اولین فروش برسی.", m: "۷" },
  { href: "/blog/ai-content-techniques", c: "#0FA896", s: "#DFF7F4", tag: "🤖 هوش مصنوعی", t: "تکنیک‌های تولید محتوا با AI که واقعاً جواب می‌دهند", p: "پرامپت‌نویسی درست، قاعدهٔ ۵×۱، ساخت تقویم ۳۰ روزه و تبدیل کپشن به مقالهٔ سئوشدهٔ سایت.", m: "۶" },
  { href: "/blog/arena-ai-content-calendar", c: "#D43D96", s: "#FCE9F4", tag: "🟣 Arena.ai", t: "چطور با Arena.ai تقویم محتوایی رایگان و سریع بسازیم؟", p: "یاد بگیر چطور از Arena.ai برای ایده، برنامه هفتگی محتوا، کپشن و ساخت مقاله استفاده کنی؛ ساده، سریع و کم‌هزینه.", m: "۶" },
  { href: "/blog/arena-ai-reels-prompts", c: "#E8920C", s: "#FFF1DA", tag: "🎬 Arena.ai", t: "آموزش ساخت هوک، سناریو و کپشن ریلز با Arena.ai", p: "برای هر ریلز، هوک ۳ ثانیه‌ای، سناریو، متن روی تصویر و CTA بگیر و سریع‌تر محتوا بساز.", m: "۷" },
];

function LogoMark() {
  return (
    <span className="logo-mark">
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M31.5 13 5 25l26.5 12L58 25 31.5 13z" fill="#FFF7EF" />
        <path d="M14 30.5V39c0 4.4 7.8 8 17.5 8s17.5-3.6 17.5-8V30.5l-17.5 8z" fill="#FFF7EF" opacity=".9" />
      </svg>
    </span>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [openEps, setOpenEps] = useState<Set<number>>(new Set());
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, [q]);

  const list = !q.trim()
    ? businesses
    : businesses.filter((b) => b.name.includes(q.trim()) || b.items.some((t) => t.includes(q.trim())));
  const pct = Math.round((openEps.size / episodes.length) * 100);

  return (
    <div className="digisite">
      {/* ======= HEADER ======= */}
      <header className={`ds-header${scrolled ? " scrolled" : ""}`}>
        <div className="container header-inner">
          <Link href="/" className="logo"><LogoMark /> دیجی‌آموزش</Link>
          <nav className={`main-nav${menuOpen ? " open" : ""}`} id="mainNav" onClick={(e) => { if ((e.target as HTMLElement).tagName === "A") setMenuOpen(false); }}>
            <a href="#path">مسیر رشد</a>
            <a href="#businesses">حوزه‌های کسب‌وکار</a>
            <a href="#course">ساختار دوره</a>
            <Link href="/blog">وبلاگ</Link>
            <Link href="/video">استودیوی ویدیو</Link>
            <Link href="/academy">آکادمی</Link>
            <Link href="/assistant" style={{ color: "var(--primary)", fontWeight: 800 }}>🤖 مربی هوشمند</Link>
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login" className="btn btn-ghost btn-header" style={{ padding: "10px 20px" }}>ورود</Link>
            <Link href="/register" className="btn btn-primary btn-header">ثبت‌نام</Link>
          </div>
          <button className="menu-toggle" aria-label="منو" onClick={() => setMenuOpen((v) => !v)}>☰</button>
        </div>
      </header>

      {/* ======= HERO ======= */}
      <section className="hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="container hero-grid">
          <div>
            <span className="hero-badge"><span className="dot"></span> دیجی‌آموزش؛ آموزش سادهٔ کسب‌وکار خانگی با ابزارهای رایگان مثل Arena.ai</span>
            <h1>کسب‌وکار خانگی‌ات را <br />با <span className="hl">محتوای هوشمند</span> و فروش آنلاین پیش ببر</h1>
            <p className="lead">برای هر کسب‌وکار خانگی یک مسیر آموزشی کامل می‌سازیم: یادگیری مهارت، کار با ابزارهای رایگان مثل Arena.ai، ساخت برند، تولید محتوا و فروش آنلاین؛ همه ساده، مرحله‌به‌مرحله و قابل اجرا.</p>
            <div className="hero-cta">
              <a href="#businesses" className="btn btn-primary">حوزه‌ات را انتخاب کن 🚀</a>
              <Link href="/blog/arena-ai-content-calendar" className="btn btn-ghost">🟣 آموزش Arena.ai</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><b>۱۵+</b><span>حوزهٔ کسب‌وکار خانگی</span></div>
              <div className="stat"><b>۱۰</b><span>قسمت در هر دوره</span></div>
              <div className="stat"><b>۵</b><span>مرحلهٔ مسیر رشد</span></div>
            </div>
          </div>
          <div className="hero-media">
            <div className="chip chip-1"><span className="icos" style={{ background: "var(--primary-soft)" }}>✨</span> ایده‌پردازی با AI</div>
            <div className="chip chip-2"><span className="icos" style={{ background: "var(--teal-soft)" }}>🎬</span> ریلز و استوری</div>
            <div className="chip chip-3"><span className="icos" style={{ background: "var(--coral-soft)" }}>🛒</span> فروش آنلاین</div>
            <div className="frame"><img src={HERO_IMG} alt="کسب‌وکار خانگی با هوش مصنوعی" width={1100} height={684} fetchPriority="high" /></div>
          </div>
        </div>
      </section>

      {/* ======= PATH ======= */}
      <section className="block" id="path">
        <div className="container">
          <div className="sec-head reveal">
            <span className="sec-tag">مدل آموزشی</span>
            <h2>مسیر ۵ مرحله‌ای رشد برای هر کسب‌وکار</h2>
            <p>هر دوره دقیقاً همین مسیر را طی می‌کند؛ از یادگیری مهارت تا زمان فروش. نتیجه؟ فقط تولید محتوا یاد نمی‌گیری، یک کسب‌وکار کامل راه می‌اندازی.</p>
          </div>
          <div className="path">
            {STEPS.map((s, i) => (
              <div className="step reveal" key={s.t} style={{ "--step-color": s.c, "--step-soft": s.s } as CSSProperties}>
                {i > 0 && <span className="conn">◀</span>}
                <div className="num">{toFa(i + 1)}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= BUSINESSES ======= */}
      <section className="block" id="businesses" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="sec-head reveal">
            <span className="sec-tag coral">۱۵ حوزهٔ آماده</span>
            <h2>برای کدام کسب‌وکار خانگی دوره می‌خواهی؟</h2>
            <p>برای هر حوزه، آموزش‌های مخصوص خودش بر پایهٔ هوش مصنوعی طراحی شده است؛ جست‌وجو کن و حوزه‌ات را پیدا کن.</p>
          </div>
          <div className="tools-bar reveal">
            <div className="search-box">
              <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو… مثلاً کیک، شمع، خیاطی" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
          </div>
          <div className="biz-grid">
            {list.map((b, i) => {
              const [c, soft] = PALETTE[businesses.indexOf(b) % PALETTE.length] as string[];
              return (
                <div className="biz-card reveal in" key={b.name} style={{ "--card-color": c, "--card-soft": soft } as CSSProperties}>
                  <div className="biz-icon">{b.icon}</div>
                  <h3>{b.name}<span className="ai-note">با AI</span></h3>
                  <ul>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              );
            })}
          </div>
          <p className={`no-result${list.length === 0 ? " show" : ""}`}>موردی پیدا نشد؛ کلمهٔ دیگری را امتحان کن 🙂</p>
        </div>
      </section>

      {/* ======= COURSE ======= */}
      <section className="block" id="course">
        <div className="container">
          <div className="sec-head reveal">
            <span className="sec-tag teal">ساختار هر دوره</span>
            <h2>۱۰ قسمت؛ از آشنایی تا توسعه</h2>
            <p>برای هر کسب‌وکار یک دورهٔ ۸ تا ۱۰ قسمتی می‌سازیم. روی هر قسمت بزن تا ببینی داخلش چه خبر است.</p>
          </div>
          <div className="course-wrap">
            {episodes.map((e, i) => (
              <div className={`episode reveal${openEps.has(i) ? " open done" : ""}`} key={e.t}>
                <div className="ep-num">{toFa(i + 1)}</div>
                <div className="ep-body">
                  <div className="ep-head" onClick={() => setOpenEps((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}>
                    <h3>{e.t}</h3>
                    <span className="arrow">▾</span>
                  </div>
                  <div className="ep-desc"><p>{e.d}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="course-actions reveal">
            <div className="progress-pill">
              <span>پیش‌نمایش مسیر یادگیری:</span>
              <span className="progress-bar"><i style={{ width: pct + "%" }}></i></span>
              <b style={{ color: "var(--primary)" }}>{toFa(pct)}٪</b>
            </div>
          </div>
        </div>
      </section>

      {/* ======= BLOG PREVIEW ======= */}
      <section className="block" id="blog">
        <div className="container">
          <div className="sec-head reveal">
            <span className="sec-tag coral">وبلاگ آموزشی</span>
            <h2>برای هر کسب‌وکار، یک راهنمای عملی</h2>
            <p>در وبلاگ برای هر حوزه می‌گوییم دقیقاً چه آموزش‌هایی لازم داری، با چه تکنیک‌هایی محتوا بسازی، سایتت را چطور راه بیندازی و چطور با Arena.ai سریع‌تر و رایگان‌تر محتوا تولید کنی.</p>
          </div>
          <div className="blog-grid">
            {FEATURED.map((f) => (
              <Link className="post-card reveal" href={f.href} key={f.href} style={{ "--card-color": f.c, "--card-soft": f.s } as CSSProperties}>
                <span className="p-tag">{f.tag}</span>
                <h3>{f.t}</h3>
                <p>{f.p}</p>
                <div className="p-meta"><span>⏱ {f.m} دقیقه مطالعه</span><b>خواندن راهنما ←</b></div>
              </Link>
            ))}
          </div>
          <div className="blog-cta reveal">
            <Link href="/blog" className="btn btn-primary">مشاهدهٔ همهٔ {toFa(ARTICLES.length)} راهنما 📚</Link>
            <Link href="/video" className="btn btn-ghost" style={{ marginInlineStart: 10 }}>🎬 استودیوی ویدیو</Link>
          </div>
        </div>
      </section>

      {/* ======= WHY ======= */}
      <section className="block" id="why">
        <div className="container">
          <div className="why reveal">
            <span className="sec-tag" style={{ background: "rgba(255,255,255,.14)", color: "#FFC86B" }}>چرا این مدل؟</span>
            <h2>نه فقط آموزش؛ راه‌اندازی کامل کسب‌وکار</h2>
            <p>این ساختار باعث می‌شود هر شرکت‌کننده فقط تولید محتوا یاد نگیرد، بلکه از صفر تا راه‌اندازی و بازاریابی یک کسب‌وکار خانگی را مرحله‌به‌مرحله تجربه کند.</p>
            <div className="why-grid">
              <div className="why-card">
                <div className="w-ico"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg></div>
                <h3>هم‌راستا با پلتفرم آموزش و تولید محتوا</h3>
                <p>این رویکرد دقیقاً با پروژه‌ای که برای پلتفرم آموزش و تولید محتوا در ذهن داری هم‌خوانی دارد و روی همان زیرساخت سوار می‌شود.</p>
              </div>
              <div className="why-card">
                <div className="w-ico"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 12l9 4 9-4" /><path d="M3 17l9 4 9-4" /></svg></div>
                <h3>قابل تکرار برای هر حوزه</h3>
                <p>یک قالب ثابت ۵ مرحله‌ای و ۱۰ قسمتی که برای هر کسب‌وکار خانگی فقط با محتوای تخصصی همان حوزه پر می‌شود.</p>
              </div>
              <div className="why-card">
                <div className="w-ico"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg></div>
                <h3>خروجی واقعی، نه تئوری</h3>
                <p>در پایان هر دوره، شرکت‌کننده برند، پیج، محتوا و اولین سفارش‌هایش را دارد؛ یعنی نتیجهٔ ملموس و قابل لمسی.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="block" id="cta">
        <div className="container">
          <div className="cta-box reveal">
            <span className="sec-tag coral">عضویت در دیجی‌آموزش</span>
            <h2>آماده‌ای کسب‌وکارت رشد کند؟</h2>
            <p>ثبت‌نام کن و جزو اولین افرادی باش که دورهٔ ۱۰ قسمتی کسب‌وکار خانگی‌شان با هوش مصنوعی را تجربه می‌کنند.</p>
            <form className="cta-form" onSubmit={(e) => { e.preventDefault(); setMsg("عالی! حالا با ثبت‌نام واقعی حسابت را بساز 🎉"); }}>
              <input type="text" id="nameInput" placeholder="نام و حوزهٔ کسب‌وکارت…" required />
              <input type="email" id="emailInput" placeholder="ایمیل یا شماره تماس" required />
              <button type="submit" className="btn btn-primary">ثبت در لیست انتظار</button>
            </form>
            <p className="form-msg">{msg}</p>
            <p className="cta-note">یا مستقیم <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>حساب کاربری</Link> بساز 💜</p>
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="ds-footer">
        <div className="container">
          <Link href="/" className="logo"><LogoMark /> دیجی‌آموزش</Link>
          <div className="foot-links">
            <a href="#path">مسیر رشد</a>
            <a href="#businesses">حوزه‌ها</a>
            <a href="#course">ساختار دوره</a>
            <Link href="/blog">وبلاگ</Link>
            <Link href="/video">استودیوی ویدیو</Link>
            <Link href="/register">ثبت‌نام</Link>
          </div>
          <p>دیجی‌آموزش 🎓 آکادمی دیجیتال کسب‌وکارهای خانگی — از ایده تا برند آنلاین</p>
        </div>
      </footer>
    </div>
  );
}
