"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import { ARTICLES, PALETTE } from "@/lib/digi-content";

const toFa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

export default function BlogPage() {
  const [q, setQ] = useState("");
  const list = !q.trim()
    ? ARTICLES
    : ARTICLES.filter((a) =>
        [a.n, a.tag, a.intro, ...a.need, ...a.content, ...a.site].some((t) => t.includes(q.trim()))
      );

  return (
    <SiteChrome active="blog">
      <main className="blog-hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="container">
          <span className="crumb"><Link href="/">خانه</Link> ← وبلاگ</span>
          <h1>برای هر کسب‌وکار، یک <span className="hl">راهنمای کامل</span> داریم</h1>
          <p>در هر مقاله می‌گوییم برای حوزه‌ات دقیقاً <b>چه آموزش‌هایی لازم است</b>، با چه <b>تکنیک‌هایی محتوا</b> تولید کنی، <b>سایتت</b> را چطور بسازی که بفروشد و چطور از <b>Arena.ai</b> برای تولید محتوای ساده و کم‌هزینه کمک بگیری.</p>
          <div className="tools-bar">
            <div className="search-box">
              <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو در مقاله‌ها… مثلاً کیک، Arena.ai، سایت، محتوا" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
          </div>
          <p className="count-note">{list.length ? `${toFa(list.length)} راهنمای کامل — روی هر کدام بزن تا کامل بخوانی‌اش` : ""}</p>
          <div className="posts">
            {list.map((a) => {
              const [c, soft] = PALETTE[a.c % PALETTE.length] as string[];
              const excerpt = a.intro.length > 110 ? a.intro.slice(0, 110) + "…" : a.intro;
              return (
                <Link key={a.slug} className="post-card reveal in" href={`/blog/${a.slug}`} style={{ "--c": c, "--c-soft": soft } as CSSProperties}>
                  <div className="post-top"><span className="p-ico">{a.icon}</span><span className="p-tag">{a.tag}</span></div>
                  <h2>{a.n}</h2>
                  <p>{excerpt}</p>
                  <div className="p-meta"><span>⏱ {toFa(a.min)} دقیقه مطالعه</span><b>خواندن راهنما ←</b></div>
                </Link>
              );
            })}
          </div>
          <p className={`no-result${list.length === 0 ? " show" : ""}`}>مقاله‌ای پیدا نشد؛ کلمهٔ دیگری امتحان کن 🙂</p>
        </div>
      </main>
    </SiteChrome>
  );
}
