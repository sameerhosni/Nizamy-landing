import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { Lang } from "./hrBlogRegistry";
import { attendanceContent } from "./AttendanceServiceContent";
import { C, FinalCta, Heading, Hero, Reveal, Section, StoryStyles, Tabs, card } from "./storyKit";

/** ONE VALUE: more time for people. */
const t = {
  ar: {
    kicker: "الذكاء الاصطناعي في الموارد البشرية",
    title: "وقت أكثر",
    hot: "للناس",
    sub: "المساعد يتولى الأسئلة والطلبات المتكررة، وأنت تتفرغ للمواقف التي تحتاج إنسانًا.",
    points: ["مساعد ذكي للموظفين", "طلبات وموافقات", "القرار للإنسان"],
    cta: "ابدأ مجانًا",
    demoKicker: "جرّب بنفسك",
    demoTitle: "اسأل المساعد",
    illustrative: "مثال توضيحي",
    tabs: { docs: "أحتاج خطابًا من HR", leave: "كيف أقدّم طلب إجازة؟", follow: "أين نحتاج متابعة؟" },
    answers: {
      docs: "ابدأ الطلب من الخدمة الذاتية، ويصل للموافقة وتتابع حالته في مكان واحد، بدون رسائل متفرقة.",
      leave: "من الخدمة الذاتية: أرسل الطلب وتابع الموافقة. فريق HR يقضي وقتًا أقل في المتابعة المتكررة.",
    },
    dayKicker: "يوم الـ HR",
    dayTitle: "أين يذهب وقتك؟",
    without: "بدون المساعد",
    withAi: "مع نظامي",
    repeated: "أسئلة وطلبات متكررة",
    people: "وقت للناس",
    dayNote: "رسم توضيحي للفكرة، وليس قياسًا لنتائج فعلية.",
    roles: ["المساعد يجيب", "التقارير تُظهر", "أنت تقرر"],
    ctaTitle: "خلّ الذكاء الاصطناعي يشيل عنك التكرار",
    ctaSub: "ابدأ مجانًا، بدون بطاقة ائتمان.",
    ctaBtn: "ابدأ مجانًا",
    note: "أمثلة التوفير توضيحية وليست ضمانًا، وتختلف النتائج حسب حجم الفريق والاستخدام. يُنصح بمراجعة مخرجات الذكاء الاصطناعي وفق سياسات المنشأة.",
  },
  en: {
    kicker: "AI in HR",
    title: "More time",
    hot: "for people",
    sub: "The assistant takes the repeated questions and requests, so you can focus on moments that need a human.",
    points: ["Smart employee assistant", "Requests & approvals", "Humans decide"],
    cta: "Start free",
    demoKicker: "Try it yourself",
    demoTitle: "Ask the assistant",
    illustrative: "Illustrative example",
    tabs: { docs: "I need a letter from HR", leave: "How do I request leave?", follow: "Where should we follow up?" },
    answers: {
      docs: "Start the request from self-service, send it for approval and follow its status in one place, with no scattered messages.",
      leave: "From self-service: submit the request and follow the approval. HR spends less time on repeated follow-up.",
    },
    dayKicker: "An HR day",
    dayTitle: "Where does your time go?",
    without: "Without the assistant",
    withAi: "With Nizamy",
    repeated: "Repeated questions and requests",
    people: "Time for people",
    dayNote: "An illustration of the idea, not a measurement of actual results.",
    roles: ["The assistant answers", "Reports reveal", "You decide"],
    ctaTitle: "Let AI carry the repetitive stuff",
    ctaSub: "Start free, no credit card required.",
    ctaBtn: "Start free",
    note: "Savings examples are illustrative, not guarantees; outcomes vary with team size and usage. Review AI-generated output in line with your organization's policies.",
  },
};

type Q = "docs" | "leave" | "follow";

function useTyped(text: string) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setN(text.length); return; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), 18);
    return () => clearInterval(id);
  }, [text]);
  return text.slice(0, n);
}

