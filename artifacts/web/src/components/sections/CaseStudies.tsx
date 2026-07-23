import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Award, LogOut, Coins, Quote } from "lucide-react";
import { motion } from "framer-motion";
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
  LabelList,
} from "recharts";

const featuredData = [
  { m: 0, checkins: 10.6, checkouts: 13.3 },
  { m: 1, checkins: 11.2, checkouts: 13.5 },
  { m: 2, checkins: 12.1, checkouts: 14.0 },
  { m: 3, checkins: 12.8, checkouts: 14.5 },
  { m: 4, checkins: 13.2, checkouts: 14.8 },
];

const checkoutData = [
  { m: 0, v: 8.4 },
  { m: 1, v: 8.7 },
  { m: 2, v: 9.2 },
  { m: 3, v: 9.8 },
];

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
    subtitle: "ROI reports from three real clients using Nizamy HR — attendance discipline and engagement tracked month by month.",
    featuredMonths: ["Aug", "Sep", "Oct", "Nov", "Dec"],
    smallMonths: ["Jul", "Aug", "Sep", "Oct"],
    daysUnit: "days/mo",
    featured: {
      tag: "Client 3 · Aug–Dec 2025 · 5 months",
      title: "The highest check-in lift of any client — +24%",
      desc: "On-time check-ins climbed from 10.6 to 13.2 days per employee each month, and on-time check-outs rose 11% — with 57 employees earning rewards and 130,525 points accumulated.",
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
        desc: "Engagement compounded every month — from 2,500 points in month one to 29,770 in month four.",
        stat: "12×",
        statLabel: "points growth",
      },
    ],
    note: "Real results from Nizamy HR point-system deployments in 2025. Client names withheld for confidentiality.",
  },
  ar: {
    eyebrow: "نتائج عملاء حقيقية · 2025",
    titlePart1: "إثبات، لا وعود. ",
    titlePart2: "أداء يظهر في الأرقام.",
    subtitle: "تقارير عائد من ثلاثة عملاء حقيقيين يستخدمون نظامي اتش آر — انضباط الحضور والتفاعل يُرصدان شهراً بشهر.",
    featuredMonths: ["أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    smallMonths: ["يوليو", "أغسطس", "سبتمبر", "أكتوبر"],
    daysUnit: "يوم/شهر",
    featured: {
      tag: "العميل 3 · أغسطس–ديسمبر 2025 · 5 أشهر",
      title: "أعلى تحسّن في الحضور المبكر بين عملائنا — 24%+",
      desc: "ارتفع الحضور في الوقت المحدد من 10.6 إلى 13.2 يوماً لكل موظف شهرياً، وارتفع الانصراف المنضبط 11% — مع حصول 57 موظفاً على مكافآت وتراكم 130,525 نقطة.",
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
        desc: "دون أي تدخل من المدراء: ارتفع الانصراف في الوقت المحدد من 8.4 إلى 9.8 يوماً لكل موظف شهرياً.",
        stat: "+17%",
        statLabel: "الانصراف المنضبط",
      },
      {
        icon: Coins,
        tag: "العميل 2 · يوليو–أكتوبر 2025",
        title: "النقاط المكتسبة تضاعفت 12 مرة خلال 4 أشهر",
        desc: "التفاعل تضاعف شهراً بعد شهر — من 2,500 نقطة في الشهر الأول إلى 29,770 في الشهر الرابع.",
        stat: "×12",
        statLabel: "نمو النقاط",
      },
    ],
    note: "نتائج حقيقية من تطبيقات نظام النقاط في نظامي اتش آر خلال 2025. أسماء العملاء محجوبة للخصوصية.",
  },
};

