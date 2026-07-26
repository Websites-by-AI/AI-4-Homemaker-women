"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../app/digi.css";

export function LogoMark() {
  return (
    <span className="logo-mark">
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M31.5 13 5 25l26.5 12L58 25 31.5 13z" fill="#FFF7EF" />
        <path d="M14 30.5V39c0 4.4 7.8 8 17.5 8s17.5-3.6 17.5-8V30.5l-17.5 8z" fill="#FFF7EF" opacity=".9" />
      </svg>
    </span>
  );
}

export default function SiteChrome({ active, children }: { active: string; children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <div className="digisite">
      <header className={`ds-header${scrolled ? " scrolled" : ""}`}>
        <div className="container header-inner">
          <Link href="/" className="logo"><LogoMark /> دیجی‌آموزش</Link>
          <nav className={`main-nav${menuOpen ? " open" : ""}`} onClick={(e) => { if ((e.target as HTMLElement).tagName === "A") setMenuOpen(false); }}>
            <Link href="/#path">مسیر رشد</Link>
            <Link href="/#businesses">حوزه‌های کسب‌وکار</Link>
            <Link href="/blog" className={active === "blog" ? "active" : ""}>وبلاگ</Link>
            <Link href="/video" className={active === "video" ? "active" : ""}>استودیوی ویدیو</Link>
            <Link href="/assistant" className={active === "assistant" ? "active" : ""}>🤖 مربی هوشمند</Link>
            <Link href="/academy">آکادمی</Link>
          </nav>
          <Link href="/register" className="btn btn-primary btn-header">شروع مسیر</Link>
          <button className="menu-toggle" aria-label="منو" onClick={() => setMenuOpen((v) => !v)}>☰</button>
        </div>
      </header>
      {children}
      <footer className="ds-footer">
        <div className="container">
          <p>🎓 دیجی‌آموزش — آکادمی دیجیتال کسب‌وکارهای خانگی | <Link href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>صفحهٔ اصلی</Link> · <Link href="/blog" style={{ color: "var(--primary)", fontWeight: 700 }}>وبلاگ</Link> · <Link href="/video" style={{ color: "var(--primary)", fontWeight: 700 }}>استودیوی ویدیو</Link> · <Link href="/business-model" style={{ color: "var(--primary)", fontWeight: 700 }}>مدل کسب‌وکار</Link> · <Link href="/assistant" style={{ color: "var(--primary)", fontWeight: 700 }}>مربی هوشمند 🤖</Link></p>
        </div>
      </footer>
    </div>
  );
}
