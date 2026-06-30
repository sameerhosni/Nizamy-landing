import { useLanguage } from "@/lib/i18n";

export function WhoWeServe() {
  const { language } = useLanguage();

  const content = {
    en: {
      tags: [
        "Saudi Micro & Small SMEs",
        "5–300 employees",
        "Retail",
        "Hospitality",
        "Services",
        "Where the owner is still the buyer"
      ]
    },
    ar: {
      tags: [
        "المنشآت السعودية متناهية الصغر والصغيرة",
        "٥-٣٠٠ موظف",
        "التجزئة",
        "الضيافة",
        "الخدمات",
        "حيث يكون المالك هو المشتري"
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-20 bg-background overflow-hidden relative border-y border-border/50">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-background to-primary/5 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 max-w-5xl mx-auto">
          {t.tags.map((tag, idx) => (
            <div key={idx} className="bg-white border border-border/60 rounded-full px-6 py-3 text-base md:text-lg font-medium text-foreground shadow-sm">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
