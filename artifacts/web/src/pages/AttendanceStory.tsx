import type { ReactNode } from "react";
import { useState } from "react";
import type { Lang } from "./hrBlogRegistry";
import { C, FinalCta, Heading, Hero, Reveal, Section, StoryStyles, Tabs, card } from "./storyKit";

type Scenario = "me" | "friend" | "away";

/** ONE VALUE: check-ins you can trust. */
const t = {
  ar: {
    kicker: "الحضور والانصراف",
    title: "حضور",
    hot: "تثق فيه",
    sub: "الوجه يثبت من الذي سجّل، والموقع يثبت أين. تعرف أن الحاضر هو الموظف نفسه.",
    points: ["بصمة وجه من الجوال", "كشف الحيوية", "تحقق من الموقع"],
    cta: "جرّب مجانًا",
    scan: ["الوجه", "الحيوية", "الموقع"],
    demoKicker: "جرّب بنفسك",
    demoTitle: "من يقدر يسجّل الحضور؟",
    tabs: { me: "الموظف نفسه", friend: "زميل بصورة", away: "من خارج الفرع" } as Record<Scenario, string>,
    checks: ["مطابقة الوجه", "كشف الحيوية", "التحقق من الموقع"],
    results: {
      me: ["تم تسجيل الحضور", "الوجه مطابق، والشخص حيّ، والموقع داخل الفرع."],
      friend: ["لم يُسجَّل الحضور", "الصورة لا تجتاز كشف الحيوية ولا تطابق وجه الموظف."],
      away: ["لم يُسجَّل الحضور", "الوجه صحيح لكن الموقع خارج الفرع."],
    } as Record<Scenario, string[]>,
    ok: "نجح", no: "فشل", skip: "لم يُفحص",
    oneLine: ["لا «بصّمني يا فلان»", "لا جهاز بصمة لكل فرع", "لا انتظار نهاية الشهر لتعرف"],
    ctaTitle: "حضور تثق فيه، يبدأ بكرة",
    ctaSub: "ابدأ مجانًا، وتهيئة ذاتية بدون خبرة تقنية.",
    ctaBtn: "ابدأ مجانًا",
    note: "التحقق بالوجه وكشف الحيوية يقلل محاولات التحايل، ولا توجد وسيلة تقنية تلغيها في كل الظروف. التحقق بالوجه وكشف الحيوية قدرة تتوفر في الباقة الأعلى. الرسوم والأمثلة توضيحية.",
  },
  en: {
    kicker: "Attendance",
    title: "Check-ins",
    hot: "you can trust",
    sub: "The face proves who checked in, the location proves where. You know the person present is the employee.",
    points: ["Face check-in from the phone", "Liveness detection", "Location check"],
    cta: "Try it free",
    scan: ["Face", "Liveness", "Location"],
    demoKicker: "Try it yourself",
    demoTitle: "Who gets to check in?",
    tabs: { me: "The employee", friend: "A friend with a photo", away: "Away from the branch" } as Record<Scenario, string>,
    checks: ["Face match", "Liveness", "Location"],
    results: {
      me: ["Check-in recorded", "Face matches, the person is live, and the location is at the branch."],
      friend: ["Not recorded", "The photo fails the liveness check and doesn't match the employee."],
      away: ["Not recorded", "The face is right, but the location is outside the branch."],
    } as Record<Scenario, string[]>,
    ok: "Passed", no: "Failed", skip: "Not checked",
    oneLine: ["No “clock me in, bro”", "No scanner per branch", "No waiting for month-end to find out"],
    ctaTitle: "Check-ins you can trust, starting tomorrow",
    ctaSub: "Start free, with self-guided setup and no technical experience.",
    ctaBtn: "Start free",
    note: "Face and liveness checks reduce misuse attempts; no technology removes them in every situation. Face verification with liveness detection is available in the higher plan. Graphics and examples are illustrative.",
  },
};

// [face, liveness, location]: 1 pass, 0 fail, -1 not checked
const outcome: Record<Scenario, number[]> = { me: [1, 1, 1], friend: [0, 0, -1], away: [1, 1, 0] };

