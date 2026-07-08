import { useLanguage } from "@/lib/i18n";
import {
  Ban,
  AlertOctagon,
  UserX,
  Clock3,
  TrendingUp,
  Gift,
  Heart,
  Coins,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const legacyIcons = [Ban, AlertOctagon, UserX, Clock3];
const mrhrIcons = [TrendingUp, Gift, Heart, Coins];

export function Problem() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const content = {
    en: {
      headingPart1: "Every other HR system bills you. ",
      headingPart2: "Yours should pay you back.",
      subhead: "Same monthly fee. Completely different math. One drains your budget every month — the other puts money back in it.",
      legacy: {
        title: "The current state",
        tag: "The old way",
        points: ["Pure software cost", "Penalties and deductions", "Chasing employees to use it", "Time wasted on admin"]
      },
      mrhr: {
        title: "What Mr-Hr is",
        tag: "The Mr-Hr way",
        points: ["Return that grows with your team's performance", "Rewards and motivation", "Employees engage automatically", "Time saved is money earned"]
      }
    },
    ar: {
      headingPart1: "الأنظمة الأخرى تستنزف أموالك باشتراكات. ",
      headingPart2: "مستر أتش ار يوفر لك.",
      subhead: "نفس الرسوم الشهرية. حسبة مختلفة تماماً. أحدهما يستنزف ميزانيتك كل شهر — والآخر يعيد المال إليها.",
      legacy: {
        title: "الوضع الحالي",
        tag: "الطريقة القديمة",
        points: ["تكلفة برمجيات بحتة", "غرامات وخصومات", "ملاحقة الموظفين لاستخدامه", "إهدار الوقت في الإدارة"]
      },
      mrhr: {
        title: "ما هو مستر إتش آر",
        tag: "طريقة مستر إتش آر",
        points: ["عائد يكبر مع أداء فريقك", "مكافآت وتحفيز", "تفاعل تلقائي من الموظفين", "الوقت الموفر هو مال مكتسب"]
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

            {/* Legacy — no card, blends into the page */}
            <div className="px-2 md:px-6 py-6">
              <span className="inline-block text-xs font-semibold text-muted-foreground bg-muted rounded-full px-3.5 py-1.5 mb-5">
                {t.legacy.tag}
              </span>
              <h3 className="text-2xl md:text-[28px] font-bold mb-8 text-foreground">{t.legacy.title}</h3>
              <ul className="space-y-6">
                {t.legacy.points.map((point, idx) => {
                  const Icon = legacyIcons[idx];
                  const iconEl = (
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-muted-foreground" />
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

            {/* Center transform badge (desktop only) */}
            <div className="hidden md:flex absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white border border-border shadow-lg flex items-center justify-center">
                <ArrowIcon size={20} className="text-primary" />
              </div>
            </div>

            {/* Mr-Hr Card — elevated, glowing */}
            <div className="relative rounded-3xl bg-white p-8 md:p-10" style={{ boxShadow: "0 30px 60px -20px rgba(91, 92, 255, 0.25), 0 10px 30px -10px rgba(236, 72, 153, 0.15)" }}>
              <span className="inline-block text-xs font-semibold text-white bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 rounded-full px-3.5 py-1.5 mb-5">
                {t.mrhr.tag}
              </span>
              <h3 className="text-2xl md:text-[28px] font-bold mb-8 text-gradient-primary">{t.mrhr.title}</h3>
              <ul className="space-y-6">
                {t.mrhr.points.map((point, idx) => {
                  const Icon = mrhrIcons[idx];
                  const iconEl = (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-primary" />
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

          </div>
        </div>
      </div>
    </section>
  );
}
