import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Archive, ArrowLeft, Bot, Fingerprint, Gift, ListChecks, Pause, Play, ScanFace, Settings2, Wallet, type LucideIcon } from "lucide-react";
import content from "@/lib/data/homepageContent.json";
import { chapters, whyCopy } from "@/lib/data/appScreens";
import { PhoneFrame } from "./PhoneFrame";
import { ScreenLightbox } from "./ScreenLightbox";
import { PayrollVisual } from "../PayrollVisual";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const icons: Record<string, LucideIcon> = {
  bot: Bot, face: ScanFace, setup: Settings2, gift: Gift, wallet: Wallet, list: ListChecks, fingerprint: Fingerprint, archive: Archive,
};
type Card = { icon: string; title: string; text: string; href?: string };
const cards = content.solution.cards as Card[];
const cardByIcon = (k: string) => cards.findIndex((c) => c.icon === k);

function Benefit({ idx, compact = false }: { idx: number; compact?: boolean }) {
  const c = cards[idx];
  if (!c) return null;
  const Icon = icons[c.icon] ?? Bot;
  const inner = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        <Icon aria-hidden size={18} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <h3 className="mb-1 font-heading text-[15px] font-bold text-slate-900">{c.title}</h3>
        <p className={`font-medium leading-[1.85] text-slate-500 ${compact ? "text-[12.5px]" : "text-[13px]"}`}>{c.text}</p>
        {c.href && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-bold text-blue-600">
            {whyCopy.learnMore}<ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
          </span>
        )}
      </div>
    </div>
  );
  const cls = "group block h-full rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 text-start shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-blue-100 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]";
  return c.href ? (
    <a href={`${base}${c.href}`} data-testid={`card-solution-${idx}`} className={`${cls} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200`}>{inner}</a>
  ) : (
    <div data-testid={`card-solution-${idx}`} className={cls}>{inner}</div>
  );
}

export function SolutionSection() {
  const s = content.solution;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: 0.15 });
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== "undefined" && document.hidden);
  const rotating = !paused && !reduce && !hidden && inView && lightbox === null;

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % chapters.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active, rotating]);

  useEffect(() => {
    const tab = document.getElementById(`why-tab-${chapters[active].id}`);
    const list = tab?.parentElement;
    if (!tab || !list) return;
    const t = tab.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    if (t.left < l.left || t.right > l.right) {
      list.scrollBy({ left: t.left - l.left - (l.width - t.width) / 2, behavior: reduce ? "auto" : "smooth" });
    }
  }, [active, reduce]);
  const ch = chapters[active];
  const [hero, ...rest] = ch.screens;
  const fade = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

  return (
    <section ref={section} id="features" data-analytics-section="features" data-analytics-name="Features" className="relative overflow-hidden bg-white py-16 sm:py-24 scroll-mt-16">
      <div id="why-nizamy" className="scroll-mt-24" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[28%] mx-auto h-[420px] max-w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(33,150,243,0.12),transparent)]" />
      <div className="container relative mx-auto px-4 sm:px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
          className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <h2 className="font-heading text-3xl font-black text-slate-900 sm:text-5xl">{s.title}</h2>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-500 sm:text-base">{s.subtitle}</p>
        </motion.div>

        <div className="mx-auto max-w-[1080px]">
          {/* chapter tabs */}
          <div role="tablist" aria-label={whyCopy.tabsLabel} className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 lg:justify-center sm:px-0">
            {chapters.map((c, i) => {
              const on = i === active;
              return (
                <button key={c.id} role="tab" type="button" id={`why-tab-${c.id}`} aria-selected={on} aria-controls="why-panel"
                  onClick={() => setActive(i)} data-testid={`tab-why-${c.id}`}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                    e.preventDefault();
                    setPaused(true);
                    const next = (i + (e.key === "ArrowLeft" ? 1 : -1) + chapters.length) % chapters.length;
                    setActive(next);
                    document.getElementById(`why-tab-${chapters[next].id}`)?.focus();
                  }}
                  tabIndex={on ? 0 : -1}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${on ? "border-[#0f1b3d] bg-[#0f1b3d] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"}`}>
                  <span className={`text-[11px] ${on ? "text-blue-300" : "text-slate-400"}`}>{c.index}</span>{c.tab}
                </button>
              );
            })}
          </div>
          {!reduce && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span>{whyCopy.rotation}</span>
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? whyCopy.play : whyCopy.pause}
                className="rounded-full border border-slate-200 p-2 text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
          )}

          {/* stage */}
          <div id="why-panel" role="tabpanel" aria-labelledby={`why-tab-${ch.id}`}
            className="mt-6 rounded-[2rem] border border-slate-100 bg-gradient-to-br from-[#F2F7FE] via-white to-[#F7F4EC] p-4 sm:mt-8 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={ch.id} {...fade} transition={{ duration: reduce ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
                {/* message + benefits */}
                <div className="order-2 md:order-1">
                  <div className="mb-1 text-[12px] font-bold text-blue-600">{ch.index} / {ch.id === "payroll" ? "عرض توضيحي · بيانات تجريبية" : ch.id === "attendance" ? "من التطبيق · محاكاة توضيحية لمسح الوجه" : whyCopy.realScreens}</div>
                  <p className="font-heading text-xl font-black leading-[1.45] text-slate-900 sm:text-[1.7rem]">{ch.headline}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                    {ch.benefits.map((k) => <Benefit key={k} idx={cardByIcon(k)} />)}
                  </div>
                  {rest.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-2 text-[12px] font-bold text-slate-400">{whyCopy.moreScreens}</div>
                      <div className="flex flex-wrap gap-2">
                        {rest.map((sc, i) => (
                          <button key={sc.n} type="button" onClick={() => setLightbox(i + 1)} data-testid={`button-screen-chip-${sc.n}`}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                            {sc.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* device stack */}
                {ch.id === "payroll" ? (
                  <div className="order-1 mx-auto h-[390px] w-full max-w-[340px] md:order-2 md:w-[300px] lg:w-[340px]">
                    <PayrollVisual label="تجهيز الرواتب من الحضور" />
                  </div>
                ) : hero && (
                <div className="relative order-1 mx-auto flex items-end justify-center md:order-2">
                  {rest.slice(0, 2).map((sc, i) => (
                    <PhoneFrame key={sc.n} screen={sc} size="sm" enlargeLabel={whyCopy.enlarge} onOpen={() => setLightbox(i + 1)}
                      className={`hidden w-[118px] shrink-0 sm:block ${i === 0 ? "-me-8 mb-6 -rotate-6" : "-ms-8 mb-6 rotate-6 order-last"} opacity-90 transition-opacity hover:opacity-100`} />
                  ))}
                  <PhoneFrame screen={hero} enlargeLabel={whyCopy.enlarge} onOpen={() => setLightbox(0)} className="relative z-10 w-[190px] shrink-0 sm:w-[230px]" />
                  <span className="absolute -bottom-3 z-20 rounded-full bg-[#0f1b3d] px-3 py-1 text-[11.5px] font-bold text-white shadow-lg">{hero.label}</span>
                </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      <ScreenLightbox screens={ch.screens} index={lightbox} onIndex={setLightbox} />
    </section>
  );
}
