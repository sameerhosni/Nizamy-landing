import { Mail } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { useLanguage } from "@/lib/i18n";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

type Props = { languageOverride?: "ar" | "en"; onLanguageToggle?: () => void };

/** Light header used by the HR blog pages (the landing navbar is built for in-page anchors on the home page). */
export function Navbar({ languageOverride, onLanguageToggle }: Props = {}) {
  const { language: ctx, toggleLanguage } = useLanguage();
  const language = languageOverride ?? ctx;
  const toggle = onLanguageToggle ?? toggleLanguage;
  const en = language === "en";
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 py-3 backdrop-blur-xl">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href={`${base}/`} aria-label="Nizamy HR" className="min-w-0"><Logo variant="dark" className="h-8 w-auto" /></a>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href={`${base}${en ? "/en/hr-blog" : "/hr-blog"}`} className="hidden text-sm font-bold text-slate-600 hover:text-blue-600 sm:inline">{en ? "HR blog" : "سالفة اتش آر"}</a>
          <a href={`${base}/`} className="hidden text-sm font-bold text-slate-600 hover:text-blue-600 sm:inline">{en ? "Home" : "الرئيسية"}</a>
          <button type="button" onClick={toggle} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:border-blue-600 hover:text-blue-600">{en ? "العربية" : "English"}</button>
          <a href={`${base}/#partner`} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-black text-white hover:bg-blue-700">{en ? "Try free" : "جرّب مجانًا"}</a>
        </div>
      </div>
    </nav>
  );
}

export function Footer({ languageOverride }: { languageOverride?: "ar" | "en" }) {
  const { language: ctx } = useLanguage();
  const language = languageOverride ?? ctx;
  const en = language === "en";
  const links = en
    ? [{ l: "Home", h: "/" }, { l: "HR blog", h: "/en/hr-blog" }, { l: "Pricing", h: "/#pricing" }]
    : [{ l: "الرئيسية", h: "/" }, { l: "سالفة اتش آر", h: "/hr-blog" }, { l: "الأسعار", h: "/#pricing" }];
  return (
    <footer className="border-t border-slate-200/80 bg-white pb-8 pt-14">
      <div className="container mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo variant="dark" />
          <p className="mt-5 max-w-md text-[16px] font-medium leading-relaxed text-slate-500">
            {en ? "AI-powered HR system designed to elevate performance and return value to your business." : "نظام موارد بشرية يساعدك تنظّم شغل موظفينك وتخفّف المتابعة اليومية، بمساعدة الذكاء الاصطناعي."}
          </p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <h4 className="mb-5 font-heading text-lg font-black text-slate-900">{en ? "Quick Links" : "روابط سريعة"}</h4>
          <ul className="space-y-3">{links.map((x) => <li key={x.h}><a href={`${base}${x.h}`} className="text-[15px] font-bold text-slate-500 hover:text-blue-600">{x.l}</a></li>)}</ul>
        </div>
        <div className="md:col-span-3">
          <h4 className="mb-5 font-heading text-lg font-black text-slate-900">{en ? "Get in Touch" : "تواصل معنا"}</h4>
          <a href="mailto:sales@nizamy.app" dir="ltr" className="inline-flex items-center gap-4 font-bold text-slate-600 hover:text-blue-600">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Mail size={19} /></span>
            <span className="text-[15px]">sales@nizamy.app</span>
          </a>
          <SocialLinks language={language} />
        </div>
      </div>
      <p className="mt-10 text-center text-[15px] font-bold text-slate-400">{en ? "© 2026 Nizamy HR. All rights reserved." : "© 2026 نظامي اتش آر. جميع الحقوق محفوظة."}</p>
    </footer>
  );
}
