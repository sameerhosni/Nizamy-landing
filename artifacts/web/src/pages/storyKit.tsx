import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";
import type { Lang } from "./hrBlogRegistry";

/** Shared look for the hand-designed HR blog stories: calm brand palette, the creativity is in the ideas. */
export const C = {
  ink: "#14263D",
  sub: "#4D657A",
  blue: "#1689DC",
  tint: "#EAF5FC",
  soft: "#F7FAFD",
  line: "#DCE7F0",
  mark: "#FFE9A8",
  ok: "#1E9E6A",
  bad: "#D64545",
};
export const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const card = { background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 14px 34px -22px rgba(20,38,61,.35)" };

export const useFwd = (lang: Lang) => (lang === "ar" ? ArrowLeft : ArrowRight);

export function StoryStyles() {
  return (
    <style>{`
      @keyframes st-float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)) } 50% { transform: translateY(-9px) rotate(var(--r,0deg)) } }
      @keyframes st-pop { from { opacity: 0; transform: translateY(12px) scale(.97) } to { opacity: 1; transform: none } }
      @keyframes st-blink { 50% { opacity: 0 } }
      @keyframes st-ring { 0% { box-shadow: 0 0 0 0 rgba(22,137,220,.35) } 100% { box-shadow: 0 0 0 16px rgba(22,137,220,0) } }
      .st-float { animation: st-float 5s ease-in-out infinite; }
      .st-pop { animation: st-pop .45s both; }
      .st-caret::after { content: ""; display: inline-block; width: 2px; height: 1em; margin-inline-start: 2px; vertical-align: -2px; background: ${C.blue}; animation: st-blink 1s step-end infinite; }
      .st-ring { animation: st-ring 1.6s ease-out infinite; }
      .st-reveal { opacity: 0; transform: translateY(22px); transition: opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1); }
      .st-in { opacity: 1; transform: none; }
      .st-lift { transition: transform .25s, box-shadow .25s; }
      .st-lift:hover { transform: translateY(-4px); box-shadow: 0 22px 40px -22px rgba(22,137,220,.45); }
      @media (prefers-reduced-motion: reduce) { .st-float,.st-pop,.st-caret::after,.st-ring { animation: none } .st-reveal { opacity: 1; transform: none; transition: none } }
    `}</style>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        setOn(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);
  return <div ref={ref} className={`st-reveal ${on ? "st-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/** Highlighter-pen emphasis: the one "loud" touch, in a soft tone. */
export const Mark = ({ children }: { children: ReactNode }) => (
  <span className="px-1.5" style={{ backgroundImage: `linear-gradient(transparent 52%, ${C.mark} 52%, ${C.mark} 94%, transparent 94%)`, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{children}</span>
);

export function Section({ children, tone = "white", id }: { children: ReactNode; tone?: "white" | "soft" | "tint"; id?: string }) {
  const bg = tone === "white" ? "#fff" : tone === "soft" ? C.soft : C.tint;
  return (
    <section id={id} className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: bg }}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

export function Heading({ kicker, title, intro }: { kicker?: string; title: ReactNode; intro?: string }) {
  return (
    <Reveal>
      {kicker && <p className="mb-3 text-sm font-black" style={{ color: C.blue }}>{kicker}</p>}
      <h2 className="font-heading text-2xl font-black leading-snug sm:text-3xl" style={{ color: C.ink }}>{title}</h2>
      {intro && <p className="mt-4 max-w-3xl text-lg font-semibold leading-8" style={{ color: C.sub }}>{intro}</p>}
    </Reveal>
  );
}

export function Cards({ items, cols = 2 }: { items: { title: string; text: string; icon?: string }[]; cols?: 2 | 3 }) {
  return (
    <div className={`mt-8 grid gap-4 ${cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
      {items.map((it, i) => (
        <Reveal key={it.title} delay={i * 60}>
          <div className="st-lift h-full rounded-3xl p-6" style={card}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white" style={{ background: C.blue }}>{it.icon ?? i + 1}</span>
              <h3 className="font-heading text-xl font-black leading-snug" style={{ color: C.ink }}>{it.title}</h3>
            </div>
            <p className="mt-3 text-base leading-8" style={{ color: C.sub }}>{it.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Numbered path: one connected line, each step with a sentence. */
export function Path({ steps }: { steps: { title: string; text?: string }[] }) {
  return (
    <ol className="relative mt-8 space-y-4 ps-0">
      {steps.map((s, i) => (
        <Reveal key={s.title + i} delay={i * 70}>
          <li className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white" style={{ background: C.blue }}>{i + 1}</span>
              {i < steps.length - 1 && <span className="mt-1 w-px flex-1" style={{ background: C.line, minHeight: "1.5rem" }} />}
            </div>
            <div className="pb-2">
              <h3 className="font-heading text-xl font-black" style={{ color: C.ink }}>{s.title}</h3>
              {s.text && <p className="mt-1 text-base leading-8" style={{ color: C.sub }}>{s.text}</p>}
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mt-8 space-y-3">
      {items.map((f) => (
        <details key={f.q} className="group rounded-2xl px-5" style={card}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-base font-black [&::-webkit-details-marker]:hidden" style={{ color: C.ink }}>
            {f.q}<ChevronDown size={18} aria-hidden className="shrink-0 transition-transform group-open:rotate-180" style={{ color: C.blue }} />
          </summary>
          <p className="pb-5 text-base leading-8" style={{ color: C.sub }}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Hero({ kicker, title, hot, sub, points, cta, visual, lang }: {
  kicker: string; title: string; hot: string; sub: string; points: string[]; cta: string; visual: ReactNode; lang: Lang;
}) {
  const Fwd = useFwd(lang);
  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-12 sm:px-8 sm:pt-16" style={{ background: `linear-gradient(180deg, ${C.tint}, #fff)` }}>
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.15fr_.85fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black" style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.blue }}>
            <span className="h-2 w-2 rounded-full" style={{ background: C.blue }} />{kicker}
          </span>
          <h1 className="mt-6 font-heading text-[2.2rem] font-black leading-[1.45] sm:text-[3.2rem]" style={{ color: C.ink }}>
            {title} <Mark>{hot}</Mark>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-9" style={{ color: C.sub }}>{sub}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {points.map((p) => <li key={p} className="rounded-full px-4 py-1.5 text-sm font-black" style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.ink }}>✓ {p}</li>)}
          </ul>
          <a href={`${base}/#partner`} onClick={() => track("hr_blog_cta_click", { cta: "hero", path: window.location.pathname, language: lang })} className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-black text-white transition-transform hover:-translate-y-0.5" style={{ background: C.blue, boxShadow: "0 14px 28px -14px rgba(22,137,220,.8)" }}>
            {cta}<Fwd size={20} aria-hidden />
          </a>
        </div>
        <div className="relative mx-auto w-full max-w-sm">{visual}</div>
      </div>
    </section>
  );
}

export function FinalCta({ title, sub, cta, note, lang }: { title: string; sub: string; cta: string; note?: string; lang: Lang }) {
  const Fwd = useFwd(lang);
  return (
    <section className="px-5 pb-16 pt-4 sm:px-8" style={{ background: "#fff" }}>
      <Reveal>
        <div className="mx-auto max-w-5xl rounded-[2rem] p-8 text-center sm:p-14" style={{ background: C.ink, color: "#fff" }}>
          <h2 className="font-heading text-2xl font-black leading-tight sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-white/80">{sub}</p>
          <a href={`${base}/#partner`} onClick={() => track("hr_blog_cta_click", { cta: "final", path: window.location.pathname, language: lang })} className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-black transition-transform hover:-translate-y-0.5" style={{ background: C.mark, color: C.ink }}>
            {cta}<Fwd size={20} aria-hidden />
          </a>
        </div>
      </Reveal>
      {note && <p className="mx-auto mt-6 max-w-3xl text-center text-xs font-semibold leading-6 text-slate-500">{note}</p>}
    </section>
  );
}

/** Pill tabs used by the interactive demos. */
export function Tabs<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; label: string }[]; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" role="tab" aria-selected={on} onClick={() => onChange(o.id)}
            className="rounded-full px-5 py-2.5 text-sm font-black transition-all"
            style={on ? { background: C.ink, color: "#fff" } : { background: "#fff", color: C.ink, border: `1px solid ${C.line}` }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
