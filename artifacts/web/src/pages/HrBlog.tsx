import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, Clock, Layers } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SeoHead, type SeoPageKey } from "@/components/SeoHead";
import { Faq, Heading, Section } from "./storyKit";
import { useLanguage } from "@/lib/i18n";
import { AttendanceStory } from "./AttendanceStory";
import { AiHrStory } from "./AiHrStory";
import { SmallBizStory } from "./SmallBizStory";
import { IdeaStory, isIdeaSlug } from "./IdeaStory";
import { blogEntries, categories, getDetails, readMinutes, type Article, type BlogEntry, type CategoryKey, type Lang } from "./hrBlogRegistry";

const copy = {
  ar: {
    eyebrow: "سالفة اتش آر",
    title: "سالفة اتش آر",
    intro: "اقرأ بسهولة: مقالات قصيرة ومرتبة عن الحضور والذكاء الاصطناعي وأدوات المنشآت الصغيرة.",
    all: "الكل",
    articles: "مقالات",
    min: "دقائق قراءة",
    read: "ابدأ السالفة",
    back: "كل المقالات",
    toc: "في هذا المقال",
    faq: "أسئلة شائعة",
    next: "المقال التالي",
    featured: "الأحدث",
  },
  en: {
    eyebrow: "HR blog",
    title: "HR blog",
    intro: "Short, well-organised reads on attendance, AI and tools for small businesses.",
    all: "All",
    articles: "articles",
    min: "min read",
    read: "Read the story",
    back: "All articles",
    toc: "In this article",
    faq: "FAQ",
    next: "Next article",
    featured: "Latest",
  },
};

type Go = (slug: string) => void;
const fmtMin = (n: number, lang: Lang) =>
  lang === "ar" ? (n === 1 ? "دقيقة قراءة" : n === 2 ? "دقيقتان قراءة" : n <= 10 ? `${n} دقائق قراءة` : `${n} دقيقة قراءة`) : `${n} min read`;

