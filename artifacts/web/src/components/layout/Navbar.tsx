import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Menu, X } from "lucide-react";

const navLinks = {
  en: [
    { id: "services", label: "What We Manage" },
    { id: "return-model", label: "Return Model" },
    { id: "calculator", label: "Calculator" },
    { id: "features", label: "Features" },
  ],
  ar: [
    { id: "services", label: "خدمات النظام" },
    { id: "return-model", label: "نموذج العائد" },
    { id: "calculator", label: "الحاسبة" },
    { id: "features", label: "المزايا" },
  ],
};

export function Navbar() {
  const { language, toggleLanguage, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const links = navLinks[language];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
            : "bg-transparent border-b border-white/5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Logo variant={scrolled ? "dark" : "light"} className="shrink" />

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-[14px] font-semibold transition-colors duration-300 ${
                  scrolled
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={`rounded-full font-bold px-3 sm:px-4 text-xs sm:text-sm transition-all ${
                scrolled
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                  : "text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
              }`}
            >
              {language === "en" ? "العربية" : "EN"}
            </Button>
            <Button
              size="sm"
              className="rounded-full px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white shadow-glow border-0 transition-all"
              onClick={() => scrollTo("partner")}
            >
              {isRtl ? "وصول مبكر مجاني" : "Free Early Access"}
            </Button>
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "text-slate-700" : "text-white"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className={`absolute top-0 ${isRtl ? "left-0" : "right-0"} h-full w-72 bg-[#0a0a0a] border-${isRtl ? "r" : "l"} border-white/10 flex flex-col pt-24 px-6 gap-2`}>
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-white/80 hover:text-white text-lg font-semibold py-3 text-start border-b border-white/5 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-6">
              <Button
                className="w-full rounded-full font-bold bg-blue-600 hover:bg-blue-500 text-white h-12"
                onClick={() => scrollTo("partner")}
              >
                {isRtl ? "وصول مبكر مجاني" : "Free Early Access"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
