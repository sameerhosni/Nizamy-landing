import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { Lang } from "./hrBlogRegistry";
import info from "./informationPagesContent.json";
import { C, Cards, FinalCta, Heading, Hero, Section, StoryStyles, base, card } from "./storyKit";

type Sec = { id: string; items?: { title: string; text: string }[] };

/** ONE VALUE: everything in one place. */
const t = {
  ar: {
    kicker: "للمنشآت الصغيرة في السعودية",
    title: "كل شي",
    hot: "بمكان واحد",
    sub: "الحضور والطلبات والتقارير والموظفين في تجربة واحدة، بدل جداول ورسائل وأوراق متفرقة.",
    points: ["حضور", "طلبات وموافقات", "تقارير"],
    cta: "جرّب مجانًا",
    tools: ["جدول إكسل", "قروب واتساب", "ورقة ملاحظات", "ملف مستندات", "اتصال هاتفي", "نموذج مطبوع"],
    nowTitle: "ستة أشياء… في مكان واحد",
    ctaTitle: "جرّب نظامي ورتّب فريقك",
    ctaBtn: "جرّب مجانًا",
    ctaSub: "ابدأ بما تحتاجه اليوم، وكبّر وقت ما يكبر فريقك.",
    note: "تعتمد القدرات على الباقة. الرسوم توضيحية، والنتائج تختلف حسب حجم الفريق والاستخدام.",
  },
  en: {
    kicker: "For small businesses in Saudi Arabia",
    title: "Everything",
    hot: "in one place",
    sub: "Attendance, requests, reports and employees in one experience, instead of scattered sheets, chats and papers.",
    points: ["Attendance", "Requests & approvals", "Reports"],
    cta: "Try it free",
    tools: ["Excel sheet", "WhatsApp group", "Sticky note", "Document folder", "Phone call", "Paper form"],
    nowTitle: "Six things… in one place",
    ctaTitle: "Try Nizamy and tidy up your team",
    ctaBtn: "Try it free",
    ctaSub: "Start with what you need today, and grow as your team does.",
    note: "Capabilities depend on the plan. Graphics are illustrative, and outcomes vary with team size and usage.",
  },
};

const messy: [number, number, number][] = [[2, 4, -9], [60, 0, 7], [31, 32, 4], [66, 46, -6], [3, 56, 8], [37, 64, -4]];
const tidy: [number, number, number][] = [0, 1, 2, 3, 4, 5].map((i) => [1.5 + (i % 3) * 33, 6 + Math.floor(i / 3) * 48, 0]);
const toolIcons = ["📊", "💬", "📝", "🗂️", "📞", "🧾"];
const modIcons = ["⏱️", "🙋", "📈", "🎁", "🤖", "🌱"];

/** The desk tidies itself on a loop: scattered tools slide into six Nizamy sections. */
function DeskArt({ tools, mods }: { tools: string[]; mods: string[] }) {
  const [ordered, setOrdered] = useState(true);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setOrdered(false);
    const id = setInterval(() => setOrdered((v) => !v), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative mx-auto h-[19rem] w-full max-w-[22rem] overflow-hidden rounded-[2rem]" style={{ background: ordered ? C.tint : "#EEF1F5", border: `1px solid ${C.line}`, transition: "background .8s" }} role="img" aria-label={`${tools.join(", ")} → ${mods.join(", ")}`}>
      {mods.map((m, i) => {
        const [l, tp, r] = ordered ? tidy[i] : messy[i];
        return (
          <div key={m} className="absolute flex w-[31%] flex-col items-center justify-center rounded-2xl px-1 text-center"
            style={{ left: `${l}%`, top: `${tp}%`, height: "40%", transform: `rotate(${r}deg)`, transition: "all 1s cubic-bezier(.2,.8,.2,1)", transitionDelay: `${i * 70}ms`, background: "#fff", border: `1px solid ${C.line}`, boxShadow: ordered ? "0 10px 20px -14px rgba(22,137,220,.6)" : "0 6px 14px -8px rgba(20,38,61,.3)" }}>
            <span aria-hidden className="text-3xl">{ordered ? modIcons[i] : toolIcons[i]}</span>
            <span className="mt-1.5 text-[11px] font-black leading-tight sm:text-xs" style={{ color: ordered ? C.blue : C.ink }}>{ordered ? m : tools[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SmallBizStory({ lang, details }: { lang: Lang; details?: ReactNode }) {
  const o = t[lang];
  const caps = (info.hrSoftware[lang].sections as Sec[]).find((s) => s.id === "capabilities")!.items ?? [];

  return (
    <div style={{ color: C.ink }}>
      <StoryStyles />
      <Hero lang={lang} kicker={o.kicker} title={o.title} hot={o.hot} sub={o.sub} points={o.points} cta={o.cta}
        visual={<DeskArt tools={o.tools} mods={caps.map((c) => c.title)} />} />

      <Section tone="white">
        <Heading title={o.nowTitle} />
        <Cards items={caps.map((c, i) => ({ ...c, icon: modIcons[i] }))} cols={3} />
      </Section>

      {details}

      <FinalCta lang={lang} title={o.ctaTitle} sub={o.ctaSub} cta={o.ctaBtn} note={o.note} />
    </div>
  );
}
