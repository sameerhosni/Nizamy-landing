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
        title: "What exists today",
        tag: "The old way",
        points: ["Pure software cost", "Penalties and deductions", "Chasing employees to use it", "Time wasted on admin"]
      },
      mrhr: {
        title: "What Mr-Hr is",
        tag: "The Mr-Hr way",
        points: ["Return that grows with performance", "Rewards and motivation", "Employees engage willingly", "Time saved is money earned"]
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
      {/* Decorative background glows */}
      <div className="absolute top-0 start-0 w-[40%] h-[60%] bg-muted-foreground/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-[45%] h-[65%] bg-primary/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl text-center mb-6 max-w-3xl mx-auto leading-tight">
          <span className="text-foreground">{t.headingPart1}</span>
          <span className="text-gradient-primary">{t.headingPart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-4 items-stretch">

            {/* Legacy HR Card — muted, desaturated */}
            <div className="relative rounded-3xl bg-muted/40 border border-border/60 p-8 md:p-10 grayscale-[0.3] opacity-90">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 bg-muted-foreground/10 rounded-full px-3 py-1 mb-6">
                {t.legacy.tag}
              </span>
              <h3 className="text-2xl font-bold mb-8 text-muted-foreground">{t.legacy.title}</h3>
              <ul className="space-y-5">
                {t.legacy.points.map((point, idx) => {
                  const Icon = legacyIcons[idx];
                  return (
                    <li key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted-foreground/10 border border-muted-foreground/15 flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-muted-foreground/60" />
                      </div>
                      <span className="text-muted-foreground text-base md:text-lg">{point}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Center transform badge (desktop only) */}
            <div className="hidden md:flex absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/30 shadow-glow flex items-center justify-center">
                <ArrowIcon size={22} className="text-primary" />
              </div>
            </div>

            {/* Mr-Hr Card — vibrant, glowing */}
            <div className="relative rounded-3xl bg-white border border-primary/25 shadow-glow p-8 md:p-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/[0.06] via-pink-500/[0.06] to-indigo-500/[0.08] pointer-events-none" />
              <div className="absolute -top-16 -end-16 w-40 h-40 bg-primary/15 blur-[70px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-white bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 rounded-full px-3 py-1 mb-6 shadow-glow">
                  {t.mrhr.tag}
                </span>
                <h3 className="text-2xl font-bold mb-8 text-gradient-primary">{t.mrhr.title}</h3>
                <ul className="space-y-5">
                  {t.mrhr.points.map((point, idx) => {
                    const Icon = mrhrIcons[idx];
                    return (
                      <li key={idx} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-primary" />
                        </div>
                        <span className="text-foreground text-base md:text-lg font-medium">{point}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
