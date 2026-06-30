import { useLanguage } from "@/lib/i18n";

export function WhoWeServe() {
  const { language } = useLanguage();

  const content = {
    en: {
      headingPart1: "Built for the Saudi ",
      headingPart2: "owner-operator.",
      subhead: "If you sign the invoices and feel every cost, Mr-Hr was designed for you.",
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
      headingPart1: "صُمم لصاحب العمل ",
      headingPart2: "السعودي.",
      subhead: "إذا كنت أنت من يوقّع الفواتير ويشعر بكل تكلفة، فقد صُمم مستر إتش آر لك.",
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
        <h2 className="text-4xl text-center mb-6 leading-tight">
          <span className="text-foreground">{t.headingPart1}</span>
          <span className="text-gradient-primary">{t.headingPart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>
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
