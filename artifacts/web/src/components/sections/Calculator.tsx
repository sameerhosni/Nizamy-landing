import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { PublicTier, publicTierLabel, Tier } from "@/lib/plans";
import { EmployeeCountInput } from "./EmployeeCountInput";

interface CalculatorProps {
  hoursSaved: number;
  setHoursSaved: (value: number) => void;
  hourlyValue: number;
  setHourlyValue: (value: number) => void;
  employees: number;
  setEmployees: (val: number) => void;
  tier: Tier;
  setTier: (val: Tier) => void;
  subscription: number;
  totalReturn: number;
  effectiveCost: number;
}

const content = {
  en: {
    badge: "Illustrative example — not a real client case",
    title: "Estimate your value",
    sub: "Adjust the assumptions. Actual results vary with your team.",
    emp: "Employees",
    dec: "Decrease employees",
    inc: "Increase employees",
    plan: "Plan",
    hours: "Hours saved / employee / month",
    hourly: "Value per work hour (SAR)",
    value: "Estimated annual time value",
    subscription: "Annual subscription",
    net: "Net value after subscription",
    formula: "Formula: employees × monthly hours saved × hourly value × 12",
    freeNote: "Free plan: no subscription cost, so a percentage ROI is not calculated.",
    details: "How this estimate works",
    detailsBody: [
      "Value of time recovered through better attendance, less manual work and AI HR support, depending on the features in your plan.",
      "This is estimated time value, not cashback or money paid to you.",
      "Not included in the money estimate: welcome points for eligible users to redeem cards (subject to offer and redemption terms), and free discount coupons (savings depend on offers used and purchases made).",
      "These figures are hypothetical examples for illustration only. They are not results achieved by actual clients, case studies, or a promise or guarantee of savings or returns.",
    ],
  },
  ar: {
    badge: "مثال افتراضي — وليس حالة عميل حقيقية",
    title: "قدّر قيمتك",
    sub: "عدّل الافتراضات. النتائج الفعلية تختلف حسب فريقك.",
    emp: "عدد الموظفين",
    dec: "إنقاص عدد الموظفين",
    inc: "زيادة عدد الموظفين",
    plan: "الباقة",
    hours: "ساعات موفّرة لكل موظف شهرياً",
    hourly: "قيمة ساعة العمل (ريال)",
    value: "القيمة السنوية التقديرية للوقت",
    subscription: "الاشتراك السنوي",
    net: "صافي القيمة بعد الاشتراك",
    formula: "المعادلة: الموظفون × الساعات الموفّرة شهرياً × قيمة الساعة × ١٢",
    freeNote: "الباقة المجانية: لا توجد تكلفة اشتراك، لذلك لا تُحسب نسبة ROI.",
    details: "كيف يُحسب هذا التقدير",
    detailsBody: [
      "قيمة الوقت المستعاد بتحسين الحضور وتقليل العمل اليدوي ودعم الموارد البشرية بالذكاء الاصطناعي، حسب المميزات المتاحة في باقتك.",
      "هذه قيمة وقت تقديرية وليست استرداداً نقدياً أو مبلغاً يُدفع لك.",
      "غير مشمول في التقدير النقدي: رصيد نقاط ترحيبية للمؤهلين لاستبدال البطاقات (حسب شروط العرض والاستبدال)، وكوبونات خصم مجانية (التوفير يعتمد على العروض المستخدمة والمشتريات).",
      "هذه الأرقام أمثلة افتراضية للتوضيح فقط، وليست نتائج حققها عملاء فعليون أو دراسات حالة، ولا تمثل وعداً أو ضماناً بتحقيق وفورات أو عائد محدد.",
    ],
  },
};

export function Calculator({
  employees, setEmployees, tier, setTier, subscription, totalReturn, effectiveCost,
  hoursSaved, setHoursSaved, hourlyValue, setHourlyValue,
}: CalculatorProps) {
  const { language } = useLanguage();
  const t = content[language];
  const fmt = (n: number) => formatCurrency(n, "SAR", language);
  const input = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 tabular-nums focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200";

  return (
    <section id="calculator" data-analytics-section="calculator" data-analytics-name="Calculator" className="bg-[#FAFAF7] py-16 sm:py-20 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-black text-blue-700">{t.badge}</span>
            <h2 className="mt-1 font-heading text-3xl sm:text-4xl font-black tracking-tight text-[#0A1A3A]">{t.title}</h2>
            <p className="text-slate-500 font-medium">{t.sub}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr] rounded-[24px] border border-slate-200 bg-white p-4 sm:p-6">
          <div className="space-y-4">
            <EmployeeCountInput id="calc-employees" label={t.emp} value={employees} onChange={setEmployees} decLabel={t.dec} incLabel={t.inc}
              onCommit={(n) => track("calculator_used", { employees: n, tier, language })} />
            <fieldset>
              <legend className="mb-2 text-sm font-bold text-slate-700">{t.plan}</legend>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                {(["Standard", "Growth"] as PublicTier[]).map((p) => (
                  <button key={p} type="button" aria-pressed={tier === p}
                    onClick={() => { setTier(p); track("calculator_tier_selected", { tier: p, employees, language }); }}
                    className={`h-10 rounded-lg text-sm font-black transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${tier === p ? "bg-[#0A1A3A] text-white" : "text-slate-600 hover:bg-white"}`}>
                    {publicTierLabel[p][language]}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-slate-600">
                {t.hours}
                <input type="number" min="0" max="160" step="0.25" value={hoursSaved} dir="ltr"
                  onChange={(e) => setHoursSaved(Math.min(160, Math.max(0, Number(e.target.value) || 0)))} className={input} />
              </label>
              <label className="block text-xs font-bold text-slate-600">
                {t.hourly}
                <input type="number" min="0" max="10000" step="5" value={hourlyValue} dir="ltr"
                  onChange={(e) => setHourlyValue(Math.min(10000, Math.max(0, Number(e.target.value) || 0)))} className={input} />
              </label>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl bg-[#0A1A3A] p-5 text-white" aria-live="polite">
            <p className="text-xs font-bold text-blue-200">{t.value}</p>
            <p className="font-heading text-3xl sm:text-4xl font-black tabular-nums break-all">{fmt(totalReturn)}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-blue-200">{t.subscription}</dt><dd className="font-black tabular-nums">{fmt(subscription)}</dd></div>
              <div className="flex justify-between gap-3 rounded-lg bg-blue-600 px-3 py-2"><dt className="font-bold">{t.net}</dt><dd className="font-black tabular-nums">{fmt(effectiveCost)}</dd></div>
            </dl>
            <p className="mt-4 text-xs text-blue-200">{t.formula}</p>
            {subscription === 0 && <p className="mt-1 text-xs text-amber-300 font-bold">{t.freeNote}</p>}
          </div>
        </div>

        <details className="group mt-3 rounded-2xl border border-slate-200 bg-white px-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-black text-[#0A1A3A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 rounded-lg">
            {t.details}
            <ChevronDown size={18} className="transition-transform group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <ul className="space-y-2 pb-4 text-sm text-slate-600 leading-relaxed list-disc ps-5">
            {t.detailsBody.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </details>
      </div>
    </section>
  );
}
