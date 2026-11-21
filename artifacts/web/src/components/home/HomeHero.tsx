import { useEffect, useReducer, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import content from "@/lib/data/homepageContent.json";
import { HERO_INTERVAL_MS, heroReducer, initialHeroState, shouldAutoRotate } from "@/lib/heroRotation";
import { goToStart } from "./homeActions";
import { FaceScanVisual } from "@/components/attendance/FaceScanVisual";
import { RequestsAssistantVisual } from "./RequestsAssistantVisual";
import { RewardsRecognitionVisual } from "./RewardsRecognitionVisual";
import { ReportsAssistantVisual } from "./ReportsAssistantVisual";
import { PayrollVisual } from "./PayrollVisual";
import { TasksManagementVisual } from "./TasksManagementVisual";
import { ShiftPlanningVisual } from "./ShiftPlanningVisual";

const hero = content.hero;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

export function HomeHero() {
  const reduced = usePrefersReducedMotion();
  const [state, dispatch] = useReducer(heroReducer, initialHeroState);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  const rotating = shouldAutoRotate({ reducedMotion: reduced, hidden });
  useEffect(() => {
    if (!rotating) return;
    const id = window.setInterval(() => dispatch({ type: "tick" }), HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [rotating, state]);

  const slide = hero.slides[state.index];
  const wordT = reduced ? { duration: 0 } : { duration: 0.35, ease: "easeOut" as const };
  const imgT = reduced ? { duration: 0 } : { duration: 0.4, ease: "easeOut" as const };

  return (
    <section
      data-analytics-section="hero"
      data-analytics-name="Hero"
      className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 overflow-hidden bg-[#FAFAFA]"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-10 lg:gap-16 items-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut" }}
            className="flex w-full min-w-0 flex-col items-center gap-8 text-center md:items-start md:text-start [container-type:inline-size]"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 px-5 py-2 text-sm font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 motion-safe:animate-pulse" />
              {hero.badge}
            </div>

            <h1 className="w-full text-[clamp(1.2rem,7cqi,3.75rem)] font-heading font-black leading-[1.15] tracking-tight text-slate-900">
              <span className="sr-only">{hero.srLine}</span>
              <span aria-hidden="true" className="block whitespace-nowrap">
                {hero.line1Before}{" "}
                <span className="relative inline-grid align-baseline">
                  {/* Invisible sizers: slot width = longest word, so the line never jumps */}
                  {hero.slides.map((s) => (
                    <span key={s.word} className="invisible col-start-1 row-start-1 px-3">{s.word}</span>
                  ))}
                  <span className="col-start-1 row-start-1 relative overflow-hidden rounded-xl bg-blue-50 text-blue-600">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={slide.word}
                        initial={{ opacity: 0, y: "60%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-60%" }}
                        transition={wordT}
                        className="block px-3 text-center"
                      >
                        {slide.word}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>{" "}
                {hero.line1After}
              </span>
              <span className="block mt-2">{hero.line2}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">{hero.paragraph}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {hero.replacedTools.map((tool) => (
                <span key={tool} className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-sm font-bold text-slate-400 line-through">{tool}</span>
              ))}
              <ArrowLeft aria-hidden size={18} className="text-slate-400" />
              <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-black text-white">{hero.replacement}</span>
            </div>

            <div className="flex w-full flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Button
                size="lg"
                className="h-auto rounded-full bg-blue-600 px-8 py-3 text-base font-black text-white hover:bg-blue-700 shadow-[0_12px_26px_-14px_rgba(37,99,235,0.7)] transition-all duration-300"
                onClick={goToStart}
              >
                {hero.primaryCta}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-auto w-auto rounded-full border-slate-200 bg-white/70 px-6 py-3 text-base font-bold text-slate-600 shadow-none hover:bg-white hover:text-blue-600 transition-all duration-300"
                onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })}
              >
                {hero.secondaryCta}
              </Button>
            </div>

            <p className="text-sm font-bold text-slate-500">{hero.underButtons}</p>
          </motion.div>

          <div className="w-full max-w-xl mx-auto">
            <div className="relative">
              <div className="relative aspect-[4/3] w-full">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={state.index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={imgT}
                    className="absolute inset-0"
                  >
                    {state.index === 0 ? (
                      <FaceScanVisual label={slide.alt} className="!h-full !w-auto !max-w-full" />
                    ) : state.index === 1 ? (
                      <RequestsAssistantVisual label={slide.alt} />
                    ) : state.index === 2 ? (
                      <ReportsAssistantVisual label={slide.alt} />
                    ) : state.index === 3 ? (
                      <RewardsRecognitionVisual label={slide.alt} />
                    ) : state.index === 4 ? (
                      <PayrollVisual label={slide.alt} />
                    ) : state.index === 5 ? (
                      <TasksManagementVisual label={slide.alt} />
                    ) : (
                      <ShiftPlanningVisual label={slide.alt} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div aria-hidden="true" className="hidden xl:flex absolute -top-5 -start-6 lg:-start-10 z-10 items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12)]">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                {slide.cards[0]}
              </div>
              <div aria-hidden="true" className="hidden xl:flex absolute top-1/2 -translate-y-1/2 -end-6 lg:-end-10 z-10 items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12)]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                {slide.cards[1]}
              </div>
              <div aria-hidden="true" className="hidden xl:flex absolute -bottom-5 -start-4 lg:-start-8 z-10 items-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_32px_-4px_rgba(15,23,42,0.25)]">
                {slide.cards[2]}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {hero.slides.map((s, i) => (
                <button
                  key={s.tab}
                  type="button"
                  aria-pressed={state.index === i}
                  onClick={() => dispatch({ type: "select", index: i })}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                    state.index === i ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {s.tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
