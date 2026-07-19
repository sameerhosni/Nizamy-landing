import { useLanguage } from "@/lib/i18n";

export function ReturnModel() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: "Return on Investment",
      title: "You're not paying a subscription…",
      titleAccent: "you're investing in an asset",
      titleEnd: " that returns value every month.",
      subhead: "In Nizamy, the more your team's commitment improves and their wasted time decreases, the more subscription value you recover — automatically. For the first time, you can measure the return on every riyal you spend managing your team's performance.",
      clarifier: "The 30% return is a combination of subscription credit, funded rewards value for your team, and the measurable value of time saved through better performance.",
      layers: [
        {
          num: "01",
          title: "90% commitment = 15% back",
          desc: "When your team's commitment rate rises, subscription credit is returned to you automatically — scaling up to 30% for teams that hit 100% compliance.",
        },
        {
          num: "02",
          title: "Higher productivity = real added revenue",
          desc: "A 50-employee client eliminated SAR 120,000 in annual waste — 4× their subscription cost. A 20% productivity lift adds thousands in revenue without a single new hire.",
        },
        {
          num: "03",
          title: "Early alerts protect your revenue",
          desc: "Catching performance dips early prevents project delays — saving SAR 50,000+ in penalties and lost clients that you'd never have seen coming.",
        },
      ],
    },
    ar: {
      eyebrow: "العائد على الاستثمار",
      title: "لا تدفع اشتراكًا…",
      titleAccent: "بل تستثمر في أصل",
      titleEnd: " يعود عليك كل شهر.",
      subhead: "في نظامي، كلما تحسّن التزام فريقك وقل هدر وقتهم، استرددت جزءًا من اشتراكك تلقائيًا. ولأول مرة يمكنك قياس العائد على كل ريال تنفقه على إدارة أداء موظفيك.",
      clarifier: "عائد الـ30% مزيج من رصيد اشتراك، وقيمة مكافآت ممولة لفريقك، وقيمة الوقت المتوفر من تحسّن الأداء قابلة للقياس.",
      layers: [
        {
          num: "٠١",
          title: "التزام 90% = استرداد 15%",
          desc: "كلما ارتفع معدل التزام فريقك، عادت إليك نسبة من الاشتراك تلقائيًا — وترتفع حتى 30% عند بلوغ الفريق 100% التزام.",
        },
        {
          num: "٠٢",
          title: "إنتاجية أعلى = إيرادات إضافية حقيقية",
          desc: "عميل بـ50 موظفًا وفّر 120 ألف ريال سنويًا من الهدر — ما يعادل 4 أضعاف قيمة اشتراكه. زيادة الإنتاجية 20% تضيف آلاف الريالات دون توظيف جديد.",
        },
        {
          num: "٠٣",
          title: "تنبيهات مبكرة تحمي إيراداتك",
          desc: "اكتشاف انخفاض الأداء مبكرًا يمنع تأخير المشاريع — ويوفر 50 ألف ريال أو أكثر من الغرامات وخسارة العملاء.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section
      id="return-model"
      className="py-24 sm:py-32 scroll-mt-16 overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2044 50%, #0a1628 100%)" }}
    >
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-bold text-blue-300 bg-blue-900/60 border border-blue-700/50 rounded-full px-4 py-1.5 mb-6 tracking-wider uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-[1.1] mb-6">
            <span className="text-white">{t.title}</span>
            <br />
            <span className="text-blue-400">{t.titleAccent}</span>
            <span className="text-white">{t.titleEnd}</span>
          </h2>
          <p className="text-lg text-blue-100/60 leading-relaxed font-medium max-w-2xl mx-auto">
            {t.subhead}
          </p>
        </div>

        {/* Three steps */}
        <div className="max-w-4xl mx-auto space-y-0">
          {t.layers.map((layer, idx) => (
            <div
              key={idx}
              className="grid sm:grid-cols-[120px_1fr] gap-4 sm:gap-8 items-start py-10 border-t border-white/8 first:border-t-0 group"
            >
              {/* Big number */}
              <div className="text-6xl sm:text-7xl font-heading font-black text-white/10 group-hover:text-white/20 transition-colors duration-500 leading-none shrink-0 text-start">
                {layer.num}
              </div>
              {/* Content */}
              <div className="pt-1">
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white mb-3">
                  {layer.title}
                </h3>
                <p className="text-base text-blue-100/60 leading-relaxed font-medium max-w-xl">
                  {layer.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clarifier note */}
        <div className="max-w-2xl mx-auto mt-16 pt-10 border-t border-white/8">
          <p className="text-sm text-blue-200/40 text-center leading-relaxed font-medium">
            {t.clarifier}
          </p>
        </div>
      </div>
    </section>
  );
}
