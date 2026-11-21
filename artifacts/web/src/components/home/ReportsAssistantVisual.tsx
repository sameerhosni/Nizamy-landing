import { BarChart3, CheckCircle2, Sparkles } from "lucide-react";

/*
 * Illustrative demo only: synthetic daily attendance %, no inputs, no downloads, no backend.
 * Timeline plays once in ~2.4s (hero rotates every 2.8s), then holds the final "report ready" state.
 * Bar heights are honestly proportional to a 0–100 scale. Reduced motion: final state rendered statically.
 */
const css = `
.rp-stage{container-type:inline-size}
.rp-card{animation:rp-float 8s ease-in-out infinite}
@keyframes rp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.rp-in{opacity:0;animation:rp-in .45s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes rp-in{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
.rp-typing{opacity:0;animation:rp-typing .7s ease forwards}
@keyframes rp-typing{0%{opacity:0}15%,80%{opacity:1}100%{opacity:0}}
.rp-dot{animation:rp-dot .9s ease-in-out infinite}
@keyframes rp-dot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
.rp-pulse{animation:rp-pulse 1.8s ease-in-out infinite}
@keyframes rp-pulse{0%,100%{opacity:1}50%{opacity:.35}}
.rp-ring{animation:rp-spin 40s linear infinite}
@keyframes rp-spin{to{transform:rotate(360deg)}}
.rp-bar{transform:scaleY(0);transform-origin:bottom;animation:rp-bar .6s cubic-bezier(.3,.7,.2,1) forwards}
@keyframes rp-bar{to{transform:scaleY(1)}}
.rp-val{opacity:0;animation:rp-val .3s ease forwards}
@keyframes rp-val{to{opacity:1}}
@container (max-width: 400px){
  .rp-pad{padding:4px!important}
  .rp-head{padding-top:5px!important;padding-bottom:5px!important}
  .rp-conv{padding-top:6px!important;padding-bottom:6px!important;gap:5px!important}
  .rp-bub{padding-top:3px!important;padding-bottom:3px!important}
  .rp-chart{padding:6px 7px!important}
  .rp-ct{margin-bottom:2px!important}
  .rp-plot{padding-top:13px!important}
}
@media (prefers-reduced-motion: reduce){
  .rp-card,.rp-in,.rp-typing,.rp-dot,.rp-pulse,.rp-ring,.rp-bar,.rp-val{animation:none!important}
  .rp-in,.rp-val{opacity:1}.rp-bar{transform:none}.rp-typing{display:none}
}
`;

const d = (s: number) => ({ animationDelay: `${s}s` });
const fs = (min: number, cqi: number, max: number) => ({ fontSize: `clamp(${min}px, ${cqi}cqi, ${max}px)` });

// Synthetic sample week (RTL: first item renders on the right).
const days = [
  { day: "السبت", pct: 88 },
  { day: "الأحد", pct: 92 },
  { day: "الاثنين", pct: 85 },
  { day: "الثلاثاء", pct: 94 },
  { day: "الأربعاء", pct: 90 },
  { day: "الخميس", pct: 81 },
  { day: "الجمعة", pct: 76 },
];
const ar = (n: number) => n.toLocaleString("ar-SA");

