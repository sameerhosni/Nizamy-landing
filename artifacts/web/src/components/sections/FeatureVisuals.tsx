import { useEffect, useState } from "react";
import { Gift, Trophy, Medal, Coins, Sparkles, TrendingUp, Check, ChevronLeft, ChevronRight, Zap, ShieldCheck, Search, Wallet, ScanFace } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import noonLogo from "@/assets/brands/noon.png";
import hungerstationLogo from "@/assets/brands/hungerstation.png";
import amazonLogo from "@/assets/brands/amazon.png";
import jarirLogo from "@/assets/brands/jarir.png";
import faceScanSelfie from "@/assets/face-scan-selfie.png";

interface VisualProps {
  language: "en" | "ar";
}

function Glow() {
  return (
    <>
      <div className="absolute -top-10 -start-10 w-56 h-56 rounded-full bg-blue-400/25 blur-3xl" />
      <div className="absolute -bottom-12 -end-8 w-64 h-64 rounded-full bg-amber-300/25 blur-3xl" />
    </>
  );
}

function Avatar({ initials, from, to }: { initials: string; from: string; to: string }) {
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${from} ${to} text-white text-[12px] font-black flex items-center justify-center ring-2 ring-white shadow-md shrink-0`}>
      {initials}
    </div>
  );
}

export function RewardsVisual({ language }: VisualProps) {
  const ar = language === "ar";
  const rows = [
    { initials: ar ? "س" : "S", from: "from-pink-500", to: "to-rose-400", name: ar ? "سارة" : "Sarah", sub: ar ? "التزام 98%" : "98% commitment", val: ar ? "🎁 قسيمة نون" : "🎁 noon voucher", bar: 98, icon: Trophy, iconBg: "bg-amber-400 text-slate-900" },
    { initials: ar ? "خ" : "K", from: "from-blue-500", to: "to-cyan-400", name: ar ? "خالد" : "Khaled", sub: ar ? "إنجاز المهام" : "Tasks done", val: ar ? "🍔 هنقرستيشن" : "🍔 HungerStation", bar: 86, icon: Medal, iconBg: "bg-slate-200 text-slate-600" },
    { initials: ar ? "ن" : "N", from: "from-violet-500", to: "to-purple-400", name: ar ? "نورة" : "Noura", sub: ar ? "حضور مبكر" : "Early check-ins", val: ar ? "🎁 بطاقة أمازون" : "🎁 Amazon card", bar: 74, icon: Coins, iconBg: "bg-orange-100 text-orange-500" },
  ];
  const brands = [
    { logo: noonLogo, alt: "noon", cls: "bg-[#FEEE00] border-[#F0E200]", tilt: "-rotate-3", pad: "p-2" },
    { logo: hungerstationLogo, alt: "HungerStation", cls: "bg-[#FFDD00] border-[#F2D100]", tilt: "rotate-2", pad: "p-1.5" },
    { logo: amazonLogo, alt: "Amazon", cls: "bg-white border-slate-200", tilt: "-rotate-2", pad: "p-2" },
    { logo: jarirLogo, alt: "Jarir", cls: "bg-white border-[#F8C9CC]", tilt: "rotate-3", pad: "p-1.5" },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Glow />
        <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_30px_70px_rgba(15,23,42,0.14)] overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-6 pb-5 text-white relative overflow-hidden">
            <div className="absolute -top-8 -end-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute top-10 -end-2 w-16 h-16 rounded-full bg-white/10" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Gift size={22} />
                </div>
                <div>
                  <div className="text-[16px] font-heading font-black">{ar ? "مكافآت الفريق" : "Team Rewards"}</div>
                  <div className="text-[12px] font-bold text-blue-100">{ar ? "هذا الشهر" : "This month"}</div>
                </div>
              </div>
              <span className="rounded-full bg-amber-400 text-slate-900 text-[12px] font-black px-3.5 py-1.5 shadow-lg shadow-amber-500/30">
                {ar ? "+340 نقطة" : "+340 pts"}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {rows.map((r, i) => (
              <div key={i} className={`rounded-2xl border p-4 transition-all ${i === 0 ? "bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-[0_10px_25px_rgba(245,158,11,0.10)]" : "bg-[#FAFAFA] border-slate-100"}`}>
                <div className="flex items-center gap-3 mb-2.5">
                  <Avatar initials={r.initials} from={r.from} to={r.to} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-black text-slate-800 leading-tight">{r.name}</div>
                    <div className="text-[11.5px] font-bold text-slate-400">{r.sub}</div>
                  </div>
                  <span className={`text-[11px] font-black rounded-full px-2.5 py-1 ${i === 0 ? "bg-amber-400 text-slate-900" : "bg-blue-50 text-blue-600"}`}>{r.val}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${i === 0 ? "bg-gradient-to-r from-amber-400 to-amber-300" : "bg-gradient-to-r from-blue-600 to-blue-400"}`} style={{ width: `${r.bar}%` }} />
                </div>
              </div>
            ))}

            <div className="rounded-2xl border-2 border-amber-100 bg-gradient-to-br from-amber-50/60 to-white p-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-black text-slate-500">🎁 {ar ? "قسائم من علاماتهم المفضلة" : "Vouchers from their favorite brands"}</span>
                <span className="text-[10.5px] font-black text-amber-500">+400</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {brands.map((b, i) => (
                  <div key={i} className={`aspect-square rounded-xl border shadow-sm flex items-center justify-center ${b.pad} ${b.cls} ${b.tilt}`}>
                    <img src={b.logo} alt={b.alt} className="w-full h-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-4 -end-4 rounded-2xl bg-white border border-amber-200 shadow-[0_15px_35px_rgba(245,158,11,0.25)] px-4 py-3 flex items-center gap-2.5 rotate-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center shadow-md">
            <Trophy size={17} />
          </div>
          <div className="text-[12px] font-black text-slate-800 leading-tight">
            {ar ? <>موظف الشهر<br /><span className="text-amber-500 font-bold">يُختار تلقائيًا ✨</span></> : <>Employee of the month<br /><span className="text-amber-500 font-bold">picked automatically ✨</span></>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CountUp({ to, suffix = "", duration = 1.1, start }: { to: number; suffix?: string; duration?: number; start: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) { setVal(0); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / (duration * 1000), 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);
  return <>{val}{suffix}</>;
}

export function AiReportsVisual({ language }: VisualProps) {
  const ar = language === "ar";
  const bars = [42, 58, 50, 72, 64, 88, 96];
  const labels = ar ? ["س", "أ", "ث", "ر", "خ", "ج", "الآن"] : ["M", "T", "W", "T", "F", "S", "Now"];
  const userMsg = ar ? "أعطني تقرير الحضور لهذا الشهر 📊" : "Give me this month's attendance report 📊";
  const msgChars = Array.from(userMsg);

  // 0: typing question, 1: sent + bot analyzing, 2: report card builds, 3: insight bubble, hold → loop
  const [phase, setPhase] = useState(0);
  const [typedLen, setTypedLen] = useState(0);

  useEffect(() => {
    if (phase === 0) {
      if (typedLen < msgChars.length) {
        const t = setTimeout(() => setTypedLen((l) => l + 1), 50);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase(1), 450);
      return () => clearTimeout(t);
    }
    const durations = [0, 1600, 2600, 3400];
    const t = setTimeout(() => {
      if (phase === 3) { setTypedLen(0); setPhase(0); }
      else setPhase((p) => p + 1);
    }, durations[phase]);
    return () => clearTimeout(t);
  }, [phase, typedLen, msgChars.length]);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Glow />
        <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_30px_70px_rgba(15,23,42,0.14)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-4 text-white relative overflow-hidden">
            <div className="absolute -top-10 -end-10 w-36 h-36 rounded-full bg-blue-500/20" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
                  <Sparkles size={19} />
                </div>
                <div>
                  <div className="text-[14.5px] font-heading font-black">{ar ? "محرك التقارير الذكي" : "AI Report Engine"}</div>
                  <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${phase === 1 || phase === 2 ? "bg-cyan-400" : "bg-green-400"} animate-pulse`} />
                    {phase === 1 ? (ar ? "يحلّل البيانات…" : "Analyzing data…") : phase === 2 ? (ar ? "يبني التقرير…" : "Building report…") : (ar ? "جاهز — اسأل أي شيء" : "Ready — ask anything")}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.8 }}
                    className="flex items-center gap-1.5 rounded-full bg-green-400/15 border border-green-400/30 text-green-300 text-[12px] font-black px-3 py-1.5"
                  >
                    <TrendingUp size={13} />
                    +<CountUp to={24} suffix="%" start={phase >= 2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat body */}
          <div className="p-5 space-y-3 bg-[#FAFAFA] h-[400px] overflow-hidden flex flex-col justify-end">
            {/* user question */}
            {phase >= 1 && (
              <motion.div {...bubbleIn} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-ee-md bg-blue-600 text-white px-4 py-3 text-[13px] font-bold leading-relaxed shadow-md shadow-blue-600/15">
                  {userMsg}
                </div>
              </motion.div>
            )}

            {/* analyzing dots */}
            {phase === 1 && <TypingDots />}

            {/* report card */}
            {phase >= 2 && (
              <motion.div {...bubbleIn} className="flex justify-start">
                <div className="w-[92%] rounded-2xl rounded-ss-md bg-white border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11.5px] font-black text-slate-800">{ar ? "الحضور — آخر 7 أيام" : "Attendance — last 7 days"}</span>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                      <CountUp to={96} suffix="%" start={phase >= 2} />
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-24 mb-1.5">
                    {bars.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end h-full">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.34, 1.4, 0.44, 1] }}
                          className={`w-full rounded-t-md ${i === bars.length - 1 ? "bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_16px_rgba(37,99,235,0.4)]" : "bg-gradient-to-t from-blue-200 to-blue-100"}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-1.5">
                    {labels.map((l, i) => (
                      <span key={i} className={`flex-1 text-center text-[9.5px] font-black ${i === labels.length - 1 ? "text-blue-600" : "text-slate-300"}`}>{l}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* insight bubble */}
            {phase >= 3 && (
              <motion.div {...bubbleIn} className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl rounded-ss-md bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100 px-4 py-3 flex gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                    <Zap size={15} />
                  </div>
                  <div className="text-[12.5px] font-bold text-slate-700 leading-relaxed">
                    {ar
                      ? "ارتفع الالتزام 24% بعد تفعيل المكافآت — الفريق الأعلى أداءً: المبيعات 🏆"
                      : "Commitment rose 24% after rewards launch — top team: Sales 🏆"}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Input bar with live typing */}
            <div className="mt-1 rounded-2xl bg-white border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="flex-1 text-[12.5px] font-bold text-slate-700 min-h-[18px] truncate">
                {phase === 0 ? (
                  <>
                    {msgChars.slice(0, typedLen).join("")}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-[2px] h-[14px] bg-blue-600 align-middle ms-0.5"
                    />
                  </>
                ) : (
                  <span className="text-slate-300">{ar ? "اسأل عن أي تقرير…" : "Ask for any report…"}</span>
                )}
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${phase === 0 && typedLen > 0 ? "bg-blue-600 shadow-blue-600/25" : "bg-slate-300"}`}>
                <Sparkles size={15} />
              </div>
            </div>
          </div>
        </div>

        {/* floating stat badge */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -bottom-4 -start-4 rounded-2xl bg-white border border-slate-100 shadow-[0_15px_35px_rgba(15,23,42,0.15)] px-4 py-3"
            >
              <div className="text-[11px] font-bold text-slate-400 mb-0.5">{ar ? "الحضور اليوم" : "Attendance today"}</div>
              <div className="text-xl font-heading font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                <CountUp to={96} suffix="%" start={phase >= 3} duration={0.9} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function OnboardingVisual({ language }: VisualProps) {
  const ar = language === "ar";
  const Chevron = ar ? ChevronLeft : ChevronRight;
  const steps: { label: string; sub: string; state: "done" | "active" | "next" }[] = [
    { label: ar ? "أنشئ حساب منشأتك" : "Create your company account", sub: ar ? "تم خلال 40 ثانية" : "Done in 40 seconds", state: "done" },
    { label: ar ? "أضف موظفيك" : "Add your employees", sub: ar ? "استيراد تلقائي من Excel" : "Auto-import from Excel", state: "done" },
    { label: ar ? "فعّل البصمة والحضور" : "Activate biometric check-in", sub: ar ? "جارٍ الإعداد الآن…" : "Setting up now…", state: "active" },
    { label: ar ? "شغّل المكافآت الذكية" : "Turn on smart rewards", sub: ar ? "خطوة واحدة متبقية" : "One step away", state: "next" },
  ];
  const progress = 65;
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Glow />
        <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_30px_70px_rgba(15,23,42,0.14)] overflow-hidden">
          {/* App window chrome */}
          <div className="bg-slate-900 px-5 py-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="ms-3 text-[11px] font-bold text-slate-400 tracking-wide">app.nizamy.com</span>
          </div>

          {/* Progress header */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <div className="text-[15px] font-heading font-black text-slate-900">
                  {ar ? "إعداد منشأتك" : "Set up your company"}
                </div>
                <div className="text-[11.5px] font-bold text-slate-400">
                  {ar ? "النظام يرشدك خطوة بخطوة" : "The system guides you step by step"}
                </div>
              </div>
              <div className="text-end">
                <div className="text-lg font-heading font-black text-blue-600 leading-none">{progress}%</div>
                <div className="text-[10.5px] font-bold text-slate-400">{ar ? "مكتمل" : "complete"}</div>
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 relative" style={{ width: `${progress}%` }}>
                <div className="absolute inset-0 bg-white/25 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Step timeline */}
          <div className="px-6 py-5">
            <div className="relative">
              <div className="absolute top-2 bottom-2 start-[15px] w-0.5 bg-slate-100" />
              <div className="space-y-1">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`relative flex items-center gap-4 rounded-2xl p-3 ${
                      s.state === "active" ? "bg-blue-50/80 border border-blue-200 shadow-[0_8px_20px_rgba(37,99,235,0.10)]" : ""
                    }`}
                  >
                    {s.state === "done" ? (
                      <div className="relative z-10 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 ring-4 ring-white">
                        <Check size={14} strokeWidth={3.5} />
                      </div>
                    ) : s.state === "active" ? (
                      <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ring-4 ring-blue-100">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
                        <span className="w-2 h-2 rounded-full bg-white relative" />
                      </div>
                    ) : (
                      <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center shrink-0 ring-4 ring-white text-[12px] font-black">
                        {i + 1}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-black leading-tight ${s.state === "next" ? "text-slate-400" : "text-slate-800"}`}>{s.label}</div>
                      <div className={`text-[11px] font-bold ${s.state === "active" ? "text-blue-600" : "text-slate-400"}`}>{s.sub}</div>
                    </div>
                    {s.state === "active" && (
                      <span className="rounded-full bg-blue-600 text-white text-[10.5px] font-black px-3 py-1.5 flex items-center gap-1 shrink-0 shadow-md shadow-blue-600/25">
                        {ar ? "متابعة" : "Continue"}
                        <Chevron size={12} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-4 -start-4 rounded-2xl bg-white border border-green-200 shadow-[0_15px_35px_rgba(34,197,94,0.20)] px-4 py-3 flex items-center gap-2 -rotate-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[12px] font-black text-slate-800">{ar ? "إعداد ذاتي — بدون تدريب" : "Self-serve — no training"}</span>
        </div>

        <div className="absolute -bottom-4 -end-4 rounded-2xl bg-white border border-slate-100 shadow-[0_15px_35px_rgba(15,23,42,0.15)] px-4 py-3 rotate-2 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
            <Zap size={15} />
          </div>
          <div className="text-[11.5px] font-black text-slate-800 leading-tight">
            {ar ? <>متوسط وقت الإعداد<br /><span className="text-blue-600">أقل من 10 دقائق</span></> : <>Avg. setup time<br /><span className="text-blue-600">under 10 minutes</span></>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BiometricScanVisual({ language }: VisualProps) {
  const ar = language === "ar";
  // phase 0: framing, 1: scanning, 2: matched
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const durations = [1400, 2600, 2600];
    const timer = setTimeout(() => setPhase((p) => (p + 1) % 3), durations[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  const statusText = phase === 0
    ? (ar ? "ثبّت وجهك داخل الإطار" : "Align your face in the frame")
    : phase === 1
      ? (ar ? "جاري مسح الوجه…" : "Scanning face…")
      : (ar ? "تم تسجيل الحضور" : "Attendance recorded");

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md flex items-center justify-center">
        <Glow />

        {/* Hand + phone */}
        <motion.div
          animate={{ y: [0, -7, 0], rotate: [-4, -2.5, -4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
          style={{ transformOrigin: "50% 90%" }}
        >
          {/* Thumb holding the phone */}
          <div className="absolute -bottom-5 -start-6 w-24 h-16 rounded-[50%] bg-gradient-to-br from-[#E8B792] to-[#D9A177] rotate-[38deg] shadow-[0_10px_25px_rgba(0,0,0,0.18)] z-20" />
          <div className="absolute -bottom-10 start-2 w-32 h-24 rounded-[45%] bg-gradient-to-br from-[#E3AE87] to-[#CE9367] rotate-[15deg] shadow-[0_15px_35px_rgba(0,0,0,0.2)] z-10" />

          {/* Phone frame */}
          <div className="relative z-30 w-[230px] rounded-[36px] bg-slate-900 p-[10px] shadow-[0_35px_80px_rgba(15,23,42,0.45)] border border-slate-700/60">
            <div className="relative rounded-[28px] overflow-hidden bg-black">
              {/* Camera viewfinder */}
              <div className="relative h-[360px]">
                <img src={faceScanSelfie} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
                {/* viewfinder darkening with oval cutout */}
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 42% 34% at 50% 42%, transparent 62%, rgba(2,6,23,0.72) 100%)" }} />

                {/* top bar */}
                <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-3 text-white/90">
                  <span className="text-[10px] font-black bg-white/15 backdrop-blur rounded-full px-2.5 py-1">{ar ? "تسجيل حضور" : "Check-in"}</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>

                {/* face oval + corner brackets */}
                <div className={`absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[150px] h-[190px] rounded-[50%] border-2 transition-colors duration-500 ${phase === 2 ? "border-green-400" : "border-dashed border-cyan-300/80"}`} />

                {/* scanning beam */}
                <AnimatePresence>
                  {phase === 1 && (
                    <motion.div
                      key="beam"
                      initial={{ top: "18%", opacity: 0 }}
                      animate={{ top: ["18%", "64%", "18%"], opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ top: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.25 } }}
                      className="absolute inset-x-6 h-[3px] rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_18px_4px_rgba(34,211,238,0.55)]"
                    />
                  )}
                </AnimatePresence>

                {/* face-mesh landmark dots while scanning */}
                {phase === 1 && (
                  <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[150px] h-[190px]">
                    {[[30,32],[70,26],[50,45],[32,62],[68,60],[50,72],[40,85],[60,86],[22,48],[78,46]].map(([x,y], i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.35, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
                        className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      />
                    ))}
                  </div>
                )}

                {/* success flash + check */}
                <AnimatePresence>
                  {phase === 2 && (
                    <>
                      <motion.div
                        key="flash"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-white"
                      />
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16 }}
                        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_40px_10px_rgba(34,197,94,0.45)]"
                      >
                        <Check size={34} strokeWidth={3.5} />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* status pill */}
                <div className="absolute bottom-16 inset-x-0 flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phase}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`text-[11px] font-black rounded-full px-4 py-2 backdrop-blur border ${
                        phase === 2 ? "bg-green-500/90 text-white border-green-400" : "bg-slate-900/70 text-cyan-100 border-white/15"
                      }`}
                    >
                      {statusText}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* shutter */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center">
                  <div className={`w-11 h-11 rounded-full border-[3px] transition-colors duration-500 ${phase === 2 ? "border-green-400" : "border-white/80"} flex items-center justify-center`}>
                    <motion.div
                      animate={phase === 1 ? { scale: [1, 0.75, 1] } : { scale: 1 }}
                      transition={{ duration: 1.2, repeat: phase === 1 ? Infinity : 0 }}
                      className={`w-8 h-8 rounded-full ${phase === 2 ? "bg-green-400" : "bg-white"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Match-result card */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="absolute -end-20 top-8 z-40 rounded-2xl bg-white border border-green-200 shadow-[0_15px_35px_rgba(34,197,94,0.25)] px-4 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 text-white flex items-center justify-center shadow-md">
                    <ScanFace size={18} />
                  </div>
                  <div>
                    <div className="text-[12px] font-black text-slate-800">{ar ? "تطابق الوجه 98.7%" : "Face match 98.7%"}</div>
                    <div className="text-[10.5px] font-bold text-green-600">{ar ? "حضور ٨:٥٩ ص ✓" : "Checked in 8:59 AM ✓"}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* liveness badge */}
          <div className="absolute -start-16 bottom-20 z-40 rounded-2xl bg-white border border-blue-200 shadow-[0_15px_35px_rgba(37,99,235,0.2)] px-3.5 py-2.5 -rotate-3 flex items-center gap-2">
            <ShieldCheck size={15} className="text-blue-600" />
            <span className="text-[11px] font-black text-slate-800">{ar ? "كشف الحيوية" : "Liveness check"}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const TypingDots = () => (
  <div className="flex justify-start">
    <div className="rounded-2xl rounded-ss-md bg-white border border-slate-100 px-4 py-3 shadow-sm flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          className="w-2 h-2 rounded-full bg-slate-400"
        />
      ))}
    </div>
  </div>
);

const bubbleIn = {
  initial: { opacity: 0, y: 14, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 300, damping: 24 },
};

export function LeaveChatVisual({ language }: VisualProps) {
  const ar = language === "ar";
  // 0: typing in input, 1: user bubble sent + bot typing, 2: bot summary card,
  // 3: bot typing again, 4: sent-to-manager, 5: approved badge, then loop
  const [phase, setPhase] = useState(0);
  const [typedLen, setTypedLen] = useState(0);

  const userMsg = ar ? "أبغى إجازة يومين من 1 مارس 🙏" : "I need 2 days off starting March 1 🙏";
  const msgChars = Array.from(userMsg);

  useEffect(() => {
    if (phase === 0) {
      if (typedLen < msgChars.length) {
        const t = setTimeout(() => setTypedLen((l) => l + 1), 55);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase(1), 500);
      return () => clearTimeout(t);
    }
    const durations = [0, 1300, 1900, 1100, 1500, 2800];
    const t = setTimeout(() => {
      if (phase === 5) {
        setTypedLen(0);
        setPhase(0);
      } else {
        setPhase((p) => p + 1);
      }
    }, durations[phase]);
    return () => clearTimeout(t);
  }, [phase, typedLen, msgChars.length]);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Glow />
        <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_30px_70px_rgba(15,23,42,0.14)] overflow-hidden">
          {/* Chat header */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 px-6 py-4 text-white flex items-center gap-3 relative overflow-hidden">
            <div className="absolute -top-8 -end-8 w-28 h-28 rounded-full bg-white/10" />
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center relative">
              <Sparkles size={19} />
            </div>
            <div className="relative">
              <div className="text-[14.5px] font-heading font-black">{ar ? "مساعد نظامي" : "Nizamy Assistant"}</div>
              <div className="text-[11px] font-bold text-blue-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                {ar ? "متصل الآن — يرد فورًا" : "Online — replies instantly"}
              </div>
            </div>
          </div>

          {/* Chat body */}
          <div className="p-5 space-y-3 bg-[#FAFAFA] h-[380px] overflow-hidden flex flex-col justify-end">
            {/* user bubble */}
            {phase >= 1 && (
              <motion.div {...bubbleIn} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-ee-md bg-blue-600 text-white px-4 py-3 text-[13px] font-bold leading-relaxed shadow-md shadow-blue-600/15">
                  {userMsg}
                </div>
              </motion.div>
            )}

            {/* bot typing → summary card */}
            {phase === 1 && <TypingDots />}
            {phase >= 2 && (
              <motion.div {...bubbleIn} className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-ss-md bg-white border border-slate-100 px-4 py-3 shadow-sm">
                  <div className="text-[13px] font-bold text-slate-700 leading-relaxed mb-3">
                    {ar ? "تم! رصيدك يسمح ✅ هذا ملخص طلبك:" : "Done! You have enough balance ✅ Here's your request:"}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 20 }}
                    className="rounded-xl bg-slate-900 text-white p-3.5"
                  >
                    <div className="text-[11px] font-bold text-slate-400 mb-1">{ar ? "إجازة اعتيادية — يومان" : "Regular leave — 2 days"}</div>
                    <div className="flex items-center justify-between text-[12.5px] font-black">
                      <span>{ar ? "1 مارس" : "Mar 1"}</span>
                      <span className="text-slate-500">→</span>
                      <span>{ar ? "2 مارس" : "Mar 2"}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 text-[11px] font-bold text-green-300">
                      {ar ? "الرصيد المتبقي: 3 أيام و4 ساعات" : "Remaining balance: 3 days, 4 hours"}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* bot typing → approval message */}
            {phase === 3 && <TypingDots />}
            {phase >= 4 && (
              <motion.div {...bubbleIn} className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-ss-md bg-white border border-slate-100 px-4 py-3 shadow-sm">
                  <div className="text-[13px] font-bold text-slate-700 leading-relaxed">
                    {ar ? "أُرسل الطلب لمديرك للموافقة 📨" : "Sent to your manager for approval 📨"}
                  </div>
                  <div className="mt-2.5 flex gap-2 min-h-[30px]">
                    {phase >= 5 && (
                      <>
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 320, damping: 16 }}
                          className="rounded-full bg-green-500 text-white text-[11px] font-black px-3.5 py-1.5 shadow-md shadow-green-500/25"
                        >
                          {ar ? "تمت الموافقة ✓" : "Approved ✓"}
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0, x: ar ? 8 : -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 }}
                          className="rounded-full bg-slate-100 text-slate-400 text-[11px] font-black px-3.5 py-1.5"
                        >
                          {ar ? "خلال 4 دقائق" : "in 4 minutes"}
                        </motion.span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick actions */}
            <div className="pt-2 flex flex-wrap gap-2">
              {(ar
                ? ["🏖️ طلب إجازة", "📄 خطاب تعريف", "💰 سلفة", "🕐 استئذان"]
                : ["🏖️ Request leave", "📄 Salary letter", "💰 Advance", "🕐 Excuse"]
              ).map((chip, i) => (
                <span key={i} className={`rounded-full text-[11.5px] font-black px-3.5 py-2 border ${i === 0 ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20" : "bg-white text-slate-500 border-slate-200"}`}>
                  {chip}
                </span>
              ))}
            </div>

            {/* Input bar with live typing */}
            <div className="mt-1 rounded-2xl bg-white border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="flex-1 text-[12.5px] font-bold text-slate-700 min-h-[18px] truncate">
                {phase === 0 ? (
                  <>
                    {msgChars.slice(0, typedLen).join("")}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-[2px] h-[14px] bg-blue-600 align-middle ms-0.5"
                    />
                  </>
                ) : (
                  <span className="text-slate-300">{ar ? "اكتب رسالتك…" : "Type a message…"}</span>
                )}
              </div>
              <motion.div
                animate={phase === 0 && typedLen >= msgChars.length ? { scale: [1, 0.85, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${phase === 0 && typedLen > 0 ? "bg-blue-600 shadow-blue-600/25" : "bg-slate-300"}`}
              >
                <Zap size={15} />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute -top-4 -end-4 rounded-2xl bg-white border border-blue-200 shadow-[0_15px_35px_rgba(37,99,235,0.20)] px-4 py-3 flex items-center gap-2.5 rotate-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
            <Zap size={15} />
          </div>
          <span className="text-[12px] font-black text-slate-800">{ar ? "إجازات بضغطة زر" : "Leave in one tap"}</span>
        </div>
      </div>
    </div>
  );
}

export function ComplianceVisual({ language }: VisualProps) {
  const ar = language === "ar";
  const chips = [
    { label: ar ? "العقود" : "Contracts", ok: true },
    { label: ar ? "الإجازات" : "Leave", ok: true },
    { label: ar ? "ساعات العمل" : "Working hours", ok: true },
    { label: ar ? "الحضور" : "Attendance", ok: true },
  ];
  const R = 44;
  const C = 2 * Math.PI * R;
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Glow />
        <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_30px_70px_rgba(15,23,42,0.14)] overflow-hidden">
          <div className="bg-gradient-to-br from-green-600 to-emerald-500 px-6 py-4 text-white flex items-center gap-3 relative overflow-hidden">
            <div className="absolute -top-8 -end-8 w-28 h-28 rounded-full bg-white/10" />
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center relative">
              <ShieldCheck size={19} />
            </div>
            <div className="relative">
              <div className="text-[14.5px] font-heading font-black">{ar ? "لوحة التوافق النظامي" : "Compliance Dashboard"}</div>
              <div className="text-[11px] font-bold text-green-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {ar ? "يُفحص تلقائيًا كل يوم" : "Auto-checked daily"}
              </div>
            </div>
          </div>

          <div className="p-6 flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 112 112" className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r={R} fill="none" stroke="#E2E8F0" strokeWidth="11" />
                <circle cx="56" cy="56" r={R} fill="none" stroke="url(#complianceGrad)" strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={0} />
                <defs>
                  <linearGradient id="complianceGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#16A34A" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-heading font-black text-slate-900 leading-none">100%</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">{ar ? "متوافق" : "compliant"}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {chips.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl bg-green-50/70 border border-green-100 px-3 py-2">
                  <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                    <Check size={11} strokeWidth={4} />
                  </span>
                  <span className="text-[12px] font-black text-slate-700">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-6 mb-6 rounded-2xl bg-slate-900 text-white p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center shrink-0 shadow-md shadow-green-500/30">
              <Zap size={15} />
            </div>
            <div className="text-[12px] font-bold text-slate-200 leading-relaxed">
              {ar ? "أي تحديث في نظام العمل السعودي يُطبَّق تلقائيًا — بدون أي إجراء منك" : "Any KSA labor-law update is applied automatically — no action needed"}
            </div>
          </div>
        </div>

        <div className="absolute -top-4 -end-4 rounded-2xl bg-white border border-green-200 shadow-[0_15px_35px_rgba(34,197,94,0.20)] px-4 py-3 flex items-center gap-2 rotate-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[12px] font-black text-slate-800">{ar ? "متوافق من اليوم الأول" : "Compliant from day one"}</span>
        </div>
      </div>
    </div>
  );
}

export function RecruitmentVisual({ language }: VisualProps) {
  const ar = language === "ar";
  const stages = [
    { label: ar ? "المتقدمون" : "Applied", count: 36, width: 100, color: "from-blue-200 to-blue-100", text: "text-blue-600" },
    { label: ar ? "فرز الذكاء الاصطناعي" : "AI screening", count: 12, width: 62, color: "from-blue-400 to-cyan-300", text: "text-blue-600" },
    { label: ar ? "المقابلات" : "Interviews", count: 4, width: 34, color: "from-blue-600 to-cyan-400", text: "text-blue-700" },
    { label: ar ? "العرض الوظيفي" : "Offer", count: 1, width: 16, color: "from-green-500 to-emerald-400", text: "text-green-600" },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Glow />
        <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_30px_70px_rgba(15,23,42,0.14)] overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 px-6 py-4 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute -top-8 -end-8 w-28 h-28 rounded-full bg-white/10" />
            <div className="flex items-center gap-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Search size={19} />
              </div>
              <div>
                <div className="text-[14.5px] font-heading font-black">{ar ? "مسار التوظيف" : "Hiring Pipeline"}</div>
                <div className="text-[11px] font-bold text-blue-100">{ar ? "وظيفة: محاسب أول" : "Role: Senior Accountant"}</div>
              </div>
            </div>
            <span className="rounded-full bg-amber-400 text-slate-900 text-[11px] font-black px-3 py-1.5 shadow-lg shadow-amber-500/30 relative">{ar ? "قريبًا ✨" : "Soon ✨"}</span>
          </div>

          <div className="p-6 space-y-3">
            {stages.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-black text-slate-700">{s.label}</span>
                    <span className={`text-[12px] font-heading font-black ${s.text}`}>{s.count}</span>
                  </div>
                  <div className="h-6 rounded-lg bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-lg bg-gradient-to-r ${s.color}`} style={{ width: `${s.width}%` }} />
                  </div>
                </div>
              </div>
            ))}

            <div className="!mt-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100 p-4 flex items-center gap-3">
              <Avatar initials={ar ? "م" : "M"} from="from-blue-500" to="to-cyan-400" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-black text-slate-800 leading-tight">{ar ? "محمد العتيبي" : "Mohammed A."}</div>
                <div className="text-[11px] font-bold text-slate-400">{ar ? "المرشح الأفضل — رشّحه الذكاء الاصطناعي" : "Top candidate — picked by AI"}</div>
              </div>
              <span className="rounded-full bg-blue-600 text-white text-[11px] font-black px-3 py-1.5 shadow-md shadow-blue-600/25">{ar ? "تطابق 94%" : "94% match"}</span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 -start-4 rounded-2xl bg-white border border-blue-200 shadow-[0_15px_35px_rgba(37,99,235,0.20)] px-4 py-3 flex items-center gap-2.5 -rotate-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
            <Sparkles size={15} />
          </div>
          <span className="text-[12px] font-black text-slate-800">{ar ? "من 36 متقدم إلى موظف واحد — تلقائيًا" : "36 applicants to 1 hire — automatically"}</span>
        </div>
      </div>
    </div>
  );
}

export function PayrollVisual({ language }: VisualProps) {
  const ar = language === "ar";
  const rows = [
    { label: ar ? "الراتب الأساسي" : "Base salary", val: ar ? "8,000 ر.س" : "SAR 8,000" },
    { label: ar ? "بدل سكن ومواصلات" : "Housing & transport", val: ar ? "+2,200 ر.س" : "+SAR 2,200" },
    { label: ar ? "خصم التأمينات (GOSI)" : "GOSI deduction", val: ar ? "-780 ر.س" : "-SAR 780", neg: true },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <Glow />
        <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_30px_70px_rgba(15,23,42,0.14)] overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 pb-5 text-white relative overflow-hidden">
            <div className="absolute -top-10 -end-10 w-36 h-36 rounded-full bg-blue-500/20" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
                  <Wallet size={22} />
                </div>
                <div>
                  <div className="text-[16px] font-heading font-black">{ar ? "مسير الرواتب" : "Payroll Run"}</div>
                  <div className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {ar ? "يُحسب تلقائيًا…" : "Calculating automatically…"}
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-green-400/15 border border-green-400/30 text-green-300 text-[12px] font-black px-3 py-1.5">
                {ar ? "جاهز للتحويل" : "Ready to pay"}
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="rounded-2xl border border-slate-100 bg-[#FAFAFA] p-4 space-y-3 mb-4">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-slate-500">{r.label}</span>
                  <span className={`text-[13px] font-black ${"neg" in r && r.neg ? "text-rose-500" : "text-slate-800"}`}>{r.val}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[13px] font-black text-slate-800">{ar ? "صافي الراتب" : "Net salary"}</span>
                <span className="text-lg font-heading font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {ar ? "9,420 ر.س" : "SAR 9,420"}
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100 p-4 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                <Zap size={15} />
              </div>
              <div className="text-[12.5px] font-bold text-slate-700 leading-relaxed">
                {ar ? "قسائم الرواتب وملف حماية الأجور تُجهّز بضغطة واحدة" : "Payslips and WPS file generated in one click"}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -end-4 rounded-2xl bg-white border border-amber-200 shadow-[0_15px_35px_rgba(245,158,11,0.25)] px-4 py-3 flex items-center gap-2 rotate-2">
          <span className="text-[12px] font-black text-slate-800">{ar ? "قريبًا ✨" : "Coming soon ✨"}</span>
        </div>
      </div>
    </div>
  );
}
