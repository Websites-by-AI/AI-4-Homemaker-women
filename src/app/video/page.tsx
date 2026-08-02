"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import { VIDS, PALETTE, geminiTpl } from "@/lib/digi-content";
import { buildEducationLinks } from "@/lib/education-resources";

const GEMINI_PROMPT =
  "تو یک کارگردان تولید محتوا و کپی‌رایتر اینستاگرام هستی. برای کسب‌وکار خانگی «[حوزهٔ کسب‌وکار]» یک سناریوی ریلز ۲۰ تا ۳۰ ثانیه‌ای بنویس با این ساختار: ۱) قلاب ۳ ثانیهٔ اول که اسکرول را متوقف کند، ۲) چهار تا پنج صحنه با زمان‌بندی دقیق، توصیف تصویر هر صحنه و متنی که روی هر صحنه نمایش داده می‌شود، ۳) کپشن نهایی با یک دعوت به اقدام (CTA) مثل سفارش در دایرکت یا مراجعه به سایت، ۴) پنج هشتگ مرتبط فارسی. لحن کپشن صمیمی و اعتمادساز باشد. در آخر، برای هر صحنه یک پرامپت انگلیسی کوتاه هم بنویس که بتوانم در Google Flow (Veo) برای تولید ویدیو استفاده کنم.";

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(text.trim()); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text.trim(); document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    setOk(true); setTimeout(() => setOk(false), 1800);
  };
  return <button className={`copy-btn${ok ? " ok" : ""}`} onClick={doCopy}>{ok ? "کپی شد ✓" : "📋 کپی پرامپت"}</button>;
}

function PromptBox({ label, icon, text, en }: { label: string; icon: string; text: string; en?: boolean }) {
  return (
    <div className="prompt-box">
      <div className="prompt-label"><b>{icon} {label}</b><CopyBtn text={text} /></div>
      <p className={`prompt-text${en ? " en" : ""}`} style={{ maxHeight: "none" }}>{text}</p>
    </div>
  );
}

