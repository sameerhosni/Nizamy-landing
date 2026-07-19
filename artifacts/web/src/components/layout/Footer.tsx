import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { language } = useLanguage();
  const tagline = {
    en: "AI-powered HR. © 2026",
    ar: "الموارد البشرية بالذكاء الاصطناعي © 2026",
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <Logo variant="light" />
          <a
            href="https://www.nizamy.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white/30 hover:text-white/70 transition-colors"
            dir="ltr"
          >
            www.nizamy.app
          </a>
          <p className="text-sm font-medium text-white/20">{tagline[language]}</p>
        </div>
      </div>
    </footer>
  );
}
