import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Gift, Sparkles } from "lucide-react";

const layerIcons = [TrendingUp, Gift, Sparkles];

export function ReturnModel() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "Return Model",
      titlePart1: "Perform well. ",
      titlePart2: "Get up to 30% back",
      titlePart3: ", every year.",
      subhead: "No gimmicks, no flat cashback. The better your team performs and the more efficiently you use Nizamy, the more comes back — here's exactly where every riyal comes from.",
      clarifier: "What does the 30% mean? A combination of system credit, funded rewards value for your team, and the value of time saved through better employee performance.",
      layers: [
        {
          num: "01",
          title: "Activate your team",
          desc: "Less lateness, less turnover, more focus → hours saved → riyals saved."
        },
        {
          num: "02",
          title: "Reward performance",
          desc: "Nizamy funds rewards for your best people at no extra cost to you."
        },
        {
          num: "03",
          title: "Recover your value",
          desc: "Employees earn through engagement; you redeem the value back into the system."
        }
      ]
    },
    ar: {
      eyebrow: "نموذج العائد",
      titlePart1: "الأداء الجيد يعيد إليك حتى ",
      titlePart2: "30%",
      titlePart3: " كل عام.",
      subhead: "بدون حيل أو استرداد ثابت. كلما تحسّن أداء فريقك واستخدمت نظامي بكفاءة أكبر، زاد ما يعود إليك — إليك بالضبط من أين يأتي كل ريال.",
      clarifier: "وش يعني عائد ٪30؟ مزيج من رصيد في النظام، وقيمة مكافآت ممولة لفريقك، وقيمة الوقت المتوفر من تحسّن أداء الموظفين.",
      layers: [
        {
          num: "٠١",
          title: "فعّل فريقك",
          desc: "تأخير أقل، تسرب وظيفي أقل، تركيز أكبر ← ساعات موفرة ← ريالات موفرة."
        },
        {
          num: "٠٢",
          title: "كافئ الأداء",
          desc: "نظامي يمول مكافآت لأفضل موظفيك دون أي تكلفة إضافية عليك."
        },
        {
          num: "٠٣",
          title: "استرد قيمتك",
          desc: "يكتسب الموظفون النقاط من خلال التفاعل؛ وتسترد أنت القيمة في النظام."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="return-model" className="py-24 bg-blue-900 scroll-mt-16 overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/40 via-blue-900/0 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold rounded-full px-4 py-1.5 bg-blue-800 text-blue-200 border border-blue-700 shadow-sm">
            {t.eyebrow}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-black text-center mb-6 max-w-4xl mx-auto leading-tight">
          <span className="text-white">{t.titlePart1}</span>
          <span className="text-blue-300">{t.titlePart2}</span>
          <span className="text-white">{t.titlePart3}</span>
        </h2>
        <p className="text-lg md:text-xl text-blue-100/80 text-center mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.subhead}
        </p>
        <div className="max-w-2xl mx-auto mb-20">
          <p className="text-sm md:text-base text-blue-100 text-center leading-relaxed font-medium rounded-2xl bg-blue-800/60 border border-blue-700 px-6 py-4">
            {t.clarifier}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-blue-800 z-0" />

          {t.layers.map((layer, idx) => {
            const Icon = layerIcons[idx];
            return (
              <div key={idx} className="relative z-10 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-800 border-4 border-blue-900 flex flex-col items-center justify-center gap-0.5 mb-8 shrink-0 relative shadow-xl transition-transform group-hover:scale-110 duration-300">
                    <div className="absolute -top-2 -right-2 text-xs font-black px-2.5 py-1 rounded-full bg-blue-500 text-white shadow-md border border-blue-400">
                      {layer.num}
                    </div>
                    <Icon size={32} className="text-blue-200" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white font-heading">{layer.title}</h3>
                  <p className="text-blue-100/70 leading-relaxed font-medium">
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
