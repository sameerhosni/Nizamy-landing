import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { language, toggleLanguage, dir } = useLanguage();

  const isRtl = dir === "rtl";

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-2xl tracking-tight text-foreground">
          {isRtl ? "مستر إتش آر" : "Mr-Hr"}
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={toggleLanguage} className="rounded-full font-medium">
            {language === "en" ? "العربية" : "EN"}
          </Button>
          <Button size="sm" className="rounded-full shadow-glow" onClick={() => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })}>
            {isRtl ? "شريك تصميم" : "Design Partner"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