export function ReportsAssistantVisual({ label, className = "" }: { label: string; className?: string }) {
  const desc = `عرض توضيحي ببيانات تجريبية: ${label}. يطلب المستخدم من محرك التقارير الذكي في نظامي تقرير الحضور لآخر ٧ أيام، فيجهّز رسمًا عموديًا لنسب الحضور اليومية: ${days.map((x) => `${x.day} ${ar(x.pct)}٪`).join("، ")}. ثم تظهر حالة: التقرير جاهز.`;
  return (
    <div role="img" aria-label={desc} data-testid="img-reports-assistant" className={`rp-stage relative h-full w-full ${className}`}>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border border-[#D3E7F4] bg-[radial-gradient(circle_at_25%_20%,#E3F1FC,transparent_55%),radial-gradient(circle_at_85%_90%,#DDF5FA,transparent_50%)] bg-[#F6FBFE]" />
      <div aria-hidden="true" className="rp-ring absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#BCDCEF]/80" />

      <span aria-hidden="true" className="absolute bottom-[3%] end-[3%] z-20 rounded-full border border-[#C8E1F1] bg-[#FCFDFE]/90 px-2 py-0.5 font-bold text-[#4A6378]" style={fs(8, 2.4, 11)}>
        عرض توضيحي · بيانات تجريبية
      </span>

      <div aria-hidden="true" dir="rtl" className="rp-pad absolute inset-0 flex items-center justify-center p-[4%]">
        <div className="rp-card relative flex h-full min-h-0 w-[min(100%,26rem)] flex-col overflow-hidden rounded-[1.4rem] border border-[#DCEAF4] bg-[#FCFDFE] shadow-[26px_34px_60px_-30px_rgba(17,65,103,.55),0_2px_6px_rgba(17,65,103,.06)]">
          {/* navy header */}
          <div className="rp-head relative flex items-center justify-between gap-2 overflow-hidden bg-[linear-gradient(120deg,#0F1F38,#18304F)] px-[4.5%] py-[2.6%] text-[#F6FBFE]">
            <span className="absolute -end-8 -top-10 h-24 w-24 rounded-full bg-[#1A6FE0]/25" />
            <div className="relative flex items-center gap-2">
              <span className="grid h-[clamp(24px,8cqi,34px)] w-[clamp(24px,8cqi,34px)] place-items-center rounded-xl bg-[linear-gradient(135deg,#2F8AF0,#1A6FE0)] shadow-[0_6px_14px_-6px_rgba(47,138,240,.9)]"><Sparkles size={15} /></span>
              <div className="leading-tight">
                <p className="font-black" style={fs(11.5, 3.6, 15)}>محرك التقارير الذكي</p>
                <p className="flex items-center gap-1 font-medium text-[#9DB6CB]" style={fs(8.5, 2.5, 11)}><span className="rp-pulse h-1.5 w-1.5 rounded-full bg-[#4FC3F7]" />تقارير الحضور</p>
              </div>
            </div>
            <span className="relative flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 font-bold text-[#CFE2F5]" style={fs(8, 2.4, 10.5)}>
              <BarChart3 size={11} />آخر ٧ أيام
            </span>
          </div>

          {/* conversation */}
          <div className="rp-conv flex min-h-0 flex-1 flex-col gap-[3%] bg-[#F7FAFD] px-[4.5%] py-[3%] leading-tight">
            <div className="rp-in rp-bub self-end rounded-2xl rounded-ee-md bg-[#1A6FE0] px-3 py-1.5 font-bold text-[#F6FBFE] shadow-[0_8px_18px_-12px_rgba(26,111,224,.8)]" style={{ ...fs(10.5, 3.2, 14), ...d(0.15) }}>
              أعطني تقرير الحضور لآخر ٧ أيام
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="rp-typing absolute start-0 top-0 flex gap-1 rounded-2xl rounded-es-md border border-[#E2EDF5] bg-[#FCFDFE] px-3 py-2.5" style={d(0.5)}>
                {[0, 0.15, 0.3].map((t) => <span key={t} className="rp-dot h-1.5 w-1.5 rounded-full bg-[#7F9AB0]" style={d(t)} />)}
              </div>
              <div className="rp-in rp-chart flex min-h-0 flex-1 flex-col rounded-2xl rounded-es-md border border-[#E2EDF5] bg-[#FCFDFE] p-[3cqi] shadow-[0_10px_24px_-18px_rgba(17,65,103,.5)]" style={d(1.0)}>
                <div className="rp-ct mb-1 flex items-center justify-between">
                  <p className="font-black text-[#193C5B]" style={fs(9.5, 3, 13)}>نسبة الحضور اليومية · آخر ٧ أيام</p>
                  <p className="font-bold text-[#7F9AB0]" style={fs(8, 2.3, 10)}>٪ من الفريق</p>
                </div>
                <div className="rp-plot relative flex min-h-0 flex-1 items-end gap-[3%] border-b border-[#E2EDF5] pt-4">
                  {days.map((x, i) => (
                    <div key={x.day} className="relative flex h-full min-w-0 flex-1 flex-col justify-end">
                      <div className="relative w-full" style={{ height: `${x.pct}%` }}>
                        <span className="rp-val absolute inset-x-0 -top-[1.3em] text-center font-black text-[#1A5FC0]" style={{ ...fs(7.5, 2.3, 10.5), ...d(1.55 + i * 0.07) }}>{ar(x.pct)}٪</span>
                        <div className="rp-bar h-full w-full rounded-t-md bg-[linear-gradient(180deg,#5AA2F5,#1A6FE0)]" style={d(1.15 + i * 0.07)} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-0.5 flex gap-[3%]">
                  {days.map((x) => (
                    <span key={x.day} className="min-w-0 flex-1 truncate text-center font-bold text-[#6A8297]" style={fs(7, 2.1, 10)}>{x.day}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rp-in rp-bub flex items-center gap-1.5 self-start rounded-full border border-[#BDEBD6] bg-[#EAFBF3] px-2.5 py-1 font-bold text-[#11663F]" style={{ ...fs(9.5, 2.8, 12.5), ...d(2.0) }}>
              <CheckCircle2 size={13} className="text-[#1FA971]" />
              التقرير جاهز
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