export function HrBlog() {
  const { setLanguage } = useLanguage();
  const [, navigate] = useLocation();
  const [matchEn, paramsEn] = useRoute("/en/hr-blog/:slug?");
  const [, paramsAr] = useRoute("/hr-blog/:slug?");
  const lang: Lang = matchEn ? "en" : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = copy[lang];
  const slug = (matchEn ? paramsEn?.slug : paramsAr?.slug) ?? "";
  useEffect(() => { setLanguage(lang); }, [lang, setLanguage]);
  const urlFor = (l: Lang, sl: string) => (l === "en" ? "/en" : "") + "/hr-blog" + (sl ? "/" + sl : "");
  const go: Go = (sl) => { navigate(urlFor(lang, sl)); window.scrollTo({ top: 0 }); };
  const hrefFor = (sl: string) => import.meta.env.BASE_URL.replace(/\/$/, "") + urlFor(lang, sl);
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const Fwd = dir === "rtl" ? ArrowLeft : ArrowRight;
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;

  const cards = useMemo(
    () => blogEntries.map((e) => ({ e, a: e.load(lang) })).map((x) => {
      const d = getDetails(x.e.slug, lang);
      const extra = d ? [...d.sections.flatMap((s) => [s.h, s.p]), ...d.faqs.flatMap((f) => [f.q, f.a])] : [];
      return { ...x, min: readMinutes(x.a, extra) };
    }),
    [lang],
  );
  const current = cards.find((c) => c.e.slug === slug);

  return (
    <div dir={dir} className="min-h-[100dvh] overflow-hidden bg-[#F7FAFD] font-sans text-[#14263D]">
      <SeoHead page={((current?.e.seoKey ?? "hrBlog") + (lang === "en" ? "En" : "")) as SeoPageKey} />
      <Navbar languageOverride={lang} onLanguageToggle={() => navigate(urlFor(lang === "en" ? "ar" : "en", slug))} />
      <main className="pt-20 sm:pt-24">
        {current ? (
          current.e.custom
            ? <CustomReader key={current.e.slug} current={current} cards={cards} t={t} Back={Back} Fwd={Fwd} go={go} hrefFor={hrefFor} />
            : <Reader key={current.e.slug} current={current} cards={cards} t={t} Back={Back} Fwd={Fwd} go={go} hrefFor={hrefFor} />
        ) : (
          <>
            <section className="relative overflow-hidden bg-gradient-to-b from-[#DDF0FB] to-[#F7FAFD] px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
              <div aria-hidden className="pointer-events-none absolute -top-24 end-[-5rem] h-72 w-72 rounded-full bg-[#8CD1F8]/40 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-20 start-[-4rem] h-64 w-64 rounded-full bg-[#FFD9A0]/50 blur-3xl" />
              <div className="relative mx-auto max-w-5xl">
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B6DAF1] bg-white/80 px-4 py-2 text-xs font-bold text-[#1267A2] sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-[#2196F3]" />{t.eyebrow}
                </p>
                <h1 data-testid="text-hr-blog-heading" className="font-heading text-[2.2rem] font-black leading-[1.3] text-[#142D4A] sm:text-[3rem]">{t.title}</h1>
                <p className="mt-5 max-w-2xl text-base font-semibold leading-[1.9] text-[#2C5373] sm:text-lg">{t.intro}</p>
                <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="categories">
                  {(["all", ...(Object.keys(categories) as CategoryKey[]).filter((k) => blogEntries.some((e) => e.category === k))] as (CategoryKey | "all")[]).map((k) => {
                    const on = filter === k;
                    const label = k === "all" ? t.all : `${categories[k].emoji} ${categories[k][lang]}`;
                    return (
                      <button key={k} type="button" role="tab" aria-selected={on} onClick={() => setFilter(k)}
                        className={`rounded-full border px-5 py-2.5 text-sm font-black transition-all ${on ? "border-[#143552] bg-[#143552] text-white shadow-lg" : "border-[#B7D5E9] bg-white text-[#24516F] hover:-translate-y-0.5 hover:shadow-md"}`}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="px-5 pb-20 pt-6 sm:px-8">
              <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
                {cards.filter((c) => filter === "all" || c.e.category === filter).map((c, i) => {
                  const cat = categories[c.e.category];
                  const first = i === 0 && filter === "all";
                  return (
                    <a key={c.e.slug} href={hrefFor(c.e.slug)} onClick={(ev) => { ev.preventDefault(); go(c.e.slug); }} data-testid={`card-hr-blog-${c.e.slug}`}
                      className={`block group relative overflow-hidden rounded-[28px] border border-[#DCE7F0] bg-white p-7 text-start shadow-[0_18px_40px_-24px_rgba(20,45,74,.35)] transition-all hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-22px_rgba(20,45,74,.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1689DC] ${first ? "md:col-span-2 md:p-10" : ""}`}>
                      <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: cat.accent }} />
                      <span aria-hidden className="pointer-events-none absolute -end-6 -top-6 select-none text-[7rem] opacity-[.12] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{cat.emoji}</span>
                      <div className="relative flex flex-wrap items-center gap-3 text-xs font-black">
                        <span className="rounded-full px-3 py-1" style={{ background: cat.soft, color: cat.accent }}>{cat[lang]}</span>
                        <span className="inline-flex items-center gap-1.5 text-[#61798D]"><Clock size={14} aria-hidden />{fmtMin(c.min, lang)}</span>
                        {first && <span className="rounded-full bg-[#143552] px-3 py-1 text-white">{t.featured}</span>}
                      </div>
                      <h2 className={`relative mt-4 font-heading font-black leading-snug text-[#142D4A] ${first ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{c.e.teaser[lang].title}</h2>
                      <p className="relative mt-3 line-clamp-3 text-base font-semibold leading-8 text-[#4D657A]">{c.e.teaser[lang].excerpt}</p>
                      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-black transition-all group-hover:gap-3" style={{ color: cat.accent }}>{t.read}<Fwd size={17} aria-hidden /></span>
                    </a>
                  );
                })}
              </div>
              <p className="mx-auto mt-8 max-w-5xl text-sm font-bold text-[#61798D]"><Layers size={14} className="me-1.5 inline" aria-hidden />{cards.length} {t.articles}</p>
            </section>
          </>
        )}
      </main>
      <Footer languageOverride={lang} />
    </div>
  );
}

type Card = { e: BlogEntry; a: Article; min: number };

function RelatedArticles({ slug, cards, lang, go, hrefFor, Fwd, t }: { slug: string; cards: Card[]; lang: Lang; go: Go; hrefFor: (slug: string) => string; Fwd: typeof ArrowLeft; t: (typeof copy)["ar"] }) {
  const wanted = getDetails(slug, lang)?.related ?? [];
  const pool = wanted.map((s) => cards.find((c) => c.e.slug === s)).filter((c): c is Card => Boolean(c));
  const items = pool.length ? pool : cards.filter((c) => c.e.slug !== slug).slice(0, 3);
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h2 className="font-heading text-2xl font-black text-[#14263D]">{lang === "ar" ? "مقالات ذات صلة" : "Related articles"}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c) => (
          <a key={c.e.slug} href={hrefFor(c.e.slug)} onClick={(ev) => { ev.preventDefault(); go(c.e.slug); }} className="group block rounded-3xl border border-[#DCE7F0] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="text-xs font-black" style={{ color: categories[c.e.category].accent }}>{categories[c.e.category].emoji} {categories[c.e.category][lang]}</span>
            <p className="mt-2 font-heading text-lg font-black leading-snug text-[#14263D]">{c.e.teaser[lang].title}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#1689DC]">{t.read}<Fwd size={16} aria-hidden /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function CustomReader({ current, cards, t, Back, Fwd, go, hrefFor }: { current: Card; cards: Card[]; t: (typeof copy)["ar"]; Back: typeof ArrowLeft; Fwd: typeof ArrowLeft; go: Go; hrefFor: (slug: string) => string }) {
  const { language } = useLanguage();
  const lang = language as Lang;
  const { e } = current;
  return (
    <>
      <div className="px-5 py-4 sm:px-8" style={{ background: "#EAF5FC" }}>
        <div className="mx-auto max-w-5xl">
          <a href={hrefFor("")} onClick={(ev) => { ev.preventDefault(); go(""); }} className="inline-flex items-center gap-2 rounded-full border border-[#B7D5E9] bg-white px-4 py-2 text-sm font-black text-[#24516F] hover:shadow-md">
            <Back size={16} aria-hidden />{t.back}
          </a>
        </div>
      </div>
      {(() => {
        const det = getDetails(e.slug, lang);
        const details = det && (
          <Section tone="soft">
            <Heading kicker={det.kicker} title={lang === "ar" ? "كل ما تحتاج معرفته" : "Everything you need to know"} />
            {det.updated && (
              <p className="mt-3 text-sm font-bold text-slate-500">
                {lang === "ar" ? "فريق تحرير نظامي · آخر تحديث: " : "Nizamy editorial team · Last updated: "}
                {new Date(det.updated).toLocaleDateString(lang === "ar" ? "ar-u-ca-gregory" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
            {det.tldr && (
              <div className="mt-6 max-w-3xl rounded-3xl p-6" style={{ background: "#EAF5FC", border: "1px solid #DCE7F0" }}>
                <p className="text-sm font-black text-[#1689DC]">{lang === "ar" ? "الخلاصة" : "Quick answer"}</p>
                <p className="mt-2 text-lg font-bold leading-9 text-[#14263D]">{det.tldr}</p>
              </div>
            )}
            <nav aria-label={lang === "ar" ? "محتويات المقال" : "On this page"} className="mt-6 max-w-3xl">
              <ol className="flex flex-wrap gap-2">
                {det.sections.map((x, i) => (
                  <li key={x.h}><a href={"#sec-" + i} className="rounded-full border border-[#B7D5E9] bg-white px-4 py-1.5 text-sm font-bold text-[#24516F]">{x.h}</a></li>
                ))}
              </ol>
            </nav>
            <div className="mt-8 max-w-3xl space-y-8">
              {det.sections.map((x, i) => (
                <article key={x.h} id={"sec-" + i} className="scroll-mt-28">
                  <h2 className="font-heading text-2xl font-black text-[#14263D]">{x.h}</h2>
                  <p className="mt-3 text-lg leading-9 text-[#4D657A]">{x.p}</p>
                </article>
              ))}
            </div>
            <h2 className="mt-12 font-heading text-2xl font-black text-[#14263D]">{lang === "ar" ? "أسئلة شائعة" : "FAQ"}</h2>
            <Faq items={det.faqs} />
            {det.sources && det.sources.length > 0 && (
              <div className="mt-10">
                <h3 className="font-heading text-lg font-black text-[#14263D]">{lang === "ar" ? "المصادر" : "Sources"}</h3>
                <ul className="mt-3 space-y-2">
                  {det.sources.map((src) => (
                    <li key={src.url}><a href={src.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1267A2] underline-offset-4 hover:underline">{src.label}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        );
        return isIdeaSlug(e.slug) ? <IdeaStory slug={e.slug} lang={lang} details={details} />
          : e.slug.startsWith("ai-hr") ? <AiHrStory lang={lang} details={details} />
          : e.slug.startsWith("replace-excel") ? <SmallBizStory lang={lang} details={details} />
          : <AttendanceStory lang={lang} details={details} />;
      })()}
      <RelatedArticles slug={e.slug} cards={cards} lang={lang} go={go} hrefFor={hrefFor} Fwd={Fwd} t={t} />
    </>
  );
}

function Reader({ current, cards, t, Back, Fwd, go, hrefFor }: { current: Card; cards: Card[]; t: (typeof copy)["ar"]; Back: typeof ArrowLeft; Fwd: typeof ArrowLeft; go: Go; hrefFor: (slug: string) => string }) {
  const { language } = useLanguage();
  const lang = language as Lang;
  const { a, e, min } = current;
  const cat = categories[e.category];
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const idx = cards.findIndex((c) => c.e.slug === e.slug);
  const next = cards[(idx + 1) % cards.length];

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setProgress(Math.min(100, Math.max(0, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const els = a.blocks.filter((b) => b.heading).map((b) => document.getElementById(b.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((x) => x.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id);
    }, { rootMargin: "-90px 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [a]);

  const jump = (id: string) => (ev: React.MouseEvent) => {
    ev.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const toc = a.blocks.filter((b) => b.heading);
  const nextCat = categories[next.e.category];

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
        <div className="h-full origin-start transition-[width] duration-100" style={{ width: `${progress}%`, background: cat.accent }} />
      </div>

      <section className="px-5 pb-10 pt-10 sm:px-8" style={{ background: `linear-gradient(180deg, ${cat.soft}, #F7FAFD)` }}>
        <div className="mx-auto max-w-5xl">
          <a href={hrefFor("")} onClick={(ev) => { ev.preventDefault(); go(""); }} className="inline-flex items-center gap-2 rounded-full border border-[#B7D5E9] bg-white px-4 py-2 text-sm font-black text-[#24516F] hover:shadow-md">
            <Back size={16} aria-hidden />{t.back}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-black">
            <span className="rounded-full bg-white px-3 py-1" style={{ color: cat.accent }}>{cat.emoji} {cat[lang]}</span>
            <span className="inline-flex items-center gap-1.5 text-[#4D657A]"><Clock size={14} aria-hidden />{min} {t.min}</span>
          </div>
          <h1 className="mt-4 max-w-4xl font-heading text-[2.2rem] font-black leading-[1.25] text-[#142D4A] sm:text-[3.2rem]">{a.title}</h1>
          <p className="mt-5 max-w-3xl border-s-4 ps-5 text-lg font-bold leading-[1.9] text-[#2C5373]" style={{ borderColor: cat.accent }}>{a.intro}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label={t.toc} className="sticky top-28">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#61798D]">{t.toc}</p>
            <ol className="space-y-1 border-s border-[#DCE7F0]">
              {toc.map((b) => (
                <li key={b.id}>
                  <a href={`#${b.id}`} onClick={jump(b.id)} className={`-ms-px block border-s-2 py-1.5 ps-4 text-sm font-bold leading-6 transition-colors ${active === b.id ? "text-[#142D4A]" : "border-transparent text-[#61798D] hover:text-[#142D4A]"}`}
                    style={active === b.id ? { borderColor: cat.accent } : undefined}>{b.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0">
          {a.blocks.map((b, bi) => (
            <section key={b.id} id={b.id} className="scroll-mt-28 pb-12">
              {b.heading && (
                <h2 className="flex items-start gap-3 font-heading text-2xl font-black leading-snug text-[#142D4A] sm:text-3xl">
                  <span className="mt-1 flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-mono text-sm font-bold text-white" style={{ background: cat.accent }}>{bi + (a.blocks[0].heading ? 1 : 0)}</span>
                  {b.heading}
                </h2>
              )}
              {b.paragraphs && <div className="mt-5 space-y-5">{b.paragraphs.map((p) => <p key={p} className="text-lg leading-[2] text-[#3F566B]">{p}</p>)}</div>}
              {b.items && (
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {b.items.map((it) => (
                    <div key={it.title} className="rounded-2xl border border-[#DCE7F0] bg-white p-5 shadow-sm" style={{ borderTop: `4px solid ${cat.accent}` }}>
                      <h3 className="font-heading text-lg font-black text-[#173451]">{it.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#597086]">{it.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {a.faqs && a.faqs.length > 0 && (
            <section className="pb-12">
              <h2 className="font-heading text-2xl font-black text-[#142D4A] sm:text-3xl">{t.faq}</h2>
              <div className="mt-5 space-y-3">
                {a.faqs.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-[#DCE7F0] bg-white px-5 open:shadow-md">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-base font-black text-[#193B57] [&::-webkit-details-marker]:hidden">
                      {f.q}<span aria-hidden className="text-xl transition-transform group-open:rotate-45" style={{ color: cat.accent }}>+</span>
                    </summary>
                    <p className="pb-5 text-sm leading-8 text-[#5B7488] sm:text-base">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {cards.length > 1 && (
            <button type="button" onClick={() => go(next.e.slug)} className="group block w-full rounded-[28px] p-7 text-start text-white transition-transform hover:-translate-y-1" style={{ background: `linear-gradient(135deg, #143552, ${nextCat.accent})` }}>
              <p className="text-xs font-black uppercase tracking-wider text-white/70">{t.next}</p>
              <p className="mt-2 font-heading text-2xl font-black leading-snug">{next.a.title}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black transition-all group-hover:gap-3">{t.read}<Fwd size={17} aria-hidden /></span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