/** Animated face-scan: frame, scan line, three checks ticking one by one, then a big tick. Loops. */
function ScanArt({ labels, rtl }: { labels: string[]; rtl: boolean }) {
  return (
    <div className="st-float mx-auto w-full max-w-[290px]" style={{ ["--r" as string]: "1.5deg" }}>
      <style>{`
        @keyframes sc-line { 0% { transform: translateY(0); opacity: 0 } 6% { opacity: 1 } 40% { transform: translateY(128px); opacity: 1 } 46%,100% { transform: translateY(128px); opacity: 0 } }
        @keyframes sc-row { 0%,38% { opacity: 0; transform: translateX(-10px) } 46%,92% { opacity: 1; transform: none } 100% { opacity: 0 } }
        @keyframes sc-big { 0%,68% { opacity: 0; transform: scale(.3) } 76% { opacity: 1; transform: scale(1.12) } 82%,92% { opacity: 1; transform: scale(1) } 100% { opacity: 0 } }
        @keyframes sc-brk { 0%,100% { opacity: .55 } 40% { opacity: 1 } }
        .sc-line { animation: sc-line 6.5s ease-in-out infinite; }
        .sc-row { animation: sc-row 6.5s infinite; transform-box: fill-box; }
        .sc-big { animation: sc-big 6.5s infinite; transform-origin: 150px 316px; }
        .sc-brk { animation: sc-brk 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .sc-line,.sc-row,.sc-big,.sc-brk { animation: none } .sc-row,.sc-big { opacity: 1 } .sc-line { opacity: 0 } }
      `}</style>
      <svg viewBox="0 0 300 360" role="img" aria-label={labels.join(" · ")} className="h-auto w-full">
        <rect x="30" y="8" width="240" height="344" rx="36" fill="#fff" stroke={C.ink} strokeWidth="6" />
        <rect x="52" y="34" width="196" height="168" rx="18" fill={C.tint} />
        <defs><clipPath id="sc-clip"><rect x="52" y="34" width="196" height="168" rx="18" /></clipPath></defs>
        <g clipPath="url(#sc-clip)">
          <ellipse cx="150" cy="215" rx="70" ry="46" fill="#9BB8D3" />
          <rect x="140" y="148" width="20" height="24" rx="8" fill="#E8B791" />
          <circle cx="150" cy="116" r="38" fill="#EFC3A0" />
          <path d="M112 112c2-30 22-42 40-40 20 2 36 16 36 40-10-14-22-20-38-20-16 0-28 6-38 20z" fill="#33445A" />
          <circle cx="137" cy="120" r="3.2" fill={C.ink} /><circle cx="163" cy="120" r="3.2" fill={C.ink} />
          <path d="M140 138q10 8 20 0" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect className="sc-line" x="52" y="46" width="196" height="4" rx="2" fill={C.blue} />
        </g>
        {[[62, 44, 1, 1], [238, 44, -1, 1], [62, 192, 1, -1], [238, 192, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} className="sc-brk" d={`M${x} ${y + 18 * sy}V${y}H${x + 18 * sx}`} stroke={C.blue} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {labels.map((l, i) => (
          <g key={l} className="sc-row" style={{ animationDelay: `${i * 0.5}s` }}>
            <rect x="52" y={218 + i * 30} width="196" height="24" rx="12" fill="#fff" stroke={C.line} />
            <circle cx={rtl ? 232 : 68} cy={230 + i * 30} r="8" fill={C.ok} />
            <path d={`M${(rtl ? 232 : 68) - 4} ${230 + i * 30}l3 3 6-6`} stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x={rtl ? 216 : 86} y={235 + i * 30} fontSize="13" fontWeight="800" fill={C.ink} fontFamily="inherit" direction={rtl ? "rtl" : "ltr"} textAnchor="start">{l}</text>
          </g>
        ))}
        <g className="sc-big">
          <circle cx="150" cy="316" r="22" fill={C.ok} /><path d="M140 316l7 7 14-15" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

export function AttendanceStory({ lang, details }: { lang: Lang; details?: ReactNode }) {
  const o = t[lang];
  const [sc, setSc] = useState<Scenario>("me");
  const [title, text] = o.results[sc];
  const ok = sc === "me";

  return (
    <div style={{ color: C.ink }}>
      <StoryStyles />
      <Hero lang={lang} kicker={o.kicker} title={o.title} hot={o.hot} sub={o.sub} points={o.points} cta={o.cta} visual={<ScanArt labels={o.scan} rtl={lang === "ar"} />} />

      <Section tone="white">
        <Heading kicker={o.demoKicker} title={o.demoTitle} />
        <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
          <div>
            <Tabs<Scenario> value={sc} onChange={setSc} label={o.demoTitle} options={(Object.keys(o.tabs) as Scenario[]).map((id) => ({ id, label: o.tabs[id] }))} />
            <ul className="mt-6 space-y-3">
              {o.checks.map((label, i) => {
                const s = outcome[sc][i];
                return (
                  <li key={label + sc} className="st-pop flex items-center justify-between rounded-2xl px-5 py-4" style={{ ...card, animationDelay: `${i * 160}ms` }}>
                    <span className="font-heading text-lg font-black">{label}</span>
                    <span className="rounded-full px-3 py-1 text-sm font-black" style={{ background: s === 1 ? "#E3F6EE" : s === 0 ? "#FCE8E8" : "#EEF2F6", color: s === 1 ? C.ok : s === 0 ? C.bad : C.sub }}>
                      {s === 1 ? `✓ ${o.ok}` : s === 0 ? `✕ ${o.no}` : `— ${o.skip}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div key={sc} className="st-pop rounded-3xl p-7 text-center" style={{ background: ok ? "#EAF8F2" : "#FDF0F0", border: `1px solid ${ok ? "#BFE6D3" : "#F3C9C9"}` }}>
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl text-white ${ok ? "st-ring" : ""}`} style={{ background: ok ? C.ok : C.bad }}>{ok ? "✓" : "✕"}</div>
            <h3 className="mt-5 font-heading text-2xl font-black">{title}</h3>
            <p className="mt-2 text-base leading-8" style={{ color: C.sub }}>{text}</p>
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-4 sm:grid-cols-3">
          {o.oneLine.map((x, i) => (
            <Reveal key={x} delay={i * 90}>
              <p className="st-lift h-full rounded-3xl p-6 text-center font-heading text-xl font-black leading-snug" style={card}>{x}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {details}

      <FinalCta lang={lang} title={o.ctaTitle} sub={o.ctaSub} cta={o.ctaBtn} note={o.note} />
    </div>
  );
}
