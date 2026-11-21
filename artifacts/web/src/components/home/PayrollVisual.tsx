import { CalendarCheck, FileClock, Hourglass, Minus, Plus, ReceiptText, Users } from "lucide-react";

/*
 * Illustrative demo only: sample employee, no transfers, no banking, no backend, no controls.
 * Timeline completes by ~2.3s then holds. Reduced motion: final state.
 * Sample math: 6,000 + 1,500 − 200 (one absence day = 6,000/30) = 7,300.
 */
const css = `
.pr-stage{container-type:inline-size}
.pr-card{animation:pr-float 8s ease-in-out infinite}
@keyframes pr-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.pr-in{opacity:0;animation:pr-in .42s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes pr-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
.pr-bar{transform:scaleX(0);transform-origin:right;animation:pr-bar .8s cubic-bezier(.3,.7,.2,1) forwards}
@keyframes pr-bar{to{transform:scaleX(1)}}
.pr-pop{opacity:0;animation:pr-pop .45s cubic-bezier(.3,1.5,.5,1) forwards}
@keyframes pr-pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
.pr-pulse{animation:pr-pulse 1.8s ease-in-out infinite}
@keyframes pr-pulse{0%,100%{opacity:1}50%{opacity:.35}}
.pr-ring{animation:pr-spin 40s linear infinite}
@keyframes pr-spin{to{transform:rotate(360deg)}}
@container (max-width: 400px){
  .pr-pad{padding:3px!important}
  .pr-head{padding-top:4px!important;padding-bottom:4px!important}
  .pr-body{padding:5px 7px!important;gap:4px!important}
  .pr-att{padding:4px 6px!important}
  .pr-calc{padding:5px 7px!important}
  .pr-line{padding-top:1px!important;padding-bottom:1px!important}
  .pr-net{padding:4px 7px!important;margin-top:3px!important}
  .pr-foot{padding:4px 7px!important}
}
@container (max-width: 360px){ .pr-hide{display:none!important} }
@media (prefers-reduced-motion: reduce){
  .pr-card,.pr-in,.pr-bar,.pr-pop,.pr-pulse,.pr-ring{animation:none!important}
  .pr-in,.pr-pop{opacity:1}.pr-bar{transform:none}
}
`;

const d = (s: number) => ({ animationDelay: `${s}s` });
const fs = (min: number, cqi: number, max: number) => ({ fontSize: `clamp(${min}px, ${cqi}cqi, ${max}px)` });

const lines = [
  { label: "الراتب الأساسي", value: "٦٬٠٠٠", Icon: null, cls: "text-[#193C5B]" },
  { label: "بدل سكن", value: "١٬٥٠٠", Icon: Plus, cls: "text-[#0E8A5F]" },
  { label: "خصم غياب يوم", value: "٢٠٠", Icon: Minus, cls: "text-[#C2414B]" },
];

