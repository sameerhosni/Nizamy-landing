import { useLanguage } from "@/lib/i18n";
import { Check, X } from "lucide-react";

export function Problem() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      headingPart1: "Other systems drain your money. ",
      headingPart2: "Nizamy\u00A0HR saves it for you.",
      subhead: "Same monthly fee. Completely different math. One drains your budget every month — the other puts money back in it.",
      legacy: {
        tag: "The old way",
        title: "Pure cost",
        points: ["Pure software cost", "Penalties and deductions", "Chasing employees to use it", "Time wasted on admin"]
      },
      nizamy: {
        tag: "The Nizamy HR way",
        title: "A source of return",
        points: ["Return that grows with your team's performance", "Rewards and motivation", "Employees engage automatically", "Time saved is money earned"]
      }
    },
    ar: {
      headingPart1: "الأنظمة الأخرى تستنزف أموالك. ",
      headingPart2: "نظامي\u00A0اتش\u00A0آر يوفّرها لك.",
      subhead: "نفس الرسوم الشهرية. حسبة مختلفة تماماً. أحدهما يستنزف ميزانيتك كل شهر — والآخر يعيد المال إليها.",
      legacy: {
        tag: "الطريقة القديمة",
        title: "تكلفة بحتة",
        points: ["تكلفة برمجيات بحتة تُدفع ولا تعود", "غرامات وخصومات على الموظفين", "ملاحقة الموظفين لاستخدام النظام", "إهدار وقت الإدارة في المتابعة اليدوية"]
      },
      nizamy: {
        tag: "طريقة نظامي اتش آر",
        title: "مصدر عائد",
        points: ["عائد يكبر مع أداء فريقك", "مكافآت وتحفيز بدل العقوبات", "تفاعل تلقائي من الموظفين", "الوقت الموفّر هو مال مكتسب"]
      }
    }
  };

  const t = content[language];

  return (
    <section id="problem" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-16">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl text-center mb-6 max-w-3xl mx-auto leading-tight font-black font-heading">
          <span className="text-slate-900">{t.headingPart1}</span>
          <span className="text-blue-600">{t.headingPart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-500 text-center mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.subhead}
        </p>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-8 items-center">

            {/* Nizamy HR Card — elevated, bordered, badge tab overlapping top edge */}
            <div className="relative rounded-3xl bg-white border-2 border-blue-500 p-8 md:p-10 pt-10 md:pt-10 shadow-soft" style={{ boxShadow: "0 20px 40px -15px rgba(37, 99, 235, 0.15)" }}>
              <span
                className="absolute -top-4 start-8 inline-block text-sm font-bold text-white rounded-full px-4 py-1.5 shadow-md bg-blue-600"
              >
                {t.nizamy.tag}
              </span>
              <h3 className="text-2xl md:text-[28px] font-heading font-extrabold mb-8 text-blue-600">{t.nizamy.title}</h3>
              <ul className="space-y-6">
                {t.nizamy.points.map((point, idx) => {
                  const iconEl = (
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <Check size={16} className="text-blue-600" strokeWidth={3} />
                    </div>
                  );
                  const textEl = <span className="text-slate-800 text-base md:text-lg font-bold">{point}</span>;
                  return (
                    <li key={idx} className="flex items-center gap-3.5">
                      {isRtl ? (
                        <>
                          {textEl}
                          {iconEl}
                        </>
                      ) : (
                        <>
                          {iconEl}
                          {textEl}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Legacy — muted, borderless */}
            <div className="px-4 md:px-8 py-8 rounded-3xl bg-slate-100 border border-slate-200">
              <span className="inline-block text-sm font-bold text-slate-500 bg-slate-200/50 rounded-full px-4 py-1.5 mb-6">
                {t.legacy.tag}
              </span>
              <h3 className="text-2xl md:text-[28px] font-heading font-extrabold mb-8 text-slate-700">{t.legacy.title}</h3>
              <ul className="space-y-6">
                {t.legacy.points.map((point, idx) => {
                  const iconEl = (
                    <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center shrink-0">
                      <X size={16} className="text-slate-400" strokeWidth={3} />
                    </div>
                  );
                  const textEl = <span className="text-slate-500 font-medium text-base md:text-lg">{point}</span>;
                  return (
                    <li key={idx} className="flex items-center gap-3.5">
                      {isRtl ? (
                        <>
                          {textEl}
                          {iconEl}
                        </>
                      ) : (
                        <>
                          {iconEl}
                          {textEl}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
