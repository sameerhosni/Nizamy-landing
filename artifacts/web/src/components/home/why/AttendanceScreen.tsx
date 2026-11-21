import { motion, useReducedMotion } from "framer-motion";
import { screenHeights } from "@/lib/data/appScreens";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Illustrative portrait and scan overlay; original app screenshots remain untouched. */
export function AttendanceScreen({ n, label, className = "" }: { n: number; label: string; className?: string }) {
  const reduce = useReducedMotion();
  const region = n === 6
    ? { left: "15%", top: "31.3%", width: "69%", height: "34.9%" }
    : { left: "13%", top: "31%", width: "74%", height: "37.2%" };
  return (
    <span className={`relative block overflow-hidden ${className}`} style={{ aspectRatio: `500 / ${screenHeights[n]}` }} role="img" aria-label={`${label} — محاكاة توضيحية لمسح الوجه`}>
      <img src={`${base}/images/app-screens/screen-${n}.webp`} alt="" width={500} height={screenHeights[n]} loading="eager" decoding="async" className="block h-auto w-full" />
      <span aria-hidden className="absolute overflow-hidden rounded-[7%] bg-slate-900" style={region}>
        <img src={`${base}/images/attendance-realistic-portrait.webp`} alt="" loading="eager"
          className="h-full w-full object-cover object-[center_42%]" />
        <span className="absolute inset-0 bg-cyan-950/10" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full fill-none text-cyan-200">
          <ellipse cx="50" cy="51" rx="29" ry="39" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 2" />
          <path d="M7 20V8h12M81 8h12v12M7 80v12h12M81 92h12V80" stroke="currentColor" strokeWidth="1.3" />
          <path d="M29 40L50 34 71 40 63 65 50 73 37 65Z M29 40L37 65 50 54 63 65 71 40M50 34V54L50 73M29 40L50 54 71 40" stroke="currentColor" strokeWidth=".4" opacity=".65" />
          {[ [29,40], [50,34], [71,40], [50,54], [37,65], [63,65], [50,73] ].map(([cx,cy]) =>
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="currentColor" />)}
        </svg>
        <motion.span className="absolute inset-x-[6%] h-[2px] bg-cyan-100 shadow-[0_0_10px_3px_rgba(34,211,238,0.8)]"
          initial={false} animate={{ top: reduce ? "50%" : ["15%", "85%", "15%"] }}
          transition={reduce ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      </span>
    </span>
  );
}
