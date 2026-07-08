import { useLanguage } from "@/lib/i18n";
import { Check, X } from "lucide-react";

export function Problem() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      headingPart1: "Other systems drain your money. ",
      headingPart2: "Mr-Hr saves it for you.",
      subhead: "Same monthly fee. Completely different math. One drains your budget every month — the other puts money back in it.",
      legacy: {
        tag: "The old way",
        title: "Pure cost",
        points: ["Pure software cost", "Penalties and deductions", "Chasing employees to use it", "Time wasted on admin"]
      },
      mrhr: {
        tag: "The Mr-Hr way",
        title: "A source of return",
        points: ["Return that grows with your team's performance", "Rewards and motivation", "Employees engage automatically", "Time saved is money earned"]
      }
    },
    ar: {
      headingPart1: "الأنظمة الأخرى تستنزف أموالك. ",
      headingPart2: "مستر إتش آر يوفّرها لك.",
      subhead: "نفس الرسوم الشهرية. حسبة مختلفة تماماً. أحدهما يستنزف ميزانيتك كل شهر — والآخر يعيد المال إليها.",
      legacy: {
        tag: "الطريقة القديمة",
        title: "تكلفة بحتة",
        points: ["تكلفة برمجيات بحتة تُدفع ولا تعود", "غرامات وخصومات على الموظفين", "ملاحقة الموظفين لاستخدام النظام", "إهدار وقت الإدارة في المتابعة اليدوية"]
      },
      mrhr: {
        tag: "طريقة مستر إتش آر",
        title: "مصدر عائد",
        points: ["عائد يكبر مع أداء فريقك", "مكافآت وتحفيز بدل العقوبات", "تفاعل تلقائي من الموظفين", "الوقت الموفّر هو مال مكتسب"]
      }
    }
  };

  const t = content[language];

  return (
    <section id="problem" className="py-24 bg-background relative overflow-hidden scroll-mt-16">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl text-center mb-6 max-w-3xl mx-auto leading-tight">
          <span className="text-foreground">{t.headingPart1}</span>
          <span className="text-gradient-primary">{t.headingPart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-6 items-center">

            {/* Mr-Hr Card — elevated, bordered, badge tab overlapping top edge */}
            <div className="relative rounded-3xl bg-white border border-primary/30 p-8 md:p-10 pt-10 md:pt-10" style={{ boxShadow: "0 30px 60px -20px rgba(109, 74, 255, 0.25), 0 10px 30px -10px rgba(255, 77, 141, 0.15)" }}>
              <span
                className="absolute -top-3.5 start-8 inline-block text-xs font-semibold text-white rounded-full px-3.5 py-1.5 shadow-md"
                style={{ background: "linear-gradient(90deg,#FF4D8D,#FFA23A)" }}
              >
                {t.mrhr.tag}
              </span>
              <h3 className="text-2xl md:text-[28px] font-heading font-extrabold mb-8 text-gradient-primary">{t.mrhr.title}</h3>
              <ul className="space-y-6">
                {t.mrhr.points.map((point, idx) => {
                  const iconEl = (
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Check size={16} className="text-emerald-500" strokeWidth={2.5} />
                    </div>
                  );
                  const textEl = <span className="text-foreground text-base md:text-lg font-medium">{point}</span>;
                  return (
                    <li key={idx} className="flex items-center gap-3">
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
            <div className="px-2 md:px-6 py-6">
              <span className="inline-block text-xs font-semibold text-muted-foreground bg-muted rounded-full px-3.5 py-1.5 mb-5">
                {t.legacy.tag}
              </span>
              <h3 className="text-2xl md:text-[28px] font-heading font-extrabold mb-8 text-foreground">{t.legacy.title}</h3>
              <ul className="space-y-6">
                {t.legacy.points.map((point, idx) => {
                  const iconEl = (
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <X size={16} className="text-muted-foreground" strokeWidth={2.5} />
                    </div>
                  );
                  const textEl = <span className="text-muted-foreground text-base md:text-lg">{point}</span>;
                  return (
                    <li key={idx} className="flex items-center gap-3">
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
