import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { language } = useLanguage();
  const tagline = {
    en: "AI-powered HR — for Saudi SMEs. © 2026",
    ar: "الموارد البشرية بالذكاء الاصطناعي — للمنشآت السعودية. © 2026",
  };

  return (
    <footer className="bg-mrhr-dark py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <Logo />
          <p className="text-sm text-white/40">{tagline[language]}</p>
        </div>
      </div>
    </footer>
  );
}
