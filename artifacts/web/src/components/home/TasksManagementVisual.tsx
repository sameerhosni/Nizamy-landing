import { Bot, CalendarClock, CheckCircle2, Mic, Play, UserRound } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

/*
 * Illustrative demo only: a sample WhatsApp-style chat with the Nizamy assistant. No backend, no audio, no controls.
 * Text 0.1s → typing 0.4s → "مين المسؤول؟" 0.75s → voice note 1.05s → transcript 1.3s → typing 1.5s → task card 1.85s; final by ~2.3s then holds.
 * Reduced motion: final state.
 */
const css = `
.tc-stage{container-type:inline-size}
.tc-in{opacity:0;animation:tc-in .38s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tc-in{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}
.tc-typing{opacity:0;animation:tc-show .2s ease forwards,tc-hide .2s ease forwards}
@keyframes tc-show{to{opacity:1}}
@keyframes tc-hide{to{opacity:0}}
.tc-dot{animation:tc-bounce .8s ease-in-out infinite}
@keyframes tc-bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-2px);opacity:1}}
.tc-wave{transform:scaleY(.3);transform-origin:center;animation:tc-wave .5s ease forwards}
@keyframes tc-wave{to{transform:none}}
.tc-ring{animation:tc-spin 40s linear infinite}
@keyframes tc-spin{to{transform:rotate(360deg)}}
@container (max-width:400px){
  .tc-chat{gap:3px!important;padding-top:4px!important;padding-bottom:4px!important}
  .tc-transcript{margin-top:2px!important;padding-top:2px!important}
}
@media (prefers-reduced-motion: reduce){
  .tc-in,.tc-typing,.tc-dot,.tc-wave,.tc-ring{animation:none!important}
  .tc-in{opacity:1;transform:none}.tc-typing{opacity:0}.tc-wave{transform:none}
}
`;

const d = (s: number) => ({ animationDelay: `${s}s` });
const fs = (min: number, cqi: number, max: number) => ({ fontSize: `clamp(${min}px, ${cqi}cqi, ${max}px)` });
const wave = [5, 9, 13, 8, 15, 11, 6, 12, 16, 9, 13, 7, 10, 14, 8, 5, 9, 6];

function Typing({ show, hide }: { show: number; hide: number }) {
  return (
    <span className="tc-typing col-start-1 row-start-1 flex items-center gap-1 self-start justify-self-end rounded-2xl rounded-se-sm bg-[#FCFDFE] px-3 py-2 shadow-[0_2px_8px_-4px_rgba(17,65,103,.4)]" style={{ animationDelay: `${show}s, ${hide}s` }}>
      {[0, 1, 2].map((i) => <span key={i} className="tc-dot h-1.5 w-1.5 rounded-full bg-[#6A8297]" style={d(i * 0.12)} />)}
    </span>
  );
}

