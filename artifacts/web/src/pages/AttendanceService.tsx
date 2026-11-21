import { Link } from "wouter";
import {
  ArrowDownLeft, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
  BarChart3, Bell, Check, ChevronDown, ClipboardCheck, Clock3,
  FileText, Gift, Lightbulb, ScanFace, ShieldCheck, Sparkles, Users,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/lib/i18n";
import { AttendanceArabic } from "@/components/attendance/AttendanceArabic";
import { attendanceContent as content } from "./AttendanceServiceContent";

const IOS = "https://apps.apple.com/sa/app/id6792693395";
const ANDROID = "https://play.google.com/store/apps/details?id=com.t2.nizamy";

export function AttendanceService() {
  const { language, dir } = useLanguage();
  const t = content[language];
  const Forward = dir === "rtl" ? ArrowLeft : ArrowRight;
  const Down = dir === "rtl" ? ArrowDownLeft : ArrowDownRight;
  const featureIcons = [ScanFace, ClipboardCheck, BarChart3, Gift, Users, ShieldCheck];
  const imageSrc = `${import.meta.env.BASE_URL}images/attendance-app-screen.webp`;

  return (
    <div dir={dir} className="min-h-[100dvh] overflow-hidden bg-[#F7FAFD] font-sans text-[#14263D]">
      <SeoHead page="attendanceService" />
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {language === "ar" ? <AttendanceArabic /> : <>
        <section className="relative overflow-hidden bg-[#EAF5FC] px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24 lg:pt-24">
          <div aria-hidden="true" className="pointer-events-none absolute -end-36 -top-40 h-[550px] w-[550px] rounded-full border-[90px] border-[#D3ECFA]/60" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.13fr_.87fr] lg:gap-16">
            <div className="max-w-[690px]">
              <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B6DAF1] bg-[#F6FBFE] px-4 py-2 text-xs font-bold tracking-wide text-[#1267A2] sm:text-sm"><span className="h-2 w-2 rounded-full bg-[#2196F3]" />{t.eyebrow}</p>
              <h1 data-testid="text-attendance-heading" className="font-heading text-[2.75rem] font-black leading-[1.2] tracking-tight text-[#142D4A] sm:text-[4rem] lg:text-[4.6rem]">
                {t.heroTitle}<span className="mt-2 block text-[#1689DC]">{t.heroAccent}</span>
              </h1>
              <p className="mt-7 max-w-[580px] text-base font-medium leading-[1.9] text-[#4D657A] sm:text-lg">{t.heroText}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={IOS} target="_blank" rel="noopener noreferrer" data-testid="link-attendance-hero-try" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1689DC] px-7 py-4 text-sm font-bold text-white shadow-[0_14px_25px_-15px_rgba(22,137,220,.7)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1689DC] sm:text-base">{t.primary}<Forward size={18} aria-hidden="true" /></a>
                <a href="#how-it-works" data-testid="link-attendance-how" className="inline-flex items-center justify-center gap-3 rounded-full border border-[#B7D5E9] bg-[#F8FCFF] px-7 py-4 text-sm font-bold text-[#24516F] transition-colors hover:bg-[#E2F2FC] focus-visible:outline-[#1689DC] sm:text-base">{t.secondary}<Down size={18} aria-hidden="true" /></a>
              </div>
              <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#61798D] sm:text-sm"><ShieldCheck size={16} className="shrink-0 text-[#1689DC]" aria-hidden="true" />{t.proNote}</p>
            </div>
            <div className="relative mx-auto w-full max-w-[340px]">
              <img src={imageSrc} alt={t.heroImageAlt} width={715} height={1600} fetchPriority="high" className="h-auto w-full rounded-[2rem] border-[6px] border-[#193F5D] shadow-[0_30px_65px_-25px_rgba(17,65,103,.45)]" />
            </div>
          </div>
        </section>

        <section className="px-5 pt-16 sm:px-8 lg:pt-20">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ACD8F4] bg-[#E6F4FD] p-7 sm:p-10">
            <p className="mb-3 text-lg font-black text-[#142D4A] sm:text-xl">{t.reliabilityLead}</p>
            <h2 className="flex items-center gap-2 text-sm font-black text-[#1689DC]"><ScanFace size={18} aria-hidden="true" />{t.reliabilityKicker}</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[#4D657A]">{t.reliabilityText}</p>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
              <div>
                <p className="mb-4 text-sm font-black text-[#1689DC]">{t.problemKicker}</p>
                <h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.problemTitle}</h2>
                <p className="mt-6 text-base leading-8 text-[#597086] sm:text-lg">{t.problemIntro}</p>
              </div>
              <div className="grid gap-px overflow-hidden rounded-[28px] border border-[#DCE7F0] bg-[#DCE7F0] sm:grid-cols-2">
                {t.problems.map(([title, description], i) => <article key={title} className="bg-[#FCFDFE] p-6 sm:p-8">
                  <span className="mb-7 block font-mono text-xs font-bold text-[#1689DC]">0{i + 1} /</span>
                  <h3 className="font-heading text-xl font-black text-[#173451]">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#60778A]">{description}</p>
                </article>)}
              </div>
            </div>
            <p className="mt-10 border-s-4 border-[#1689DC] ps-5 text-lg font-bold leading-relaxed text-[#2C5373]">{t.bridge}</p>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 bg-[#153957] px-5 py-20 text-[#F0F8FC] sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-black text-[#8CD1F8]">{t.journeyKicker}</p>
              <h2 className="font-heading text-3xl font-black leading-snug sm:text-5xl">{t.journeyTitle}</h2>
              <p className="mt-5 text-base leading-8 text-[#BFD5E3] sm:text-lg">{t.journeyIntro}</p>
            </div>
            <ol className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {t.journey.map(([number, title, description]) => <li key={number} className="group relative min-h-[202px] rounded-2xl border border-[#41627A] bg-[#1C4565] p-6 transition-transform hover:-translate-y-1 sm:p-7">
                <div className="flex items-start justify-between gap-3"><span className="font-mono text-3xl font-semibold text-[#82CDF6]">{number}</span><ArrowUpRight size={18} className="text-[#8ABCD9]" aria-hidden="true" /></div>
                <h3 className="mt-5 font-heading text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#BBD1E0]">{description}</p>
              </li>)}
            </ol>
            <p className="mt-10 max-w-3xl border-s-4 border-[#8CD1F8] ps-5 text-lg font-bold leading-relaxed text-[#DCEFF9]">{t.journeyClosing}</p>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-black text-[#1689DC]">{t.featuresKicker}</p>
              <h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.featuresTitle}</h2>
              <p className="mt-5 text-base leading-8 text-[#597086] sm:text-lg">{t.featuresIntro}</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {t.features.map(([title, description], i) => {
                const Icon = featureIcons[i];
                return <article key={title} className={`rounded-[26px] border p-7 sm:p-8 ${i === 0 ? "border-[#ACD8F4] bg-[#E6F4FD]" : "border-[#DCE7F0] bg-[#FCFDFE]"}`}>
                  <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9EDF9] text-[#157DBC]"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></div>
                  <h3 className="font-heading text-xl font-black text-[#173451]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#597086]">{description}</p>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#EAF5FC] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-black text-[#1689DC]">{t.dataKicker}</p>
              <h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.dataTitle}</h2>
              <p className="mt-5 text-base leading-8 text-[#597086] sm:text-lg">{t.dataIntro}</p>
            </div>
            <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {t.dataSteps.map(([n, label], i) => <li key={n} className={`min-h-28 rounded-2xl border p-5 ${i === 3 ? "border-[#1689DC] bg-[#1689DC] text-white" : "border-[#C9E0EF] bg-[#FCFDFE] text-[#214665]"}`}><span className={`font-mono text-xs font-bold ${i === 3 ? "text-[#DDF3FE]" : "text-[#1689DC]"}`}>{n}</span><p className="mt-3 font-heading text-base font-black">{label}</p></li>)}
            </ol>
            <p className="mt-8 border-s-4 border-[#1689DC] ps-5 text-lg font-bold text-[#2C5373]">{t.dataClosing}</p>
          </div>
        </section>

        <section className="bg-[#EAF5FC] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-4 text-sm font-black text-[#1689DC]">{t.aiKicker}</p>
              <h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.aiTitle}</h2>
              <p className="mt-6 text-base leading-8 text-[#526B80] sm:text-lg">{t.aiText}</p>
              <div className="mt-8 space-y-6">
                {t.aiItems.map(([title, description], i) => <div key={title} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D2EAF9] text-[#1689DC]">{i === 0 ? <Sparkles size={18} /> : i === 1 ? <FileText size={18} /> : <Lightbulb size={18} />}</span><div><h3 className="font-heading text-lg font-black text-[#173451]">{title}</h3><p className="mt-1 text-sm leading-7 text-[#597086]">{description}</p></div></div>)}
              </div>
            </div>
            <div className="rounded-[28px] border border-[#C9E0EF] bg-[#FCFDFE] p-5 shadow-[0_30px_75px_-40px_rgba(26,85,126,.3)] sm:p-9">
              <div className="flex items-center gap-3 border-b border-[#DCE8F0] pb-6"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1789D9] text-white"><Sparkles size={20} aria-hidden="true" /></span><div><p className="font-heading text-base font-black text-[#173451]">Nizamy AI</p><p className="text-xs text-[#72889B]">{t.aiMockLabel}</p></div></div>
              <div className="my-8 ms-auto max-w-[85%] rounded-2xl rounded-ee-sm bg-[#EAF5FC] p-5 text-sm font-semibold leading-7 text-[#214867]">{t.aiMockQuestion}</div>
              <div className="max-w-[91%] rounded-2xl rounded-es-sm border border-[#D6E7F2] bg-[#F8FBFD] p-5 text-sm leading-7 text-[#45647A]"><p className="mb-2 font-bold text-[#1689DC]">Nizamy AI</p>{t.aiMockAnswer}</div>
              <p className="mt-9 flex items-center gap-2 border-t border-[#DCE8F0] pt-5 text-xs font-medium text-[#70899B]"><Check size={15} className="shrink-0 text-[#1689DC]" aria-hidden="true" />{t.insightLabel}</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-20"><div><p className="mb-4 text-sm font-black text-[#1689DC]">{t.impactKicker}</p><h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.impactTitle}</h2></div><p className="text-base leading-8 text-[#597086] sm:text-lg">{t.impactText}</p></div>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{t.impactSteps.map((step, i) => <div key={step} className="flex min-h-28 items-center gap-3 rounded-2xl bg-[#E9F4FB] p-5"><span className="font-mono text-xs font-bold text-[#1689DC]">0{i + 1}</span><span className="font-heading text-lg font-black text-[#214665]">{step}</span></div>)}</div>
            <div className="mt-10"><h3 className="font-heading text-2xl font-black text-[#173451]">{t.roiTitle}</h3><p className="mt-2 text-sm font-bold text-[#1689DC]">{t.roiIntro}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{t.roi.map(([title, d], i) => <article key={title} className="rounded-2xl border border-[#DCE7F0] bg-[#FCFDFE] p-5"><span className="font-mono text-xs font-bold text-[#1689DC]">0{i + 1}</span><h4 className="mt-3 font-heading text-base font-black text-[#173451]">{title}</h4><p className="mt-2 text-sm leading-7 text-[#597086]">{d}</p></article>)}</div></div>
          </div>
        </section>

        <section className="bg-[#EAF5FC] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div><p className="mb-4 text-sm font-black text-[#1689DC]">{t.dashboardKicker}</p><h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.dashboardTitle}</h2><p className="mt-6 text-base leading-8 text-[#597086] sm:text-lg">{t.dashboardText}</p></div>
            <div>
              <div className="overflow-hidden rounded-[24px] border border-[#C6DEED] bg-[#FCFDFE] shadow-[0_35px_65px_-38px_rgba(20,60,93,.4)]">
                <div className="flex items-center justify-between border-b border-[#E0EAF1] px-5 py-4"><span className="font-heading text-lg font-black text-[#193C5B]">Nizamy</span><span className="flex gap-1.5" aria-hidden="true"><i className="h-2 w-2 rounded-full bg-[#C0DDEC]" /><i className="h-2 w-2 rounded-full bg-[#C0DDEC]" /><i className="h-2 w-2 rounded-full bg-[#C0DDEC]" /></span></div>
                <div className="p-5 sm:p-7"><p className="mb-3 text-xs font-bold text-[#627C91]">{t.dashboardListLabel}</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{t.dashboardUI.map((label, i) => <span key={label} className={`rounded-xl p-3 text-center text-xs font-bold leading-5 ${i === 0 ? "bg-[#DCEFFB] text-[#137DBD]" : "bg-[#F0F5F8] text-[#627C91]"}`}>{label}</span>)}</div>
                  <div className="mt-6 rounded-2xl border border-[#DCE7F0] p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-[#EAF5FC] p-2.5 text-[#1689DC]"><Bell size={18} aria-hidden="true" /></span><h3 className="font-heading text-lg font-black text-[#193C5B]">{t.dashboardSignal}</h3></div><div className="space-y-3" aria-hidden="true"><span className="block h-2.5 w-[77%] rounded-full bg-[#CBE7F8]" /><span className="block h-2.5 w-[55%] rounded-full bg-[#E3F0F7]" /></div><p className="mt-6 border-t border-[#E4EDF3] pt-5 text-sm leading-7 text-[#597086]">{t.dashboardDesc}</p></div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#6A8294]">{t.dashboardFooter}</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-[30px] bg-[#153957] p-8 text-[#EFF8FC] sm:p-12 lg:grid-cols-[1fr_.75fr] lg:items-center lg:gap-20 lg:p-16">
            <div><p className="mb-4 text-sm font-black text-[#8CD1F8]">{t.rewardsKicker}</p><h2 className="font-heading text-3xl font-black leading-snug sm:text-5xl">{t.rewardsTitle}</h2><p className="mt-6 max-w-2xl text-base leading-8 text-[#BDD4E3] sm:text-lg">{t.rewardsText}</p></div>
            <div className="space-y-3">{t.rewardsItems.map((item, i) => <div key={item} className="flex items-center gap-4 rounded-2xl border border-[#426A85] bg-[#214D6D] p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#337399] text-[#DDF3FE]">{i === 0 ? <Clock3 size={19} /> : i === 1 ? <Gift size={19} /> : <Users size={19} />}</span><span className="font-heading text-base font-black sm:text-lg">{item}</span></div>)}</div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 bg-[#EAF5FC] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl"><p className="mb-4 text-sm font-black text-[#1689DC]">{t.pricingKicker}</p><h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.pricingTitle}</h2><p className="mt-5 text-base leading-8 text-[#597086] sm:text-lg">{t.pricingText}</p></div>
            <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.1fr_1.3fr]">
              {t.plans.map((plan, i) => <article key={plan.name} className={`flex flex-col rounded-[26px] border p-7 sm:p-8 ${i === 2 ? "border-[#153957] bg-[#153957] text-[#EFF8FC]" : "border-[#C9E0EF] bg-[#FCFDFE] text-[#173451]"}`}>
                <h3 className="font-mono text-sm font-bold text-[#1689DC]">{plan.name}</h3>
                <p className="mt-4 font-heading text-4xl font-black">{plan.price}{plan.unit && <span className="ms-2 text-sm font-bold opacity-70">{plan.unit}</span>}</p>
                <p className={`mt-2 text-sm ${i === 2 ? "text-[#BFD5E3]" : "text-[#597086]"}`}>{plan.tagline}</p>
                <ul className="mt-6 flex-1 space-y-3">{plan.bullets.map((b) => <li key={b} className="flex gap-3 text-sm leading-7"><Check size={16} className="mt-1.5 shrink-0 text-[#1689DC]" aria-hidden="true" />{b}</li>)}</ul>
                {i === 2
                  ? <Link href="/#contact-us" data-testid="link-attendance-plan-pro" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#F8FCFE] px-6 py-3.5 text-sm font-black text-[#153957] transition-transform hover:-translate-y-0.5">{plan.cta}<Forward size={17} aria-hidden="true" /></Link>
                  : <a href={IOS} target="_blank" rel="noopener noreferrer" data-testid={`link-attendance-plan-${plan.name.toLowerCase()}`} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#1689DC] px-6 py-3.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5">{plan.cta}<Forward size={17} aria-hidden="true" /></a>}
              </article>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div><p className="mb-4 text-sm font-black text-[#1689DC]">{t.faqKicker}</p><h2 className="font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-5xl">{t.faqTitle}</h2></div>
            <div className="divide-y divide-[#D7E5EF] border-y border-[#D7E5EF]">
              {t.faqs.map(([question, answer], i) => <details key={question} className="group py-1">
                <summary data-testid={`toggle-attendance-faq-${i}`} className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-start font-heading text-base font-black text-[#193B57] marker:hidden focus-visible:outline-[#1689DC] sm:text-lg [&::-webkit-details-marker]:hidden">{question}<ChevronDown size={20} className="shrink-0 text-[#1689DC] transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <p className="max-w-2xl pb-6 text-sm leading-8 text-[#5B7488] sm:text-base">{answer}</p>
              </details>)}
            </div>
          </div>
        </section>

        <section className="bg-[#DDF0FB] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center"><p className="mb-4 text-sm font-black text-[#1689DC]">{t.finalKicker}</p><h2 className="font-heading text-3xl font-black leading-snug text-[#143552] sm:text-5xl">{t.finalTitle}</h2><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#4D6A80] sm:text-lg">{t.finalText}</p><div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><a href={IOS} target="_blank" rel="noopener noreferrer" data-testid="link-attendance-final-ios" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1689DC] px-7 py-4 text-sm font-black text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-[#1689DC] sm:w-auto">{t.ios}<Forward size={17} aria-hidden="true" /></a><a href={ANDROID} target="_blank" rel="noopener noreferrer" data-testid="link-attendance-final-android" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#9BCDEB] bg-[#F8FCFE] px-7 py-4 text-sm font-black text-[#176D9E] transition-colors hover:bg-[#EDF8FD] focus-visible:outline-[#1689DC] sm:w-auto">{t.android}<Forward size={17} aria-hidden="true" /></a></div><p className="mt-6 text-xs font-semibold text-[#617F92]">{t.finalNote}</p></div>
        </section>
        </>}
      </main>
      <Footer />
    </div>
  );
}