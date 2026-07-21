import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = {
  en: [
    { id: "features", label: "The System" },
    { id: "why-nizamy", label: "Why Nizamy" },
    { id: "return-model", label: "Return Model" },
    { id: "calculator", label: "Calculator" },
  ],
  ar: [
    { id: "features", label: "النظام" },
    { id: "why-nizamy", label: "لماذا نظامي" },
    { id: "return-model", label: "نموذج العائد" },
    { id: "calculator", label: "الحاسبة" },
  ],
};

export function Navbar() {
  const { language, toggleLanguage, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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
        className={`fixed top-0 w-full z-50 transition-all duration-400 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] py-3"
            : "bg-white py-5 border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo variant="dark" className="h-8 w-auto" />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-[15px] font-bold text-slate-600 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex rounded-full font-bold px-5 text-[15px] text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-300"
            >
              {language === "en" ? "العربية" : "EN"}
            </Button>
            <Button
              size="sm"
              className="rounded-full px-7 text-[15px] font-bold whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_10px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_15px_rgba(37,99,235,0.3)] transition-all h-11"
              onClick={() => scrollTo("partner")}
            >
              {isRtl ? "احصل على العرض المبكر" : "Get Early Access"}
              <span className="ms-2 rounded-full bg-amber-400 text-slate-900 text-[11px] font-black px-2.5 py-1 leading-none whitespace-nowrap">
                {isRtl ? "3 أشهر مجانًا" : "3 months free"}
              </span>
            </Button>
            <button
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden pt-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute top-0 ${isRtl ? "left-0" : "right-0"} bottom-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col pt-24 px-8 gap-4 ${isRtl ? "border-r" : "border-l"} border-slate-100`}
            >
              {links.map((link, idx) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-slate-700 hover:text-blue-600 text-xl font-heading font-black py-4 text-start border-b border-slate-100 transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col gap-4"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-2xl font-bold h-14 text-lg border-slate-200"
                  onClick={() => { toggleLanguage(); setMobileOpen(false); }}
                >
                  {language === "en" ? "العربية" : "EN"}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
