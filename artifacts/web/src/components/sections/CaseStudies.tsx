import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Smile, Clock, Coins } from "lucide-react";
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

const performanceData = [
  { m: 0, performance: 62, satisfaction: 58 },
  { m: 1, performance: 66, satisfaction: 64 },
  { m: 2, performance: 71, satisfaction: 70 },
  { m: 3, performance: 74, satisfaction: 78 },
  { m: 4, performance: 80, satisfaction: 85 },
  { m: 5, performance: 84, satisfaction: 92 },
];

const latenessData = [
  { m: 0, v: 420 },
  { m: 1, v: 340 },
  { m: 2, v: 250 },
  { m: 3, v: 190 },
  { m: 4, v: 130 },
  { m: 5, v: 95 },
];

const returnData = [
  { m: 0, v: 0 },
  { m: 1, v: 1800 },
  { m: 2, v: 4200 },
  { m: 3, v: 7100 },
  { m: 4, v: 10600 },
  { m: 5, v: 14400 },
];

const content = {
  en: {
    eyebrow: "Real use cases",
    titlePart1: "Proof, not promises. ",
    titlePart2: "Performance that shows in the numbers.",
    subtitle:
      "Sample ROI reports from teams using Nizamy — employee performance and satisfaction tracked month by month, with the return growing alongside them.",
    months: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
    featured: {
      tag: "Retail chain · 45 employees",
      title: "Performance and satisfaction climbing together",
      desc: "Six months after launch: team performance rose from 62 to 84 points, while employee satisfaction jumped from 58% to 92% — driven by rewards instead of penalties.",
      legendPerformance: "Performance index",
      legendSatisfaction: "Employee satisfaction",
      stats: [
        { icon: TrendingUp, value: "+35%", label: "team performance" },
        { icon: Smile, value: "92%", label: "employee satisfaction" },
      ],
    },
    cards: [
      {
        icon: Clock,
        tag: "Medical clinics · 28 employees",
        title: "Late minutes down 77%",
        desc: "Verified check-ins and motivation points cut monthly lateness from 420 minutes to 95.",
        stat: "-77%",
        statLabel: "monthly lateness",
      },
      {
        icon: Coins,
        tag: "Logistics company · 60 employees",
        title: "SAR 14,400 returned in 6 months",
        desc: "As performance targets were hit, the annual return accumulated automatically — real money back.",
        stat: "14,400 SAR",
        statLabel: "accumulated return",
      },
    ],
    note: "Sample reports based on pilot deployments with early design partners.",
    featuredChartSummary:
      "Line chart: over six months, the performance index rose steadily from 62 to 84 points, and employee satisfaction rose from 58% to 92%.",
    cardChartSummaries: [
      "Trend chart: monthly lateness fell steadily from 420 minutes to 95 minutes over six months.",
      "Trend chart: the accumulated return grew from 0 to 14,400 SAR over six months.",
    ],
  },
  ar: {
    eyebrow: "حالات استخدام حقيقية",
    titlePart1: "إثبات، لا وعود. ",
    titlePart2: "أداء يظهر في الأرقام.",
    subtitle:
      "نماذج من تقارير العائد لفرق تستخدم نظامي — أداء الموظفين ورضاهم يُرصدان شهراً بشهر، والعائد ينمو معهما.",
    months: ["الشهر 1", "الشهر 2", "الشهر 3", "الشهر 4", "الشهر 5", "الشهر 6"],
    featured: {
      tag: "سلسلة متاجر تجزئة · 45 موظفاً",
      title: "الأداء والرضا يرتفعان معاً",
      desc: "بعد ستة أشهر من الإطلاق: ارتفع أداء الفريق من 62 إلى 84 نقطة، وقفز رضا الموظفين من 58% إلى 92% — بالتحفيز بدل العقوبات.",
      legendPerformance: "مؤشر الأداء",
      legendSatisfaction: "رضا الموظفين",
      stats: [
        { icon: TrendingUp, value: "+35%", label: "أداء الفريق" },
        { icon: Smile, value: "92%", label: "رضا الموظفين" },
      ],
    },
    cards: [
      {
        icon: Clock,
        tag: "مجموعة عيادات طبية · 28 موظفاً",
        title: "دقائق التأخير انخفضت 77%",
        desc: "التحقق الموثوق من الحضور ونقاط التحفيز خفّضا التأخير الشهري من 420 دقيقة إلى 95.",
        stat: "-77%",
        statLabel: "التأخير الشهري",
      },
      {
        icon: Coins,
        tag: "شركة لوجستية · 60 موظفاً",
        title: "14,400 ر.س عادت خلال 6 أشهر",
        desc: "مع تحقق أهداف الأداء، تراكم العائد السنوي تلقائياً — أموال حقيقية تعود إليك.",
        stat: "14,400 ر.س",
        statLabel: "العائد المتراكم",
      },
    ],
    note: "نماذج تقارير مبنية على تجارب تشغيل مع شركاء التصميم الأوائل.",
    featuredChartSummary:
      "رسم بياني خطي: خلال ستة أشهر ارتفع مؤشر الأداء تدريجياً من 62 إلى 84 نقطة، وارتفع رضا الموظفين من 58% إلى 92%.",
    cardChartSummaries: [
      "رسم بياني: انخفض التأخير الشهري تدريجياً من 420 دقيقة إلى 95 دقيقة خلال ستة أشهر.",
      "رسم بياني: نما العائد المتراكم من 0 إلى 14,400 ريال خلال ستة أشهر.",
    ],
  },
};

export function CaseStudies() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const t = content[language];

  const monthLabel = (i: number) => t.months[i] ?? "";

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
                <div className="flex items-center gap-5 mb-4 justify-center text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1.5 rounded-full bg-blue-600 inline-block" />
                    {t.featured.legendPerformance}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    {t.featured.legendSatisfaction}
                  </span>
                </div>
                <p className="sr-only">{t.featuredChartSummary}</p>
                <div className="h-64 md:h-80" dir="ltr" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 10, right: 16, left: -14, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="m"
                        tickFormatter={monthLabel}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                       
                      />
                      <YAxis
                        domain={[40, 100]}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        orientation={isRtl ? "right" : "left"}
                      />
                      <Tooltip
                        labelFormatter={(v) => monthLabel(Number(v))}
                        contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="performance"
                        name={t.featured.legendPerformance}
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="satisfaction"
                        name={t.featured.legendSatisfaction}
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
            const data = idx === 0 ? latenessData : returnData;
            const color = idx === 0 ? "#f59e0b" : "#2563eb";
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
