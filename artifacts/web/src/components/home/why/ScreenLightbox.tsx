import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { whyCopy, screenHeights, type AppScreen } from "@/lib/data/appScreens";
import { screenSrc } from "./PhoneFrame";
import { AttendanceScreen } from "./AttendanceScreen";

type Props = { screens: AppScreen[]; index: number | null; onIndex: (i: number | null) => void };

export function ScreenLightbox({ screens, index, onIndex }: Props) {
  const current = index === null ? null : screens[index];
  const step = (d: number) => index !== null && onIndex((index + d + screens.length) % screens.length);
  const navBtn = "flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-bold text-slate-600 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200";
  return (
    <Dialog open={current != null} onOpenChange={(o) => !o && onIndex(null)}>
      <DialogContent dir="rtl" className="max-h-[94dvh] w-[calc(100vw_-_1.5rem)] max-w-[440px] gap-3 overflow-y-auto rounded-2xl border-slate-200 bg-[#F4F8FD] p-4 sm:p-5 [&>button:last-child]:hidden">
        {current && (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 text-start">
                <DialogTitle className="font-heading text-lg font-black text-slate-900">{current.label}</DialogTitle>
                <DialogDescription className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{current.description}</DialogDescription>
              </div>
              <DialogClose data-testid="button-close-screen" className="shrink-0 rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                <X size={16} /><span className="sr-only">{whyCopy.close}</span>
              </DialogClose>
            </div>
            {current.n === 6 || current.n === 7 ? (
              <div className="mx-auto w-[min(100%,34dvh)]">
                <AttendanceScreen n={current.n} label={current.label} className="rounded-xl border border-slate-200" />
                <p className="mt-2 text-center text-xs text-slate-500">محاكاة توضيحية لمسح الوجه</p>
              </div>
            ) : (
              <img src={screenSrc(current.n)} alt={current.label} width={500} height={screenHeights[current.n]} className="mx-auto block h-auto max-h-[70dvh] w-auto max-w-full rounded-xl border border-slate-200 bg-white object-contain" />
            )}
            {screens.length > 1 && (
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => step(-1)} data-testid="button-prev-screen" className={navBtn}><ChevronRight size={16} />{whyCopy.prev}</button>
                <span className="text-[12px] font-bold text-slate-400">{(index ?? 0) + 1} / {screens.length}</span>
                <button type="button" onClick={() => step(1)} data-testid="button-next-screen" className={navBtn}>{whyCopy.next}<ChevronLeft size={16} /></button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
