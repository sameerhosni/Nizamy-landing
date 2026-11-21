import { Award, Gift, ShoppingBag, Sparkles, Trophy, UtensilsCrossed, BookOpen, Star } from "lucide-react";

/*
 * Illustrative demo only: sample employees and points, no issuance, no backend, no controls.
 * Timeline plays once in ~2.3s (hero rotates every 2.8s), then holds. Reduced motion: final state.
 */
const css = `
.rw-stage{container-type:inline-size}
.rw-card{animation:rw-float 8s ease-in-out infinite}
@keyframes rw-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.rw-in{opacity:0;animation:rw-in .45s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes rw-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
.rw-bar{transform:scaleX(0);transform-origin:right;animation:rw-bar .9s cubic-bezier(.3,.7,.2,1) forwards}
@keyframes rw-bar{to{transform:scaleX(1)}}
.rw-pop{opacity:0;animation:rw-pop .5s cubic-bezier(.3,1.5,.5,1) forwards}
@keyframes rw-pop{from{opacity:0;transform:scale(.6) rotate(-8deg)}to{opacity:1;transform:none}}
.rw-shine{animation:rw-shine 1s ease 1.9s forwards;transform:translateX(120%)}
@keyframes rw-shine{to{transform:translateX(-120%)}}
.rw-ring{animation:rw-spin 40s linear infinite}
@keyframes rw-spin{to{transform:rotate(360deg)}}
@container (max-width: 400px){
  .rw-pad{padding:3px!important}
  .rw-head{padding-top:4px!important;padding-bottom:4px!important}
  .rw-body{padding:5px 7px!important;gap:4px!important}
  .rw-row{padding:4px 6px!important}
  .rw-bt{margin-top:3px!important}
  .rw-brands{padding:4px 6px!important}
  .rw-brand{padding:3px 2px!important}
  .rw-av{width:20px!important;height:20px!important}
}
@container (max-width: 360px){ .rw-brand svg{display:none} .rw-pts{display:none!important} }
@media (prefers-reduced-motion: reduce){
  .rw-card,.rw-in,.rw-bar,.rw-pop,.rw-shine,.rw-ring{animation:none!important}
  .rw-in,.rw-pop{opacity:1}.rw-bar{transform:none}.rw-shine{display:none}
}
`;

const d = (s: number) => ({ animationDelay: `${s}s` });
const fs = (min: number, cqi: number, max: number) => ({ fontSize: `clamp(${min}px, ${cqi}cqi, ${max}px)` });

const rows = [
  { name: "سارة", initial: "س", reason: "التزام ٩٨٪", reward: "قسيمة نون", pct: 98, av: "linear-gradient(135deg,#F0668F,#E2457A)", top: true },
  { name: "خالد", initial: "خ", reason: "تقدير الأداء", reward: "هنقرستيشن", pct: 84, av: "linear-gradient(135deg,#1FB8E8,#1689DC)" },
  { name: "نورة", initial: "ن", reason: "حضور مبكر", reward: "بطاقة أمازون", pct: 71, av: "linear-gradient(135deg,#A77BF0,#7F5AD8)" },
];

const brands = [
  { name: "نون", Icon: ShoppingBag, cls: "bg-[#FFF3B0] text-[#5A4A00] border-[#F2DC5A]" },
  { name: "هنقرستيشن", Icon: UtensilsCrossed, cls: "bg-[#FFE68A] text-[#6B3A0E] border-[#F0CC4A]" },
  { name: "أمازون", Icon: Gift, cls: "bg-[#F4F7FA] text-[#1E2D3D] border-[#DCE4EC]" },
  { name: "جرير", Icon: BookOpen, cls: "bg-[#FDF1F2] text-[#B3242F] border-[#F2CDD1]" },
];

