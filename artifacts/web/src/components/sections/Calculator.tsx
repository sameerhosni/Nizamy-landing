import { useLanguage } from "@/lib/i18n";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { Check, HeartHandshake, TrendingUp, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics";

const layerIcons = [TrendingUp, Gift, Sparkles];

interface CalculatorProps {
  employees: number;
  setEmployees: (val: number) => void;
  tier: "Standard" | "Growth" | "Pro";
  setTier: (val: "Standard" | "Growth" | "Pro") => void;
  tierPrice: number;
  subscription: number;
  totalReturn: number;
  layer1: number;
  layer2: number;
  layer3: number;
  effectiveCost: number;
}

export function Calculator({
  employees, setEmployees, tier, setTier, tierPrice, subscription, totalReturn, layer1, layer2, layer3, effectiveCost
}: CalculatorProps) {
  const { language, dir } = useLanguage();

  const featureContent = {
    en: {
      includedLabel: "Start today — no setup, no complicated steps",
      plusFromStandard: "Everything in Standard, plus:",
      plusFromGrowth: "Everything in Growth, plus:",
      basic: [
        "Instant fingerprint check-in (finger or face) — no training needed",
        "Self-service tools your team can use from day one",
        "Discount codes that drive commitment and boost attendance",
        "Clear, regular reports",
      ],
      growthAdd: [
        "An AI assistant that answers HR requests instantly",
        "Smart gift cards and rewards that automatically motivate top performers",
        "6 months of history — securely stored in the database",
        "Face check-in with liveness detection — fully fraud-proof",
        "One-click payroll reports",
        "Priority support through the ticketing system",
        "AI assistant for task management (limited use)",
      ],
      proAdd: [
        "Deep AI reports — surfacing what spreadsheets can't show you",
        "Smart alerts based on each employee's performance",
        "A full year of history — a whole year of data at your fingertips",
        "Voice check-in designed for women, preserving privacy",
        "Works offline — no downtime even in disconnected areas",
        "Wider discounts, e-gift cards, and more varied rewards for your team",
        "Priority access to new features",
        "Unlimited AI task management — it works on your behalf",
      ],
    },
    ar: {
      includedLabel: "ابدأ اليوم — بدون إعدادات أو خطوات معقدة",
      plusFromStandard: "يشمل كل مزايا الباقة الأساسية",
      plusFromGrowth: "يشمل كل مزايا باقة النمو",
      basic: [
        "تسجيل حضور فوري بالبصمة (إصبع / وجه) — لا تدريب مطلوب",
        "خدمة ذاتية يستخدمها فريقك من اليوم الأول",
        "أكواد خصم تُحرّك الالتزام وترفع معدل الحضور",
        "تقارير دورية واضحة",
      ],
      growthAdd: [
        "مساعد ذكاء اصطناعي يُجيب على طلبات الموارد البشرية في الحال",
        "بطاقات هدايا ومكافآت ذكية تُحفّز أصحاب الأداء العالي تلقائياً",
        "٦ أشهر من السجلات — بيانات محفوظة في قاعدة البيانات",
        "تسجيل بالوجه مع كشف الحيوية — حماية كاملة من الغش",
        "تقارير رواتب بنقرة واحدة",
        "أولوية الدعم الفني عبر نظام التذاكر",
        "مساعد ذكاء اصطناعي لإدارة المهام (استخدام محدود)",
      ],
      proAdd: [
        "تقارير ذكاء اصطناعي عميقة — تكشف ما لا تراه في الجداول",
        "إشعارات ذكية حسب أداء كل موظف",
        "سنة كاملة من السجلات — بيانات عام كامل في متناول يدك",
        "تسجيل حضور بالصوت يناسب النساء ويحفظ الخصوصية",
        "يعمل بدون إنترنت — لا توقف حتى في المناطق المنقطعة",
        "خصومات وبطاقات هدايا إلكترونية ومكافآت موسّعة وأكثر تنوعاً لفريقك",
        "أولوية في الوصول للميزات الجديدة",
        "إدارة مهام بالذكاء الاصطناعي بلا حدود — يعمل نيابةً عنك",
      ],
    },
  };

  const ft = featureContent[language];
  const tierFeatures: Record<"Standard" | "Growth" | "Pro", string[]> = {
    Standard: ft.basic,
    Growth: ft.growthAdd,
    Pro: ft.proAdd,
  };
  const tierFeaturesLabel: Record<"Standard" | "Growth" | "Pro", string> = {
    Standard: ft.includedLabel,
    Growth: ft.plusFromStandard,
    Pro: ft.plusFromGrowth,
  };

  const content = {
    en: {
      titlePart1: "Estimate Your ",
      titlePart2: "Return",
      subhead: "Move the slider to see a sample estimate — actual results vary based on your team's performance.",
      sampleBadge: "Sample estimate — not actual data",
      empLabel: "Number of employees",
      tierLabel: "Select Tier",
      tiers: { Standard: "Standard", Growth: "Growth", Pro: "Pro" },
      results: {
        annualReturn: "Estimated Annual Return",
        sampleNote: "Illustrative only — actual return depends on usage & performance",
        subscription: "Annual Subscription",
        effective: "Effective Annual Cost",
        performance: "Performance",
        rewards: "Rewards",
        points: "Points",
      },
      disclaimer: "These numbers are for illustration purposes only. Your actual return will vary depending on your team size, performance levels, and how effectively you use Nizamy HR.",
    },
    ar: {
      titlePart1: "قدّر ",
      titlePart2: "عائدك",
      subhead: "حرّك المؤشر لترى تقديراً توضيحياً — النتائج الفعلية تتفاوت حسب أداء فريقك.",
      sampleBadge: "أرقام توضيحية — ليست بيانات حقيقية",
      empLabel: "عدد الموظفين",
      tierLabel: "اختر الباقة",
      tiers: { Standard: "أساسي", Growth: "نمو", Pro: "احترافي" },
      results: {
        annualReturn: "العائد السنوي التقديري",
        sampleNote: "توضيحي فقط — العائد الفعلي يعتمد على الاستخدام والأداء",
        subscription: "الاشتراك السنوي",
        effective: "التكلفة السنوية الفعلية",
        performance: "الأداء",
        rewards: "المكافآت",
        points: "النقاط",
      },
      disclaimer: "هذه الأرقام توضيحية فقط. عائدك الفعلي يتفاوت حسب حجم فريقك ومستويات الأداء ومدى فاعلية استخدامك لنظامي اتش آر.",
    },
  };

  const closingContent = {
    en: {
      quote: "We only do well when you do.",
      footnote: "No fine print. Your team's growth genuinely benefits us too — that's the whole idea.",
    },
    ar: {
      quote: "لا نستفيد إلا حين تستفيد أنت.",
      footnote: "بدون شروط خفية. نمو فريقك يفيدنا نحن أيضاً بشكل حقيقي — هذه هي الفكرة كلها.",
    },
  };
  const ct = closingContent[language];
  const t = content[language];

  return (
    <section id="calculator" className="py-24 sm:py-32 bg-[#FAFAFA] scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 text-[13px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-5 py-2 mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {t.sampleBadge}
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] mb-6 tracking-tight">
            <span className="text-slate-900">{t.titlePart1}</span>
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">{t.subhead}</p>
        </motion.div>

        {/* Employee slider — full width, always above the results panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto mb-8 lg:mb-10"
        >
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <label className="text-[17px] font-bold text-slate-800">{t.empLabel}</label>
              <span className="text-3xl sm:text-4xl font-heading font-black text-blue-600 tabular-nums bg-blue-50 px-4 py-2 rounded-xl">{employees}</span>
            </div>
            <Slider
              value={[employees]}
              onValueChange={(vals) => setEmployees(vals[0])}
              onValueCommit={(vals) =>
                track("calculator_used", { employees: vals[0], tier, language })
              }
              min={5}
              max={500}
              step={1}
              dir={dir}
              className="py-2"
            />
            <div className="flex justify-between text-sm text-slate-400 font-bold mt-4">
              <span>5</span>
              <span>500</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
          {/* Packages — separate section, below results on mobile */}
          <motion.div 
            initial={{ opacity: 0, x: dir === 'rtl' ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 order-2 lg:order-1"
          >
            {/* Tier selector */}
            <div className="bg-white rounded-[24px] border border-slate-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <label className="text-[17px] font-bold block text-slate-800 mb-6">{t.tierLabel}</label>
              <div className="grid grid-cols-3 gap-4">
                {(["Standard", "Growth", "Pro"] as const).map((tOption) => (
                  <button
                    key={tOption}
                    onClick={() => {
                      setTier(tOption);
                      track("calculator_tier_selected", { tier: tOption, employees, language });
                    }}
                    className={`py-5 px-2 border-2 rounded-[16px] text-center transition-all duration-300 ${
                      tier === tOption
                        ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm"
                        : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <div className="font-heading font-black text-[17px] mb-1.5">{t.tiers[tOption]}</div>
                    <div className="text-[13px] font-bold opacity-80">SAR {tOption === "Standard" ? 3 : tOption === "Growth" ? 5 : 8}</div>
                    <div className="mt-2 inline-block rounded-full bg-amber-100 text-amber-800 text-[11px] font-black px-2.5 py-1 leading-none whitespace-nowrap">
                      {language === "ar" ? "وصول مبكر" : "Early access"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features list */}
            <div className="bg-white rounded-[24px] border border-slate-200/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="text-[15px] font-bold text-slate-900 mb-6 flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3">
                <Sparkles size={18} className="text-blue-500" />
                {tierFeaturesLabel[tier]}
              </div>
              <ul className="space-y-4">
                {tierFeatures[tier].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 rtl:flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-blue-600" strokeWidth={3} />
                    </div>
                    <span className="text-[15px] font-medium text-slate-600 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  track("package_cta_clicked", { tier, employees, language });
                  document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 w-full h-14 rounded-[16px] bg-blue-600 hover:bg-blue-700 text-white text-[16px] font-black flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all"
              >
                {language === "ar"
                  ? `اطلب باقة ${t.tiers[tier]} الآن`
                  : `Request the ${t.tiers[tier]} plan now`}
                <span className="rounded-full bg-amber-400 text-slate-900 text-[11px] font-black px-2.5 py-1 leading-none whitespace-nowrap">
                  {language === "ar" ? "3 أشهر مجانًا" : "3 months free"}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Results panel */}
          <motion.div 
            initial={{ opacity: 0, x: dir === 'rtl' ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 lg:sticky lg:top-28"
          >
            <div className="rounded-[32px] bg-[#0A1A3A] overflow-hidden shadow-[0_30px_60px_rgba(10,26,58,0.2)] border border-blue-900/50">
              <div className="p-8 sm:p-12 space-y-8 relative">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.4) 0%, transparent 70%)" }} />

                {/* Main return number */}
                <div className="relative text-center pb-10 border-b border-white/10">
                  <p className="text-blue-200 font-bold text-[15px] mb-4 uppercase tracking-wider">{t.results.annualReturn}</p>
                  <div className="text-5xl sm:text-[4.5rem] font-heading font-black text-white tracking-tight leading-none mb-6 drop-shadow-lg">
                    {formatCurrency(totalReturn, "SAR", language)}
                  </div>
                  <p className="text-[13px] font-bold text-slate-300 bg-white/10 inline-block px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">{t.results.sampleNote}</p>
                </div>

                {/* Subscription + effective cost */}
                <div className="relative space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                    <span className="text-slate-300 font-bold text-[15px]">{t.results.subscription}</span>
                    <span className="font-heading text-xl font-black text-slate-200 tabular-nums">{formatCurrency(subscription, "SAR", language)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-600 p-5 rounded-2xl border border-blue-500 shadow-inner">
                    <span className="text-blue-50 font-bold text-[15px]">{t.results.effective}</span>
                    <span className="font-heading text-2xl font-black text-white tabular-nums drop-shadow-md">{formatCurrency(effectiveCost, "SAR", language)}</span>
                  </div>
                </div>

                {/* Return breakdown */}
                <div className="relative pt-6 space-y-6">
                  {([
                    { label: t.results.performance, value: layer1, pct: 50, Icon: layerIcons[0] },
                    { label: t.results.rewards, value: layer2, pct: 33, Icon: layerIcons[1] },
                    { label: t.results.points, value: layer3, pct: 17, Icon: layerIcons[2] },
                  ]).map((row, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between items-center text-[13px] font-bold text-slate-300 uppercase tracking-wide">
                        <span className="flex items-center gap-2">
                          <row.Icon size={16} className="text-blue-400" />
                          {row.label}
                        </span>
                        <span className="text-white">{formatCurrency(row.value, "SAR", language)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-out"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="relative pt-6 border-t border-white/10">
                  <p className="text-[13px] text-slate-400 font-medium leading-relaxed">{t.disclaimer}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Closing quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mt-32 pt-16 border-t border-slate-200"
        >
          <div className="w-16 h-16 rounded-[1.25rem] bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-8 shadow-sm">
            <HeartHandshake size={32} />
          </div>
          <p className="text-3xl sm:text-4xl font-heading font-black leading-snug text-slate-900 mb-4">{ct.quote}</p>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">{ct.footnote}</p>
        </motion.div>
      </div>
    </section>
  );
}