export function CaseStudies() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const t = content[language];

  const featuredMonthLabel = (i: number) => t.featuredMonths[i] ?? "";

  return (
    <section id="use-cases" data-analytics-section="use-cases" data-analytics-name="Use Cases" className="py-24 sm:py-32 bg-white scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <span className="inline-block text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-6 uppercase tracking-wider">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] mb-6 text-slate-900 tracking-tight">
            <span>{t.titlePart1}</span>
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 rounded-[32px] bg-[#FAFAFA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative"
          >
            <Quote className="absolute top-12 right-12 text-blue-100 w-32 h-32 rotate-180 z-0 opacity-50" />
            <div className="grid grid-cols-1 md:grid-cols-5 relative z-10">
              <div className="md:col-span-2 p-10 sm:p-14 flex flex-col justify-center text-start rtl:text-right border-b md:border-b-0 md:border-e border-slate-200">
                <span className="inline-block self-start text-[13px] font-bold rounded-full px-4 py-2 bg-blue-100/50 text-blue-800 border border-blue-200/50 mb-8 uppercase tracking-wider">
                  {t.featured.tag}
                </span>
                <h3 className="text-[1.75rem] sm:text-4xl font-heading font-black text-slate-900 mb-6 leading-tight">
                  {t.featured.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10 text-[17px]">{t.featured.desc}</p>
                <div className="flex gap-4">
                  {t.featured.stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="flex-1 rounded-2xl bg-white border border-slate-200/60 p-6 shadow-sm">
                        <Icon size={24} className="text-blue-600 mb-4" />
                        <div className="text-3xl font-heading font-black text-slate-900 tabular-nums mb-2">{s.value}</div>
                        <div className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-3 p-8 sm:p-12 bg-white">
                <div className="flex items-center gap-6 justify-center text-[15px] font-bold text-slate-600 mb-8 flex-wrap">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    {t.featured.legendCheckins}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    {t.featured.legendCheckouts}
                  </span>
                </div>
                <div className="h-64 sm:h-80" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={featuredData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="m"
                        tickFormatter={featuredMonthLabel}
                        tick={{ fontSize: 13, fill: "#64748b", fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                        dy={15}
                      />
                      <YAxis
                        domain={[8, 16]}
                        tick={{ fontSize: 13, fill: "#64748b", fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                        orientation={isRtl ? "right" : "left"}
                        dx={isRtl ? 15 : -15}
                      />
                      <Tooltip
                        labelFormatter={(v) => featuredMonthLabel(Number(v))}
                        formatter={(value: number, name: string) => [`${value} ${t.daysUnit}`, name]}
                        contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", fontWeight: 700, padding: '12px 16px' }}
                      />
                      <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="checkins"
                        name={t.featured.legendCheckins}
                        stroke="#2563eb"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#fff", strokeWidth: 3, stroke: "#2563eb" }}
                        activeDot={{ r: 8, fill: "#2563eb", stroke: "#fff", strokeWidth: 3 }}
                      >
                        <LabelList
                          dataKey="checkins"
                          position="bottom"
                          offset={15}
                          formatter={(v: number) => v.toFixed(1)}
                          style={{ fontSize: 13, fontWeight: 800, fill: "#2563eb" }}
                        />
                      </Line>
                      <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="checkouts"
                        name={t.featured.legendCheckouts}
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#fff", strokeWidth: 3, stroke: "#10b981" }}
                        activeDot={{ r: 8, fill: "#10b981", stroke: "#fff", strokeWidth: 3 }}
                      >
                        <LabelList
                          dataKey="checkouts"
                          position="top"
                          offset={15}
                          formatter={(v: number) => v.toFixed(1)}
                          style={{ fontSize: 13, fontWeight: 800, fill: "#10b981" }}
                        />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two small cards */}
          {t.cards.map((card, idx) => {
            const Icon = card.icon;
            const data = idx === 0 ? checkoutData : pointsData;
            const color = "#2563eb";
            const gradId = `case-grad-${idx}`;
            const smallMonthLabel = (i: number) => t.smallMonths[i] ?? "";
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                key={idx}
                className="rounded-[32px] bg-[#FAFAFA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col relative group hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-400"
              >
                <Quote className="absolute top-10 right-10 text-blue-100 w-20 h-20 rotate-180 z-0 opacity-40 group-hover:scale-110 transition-transform duration-700" />
                <div className="p-10 pb-6 text-start rtl:text-right relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="inline-block text-[13px] font-bold rounded-full px-4 py-1.5 bg-white text-slate-600 border border-slate-200 uppercase tracking-wider">
                      {card.tag}
                    </span>
                    <span className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-sm">
                      <Icon size={24} />
                    </span>
                  </div>
                  <h3 className="text-[1.5rem] font-heading font-black text-slate-900 mb-4 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-[15px] mb-8">{card.desc}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[2.5rem] font-heading font-black text-blue-600 tabular-nums leading-none">{card.stat}</span>
                    <span className="text-[15px] font-bold text-slate-500 uppercase tracking-wide">{card.statLabel}</span>
                  </div>
                </div>
                <div className="h-56 mt-auto px-6 pb-6 relative z-10" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                          <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="m"
                        tickFormatter={smallMonthLabel}
                        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                        dy={5}
                      />
                      <YAxis hide domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                      <Area
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={3}
                        fill={`url(#${gradId})`}
                        dot={{ r: 5, fill: "#fff", strokeWidth: 2, stroke: color }}
                        activeDot={{ r: 7, fill: color, stroke: "#fff", strokeWidth: 2 }}
                      >
                        <LabelList
                          dataKey="v"
                          position="top"
                          offset={12}
                          formatter={(v: number) => idx === 0 ? v.toFixed(1) : v.toLocaleString()}
                          style={{ fontSize: 13, fontWeight: 800, fill: color }}
                        />
                      </Area>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-[13px] text-slate-400 font-bold mt-16 uppercase tracking-wider"
        >
          {t.note}
        </motion.p>
      </div>
    </section>
  );
}
