import { Maximize2 } from "lucide-react";
import { provenResultsContent } from "@/lib/data/provenResults";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const toAr = (s: string) => s.replace(/pp/g, " نقطة مئوية");

export function ReturnEvidence() {
  const t = provenResultsContent.ar;
  const src = (p: string) => `${import.meta.env.BASE_URL}${p}`;

  return (
    <div dir="rtl" className="max-w-5xl mx-auto -mt-10 mb-16" data-testid="return-evidence">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {t.stats.map((s, i) => (
          <div key={i} data-testid={`stat-return-${i}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4">
            <div className="flex items-baseline gap-1.5">
              <span dir="ltr" className="text-3xl font-heading font-black text-blue-600 tabular-nums">{s.prefix}{s.value}</span>
              <span className="text-sm font-bold text-blue-600">نقطة مئوية</span>
            </div>
            <p className="mt-1 text-[15px] font-bold text-slate-900">{s.label}</p>
            <p className="text-xs text-slate-500">{s.sublabel}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {t.charts.map((c, i) => (
          <Dialog key={i}>
            <DialogTrigger asChild>
              <button
                type="button"
                data-testid={`button-expand-chart-${i}`}
                aria-label={`تكبير: ${c.title}`}
                className="group text-right rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_6px_20px_rgb(15,23,42,0.04)] hover:border-blue-200 hover:shadow-[0_10px_28px_rgb(15,23,42,0.08)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="relative h-[160px] rounded-xl bg-slate-50 overflow-hidden">
                  <img src={src(c.image)} alt={c.alt} loading="lazy" className="h-full w-full object-contain" />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 group-hover:text-blue-600">
                    <Maximize2 size={12} /> عرض التقرير
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900">{c.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.caption}</p>
                <p className="text-xs text-blue-700 font-semibold mt-1">{toAr(c.improvementNote)}</p>
              </button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="max-w-5xl w-[calc(100vw-1.5rem)] max-h-[90dvh] overflow-y-auto rounded-2xl p-4 sm:p-6 [&>button]:left-4 [&>button]:right-auto">
              <DialogTitle className="text-base sm:text-lg font-heading font-black text-slate-900 text-right pl-8">{c.title}</DialogTitle>
              <DialogDescription className="text-right text-xs sm:text-sm text-slate-500">
                {c.caption} • {toAr(c.improvementNote)}
              </DialogDescription>
              <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50">
                <img src={src(c.image)} alt={c.alt} className="block min-w-[720px] w-full h-auto" />
              </div>
              <p className="text-xs text-slate-500 text-right leading-relaxed">{t.explanationNote}</p>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <p className="mt-4 text-xs sm:text-[13px] text-slate-500 text-center leading-relaxed max-w-3xl mx-auto">
        {t.evidenceNote} {t.note}
      </p>
    </div>
  );
}
