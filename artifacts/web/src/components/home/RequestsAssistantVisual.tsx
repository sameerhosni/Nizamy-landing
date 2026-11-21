import { CalendarDays, Clock3, FileText, Hourglass, Sparkles, Wallet, Zap } from "lucide-react";

/*
 * Illustrative demo only: no inputs, no submissions, no backend.
 * Timeline plays once in ~2.4s (hero rotates every 2.8s), then holds the final "pending approval" state.
 * Reduced motion: final state rendered statically.
 */
const css = `
.rq-stage{container-type:inline-size}
.rq-card{animation:rq-float 8s ease-in-out infinite}
@keyframes rq-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.rq-in{opacity:0;animation:rq-in .45s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes rq-in{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
.rq-typing{opacity:0;animation:rq-typing 1s ease forwards}
@keyframes rq-typing{0%{opacity:0}15%,80%{opacity:1}100%{opacity:0}}
.rq-dot{animation:rq-dot .9s ease-in-out infinite}
@keyframes rq-dot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
.rq-pulse{animation:rq-pulse 1.8s ease-in-out infinite}
@keyframes rq-pulse{0%,100%{opacity:1}50%{opacity:.35}}
.rq-ring{animation:rq-spin 40s linear infinite}
@keyframes rq-spin{to{transform:rotate(360deg)}}
.rq-hl{animation:rq-hl .5s ease forwards}
@keyframes rq-hl{from{background:#FCFDFE;color:#4A6378}to{background:#1A6FE0;color:#F6FBFE;border-color:#1A6FE0}}
@container (max-width: 400px){
  .rq-pad{padding:4px!important}
  .rq-head{padding-top:5px!important;padding-bottom:5px!important}
  .rq-conv{padding-top:6px!important;padding-bottom:6px!important;gap:5px!important}
  .rq-bub{padding-top:3px!important;padding-bottom:3px!important}
  .rq-sum{padding:7px!important}
  .rq-sum-t{margin-bottom:3px!important}
  .rq-dark{padding-top:4px!important;padding-bottom:4px!important}
  .rq-bal{margin-top:2px!important;padding-top:2px!important}
  .rq-cats{padding-top:5px!important;padding-bottom:5px!important;gap:3px!important}
  .rq-chip{padding:3px 2px!important}
}
@container (max-width: 360px){ .rq-chip svg{display:none} }
@media (prefers-reduced-motion: reduce){
  .rq-card,.rq-in,.rq-typing,.rq-dot,.rq-pulse,.rq-ring,.rq-hl{animation:none!important}
  .rq-in{opacity:1}.rq-typing{display:none}
  .rq-hl{background:#1A6FE0!important;color:#F6FBFE!important;border-color:#1A6FE0!important}
}
`;

const d = (s: number) => ({ animationDelay: `${s}s` });
const fs = (min: number, cqi: number, max: number) => ({ fontSize: `clamp(${min}px, ${cqi}cqi, ${max}px)` });

const cats = [
  { label: "طلب إجازة", Icon: CalendarDays, active: true },
  { label: "خطاب تعريف", Icon: FileText },
  { label: "سلفة", Icon: Wallet },
  { label: "استئذان", Icon: Clock3 },
];

