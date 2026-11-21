import { Link } from "wouter";
import { BookOpen, ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";

const blogContent = {
  en: {
    back: "Back to home",
    eyebrow: "Nizamy Insights",
    title: "HR Intelligence & Perspectives",
    intro: "Expert perspectives on HR technology, artificial intelligence, and the future of work in Saudi Arabia. Discover strategies to elevate your workplace.",
    featuredBadge: "Published article",
    category: "AI & HR Technology",
    articleTitle: "AI HR Software in Saudi Arabia: Employee Attendance, Performance & Management in One App",
    excerpt: "A practical guide to using AI-powered HR software and mobile attendance in Saudi Arabia—while keeping internal HR workflows distinct from Qiwa and preserving human judgment.",
    readTime: "12 min read",
    editorial: "Nizamy Editorial",
    editorialTeam: "HR Insights Team",
    readArticle: "Read the article",
    app: {
      title: "Nizamy HR App: A Guide to Managing Employees, Attendance and Payroll",
      excerpt: "How Nizamy brings attendance, self-service, reports, rewards and payroll into one platform for small and medium businesses.",
      category: "HR App",
      readTime: "6 min read",
      alt: "Nizamy HR app interface for mobile attendance check-in and tracking punctuality",
    },
  },
  ar: {
    back: "العودة إلى الرئيسية",
    eyebrow: "رؤى نظامي",
    title: "ذكاء ووجهات نظر الموارد البشرية",
    intro: "وجهات نظر متخصصة حول تكنولوجيا الموارد البشرية والذكاء الاصطناعي ومستقبل العمل في المملكة العربية السعودية. اكتشف استراتيجيات للارتقاء ببيئة عملك.",
    featuredBadge: "مقال منشور",
    category: "الذكاء الاصطناعي والموارد البشرية",
    articleTitle: "الذكاء الاصطناعي في إدارة الموارد البشرية في السعودية: الحضور والأداء وإدارة الموظفين في تطبيق واحد",
    excerpt: "دليل عملي للاستفادة من برامج الموارد البشرية الذكية وتطبيقات الحضور في السعودية، مع التمييز بين الإجراءات الداخلية ومنصة قوى والحفاظ على دور المراجعة البشرية.",
    readTime: "١٢ دقيقة قراءة",
    editorial: "فريق تحرير نظامي",
    editorialTeam: "فريق رؤى الموارد البشرية",
    readArticle: "اقرأ المقال",
    app: {
      title: "تطبيق الموارد البشرية نظامي: دليل لإدارة الموظفين والحضور والرواتب",
      excerpt: "كيف يجمع نظامي الحضور والخدمات الذاتية والتقارير والتحفيز والرواتب في منصة واحدة للمنشآت الصغيرة والمتوسطة.",
      category: "تطبيق الموارد البشرية",
      readTime: "٦ دقائق قراءة",
      alt: "واجهة تطبيق الموارد البشرية نظامي لتسجيل الحضور ومتابعة الالتزام عبر الجوال",
    },
  },
};

export function Blog() {
  const { language, dir, toggleLanguage } = useLanguage();
  const t = blogContent[language];
  const BackArrow = dir === "rtl" ? ChevronRight : ChevronLeft;
  const ReadArrow = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={dir}>
      <SeoHead page="blog" />
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" data-testid="link-blog-logo-home">
            <Logo variant="dark" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              data-testid="button-blog-language"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600 hover:shadow-md"
            >
              {language === "en" ? "العربية" : "EN"}
            </button>
            <Link href="/" data-testid="link-blog-back-home">
              <span className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600 hover:shadow-md">
                <BackArrow size={16} />
                <span className="hidden sm:inline">{t.back}</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto mb-14 max-w-3xl animate-in fade-in slide-in-from-bottom-8 text-center duration-700">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-600">
            <Sparkles size={16} className="text-blue-500" />
            <span className="uppercase tracking-wider">{t.eyebrow}</span>
          </div>
          <h1 className="mb-6 text-balance font-heading text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="text-balance text-lg font-medium leading-relaxed text-slate-500 sm:text-xl">{t.intro}</p>
        </div>

        <Link
          href="/blog/ai-hr-saudi-arabia"
          className="group mb-16 block overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(33,150,243,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-64 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 md:min-h-[390px]">
                <img
                  src={`${import.meta.env.BASE_URL}images/saudi-hr-editorial.webp`}
                  alt={language === "en" ? "Saudi HR colleagues reviewing employee information together on a laptop" : "زميلان في فريق الموارد البشرية بالسعودية يراجعان معلومات الموظفين على حاسوب محمول"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute start-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                  <BookOpen size={14} />
                  {t.featuredBadge}
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-400">
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-600">{t.category}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock size={15} />{t.readTime}</span>
                </div>
                <h2 className="mb-5 font-heading text-2xl font-black leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:text-3xl">
                  {t.articleTitle}
                </h2>
                <p className="mb-8 text-base font-medium leading-relaxed text-slate-500 sm:text-lg">{t.excerpt}</p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      <Logo variant="dark" className="origin-center scale-[0.4] translate-y-1" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{t.editorial}</span>
                      <span className="text-xs font-medium text-slate-500">{t.editorialTeam}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                    {t.readArticle}
                    <ReadArrow size={17} />
                  </span>
                </div>
              </div>
            </div>
        </Link>
        <Link
          href="/blog/hr-app-nizamy"
          data-testid="link-blog-card-hr-app-nizamy"
          className="group mb-16 block overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(33,150,243,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          <div className="grid md:grid-cols-2">
            <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6 md:min-h-[360px]">
              <img src={`${import.meta.env.BASE_URL}images/attendance-app-screen.webp`} alt={t.app.alt} className="h-64 w-full object-contain md:h-[320px]" loading="lazy" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-400">
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-600">{t.app.category}</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={15} />{t.app.readTime}</span>
              </div>
              <h2 className="mb-5 font-heading text-2xl font-black leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:text-3xl">{t.app.title}</h2>
              <p className="mb-8 text-base font-medium leading-relaxed text-slate-500 sm:text-lg">{t.app.excerpt}</p>
              <span className="mt-auto inline-flex items-center gap-2 border-t border-slate-100 pt-6 text-sm font-bold text-blue-600">
                {t.readArticle}
                <ReadArrow size={17} />
              </span>
            </div>
          </div>
        </Link>
      </main>
      <Footer />
    </div>
  );
}