export function RewardsRecognitionVisual({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={`عرض توضيحي: ${label}. مكافآت الفريق لهذا الشهر ببيانات تجريبية: سارة التزام ٩٨٪ وقسيمة نون، خالد تقدير الأداء وهنقرستيشن، نورة حضور مبكر وبطاقة أمازون. شارة موظف الشهر، وقسائم من علامات مثل نون وهنقرستيشن وأمازون وجرير.`} data-testid="img-rewards-recognition" className={`rw-stage relative h-full w-full ${className}`}>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border border-[#D3E7F4] bg-[radial-gradient(circle_at_25%_20%,#E3F1FC,transparent_55%),radial-gradient(circle_at_85%_90%,#FFF4D6,transparent_50%)] bg-[#F6FBFE]" />
      <div aria-hidden="true" className="rw-ring absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#BCDCEF]/80" />

      <span aria-hidden="true" className="absolute bottom-[3%] end-[3%] z-20 rounded-full border border-[#C8E1F1] bg-[#FCFDFE]/90 px-2 py-0.5 font-bold text-[#4A6378]" style={fs(8.5, 2.5, 11)}>
        عرض توضيحي
      </span>

      <div aria-hidden="true" dir="rtl" className="rw-pad absolute inset-0 flex items-center justify-center p-[4%]">
        <div className="rw-card relative flex h-full min-h-0 w-[min(100%,26rem)] flex-col overflow-hidden rounded-[1.4rem] border border-[#DCEAF4] bg-[#FCFDFE] shadow-[26px_34px_60px_-30px_rgba(17,65,103,.55),0_2px_6px_rgba(17,65,103,.06)]">
          {/* header */}
          <div className="rw-head relative flex items-center justify-between gap-2 overflow-hidden bg-[linear-gradient(120deg,#1A6FE0,#2F8AF0)] px-[4.5%] py-[2.6%] text-[#F6FBFE]">
            <span className="absolute -start-6 -top-8 h-20 w-20 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-2">
              <span className="grid h-[clamp(22px,7.5cqi,32px)] w-[clamp(22px,7.5cqi,32px)] place-items-center rounded-xl bg-white/20"><Gift size={15} /></span>
              <div className="leading-tight">
                <p className="font-black" style={fs(11.5, 3.6, 15)}>مكافآت الفريق</p>
                <p className="font-medium text-[#DCEBFC]" style={fs(8.5, 2.5, 11)}>هذا الشهر</p>
              </div>
            </div>
            <span className="rw-pop relative flex items-center gap-1 rounded-full bg-[linear-gradient(135deg,#FFD65C,#F2A91E)] px-2 py-0.5 font-black text-[#5A3A00] shadow-[0_6px_14px_-8px_rgba(120,70,0,.8),inset_0_1px_0_rgba(255,255,255,.6)]" style={{ ...fs(8.5, 2.6, 11), ...d(1.7) }}>
              <Trophy size={11} />موظف الشهر · سارة
            </span>
          </div>

          {/* rows */}
          <div className="rw-body flex min-h-0 flex-1 flex-col justify-between gap-[2.2%] bg-[#F7FAFD] px-[4.5%] py-[2.6%]">
            {rows.map((r, i) => (
              <div key={r.name} className={`rw-in rw-row relative overflow-hidden rounded-xl border px-2.5 py-1.5 ${r.top ? "border-[#F6DD9A] bg-[linear-gradient(180deg,#FFFBEF,#FFF6DC)] shadow-[0_8px_18px_-14px_rgba(180,120,10,.7)]" : "border-[#E2EDF5] bg-[#FCFDFE]"}`} style={d(0.1 + i * 0.18)}>
                {r.top && <span className="rw-shine pointer-events-none absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)]" />}
                <div className="relative flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="rw-av relative grid h-6 w-6 shrink-0 place-items-center rounded-full font-black text-[#FCFDFE]" style={{ background: r.av, ...fs(9, 2.7, 12) }}>
                      {r.initial}
                      {r.top && <span className="rw-pop absolute -bottom-1 -start-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#F2A91E] ring-2 ring-[#FFF8E6]" style={d(1.8)}><Star size={8} className="fill-[#FFF8E6] text-[#FFF8E6]" /></span>}
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="font-black text-[#193C5B]" style={fs(10, 3.1, 13)}>{r.name}</p>
                      <p className="truncate font-medium text-[#6A8297]" style={fs(8.5, 2.5, 11)}>{r.reason}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className={`rw-pop flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-bold ${r.top ? "bg-[#F5B82E] text-[#4A3000]" : "bg-[#E8F1FC] text-[#1A5FC0]"}`} style={{ ...fs(8.5, 2.5, 11), ...d(1.2 + i * 0.12) }}>
                      {r.top ? <Award size={10} /> : <Gift size={10} />}{r.reward}
                    </span>
                  </div>
                </div>
                <div className="rw-bt relative mt-1.5 h-[clamp(3px,1cqi,5px)] overflow-hidden rounded-full bg-[#E6EEF5]">
                  <div className="h-full" style={{ width: `${r.pct}%`, marginInlineStart: 0 }}>
                    <div className={`rw-bar h-full rounded-full ${r.top ? "bg-[linear-gradient(270deg,#F5B82E,#FFD65C)]" : "bg-[linear-gradient(270deg,#1A6FE0,#5AA2F5)]"}`} style={d(0.45 + i * 0.18)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* reward categories (display only) */}
          <div className="rw-brands shrink-0 border-t border-[#F3E6C2] bg-[#FFFCF4] px-[4.5%] py-[2.4%]">
            <p className="mb-1 flex items-center justify-between font-bold text-[#6A5A2E]" style={fs(8.5, 2.5, 11)}>
              <span className="flex items-center gap-1"><Sparkles size={10} className="text-[#E2A21E]" />قسائم من علاماتهم المفضلة</span>
            </p>
            <div className="grid grid-cols-4 gap-[1.6%]">
              {brands.map(({ name, Icon, cls }, i) => (
                <span key={name} className={`rw-in rw-brand flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border px-1 py-1 font-black shadow-[0_4px_10px_-8px_rgba(17,65,103,.5)] ${cls}`} style={{ ...fs(8.5, 2.6, 11.5), ...d(0.9 + i * 0.08) }}>
                  <Icon size={11} className="shrink-0" />{name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
