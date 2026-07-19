import { useLanguage } from "@/lib/i18n";

export function ReturnModel() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: "Return Model",
      title: "Perform well.",
      titleAccent: "Get up to 30% back",
      titleEnd: ", every year.",
      subhead: "No gimmicks, no flat cashback. The better your team performs, the more comes back. Here's exactly where every riyal comes from.",
      clarifier: "What does the 30% mean? A mix of system credit, funded rewards value for your team, and the value of time saved through better performance.",
      layers: [
        {
          num: "01",
          title: "Activate your team",
          desc: "Less lateness, less turnover, more focus — the hours saved accumulate into real money.",
        },
        {
          num: "02",
          title: "Reward performance",
          desc: "Nizamy HR funds rewards for your employees through motivation points — gift cards and exclusive discounts on brands inside and outside Saudi Arabia.",
        },
        {
          num: "03",
          title: "Recover your value",
          desc: "Commitment rises, idle time drops, employees earn reward points to redeem — the benefit returns to you at zero extra cost.",
        },
      ],
    },
    ar: {
      eyebrow: "نموذج العائد",
      title: "الأداء الجيد يعيد إليك",
      titleAccent: "حتى 30%",
      titleEnd: " كل عام.",
      subhead: "بدون حيل أو استرداد ثابت. كلما تحسّن أداء فريقك، زاد ما يعود إليك. إليك بالضبط من أين يأتي كل ريال.",
      clarifier: "وش يعني عائد حتى 30%؟ مزيج من رصيد في النظام، وقيمة مكافآت ممولة لفريقك، وقيمة الوقت المتوفر من تحسّن الأداء.",
      layers: [
        {
          num: "٠١",
          title: "فعّل فريقك",
          desc: "تأخير أقل، تسرب وظيفي أقل، تركيز أكبر — الساعات الموفرة تتراكم لتصبح مالاً حقيقياً.",
        },
        {
          num: "٠٢",
          title: "كافئ الأداء",
          desc: "نظامي اتش آر يمول مكافآت لموظفيك عبر نقاط التحفيز — بطاقات هدايا وخصومات حصرية على علامات تجارية داخل وخارج السعودية.",
        },
        {
          num: "٠٣",
          title: "استرد قيمتك",
          desc: "يزيد الالتزام ويقل الوقت الضائع، ويكتسب الموظفون نقاطاً لاستبدالها — وتعود الفائدة إليك دون تكلفة إضافية.",
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
