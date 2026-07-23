import { notFound } from "next/navigation";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import { ARTICLES, PALETTE, GENERIC_SECTIONS } from "@/lib/digi-content";

const toFa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

function Sec({ title, items, c }: { title: string; items: string[]; c: string }) {
  return (
    <div className="a-sec">
      <h2 style={{ ["--c" as string]: c } as React.CSSProperties}>
        <span className="bar" style={{ background: c }}></span> {title}
      </h2>
      <ul>
        {items.map((t) => (
          <li key={t} style={{ ["--c" as string]: c } as React.CSSProperties}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  return a ? { title: `${a.n} | وبلاگ دیجی‌آموزش`, description: a.intro } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();
  const [c, soft] = PALETTE[a.c % PALETTE.length] as string[];
  const idx = ARTICLES.indexOf(a);
  const next = ARTICLES[(idx + 1) % ARTICLES.length];
  const [nc, nsoft] = PALETTE[next.c % PALETTE.length] as string[];

  return (
    <SiteChrome active="blog">
      <main className="blog-hero" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="article">
            <Link className="back-link" href="/blog">→ بازگشت به همهٔ راهنماها</Link>
            <div className="art-head" style={{ ["--c-soft" as string]: soft } as React.CSSProperties}>
              <span className="p-ico" style={{ background: soft }}>{a.icon}</span>
              <h1>{a.n}</h1>
              <div className="a-meta">
                <span className="p-tag" style={{ background: soft, color: c, padding: "5px 14px", borderRadius: 999, fontWeight: 800 }}>{a.tag}</span>
                <span>⏱ زمان مطالعه: {toFa(a.min)} دقیقه</span>
                <span>🎓 تیم آموزشی دیجی‌آموزش</span>
              </div>
            </div>
            <p className="a-intro">{a.intro}</p>
            <Sec title={GENERIC_SECTIONS.need} items={a.need} c={c} />
            <Sec title={GENERIC_SECTIONS.content} items={a.content} c={c} />
            <Sec title={GENERIC_SECTIONS.site} items={a.site} c={c} />
            <div className="a-tip">
              <b>💡 نکتهٔ طلایی</b>
              <p>{a.tip}</p>
            </div>
            <div className="a-cta">
              <h3>می‌خوای همین حوزه را مرحله‌به‌مرحله یاد بگیری؟</h3>
              <p>دورهٔ ۱۰ قسمتی دیجی‌آموزش برای حوزه‌ات، همین تکنیک‌ها را با تمرین و بازخورد یادت می‌دهد.</p>
              <Link href="/register" className="btn btn-primary">ساخت حساب و شروع مسیر 🚀</Link>
            </div>
            <Link className="post-card next-post reveal in" href={`/blog/${next.slug}`} style={{ ["--c" as string]: nc, ["--c-soft" as string]: nsoft } as React.CSSProperties}>
              <div className="post-top"><span className="p-ico">{next.icon}</span><span className="p-tag">راهنمای بعدی</span></div>
              <h2>{next.n}</h2>
              <div className="p-meta"><span>⏱ {toFa(next.min)} دقیقه مطالعه</span><b>ادامه ←</b></div>
            </Link>
          </div>
        </div>
      </main>
    </SiteChrome>
  );
}
