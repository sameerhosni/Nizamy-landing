import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

const navLinks = {
  en: [
    { id: "problem", label: "The Problem" },
    { id: "return-model", label: "Return Model" },
    { id: "calculator", label: "Calculator" },
    { id: "features", label: "Features" },
  ],
  ar: [
    { id: "problem", label: "المشكلة" },
    { id: "return-model", label: "نموذج العائد" },
    { id: "calculator", label: "الحاسبة" },
    { id: "features", label: "المزايا" },
  ],
};

export function Navbar() {
  const { language, toggleLanguage, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = navLinks[language];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-xl ${
        scrolled ? "border-b border-slate-200/50 bg-white/80 shadow-sm" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-2">
        <Logo variant={scrolled ? "dark" : "dark"} className="shrink" />

        <div className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="nav-link-underline text-[15px] font-semibold transition-colors duration-300 text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-full font-bold transition-colors duration-300 px-2.5 sm:px-4 text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/50"
          >
            {language === "en" ? "العربية" : "EN"}
          </Button>
          <Button
            size="sm"
            className="rounded-full px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap border-0 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:shadow-lg"
            onClick={() => scrollTo("partner")}
          >
            {isRtl ? "وصول مبكر مجاني" : "Free Early Access"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
