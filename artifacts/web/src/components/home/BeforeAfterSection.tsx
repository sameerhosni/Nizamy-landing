import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Bot, Fingerprint, MessageCircle, FileSpreadsheet, EyeOff, Clock, Smartphone, ListChecks, TrendingUp, Trophy, Wallet, type LucideIcon } from "lucide-react";
import content from "@/lib/data/homepageContent.json";

const icons: [LucideIcon, LucideIcon][] = [
  [Fingerprint, Smartphone],
  [MessageCircle, Bot],
  [Clock, Bot],
  [EyeOff, Trophy],
  [FileSpreadsheet, Wallet],
  [MessageCircle, ListChecks],
  [Clock, TrendingUp],
];

export function BeforeAfterSection() {
  const b = content.beforeAfter;
  const reduce = useReducedMotion();
  return (
    <section id="before-after" data-analytics-section="before-after" data-analytics-name="Before After"
      className="relative overflow-hidden py-24 sm:py-32 bg-[linear-gradient(180deg,#fff_0%,#F3F8FF_100%)] scroll-mt-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(#cfe0f7_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: reduce ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] tracking-tight text-slate-900">{b.title}</h2>
          <div className="mt-6 inline-flex items-center gap-3 text-sm font-bold">
            <span className="rounded-full bg-slate-100 px-4 py-1.5 text-slate-500 line-through decoration-slate-300">{b.before}</span>
            <ArrowLeft aria-hidden className="h-4 w-4 text-blue-500" />
            <span className="rounded-full bg-blue-600 px-4 py-1.5 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.6)]">{b.after}</span>
          </div>
        </motion.div>

        <ol className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
          {b.rows.map(([before, after], i) => {
            const [BIcon, AIcon] = icons[i] ?? [Clock, Bot];
            return (
              <motion.li key={after} data-testid={`row-before-after-${i}`}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.08 }}
                className="group grid grid-cols-1 md:grid-cols-[1fr_auto_1.15fr] items-stretch gap-2 md:gap-0">
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-3.5 sm:px-5">
                  <span className="sr-only">{b.before}: </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><BIcon aria-hidden size={18} strokeWidth={1.7} /></span>
                  <span className="text-[15px] font-medium text-slate-400 line-through decoration-slate-300/80 decoration-1">{before}</span>
                </div>

                <div aria-hidden className="relative flex items-center justify-center md:w-24 h-6 md:h-auto">
                  <span className="absolute hidden md:block inset-x-2 top-1/2 h-px bg-gradient-to-l from-blue-500 to-slate-200" />
                  <span className="absolute md:hidden inset-y-0 start-8 w-px bg-gradient-to-b from-slate-200 to-blue-500" />
                  <motion.span
                    initial={{ scale: reduce ? 1 : 0.4, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: reduce ? 0 : 0.25 + i * 0.08 }}
                    className="relative hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-white border border-blue-100 text-blue-600 shadow-sm transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                    <ArrowLeft size={16} strokeWidth={2.4} />
                  </motion.span>
                </div>

                <div className="relative flex items-center gap-3 rounded-2xl bg-white border border-blue-100 px-4 py-4 sm:px-5 shadow-[0_10px_30px_-14px_rgba(37,99,235,0.35)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_36px_-14px_rgba(37,99,235,0.45)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <span aria-hidden className="absolute inset-y-3 start-0 w-1 rounded-full bg-blue-600" />
                  <span className="sr-only">{b.after}: </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"><AIcon aria-hidden size={19} strokeWidth={1.9} /></span>
                  <span className="font-heading text-[16px] sm:text-[17px] font-bold text-slate-900">{after}</span>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
