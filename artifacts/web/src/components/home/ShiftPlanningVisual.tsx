import { Bot, Moon, Sun } from "lucide-react";

/*
 * Illustrative demo only: a sample chat with the Nizamy assistant to plan tomorrow's shifts. No backend, no controls, NOT published.
 * Request 0.1s → typing 0.35s → proposal 0.65s → change request 1.1s → typing 1.35s → revised proposal 1.7s → "awaiting approval" 2.0s; final by ~2.3s then holds.
 * Reduced motion: final state.
 */
const css = `
.sc-stage{container-type:inline-size}
.sc-in{opacity:0;animation:sc-in .38s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes sc-in{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}
.sc-typing{opacity:0;animation:sc-show .2s ease forwards,sc-hide .2s ease forwards}
@keyframes sc-show{to{opacity:1}}
@keyframes sc-hide{to{opacity:0}}
.sc-dot{animation:sc-bounce .8s ease-in-out infinite}
@keyframes sc-bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-2px);opacity:1}}
.sc-ring{animation:sc-spin 40s linear infinite}
@keyframes sc-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){
  .sc-in,.sc-typing,.sc-dot,.sc-ring{animation:none!important}
  .sc-in{opacity:1;transform:none}.sc-typing{opacity:0}
}
`;

const d = (s: number) => ({ animationDelay: `${s}s` });
const fs = (min: number, cqi: number, max: number) => ({ fontSize: `clamp(${min}px, ${cqi}cqi, ${max}px)` });

function Typing({ show, hide }: { show: number; hide: number }) {
  return (
    <span className="sc-typing col-start-1 row-start-1 flex items-center gap-1 self-start justify-self-end rounded-2xl rounded-se-sm bg-[#FCFDFE] px-3 py-2 shadow-[0_2px_8px_-4px_rgba(17,65,103,.4)]" style={{ animationDelay: `${show}s, ${hide}s` }}>
      {[0, 1, 2].map((i) => <span key={i} className="sc-dot h-1.5 w-1.5 rounded-full bg-[#6A8297]" style={d(i * 0.12)} />)}
    </span>
  );
}

function Plan({ morning, changed }: { morning: string; changed?: boolean }) {
  return (
    <div className="flex flex-col gap-[3px] font-bold" style={fs(11.5, 3.2, 14)}>
      <span className="flex items-center gap-1.5 rounded-lg bg-[#FFF6E3] px-2 py-[2px] text-[#8A5A12]">
        <Sun size={12} className="text-[#E39A1F]" />صباحي ٨–٢
        <span className={`ms-auto font-black ${changed ? "rounded bg-[#D7F0E4] px-1 text-[#0B7A54]" : "text-[#193C5B]"}`}>{morning}</span>
      </span>
      <span className="flex items-center gap-1.5 rounded-lg bg-[#EEF0FD] px-2 py-[2px] text-[#3B3F8F]">
        <Moon size={12} className="text-[#5B62D6]" />مسائي ٣–٩
        <span className="ms-auto font-black text-[#193C5B]">خالد</span>
      </span>
    </div>
  );
}

export function ShiftPlanningVisual({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={`عرض توضيحي ببيانات تجريبية: ${label}. محادثة توضيحية مع مساعد نظامي لترتيب الورديات. يكتب العميل: رتّب ورديات بكرة. يقترح المساعد: الصباحي من ٨ إلى ٢ سارة، والمسائي من ٣ إلى ٩ خالد. يطلب العميل: بدّل سارة بنورة بالصباح. يرد المساعد بمقترح معدّل: الصباحي نورة، والمسائي خالد، بانتظار اعتماد العميل ولم يُنشر.`} data-testid="img-shift-planning" className={`sc-stage relative h-full w-full ${className}`}>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border border-[#D3E7F4] bg-[radial-gradient(circle_at_25%_20%,#E3F1FC,transparent_55%),radial-gradient(circle_at_85%_90%,#E9E9FC,transparent_50%)] bg-[#F6FBFE]" />
      <div aria-hidden="true" className="sc-ring absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#BCDCEF]/70" />

      <div aria-hidden="true" dir="rtl" className="absolute inset-0 flex flex-col p-[2.5%] pb-0">
        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-[#DCEAF4] bg-[#EEF4FA] shadow-[20px_28px_50px_-30px_rgba(17,65,103,.5),0_2px_6px_rgba(17,65,103,.06)]">
          <div className="flex shrink-0 items-center justify-between gap-2 bg-[linear-gradient(120deg,#1A6FE0,#2F8AF0)] px-[4%] py-[2%] text-[#F6FBFE]">
            <span className="flex items-center gap-2 font-black" style={fs(12, 3.5, 16)}>
              <span className="grid h-[1.7em] w-[1.7em] place-items-center rounded-full bg-white/20"><Bot size={14} /></span>مساعد نظامي
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-bold" style={fs(11, 3, 13)}>الورديات</span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-end gap-[2%] px-[3.5%] py-[2.2%]">
            <p className="sc-in self-start rounded-2xl rounded-ss-sm bg-[#1A6FE0] px-3 py-[1.2%] font-bold text-[#F6FBFE]" style={{ ...fs(11.5, 3.3, 14.5), ...d(0.1) }}>رتّب ورديات بكرة</p>

            <div className="grid">
              <Typing show={0.35} hide={0.65} />
              <div className="sc-in col-start-1 row-start-1 justify-self-end rounded-2xl rounded-se-sm bg-[#FCFDFE] p-[1.6%] px-2 font-bold text-[#193C5B] shadow-[0_2px_8px_-4px_rgba(17,65,103,.4)]" style={{ ...fs(11.5, 3.2, 14), ...d(0.65) }}>
                صباحًا سارة · مساءً خالد
              </div>
            </div>

            <p className="sc-in self-start rounded-2xl rounded-ss-sm bg-[#1A6FE0] px-3 py-[1.2%] font-bold text-[#F6FBFE]" style={{ ...fs(11.5, 3.3, 14.5), ...d(1.1) }}>بدّل سارة بنورة بالصباح</p>

            <div className="grid">
              <Typing show={1.35} hide={1.7} />
              <div className="sc-in col-start-1 row-start-1 w-[62%] justify-self-end rounded-2xl rounded-se-sm border border-[#CFE2F6] bg-[#FCFDFE] p-[1.6%] px-2 shadow-[0_8px_20px_-12px_rgba(17,65,103,.5)]" style={d(1.7)}>
                <Plan morning="نورة" changed />
                <p className="sc-in mt-[3px] text-center rounded-full bg-[#FFF3D6] py-[1px] font-black text-[#8A5A12]" style={{ ...fs(11, 3, 13), ...d(2.0) }}>بانتظار اعتمادك</p>
              </div>
            </div>
          </div>
        </div>
        <p className="shrink-0 py-[1.4%] text-end font-bold text-[#4A6378]" style={fs(11, 2.6, 12)}>عرض توضيحي · محادثة تجريبية · غير منشور</p>
      </div>
    </div>
  );
}
