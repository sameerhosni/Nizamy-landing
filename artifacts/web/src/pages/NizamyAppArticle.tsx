import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { SeoHead } from "@/components/SeoHead";
import { ServiceDownloadBadges } from "@/components/ui/ServiceDownloadBadges";
import { useLanguage } from "@/lib/i18n";
import content from "./nizamyAppArticleContent.json";

const sectionLinks: Record<number, { href: string; ar: string; en: string }> = {
  0: { href: "/small-business-hr-software-saudi-arabia", ar: "اطّلع على برنامج الموارد البشرية للمنشآت الصغيرة", en: "See HR software for small businesses" },
  2: { href: "/services/attendance-performance", ar: "صفحة تسجيل الحضور والانصراف", en: "Attendance and check-in page" },
  4: { href: "/services/ai-hr", ar: "تعرّف على الموارد البشرية بالذكاء الاصطناعي", en: "Explore AI for HR" },
  5: { href: "/services/employee-rewards", ar: "تعرّف على مكافآت الموظفين", en: "Explore employee rewards" },
};

export function NizamyAppArticle() {
  const { language, dir, toggleLanguage } = useLanguage();
  const isAr = language === "ar";
  const a = content[language];
  const BackIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const LinkIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
  const num = (n: number) => (isAr ? n.toLocaleString("ar-SA") : String(n));
  const pill = "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600";

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={dir}>
      <SeoHead page="nizamyAppArticle" />
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" data-testid="link-nizamy-article-logo-home"><Logo variant="dark" /></Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={toggleLanguage} data-testid="button-nizamy-article-language" className={pill}>
              {isAr ? "EN" : "العربية"}
            </button>
            <Link href="/blog" data-testid="link-nizamy-article-back-blog" className={pill}>
              <BackIcon size={16} />
              <span>{isAr ? "كل المقالات" : "All insights"}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 sm:py-16">
        <article className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)]">
          <div className="flex h-72 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-5 sm:h-[460px]">
            <img
              src={`${import.meta.env.BASE_URL}images/attendance-app-screen.webp`}
              alt={a.heroAlt}
              className="h-full w-full object-contain"
              fetchPriority="high"
            />
          </div>

          <div className="px-5 py-9 sm:px-10 sm:py-12 lg:px-16">
            <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                {isAr ? "رؤى نظامي · تطبيق الموارد البشرية" : "Nizamy Insights · HR app"}
              </p>
              <h1 className="mb-6 text-balance font-heading text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {a.title}
              </h1>
              <p className="text-lg font-medium leading-relaxed text-slate-500 sm:text-xl">{a.dek}</p>
            </header>

            <div className="mx-auto max-w-3xl">
              <nav aria-label={isAr ? "محتويات المقال" : "Table of contents"} className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6" data-testid="nav-nizamy-article-toc">
                <p className="mb-3 font-heading text-base font-black text-slate-900">{isAr ? "في هذا المقال" : "In this article"}</p>
                <ol className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  {a.sections.map((s, i) => (
                    <li key={i}>
                      <a href={`#nizamy-section-${i + 1}`} className="group flex items-baseline gap-2 rounded-md py-1.5 text-sm font-semibold leading-6 text-slate-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                        <span className="w-6 shrink-0 text-blue-500">{num(i + 1)}</span>
                        <span className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 rtl:motion-safe:group-hover:-translate-x-0.5">{s.heading}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="mb-10 space-y-5 text-base leading-8 text-slate-600 sm:mb-12 sm:text-lg sm:leading-9">
                {a.intro.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              <div className="space-y-10 sm:space-y-12">
                {a.sections.map((s, i) => {
                  const link = sectionLinks[i];
                  return (
                    <section key={i} id={`nizamy-section-${i + 1}`} className="scroll-mt-28">
                      <h2 className="mb-5 flex items-baseline gap-3 border-b border-slate-100 pb-4 font-heading text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                        <span className="text-blue-500">{num(i + 1)}</span>
                        <span>{s.heading}</span>
                      </h2>
                      <div className="space-y-4 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                        {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                      </div>
                      {link && (
                        <Link href={link.href} data-testid={`link-nizamy-article-related-${i + 1}`} className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 sm:text-base">
                          {isAr ? link.ar : link.en}
                          <LinkIcon size={16} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 rtl:motion-safe:group-hover:-translate-x-0.5" />
                        </Link>
                      )}
                    </section>
                  );
                })}
              </div>

              <aside className="mt-12 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-slate-700 sm:text-base" data-testid="note-nizamy-article-judgment">
                <Info size={20} className="mt-1 shrink-0 text-amber-700" aria-hidden="true" />
                <p>
                  {isAr
                    ? "ملاحظة: تتوفر بعض الميزات بحسب الباقة وأهلية المنشأة. لا يُعد هذا المقال شهادة قانونية ولا ضمانًا للامتثال النظامي، ويبقى تفسير الأنظمة والقرارات المتعلقة بالموظفين من مسؤولية المختصين والمراجعين من فريقك."
                    : "Note: some features are available according to your plan and organization's eligibility. This article is not legal certification or a guarantee of statutory compliance, and interpreting regulations and employee decisions remains the responsibility of qualified people on your team."}
                </p>
              </aside>

              <section className="mt-8 rounded-2xl bg-blue-50 p-6 text-center sm:p-8" aria-labelledby="nizamy-article-cta">
                <h2 id="nizamy-article-cta" className="mb-3 font-heading text-xl font-black text-slate-900 sm:text-2xl">
                  {isAr ? "حمّل تطبيق نظامي" : "Download the Nizamy app"}
                </h2>
                <p className="mb-6 text-base font-medium leading-8 text-slate-600">
                  {isAr ? "ابدأ بمتابعة الحضور والخدمات الذاتية من جوالك." : "Start with attendance and self-service from your phone."}
                </p>
                <ServiceDownloadBadges pageKey="nizamy-app-article" placement="final" centered />
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
