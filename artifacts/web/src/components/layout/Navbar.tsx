import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const SERVICES = {
  en: [
    { href: "/services/attendance-performance", label: "Attendance service" },
    { href: "/services/ai-hr", label: "AI in HR" },
    { href: "/services/employee-rewards", label: "Employee rewards" },
    { href: "/services/payroll-inputs", label: "Payroll inputs" },
  ],
  ar: [
    { href: "/services/attendance-performance", label: "الحضور والانصراف" },
    { href: "/services/ai-hr", label: "الخدمات الذاتية بالذكاء الاصطناعى" },
    { href: "/services/employee-rewards", label: "نقاط التحفيز والمكافئات" },
    { href: "/services/payroll-inputs", label: "الرواتب" },
  ],
};

const navLinks = {
  en: [
    { id: "features", label: "The System" },
    { id: "why-nizamy", label: "Why Nizamy" },
    { id: "features", label: "Services", children: SERVICES.en },
    { id: "pricing", label: "Pricing" },
    { id: "hr-blog", label: "HR blog", href: "/en/hr-blog" },
  ],
  ar: [
    { id: "features", label: "الرئيسية" },
    { id: "why-nizamy", label: "لماذا نظامي" },
    { id: "features", label: "خدماتنا", children: SERVICES.ar },
    { id: "pricing", label: "الأسعار" },
    { id: "hr-blog", label: "سالفة اتش آر", href: "/hr-blog" },
  ],
};

export function Navbar({ languageOverride, onLanguageToggle }: { languageOverride?: "ar" | "en"; onLanguageToggle?: () => void } = {}) {
  const { language: contextLanguage, toggleLanguage, dir: contextDir } = useLanguage();
  const language = languageOverride ?? contextLanguage;
  const dir = languageOverride ? (languageOverride === "ar" ? "rtl" : "ltr") : contextDir;
  const handleLanguageToggle = onLanguageToggle ?? toggleLanguage;
  const isRtl = dir === "rtl";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!servicesOpen) return;
    const outside = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        servicesRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [servicesOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (window.location.pathname.replace(/\/$/, "") !== base) {
      window.location.assign(`${base}/#${id}`);
      return;
    }
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
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1 lg:flex-none">
            <a href={`${base}/`} aria-label={language === "ar" ? "الرئيسية" : "Home"} className="min-w-0">
              <Logo variant="dark" className="h-8 w-auto" />
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {links.map((link) => (
              <div key={`${link.id}-${link.label}`} className="relative group"
                ref={link.children ? servicesRef : undefined}
                onBlur={link.children ? (event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setServicesOpen(false);
                } : undefined}>
                <button
                  type="button"
                  onClick={() => "href" in link && link.href ? window.location.assign(`${base}${link.href}`) : link.children ? setServicesOpen(open => !open) : scrollTo(link.id)}
                  className="inline-flex items-center gap-1 text-[15px] font-bold text-slate-600 hover:text-blue-600 transition-colors duration-300 relative"
                  aria-expanded={link.children ? servicesOpen : undefined}
                  aria-controls={link.children ? "services-dropdown" : undefined}
                >
                  {link.label}
                  {link.children && <ChevronDown aria-hidden size={15} className={servicesOpen ? "rotate-180" : ""} />}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </button>
                {link.children && servicesOpen && (
                  <div id="services-dropdown" className="absolute top-full start-0 pt-4 z-50">
                    <div className="w-80 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
                      {link.children.map((c) => (
                        <a key={c.href} href={`${base}${c.href}`} className="block rounded-lg px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600">{c.label}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="hidden sm:flex rounded-full font-bold px-5 text-[15px] text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-300"
            >
              {language === "en" ? "العربية" : "EN"}
            </Button>
            <Button
              size="sm"
              className="rounded-full px-3 sm:px-8 text-[14px] sm:text-[15px] font-black whitespace-nowrap bg-gradient-to-r from-amber-400 via-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-400 text-slate-900 shadow-[0_6px_18px_rgba(251,146,60,0.45)] hover:shadow-[0_8px_24px_rgba(251,146,60,0.6)] hover:scale-[1.04] active:scale-[0.98] transition-all h-10 sm:h-11"
              onClick={() => scrollTo("partner")}
            >
              <span className="flex flex-col items-center leading-tight py-1">
                <span>{isRtl ? "جرب مجانًا" : "Try for free"}</span>
                <span className="hidden sm:block text-[10px] font-semibold text-slate-800/80 whitespace-nowrap">
                  {isRtl ? "إلغاء الاشتراك في أي وقت بدون التزامات" : "Cancel anytime — no commitments"}
                </span>
              </span>
            </Button>
            <button
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
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
              className={`absolute top-0 ${isRtl ? "left-0" : "right-0"} bottom-0 w-[80%] max-w-sm overflow-y-auto bg-white shadow-2xl flex flex-col pt-24 pb-8 px-8 gap-4 ${isRtl ? "border-r" : "border-l"} border-slate-100`}
            >
              {links.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  key={`${link.id}-${link.label}`}
                  className="border-b border-slate-100"
                >
                  <button onClick={() => "href" in link && link.href ? window.location.assign(`${base}${link.href}`) : scrollTo(link.id)} className="w-full text-slate-700 hover:text-blue-600 text-xl font-heading font-black py-4 text-start transition-colors">
                    {link.label}
                  </button>
                  {link.children && (
                    <div className="mb-3 flex flex-col gap-2">
                      {link.children.map((c) => (
                        <a key={c.href} href={`${base}${c.href}`} className="block ps-4 text-base font-bold text-slate-600 hover:text-blue-600">{c.label}</a>
                      ))}
                    </div>
                  )}
                </motion.div>
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
                  onClick={() => { handleLanguageToggle(); setMobileOpen(false); }}
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
