import { useLanguage } from "@/lib/i18n";

export function ProductShowcase() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      badge: "Real App Interface",
      title: "Built for clarity.",
      subtitle: "See exactly what you and your team will use every day. Clean, intuitive, and designed specifically for the Saudi market.",
      screens: [
        { src: "/images/94697_1783520815575.jpeg", alt: "Biometric Check-in", caption: "Fast biometric check-in" },
        { src: "/images/94701_1783520815576.jpeg", alt: "Employee Dashboard", caption: "Employee dashboard" },
        { src: "/images/94703_1783520815576.jpeg", alt: "Journey Timeline", caption: "Journey & Rewards" },
        { src: "/images/94704_1783520815577.jpeg", alt: "Attendance Control", caption: "Attendance overview" },
        { src: "/images/94705_1783520815578.jpeg", alt: "AI Assistant Chat", caption: "AI self-service chat" },
        { src: "/images/94690_1783520815570.jpeg", alt: "Company Setup", caption: "Company setup" },
      ]
    },
    ar: {
      badge: "واجهة التطبيق الفعلية",
      title: "مصمم للوضوح.",
      subtitle: "شاهد بالضبط ما ستستخدمه أنت وفريقك كل يوم. واجهة نظيفة وبديهية ومصممة خصيصاً للسوق السعودي.",
      screens: [
        { src: "/images/94697_1783520815575.jpeg", alt: "تسجيل دخول حيوي", caption: "تسجيل حضور سريع" },
        { src: "/images/94701_1783520815576.jpeg", alt: "لوحة تحكم الموظف", caption: "لوحة تحكم الموظف" },
        { src: "/images/94703_1783520815576.jpeg", alt: "الرحلة والمكافآت", caption: "الرحلة والمكافآت" },
        { src: "/images/94704_1783520815577.jpeg", alt: "لوحة الحضور", caption: "نظرة عامة على الحضور" },
        { src: "/images/94705_1783520815578.jpeg", alt: "محادثة المساعد الذكي", caption: "مساعد ذكي للخدمة الذاتية" },
        { src: "/images/94690_1783520815570.jpeg", alt: "إعداد الشركة", caption: "إعداد ملف الشركة" },
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden border-y border-slate-200">
      <div className="container mx-auto px-4 mb-16 text-center">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm border border-blue-200 shadow-sm">
          {t.badge}
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 mb-6">
          {t.title}
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* Horizontal scrolling gallery */}
      <div className="relative w-full max-w-[100vw]">
        {/* Gradient fades for smooth edges */}
        <div className="absolute top-0 bottom-0 left-0 w-8 md:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 md:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
        
        <div className="flex overflow-x-auto gap-6 md:gap-8 pb-10 px-8 md:px-32 snap-x snap-mandatory scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
          {t.screens.map((screen, idx) => (
            <div 
              key={idx} 
              className="relative shrink-0 snap-center flex flex-col items-center group"
            >
              {/* Phone frame mockup */}
              <div className="w-[280px] h-[580px] rounded-[40px] bg-slate-900 p-2.5 shadow-2xl relative border border-slate-300 transform transition-transform duration-500 group-hover:-translate-y-4">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
                  <div className="w-32 h-6 bg-slate-900 rounded-b-3xl"></div>
                </div>
                {/* Screen content */}
                <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                  {/* Using standard img tags since images will be in public/images */}
                  <img 
                    src={screen.src} 
                    alt={screen.alt} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              
              <div className="mt-6 font-semibold text-slate-700 text-center transition-opacity duration-300 opacity-70 group-hover:opacity-100">
                {screen.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
