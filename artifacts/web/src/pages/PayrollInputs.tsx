import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/lib/i18n";
import content from "./payrollPageContent.json";
import { C, Faq, FinalCta, Heading, Hero, Reveal, Section, StoryStyles, card } from "./storyKit";

type Labels = (typeof content)["ar"]["labels"];

const BASE = 6000, HOUSING = 1500, PER_DAY = 200; // sample data from the homepage illustration

const fmt = (n: number, lang: "ar" | "en") => n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");

/** A sample payroll run; the absence deduction follows the number of absent days. */
function RunCard({ days, l, lang, float }: { days: number; l: Labels; lang: "ar" | "en"; float?: boolean }) {
  const deduction = days * PER_DAY;
  const net = BASE + HOUSING - deduction;
  const row = "flex items-center justify-between py-3";
  return (
    <div className={`${float ? "st-float" : ""} mx-auto w-full max-w-sm rounded-[1.8rem] p-6`} style={{ ...card, ["--r" as string]: "1.5deg" }}>
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-black">{l.title}</p>
        <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: C.tint, color: C.blue }}>{l.sample}</span>
      </div>
      <dl className="mt-3 divide-y" style={{ borderColor: C.line }}>
        <div className={row}><dt style={{ color: C.sub }}>{l.base}</dt><dd className="font-black">{fmt(BASE, lang)} {l.currency}</dd></div>
        <div className={row}><dt style={{ color: C.sub }}>{l.housing}</dt><dd className="font-black">+ {fmt(HOUSING, lang)}</dd></div>
        <div className={row}><dt style={{ color: C.sub }}>{l.absence}</dt><dd className="font-black transition-colors" style={{ color: days ? C.bad : C.ink }}>− {fmt(deduction, lang)}</dd></div>
        <div className={row}><dt className="font-heading text-lg font-black">{l.net}</dt><dd key={net} className="st-pop font-heading text-2xl font-black" style={{ color: C.blue }}>{fmt(net, lang)} {l.currency}</dd></div>
      </dl>
      <p className="mt-3 rounded-xl px-3 py-2 text-center text-sm font-black" style={{ background: "#FFF6DA", color: "#7A5A00" }}>{l.status}</p>
    </div>
  );
}

export function PayrollInputs() {
  const { language } = useLanguage();
  const lang = language as "ar" | "en";
  const t = content[lang];
  const [days, setDays] = useState(1);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-[100dvh] overflow-hidden bg-white font-sans" style={{ color: C.ink }}>
      <SeoHead page="payrollInputsService" />
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <StoryStyles />
        <Hero lang={lang} kicker={t.kicker} title={t.title} hot={t.hot} sub={t.sub} points={t.points} cta={t.cta}
          visual={<RunCard days={1} l={t.labels} lang={lang} float />} />

        <Section tone="white">
          <Heading kicker={t.demoKicker} title={t.demoTitle} intro={t.demoIntro} />
          <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl p-6" style={card}>
                <p className="font-heading text-lg font-black">{t.labels.days}</p>
                <div className="mt-4 flex items-center gap-4">
                  <button type="button" aria-label="−" onClick={() => setDays((d) => Math.max(0, d - 1))} className="h-12 w-12 rounded-full text-2xl font-black text-white disabled:opacity-40" style={{ background: C.ink }} disabled={days === 0}>−</button>
                  <output aria-live="polite" className="min-w-12 text-center font-heading text-4xl font-black">{fmt(days, lang)}</output>
                  <button type="button" aria-label="+" onClick={() => setDays((d) => Math.min(5, d + 1))} className="h-12 w-12 rounded-full text-2xl font-black text-white disabled:opacity-40" style={{ background: C.blue }} disabled={days === 5}>+</button>
                </div>
              </div>
            </Reveal>
            <RunCard days={days} l={t.labels} lang={lang} />
          </div>
        </Section>

        <Section tone="soft">
          <div className="max-w-3xl space-y-10">
            {t.sections.map((s) => (
              <Reveal key={s.h}>
                <article>
                  <h2 className="font-heading text-2xl font-black sm:text-3xl">{s.h}</h2>
                  <p className="mt-3 text-lg leading-9" style={{ color: C.sub }}>{s.p}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <h2 className="mt-14 font-heading text-2xl font-black sm:text-3xl">{t.faqTitle}</h2>
          <Faq items={t.faqs} />
        </Section>

        <FinalCta lang={lang} title={t.ctaTitle} sub={t.ctaSub} cta={t.ctaBtn} note={t.note} />
      </main>
      <Footer />
    </div>
  );
}
