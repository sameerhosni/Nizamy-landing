import { useState, type ReactNode } from "react";
import type { Lang } from "./hrBlogRegistry";
import stories from "./hrBlogStories.json";
import { C, FinalCta, Heading, Hero, Section, StoryStyles, Tabs, card } from "./storyKit";

// Each story's widget strings have their own shape, so the JSON is read loosely here.
type Loose = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const S = stories as unknown as Record<string, Record<Lang, Loose>>;

export const ideaSlugs = Object.keys(S);
export const isIdeaSlug = (slug: string) => slug in S;

const nf = (n: number, lang: Lang) => n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");

/** Centre card with chips orbiting it. Pure CSS motion; static for reduced-motion. */
function OrbitArt({ center, orbit }: { center: string; orbit: string[] }) {
  return (
    <div className="relative mx-auto h-[19rem] w-[19rem]" aria-hidden>
      <style>{`
        @keyframes or-spin { to { transform: rotate(360deg) } }
        @keyframes or-unspin { from { transform: rotate(calc(-1 * var(--a))) } to { transform: rotate(calc(-1 * var(--a) - 360deg)) } }
        .or-spin { animation: or-spin 22s linear infinite; }
        .or-chip { animation: or-unspin 22s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .or-spin, .or-chip { animation: none } .or-chip { transform: rotate(calc(-1 * var(--a))) } }
      `}</style>
      <div className="absolute inset-4 rounded-full" style={{ background: `radial-gradient(circle, ${C.tint}, #fff 70%)`, border: `1px dashed ${C.line}` }} />
      <div className="or-spin absolute inset-0">
        {orbit.map((e, i) => {
          const a = (360 / orbit.length) * i;
          return (
            <div key={e} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-8.2rem)` }}>
              <span className="or-chip flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ ["--a" as string]: `${a}deg`, background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 10px 20px -12px rgba(20,38,61,.4)" }}>{e}</span>
            </div>
          );
        })}
      </div>
      <div className="st-float absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] text-6xl" style={{ ...card, ["--r" as string]: "2deg" }}>{center}</div>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange, lang }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; lang: Lang }) {
  return (
    <div className="rounded-2xl p-4" style={card}>
      <p className="text-sm font-black" style={{ color: C.sub }}>{label}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button type="button" aria-label="−" disabled={value <= min} onClick={() => onChange(value - 1)} className="h-11 w-11 rounded-full text-xl font-black text-white disabled:opacity-35" style={{ background: C.ink }}>−</button>
        <output aria-live="polite" className="font-heading text-3xl font-black">{nf(value, lang)}</output>
        <button type="button" aria-label="+" disabled={value >= max} onClick={() => onChange(value + 1)} className="h-11 w-11 rounded-full text-xl font-black text-white disabled:opacity-35" style={{ background: C.blue }}>+</button>
      </div>
    </div>
  );
}

/* ---------- 1. payroll readiness ---------- */
function ReadinessWidget({ w, lang }: { w: Loose; lang: Lang }) {
  const items: string[] = w.items;
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  const n = done.filter(Boolean).length;
  const state = n === 0 ? w.states[0] : n < 3 ? w.states[1] : n < items.length ? w.states[2] : w.states[3];
  const R = 54, L = 2 * Math.PI * R;
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={it}>
            <button type="button" role="checkbox" aria-checked={done[i]} onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start font-bold transition-all" style={{ ...card, background: done[i] ? "#EAF8F2" : "#fff", borderColor: done[i] ? "#BFE6D3" : C.line }}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white" style={{ background: done[i] ? C.ok : "#C8D4DF" }}>{done[i] ? "✓" : ""}</span>
              <span className={done[i] ? "line-through opacity-70" : ""}>{it}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="rounded-3xl p-8 text-center" style={card}>
        <svg viewBox="0 0 140 140" className="mx-auto h-44 w-44" role="img" aria-label={`${n}/${items.length}`}>
          <circle cx="70" cy="70" r={R} fill="none" stroke={C.line} strokeWidth="12" />
          <circle cx="70" cy="70" r={R} fill="none" stroke={n === items.length ? C.ok : C.blue} strokeWidth="12" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - n / items.length)} transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset .6s, stroke .3s" }} />
          <text x="70" y="78" textAnchor="middle" fontSize="28" fontWeight="900" fill={C.ink}>{nf(n, lang)}/{nf(items.length, lang)}</text>
        </svg>
        <p key={state} className="st-pop mt-4 font-heading text-xl font-black">{state}</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">{w.footnote}</p>
      </div>
    </div>
  );
}

/* ---------- 2. Ramadan hours ---------- */
function RamadanWidget({ w, lang }: { w: Loose; lang: Lang }) {
  type Mode = "normal" | "ramadan";
  const caps: Record<Mode, { d: number; w: number }> = { normal: { d: 8, w: 48 }, ramadan: { d: 6, w: 36 } };
  const [mode, setMode] = useState<Mode>("ramadan");
  const [days, setDays] = useState(6);
  const [hours, setHours] = useState(6);
  const cap = caps[mode];
  const weekly = days * hours;
  const ok = hours <= cap.d && weekly <= cap.w;
  const pct = Math.min(100, (weekly / cap.w) * 100);
  return (
    <div>
      <Tabs<Mode> value={mode} onChange={(m) => { setMode(m); setHours(caps[m].d); }} label={w.weekly} options={[{ id: "normal", label: w.normal }, { id: "ramadan", label: w.ramadan }]} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stepper label={w.days} value={days} min={1} max={6} onChange={setDays} lang={lang} />
        <Stepper label={w.hours} value={hours} min={3} max={10} onChange={setHours} lang={lang} />
      </div>
      <div className="mt-6 rounded-3xl p-6" style={card}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="font-heading text-lg font-black">{w.weekly}: <span style={{ color: ok ? C.ok : C.bad }}>{nf(weekly, lang)} {w.perWeek}</span></p>
          <p className="text-sm font-bold" style={{ color: C.sub }}>{w.cap}: {nf(cap.d, lang)} {w.perDay} · {nf(cap.w, lang)} {w.perWeek}</p>
        </div>
        <div className="relative mt-4 h-5 overflow-hidden rounded-full" style={{ background: C.tint }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ok ? C.ok : C.bad, transition: "width .5s, background .3s" }} />
        </div>
        <p key={`${ok}${weekly}`} className="st-pop mt-4 text-lg font-black" style={{ color: ok ? C.ok : C.bad }}>{ok ? w.within : w.over}</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">{w.note}</p>
      </div>
    </div>
  );
}

/* ---------- 3. annual leave ---------- */
function LeaveWidget({ w, lang }: { w: Loose; lang: Lang }) {
  const [years, setYears] = useState(3);
  const days = years >= 5 ? 30 : 21;
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className="rounded-3xl p-6" style={card}>
        <label htmlFor="leave-years" className="font-heading text-lg font-black">{w.years}: <span style={{ color: C.blue }}>{nf(years, lang)} {w.unit}</span></label>
        <input id="leave-years" type="range" min={0} max={10} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-5 w-full" style={{ accentColor: C.blue }} />
        <ul className="mt-5 space-y-2 text-sm font-bold">
          <li className="rounded-xl px-3 py-2" style={{ background: years < 5 ? C.tint : "transparent", color: years < 5 ? C.ink : C.sub }}>{w.rule21}</li>
          <li className="rounded-xl px-3 py-2" style={{ background: years >= 5 ? C.tint : "transparent", color: years >= 5 ? C.ink : C.sub }}>{w.rule30}</li>
        </ul>
        <p className="mt-4 text-sm font-semibold text-slate-500">{w.note}</p>
      </div>
      <div className="rounded-3xl p-6 text-center" style={card}>
        <p className="text-sm font-black" style={{ color: C.sub }}>{w.result}</p>
        <p key={days} className="st-pop font-heading text-6xl font-black" style={{ color: C.blue }}>{nf(days, lang)} <span className="text-2xl">{w.days}</span></p>
        <div className="mt-4 grid grid-cols-10 gap-1.5" aria-hidden>
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="aspect-square rounded-md" style={{ background: i < days ? C.blue : C.tint, transition: "background .3s", transitionDelay: `${i * 8}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. attendance signals ---------- */
function SignalsWidget({ w }: { w: Loose }) {
  const sigs: { id: string; label: string; ask: string[]; do: string }[] = w.signals;
  const [id, setId] = useState(sigs[0].id);
  const s = sigs.find((x) => x.id === id)!;
  return (
    <div>
      <Tabs<string> value={id} onChange={setId} label={w.askTitle} options={sigs.map((x) => ({ id: x.id, label: x.label }))} />
      <div key={id} className="st-pop mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl p-6" style={card}>
          <p className="font-heading text-lg font-black" style={{ color: C.blue }}>{w.askTitle}</p>
          <ul className="mt-3 space-y-2">{s.ask.map((q) => <li key={q} className="rounded-xl px-4 py-2.5 font-bold" style={{ background: C.soft }}>💬 {q}</li>)}</ul>
        </div>
        <div className="rounded-3xl p-6" style={{ background: "#EAF8F2", border: "1px solid #BFE6D3" }}>
          <p className="font-heading text-lg font-black" style={{ color: C.ok }}>{w.doTitle}</p>
          <p className="mt-3 text-lg font-bold leading-8">{s.do}</p>
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{w.note}</p>
    </div>
  );
}

/* ---------- 5. AI starter ladder ---------- */
function LadderWidget({ w, lang }: { w: Loose; lang: Lang }) {
  const steps: { t: string; d: string }[] = w.steps;
  const [i, setI] = useState(0);
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <ol className="flex flex-col-reverse gap-3">
        {steps.map((s, k) => {
          const on = k === i, past = k < i;
          return (
            <li key={s.t} style={{ paddingInlineStart: `${k * 1.2}rem` }}>
              <button type="button" aria-current={on} onClick={() => setI(k)} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start font-heading text-lg font-black transition-all"
                style={{ background: on ? C.ink : past ? C.tint : "#fff", color: on ? "#fff" : C.ink, border: `1px solid ${on ? C.ink : C.line}`, transform: on ? "scale(1.03)" : "none" }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm" style={{ background: on ? C.mark : C.blue, color: on ? C.ink : "#fff" }}>{nf(k + 1, lang)}</span>{s.t}
              </button>
            </li>
          );
        })}
      </ol>
      <div key={i} className="st-pop rounded-3xl p-7" style={card}>
        <p className="text-sm font-black" style={{ color: C.blue }}>{w.step} {nf(i + 1, lang)} / {nf(steps.length, lang)}</p>
        <p className="mt-3 font-heading text-2xl font-black">{steps[i].t}</p>
        <p className="mt-3 text-lg font-semibold leading-8" style={{ color: C.sub }}>{steps[i].d}</p>
      </div>
    </div>
  );
}

/* ---------- 6. end-of-service award ---------- */
function EosbWidget({ w, lang }: { w: Loose; lang: Lang }) {
  type Why = "employer" | "resign";
  const [wage, setWage] = useState(8000);
  const [years, setYears] = useState(6);
  const [why, setWhy] = useState<Why>("employer");
  // Statutory minimum as commonly described for Articles 84-85: half a month's wage per year for the
  // first five years, a full month per year after that; resignation reduces it by length of service.
  const full = Math.min(years, 5) * 0.5 * wage + Math.max(years - 5, 0) * wage;
  const factor = why === "employer" ? 1 : years < 2 ? 0 : years < 5 ? 1 / 3 : years < 10 ? 2 / 3 : 1;
  const award = Math.round(full * factor);
  const factorLabel = factor === 1 ? w.full : factor === 0 ? w.none : factor > 0.5 ? w.twoThirds : w.oneThird;
  return (
    <div className="grid items-start gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <Tabs<Why> value={why} onChange={setWhy} label={w.reason} options={[{ id: "employer", label: w.employer }, { id: "resign", label: w.resign }]} />
        <div className="rounded-3xl p-6" style={card}>
          <label htmlFor="eosb-wage" className="font-heading text-lg font-black">{w.wage}</label>
          <input id="eosb-wage" type="number" inputMode="numeric" min={0} step={100} value={wage} onChange={(e) => setWage(Math.max(0, Number(e.target.value) || 0))} className="mt-3 w-full rounded-2xl px-4 py-3 text-xl font-black" style={{ border: `1px solid ${C.line}`, background: C.soft }} />
          <label htmlFor="eosb-years" className="mt-6 block font-heading text-lg font-black">{w.years}: <span style={{ color: C.blue }}>{nf(years, lang)} {w.unit}</span></label>
          <input id="eosb-years" type="range" min={0} max={20} step={0.5} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-4 w-full" style={{ accentColor: C.blue }} />
        </div>
      </div>
      <div className="rounded-3xl p-7 text-center" style={card}>
        <p className="text-sm font-black" style={{ color: C.sub }}>{w.result}</p>
        <p key={award} className="st-pop mt-2 font-heading text-5xl font-black" style={{ color: C.blue }}>{nf(award, lang)} <span className="text-xl">{w.currency}</span></p>
        <ul className="mt-5 space-y-2 text-start text-sm font-bold" style={{ color: C.sub }}>
          <li className="flex justify-between rounded-xl px-3 py-2" style={{ background: C.soft }}><span>{w.base}</span><span>{nf(Math.round(full), lang)}</span></li>
          <li className="flex justify-between rounded-xl px-3 py-2" style={{ background: C.soft }}><span>{w.share}</span><span>{factorLabel}</span></li>
        </ul>
        <p className="mt-4 text-sm font-semibold text-slate-500">{w.note}</p>
      </div>
    </div>
  );
}

/* ---------- 7. sick leave pay ---------- */
function SickWidget({ w, lang }: { w: Loose; lang: Lang }) {
  const [days, setDays] = useState(45);
  const t1 = Math.min(days, 30), t2 = Math.min(Math.max(days - 30, 0), 60), t3 = Math.min(Math.max(days - 90, 0), 30);
  const paid = t1 + t2 * 0.75;
  const seg = (n: number, total: number, bg: string, label: string) => (
    <div className="h-full text-center text-xs font-black leading-8 text-white transition-all" style={{ width: `${(n / total) * 100}%`, background: bg }} title={label}>{n > 8 ? nf(n, lang) : ""}</div>
  );
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className="rounded-3xl p-6" style={card}>
        <label htmlFor="sick-days" className="font-heading text-lg font-black">{w.days}: <span style={{ color: C.blue }}>{nf(days, lang)}</span></label>
        <input id="sick-days" type="range" min={0} max={120} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-4 w-full" style={{ accentColor: C.blue }} />
        <div className="mt-5 flex h-8 overflow-hidden rounded-full" style={{ background: C.tint }} aria-hidden>
          {seg(t1, 120, C.ok, w.tier1)}{seg(t2, 120, C.blue, w.tier2)}{seg(t3, 120, "#8896A5", w.tier3)}
        </div>
        <ul className="mt-5 space-y-2 text-sm font-bold">
          {[w.tier1, w.tier2, w.tier3].map((x: string, i: number) => (
            <li key={x} className="rounded-xl px-3 py-2" style={{ background: [t1, t2, t3][i] > 0 ? C.tint : "transparent", color: [t1, t2, t3][i] > 0 ? C.ink : C.sub }}>{x}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-semibold text-slate-500">{w.note}</p>
      </div>
      <div className="rounded-3xl p-6 text-center" style={card}>
        <p className="text-sm font-black" style={{ color: C.sub }}>{w.result}</p>
        <p key={paid} className="st-pop font-heading text-5xl font-black" style={{ color: C.blue }}>{nf(Math.round(paid * 10) / 10, lang)} <span className="text-xl">{w.unitFull}</span></p>
      </div>
    </div>
  );
}

const widgets: Record<string, (p: { w: Loose; lang: Lang }) => ReactNode> = {
  "payroll-readiness-checklist-saudi": (p) => <ReadinessWidget {...p} />,
  "ramadan-working-hours-saudi-attendance": (p) => <RamadanWidget {...p} />,
  "annual-leave-days-saudi-calculator": (p) => <LeaveWidget {...p} />,
  "read-attendance-signals-fairly-saudi": (p) => <SignalsWidget w={p.w} />,
  "ai-hr-small-steps-saudi-teams": (p) => <LadderWidget {...p} />,
  "end-of-service-benefits-calculator-saudi": (p) => <EosbWidget {...p} />,
  "sick-leave-pay-saudi-labor-law": (p) => <SickWidget {...p} />,
};

export function IdeaStory({ slug, lang, details }: { slug: string; lang: Lang; details?: ReactNode }) {
  const t = S[slug][lang];
  return (
    <div style={{ color: C.ink }}>
      <StoryStyles />
      <Hero lang={lang} kicker={t.kicker} title={t.title} hot={t.hot} sub={t.sub} points={t.points} cta={t.cta} visual={<OrbitArt center={t.art.center} orbit={t.art.orbit} />} />
      <Section tone="white">
        <Heading kicker={t.demoKicker} title={t.demoTitle} intro={t.demoIntro} />
        <div className="mt-8">{widgets[slug]({ w: t.widget, lang })}</div>
      </Section>
      {details}
      <FinalCta lang={lang} title={t.ctaTitle} sub={t.ctaSub} cta={t.ctaBtn} note={t.note} />
    </div>
  );
}
