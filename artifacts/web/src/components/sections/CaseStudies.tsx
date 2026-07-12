import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Award, LogOut, Coins } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Client 3 (featured): Aug–Dec 2025 — on-time check-ins & check-outs (days/employee/month)
const featuredData = [
  { m: 0, checkins: 10.6, checkouts: 13.3 },
  { m: 1, checkins: 11.2, checkouts: 13.5 },
  { m: 2, checkins: 12.1, checkouts: 14.0 },
  { m: 3, checkins: 12.8, checkouts: 14.5 },
  { m: 4, checkins: 13.2, checkouts: 14.8 },
];

// Client 1: Jul–Oct 2025 — on-time check-outs (days/employee/month)
const checkoutData = [
  { m: 0, v: 8.4 },
  { m: 1, v: 8.7 },
  { m: 2, v: 9.2 },
  { m: 3, v: 9.8 },
];

// Client 2: Jul–Oct 2025 — points accumulated per month
const pointsData = [
  { m: 0, v: 2500 },
  { m: 1, v: 4550 },
  { m: 2, v: 6300 },
  { m: 3, v: 29770 },
];

const content = {
  en: {
    eyebrow: "Real client results · 2025",
    titlePart1: "Proof, not promises. ",
    titlePart2: "Performance that shows in the numbers.",
    subtitle:
      "ROI reports from three real clients using the Nizamy point system — attendance discipline and engagement tracked month by month.",
    featuredMonths: ["Aug", "Sep", "Oct", "Nov", "Dec"],
    smallMonths: ["Jul", "Aug", "Sep", "Oct"],
    daysUnit: "days/mo",
    featured: {
      tag: "Client 3 · Aug–Dec 2025 · 5 months",
      title: "The highest check-in lift of any client — +24%",
      desc: "On-time check-ins climbed from 10.6 to 13.2 days per employee each month, and on-time check-outs rose 11% — with 57 employees earning rewards and 130,525 points accumulated along the way.",
      legendCheckins: "On-time check-ins",
      legendCheckouts: "On-time check-outs",
      stats: [
        { icon: TrendingUp, value: "+24%", label: "on-time check-ins" },
        { icon: Award, value: "57", label: "employees earned rewards" },
      ],
    },
    cards: [
      {
        icon: LogOut,
        tag: "Client 1 · Jul–Oct 2025",
        title: "On-time check-outs jumped +17% in 4 months",
        desc: "With zero manager intervention: check-outs rose from 8.4 to 9.8 days per employee monthly once reward milestones became visible.",
        stat: "+17%",
        statLabel: "on-time check-outs",
      },
      {
        icon: Coins,
        tag: "Client 2 · Jul–Oct 2025",
        title: "Points accumulated grew 12× in 4 months",
        desc: "Engagement compounded every month — from 2,500 points in month one to 29,770 in month four, with 28 employees hitting reward thresholds.",
        stat: "12×",
        statLabel: "points growth",
      },
    ],
    note: "Real results from Nizamy point-system deployments in 2025. Client names withheld for confidentiality.",
    featuredChartSummary:
      "Line chart: over five months, on-time check-ins rose from 10.6 to 13.2 days per employee per month, and on-time check-outs rose from 13.3 to 14.8.",
    cardChartSummaries: [
      "Trend chart: on-time check-outs rose steadily from 8.4 to 9.8 days per employee per month over four months.",
      "Trend chart: monthly points accumulated grew from 2,500 to 29,770 over four months.",
    ],
  },
  ar: {
    eyebrow: "نتائج عملاء حقيقية · 2025",
    titlePart1: "إثبات، لا وعود. ",
    titlePart2: "أداء يظهر في الأرقام.",
    subtitle:
      "تقارير عائد من ثلاثة عملاء حقيقيين يستخدمون نظام النقاط في نظامي — انضباط الحضور والتفاعل يُرصدان شهراً بشهر.",
    featuredMonths: ["أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    smallMonths: ["يوليو", "أغسطس", "سبتمبر", "أكتوبر"],
    daysUnit: "يوم/شهر",
    featured: {
      tag: "العميل 3 · أغسطس–ديسمبر 2025 · 5 أشهر",
      title: "أعلى تحسّن في الحضور المبكر بين عملائنا — 24%+",
      desc: "ارتفع الحضور في الوقت المحدد من 10.6 إلى 13.2 يوماً لكل موظف شهرياً، وارتفع الانصراف المنضبط 11% — مع حصول 57 موظفاً على مكافآت وتراكم 130,525 نقطة خلال الفترة.",
      legendCheckins: "الحضور في الوقت المحدد",
      legendCheckouts: "الانصراف في الوقت المحدد",
      stats: [
        { icon: TrendingUp, value: "+24%", label: "الحضور في الوقت المحدد" },
        { icon: Award, value: "57", label: "موظفاً حصلوا على مكافآت" },
      ],
    },
    cards: [
      {
        icon: LogOut,
        tag: "العميل 1 · يوليو–أكتوبر 2025",
        title: "الانصراف المنضبط قفز 17%+ خلال 4 أشهر",
        desc: "دون أي تدخل من المدراء: ارتفع الانصراف في الوقت المحدد من 8.4 إلى 9.8 يوماً لكل موظف شهرياً بمجرد أن أصبحت أهداف المكافآت مرئية.",
        stat: "+17%",
        statLabel: "الانصراف المنضبط",
      },
      {
        icon: Coins,
        tag: "العميل 2 · يوليو–أكتوبر 2025",
        title: "النقاط المكتسبة تضاعفت 12 مرة خلال 4 أشهر",
        desc: "التفاعل تضاعف شهراً بعد شهر — من 2,500 نقطة في الشهر الأول إلى 29,770 في الشهر الرابع، مع وصول 28 موظفاً لأهداف المكافآت.",
        stat: "×12",
        statLabel: "نمو النقاط",
      },
    ],
    note: "نتائج حقيقية من تطبيقات نظام النقاط في نظامي خلال 2025. أسماء العملاء محجوبة للخصوصية.",
    featuredChartSummary:
      "رسم بياني خطي: خلال خمسة أشهر ارتفع الحضور في الوقت المحدد من 10.6 إلى 13.2 يوماً لكل موظف شهرياً، وارتفع الانصراف المنضبط من 13.3 إلى 14.8.",
    cardChartSummaries: [
      "رسم بياني: ارتفع الانصراف في الوقت المحدد تدريجياً من 8.4 إلى 9.8 يوماً لكل موظف شهرياً خلال أربعة أشهر.",
      "رسم بياني: نمت النقاط الشهرية المكتسبة من 2,500 إلى 29,770 خلال أربعة أشهر.",
    ],
  },
};

export function CaseStudies() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const t = content[language];

  const featuredMonthLabel = (i: number) => t.featuredMonths[i] ?? "";

  return (
    <section id="use-cases" className="py-24 bg-gradient-to-b from-slate-50 to-white scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold rounded-full px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 shadow-sm mb-6">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 leading-tight text-slate-900">
            {t.titlePart1}
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">{t.subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured card with big trend chart */}
          <div className="lg:col-span-2 rounded-[32px] bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-2 p-10 md:p-12 flex flex-col justify-center text-start rtl:text-right">
                <span className="inline-block self-start text-[11px] font-bold rounded-full px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 mb-5">
                  {t.featured.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-slate-900 mb-4 leading-snug">
                  {t.featured.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">{t.featured.desc}</p>
                <div className="flex gap-4">
                  {t.featured.stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <Icon size={18} className="text-blue-600 mb-2" />
                        <div className="text-2xl font-heading font-black text-slate-900 tabular-nums">{s.value}</div>
                        <div className="text-xs font-medium text-slate-500">{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-3 p-6 md:p-10 bg-gradient-to-br from-blue-50/60 to-indigo-50/40">
                <div className="flex items-center gap-5 mb-4 justify-center text-xs font-semibold text-slate-600 flex-wrap">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1.5 rounded-full bg-blue-600 inline-block" />
                    {t.featured.legendCheckins}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    {t.featured.legendCheckouts}
                  </span>
                  <span className="text-slate-400 font-medium">({t.daysUnit})</span>
                </div>
                <p className="sr-only">{t.featuredChartSummary}</p>
                <div className="h-64 md:h-80" dir="ltr" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={featuredData} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="m"
                        tickFormatter={featuredMonthLabel}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[8, 16]}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        orientation={isRtl ? "right" : "left"}
                      />
                      <Tooltip
                        labelFormatter={(v) => featuredMonthLabel(Number(v))}
                        formatter={(value: number, name: string) => [`${value} ${t.daysUnit}`, name]}
                        contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="checkins"
                        name={t.featured.legendCheckins}
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="checkouts"
                        name={t.featured.legendCheckouts}
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Two smaller cards with sparkline areas */}
          {t.cards.map((card, idx) => {
            const Icon = card.icon;
            const data = idx === 0 ? checkoutData : pointsData;
            const color = idx === 0 ? "#2563eb" : "#f59e0b";
            const gradId = `case-grad-${idx}`;
            return (
              <div
                key={idx}
                className="rounded-[32px] bg-white border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="p-8 md:p-10 pb-4 text-start rtl:text-right">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-block text-[11px] font-bold rounded-full px-3 py-1 bg-slate-50 text-slate-600 border border-slate-100">
                      {card.tag}
                    </span>
                    <span className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Icon size={18} className="text-blue-600" />
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-heading font-black text-slate-900 mb-3 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base mb-5">{card.desc}</p>
                  <div className="flex items-baseline gap-2 rtl:flex-row-reverse rtl:justify-end">
                    <span className="text-3xl font-heading font-black text-blue-600 tabular-nums">{card.stat}</span>
                    <span className="text-xs font-semibold text-slate-400">{card.statLabel}</span>
                  </div>
                </div>
                <p className="sr-only">{t.cardChartSummaries[idx]}</p>
                <div className="h-28 mt-auto" dir="ltr" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="m" hide />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={2.5}
                        fill={`url(#${gradId})`}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 font-medium mt-8">{t.note}</p>
      </div>
    </section>
  );
}
