import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-background py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-2xl tracking-tight text-foreground">
            {language === "en" ? "Mr-Hr" : "مستر إتش آر"}
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span>Built in Riyadh · صُنع في الرياض</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
