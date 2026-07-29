export function DeepNavy() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0A1628] text-white font-sans antialiased">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A1628]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-xl tracking-tight text-white">نظامي</div>
                <div className="text-[10px] font-bold text-cyan-400 tracking-wider -mt-0.5">NIZAMY HR</div>
              </div>
            </div>

            {/* CTA */}
            <button className="h-12 px-8 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold text-sm shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300 relative group overflow-hidden">
              <span className="relative z-10">احجز عرضًا توضيحيًا</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-transparent blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-700/20 via-cyan-500/15 to-transparent blur-3xl animate-pulse delay-700" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Eyebrow */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-cyan-500/10 px-6 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse" />
                <span className="text-sm font-bold text-cyan-300 tracking-wide">نظام موارد بشرية بالذكاء الاصطناعي</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-center mb-8">
              <div className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-4">
                <span className="text-white">كل أنظمة الموارد البشرية</span>
                <br />
                <span className="text-white">تكلفك… </span>
                <span className="bg-gradient-to-l from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                  نظامي يوفر لك
                </span>
              </div>
              <div className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight bg-gradient-to-l from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                حتى 30% من اشتراكك.
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-center text-xl lg:text-2xl text-slate-300 leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
              كل ساعة توفرها. كل خطأ تتجنبه. كل موظف يلتزم أكثر. كلها ترجع كقيمة حقيقية لمنشأتك.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="w-full sm:w-auto h-16 px-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold text-lg shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:shadow-[0_0_70px_rgba(6,182,212,0.8)] hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  احجز عرضًا توضيحيًا
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </button>
              <button className="w-full sm:w-auto h-16 px-12 rounded-full border-2 border-cyan-400/40 text-cyan-300 font-bold text-lg hover:bg-cyan-400/10 hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-300 backdrop-blur-sm">
                احسب العائد المتوقع لمنشأتك
              </button>
            </div>

            {/* App Store Badges - Coming Soon */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative group cursor-not-allowed">
                <div className="w-48 h-16 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center gap-3 px-5 opacity-60">
                  <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                  </svg>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-white/70">قريبًا على</div>
                    <div className="text-base font-black text-white -mt-0.5">App Store</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">قريبًا</div>
              </div>
              <div className="relative group cursor-not-allowed">
                <div className="w-48 h-16 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center gap-3 px-5 opacity-60">
                  <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-white/70">قريبًا على</div>
                    <div className="text-base font-black text-white -mt-0.5">Google Play</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">قريبًا</div>
              </div>
            </div>
          </div>

          {/* Value Highlights Grid */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <h3 className="font-black text-xl text-white mb-3 leading-tight">أوقف الهدر قبل ما يكلّفك</h3>
                <p className="text-sm text-slate-400 leading-relaxed">ارصد أين يضيع وقت فريقك وجُهده قبل أن يتحول إلى خسارة مالية تراكمية.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-400/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-black text-xl text-white mb-3 leading-tight">فريق محفّز… أداء أعلى</h3>
                <p className="text-sm text-slate-400 leading-relaxed">نظام مكافآت مرن يربط الالتزام بالإنجاز، فيتحول السلوك اليومي إلى نتائج قابلة للقياس.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-400/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-black text-xl text-white mb-3 leading-tight">قراراتك بالأرقام، لا بالتخمين</h3>
                <p className="text-sm text-slate-400 leading-relaxed">بيانات لحظية عن الحضور والالتزام والإنتاجية تمنحك رؤية تشغيلية كاملة لشركتك.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-black text-xl text-white mb-3 leading-tight">استرجع حتى 30% من اشتراكك</h3>
                <p className="text-sm text-slate-400 leading-relaxed">كلما زاد التزام فريقك وتحسّن أداؤهم على المنصة، انخفضت تكلفة اشتراكك من خلال نموذج العائد السنوي الحصري.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-20 border-y border-white/10">
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-white/10">
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center pt-8 lg:pt-0 first:pt-0 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all duration-300">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-6xl font-black mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent tabular-nums">٠</div>
              <p className="text-sm font-bold text-slate-400 max-w-[160px]">نظام تحفيزي بدون غرامات</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center pt-8 lg:pt-0 first:pt-0 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-6xl font-black mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent tabular-nums">٣ ر.س</div>
              <p className="text-sm font-bold text-slate-400 max-w-[180px]">يبدأ من ٣ ريال شهرياً للموظف</p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center pt-8 lg:pt-0 first:pt-0 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">دقيقة واحدة</div>
              <p className="text-sm font-bold text-slate-400 max-w-[180px]">حتى أول حضور وانصراف موثّق</p>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center text-center pt-8 lg:pt-0 first:pt-0 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-400/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300">
                <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-6xl font-black mb-4 bg-gradient-to-b from-cyan-300 to-blue-500 bg-clip-text text-transparent tabular-nums">30%</div>
              <p className="text-sm font-bold text-slate-400 max-w-[200px]">توفير سنوي حتى 30% من قيمة الاشتراك السنوي</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 left-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-transparent blur-3xl" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 mb-8">
              <span className="text-xs font-bold text-cyan-300 tracking-wider uppercase">نظام موارد بشرية متكامل</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              <span className="text-white">كل احتياجات الـ HR في منصة واحدة. </span>
              <span className="bg-gradient-to-l from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">كل شيء يعمل معًا، ببساطة.</span>
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-10 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:via-transparent group-hover:to-blue-600/10 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300">
                  <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">خدمات ذاتية ذكية</h3>
                <p className="text-base text-slate-400 leading-relaxed">طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-10 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:via-transparent group-hover:to-blue-600/10 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300">
                  <svg className="w-8 h-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">تسجيل حضور بيومتري</h3>
                <p className="text-base text-slate-400 leading-relaxed">يسجّل الموظف حضوره بالبصمة أو الوجه أو الصوت — دقيق ويصعب التلاعب به.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-10 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:via-transparent group-hover:to-blue-600/10 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300">
                  <svg className="w-8 h-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">تفاعل الموظفين عبر المكافآت والحوافز</h3>
                <p className="text-base text-slate-400 leading-relaxed">مكافآت وحوافز ذكية تحافظ على التزام فريقك وتحوّل الأداء اليومي إلى دافع حقيقي.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-10 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:via-transparent group-hover:to-blue-600/10 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300">
                  <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">محرك تقارير بالذكاء الاصطناعي</h3>
                <p className="text-base text-slate-400 leading-relaxed">تقارير عميقة يولّدها الذكاء الاصطناعي تكشف لك ما لا تظهره الجداول — فوراً.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-10 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:via-transparent group-hover:to-blue-600/10 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300">
                  <svg className="w-8 h-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">تهيئة ذاتية بدون أي خبرة تقنية</h3>
                <p className="text-base text-slate-400 leading-relaxed">فريقك يبدأ بنفسه من اليوم الأول — بدون تدريب وبدون أي خلفية تقنية.</p>
              </div>
            </div>

            {/* Feature 6 - Compliance */}
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-10 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/10 group-hover:via-transparent group-hover:to-blue-600/10 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 border border-emerald-400/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300">
                  <svg className="w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">متوافق مع أنظمة العمل السعودية</h3>
                <p className="text-base text-slate-400 leading-relaxed">سياسات وإجازات وقواعد حضور متوافقة مع نظام العمل السعودي من اليوم الأول.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
