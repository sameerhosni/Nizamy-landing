import { MapPin, ShieldCheck } from "lucide-react";

const css = `
.fs-stage{perspective:1100px}
.fs-phone{transform:rotateY(-14deg) rotateX(6deg) rotateZ(4deg);transform-style:preserve-3d;animation:fs-float 8s ease-in-out infinite}
@keyframes fs-float{0%,100%{transform:rotateY(-14deg) rotateX(6deg) rotateZ(4deg) translateY(0)}50%{transform:rotateY(-9deg) rotateX(4deg) rotateZ(3deg) translateY(-7px)}}
.fs-line{opacity:0;animation:fs-scan 4.2s cubic-bezier(.45,0,.55,1) infinite}
@keyframes fs-scan{0%{transform:translateY(40px);opacity:0}8%{opacity:1}52%{transform:translateY(370px);opacity:1}58%{opacity:0;transform:translateY(370px)}100%{transform:translateY(370px);opacity:0}}
.fs-dot{opacity:0;animation:fs-dot 4.2s ease-out infinite}
@keyframes fs-dot{0%,12%{opacity:0;transform:scale(.4)}30%,80%{opacity:1;transform:scale(1)}94%,100%{opacity:0}}
.fs-oval{animation:fs-dash 4.2s linear infinite}
@keyframes fs-dash{to{stroke-dashoffset:-76}}
.fs-ok{opacity:0;animation:fs-ok 4.2s ease-out infinite}
@keyframes fs-ok{0%,58%{opacity:0;transform:scale(.6)}66%,92%{opacity:1;transform:scale(1)}100%{opacity:0}}
.fs-chip{animation:fs-chip 6s ease-in-out infinite}
.fs-chip2{animation:fs-chip 6s ease-in-out -3s infinite}
@keyframes fs-chip{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.fs-ring{animation:fs-spin 40s linear infinite}
@keyframes fs-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){.fs-phone,.fs-line,.fs-dot,.fs-oval,.fs-ok,.fs-chip,.fs-chip2,.fs-ring{animation:none!important}.fs-dot,.fs-ok{opacity:1}.fs-line{opacity:0}}
`;

const portrait = `${import.meta.env.BASE_URL}images/attendance-realistic-portrait.webp`;
const dots: [number, number][] = [[256, 264], [200, 304], [312, 304], [200, 336], [312, 336], [256, 400], [160, 416], [352, 416], [216, 460], [296, 460], [256, 544]];

