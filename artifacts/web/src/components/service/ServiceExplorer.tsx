import { useRef, useState, type KeyboardEvent } from "react";
import { MessageSquareText } from "lucide-react";
import { HubSpotForm } from "@/components/HubSpotForm";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";
import data from "@/pages/serviceLandingContent.json";
import { explorerCopy } from "@/pages/serviceInteractionCopy";

type Key = keyof typeof data;
type Sec = { id: string; paragraphs?: string[]; items?: { title: string; text: string }[] };

export function ServiceExplorer({ pageKey }: { pageKey: Key }) {
  const { language, dir } = useLanguage();
  const c = explorerCopy[pageKey][language];
  const page = data[pageKey][language];
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState(false);
  const startedRef = useRef(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cur = c.priorities[active];

  const cards = (page.sections as Sec[]).find((s) => s.items && s.id === "capabilities")?.items;
  const explanation = "card" in cur.ref
    ? cards?.[cur.ref.card]
    : (() => {
        const r = cur.ref as { section: string; p: number };
        const s = (page.sections as Sec[]).find((x) => x.id === r.section);
        return s?.paragraphs?.[r.p] ? { title: "", text: s.paragraphs[r.p] } : undefined;
      })();

  const select = (i: number) => {
    if (i === active || pending) return;
    setActive(i);
    track("service_page_goal_select", { service_page: pageKey, language, goal: c.priorities[i].id });
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = c.priorities.length;
    const rtl = dir === "rtl";
    let next = -1;
    if (e.key === (rtl ? "ArrowLeft" : "ArrowRight") || e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === (rtl ? "ArrowRight" : "ArrowLeft") || e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const context = language === "ar"
    ? `الخدمة: ${c.service} | الأولوية: ${cur.label}`
    : `Service: ${c.service} | Priority: ${cur.label}`;
  const idp = `${pageKey}-explorer`;

  return (
    <section id="service-priorities" data-testid={`section-${pageKey}-explorer`} className="px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-3xl font-heading text-3xl font-black leading-snug text-[#142D4A] sm:text-4xl">{c.title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#4D657A]">{c.lead}</p>

        <div role="tablist" aria-label={c.tablist} className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" style={{ gridTemplateColumns: undefined }}>
          {c.priorities.map((p, i) => (
            <button key={p.id} ref={(el) => { tabs.current[i] = el; }} role="tab" type="button" id={`${idp}-tab-${p.id}`}
              aria-selected={i === active} aria-controls={`${idp}-panel`} tabIndex={i === active ? 0 : -1} disabled={pending} aria-disabled={pending}
              data-testid={`tab-${pageKey}-${p.id}`}
              onClick={() => select(i)} onKeyDown={(e) => onKey(e, i)}
              className={`min-h-[56px] rounded-2xl border p-4 text-start transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1689DC] disabled:cursor-not-allowed disabled:opacity-70 ${i === active ? "border-[#1689DC] bg-[#153957] text-white" : "border-[#C9E0EF] bg-[#FCFDFE] text-[#173451] hover:bg-[#EAF5FC]"}`}>
              <span className="block font-heading text-base font-black">{p.label}</span>
              <span className={`mt-0.5 block text-xs ${i === active ? "text-[#BFE2F7]" : "text-[#61798D]"}`}>{p.hint}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`${idp}-panel`} aria-labelledby={`${idp}-tab-${cur.id}`} tabIndex={0}
          data-testid={`panel-${pageKey}-${cur.id}`}
          className="mt-4 grid gap-6 rounded-[28px] border border-[#C9E0EF] bg-[#FCFDFE] p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1689DC] sm:p-8 lg:grid-cols-[1.1fr_.9fr]">
          <div key={cur.id} className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-[#1689DC]">{c.supported}</p>
            {explanation?.title && <h3 className="mt-2 font-heading text-xl font-black text-[#173451]">{explanation.title}</h3>}
            <p className="mt-3 text-sm leading-7 text-[#4D657A] sm:text-base">{explanation?.text}</p>
          </div>
          <div className="rounded-2xl border border-dashed border-[#9BCDEB] bg-[#F3F9FD] p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-sm font-black text-[#173451]">{c.workflowTitle}</h3>
              <span data-testid={`badge-${pageKey}-illustrative`} className="rounded-full bg-[#DDF0FB] px-3 py-1 text-[11px] font-bold text-[#1267A2]">{language === "ar" ? "توضيحي" : "Illustrative"}</span>
            </div>
            <ol key={cur.id} className="mt-4 space-y-3">
              {cur.steps.map((s, n) => (
                <li key={s} style={{ animationDelay: `${n * 70}ms` }} className="flex gap-3 text-sm leading-6 text-[#3F5C74] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-backwards">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1689DC] font-mono text-xs font-bold text-white">{n + 1}</span>{s}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-5 text-[#61798D]">{c.illustrative}</p>
          </div>
        </div>

        <div id="service-enquiry" tabIndex={-1} data-testid={`section-${pageKey}-enquiry`} className="mt-10 scroll-mt-24 rounded-[28px] bg-[#EAF5FC] p-6 outline-none sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-black text-[#142D4A]"><MessageSquareText size={22} className="text-[#1689DC]" aria-hidden="true" />{c.enquiryTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-[#4D657A]">{c.enquiryLead}</p>
          <dl data-testid={`summary-${pageKey}-selection`} aria-live="polite" className="mt-5 grid gap-x-6 gap-y-1 rounded-2xl border border-[#B6DAF1] bg-[#F8FCFF] p-4 text-sm sm:grid-cols-2">
            <div className="sm:col-span-2 text-xs font-bold text-[#1267A2]">{c.summaryLabel}</div>
            <div><dt className="inline text-[#61798D]">{c.summaryService}: </dt><dd className="inline font-bold text-[#173451]">{c.service}</dd></div>
            <div><dt className="inline text-[#61798D]">{c.summaryPriority}: </dt><dd data-testid={`text-${pageKey}-selected-priority`} className="inline font-bold text-[#173451]">{cur.label}</dd></div>
          </dl>
          <HubSpotForm
            locale={language}
            testId={`form-${pageKey}-enquiry`}
            errorMessage={c.formError}
            submissionContext={context}
            onPendingChange={setPending}
            className="mt-5"
            onStarted={() => {
              if (startedRef.current) return;
              startedRef.current = true;
              track("service_page_form_started", { service_page: pageKey, language, goal: cur.id });
            }}
            onSubmitted={() => track("service_page_form_submitted", { service_page: pageKey, language, goal: cur.id })}
          />
        </div>
      </div>
    </section>
  );
}
