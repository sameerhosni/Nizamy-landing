import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import content from "@/lib/data/homepageContent.json";
import { AppStoreLinks } from "@/components/ui/AppStoreLinks";
import { HomePricingCards } from "./HomePricingCards";

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div {...reveal} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
      <h2 className="text-3xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] tracking-tight text-slate-900">{title}</h2>
      {subtitle && <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed font-medium">{subtitle}</p>}
    </motion.div>
  );
}

export function ModuleStrip() {
  return (
    <section data-analytics-section="stats" data-analytics-name="Module Strip" className="bg-white py-5 border-b border-slate-100 relative z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="container mx-auto px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[15px] font-bold text-slate-600">
          {content.modules.map((m, i) => (
            <li key={m} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="text-slate-300">·</span>}
              {m}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PainSection() {
  const p = content.pain;
  return (
    <section id="problem" data-analytics-section="problem" data-analytics-name="Problem" className="py-24 sm:py-32 bg-[#FAFAFA] scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHead title={p.title} subtitle={p.subtitle} />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {p.cards.map((c, idx) => (
            <motion.div {...reveal} transition={{ duration: 0.5, delay: idx * 0.1 }} key={c.label}
              className="rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100/60 p-8 sm:p-10 transition-all duration-400">
              <div className="text-sm font-bold text-slate-400 mb-2">{c.label}</div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-blue-600 mb-4">{c.time}</div>
              <p className="text-[17px] text-slate-600 leading-relaxed font-medium">{c.text}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-14 text-center text-xl sm:text-2xl font-heading font-black text-slate-900">{p.closing}</p>
      </div>
    </section>
  );
}

export { SolutionSection } from "./why/WhyNizamySection";

export function HowSection() {
  const h = content.how;
  return (
    <section id="how" data-analytics-section="how" data-analytics-name="How It Works" className="py-24 sm:py-32 bg-[#FAFAFA] scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHead title={h.title} />
        <ol className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {h.steps.map((st, idx) => (
            <motion.li {...reveal} transition={{ duration: 0.5, delay: idx * 0.1 }} key={st.num}
              className="rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 p-8">
              <div className="w-12 h-12 rounded-[16px] bg-blue-50 text-blue-600 flex items-center justify-center mb-6 text-2xl font-heading font-black">{st.num}</div>
              <h3 className="font-heading font-bold text-slate-900 mb-3 text-xl">{st.title}</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed font-medium">{st.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export { BeforeAfterSection } from "./BeforeAfterSection";

export function HomePricing() {
  const p = content.pricing;
  return (
    <section id="pricing" data-analytics-section="pricing" data-analytics-name="Pricing" className="relative bg-[#F4F1EA] py-10 sm:py-12 scroll-mt-20">
      <div className="container mx-auto max-w-[1080px] px-4 sm:px-6">
        <h2 className="mb-6 sm:mb-8 text-center font-heading text-2xl sm:text-3xl font-black leading-snug text-slate-900">{p.title}</h2>
        <HomePricingCards />
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section id="faq" data-analytics-section="faq" data-analytics-name="FAQ" className="py-24 sm:py-32 bg-white scroll-mt-16">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead title={content.faqTitle} />
        <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 sm:px-8">
          {content.faq.map((f, i) => (
            <AccordionItem key={f.question} value={`faq-${i}`} className="last:border-b-0">
              <AccordionTrigger className="text-start text-lg font-heading font-bold text-slate-900 hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="text-[15px] font-medium leading-relaxed text-slate-600">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function FinalCta() {
  const f = content.finalCta;
  return (
    <section data-analytics-section="final-cta" data-analytics-name="Final CTA"
      className="bg-[radial-gradient(ellipse_at_top,#14275a_0%,#0b1838_55%,#091330_100%)] px-4 py-12 sm:px-6 sm:py-16">
      <motion.div {...reveal} transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[1.75rem] bg-[#FDFDFE] px-5 py-12 text-center shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] sm:px-10 sm:py-14">
        <span aria-hidden className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-blue-100/70 sm:h-64 sm:w-64" />
        <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-14 h-52 w-52 rounded-full bg-blue-100/70 sm:h-60 sm:w-60" />
        <span aria-hidden className="absolute right-6 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 4v16M5.1 8l13.8 8M5.1 16l13.8-8" />
          </svg>
        </span>
        <div className="relative">
          <h2 className="font-heading text-3xl font-black leading-[1.2] text-[#0f1b3d] sm:text-[2.6rem]">{f.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium leading-relaxed text-slate-500 sm:text-base">{f.text}</p>
          <AppStoreLinks language="ar" source="home-final-cta" className="mt-7 gap-4 sm:gap-5 [&>a]:rounded-2xl [&>a]:border [&>a]:border-slate-200 [&>a]:bg-white [&>a]:px-3 [&>a]:h-[60px] [&>a]:shadow-[0_6px_16px_-10px_rgba(15,23,42,0.35)] [&>a]:transition-[transform,box-shadow] [&>a:hover]:shadow-[0_10px_22px_-12px_rgba(15,23,42,0.45)]" />
          <p className="mt-5 text-xs font-medium text-slate-400 sm:text-[13px]">{f.footnote}</p>
        </div>
      </motion.div>
    </section>
  );
}