export function TasksManagementVisual({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={`عرض توضيحي ببيانات تجريبية: ${label}. محادثة توضيحية مع مساعد نظامي عبر واتساب. يكتب العميل: جهّز مهمة متابعة المخزون. يسأل المساعد: مين المسؤول؟ يرسل العميل رسالة صوتية مدتها ٤ ثوانٍ، نصّها: خلّها لخالد، اليوم قبل ٤. يرد المساعد ببطاقة مهمة: متابعة المخزون، المسؤول خالد، الموعد اليوم قبل ٤:٠٠ م، وسيصله التنبيه عبر واتساب.`} data-testid="img-tasks-management" className={`tc-stage relative h-full w-full ${className}`}>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border border-[#D3E7F4] bg-[radial-gradient(circle_at_25%_20%,#E3F1FC,transparent_55%),radial-gradient(circle_at_85%_90%,#E4EBFD,transparent_50%)] bg-[#F6FBFE]" />
      <div aria-hidden="true" className="tc-ring absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#BCDCEF]/70" />

      <div aria-hidden="true" dir="rtl" className="absolute inset-0 flex flex-col p-[2.5%] pb-0">
        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-[#DCEAF4] bg-[#EEF4FA] shadow-[20px_28px_50px_-30px_rgba(17,65,103,.5),0_2px_6px_rgba(17,65,103,.06)]">
          {/* header */}
          <div className="flex shrink-0 items-center justify-between gap-2 bg-[linear-gradient(120deg,#1A6FE0,#2F8AF0)] px-[4%] py-[2%] text-[#F6FBFE]">
            <span className="flex items-center gap-2 font-black" style={fs(12, 3.5, 16)}>
              <span className="grid h-[1.7em] w-[1.7em] place-items-center rounded-full bg-white/20"><Bot size={14} /></span>مساعد نظامي
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[#FCFDFE] px-2.5 py-0.5 font-black text-[#128C4B]" style={fs(11, 3, 13)}><FaWhatsapp size={13} />واتساب</span>
          </div>

          {/* chat */}
          <div className="tc-chat flex min-h-0 flex-1 flex-col justify-end gap-[2.2%] px-[3.5%] py-[2.4%]">
            <p className="tc-in max-w-[80%] self-start rounded-2xl rounded-ss-sm bg-[#1A6FE0] px-3 py-[1.3%] font-bold text-[#F6FBFE]" style={{ ...fs(11.5, 3.3, 14.5), ...d(0.1) }}>جهّز مهمة متابعة المخزون</p>

            <div className="grid">
              <Typing show={0.4} hide={0.75} />
              <p className="tc-in col-start-1 row-start-1 justify-self-end rounded-2xl rounded-se-sm bg-[#FCFDFE] px-3 py-[1.3%] font-bold text-[#193C5B] shadow-[0_2px_8px_-4px_rgba(17,65,103,.4)]" style={{ ...fs(11.5, 3.3, 14.5), ...d(0.75) }}>مين المسؤول؟</p>
            </div>

            {/* voice note */}
            <div className="tc-in w-[64%] self-start rounded-2xl rounded-ss-sm bg-[#1A6FE0] px-2.5 py-[1.2%] text-[#F6FBFE]" style={d(1.05)}>
              <div className="flex items-center gap-2">
                <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-white/25"><Play size={11} fill="currentColor" /></span>
                <span className="flex h-4 flex-1 items-center gap-[2px]">
                  {wave.map((h, i) => <span key={i} className="tc-wave w-[2px] flex-1 rounded-full bg-[#DCEBFC]" style={{ height: h, ...d(1.05 + i * 0.015) }} />)}
                </span>
                <span className="flex items-center gap-0.5 font-bold tabular-nums text-[#DCEBFC]" style={fs(11, 2.8, 12)}><Mic size={11} />٠:٠٤</span>
              </div>
              <p className="tc-in tc-transcript mt-1 border-t border-white/20 pt-1 font-bold" style={{ ...fs(11.5, 3.2, 14), ...d(1.3) }}>«خلّها لخالد، اليوم قبل ٤»</p>
            </div>

            {/* task proposal */}
            <div className="grid">
              <Typing show={1.5} hide={1.85} />
              <div className="tc-in col-start-1 row-start-1 w-[74%] justify-self-end overflow-hidden rounded-2xl rounded-se-sm border border-[#CFE2F6] bg-[#FCFDFE] shadow-[0_8px_20px_-12px_rgba(17,65,103,.5)]" style={d(1.85)}>
                <p className="flex items-center gap-1.5 px-3 pt-[1.6%] font-black text-[#193C5B]" style={fs(12, 3.5, 15)}><CheckCircle2 size={14} className="text-[#0E9F6E]" />مهمة: متابعة المخزون</p>
                <div className="flex items-center gap-3 px-3 pb-[1.4%] pt-0.5 font-bold text-[#4A6378]" style={fs(11, 3, 13)}>
                  <span className="flex items-center gap-1"><UserRound size={12} />خالد</span>
                  <span className="flex items-center gap-1 text-[#8A5A12]"><CalendarClock size={12} />اليوم ٤:٠٠ م</span>
                </div>
                <p className="flex items-center gap-1 bg-[#E9F8F0] px-3 py-[1%] font-bold text-[#0B7A54]" style={fs(11, 2.9, 12.5)}><FaWhatsapp size={12} />سيصله التنبيه عبر واتساب</p>
              </div>
            </div>
          </div>
        </div>
        <p className="shrink-0 py-[1.4%] text-end font-bold text-[#4A6378]" style={fs(11, 2.6, 12)}>عرض توضيحي · محادثة تجريبية</p>
      </div>
    </div>
  );
}
