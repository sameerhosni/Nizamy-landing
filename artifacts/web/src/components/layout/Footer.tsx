import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { language } = useLanguage();
  const tagline = {
    en: "AI-powered HR. © 2026",
    ar: "الموارد البشرية بالذكاء الاصطناعي © 2026",
  };

  return (
    <footer className="bg-slate-900 py-16 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo variant="light" />
          <a
            href="https://www.nizamy.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            dir="ltr"
          >
            www.nizamy.app
          </a>
          <p className="text-sm font-medium text-slate-500">{tagline[language]}</p>
        </div>
      </div>
    </footer>
  );
}
