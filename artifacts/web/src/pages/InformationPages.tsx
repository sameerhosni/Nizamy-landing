import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SeoHead, type SeoPageKey } from "@/components/SeoHead";
import { ServiceDownloadBadges } from "@/components/ui/ServiceDownloadBadges";
import { useLanguage } from "@/lib/i18n";
import { FaqSearch, HelpTopics, HrSelector, PricingTools } from "@/components/information/InfoWidgets";
import { ui, type Lang } from "@/components/information/informationUi";
import data from "./informationPagesContent.json";
import { useLocation } from "wouter";

type Key = keyof typeof data;
type Sec = { id: string; title: string; paragraphs?: string[]; items?: { title: string; text: string }[] };

function Page({ k, locale }: { k: Key; locale?: Lang }) {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const lang = locale ?? (language === "ar" ? "ar" : "en") as Lang;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const page = data[k]; const t = page[lang] as { title: string; eyebrow: string; intro: string; sections: Sec[]; faqs?: { id: string; category: string; q: string; a: string }[] };
  const u = ui[lang]; const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const Fwd = dir === "rtl" ? ArrowLeft : ArrowRight;
  const legal = k === "privacyPolicy" || k === "biometricSecurity";
  const policyUrl = (l: string) => `https://api.nizamy.app/privacy_policy_${l}.html`;
  const jumpTo = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); const el = document.getElementById(id); const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches; el?.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" }); el?.focus({ preventScroll: true }); };
  return (
    <div dir={dir} className="min-h-[100dvh] overflow-hidden bg-[#F7FAFD] font-sans text-[#14263D]">
      <SeoHead page={(k === "faq" && locale === "en" ? "faqEnglish" : k) as SeoPageKey} languageOverride={locale} />
      <Navbar languageOverride={locale} onLanguageToggle={locale ? () => navigate(locale === "ar" ? "/faq/en" : "/faq/ar") : undefined} />
      <main className="pt-20 sm:pt-24">
        <section className="bg-[#EAF5FC] px-5 pb-14 pt-14 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-5xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B6DAF1] bg-[#F6FBFE] px-4 py-2 text-xs font-bold text-[#1267A2] sm:text-sm"><span className="h-2 w-2 rounded-full bg-[#2196F3]" />{t.eyebrow}</p>
            <h1 data-testid={`text-${k}-heading`} className="font-heading text-[2.2rem] font-black leading-[1.25] text-[#142D4A] sm:text-[3.2rem]">{t.title}</h1>
            <p className="mt-6 max-w-3xl text-lg font-bold leading-[1.8] text-[#2C5373]">{t.intro}</p>
            {k === "pricingPage" && <a href={`${base}/#pricing`} data-testid="link-pricing-active" className="mt-4 inline-flex items-center gap-2 font-black text-[#1267A2] hover:underline">{u.activePlans}<Fwd size={17} aria-hidden="true" /></a>}
            {k === "hrSoftware" && <div className="mt-7 max-w-md"><ServiceDownloadBadges pageKey="hrSoftware" placement="hero" /></div>}
          </div>
        </section>

        {legal && <section className="px-5 pt-10 sm:px-8"><div className="mx-auto max-w-5xl rounded-[28px] bg-[#153957] p-7 text-[#EFF8FC] sm:p-9" data-testid="callout-active-policy">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-black"><ShieldCheck size={22} aria-hidden="true" />{u.activePolicy}</h2><p className="mt-3 text-[#C9DDEA]">{u.activePolicyText}</p>
          <div className="mt-5 flex flex-wrap gap-3"><a href={policyUrl("ar")} target="_blank" rel="noopener noreferrer" data-testid="link-policy-ar" className="rounded-full bg-[#8CD1F8] px-6 py-3 text-sm font-black text-[#143552]">{u.openAr}</a><a href={policyUrl("en")} target="_blank" rel="noopener noreferrer" data-testid="link-policy-en" className="rounded-full border border-[#8CD1F8] px-6 py-3 text-sm font-black text-[#DDF3FE]">{u.openEn}</a></div></div></section>}

        {legal && <nav aria-label={u.jump} data-testid="nav-jump" className="mx-auto mt-8 flex max-w-5xl flex-wrap gap-2 px-5 sm:px-8"><span className="py-2 text-sm font-bold text-[#61798D]">{u.jump}:</span>{t.sections.map((s) => <a key={s.id} href={`#${s.id}`} onClick={jumpTo(s.id)} data-testid={`link-jump-${s.id}`} className="rounded-full border border-[#B7D5E9] bg-white px-4 py-2 text-sm font-bold text-[#24516F]">{s.title}</a>)}</nav>}

        {k === "faq" && <section className="px-5 py-12 sm:px-8"><div className="mx-auto max-w-4xl"><FaqSearch faqs={t.faqs || []} lang={lang} /></div></section>}
        {k === "helpCenter" && <section className="px-5 py-12 sm:px-8"><div className="mx-auto max-w-5xl"><HelpTopics sections={t.sections.filter((x) => x.id.startsWith("topic-"))} lang={lang} /></div></section>}

        {(k === "helpCenter" ? t.sections.filter((x) => !x.id.startsWith("topic-")) : t.sections).map((s, i) => (
          <section key={s.id} id={s.id} tabIndex={-1} className={`${i % 2 ? "bg-[#EAF5FC]" : ""} px-5 py-14 sm:px-8 lg:py-20 scroll-mt-24 focus:outline-none`}>
            <div className="mx-auto max-w-5xl"><h2 className="font-heading text-3xl font-black text-[#142D4A]">{s.title}</h2>
              {s.paragraphs && <div className="mt-5 max-w-3xl space-y-4">{s.paragraphs.map((p) => <p key={p} className="text-base leading-8 text-[#4D657A] sm:text-lg">{p}</p>)}</div>}
              {s.items && <div className="mt-8 grid gap-4 md:grid-cols-2">{s.items.map((it, n) => <article key={it.title} className={`rounded-[24px] border p-6 ${s.id === "pending" ? "border-[#E0A526] bg-[#FFFBEF]" : "border-[#DCE7F0] bg-[#FCFDFE]"}`}><span className="font-mono text-xs font-bold text-[#1689DC]">0{n + 1}</span><h3 className="mt-2 font-heading text-lg font-black text-[#173451]">{it.title}</h3><p className="mt-2 text-sm leading-7 text-[#597086]">{it.text}</p></article>)}</div>}
            </div></section>))}

        {k === "hrSoftware" && <section id="hr-enquiry" className="bg-[#DDF0FB] px-5 py-14 sm:px-8 lg:py-20"><div className="mx-auto max-w-5xl"><HrSelector lang={lang} />
          <div className="mt-12 text-center"><h2 className="font-heading text-3xl font-black text-[#143552]">{lang === "ar" ? "ابدأ بإدارة موارد بشرية أوضح اليوم" : "Start with clearer HR today"}</h2><p className="mx-auto mt-3 max-w-2xl text-[#2C5373]">{lang === "ar" ? "حمّل التطبيق، أو أرسل استفسارك عبر النموذج أعلاه." : "Download the app, or send your enquiry with the form above."}</p><div className="mx-auto mt-6 max-w-md"><ServiceDownloadBadges pageKey="hrSoftware" placement="final" centered /></div><a href={`${base}/#pricing`} data-testid="link-hr-plans" className="mt-4 inline-flex items-center gap-2 font-black text-[#1267A2] hover:underline">{u.activePlans}<Fwd size={17} aria-hidden="true" /></a></div></div></section>}
        {k === "pricingPage" && <section className="px-5 py-14 sm:px-8 lg:py-20"><div className="mx-auto max-w-5xl"><div className="mb-10 flex flex-col items-center gap-4 rounded-3xl bg-[#DDF0FB] p-8 text-center"><p className="font-heading text-lg font-black text-[#143552]">{lang === "ar" ? "للتجربة: حمّل التطبيق" : "To try it: download the app"}</p><div className="w-full max-w-md"><ServiceDownloadBadges pageKey="pricingPage" placement="final" centered /></div></div><PricingTools lang={lang} /></div></section>}
      </main>
      <Footer languageOverride={locale} />
    </div>
  );
}
export function PrivacyPolicyPage() { return <Page k="privacyPolicy" />; }
export function BiometricSecurityPage() { return <Page k="biometricSecurity" />; }
export function FaqPage() { return <Page k="faq" locale="ar" />; }
export function FaqEnglishPage() { return <Page k="faq" locale="en" />; }
export function HelpCenterPage() { return <Page k="helpCenter" />; }
export function HrSoftwarePage() { return <Page k="hrSoftware" />; }
export function PricingPage() { return <Page k="pricingPage" />; }