export function FaceScanVisual({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="img" aria-label={label} data-testid="img-attendance-face-scan" className={`fs-stage relative mx-auto aspect-square w-full max-w-[420px] ${className}`}>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] border border-[#D3E7F4] bg-[radial-gradient(circle_at_30%_25%,#E3F1FC,transparent_55%),radial-gradient(circle_at_80%_85%,#DDF5FA,transparent_50%)] bg-[#F6FBFE]" />
      <div aria-hidden="true" className="fs-ring absolute inset-[9%] rounded-full border-2 border-dashed border-[#BCDCEF]" />

      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <div className="fs-phone relative h-[74%] w-[45%] rounded-[2.1rem] bg-[linear-gradient(145deg,#3B5873,#14283C_45%,#2B4660)] p-[5px] shadow-[26px_36px_60px_-24px_rgba(17,65,103,.6),inset_0_0_0_1px_rgba(255,255,255,.18)]">
          <span className="absolute -start-[3px] top-[22%] h-8 w-[3px] rounded-s bg-[#2B4660]" />
          <span className="absolute -end-[3px] top-[28%] h-12 w-[3px] rounded-e bg-[#2B4660]" />
          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-[#1B2F45]">
            <svg viewBox="0 0 496 820" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
              <defs>
                <mask id="fs-vignette"><rect width="496" height="820" fill="#fff" /><ellipse cx="256" cy="384" rx="140" ry="188" fill="#000" /></mask>
                <linearGradient id="fs-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5DD3E8" stopOpacity="0" /><stop offset=".85" stopColor="#5DD3E8" stopOpacity=".28" /><stop offset="1" stopColor="#B8F1FA" stopOpacity=".95" /></linearGradient>
                <clipPath id="fs-face"><ellipse cx="256" cy="384" rx="140" ry="188" /></clipPath>
              </defs>
              <image href={portrait} width="496" height="820" preserveAspectRatio="xMidYMid slice" />
              <rect width="496" height="820" fill="#0E1E30" opacity=".42" mask="url(#fs-vignette)" />
              <ellipse className="fs-oval" cx="256" cy="384" rx="140" ry="188" fill="none" stroke="#7FE0F0" strokeWidth="3" strokeDasharray="10 9" />
              <g clipPath="url(#fs-face)">
                <g className="fs-line"><rect x="96" y="150" width="320" height="56" fill="url(#fs-beam)" /><rect x="96" y="204" width="320" height="2.5" fill="#D9F8FD" /></g>
              </g>
              <g stroke="#9BEAF6" strokeWidth="1.4" fill="none" className="fs-dot" style={{ animationDelay: ".55s" }}>
                <path d="M200 304 L200 336 L256 400 L312 336 L312 304 M160 416 L216 460 L256 544 L296 460 L352 416 M216 460 L256 400 L296 460 M200 336 L160 416 M312 336 L352 416 M256 264 L200 304 M256 264 L312 304" opacity=".55" />
              </g>
              {dots.map(([x, y], i) => <circle key={i} className="fs-dot" cx={x} cy={y} r="4" fill="#C9F5FC" stroke="#1689DC" strokeWidth="1.2" style={{ animationDelay: `${0.2 + i * 0.07}s`, transformOrigin: `${x}px ${y}px` }} />)}
              <g className="fs-ok" style={{ transformOrigin: "256px 600px" }}>
                <circle cx="256" cy="600" r="24" fill="#1689DC" stroke="#F6FBFE" strokeWidth="3" />
                <path d="M244 600 l8 8 15-16" stroke="#F6FBFE" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.16),transparent_32%)]" />
            <div className="absolute inset-x-3 top-3 flex items-center justify-between">
              <span className="h-2 w-2 rounded-full bg-[#F06A5B] shadow-[0_0_0_3px_rgba(240,106,91,.25)]" />
              <span className="rounded-full bg-[#0E1E30]/60 px-2 py-0.5 text-[10px] font-bold text-[#E6F4FB] backdrop-blur-sm">تسجيل حضور</span>
            </div>
            <div className="absolute inset-x-0 bottom-[14%] flex justify-center">
              <span className="rounded-full bg-[#0E1E30]/75 px-2.5 py-1 text-[10px] font-bold text-[#E6F4FB] backdrop-blur-sm">ثبت وجهك داخل الإطار</span>
            </div>
            <div className="absolute inset-x-0 bottom-3 flex justify-center"><span className="h-8 w-8 rounded-full border-[3px] border-[#F6FBFE]/85 bg-[#F6FBFE]/25" /></div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="fs-chip absolute end-[4%] top-[58%] flex items-center gap-1.5 rounded-full border border-[#C8E1F1] bg-[#FCFDFE] px-3.5 py-2 text-xs font-bold text-[#193C5B] shadow-[0_14px_30px_-18px_rgba(17,65,103,.5)]">
        <ShieldCheck size={15} className="text-[#1689DC]" />كشف الحيوية
      </div>
      <div aria-hidden="true" className="fs-chip2 absolute start-[5%] top-[22%] flex items-center gap-1.5 rounded-full border border-[#C8E1F1] bg-[#FCFDFE] px-3.5 py-2 text-xs font-bold text-[#193C5B] shadow-[0_14px_30px_-18px_rgba(17,65,103,.5)]">
        <MapPin size={15} className="text-[#1689DC]" />التحقق من الموقع
      </div>
    </div>
  );
}
