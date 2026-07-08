import { useLanguage } from "@/lib/i18n";
import { LineChart, Wallet, TrendingUp } from "lucide-react";

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
        { src: "/images/roi-yearly-progress.png", alt: "Yearly return path tracker with monthly milestones and bonuses" },
        { src: "/images/roi-dashboard.png", alt: "Investment return dashboard showing net monthly ROI breakdown" },
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
        { src: "/images/roi-yearly-progress.png", alt: "مسار العائد السنوي مع أهداف شهرية ومكافآت" },
        { src: "/images/roi-dashboard.png", alt: "لوحة عائد الاستثمار الشهري الصافي مع تفصيل مصدره" },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="py-24 bg-blue-950 scroll-mt-16 overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-950/0 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
          <div className="order-2 md:order-none rtl:md:order-2 text-center md:text-start rtl:md:text-right">
            <span className="inline-block text-xs font-bold rounded-full px-4 py-1.5 bg-blue-900 text-blue-200 border border-blue-800 shadow-sm mb-6">
              {t.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 leading-tight">
              <span className="text-white">{t.titlePart1}</span>
              <span className="text-blue-300">{t.titlePart2}</span>
            </h2>
            <p className="text-lg text-blue-100/80 leading-relaxed font-medium mb-10 max-w-lg mx-auto md:mx-0">
              {t.subtitle}
            </p>
            <ul className="space-y-5">
              {t.stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <li
                    key={idx}
                    className="flex items-center gap-4 rtl:flex-row-reverse text-start rtl:text-right max-w-lg mx-auto md:mx-0"
                  >
                    <span className="w-11 h-11 rounded-2xl bg-blue-900 border border-blue-800 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-blue-300" />
                    </span>
                    <span className="text-blue-100 font-medium leading-snug">{stat.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative flex items-center justify-center order-1 md:order-none">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, rgba(96,165,250,0.2), transparent 60%)" }} />
            {t.images.map((img, idx) => (
              <div
                key={idx}
                className={`relative w-[190px] h-[390px] sm:w-[210px] sm:h-[430px] rounded-[32px] bg-slate-900 p-2.5 shadow-2xl border border-blue-900/60 transition-transform duration-500 hover:-translate-y-2 ${
                  idx === 0
                    ? `rotate-[-4deg] -mr-6 rtl:mr-0 rtl:-ml-6 z-10 ${isRtl ? "" : ""}`
                    : "rotate-[4deg] mt-14 z-0"
                }`}
              >
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                  <div className="w-28 h-5 bg-slate-900 rounded-b-2xl" />
                </div>
                <div className="w-full h-full bg-white rounded-[26px] overflow-hidden relative">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
