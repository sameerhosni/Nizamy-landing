import { Maximize2 } from "lucide-react";
import { screenHeights, type AppScreen } from "@/lib/data/appScreens";
import { AttendanceScreen } from "./AttendanceScreen";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const screenSrc = (n: number) => `${base}/images/app-screens/screen-${n}.webp`;

type Props = { screen: AppScreen; onOpen: () => void; size?: "lg" | "sm"; enlargeLabel: string; className?: string };

/** A real app screenshot in a slim device frame. Natural aspect ratio, never cropped. */
export function PhoneFrame({ screen, onOpen, size = "lg", enlargeLabel, className = "" }: Props) {
  const lg = size === "lg";
  return (
    <button type="button" onClick={onOpen} data-testid={`button-screen-${screen.n}`} aria-label={`${screen.label} - ${enlargeLabel}`}
      className={`group relative block text-start focus-visible:outline-none ${className}`}>
      <span className={`relative block overflow-hidden bg-[#0f1b3d] shadow-[0_30px_60px_-28px_rgba(15,27,61,0.65)] ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1 group-focus-visible:ring-4 group-focus-visible:ring-blue-300 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${lg ? "rounded-[2rem] p-[6px]" : "rounded-[1.1rem] p-[3px]"}`}>
        {screen.n === 6 || screen.n === 7 ? (
          <AttendanceScreen n={screen.n} label={screen.label} className={lg ? "rounded-[1.6rem]" : "rounded-[0.9rem]"} />
        ) : (
          <img src={screenSrc(screen.n)} alt={screen.label} width={500} height={screenHeights[screen.n]} loading="eager" decoding="async" style={{ aspectRatio: `500 / ${screenHeights[screen.n]}` }} className={`block h-auto w-full bg-white ${lg ? "rounded-[1.6rem]" : "rounded-[0.9rem]"}`} />
        )}
        {lg && (
          <span aria-hidden className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <Maximize2 size={12} />{enlargeLabel}
          </span>
        )}
      </span>
    </button>
  );
}
