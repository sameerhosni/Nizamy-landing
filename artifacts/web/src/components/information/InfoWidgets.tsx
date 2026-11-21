import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, X, ChevronDown } from "lucide-react";
import { HubSpotForm } from "@/components/HubSpotForm";
import { track } from "@/lib/analytics";
import { ui, norm, type Lang } from "./informationUi";
import seo from "../../../seo.config.json";

const field = "h-12 w-full rounded-2xl border border-[#B7D5E9] bg-white px-4 text-base text-[#14263D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1689DC]";
type Faq = { id: string; category: string; q: string; a: string };
const base = () => import.meta.env.BASE_URL.replace(/\/$/, "");

export function FaqSearch({ faqs, lang }: { faqs: Faq[]; lang: Lang }) {
  const t = ui[lang]; const [q, setQ] = useState(""); const [cat, setCat] = useState("all");
  const list = useMemo(() => { const n = norm(q); return faqs.filter((f) => (cat === "all" || f.category === cat) && (!n || norm(f.q + " " + f.a + " " + (t.cats[f.category] || "")).includes(n))); }, [faqs, q, cat, t]);
  const cats = Array.from(new Set(faqs.map((f) => f.category)));
  return (
    <div>
      <div className="relative"><Search size={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#1689DC]" aria-hidden="true" />
        <input data-testid="input-faq-search" type="search" aria-label={t.searchLabel} placeholder={t.searchLabel} value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q && track("faq_search", { language: lang, results: list.length })} className={`${field} ps-11 pe-12`} />
        {q && <button type="button" data-testid="button-faq-clear" aria-label={t.clear} onClick={() => setQ("")} className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#4D657A]"><X size={16} /></button>}</div>
      <p className="mt-3 text-sm text-[#61798D]">{t.tryLine}</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group">
        {["all", ...cats].map((c) => <button key={c} type="button" data-testid={`button-faq-cat-${c}`} aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm font-bold ${cat === c ? "border-[#1689DC] bg-[#1689DC] text-white" : "border-[#B7D5E9] bg-white text-[#24516F]"}`}>{c === "all" ? t.all : t.cats[c]}</button>)}
      </div>
      <p data-testid="text-faq-count" role="status" aria-live="polite" className="mt-5 text-sm font-bold text-[#1267A2]">{t.results(list.length)}{(q || cat !== "all") && <button type="button" onClick={() => { setQ(""); setCat("all"); }} className="ms-3 underline">{t.clear}</button>}</p>
      {list.length === 0 ? (
        <div data-testid="empty-faq" className="mt-6 rounded-3xl border border-[#C9E0EF] bg-white p-8 text-center"><p className="font-heading text-lg font-black text-[#173451]">{t.noResults}</p><p className="mt-2 text-sm text-[#597086]">{t.noResultsHelp}</p>
          <Link href="/help" data-testid="link-faq-help" className="mt-5 inline-flex rounded-full bg-[#1689DC] px-6 py-3 text-sm font-black text-white">{t.helpCta}</Link></div>
      ) : (
        <div className="mt-4 divide-y divide-[#C9E0EF] border-y border-[#C9E0EF]">
          {list.map((f) => <details key={f.id} className="group"><summary data-testid={`toggle-faq-${f.id}`} className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-start font-heading text-base font-black text-[#193B57] sm:text-lg [&::-webkit-details-marker]:hidden"><span><span className="mb-1 block text-xs font-bold text-[#1689DC]">{t.cats[f.category]}</span>{f.q}</span><ChevronDown size={20} className="shrink-0 text-[#1689DC] transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><p className="pb-6 text-sm leading-8 text-[#5B7488] sm:text-base">{f.a}</p></details>)}
        </div>)}
    </div>
  );
}

type Sec = { id: string; title: string; paragraphs?: string[]; items?: { title: string; text: string }[] };
export function HelpTopics({ sections, lang }: { sections: Sec[]; lang: Lang }) {
  const t = ui[lang]; const [q, setQ] = useState(""); const [open, setOpen] = useState(sections[0]?.id);
  const n = norm(q); const list = sections.filter((s) => !n || norm(s.title + " " + (s.paragraphs || []).join(" ") + " " + (s.items || []).map(i => `${i.title} ${i.text}`).join(" ")).includes(n));
  const email = seo.site.email;
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
      <div>
        <label htmlFor="help-search" className="sr-only">{t.helpSearch}</label>
        <input id="help-search" data-testid="input-help-search" type="search" placeholder={t.helpSearch} value={q} onChange={(e) => setQ(e.target.value)} className={field} />
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t.helpTopics}>{sections.map((s) => <button key={s.id} type="button" data-testid={`button-help-topic-${s.id}`} aria-pressed={open === s.id} onClick={() => { setOpen(s.id); setQ(""); track("help_topic_select", { topic: s.id, language: lang }); }} className={`rounded-full border px-4 py-2 text-sm font-bold ${open === s.id ? "border-[#1689DC] bg-[#1689DC] text-white" : "border-[#B7D5E9] bg-white text-[#24516F]"}`}>{s.title}</button>)}</div>
        <div className="mt-6 space-y-4" aria-live="polite">
          {(q ? list : list.filter((s) => s.id === open)).map((s) => <article key={s.id} data-testid={`card-help-${s.id}`} className="rounded-3xl border border-[#DCE7F0] bg-white p-7"><h3 className="font-heading text-xl font-black text-[#173451]">{s.title}</h3>{s.paragraphs?.map((p) => <p key={p} className="mt-3 text-base leading-8 text-[#4D657A]">{p}</p>)}{s.items && <ul className="mt-4 space-y-4">{s.items.map(i => <li key={i.title} className="text-sm leading-7 text-[#4D657A]"><strong className="block text-[#173451]">{i.title}</strong>{i.text}</li>)}</ul>}</article>)}
          {q && list.length === 0 && <p data-testid="empty-help" className="rounded-3xl border border-[#C9E0EF] bg-white p-7 text-[#597086]">{t.noTopic}</p>}
        </div>
      </div>
      <aside className="h-fit rounded-3xl bg-[#153957] p-7 text-[#EFF8FC]"><h3 className="font-heading text-xl font-black">{t.contactTitle}</h3><p className="mt-3 text-sm leading-7 text-[#C9DDEA]">{t.contactText}</p>
        <a href={`mailto:${email}`} data-testid="link-help-email" onClick={() => track("help_contact_click", { language: lang })} className="mt-5 inline-flex rounded-full bg-[#8CD1F8] px-6 py-3 text-sm font-black text-[#143552]"><span dir="ltr">{email}</span></a></aside>
    </div>
  );
}

export function HrSelector({ lang }: { lang: Lang }) {
  const [pending, setPending] = useState(false);
  const t = ui[lang]; const [sel, setSel] = useState(t.caps[0][0]); const cur = t.caps.find((c) => c[0] === sel) || t.caps[0];
  const context = `${lang === "ar" ? "صفحة موارد بشرية للمنشآت الصغيرة" : "Small business HR software page"} | ${cur[1]}`;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div><h3 className="font-heading text-2xl font-black text-[#142D4A]">{t.hrPick}</h3>
        <div role="group" aria-label={t.hrPick} className="mt-5 grid gap-2">{t.caps.map((c) => <button key={c[0]} type="button" disabled={pending} aria-pressed={sel === c[0]} data-testid={`radio-hr-${c[0]}`} onClick={() => { setSel(c[0]); track("hr_capability_select", { capability: c[0], language: lang }); }} className={`rounded-2xl border p-4 text-start disabled:opacity-60 ${sel === c[0] ? "border-[#1689DC] bg-[#E2F2FC]" : "border-[#DCE7F0] bg-white"}`}><span className="font-heading font-black text-[#173451]">{c[1]}</span></button>)}</div></div>
      <div className="rounded-3xl border border-[#C9E0EF] bg-white p-7"><p data-testid="text-hr-capability" className="text-base font-bold leading-8 text-[#2C5373]">{cur[2]}</p><p className="mt-2 text-xs text-[#61798D]">{t.capNote} <a href={`${base()}/#pricing`} className="font-bold text-[#1267A2] underline">{t.activePlans}</a></p>
        <h3 className="mt-6 font-heading text-lg font-black text-[#173451]">{t.hrEnquiry}</h3>
        <p data-testid="text-hr-context" className="mt-2 rounded-xl bg-[#EAF5FC] px-3 py-2 text-xs text-[#24516F]"><b>{t.hrContext}:</b> {context}</p>
        <HubSpotForm locale={lang} className="mt-4" testId="form-hr-enquiry" errorMessage={t.hrErr} submissionContext={context} onPendingChange={setPending} onStarted={() => track("hr_enquiry_started", { language: lang, capability: sel })} onSubmitted={() => track("hr_enquiry_submitted", { language: lang, capability: sel })} /></div>
    </div>
  );
}

export function PricingTools({ lang }: { lang: Lang }) {
  const [pending, setPending] = useState(false);
  const t = ui[lang]; const [n, setN] = useState(10); const cost = Math.max(0, n) * 3;
  const context = `${lang === "ar" ? "معلومات الأسعار المرجعية" : "Pricing reference"} | ${n} ${lang === "ar" ? "موظف" : "employees"}`;
  return (
    <div className="space-y-10">
      <div id="compare" className="overflow-x-auto rounded-3xl border border-[#DCE7F0] bg-white"><table data-testid="table-pricing-draft" className="w-full min-w-[560px] text-start text-sm"><caption className="p-4 text-start font-heading text-lg font-black text-[#173451]">{t.compare}</caption>
        <thead className="bg-[#EAF5FC] text-[#142D4A]"><tr>{t.cols.map((c) => <th key={c} scope="col" className="p-4 text-start font-black">{c}</th>)}</tr></thead>
        <tbody>{t.rows.map((r) => <tr key={r[0]} className="border-t border-[#DCE7F0]"><th scope="row" className="p-4 text-start font-black text-[#173451]">{r[0]}</th><td className="p-4 text-[#4D657A]">{r[1]}</td><td className="p-4 text-[#4D657A]">{r[2]}</td></tr>)}</tbody></table></div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#C9E0EF] bg-white p-7"><h3 className="font-heading text-xl font-black text-[#173451]">{t.calc}</h3>
          <label htmlFor="calc-emp" className="mt-5 block text-sm font-bold text-[#24516F]">{t.employees}</label>
          <input id="calc-emp" data-testid="input-calc-employees" type="number" disabled={pending} min={0} max={100000} inputMode="numeric" value={n} onChange={(e) => setN(Math.min(100000, Math.max(0, Math.floor(Number(e.target.value) || 0))))} className={`${field} mt-2`} />
          <p className="mt-5 text-sm text-[#597086]">{t.est}</p><p data-testid="text-calc-result" aria-live="polite" className="font-heading text-4xl font-black text-[#142D4A]"><span dir="ltr">{cost.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</span> {t.sar}</p>
          <p className="mt-3 text-xs leading-6 text-[#61798D]">{t.calcNote}</p></div>
        <div className="rounded-3xl border border-[#C9E0EF] bg-white p-7"><h3 className="font-heading text-lg font-black text-[#173451]">{lang === "ar" ? "اطلب التواصل" : "Request a conversation"}</h3>
          <p data-testid="text-pricing-context" className="mt-2 rounded-xl bg-[#EAF5FC] px-3 py-2 text-xs text-[#24516F]"><b>{t.hrContext}:</b> {context}</p>
          <HubSpotForm locale={lang} className="mt-4" testId="form-pricing-enquiry" errorMessage={t.hrErr} submissionContext={context} onPendingChange={setPending} onStarted={() => track("pricing_enquiry_started", { language: lang })} onSubmitted={() => track("pricing_enquiry_submitted", { language: lang })} /></div>
      </div>
    </div>
  );
}
