import React from "react";

/**
 * WarmAiry — Nizamy HR Theme Exploration
 * 
 * AESTHETIC DIRECTION:
 * - Layout Paradigm: Generous whitespace with organic flow
 * - Mood: Warm Saudi-modern — professional yet approachable
 * - Palette: Soft sand/cream backgrounds (#FAF7F2, #FFF9F0) with blue brand anchor (#2563EB) + warm amber/gold accents (#F59E0B, #D97706)
 * - Typography: Plus Jakarta Sans (friendly rounded sans) paired with space for breathing
 * - Depth: Subtle warm shadows, soft rounded corners (24px+), gentle gradients
 * - Motion: Soft easing, gentle reveals
 * 
 * This theme explores a warmer, more humanistic take on Nizamy — echoing Saudi hospitality
 * and warmth while maintaining professional credibility through precision and clarity.
 */

export function WarmAiry() {
  const [activeFeature, setActiveFeature] = React.useState(0);

  const features = [
    {
      title: "خدمات ذاتية ذكية",
      desc: "طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي.",
      icon: "📅"
    },
    {
      title: "تسجيل حضور بيومتري",
      desc: "يسجّل الموظف حضوره بالبصمة أو الوجه أو الصوت — دقيق ويصعب التلاعب به.",
      icon: "✓"
    },
    {
      title: "تفاعل الموظفين عبر المكافآت",
      desc: "مكافآت وحوافز ذكية تحافظ على التزام فريقك وتحوّل الأداء اليومي إلى دافع حقيقي.",
      icon: "🎁"
    },
    {
      title: "محرك تقارير بالذكاء الاصطناعي",
      desc: "تقارير عميقة يولّدها الذكاء الاصطناعي تكشف لك ما لا تظهره الجداول — فوراً.",
      icon: "📊"
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF7F2] font-sans" style={{ fontFamily: 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Warm grain texture */
        .warm-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-amber-100/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-600/25">
              ن
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-[19px] text-slate-900 tracking-tight">نظامي HR</span>
              <span className="text-[11px] font-bold text-amber-600">أول نظام سعودي بالذكاء الاصطناعي</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-bold">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">المميزات</a>
            <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">الأسعار</a>
            <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">عن نظامي</a>
          </div>
          
          <button className="px-6 py-2.5 rounded-full bg-gradient-to-l from-blue-600 to-blue-500 text-white font-bold text-[15px] shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all hover:scale-[1.02]">
            احجز عرضًا توضيحيًا
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Warm organic background shapes */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-100/40 to-orange-50/30 blur-3xl" />
        <div className="absolute top-40 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/30 to-cyan-50/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-50/40 to-orange-100/20 blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto lg:mx-0">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(251,146,60,0.12)] border border-amber-100 px-5 py-2.5 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-br from-amber-400 to-orange-500"></span>
              </span>
              <span className="text-[14px] font-black text-slate-900">نظام موارد بشرية بالذكاء الاصطناعي</span>
            </div>

            {/* Headline */}
            <h1 className="text-[3rem] sm:text-[3.75rem] lg:text-[4.5rem] font-black leading-[1.1] tracking-tight mb-8">
              <span className="text-slate-900">كل أنظمة الموارد البشرية تكلفك… </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 via-blue-500 to-cyan-500">
                نظامي يوفر لك حتى 30% من اشتراكك.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[1.3rem] lg:text-[1.5rem] text-slate-600 leading-relaxed font-medium mb-12 max-w-2xl">
              كل ساعة توفرها. كل خطأ تتجنبه. كل موظف يلتزم أكثر. كلها ترجع كقيمة حقيقية لمنشأتك.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <button className="group px-9 py-4 rounded-full bg-gradient-to-l from-blue-600 to-blue-500 text-white font-black text-[17px] shadow-[0_12px_32px_rgba(37,99,235,0.25)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.35)] transition-all hover:scale-[1.02] flex items-center gap-2.5">
                احجز عرضًا توضيحيًا
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="px-9 py-4 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 font-black text-[17px] border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
                احسب العائد المتوقع لمنشأتك
              </button>
            </div>

            {/* App Store Badges - Coming Soon */}
            <div className="flex items-center gap-4">
              <div className="relative px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-dashed border-amber-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold text-slate-400">قريباً على</span>
                  <span className="text-[13px] font-black text-slate-700">App Store</span>
                </div>
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-l from-amber-400 to-orange-400 text-white text-[10px] font-black shadow-lg">قريباً</span>
              </div>
              
              <div className="relative px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-dashed border-amber-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold text-slate-400">قريباً على</span>
                  <span className="text-[13px] font-black text-slate-700">Google Play</span>
                </div>
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-l from-amber-400 to-orange-400 text-white text-[10px] font-black shadow-lg">قريباً</span>
              </div>
            </div>
          </div>

          {/* Floating rewards card - warm theme variant */}
          <div className="hidden lg:block absolute top-32 left-20 w-[320px] animate-float">
            <div className="relative rounded-[28px] bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 backdrop-blur-xl border-2 border-amber-200/60 shadow-[0_32px_64px_rgba(245,158,11,0.20)] p-6 rotate-2">
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/40">
                🎉
              </div>
              
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/30 text-xl font-black">
                  🎁
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-black text-slate-900 leading-tight mb-0.5">
                    مكافآت حقيقية لفريقك
                  </div>
                  <div className="text-[12px] font-bold text-amber-700">
                    قسائم من علاماتهم المفضلة
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                {["نون", "هنقرستيشن", "أمازون", "جرير"].map((brand, i) => (
                  <div 
                    key={i}
                    className={`aspect-square rounded-[18px] bg-gradient-to-br from-white to-amber-50/40 border-2 border-amber-100 shadow-lg flex items-center justify-center font-black text-slate-700 text-[11px] ${
                      i % 2 === 0 ? '-rotate-2' : 'rotate-2'
                    }`}
                  >
                    {brand}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-amber-100">
                <span className="text-[11px] font-black text-slate-500">وأكثر من 400 علامة أخرى</span>
                <span className="rounded-full bg-gradient-to-l from-amber-400 to-orange-400 text-white text-[11px] font-black px-3 py-1.5 shadow-lg">
                  تلقائيًا ✨
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 bg-white border-y border-amber-100/50 shadow-[0_8px_32px_rgba(251,146,60,0.08)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-amber-100/50">
            {[
              { icon: "○", value: "٠", label: "نظام تحفيزي بدون غرامات" },
              { icon: "﷼", value: "٣ ر.س", label: "يبدأ من ٣ ريال شهرياً للموظف" },
              { icon: "⏱", value: "دقيقة واحدة", label: "حتى أول حضور وانصراف موثّق" },
              { icon: "↗", value: "30%", label: "توفير سنوي حتى 30% من الاشتراك" }
            ].map((stat, i) => (
              <div 
                key={i}
                className="flex flex-col items-center text-center px-4 pt-12 lg:pt-0 first:pt-0 group"
              >
                <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 flex items-center justify-center mb-5 text-3xl font-black group-hover:scale-110 group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-600/25 transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-[15px] font-bold text-slate-500 leading-snug max-w-[180px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Warm background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#FFF9F0] to-[#FAF7F2]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-100/30 to-orange-100/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/20 to-cyan-100/15 blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <span className="inline-block text-[13px] font-black text-blue-600 bg-gradient-to-l from-blue-50 to-cyan-50 border border-blue-100 rounded-full px-6 py-2.5 mb-8 uppercase tracking-wide">
              نظام موارد بشرية متكامل
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.1] tracking-tight">
              <span className="text-slate-900">كل احتياجات الـ HR في منصة واحدة. </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-cyan-500">
                كل شيء يعمل معًا، ببساطة.
              </span>
            </h2>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => setActiveFeature(i)}
                className={`relative warm-grain text-right rounded-[28px] p-8 transition-all duration-300 ${
                  activeFeature === i
                    ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-[0_24px_48px_rgba(37,99,235,0.30)] scale-[1.02]'
                    : 'bg-white/90 backdrop-blur-sm text-slate-900 border-2 border-amber-100/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:border-blue-200 hover:shadow-[0_16px_40px_rgba(37,99,235,0.12)] hover:-translate-y-1'
                }`}
              >
                <div className={`text-5xl mb-6 transition-transform duration-300 ${
                  activeFeature === i ? 'scale-110' : ''
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-[17px] font-black leading-tight mb-3 ${
                  activeFeature === i ? 'text-white' : 'text-slate-900'
                }`}>
                  {feature.title}
                </h3>
                {activeFeature === i && (
                  <p className="text-[13px] font-medium leading-relaxed text-blue-50">
                    {feature.desc}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Active feature large visual placeholder */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative warm-grain rounded-[36px] bg-gradient-to-br from-white via-amber-50/20 to-orange-50/10 border-2 border-amber-100/60 shadow-[0_32px_80px_rgba(245,158,11,0.12)] overflow-hidden min-h-[480px] flex items-center justify-center">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-100/40 to-cyan-100/30 blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/30 blur-3xl" />
              
              {/* Content */}
              <div className="relative z-10 text-center max-w-md">
                <div className="text-8xl mb-6">
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  {features[activeFeature].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
