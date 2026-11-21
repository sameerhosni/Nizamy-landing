import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/lib/i18n";
import articleContent from "./blogArticleContent.json";

const APP_STORE_URL = "https://apps.apple.com/sa/app/id6792693395";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.t2.nizamy";

export function BlogArticle() {
  const { language, dir, toggleLanguage } = useLanguage();
  const article = articleContent[language];
  const BackIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const CtaIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
  const renderParagraph = (paragraph: string, index: number, citationId?: string) => {
    const sourceIndex = article.sources.findIndex((source) => source.id === citationId);
    const source = article.sources[sourceIndex];
    return (
      <p key={index}>
        {paragraph}
        {source && (
          <>{" "}<sup className="whitespace-nowrap text-sm font-semibold">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${language === "en" ? "Source" : "المصدر"} ${sourceIndex + 1}: ${source.label}`}
              className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
            >
              [{sourceIndex + 1}]
            </a>
          </sup></>
        )}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={dir}>
      <SeoHead page="blogArticle" />
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" data-testid="link-article-logo-home">
            <Logo variant="dark" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              data-testid="button-article-language"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
            >
              {language === "en" ? "العربية" : "EN"}
            </button>
            <Link
              href="/blog"
              data-testid="link-article-back-blog"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
            >
              <BackIcon size={16} />
              <span>{language === "en" ? "All insights" : "كل المقالات"}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 sm:py-16">
        <article className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)]">
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 sm:h-[420px]">
            <img
              src={`${import.meta.env.BASE_URL}images/saudi-hr-editorial.webp`}
              alt={article.heroAlt}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
            <span className="absolute bottom-5 start-5 rounded-full border border-white/40 bg-white/90 px-4 py-2 text-xs font-bold text-blue-700 shadow-sm backdrop-blur sm:bottom-8 sm:start-8 sm:text-sm">
              {language === "en" ? "Nizamy Insights · AI & HR" : "رؤى نظامي · الذكاء الاصطناعي والموارد البشرية"}
            </span>
          </div>

          <div className="px-5 py-9 sm:px-10 sm:py-12 lg:px-16">
            <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                {language === "en" ? "A practical guide for Saudi businesses" : "دليل عملي للشركات السعودية"}
              </p>
              <h1 className="mb-6 font-heading text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <p className="text-lg font-medium leading-relaxed text-slate-500 sm:text-xl">{article.dek}</p>
            </header>

            <div className="mx-auto max-w-3xl">
              <div className="mb-10 space-y-5 text-base leading-8 text-slate-600 sm:mb-12 sm:text-lg sm:leading-9">
                {article.intro.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>

              <div className="space-y-10 sm:space-y-12">
                {article.sections.map((section, index) => (
                  <section key={`${section.heading}-${index}`} className="scroll-mt-28">
                    <h2 className="mb-5 border-b border-slate-100 pb-4 font-heading text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                      {section.heading}
                    </h2>
                    {section.paragraphs && section.paragraphs.length > 0 && (
                      <div className="space-y-4 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                        {section.paragraphs.map((paragraph, paragraphIndex) => renderParagraph(paragraph, paragraphIndex, "citations" in section ? (section.citations as Record<string, string>)?.[paragraphIndex] : undefined))}
                      </div>
                    )}
                    {section.list && (
                      <ul className="my-5 space-y-3 ps-6 text-base leading-8 text-slate-600 marker:text-blue-500 sm:text-lg">
                        {section.list.map((item, itemIndex) => <li key={itemIndex} className="ps-1">{item}</li>)}
                      </ul>
                    )}
                    {section.closingParagraphs && (
                      <div className="mt-4 space-y-4 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                        {section.closingParagraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                      </div>
                    )}
                    {section.subsections && (
                      <div className="mt-6 space-y-7">
                        {section.subsections.map((subsection, subsectionIndex) => (
                          <div key={`${subsection.heading}-${subsectionIndex}`}>
                            <h3 className="mb-3 font-heading text-xl font-extrabold leading-snug text-slate-800 sm:text-2xl">
                              {subsection.heading}
                            </h3>
                            <div className="space-y-4 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                              {subsection.paragraphs.map((paragraph, paragraphIndex) => renderParagraph(paragraph, paragraphIndex, "citations" in subsection ? (subsection.citations as Record<string, string>)?.[paragraphIndex] : undefined))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.faqs && (
                      <div className="mt-6 divide-y divide-slate-100">
                        {section.faqs.map((faq, faqIndex) => (
                          <div key={faqIndex} className="py-5 first:pt-0 last:pb-0">
                            <h3 className="mb-2 font-heading text-lg font-extrabold leading-snug text-slate-800 sm:text-xl">
                              {faq.question}
                            </h3>
                            <p className="text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.cta && (
                      <div className="mt-7 rounded-2xl bg-blue-50 p-5 sm:p-7">
                        <p className="mb-5 text-base font-semibold leading-8 text-slate-700 sm:text-lg">
                          {language === "en" ? "Explore the Nizamy mobile app and get started with employee attendance and self-service." : "تعرّف على تطبيق نظامي وابدأ بمتابعة حضور الموظفين والخدمات الذاتية."}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                          >
                            {language === "en" ? "Download on the App Store" : "حمّل من App Store"}
                            <CtaIcon size={16} />
                          </a>
                          <a
                            href={GOOGLE_PLAY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
                          >
                            {language === "en" ? "Get it on Google Play" : "احصل عليه من Google Play"}
                            <CtaIcon size={16} />
                          </a>
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}