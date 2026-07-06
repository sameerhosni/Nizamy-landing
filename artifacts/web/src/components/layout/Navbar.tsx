import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

const navLinks = {
  en: [
    { id: "problem", label: "The Problem" },
    { id: "return-model", label: "Return Model" },
    { id: "features", label: "Features" },
    { id: "advantages", label: "Advantages" },
    { id: "calculator", label: "Calculator" },
  ],
  ar: [
    { id: "problem", label: "المشكلة" },
    { id: "return-model", label: "نموذج العائد" },
    { id: "features", label: "المزايا" },
    { id: "advantages", label: "الأفضليات" },
    { id: "calculator", label: "الحاسبة" },
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
  const linkColor = scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/85 hover:text-white";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-2">
        <Logo variant={scrolled ? "dark" : "light"} className="shrink" />

        <div className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`nav-link-underline text-[15px] font-medium transition-colors duration-300 ${linkColor}`}
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
            className={`rounded-full font-medium transition-colors duration-300 px-2.5 sm:px-4 text-xs sm:text-sm ${
              scrolled ? "" : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {language === "en" ? "العربية" : "EN"}
          </Button>
          <div className="btn-border-wrap">
            <Button
              size="sm"
              className="cta-slide-btn rounded-full px-3.5 sm:px-5 text-xs sm:text-sm whitespace-nowrap border-0"
              onClick={() => scrollTo("partner")}
            >
              {isRtl ? "وصول مبكر" : "Design Partner"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
