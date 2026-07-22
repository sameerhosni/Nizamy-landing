import { Gift, Trophy, Medal, Coins, Sparkles, TrendingUp, Check, ChevronLeft, ChevronRight, Zap, ShieldCheck, Search, Wallet } from "lucide-react";
import noonLogo from "@/assets/brands/noon.png";
import hungerstationLogo from "@/assets/brands/hungerstation.png";
import amazonLogo from "@/assets/brands/amazon.png";
import jarirLogo from "@/assets/brands/jarir.png";

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

export function AiReportsVisual({ language }: VisualProps) {
  const ar = language === "ar";
  const bars = [42, 58, 50, 72, 64, 88, 96];
  const labels = ar ? ["س", "أ", "ث", "ر", "خ", "ج", "الآن"] : ["M", "T", "W", "T", "F", "S", "Now"];
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
                  <Sparkles size={22} />
                </div>
                <div>
                  <div className="text-[16px] font-heading font-black">{ar ? "تقرير الذكاء الاصطناعي" : "AI Report"}</div>
                  <div className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {ar ? "يتولّد الآن…" : "Generating live…"}
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-green-400/15 border border-green-400/30 text-green-300 text-[12px] font-black px-3 py-1.5">
                <TrendingUp size={13} />
                +24%
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-end justify-between gap-2 h-32 mb-2 px-1">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full">
                  <div
                    className={`w-full rounded-t-lg ${i === bars.length - 1 ? "bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-gradient-to-t from-blue-200 to-blue-100"}`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between gap-2 px-1 mb-5">
              {labels.map((l, i) => (
                <span key={i} className={`flex-1 text-center text-[10px] font-black ${i === labels.length - 1 ? "text-blue-600" : "text-slate-300"}`}>{l}</span>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100 p-4 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                <Zap size={15} />
              </div>
              <div className="text-[12.5px] font-bold text-slate-700 leading-relaxed">
                {ar
                  ? "ارتفع الالتزام 24% بعد تفعيل المكافآت — الفريق الأعلى أداءً: المبيعات 🏆"
                  : "Commitment rose 24% after rewards launch — top team: Sales 🏆"}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 -start-4 rounded-2xl bg-white border border-slate-100 shadow-[0_15px_35px_rgba(15,23,42,0.15)] px-4 py-3 -rotate-2">
          <div className="text-[11px] font-bold text-slate-400 mb-0.5">{ar ? "الحضور اليوم" : "Attendance today"}</div>
          <div className="text-xl font-heading font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">96%</div>
        </div>
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

export function LeaveChatVisual({ language }: VisualProps) {
  const ar = language === "ar";
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
          <div className="p-5 space-y-3 bg-[#FAFAFA]">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-ee-md bg-blue-600 text-white px-4 py-3 text-[13px] font-bold leading-relaxed shadow-md shadow-blue-600/15">
                {ar ? "أبغى إجازة يومين من 1 مارس 🙏" : "I need 2 days off starting March 1 🙏"}
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-ss-md bg-white border border-slate-100 px-4 py-3 shadow-sm">
                <div className="text-[13px] font-bold text-slate-700 leading-relaxed mb-3">
                  {ar ? "تم! رصيدك يسمح ✅ هذا ملخص طلبك:" : "Done! You have enough balance ✅ Here's your request:"}
                </div>
                <div className="rounded-xl bg-slate-900 text-white p-3.5">
                  <div className="text-[11px] font-bold text-slate-400 mb-1">{ar ? "إجازة اعتيادية — يومان" : "Regular leave — 2 days"}</div>
                  <div className="flex items-center justify-between text-[12.5px] font-black">
                    <span>{ar ? "1 مارس" : "Mar 1"}</span>
                    <span className="text-slate-500">→</span>
                    <span>{ar ? "2 مارس" : "Mar 2"}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 text-[11px] font-bold text-green-300">
                    {ar ? "الرصيد المتبقي: 3 أيام و4 ساعات" : "Remaining balance: 3 days, 4 hours"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-ss-md bg-white border border-slate-100 px-4 py-3 shadow-sm">
                <div className="text-[13px] font-bold text-slate-700 leading-relaxed">
                  {ar ? "أُرسل الطلب لمديرك للموافقة 📨" : "Sent to your manager for approval 📨"}
                </div>
                <div className="mt-2.5 flex gap-2">
                  <span className="rounded-full bg-green-500 text-white text-[11px] font-black px-3.5 py-1.5 shadow-md shadow-green-500/25">
                    {ar ? "تمت الموافقة ✓" : "Approved ✓"}
                  </span>
                  <span className="rounded-full bg-slate-100 text-slate-400 text-[11px] font-black px-3.5 py-1.5">
                    {ar ? "خلال 4 دقائق" : "in 4 minutes"}
                  </span>
                </div>
              </div>
            </div>

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
