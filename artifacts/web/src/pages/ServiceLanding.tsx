import { ArrowLeft, ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SeoHead, type SeoPageKey } from "@/components/SeoHead";
import { track } from "@/lib/analytics";
import { ServiceDownloadBadges } from "@/components/ui/ServiceDownloadBadges";
import { useLanguage } from "@/lib/i18n";
import { ServiceExplorer } from "@/components/service/ServiceExplorer";
import { ServiceStickyCta } from "@/components/service/ServiceStickyCta";
import data from "./serviceLandingContent.json";


type Key = keyof typeof data;
type Section = { id: string; kind: string; heading: string; paragraphs?: string[]; items?: { title: string; text: string }[]; emphasis?: boolean; plans?: string };

function ServiceLanding({ pageKey }: { pageKey: Key }) {
  const { language, dir } = useLanguage();
  const page = data[pageKey];
  const t = page[language];
  const Forward = dir === "rtl" ? ArrowLeft : ArrowRight;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const contact = "#service-enquiry";
  const focusEnquiry = () => setTimeout(() => document.getElementById("service-enquiry")?.focus({ preventScroll: true }), 50);
  const sections = t.sections as Section[];
  const click = (cta: string, destination: string) => () =>
    track("service_page_cta_click", { service_page: pageKey, cta, language, destination });
  const ext = "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1689DC] sm:text-base";

  return (
    <div dir={dir} className="min-h-[100dvh] overflow-hidden pb-16 md:pb-0 bg-[#F7FAFD] font-sans text-[#14263D]">
      <SeoHead page={pageKey as SeoPageKey} />
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="bg-[#EAF5FC] px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
            <div className="max-w-[700px]">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B6DAF1] bg-[#F6FBFE] px-4 py-2 text-xs font-bold text-[#1267A2] sm:text-sm"><span className="h-2 w-2 rounded-full bg-[#2196F3]" />{t.eyebrow}</p>
              <h1 data-testid={`text-${pageKey}-heading`} className="font-heading text-[2.4rem] font-black leading-[1.25] tracking-tight text-[#142D4A] sm:text-[3.4rem] lg:text-[3.8rem]">{t.title}</h1>
              <p className="mt-6 text-lg font-bold leading-[1.8] text-[#2C5373]">{t.intro}</p>
              <p className="mt-7 text-sm font-black text-[#142D4A] sm:text-base">{t.primary}</p>
              <div className="mt-3 max-w-md">
                <ServiceDownloadBadges pageKey={pageKey} placement="hero" />
              </div>
              <a href={contact} onClick={() => { click("hero_contact", "#service-enquiry")(); focusEnquiry(); }} data-testid={`link-${pageKey}-hero-contact`} className={`${ext} mt-3 w-full border border-[#B7D5E9] bg-[#F8FCFF] text-[#24516F] hover:bg-[#E2F2FC] sm:w-auto`}>{t.secondary}</a>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#61798D] sm:text-sm"><ShieldCheck size={16} className="shrink-0 text-[#1689DC]" aria-hidden="true" />{t.storeNote}</p>
              {t.body.map((p) => <p key={p} className="mt-5 max-w-[600px] text-base leading-[1.9] text-[#4D657A]">{p}</p>)}
            </div>
            <div className="mx-auto w-full max-w-[300px]">
              <img src={`${base}${page.image}`} alt={t.imageAlt} width={pageKey === "aiHrService" ? 715 : 358} height={pageKey === "aiHrService" ? 1600 : 637} fetchPriority="high" className="h-auto w-full rounded-[2rem] border-[6px] border-[#193F5D] bg-white shadow-[0_30px_65px_-25px_rgba(17,65,103,.45)]" />
            </div>
          </div>
        </section>

        <ServiceExplorer pageKey={pageKey} />

        {sections.map((s, i) => {
          const tint = i % 2 === 1 ? "bg-[#EAF5FC]" : "";
          if (s.kind === "callout") {
            return <section key={s.id} id={s.id} className="px-5 py-16 sm:px-8 lg:py-24">
              <div className="mx-auto max-w-5xl rounded-[30px] bg-[#153957] p-8 text-[#EFF8FC] sm:p-12">
                <h2 className="font-heading text-3xl font-black leading-snug sm:text-4xl">{s.heading}</h2>
                {s.paragraphs?.map((p) => <p key={p} className="mt-5 text-base leading-8 text-[#C9DDEA] sm:text-lg">{p}</p>)}
                {s.plans && <p className="mt-6 inline-block rounded-full border border-[#426A85] px-4 py-2 text-sm font-bold text-[#DDF3FE]">{s.plans}</p>}
                <div className="mt-8"><a href={`${base}/#pricing`} onClick={click("plans_link", "/#pricing")} data-testid={`link-${pageKey}-plans`} className="inline-flex items-center gap-2 font-bold text-[#8CD1F8] hover:underline">{language === "ar" ? "اطلع على الباقات" : "See the plans"}<Forward size={17} aria-hidden="true" /></a></div>
              </div>
            </section>;
          }
          return <section key={s.id} id={s.id} className={`${tint} px-5 py-16 sm:px-8 lg:py-24`}>
            <div className="mx-auto max-w-5xl">
              <h2 className="max-w-3xl font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-4xl">{s.heading}</h2>
              {s.paragraphs && <div className={`mt-6 max-w-3xl space-y-5 ${s.emphasis ? "border-s-4 border-[#1689DC] ps-5" : ""}`}>{s.paragraphs.map((p) => <p key={p} className="text-base leading-8 text-[#4D657A] sm:text-lg">{p}</p>)}</div>}
              {s.kind === "cards" && <div className="mt-10 grid gap-4 md:grid-cols-2">{s.items?.map((it, n) => <article key={it.title} className="rounded-[24px] border border-[#DCE7F0] bg-[#FCFDFE] p-7"><span className="font-mono text-xs font-bold text-[#1689DC]">0{n + 1}</span><h3 className="mt-3 font-heading text-xl font-black text-[#173451]">{it.title}</h3><p className="mt-3 text-sm leading-7 text-[#597086]">{it.text}</p></article>)}</div>}
              {s.kind === "steps" && <ol className="mt-10 grid gap-3">{s.items?.map((it, n) => <li key={it.title} className="flex gap-4 rounded-2xl border border-[#C9E0EF] bg-[#FCFDFE] p-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1689DC] font-mono text-sm font-bold text-white">{n + 1}</span><div><h3 className="font-heading text-lg font-black text-[#173451]">{it.title}</h3><p className="mt-1 text-sm leading-7 text-[#597086]">{it.text}</p></div></li>)}</ol>}
            </div>
          </section>;
        })}

        <section className="bg-[#EAF5FC] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading text-3xl font-black text-[#142D4A] sm:text-4xl">{t.faqTitle}</h2>
            <div className="mt-8 divide-y divide-[#C9E0EF] border-y border-[#C9E0EF]">
              {t.faqs.map((f, i) => <details key={f.q} className="group">
                <summary data-testid={`toggle-${pageKey}-faq-${i}`} className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-start font-heading text-base font-black text-[#193B57] sm:text-lg [&::-webkit-details-marker]:hidden">{f.q}<ChevronDown size={20} className="shrink-0 text-[#1689DC] transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <p className="pb-6 text-sm leading-8 text-[#5B7488] sm:text-base">{f.a}</p>
              </details>)}
            </div>
          </div>
        </section>

        <section className="bg-[#DDF0FB] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-3xl font-black leading-snug text-[#143552] sm:text-4xl">{t.closing.title}</h2>
            <p className="mt-4 text-sm font-black text-[#1267A2]">{t.closing.primary}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <div className="w-full max-w-md">
                <ServiceDownloadBadges pageKey={pageKey} placement="final" centered />
              </div>
              <a href={contact} onClick={() => { click("final_contact", "#service-enquiry")(); focusEnquiry(); }} data-testid={`link-${pageKey}-final-contact`} className={`${ext} w-full border border-[#9BCDEB] bg-[#F8FCFE] text-[#176D9E] sm:w-auto`}>{t.closing.secondary}</a>
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-xs leading-6 text-[#617F92]">{t.disclaimer}</p>
          </div>
        </section>
      </main>
      <ServiceStickyCta pageKey={pageKey} />
      <Footer />
    </div>
  );
}

export function AiHrService() { return <ServiceLanding pageKey="aiHrService" />; }
export function EmployeeRewardsService() { return <ServiceLanding pageKey="employeeRewardsService" />; }
