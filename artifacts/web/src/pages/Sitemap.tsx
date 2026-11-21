import { Link } from "wouter";
import { ArrowUpRight, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";

const sitemapContent = {
  en: {
    eyebrow: "Nizamy HR",
    title: "Sitemap",
    intro: "Explore the pages and sections available on the Nizamy HR website.",
    home: "Home",
    homeDescription: "The complete Nizamy HR overview.",
    sections: "Website sections",
    sectionDescription: "Jump directly to a section on the home page.",
    links: [
      { label: "Why Nizamy", href: "/#why-nizamy" },
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Plans", href: "/#pricing" },
      { label: "Proven results", href: "/#use-cases" },
      { label: "Become a design partner", href: "/#design-partner" },
    ],
    resources: "Resources and policies",
    pages: [
      { label: "Reports", href: "/services/reports" },
      { label: "Payroll inputs", href: "/services/payroll-inputs" },
      { label: "Blog", href: "/blog" },
      { label: "HR blog", href: "/hr-blog" },
      { label: "Face attendance system", href: "/hr-blog/face-attendance-system-saudi-arabia" },
      { label: "AI HR assistant for employee requests", href: "/hr-blog/ai-hr-assistant-employee-requests" },
      { label: "Replace Excel and WhatsApp for HR", href: "/hr-blog/replace-excel-whatsapp-hr-management" },
      { label: "Payroll that's ready before you need it", href: "/hr-blog/payroll-readiness-checklist-saudi" },
      { label: "Ramadan hours, without the mix-ups", href: "/hr-blog/ramadan-working-hours-saudi-attendance" },
      { label: "Your annual leave: how many days?", href: "/hr-blog/annual-leave-days-saudi-calculator" },
      { label: "Attendance: a signal, not a verdict", href: "/hr-blog/read-attendance-signals-fairly-saudi" },
      { label: "Start with AI one step at a time", href: "/hr-blog/ai-hr-small-steps-saudi-teams" },
      { label: "End-of-service award: work it out yourself", href: "/hr-blog/end-of-service-benefits-calculator-saudi" },
      { label: "Sick leave: how much are you paid?", href: "/hr-blog/sick-leave-pay-saudi-labor-law" },
      { label: "AI HR software in Saudi Arabia", href: "/blog/ai-hr-saudi-arabia" },
      { label: "Nizamy HR app: employees, attendance and payroll", href: "/blog/hr-app-nizamy" },
      { label: "Employee attendance and performance", href: "/services/attendance-performance" },
      { label: "AI in HR", href: "/services/ai-hr" },
      { label: "Employee rewards", href: "/services/employee-rewards" },
      { label: "HR software for small businesses", href: "/small-business-hr-software-saudi-arabia" },
      { label: "Help center", href: "/help" },
      { label: "Pricing page", href: "/pricing" },
      { label: "Face data and security", href: "/biometric-data-security" },
    ],
    policies: [
      { label: "Terms of Service", href: "https://api.nizamy.app/privacy_policy_en.html" },
    ],
    contact: "Contact us",
    email: "sales@nizamy.app",
    back: "Back to home",
  },
  ar: {
    eyebrow: "نظامي اتش آر",
    title: "خريطة الموقع",
    intro: "تعرّف على الصفحات والأقسام المتاحة في موقع نظامي اتش آر.",
    home: "الرئيسية",
    homeDescription: "نظرة كاملة على نظامي اتش آر.",
    sections: "أقسام الموقع",
    sectionDescription: "انتقل مباشرةً إلى أي قسم في الصفحة الرئيسية.",
    links: [
      { label: "لماذا نظامي", href: "/#why-nizamy" },
      { label: "المميزات", href: "/#features" },
      { label: "كيف يعمل النظام", href: "/#how-it-works" },
      { label: "الباقات", href: "/#pricing" },
      { label: "نتائج مثبتة", href: "/#use-cases" },
      { label: "كن شريكاً في التصميم", href: "/#design-partner" },
    ],
    resources: "الموارد والسياسات",
    pages: [
      { label: "التقارير", href: "/services/reports" },
      { label: "مدخلات الرواتب", href: "/services/payroll-inputs" },
      { label: "المدونة", href: "/blog" },
      { label: "سالفة اتش آر", href: "/hr-blog" },
      { label: "نظام حضور بالوجه من الجوال", href: "/hr-blog/face-attendance-system-saudi-arabia" },
      { label: "مساعد موارد بشرية ذكي لطلبات الموظفين", href: "/hr-blog/ai-hr-assistant-employee-requests" },
      { label: "بديل إكسل وواتساب لإدارة الموارد البشرية", href: "/hr-blog/replace-excel-whatsapp-hr-management" },
      { label: "مسير الرواتب جاهز قبل لا تحتاجه", href: "/hr-blog/payroll-readiness-checklist-saudi" },
      { label: "دوام رمضان بدون لخبطة", href: "/hr-blog/ramadan-working-hours-saudi-attendance" },
      { label: "إجازتك السنوية كم يومًا؟", href: "/hr-blog/annual-leave-days-saudi-calculator" },
      { label: "الحضور إشارة مو حكم", href: "/hr-blog/read-attendance-signals-fairly-saudi" },
      { label: "ابدأ بالذكاء الاصطناعي خطوة خطوة", href: "/hr-blog/ai-hr-small-steps-saudi-teams" },
      { label: "مكافأة نهاية الخدمة احسبها بنفسك", href: "/hr-blog/end-of-service-benefits-calculator-saudi" },
      { label: "الإجازة المرضية كم يُدفع لك؟", href: "/hr-blog/sick-leave-pay-saudi-labor-law" },
      { label: "الذكاء الاصطناعي في إدارة الموارد البشرية", href: "/blog/ai-hr-saudi-arabia" },
      { label: "تطبيق الموارد البشرية نظامي لإدارة الموظفين والحضور والرواتب", href: "/blog/hr-app-nizamy" },
      { label: "خدمة الحضور والانصراف وتحسين الأداء", href: "/services/attendance-performance" },
      { label: "الذكاء الاصطناعي في الموارد البشرية", href: "/services/ai-hr" },
      { label: "مكافآت الموظفين", href: "/services/employee-rewards" },
      { label: "برنامج موارد بشرية للمنشآت", href: "/small-business-hr-software-saudi-arabia" },
      { label: "مركز المساعدة", href: "/help" },
      { label: "صفحة الأسعار", href: "/pricing" },
      { label: "بيانات الوجه والأمان", href: "/biometric-data-security" },
    ],
    policies: [
      { label: "شروط الخدمة", href: "https://api.nizamy.app/privacy_policy_ar.html" },
    ],
    contact: "تواصل معنا",
    email: "sales@nizamy.app",
    back: "العودة إلى الرئيسية",
  },
};

export function Sitemap() {
  const { language, dir } = useLanguage();
  const t = sitemapContent[language];
  const isRtl = dir === "rtl";
  const Arrow = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-slate-50" dir={dir}>
      <SeoHead page="sitemap" />
      <header className="border-b border-slate-200/80 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/">
            <Logo variant="dark" />
          </Link>
          <Link href="/">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600">
              {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              {t.back}
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-blue-600">{t.eyebrow}</p>
          <h1 className="mb-5 text-4xl font-heading font-black tracking-tight text-slate-900 sm:text-6xl">{t.title}</h1>
          <p className="text-lg font-medium leading-relaxed text-slate-500">{t.intro}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgb(15,23,42,0.04)] sm:p-8">
            <h2 className="mb-2 text-2xl font-heading font-black text-slate-900">{t.home}</h2>
            <p className="mb-6 text-sm font-medium text-slate-500">{t.homeDescription}</p>
            <Link href="/">
              <span className="group inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700">
                {t.home}
                <Arrow size={17} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </span>
            </Link>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgb(15,23,42,0.04)] sm:p-8">
            <h2 className="mb-2 text-2xl font-heading font-black text-slate-900">{t.sections}</h2>
            <p className="mb-5 text-sm font-medium text-slate-500">{t.sectionDescription}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {t.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="group inline-flex items-center gap-2 font-bold text-slate-700 transition-colors hover:text-blue-600">
                    <Arrow size={16} className="text-blue-500 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgb(15,23,42,0.04)] sm:p-8">
            <h2 className="mb-5 text-2xl font-heading font-black text-slate-900">{t.resources}</h2>
            <ul className="space-y-3">
              {t.pages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} data-testid="link-sitemap-blog">
                    <span className="group inline-flex items-center gap-2 font-bold text-slate-700 transition-colors hover:text-blue-600">
                      <Arrow size={16} className="text-blue-500 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
              {t.policies.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-bold text-slate-700 transition-colors hover:text-blue-600">
                    {link.label}
                    <ArrowUpRight size={16} className="text-slate-400 transition-colors group-hover:text-blue-600" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[24px] border border-blue-100 bg-blue-50/70 p-7 sm:p-8">
            <h2 className="mb-5 text-2xl font-heading font-black text-slate-900">{t.contact}</h2>
            <a href={`mailto:${t.email}`} className="inline-flex items-center gap-3 font-bold text-blue-700 transition-colors hover:text-blue-900" dir="ltr">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <Mail size={17} />
              </span>
              {t.email}
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}