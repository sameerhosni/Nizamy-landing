import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { Mail } from "lucide-react";
import { SocialLinks } from "@/components/layout/SocialLinks";

export function Footer({ showCreator = false, languageOverride }: { showCreator?: boolean; languageOverride?: "ar" | "en" }) {
  const { language: contextLanguage, dir: contextDir } = useLanguage();
  const language = languageOverride ?? contextLanguage;
  const dir = languageOverride ? (languageOverride === "ar" ? "rtl" : "ltr") : contextDir;
  const isRtl = dir === "rtl";

  const content = {
    en: {
      tagline: "AI-powered HR system designed to elevate performance and return value to your business.",
      copyright: "© 2026 Nizamy HR. All rights reserved.",
      creator: "Created by Moltaqa Ala'mal for technology",
      links: [
        { label: "Home", href: "/" },
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Blog", href: "/blog" },
        { label: "HR blog", href: "/hr-blog" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "https://api.nizamy.app/privacy_policy_en.html" },
      ]
    },
    ar: {
      tagline: "نظام موارد بشرية يساعدك تنظّم شغل موظفينك وتخفّف المتابعة اليومية، بمساعدة الذكاء الاصطناعي.",
      copyright: "© 2026 نظامي اتش آر. جميع الحقوق محفوظة.",
      creator: "تم الإنشاء بواسطة ملتقى الأعمال للتقنية",
      links: [
        { label: "الرئيسية", href: "/" },
        { label: "المميزات", href: "/#features" },
        { label: "الأسعار", href: "/#pricing" },
        { label: "المدونة", href: "/blog" },
        { label: "سالفة اتش آر", href: "/hr-blog" },
      ],
      legal: [
        { label: "سياسة الخصوصية", href: "/privacy-policy" },
        { label: "شروط الخدمة", href: "https://api.nizamy.app/privacy_policy_ar.html" },
      ]
    },
  };

  const t = content[language];
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <>
    <footer className="bg-white pt-14 pb-8 border-t border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-12 lg:col-span-5">
            <div className="mb-5">
              <Logo variant="dark" />
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-md text-[16px]">
              {t.tagline}
            </p>
          </div>

          {/* Links Col */}
          <div className="md:col-span-6 lg:col-span-3 lg:col-start-7">
            <h4 className="font-heading font-black text-slate-900 text-lg mb-5">
              {language === "en" ? "Quick Links" : "روابط سريعة"}
            </h4>
            <ul className="space-y-3">
              {t.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href.startsWith("/") ? `${base}${link.href}` : link.href} className="text-slate-500 hover:text-blue-600 font-bold transition-colors text-[15px]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="font-heading font-black text-slate-900 text-lg mb-5">
              {language === "en" ? "Get in Touch" : "تواصل معنا"}
            </h4>
            <a 
              href="mailto:sales@nizamy.app" 
              className="inline-flex items-center gap-4 text-slate-600 font-bold hover:text-blue-600 transition-all group"
              dir="ltr"
            >
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Mail size={19} />
              </div>
              <span className="text-[15px]">sales@nizamy.app</span>
            </a>
            <SocialLinks language={language} />
          </div>

        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-[15px] font-bold">
            {t.copyright}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {t.legal.map((link, idx) => (
              <li key={idx}>
                {link.href.startsWith("/") ? (
                  <Link href={link.href} className="text-slate-400 hover:text-slate-600 text-[15px] font-bold transition-colors">{link.label}</Link>
                ) : (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 text-[15px] font-bold transition-colors">{link.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-center text-sm leading-relaxed text-slate-500" dir="rtl" lang="ar" data-testid="footer-trademark">
          علامة تجارية مملوكة لشركة أبحاث وتطوير الأعمال
        </p>
        {showCreator && (
          <p className="mt-4 text-center text-sm text-slate-500" dir={dir}>
            {t.creator}
          </p>
        )}
      </div>
    </footer>
    </>
  );
}