export default function VideoStudioPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [eduQuery, setEduQuery] = useState("سناریونویسی ریلز با جمینی و Google Flow");
  const educationLinks = useMemo(
    () => buildEducationLinks("تولید محتوای ویدیویی", eduQuery.trim() || "سناریونویسی ریلز"),
    [eduQuery]
  );

  return (
    <SiteChrome active="video">
      <main>
        <section className="hero">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="container">
            <span className="crumb"><Link href="/">خانه</Link> ← استودیوی ویدیو</span>
            <h1>با اکانت <span className="hl">رایگان گوگل</span>، ویدیوی حرفه‌ای بساز</h1>
            <p>سناریو را با <b>جمینی</b> بنویس، استوری‌بورد و کلیپ را با <b>Google Flow</b> بساز و برای حوزه‌ات از سناریوهای آمادهٔ پایین استفاده کن — صحنه‌به‌صحنه، با پرامپت کپی‌شدنی.</p>
            <span className="free-badge">✅ بدون هزینه برای شروع — فقط یک اکانت گوگل</span>
          </div>
        </section>

        {/* ابزارها */}
        <section className="block">
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-tag teal">جعبه‌ابزار رایگان</span>
              <h2>چهار ابزاری که لازم داری</h2>
              <p>دو تای گوگل با اکانت رایگان کار می‌کند؛ دو تای دیگر برای مونتاژ و انتشار.</p>
            </div>
            <div className="tools">
              <div className="tool reveal"><div className="t-ico">✨</div><h3>Google Gemini</h3><p>نویسندهٔ شخصی‌ات: سناریو، قلاب، کپشن و هشتگ. رایگان با اکانت گوگل.</p><span className="t-tag">گوگل · رایگان</span></div>
              <div className="tool reveal"><div className="t-ico">🎬</div><h3>Google Flow (Veo)</h3><p>استودیوی ویدیوی گوگل: متن می‌دهی، کلیپ تحویل می‌گیری. بخش <b>Scene Builder</b> مخصوص استوری‌بورد است. با اکانت رایگان روزانه چند کلیپ محدود داری.</p><span className="t-tag">گوگل · رایگان محدود</span></div>
              <div className="tool reveal"><div className="t-ico">✂️</div><h3>ویرایشگر موبایل</h3><p>CapCut، InShot یا VN: چسباندن صحنه‌ها، متن فارسی روی تصویر، موزیک ترند و زیرنویس.</p><span className="t-tag">رایگان</span></div>
              <div className="tool reveal"><div className="t-ico">📤</div><h3>YouTube Shorts</h3><p>علاوه بر ریلز اینستاگرام، ویدیوت را Shorts هم بگذار تا در یوتیوب و گوگل دیده شوی.</p><span className="t-tag">گوگل · رایگان</span></div>
            </div>
          </div>
        </section>

        {/* آموزش بیشتر */}
        <section className="block" style={{ background: "var(--bg-soft)" }}>
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-tag">آموزش‌های بیشتر</span>
              <h2>در یوتیوب، آپارات و فرادرس بیشتر یاد بگیر</h2>
              <p>اگر خواستی بیرون از سایت هم دربارهٔ سناریونویسی، Google Flow، جمینی، تدوین یا تولید ریلز بیشتر آموزش ببینی، موضوع را بنویس و روی منبع دلخواهت بزن.</p>
            </div>
            <div className="reveal" style={{ maxWidth: 940, margin: "0 auto" }}>
              <div style={{ display: "grid", gap: 16 }}>
                <div className="search-box" style={{ width: "100%", margin: "0 auto" }}>
                  <input
                    type="text"
                    value={eduQuery}
                    onChange={(e) => setEduQuery(e.target.value)}
                    placeholder="مثلاً: آموزش Google Flow، سناریونویسی ریلز، کپشن‌نویسی، تدوین با CapCut"
                  />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <div className="tools">
                  {educationLinks.map((resource) => (
                    <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="tool reveal in" style={{ textDecoration: "none" }}>
                      <div className="t-ico">{resource.provider === "youtube" ? "▶️" : resource.provider === "aparat" ? "📺" : "🎓"}</div>
                      <h3>{resource.provider === "youtube" ? "YouTube" : resource.provider === "aparat" ? "Aparat" : "Faradars"}</h3>
                      <p>{resource.title}</p>
                      <span className="t-tag">{resource.reason}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ۵ قدم */}
        <section className="block" style={{ background: "#fff" }}>
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-tag">روش کار</span>
              <h2>تولید ویدیو در ۵ قدم</h2>
              <p>همین مسیر را برای هر ریلز تکرار کن؛ هر بار سریع‌تر و بهتر می‌شوی.</p>
            </div>
            <div className="steps">
              {[
                ["سناریو را با جمینی بنویس", "پرامپت آمادهٔ زیر را در Gemini کپی کن (نام حوزه‌ات را عوض کن). جمینی قلاب، صحنه‌ها، متن روی تصویر و کپشن را می‌نویسد — تو فقط ویرایش می‌کنی."],
                ["استوری‌بورد بساز (Scene Builder)", "سناریو را به صحنه‌های ۲ تا ۴ ثانیه‌ای تقسیم کن. در Google Flow بخش Scene Builder دقیقاً برای همین طراحی شده: هر صحنه را جدا تعریف و مرتب می‌کنی."],
                ["صحنه‌ها را تولید کن", "پرامپت انگلیسی هر صحنه را به Flow/Veo بده تا کلیپ بسازد (نمونه‌های آماده پایین صفحه). بعضی صحنه‌ها را می‌توانی با گوشی هم فیلم‌برداری و ترکیب کنی."],
                ["مونتاژ و متن فارسی", "صحنه‌ها را در ویرایشگر پشت هم بچسبان، متن‌های فارسی هر صحنه را بنویس، موزیک ترند بگذار و زیرنویس اضافه کن — خیلی‌ها بدون صدا نگاه می‌کنند."],
                ["انتشار حرفه‌ای", "کاور جذاب، کپشن با CTA (سفارش در دایرکت/لینک سایت)، ۳ تا ۵ هشتگ مرتبط و انتشار در ساعت پرترافیک: ظهر و ۸ تا ۱۰ شب."],
              ].map(([t, d], i) => (
                <div className="step-row reveal" key={t}>
                  <div className="s-num">{["۱","۲","۳","۴","۵"][i]}</div>
                  <div><h3>{t}</h3><p>{d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* پرامپت جمینی */}
        <section className="block">
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-tag coral">پرامپت آمادهٔ سناریونویسی</span>
              <h2>این را در جمینی بچسبان</h2>
              <p>فقط نام حوزهٔ خودت را جایگزین [حوزهٔ کسب‌وکار] کن؛ در هر کارت سناریو، نسخهٔ آمادهٔ همان حوزه هم هست.</p>
            </div>
            <div style={{ maxWidth: 900, margin: "0 auto" }} className="reveal">
              <PromptBox label="پرامپت سناریونویسی (فارسی — برای جمینی)" icon="✨" text={GEMINI_PROMPT} />
            </div>
          </div>
        </section>

        {/* سناریوها */}
        <section className="block" style={{ background: "var(--bg-soft)" }}>
          <div className="container">
            <div className="sec-head reveal">
              <span className="sec-tag coral">۱۵ سناریوی آماده</span>
              <h2>سناریو + استوری‌بورد + پرامپت برای حوزه‌ات</h2>
              <p>روی کارت حوزه‌ات بزن: سناریوی کامل ریلز، استوری‌بورد صحنه‌به‌صحنه و پرامپت‌های آمادهٔ کپی را بردار و همان امروز بساز.</p>
            </div>
            <div className="acc">
              {VIDS.map((v, i) => {
                const [c, soft] = PALETTE[v.c % PALETTE.length] as string[];
                const isOpen = open === i;
                return (
                  <div className={`acc-item reveal${isOpen ? " open" : ""}`} key={v.name} style={{ "--c": c, "--c-soft": soft } as CSSProperties}>
                    <div className="acc-head" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                      <span className="acc-ico">{v.icon}</span>
                      <div className="acc-title-wrap">
                        <h3>{v.name}</h3>
                        <span className="acc-subtitle">{v.title}</span>
                      </div>
                      <span className="acc-arrow">▾</span>
                    </div>
                    {isOpen && (
                      <div className="acc-body">
                        <div className="acc-body-in">
                          <div className="hook"><span>🎣</span><span><b>قلاب (۳ ثانیهٔ اول):</b> {v.hook}</span></div>
                          <div className="board">
                            <p className="board-title">🎬 استوری‌بورد صحنه‌به‌صحنه</p>
                            {v.board.map((s) => (
                              <div className="scene" key={s[0]}>
                                <div className="sc-time">{s[0]}</div>
                                <div className="sc-body"><p>{s[1]}</p><p className="sc-txt">💬 متن روی تصویر: {s[2]}</p></div>
                              </div>
                            ))}
                          </div>
                          <p className="mini-label">🇬🇧 پرامپت انگلیسی برای Google Flow / Veo:</p>
                          <PromptBox label="Video prompt" icon="⚙️" text={v.prompt} en />
                          <p className="mini-label">✨ پرامپت سناریونویسی جمینی (مخصوص همین حوزه):</p>
                          <PromptBox label="سناریو جدید بساز" icon="✍️" text={geminiTpl(v.name)} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: ".85rem", maxWidth: 560, margin: "26px auto 0" }}>💡 اگر Flow در منطقه‌ات فعال نبود: با جمینی «تصویر» هر صحنه را بساز، در ویرایشگر حرکت/زوم آرام بده — استوری‌بورد و پرامپت‌ها به همان شکل کار می‌کنند.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="block">
          <div className="container">
            <div style={{ background: "linear-gradient(135deg,var(--primary-soft),#FFF0EC 60%,var(--teal-soft))", borderRadius: 36, padding: "52px 8%", textAlign: "center" }} className="reveal">
              <span className="sec-tag coral">قدم بعدی</span>
              <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, marginBottom: 10 }}>می‌خوای این آموزش‌ها قدم‌به‌قدم و با تمرین باشه؟</h2>
              <p style={{ color: "var(--ink-soft)", maxWidth: 520, margin: "0 auto 26px" }}>دورهٔ ۱۰ قسمتی دیجی‌آموزش برای حوزه‌ات، همین تکنیک‌ها را با تمرین و بازخورد یادت می‌دهد.</p>
              <Link href="/register" className="btn btn-primary">ثبت‌نام در دیجی‌آموزش 🎓</Link>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
