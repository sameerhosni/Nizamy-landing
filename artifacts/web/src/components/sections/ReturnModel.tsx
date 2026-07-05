import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Gift, Sparkles } from "lucide-react";

const layerIcons = [TrendingUp, Gift, Sparkles];

export function ReturnModel() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      titlePart1: "Perform well. ",
      titlePart2: "Get up to 30% back",
      titlePart3: ", every year.",
      subhead: "No gimmicks, no flat cashback. The better your team performs and the more efficiently you use Mr-Hr, the more comes back — here's exactly where every riyal comes from.",
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
          title: "Motivation & Rewards System",
          desc: "Employees earn through engagement; you redeem the value back into the system."
        }
      ]
    },
    ar: {
      titlePart1: "الأداء الجيد يعيد إليك حتى ",
      titlePart2: "30%",
      titlePart3: " كل عام.",
      subhead: "بدون حيل أو استرداد ثابت. كلما تحسّن أداء فريقك واستخدمت مستر إتش آر بكفاءة أكبر، زاد ما يعود إليك — إليك بالضبط من أين يأتي كل ريال.",
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
          title: "نظام التحفيز والمكافئات",
          desc: "يكتسب الموظفون النقاط من خلال التفاعل؛ وتسترد أنت القيمة في النظام."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-[#0A0B14]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl text-center mb-6 max-w-4xl mx-auto leading-tight">
          <span className="text-white">{t.titlePart1}</span>
          <span className="text-gradient-primary">{t.titlePart2}</span>
          <span className="text-white">{t.titlePart3}</span>
        </h2>
        <p className="text-lg md:text-xl text-white/60 text-center mb-20 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-white/15 z-0" />

          {t.layers.map((layer, idx) => {
            const Icon = layerIcons[idx];
            return (
              <div key={idx} className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-white/8 border border-white/20 flex flex-col items-center justify-center gap-0.5 mb-8 shrink-0 relative shadow-lg backdrop-blur-sm">
                    <div className="absolute -top-3 -right-3 text-sm font-bold text-primary bg-primary/20 px-3 py-1 rounded-full border border-primary/40">
                      {layer.num}
                    </div>
                    <Icon size={18} className="text-primary" />
                    <span className="text-2xl font-bold text-white">{layer.pct}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-white">{layer.title}</h3>
                  <p className="text-white/60 leading-relaxed">
                    {layer.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
