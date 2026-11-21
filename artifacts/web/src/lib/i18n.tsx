import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const path = window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ""), "");
    if (path === "/faq/en") return "en";
    if (path === "/faq/ar") return "ar";
    if (path.startsWith("/en/")) return "en";
    if (path.startsWith("/hr-blog")) return "ar";
    // Keep the visitor's choice across page loads (menu links are full navigations).
    try {
      const saved = window.sessionStorage.getItem("nizamy-language");
      if (saved === "en" || saved === "ar") return saved;
    } catch { /* storage unavailable: fall back to Arabic */ }
    return "ar";
  });

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    try { window.sessionStorage.setItem("nizamy-language", language); } catch { /* ignore */ }
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