/** Requests fly into the assistant, which sends back a person-moment. Loops. */
function FlowArt() {
  const reqs = [
    { e: "📄", x: -120, d: 0 }, { e: "✉️", x: 110, d: 0.7 }, { e: "🗂️", x: -60, d: 1.4 },
    { e: "📝", x: 70, d: 2.1 }, { e: "📞", x: -140, d: 2.8 }, { e: "🧾", x: 130, d: 3.5 },
  ];
  return (
    <div className="relative mx-auto h-[22rem] w-full max-w-[20rem] overflow-hidden rounded-[2rem]" style={{ background: `linear-gradient(180deg, ${C.tint}, #fff)`, border: `1px solid ${C.line}` }} aria-hidden>
      <style>{`
        @keyframes fa-fly { 0% { opacity: 0; transform: translate(var(--x), -30px) rotate(-12deg) scale(1) } 12% { opacity: 1 } 62% { opacity: 1; transform: translate(0, 170px) rotate(6deg) scale(.55) } 72%,100% { opacity: 0; transform: translate(0, 185px) scale(.15) } }
        @keyframes fa-bot { 0%,100% { transform: translateX(-50%) scale(1) } 50% { transform: translateX(-50%) scale(1.07) } }
        @keyframes fa-heart { 0% { opacity: 0; transform: translateY(0) scale(.4) } 30% { opacity: 1 } 100% { opacity: 0; transform: translateY(-70px) scale(1.15) } }
        .fa-req { position: absolute; top: 0; left: 50%; margin-left: -1.25rem; animation: fa-fly 4.2s ease-in infinite both; }
        .fa-bot { animation: fa-bot 1.4s ease-in-out infinite; }
        .fa-heart { animation: fa-heart 2.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fa-req,.fa-bot,.fa-heart { animation: none } .fa-req { display: none } }
      `}</style>
      {reqs.map((r) => (
        <span key={r.e} className="fa-req flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ ["--x" as string]: `${r.x}px`, animationDelay: `${r.d}s`, background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 8px 16px -10px rgba(20,38,61,.4)" }}>{r.e}</span>
      ))}
      <div className="fa-bot absolute bottom-24 left-1/2 flex h-24 w-24 items-center justify-center rounded-[1.6rem] text-5xl" style={{ background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 18px 30px -16px rgba(22,137,220,.55)" }}>🤖</div>
      {["🤝", "💬", "💙"].map((h, i) => (
        <span key={h} className="fa-heart absolute bottom-48 text-2xl" style={{ left: `${30 + i * 20}%`, animationDelay: `${i * 0.9}s` }}>{h}</span>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: C.tint }} />
    </div>
  );
}

function DayBar({ label, repeated, people, a, b, on }: { label: string; repeated: string; people: string; a: number; b: number; on: boolean }) {
  return (
    <div>
      <p className="mb-2 font-heading text-lg font-black">{label}</p>
      <div className="flex h-14 overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.line}` }}>
        <div className="flex items-center justify-center px-2 text-center text-xs font-black sm:text-sm" style={{ width: on ? `${a}%` : "50%", background: "#E9EDF2", transition: "width 1.1s cubic-bezier(.2,.8,.2,1)" }}>{repeated}</div>
        <div className="flex items-center justify-center px-2 text-center text-xs font-black text-white sm:text-sm" style={{ width: on ? `${b}%` : "50%", background: C.blue, transition: "width 1.1s cubic-bezier(.2,.8,.2,1)" }}>{people}</div>
      </div>
    </div>
  );
}

export function AiHrStory({ lang, details }: { lang: Lang; details?: ReactNode }) {
  const o = t[lang];
  const [q, setQ] = useState<Q>("docs");
  const answer = q === "follow" ? attendanceContent[lang].aiMockAnswer : o.answers[q];
  const typed = useTyped(answer);
  const done = typed.length >= answer.length;
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setOn(true), 600); return () => clearTimeout(id); }, []);

  return (
    <div style={{ color: C.ink }}>
      <StoryStyles />
      <Hero lang={lang} kicker={o.kicker} title={o.title} hot={o.hot} sub={o.sub} points={o.points} cta={o.cta} visual={<FlowArt />} />

      <Section tone="white">
        <Heading kicker={o.dayKicker} title={o.dayTitle} />
        <Reveal>
          <div className="mt-8 space-y-6">
            <DayBar label={o.without} repeated={o.repeated} people={o.people} a={72} b={28} on={true} />
            <DayBar label={o.withAi} repeated={o.repeated} people={o.people} a={22} b={78} on={on} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">{o.dayNote}</p>
        </Reveal>
      </Section>

      <Section tone="soft">
        <Heading kicker={o.demoKicker} title={o.demoTitle} />
        <div className="mt-8">
          <Tabs<Q> value={q} onChange={setQ} label={o.demoTitle} options={(Object.keys(o.tabs) as Q[]).map((id) => ({ id, label: o.tabs[id] }))} />
          <div className="mt-6 rounded-3xl p-6 sm:p-8" style={card}>
            <p className="text-xs font-black" style={{ color: C.blue }}>{o.illustrative}</p>
            <p className="mt-4 inline-block rounded-2xl px-4 py-2.5 text-lg font-bold" style={{ background: C.soft }}>{q === "follow" ? attendanceContent[lang].aiMockQuestion : o.tabs[q]}</p>
            <p className={`mt-4 min-h-[5rem] rounded-2xl px-5 py-4 text-lg font-semibold leading-8 ${done ? "" : "st-caret"}`} style={{ background: C.tint }} aria-live="polite">{typed}</p>
          </div>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {o.roles.map((r, i) => (
            <Reveal key={r} delay={i * 90}><li className="st-lift rounded-3xl p-6 text-center font-heading text-xl font-black" style={card}>{r}</li></Reveal>
          ))}
        </ul>
      </Section>

      {details}

      <FinalCta lang={lang} title={o.ctaTitle} sub={o.ctaSub} cta={o.ctaBtn} note={o.note} />
    </div>
  );
}