export function PayrollVisual({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={`عرض توضيحي ببيانات تجريبية: ${label}. تجهيز رواتب شهر مارس من سجل الحضور. مثال لموظف تجريبي: الراتب الأساسي ٦٠٠٠ ريال، زائد بدل سكن ١٥٠٠، ناقص خصم غياب يوم ٢٠٠، الصافي ٧٣٠٠ ريال. المسير بانتظار المراجعة ولم يُصرف.`} data-testid="img-payroll" className={`pr-stage relative h-full w-full ${className}`}>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border border-[#D3E7F4] bg-[radial-gradient(circle_at_25%_20%,#E3F1FC,transparent_55%),radial-gradient(circle_at_85%_90%,#DDF5EC,transparent_50%)] bg-[#F6FBFE]" />
      <div aria-hidden="true" className="pr-ring absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#BCDCEF]/80" />

      <span aria-hidden="true" className="absolute bottom-[3%] end-[3%] z-20 rounded-full border border-[#C8E1F1] bg-[#FCFDFE]/90 px-2 py-0.5 font-bold text-[#4A6378]" style={fs(8.5, 2.4, 11)}>
        عرض توضيحي · بيانات تجريبية
      </span>

      <div aria-hidden="true" dir="rtl" className="pr-pad absolute inset-0 flex items-center justify-center p-[4%]">
        <div className="pr-card relative flex h-full min-h-0 w-[min(100%,26rem)] flex-col overflow-hidden rounded-[1.4rem] border border-[#DCEAF4] bg-[#FCFDFE] shadow-[26px_34px_60px_-30px_rgba(17,65,103,.55),0_2px_6px_rgba(17,65,103,.06)]">
          {/* header */}
          <div className="pr-head relative flex items-center justify-between gap-2 overflow-hidden bg-[linear-gradient(120deg,#13263A,#1D4E86)] px-[4.5%] py-[2.6%] text-[#F6FBFE]">
            <span className="absolute -start-6 -top-8 h-20 w-20 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-2">
              <span className="grid h-[clamp(22px,7.5cqi,32px)] w-[clamp(22px,7.5cqi,32px)] place-items-center rounded-xl bg-white/15"><ReceiptText size={15} /></span>
              <div className="leading-tight">
                <p className="font-black" style={fs(11.5, 3.6, 15)}>مسير رواتب مارس</p>
                <p className="font-medium text-[#A9C4DD]" style={fs(8.5, 2.5, 11)}>يُجهَّز من الحضور</p>
              </div>
            </div>
            <span className="relative flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 font-bold" style={fs(8.5, 2.5, 11)}>
              <Users size={11} />١٢ موظف
            </span>
          </div>

          <div className="pr-body flex min-h-0 flex-1 flex-col justify-between gap-[2.2%] bg-[#F7FAFD] px-[4.5%] py-[2.6%]">
            {/* attendance source */}
            <div className="pr-in pr-att rounded-xl border border-[#E2EDF5] bg-[#FCFDFE] px-2.5 py-1.5" style={d(0.1)}>
              <div className="flex items-center justify-between font-bold text-[#193C5B]" style={fs(9.5, 2.8, 12)}>
                <span className="flex items-center gap-1"><CalendarCheck size={12} className="text-[#1A6FE0]" />سحب أيام الحضور</span>
                <span className="text-[#4A6378]">٢٩ / ٣٠ يوم</span>
              </div>
              <div className="mt-1 h-[clamp(3px,1cqi,5px)] overflow-hidden rounded-full bg-[#E6EEF5]">
                <div className="h-full" style={{ width: "96.7%" }}>
                  <div className="pr-bar h-full rounded-full bg-[linear-gradient(270deg,#1A6FE0,#5AA2F5)]" style={d(0.3)} />
                </div>
              </div>
            </div>

            {/* sample calc */}
            <div className="pr-in pr-calc rounded-xl border border-[#E2EDF5] bg-[#FCFDFE] px-2.5 py-1.5 shadow-[0_10px_24px_-18px_rgba(17,65,103,.5)]" style={d(0.7)}>
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#1FB8E8,#1689DC)] font-black text-[#FCFDFE]" style={fs(8.5, 2.5, 11)}>ف</span>
                <p className="font-black text-[#193C5B]" style={fs(10, 3, 13)}>فهد · موظف تجريبي</p>
              </div>
              {lines.map(({ label: l, value, Icon, cls }, i) => (
                <div key={l} className="pr-in pr-line flex items-center justify-between border-b border-dashed border-[#E6EEF5] py-0.5 last:border-0" style={d(0.95 + i * 0.22)}>
                  <span className="flex items-center gap-1 font-medium text-[#4A6378]" style={fs(9, 2.7, 12)}>
                    {Icon ? <Icon size={10} className={cls} /> : <span className="inline-block w-[10px]" />}{l}
                  </span>
                  <span className={`font-black tabular-nums ${cls}`} style={fs(9.5, 2.9, 12.5)}>{value}</span>
                </div>
              ))}
              <div className="pr-pop pr-net mt-1 flex items-center justify-between rounded-lg bg-[#13263A] px-2.5 py-1 text-[#E6F4FB]" style={d(1.7)}>
                <span className="font-bold text-[#9DB6CB]" style={fs(9, 2.7, 12)}>= الصافي</span>
                <span className="font-black text-[#6FE3B4]" style={fs(11, 3.4, 15)}>٧٬٣٠٠ ر.س</span>
              </div>
            </div>
          </div>

          {/* status */}
          <div className="pr-in pr-foot flex shrink-0 items-center justify-between gap-2 border-t border-[#F3E6C2] bg-[#FFFCF4] px-[4.5%] py-[2.2%]" style={d(2.0)}>
            <span className="flex items-center gap-1.5 font-bold text-[#8A5A12]" style={fs(9, 2.7, 12)}>
              <Hourglass size={12} className="text-[#D9901E]" />بانتظار المراجعة
              <span className="pr-pulse h-1.5 w-1.5 rounded-full bg-[#E9A23B]" />
            </span>
            <span className="pr-hide flex items-center gap-1 font-medium text-[#6A8297]" style={fs(8.5, 2.5, 11)}>
              <FileClock size={11} />لم يُصرف بعد
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
