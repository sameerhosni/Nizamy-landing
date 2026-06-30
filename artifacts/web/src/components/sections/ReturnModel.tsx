import { useLanguage } from "@/lib/i18n";

export function ReturnModel() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      titlePart1: "Three layers. ",
      titlePart2: "Up to 30% returned",
      titlePart3: ", every year.",
      subhead: "No gimmicks, no cashback tricks. Here is exactly where every riyal comes back from — and why it compounds the longer you stay.",
      layers: [
        {
          num: "01",
          pct: "15%",
          title: "Performance converted to money",
          desc: "Less lateness, less turnover, more focus → hours saved → riyals saved."
        },
        {
          num: "02",
          pct: "10%",
          title: "Top-achiever rewards",
          desc: "Mr-Hr funds rewards for your best people at no extra cost to you."
        },
        {
          num: "03",
          pct: "5%",
          title: "Points & redemption loop",
          desc: "Employees earn through engagement; you redeem the value back into the system."
        }
      ]
    },
    ar: {
      titlePart1: "ثلاث طبقات. ",
      titlePart2: "حتى ٣٠٪ عائد",
      titlePart3: "، كل عام.",
      subhead: "بدون حيل أو خدع استرداد. إليك بالضبط من أين يعود كل ريال — ولماذا يتضاعف كلما طالت مدة بقائك.",
      layers: [
        {
          num: "٠١",
          pct: "١٥٪",
          title: "تحويل الأداء إلى أموال",
          desc: "تأخير أقل، تسرب وظيفي أقل، تركيز أكبر ← ساعات موفرة ← ريالات موفرة."
        },
        {
          num: "٠٢",
          pct: "١٠٪",
          title: "مكافآت المتميزين",
          desc: "مستر إتش آر يمول مكافآت لأفضل موظفيك دون أي تكلفة إضافية عليك."
        },
        {
          num: "٠٣",
          pct: "٥٪",
          title: "دورة النقاط والاسترداد",
          desc: "يكتسب الموظفون النقاط من خلال التفاعل؛ وتسترد أنت القيمة في النظام."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl text-center mb-6 max-w-4xl mx-auto leading-tight">
          <span className="text-foreground">{t.titlePart1}</span>
          <span className="text-gradient-primary">{t.titlePart2}</span>
          <span className="text-foreground">{t.titlePart3}</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-20 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-border/50 z-0" />

          {t.layers.map((layer, idx) => (
            <div key={idx} className="relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border border-border flex items-center justify-center mb-8 shrink-0 relative shadow-sm">
                  <div className="absolute -top-3 -right-3 text-sm font-bold text-primary bg-accent px-3 py-1 rounded-full border border-primary/20">
                    {layer.num}
                  </div>
                  <span className="text-3xl font-bold text-foreground">{layer.pct}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-4">{layer.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {layer.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
