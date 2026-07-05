import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

export function Navbar() {
  const { language, toggleLanguage, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo variant={scrolled ? "dark" : "light"} />

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className={`rounded-full font-medium transition-colors duration-300 ${
              scrolled ? "" : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {language === "en" ? "العربية" : "EN"}
          </Button>
          <Button
            size="sm"
            className="rounded-full shadow-glow"
            onClick={() =>
              document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {isRtl ? "وصول مبكر مجاني" : "Design Partner"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
