export function RefinedBlue() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative overflow-hidden">
      {/* Sophisticated mesh background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-blue-600/15 via-indigo-400/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} 
      />

      <div className="relative z-10">
        {/* Premium Navigation */}
        <nav className="border-b border-white/60 backdrop-blur-xl bg-white/70 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                  <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-black text-xl tracking-tight bg-gradient-to-l from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                    نظامي اتش آر
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 -mt-0.5">Nizamy HR</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-white/60">
                  تواصل معنا
                </button>
                <button className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-l from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105">
                  احجز عرضًا توضيحيًا
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section with Enhanced Glassmorphism */}
        <section className="pt-24 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-l from-blue-600/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-200/60 px-5 py-2.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse shadow-lg shadow-blue-400/50" />
                  <span className="text-sm font-black text-blue-700">نظام موارد بشرية بالذكاء الاصطناعي</span>
                </div>

                {/* Headline with Gradient */}
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
                  <span className="text-slate-900">كل أنظمة الموارد البشرية تكلفك… </span>
                  <span className="bg-gradient-to-l from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent inline-block mt-2">
                    نظامي يوفر لك حتى 30% من اشتراكك.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
                  كل ساعة توفرها. كل خطأ تتجنبه. كل موظف يلتزم أكثر. كلها ترجع كقيمة حقيقية لمنشأتك.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-l from-blue-600 to-blue-500 rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-105 flex items-center gap-3 group">
                    احجز عرضًا توضيحيًا
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l-5 5 5 5" />
                    </svg>
                  </button>
                  <button className="px-8 py-4 text-lg font-bold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white transition-all hover:scale-105">
                    احسب العائد المتوقع لمنشأتك
                  </button>
                </div>

                {/* Coming Soon App Store Badges */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-l from-blue-600/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-12 px-5 bg-slate-900 rounded-xl flex items-center gap-3 border border-slate-800 opacity-60">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-right">
                        <div className="text-[9px] text-slate-400 font-bold">قريبًا على</div>
                        <div className="text-sm font-black text-white -mt-0.5">App Store</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-l from-blue-600/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-12 px-5 bg-slate-900 rounded-xl flex items-center gap-3 border border-slate-800 opacity-60">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-right">
                        <div className="text-[9px] text-slate-400 font-bold">قريبًا على</div>
                        <div className="text-sm font-black text-white -mt-0.5">Google Play</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Side - Premium Rewards Card */}
              <div className="relative lg:mr-auto">
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-blue-600/20 rounded-[3rem] blur-3xl" />
                
                {/* Main rewards card with glassmorphism */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 rounded-[2.5rem] backdrop-blur-2xl border border-white/80 shadow-2xl" />
                  <div className="relative rounded-[2.5rem] bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-2xl border border-white shadow-2xl p-8 transform rotate-2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
                        <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base font-black text-slate-900">مكافآت حقيقية لفريقك</div>
                        <div className="text-sm font-bold text-slate-500">قسائم من علاماتهم المفضلة</div>
                      </div>
                    </div>

                    {/* Brand cards grid */}
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {[
                        { name: 'noon', bg: 'bg-gradient-to-br from-yellow-300 to-yellow-400', rotate: '-rotate-3' },
                        { name: 'HungerStation', bg: 'bg-gradient-to-br from-yellow-400 to-amber-400', rotate: 'rotate-2' },
                        { name: 'Amazon', bg: 'bg-gradient-to-br from-slate-50 to-white', rotate: '-rotate-2' },
                        { name: 'Jarir', bg: 'bg-gradient-to-br from-rose-50 to-pink-50', rotate: 'rotate-3' },
                      ].map((brand, i) => (
                        <div key={i} className={`aspect-square rounded-2xl ${brand.bg} border border-white/60 shadow-lg flex items-center justify-center transform ${brand.rotate} backdrop-blur-sm relative overflow-hidden group hover:scale-110 transition-transform`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                          <div className="w-full h-full flex items-center justify-center p-3">
                            <div className="w-full h-full bg-slate-200/40 rounded-xl" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                      <span className="text-xs font-black text-slate-500">وأكثر من 400 علامة أخرى</span>
                      <span className="px-3 py-1.5 rounded-full bg-gradient-to-l from-amber-400 to-orange-400 text-white text-xs font-black shadow-lg shadow-amber-500/30">
                        تلقائيًا
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Value Highlights with Enhanced Glassmorphism */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-20">
              {[
                {
                  title: "أوقف الهدر قبل ما يكلّفك",
                  desc: "ارصد أين يضيع وقت فريقك وجُهده قبل أن يتحول إلى خسارة مالية تراكمية.",
                  icon: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                },
                {
                  title: "فريق محفّز… أداء أعلى",
                  desc: "نظام مكافآت مرن يربط الالتزام بالإنجاز، فيتحول السلوك اليومي إلى نتائج قابلة للقياس.",
                  icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                },
                {
                  title: "قراراتك بالأرقام، لا بالتخمين",
                  desc: "بيانات لحظية عن الحضور والالتزام والإنتاجية تمنحك رؤية تشغيلية كاملة لشركتك.",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                },
                {
                  title: "استرجع حتى 30% من اشتراكك",
                  desc: "كلما زاد التزام فريقك وتحسّن أداؤهم على المنصة، انخفضت تكلفة اشتراكك من خلال نموذج العائد السنوي الحصري.",
                  icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                }
              ].map((item, i) => (
                <div key={i} className="group relative">
                  {/* Hover glow */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl p-7 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-200/60 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-300">
                      <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mb-3 leading-snug">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Stats Bar with Glassmorphism */}
        <section className="py-16 border-y border-white/60 backdrop-blur-xl bg-white/50 shadow-sm relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "٠", label: "نظام تحفيزي بدون غرامات", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
                { value: "٣ ر.س", label: "يبدأ من ٣ ريال شهرياً للموظف", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { value: "دقيقة واحدة", label: "حتى أول حضور وانصراف موثّق", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                { value: "30%", label: "توفير سنوي حتى 30% من قيمة الاشتراك السنوي", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-200/60 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300">
                    <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                  <div className="text-5xl font-black bg-gradient-to-l from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent mb-3 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-600 leading-snug max-w-[200px]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Preview Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-l from-blue-600/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-200/60 text-sm font-black text-blue-700 mb-6">
                نظام موارد بشرية متكامل
              </div>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight mb-4">
                <span className="text-slate-900">كل احتياجات الـ HR في منصة واحدة. </span>
                <span className="bg-gradient-to-l from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  كل شيء يعمل معًا، ببساطة.
                </span>
              </h2>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "خدمات ذاتية ذكية",
                  desc: "طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي.",
                  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  title: "تسجيل حضور بيومتري",
                  desc: "يسجّل الموظف حضوره بالبصمة أو الوجه أو الصوت — دقيق ويصعب التلاعب به.",
                  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  gradient: "from-indigo-500 to-blue-500"
                },
                {
                  title: "تفاعل الموظفين عبر المكافآت",
                  desc: "مكافآت وحوافز ذكية تحافظ على التزام فريقك وتحوّل الأداء اليومي إلى دافع حقيقي.",
                  icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
                  gradient: "from-amber-500 to-orange-500"
                }
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  {/* Animated gradient border */}
                  <div className={`absolute -inset-[1px] bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`} />
                  
                  {/* Card */}
                  <div className="relative h-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl p-8 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}>
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                      </svg>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mb-4 leading-snug">{feature.title}</h3>
                    <p className="text-base text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
