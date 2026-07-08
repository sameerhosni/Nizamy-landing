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
        scrolled ? "border-b border-white/10 shadow-lg" : "border-b border-white/5"
      }`}
      style={{ backgroundColor: "rgba(11,8,23,0.72)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-2">
        <Logo variant="light" className="shrink" />

        <div className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="nav-link-underline text-[15px] font-medium transition-colors duration-300 text-white/85 hover:text-white"
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
            className="rounded-full font-medium transition-colors duration-300 px-2.5 sm:px-4 text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/10 border border-white/15"
          >
            {language === "en" ? "العربية" : "EN"}
          </Button>
          <Button
            size="sm"
            className="rounded-full px-3.5 sm:px-5 text-xs sm:text-sm whitespace-nowrap border-0 bg-[#6D4AFF] hover:bg-[#8B6BFF] text-white shadow-glow-sm"
            onClick={() => scrollTo("partner")}
          >
            {isRtl ? "وصول مبكر مجاني" : "Free Early Access"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
