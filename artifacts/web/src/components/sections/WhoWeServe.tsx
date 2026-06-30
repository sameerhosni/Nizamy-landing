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
    <section className="py-20 bg-primary text-primary-foreground overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 max-w-5xl mx-auto text-lg md:text-2xl font-serif text-center">
          {t.tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <span>{tag}</span>
              {idx < t.tags.length - 1 && <span className="text-primary-foreground/30">·</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
