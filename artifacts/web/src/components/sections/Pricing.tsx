import type { ReactNode } from "react";
import { Check, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { SaudiRiyalSymbol } from "@/components/SaudiRiyalSymbol";
import { track } from "@/lib/analytics";
import { PublicTier, publicTierLabel, tierPrice, STARTER_ANNUAL_PER_USER, STARTER_MONTHLY_PER_USER, Tier } from "@/lib/plans";
import { freeFeatures, starterFeatures, growthFeatures } from "@/lib/pricingOffers";

interface PricingProps {
  employees: number;
  tier: Tier;
  setTier: (t: Tier) => void;
}

const content = {
  en: {
    kicker: "Pricing",
    title1: "Two plans.",
    title2: "Zero guesswork.",
    sub: "Start free. Move to Starter when you want every feature that is live today.",
    teamLabel: "Your team size",
    dec: "Decrease employees",
    inc: "Increase employees",
    free: { name: "Free", tag: "Essential features", price: "0", unit: "SAR", note: "No card required. Limited to the basic features.", included: "Included:", cta: "Start with Free" },
    starter: {
      name: "Starter",
      trial: "Free for 3 months",
      tag: "Everything available now",
      unit: "SAR / user / month",
      billed: `Billed annually — ${STARTER_ANNUAL_PER_USER} SAR per user per year`,
      totalFor: (n: number) => `Annual total for ${n.toLocaleString("en")} ${n === 1 ? "employee" : "employees"}`,
      formula: (n: number) => `${n.toLocaleString("en")} × ${STARTER_MONTHLY_PER_USER} × 12`,
      included: "Everything in Free, plus:",
      cta: "Request Starter",
      badge: "All live features",
    },
    selected: "Selected",
    footnote: "Starter includes unlimited AI assistance for HR administration and free early access to new features. Plan requests go through the form below — no payment is taken on this page.",
  },
  ar: {
    kicker: "الأسعار",
    title1: "اختر اللي يناسبك.",
    title2: "باقتان واضحتان.",
    sub: "ابدأ بالباقة المجانية، وإذا احتجت مزايا أكثر تقدر تنتقل إلى Starter.",
    teamLabel: "عدد موظفيك",
    dec: "إنقاص عدد الموظفين",
    inc: "زيادة عدد الموظفين",
    free: { name: "Free", tag: "الميزات الأساسية", price: "0", unit: "ريال", note: "بدون بطاقة ائتمانية. تقتصر على الميزات الأساسية.", included: "تشمل:", cta: "ابدأ بالمجانية" },
    starter: {
      name: "Starter",
      trial: "مجاناً لمدة ٣ أشهر",
      tag: "كل ما هو متاح الآن",
      unit: "ريال / مستخدم / شهرياً",
      billed: `الدفع سنوي — ${STARTER_ANNUAL_PER_USER} ريالاً لكل مستخدم سنوياً`,
      totalFor: (n: number) => `الإجمالي السنوي لـ ${n.toLocaleString("ar-SA")} موظف`,
      formula: (n: number) => `${n.toLocaleString("en")} × ${STARTER_MONTHLY_PER_USER} × 12`,
      included: "كل مزايا المجانية، بالإضافة إلى:",
      cta: "اطلب باقة Starter",
      badge: "كل الميزات المتاحة",
    },
    selected: "المختارة",
    footnote: "مع Starter، تستفيد من المساعد الذكي في إجراءات الموارد البشرية بدون قيود، وتجرّب المزايا الجديدة مبكراً ومجاناً. اطلب الباقة من النموذج أدناه — ما يتم أي دفع في هالصفحة.",
  },
};

export function Pricing({ employees, tier, setTier }: PricingProps) {
  const { language, dir } = useLanguage();
  const reduce = useReducedMotion();
  const t = content[language];
  const Arrow = dir === "rtl" ? ArrowUpLeft : ArrowUpRight;

  const choose = (next: PublicTier) => {
    setTier(next);
    track("package_cta_clicked", { tier: next, employees, language, source: "pricing" });
    document.getElementById(next === "GrowthPlus" ? "contact-us" : "partner")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };
  const select = (next: PublicTier) => {
    setTier(next);
    track("calculator_tier_selected", { tier: next, employees, language, source: "pricing" });
  };

  const reveal = reduce ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.45 } };
  const ar = language === "ar";
  const currencySymbol = <SaudiRiyalSymbol label={ar ? "ريال سعودي" : "Saudi riyal"} />;
  const x = {
    yes: ar ? "متاحة" : "Included",
    no: ar ? "غير متاحة" : "Not included",
    perMonth: <>{currencySymbol} {ar ? "/ مستخدم / شهرياً" : "/ user / month"}</>,
    billed: ar ? "الدفع سنوي" : "Billed annually",
    ctaFree: ar ? "ابدأ مجاناً" : "Start free",
    ctaPlan: ar ? "ابدأ الآن" : "Subscribe now",
  };

  const L = (v: { en: string; ar: string }) => (ar ? v.ar : v.en);

  const featLabel = (full: string, short: string) => (
    <>
      <span className="sr-only">{x.yes}: {full}</span>
      <span aria-hidden title={full}>{short.split(/(\(استخدام محدود\)|\(limited use\)|\(limited access\))/gi).map((part, index) =>
        /^\((استخدام محدود|limited use|limited access)\)$/i.test(part)
          ? <span key={index} className="mx-1 inline-block rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-900">{part.slice(1, -1)}</span>
          : part
      )}</span>
    </>
  );

  const selectBtn = (plan: PublicTier, id: string, cls: string, children: ReactNode) => (
    <button type="button" id={`plan-${id}-name`} aria-pressed={tier === plan} data-testid={`button-select-${id}`}
      onClick={(e) => { e.stopPropagation(); select(plan); }} className={cls}>
      <span className="sr-only">{publicTierLabel[plan][language]}: </span>
      {children}
    </button>
  );
  const ctaBtn = (plan: PublicTier, id: string, label: string, cls: string) => (
    <button type="button" data-testid={`button-plan-${id}`} onClick={(e) => { e.stopPropagation(); choose(plan); }}
      className={`group flex min-h-11 items-center justify-between gap-3 rounded-xl ps-4 pe-1.5 text-[15px] font-black transition-colors focus-visible:outline-none focus-visible:ring-4 ${cls}`}>
      <span>{label}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A1A3A]/10 transition-transform group-hover:-translate-y-0.5 motion-reduce:transform-none"><Arrow size={16} /></span>
    </button>
  );
  const selectedPill = (cls: string) => (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black ${cls}`}><Check size={11} strokeWidth={3.5} /> {t.selected}</span>
  );

  const t3 = {
    freeName: ar ? "مجانية" : "Free",
    paidName: "Starter",
    modulesTitle: ar ? "مميزات باقة ٣ ريال" : "Included with the 3 SAR plan",
  };

  const cardShell = (plan: PublicTier, id: string, children: ReactNode) => {
    const active = tier === plan;
    const free = plan === "Standard";
    return (
      <motion.article key={id} {...reveal} onClick={() => select(plan)} data-testid={`card-plan-${id}`} aria-labelledby={`plan-${id}-name`}
        className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_16px_36px_-26px_rgba(10,26,58,0.5)] ring-1 transition-shadow ${active ? (free ? "ring-2 ring-blue-600" : plan === "GrowthPlus" ? "ring-2 ring-violet-600" : "ring-2 ring-teal-600") : "ring-[#0A1A3A]/10"}`}>
        {children}
      </motion.article>
    );
  };

  const renderPriceHeader = (plan: PublicTier, id: string, name: ReactNode, price: number, unit: ReactNode, badge: string) => (
      <div className="relative -mx-5 -mt-5 mb-1 min-h-[190px] px-5 pb-12 pt-6 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            clipPath: ar ? "polygon(0 0, 100% 0, 100% 100%, 0 76%)" : "polygon(0 0, 100% 0, 100% 76%, 0 100%)",
            background: plan === "Standard" ? "linear-gradient(155deg, #327bff, #1452f5)" : plan === "GrowthPlus" ? "linear-gradient(115deg, #6366f1, #7c3aed 65%, #6d28d9)" : "linear-gradient(115deg, #048fc0, #009d88 65%, #008c79)",
          }}>
          {plan !== "Standard" && <span className={`absolute inset-0 ${plan === "GrowthPlus" ? "bg-indigo-800/25" : "bg-blue-600/25"}`} style={{ clipPath: "polygon(0 0, 46% 0, 19% 100%, 0 100%)" }} />}
          <span className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(35deg, transparent 0, transparent 10px, rgba(255,255,255,.08) 10px, rgba(255,255,255,.08) 11px)" }} />
        </div>
        <div className="relative flex items-start justify-between gap-2">
        {selectBtn(plan, id, "flex min-w-0 flex-col items-start gap-1 rounded-xl text-start focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60",
          <>
            <span aria-hidden className="text-xs font-black text-white/95">{name}</span>
            <span className="flex items-center gap-3">
              <span className="font-heading text-[88px] font-black leading-none tracking-tight tabular-nums text-white sm:text-[104px]" dir="ltr">{price}</span>
              <span className="flex min-w-0 flex-col items-start gap-2">
                <span className="text-sm font-black text-white sm:text-base">{unit}</span>
                <span className={`inline-flex rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black ${plan === "Standard" ? "text-blue-700" : plan === "GrowthPlus" ? "text-violet-800" : "text-teal-800"}`}>{badge}</span>
                {plan === "Growth" && (
                  <span data-testid="starter-free-trial" className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-teal-950">
                    {t.starter.trial}
                  </span>
                )}
              </span>
            </span>
          </>)}
        {tier === plan && <span className="absolute end-0 top-0">{selectedPill(plan === "Standard" ? "bg-white text-blue-700" : plan === "GrowthPlus" ? "bg-white text-violet-700" : "bg-white text-teal-700")}</span>}
        </div>
      </div>
  );

  const renderFree = () => cardShell("Standard", "free", (
    <>
      {renderPriceHeader("Standard", "free", t3.freeName, 0, currencySymbol, t.free.tag)}
      <ul className="mt-3 flex-1 space-y-3">
        {freeFeatures.map((ft) => {
          const FI = ft.icon;
          return (
            <li key={ft.key}>
              <div className="flex items-start gap-2 text-sm font-medium leading-snug text-slate-700">
                <FI aria-hidden size={16} className="mt-0.5 shrink-0 text-teal-700" />
                <span className="min-w-0">{featLabel(L(ft.text), L(ft.text))}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="relative pt-5">
        {ctaBtn("Standard", "free", x.ctaFree, "w-full bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-300 shadow-[0_12px_26px_-14px_rgba(37,99,235,0.7)]")}
      </div>
    </>
  ));

  const renderPaid = (plan: "Growth" | "GrowthPlus") => {
    const growth = plan === "GrowthPlus";
    const id = growth ? "growth" : "starter";
    const features = growth ? growthFeatures : starterFeatures;
    return cardShell(plan, id, (
    <>
      {renderPriceHeader(plan, id, publicTierLabel[plan][language], tierPrice(plan), x.perMonth, x.billed)}
      <div className="mt-3 flex-1">
        <p className={`mb-4 text-sm font-black ${growth ? "text-violet-800" : "text-teal-800"}`}>{growth
          ? (ar ? "كافة المميزات في باقة Starter بالإضافة إلى:" : "Everything in Starter, plus:")
          : (ar ? "كافة المميزات في الباقة المجانية بالإضافة إلى:" : "Everything in Free, plus:")}</p>
        <ul className="space-y-3">
          {features.map((ft) => {
            const Icon = ft.icon;
            return <li key={ft.key} className="flex items-start gap-2 text-sm font-medium leading-relaxed text-slate-700">
              <Icon aria-hidden size={16} className={`mt-1 shrink-0 ${growth ? "text-violet-700" : "text-teal-700"}`} />
              <span>{featLabel(L(ft.text), ft.short ? L(ft.short) : L(ft.text))}
                {ft.badge && <span className="ms-1.5 inline-block rounded-md bg-amber-100 px-1.5 py-px text-[10px] font-black text-amber-800">{L(ft.badge)}</span>}
              </span>
            </li>;
          })}
        </ul>
      </div>
      <div className="relative pt-5">
        {ctaBtn(plan, id, growth ? (ar ? "تواصل معنا" : "Contact us") : x.ctaPlan, growth
          ? "w-full bg-violet-700 text-white hover:bg-violet-800 focus-visible:ring-violet-300 shadow-[0_12px_26px_-14px_rgba(109,40,217,0.7)]"
          : "w-full bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-300 shadow-[0_12px_26px_-14px_rgba(15,118,110,0.7)]")}
      </div>
    </>
  ));
  };

  return (
    <section id="pricing" data-analytics-section="pricing" data-analytics-name="Pricing" className="relative bg-[#F4F1EA] py-8 lg:py-5 scroll-mt-20">
      <div className="container mx-auto max-w-[1080px] px-4 sm:px-6">
        <h2 className="sr-only">{t.kicker}</h2>

        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          {renderFree()}
          {renderPaid("Growth")}
        </div>
      </div>
    </section>
  );
}