export function RequestsAssistantVisual({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={`عرض توضيحي: ${label}. موظف يطلب من مساعد نظامي إجازة يومين من ١ مارس، فيجهّز المساعد ملخص الطلب: إجازة اعتيادية من ١ إلى ٢ مارس والرصيد بعدها ١٩ يوم، ثم يُرسل الطلب للمدير ويظهر بحالة بانتظار الموافقة. أنواع الطلبات: إجازة، خطاب تعريف، سلفة، استئذان.`} data-testid="img-requests-assistant" className={`rq-stage relative h-full w-full ${className}`}>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border border-[#D3E7F4] bg-[radial-gradient(circle_at_25%_20%,#E3F1FC,transparent_55%),radial-gradient(circle_at_85%_90%,#DDF5FA,transparent_50%)] bg-[#F6FBFE]" />
      <div aria-hidden="true" className="rq-ring absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#BCDCEF]/80" />

      <span aria-hidden="true" className="absolute top-[4%] end-[4%] z-20 rounded-full border border-[#C8E1F1] bg-[#FCFDFE]/90 px-2.5 py-0.5 font-bold text-[#4A6378]" style={fs(9, 2.6, 11)}>
        عرض توضيحي
      </span>

      <div aria-hidden="true" dir="rtl" className="absolute inset-0 rq-pad flex items-center justify-center p-[4%]">
        <div className="rq-card relative flex h-full min-h-0 w-[min(100%,26rem)] flex-col overflow-hidden rounded-[1.4rem] border border-[#DCEAF4] bg-[#FCFDFE] shadow-[26px_34px_60px_-30px_rgba(17,65,103,.55),0_2px_6px_rgba(17,65,103,.06)]">
          {/* header */}
          <div className="rq-head relative flex items-center gap-2 overflow-hidden bg-[linear-gradient(120deg,#1A6FE0,#2F8AF0)] px-[4.5%] py-[2.6%] text-[#F6FBFE]">
            <span className="absolute -start-6 -top-8 h-20 w-20 rounded-full bg-white/10" />
            <span className="relative grid h-[clamp(26px,8cqi,34px)] w-[clamp(26px,8cqi,34px)] place-items-center rounded-xl bg-white/20"><Sparkles size={16} /></span>
            <div className="relative leading-tight">
              <p className="font-black" style={fs(12, 3.6, 15)}>مساعد نظامي</p>
              <p className="flex items-center gap-1 font-medium text-[#DCEBFC]" style={fs(9, 2.5, 11)}><span className="rq-pulse h-1.5 w-1.5 rounded-full bg-[#5BE3A8]" />متصل الآن</p>
            </div>
          </div>

          {/* conversation */}
          <div className="rq-conv flex min-h-0 flex-1 flex-col gap-[3%] leading-tight bg-[#F7FAFD] px-[4.5%] py-[3%]">
            <div className="rq-in rq-bub self-end rounded-2xl rounded-ee-md bg-[#1A6FE0] px-3 py-1.5 font-bold text-[#F6FBFE] shadow-[0_8px_18px_-12px_rgba(26,111,224,.8)]" style={{ ...fs(11, 3.3, 14), ...d(0.15) }}>
              أبي إجازة يومين من ١ مارس
            </div>

            <div className="relative self-start">
              <div className="rq-typing absolute start-0 top-0 flex gap-1 rounded-2xl rounded-es-md border border-[#E2EDF5] bg-[#FCFDFE] px-3 py-2.5" style={d(0.55)}>
                {[0, 0.15, 0.3].map((t) => <span key={t} className="rq-dot h-1.5 w-1.5 rounded-full bg-[#7F9AB0]" style={d(t)} />)}
              </div>
              <div className="rq-in rq-sum w-[min(16.5rem,78cqi)] rounded-2xl rounded-es-md border border-[#E2EDF5] bg-[#FCFDFE] p-[3.5cqi] shadow-[0_10px_24px_-18px_rgba(17,65,103,.5)]" style={d(1.15)}>
                <p className="rq-sum-t mb-1.5 font-bold text-[#193C5B]" style={fs(10.5, 3.1, 13)}>رصيدك يسمح. هذا ملخص طلبك:</p>
                <div className="rq-dark rounded-xl bg-[#13263A] px-3 py-2 text-[#E6F4FB]">
                  <p className="font-medium text-[#9DB6CB]" style={fs(9.5, 2.7, 11.5)}>إجازة اعتيادية · يومان</p>
                  <div className="mt-0.5 flex items-center justify-between font-black" style={fs(11, 3.3, 14)}>
                    <span>١ مارس</span><span className="text-[#5E7C96]">←</span><span>٢ مارس</span>
                  </div>
                  <p className="rq-bal mt-1 border-t border-white/10 pt-1 font-bold text-[#6FE3B4]" style={fs(9.5, 2.7, 11.5)}>الرصيد بعد الطلب: ١٩ يوم</p>
                </div>
              </div>
            </div>

            <div className="rq-in rq-bub flex items-center gap-1.5 self-start rounded-full border border-[#F5D9A6] bg-[#FFF6E5] px-2.5 py-1 font-bold text-[#8A5A12]" style={{ ...fs(10, 2.9, 12.5), ...d(1.8) }}>
              <Hourglass size={13} className="text-[#D9901E]" />
              أُرسل للمدير · بانتظار الموافقة
              <span className="rq-pulse h-1.5 w-1.5 rounded-full bg-[#E9A23B]" />
            </div>
          </div>

          {/* categories (display only) */}
          <div className="rq-cats grid shrink-0 grid-cols-4 gap-[1.6%] border-t border-[#E6EFF6] bg-[#FCFDFE] px-[4.5%] py-[2.6%]">
            {cats.map(({ label: l, Icon, active }) => (
              <span key={l} className={`rq-chip flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-[#DCE8F1] bg-[#FCFDFE] px-1.5 py-1 leading-tight font-bold text-[#4A6378] ${active ? "rq-hl" : ""}`} style={{ ...fs(9, 2.6, 12), ...(active ? d(0.05) : {}) }}>
                <Icon size={12} className="shrink-0" />{l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="rq-in absolute start-[1%] top-[16%] z-20 hidden items-center gap-1.5 rounded-2xl border border-[#C8E1F1] bg-[#FCFDFE] px-3 py-2 text-xs font-bold text-[#193C5B] shadow-[0_14px_30px_-18px_rgba(17,65,103,.5)] sm:flex" style={d(0.4)}>
        <Zap size={14} className="text-[#1689DC]" />الطلب جاهز بثواني
      </div>
    </div>
  );
}
