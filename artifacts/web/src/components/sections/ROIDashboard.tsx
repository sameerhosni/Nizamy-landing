import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Wallet, LineChart } from "lucide-react";

export function ROIDashboard() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "Live ROI Dashboard",
      titlePart1: "Watch your return ",
      titlePart2: "grow in real time.",
      subtitle:
        "Every riyal saved and every reward earned is tracked automatically — with a clear monthly and yearly view of exactly where your return comes from.",
      stats: [
        { icon: TrendingUp, label: "Monthly & yearly return path with goals and bonuses" },
        { icon: Wallet, label: "Full breakdown: lateness saved, idle salaries recovered, admin hours cut" },
        { icon: LineChart, label: "A personal ROI calculator every manager can use themselves" },
      ],
      images: [
        { src: "/images/roi-yearly-progress.png", alt: "Yearly return path tracker with monthly milestones" },
        { src: "/images/roi-dashboard.png", alt: "Investment return dashboard showing net monthly ROI" },
      ],
    },
    ar: {
      eyebrow: "لوحة عائد حية",
      titlePart1: "شاهد عائدك ",
      titlePart2: "ينمو في الوقت الفعلي.",
      subtitle:
        "كل ريال يُوفَّر وكل مكافأة تُكتسب تُرصد تلقائياً — مع عرض واضح شهرياً وسنوياً لمصدر كل ريال من عائدك بالضبط.",
      stats: [
        { icon: TrendingUp, label: "مسار عائد شهري وسنوي مع أهداف ومكافآت" },
        { icon: Wallet, label: "تفصيل كامل: وقت التأخير الموفر، الرواتب الوهمية المستردة، الساعات الإدارية الموفرة" },
        { icon: LineChart, label: "حاسبة عائد شخصية يمكن لكل مدير استخدامها بنفسه" },
      ],
      images: [
        { src: "/images/roi-yearly-progress.png", alt: "مسار العائد السنوي مع أهداف شهرية" },
        { src: "/images/roi-dashboard.png", alt: "لوحة عائد الاستثمار الشهري مع تفصيل مصدره" },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="py-24 sm:py-32 scroll-mt-16 overflow-hidden relative" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Text */}
          <div className={`space-y-8 ${isRtl ? "md:order-2 text-right" : "md:order-1"}`}>
            <div>
              <span className="inline-block text-xs font-bold text-blue-300 bg-blue-900/60 border border-blue-700/50 rounded-full px-4 py-1.5 mb-6 tracking-wider uppercase">
                {t.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-[1.1]">
                <span className="text-white">{t.titlePart1}</span>
                <span className="text-blue-400">{t.titlePart2}</span>
              </h2>
            </div>
            <p className="text-base text-blue-100/60 leading-relaxed font-medium max-w-lg">
              {t.subtitle}
            </p>
            <ul className="space-y-5">
              {t.stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <li key={idx} className="flex items-start gap-4 rtl:flex-row-reverse">
                    <span className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-blue-400" />
                    </span>
                    <span className="text-blue-100/70 font-medium leading-snug pt-1">{stat.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Phone mockups */}
          <div className={`relative flex items-center justify-center ${isRtl ? "md:order-1" : "md:order-2"}`}>
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 50% 40%, rgba(96,165,250,0.25), transparent 65%)" }} />
            <div className="relative flex items-end justify-center gap-0">
              {t.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-[32px] bg-slate-900 p-[7px] transition-transform duration-500 hover:-translate-y-2 ${
                    idx === 0
                      ? "w-[165px] h-[345px] sm:w-[185px] sm:h-[385px] rotate-[-4deg] z-10"
                      : "w-[165px] h-[345px] sm:w-[185px] sm:h-[385px] rotate-[4deg] mt-10 z-0 -ms-6"
                  }`}
                  style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)" }}
                >
                  <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                    <div className="w-24 h-4 bg-slate-900 rounded-b-2xl" />
                  </div>
                  <div className="w-full h-full rounded-[26px] overflow-hidden">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
