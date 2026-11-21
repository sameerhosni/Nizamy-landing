import { useEffect, useRef, useState } from "react";
import { useGetSupportVisitor, useGetSupportVisitors, getGetSupportVisitorQueryKey, getGetSupportVisitorsQueryKey } from "@workspace/api-client-react";
import type { GetSupportVisitorsDays, VisitorEvent, VisitorProfile } from "@workspace/api-client-react";
import { AlertCircle, ChevronLeft, ChevronRight, Download, Globe, Info, Mail, MonitorSmartphone, Phone, RefreshCw, Search, UserRound, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { SupportApiError } from "@/lib/supportApi";
import { IntercomVisitors } from "@/components/IntercomVisitors";

type Lang = "en" | "ar";
const DAYS: GetSupportVisitorsDays[] = [1, 7, 30, 90, 0];

const T = {
  en: {
    title: "Visitor activity", search: "Search name, email, phone or visitor ID", refresh: "Refresh", retry: "Retry", updated: "Updated",
    days: { 0: "All time", 1: "24 hours", 7: "7 days", 30: "30 days", 90: "90 days" } as Record<number, string>,
    notes: [
      "A visitor is an anonymous browser ID. One person may appear as several visitors (different devices, cleared storage), and a shared device may merge people.",
      "Names, emails and phone numbers are self-reported in forms and chats. They are not verified.",
      "Unknown country means location was unavailable, not that the visitor is outside a region.",
      "Tracking is linked from this feature's deployment forward. Older events that were never linked to a browser ID are not assigned to any visitor.",
    ],
    anon: "Anonymous visitor", visitors: (n: number) => `${n} visitor${n === 1 ? "" : "s"}`,
    first: "First seen", last: "Last seen", events: "Events", downloads: "Download clicks", devices: "Devices", countries: "Countries", sources: "Sources", packages: "Packages",
    contact: "Self-reported contact", noContact: "No contact details submitted.", unknownCountry: "Unknown",
    timeline: "Activity timeline", noEvents: "No events on this page.", none: "No visitors match this period or search.", noneHint: "Try a longer period or clear the search.",
    select: "Select a visitor to see their profile and activity timeline.", page: (p: number, n: number) => `Page ${p} of ${n}`, prev: "Previous", next: "Next", close: "Close",
    session: "Session", target: "Target", campaign: "Campaign", id: "Visitor ID",
  },
  ar: {
    title: "نشاط الزوار", search: "ابحث بالاسم أو البريد أو الهاتف أو معرف الزائر", refresh: "تحديث", retry: "إعادة المحاولة", updated: "آخر تحديث",
    days: { 0: "كل الوقت", 1: "24 ساعة", 7: "7 أيام", 30: "30 يومًا", 90: "90 يومًا" } as Record<number, string>,
    notes: [
      "الزائر هو معرف متصفح مجهول. قد يظهر الشخص الواحد كعدة زوار (أجهزة مختلفة أو مسح التخزين)، وقد يدمج الجهاز المشترك عدة أشخاص.",
      "الأسماء والبريد وأرقام الهاتف يدخلها الزائر بنفسه في النماذج والمحادثات، ولم يتم التحقق منها.",
      "الدولة غير المعروفة تعني أن الموقع لم يكن متاحًا.",
      "يبدأ ربط التتبع من تاريخ نشر هذه الميزة. الأحداث الأقدم غير المرتبطة بمعرف متصفح لا تُنسب لأي زائر.",
    ],
    anon: "زائر مجهول", visitors: (n: number) => `${n} زائر`,
    first: "أول ظهور", last: "آخر ظهور", events: "الأحداث", downloads: "نقرات تنزيل التطبيق", devices: "الأجهزة", countries: "الدول", sources: "المصادر", packages: "الباقات",
    contact: "بيانات تواصل أدخلها الزائر", noContact: "لم تُرسل بيانات تواصل.", unknownCountry: "غير معروفة",
    timeline: "سجل النشاط", noEvents: "لا توجد أحداث في هذه الصفحة.", none: "لا يوجد زوار مطابقون لهذه الفترة أو البحث.", noneHint: "جرّب فترة أطول أو امسح البحث.",
    select: "اختر زائرًا لعرض ملفه وسجل نشاطه.", page: (p: number, n: number) => `صفحة ${p} من ${n}`, prev: "السابق", next: "التالي", close: "إغلاق",
    session: "الجلسة", target: "الهدف", campaign: "الحملة", id: "معرف الزائر",
  },
};

const EVENTS: Record<string, { en: string; ar: string; tone: string }> = {
  attributed_visit: { en: "Visited site", ar: "زار الموقع", tone: "bg-[#dfe7f0] text-[#2b4a6b]" },
  section_view: { en: "Viewed section", ar: "شاهد قسمًا", tone: "bg-[#ebe4d6] text-[#5e6f69]" },
  website_click: { en: "Clicked link", ar: "نقر رابطًا", tone: "bg-[#ebe4d6] text-[#5e6f69]" },
  package_selected: { en: "Selected package", ar: "اختار باقة", tone: "bg-[#f3e3b5] text-[#7a5a06]" },
  package_cta_clicked: { en: "Package call to action", ar: "نقر زر الباقة", tone: "bg-[#f3e3b5] text-[#7a5a06]" },
  app_download_clicked: { en: "App download clicked", ar: "نقر تنزيل التطبيق", tone: "bg-[#cfe6dc] text-[#0b4a3e]" },
  submission_succeeded: { en: "Form submitted", ar: "أرسل نموذجًا", tone: "bg-[#0f5c4d] text-[#f7f3ea]" },
  chat_started: { en: "Chat started", ar: "بدأ محادثة", tone: "bg-[#cfe6dc] text-[#0b4a3e]" },
  chat_ticket_created: { en: "Chat ticket created", ar: "أنشأ تذكرة محادثة", tone: "bg-[#0f5c4d] text-[#f7f3ea]" },
  calculator_used: { en: "Used calculator", ar: "استخدم الحاسبة", tone: "bg-[#f3e3b5] text-[#7a5a06]" },
  form_started: { en: "Started form", ar: "بدأ نموذجًا", tone: "bg-[#dfe7f0] text-[#2b4a6b]" },
  chatbot_opened: { en: "Opened chatbot", ar: "فتح المساعد", tone: "bg-[#dfe7f0] text-[#2b4a6b]" },
};
const PACKAGES: Record<string, { en: string; ar: string }> = {
  free: { en: "Free", ar: "مجانية" }, starter: { en: "Starter", ar: "المبتدئة" }, growth: { en: "Growth", ar: "النمو" },
};
const SOURCES: Record<string, { en: string; ar: string }> = {
  meta: { en: "Meta", ar: "ميتا" }, google: { en: "Google", ar: "جوجل" }, chatgpt: { en: "ChatGPT", ar: "ChatGPT" }, direct: { en: "Direct", ar: "مباشر" },
};

const pkg = (p: string, l: Lang) => PACKAGES[p.toLowerCase()]?.[l] ?? p;
const src = (s: string, l: Lang) => (s ? SOURCES[s.toLowerCase()]?.[l] ?? s : "");
const evLabel = (e: string, l: Lang) => EVENTS[e]?.[l] ?? e.replace(/_/g, " ");
const fmt = (d: string, l: Lang) => { const dt = new Date(d); return isNaN(dt.getTime()) ? d : dt.toLocaleString(l === "ar" ? "ar-SA" : "en-GB", { dateStyle: "medium", timeStyle: "short" }); };
const nf = (n: number, l: Lang) => n.toLocaleString(l === "ar" ? "ar-SA" : "en-GB");
const pages = (total: number, size: number) => Math.max(1, Math.ceil((total || 0) / (size || 1)));

function toSupportError(e: unknown): unknown {
  if (e instanceof SupportApiError) return e;
  if (e && typeof e === "object" && typeof (e as { status?: unknown }).status === "number") {
    const err = e as { status: number; data?: unknown; message?: string };
    const d = err.data;
    const msg = d && typeof d === "object" && typeof (d as { error?: unknown }).error === "string" ? (d as { error: string }).error : err.message || `Request failed (${err.status})`;
    return new SupportApiError(err.status, msg);
  }
  if (e instanceof TypeError) return new SupportApiError(0, "Network error");
  return e;
}
const errText = (e: unknown) => { const c = toSupportError(e); return c instanceof Error ? c.message : String(c); };

const btnGhost = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3.5 py-2 text-sm font-medium text-[#16302b] hover:border-[#0f5c4d] disabled:opacity-40 transition-colors";
const label = "text-[11px] font-bold uppercase tracking-wider text-[#7d8a85]";

function ErrorBox({ error, onRetry, retry }: { error: unknown; onRetry: () => void; retry: string }) {
  return (
    <div role="alert" className="rounded-xl border border-[#e3b9a6] bg-[#fbeee7] p-4 text-sm text-[#8a3a1c]" data-testid="status-visitors-error">
      <div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{errText(error)}</div>
      <button onClick={onRetry} className="mt-3 font-semibold underline" data-testid="button-retry-visitors">{retry}</button>
    </div>
  );
}
function Pager({ page, total, size, onPage, t, id }: { page: number; total: number; size: number; onPage: (p: number) => void; t: typeof T.en; id: string }) {
  const n = pages(total, size);
  if (n <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 pt-3 text-xs text-[#5e6f69]">
      <button className={`${btnGhost} !px-2.5 !py-1.5 text-xs`} disabled={page <= 1} onClick={() => onPage(page - 1)} data-testid={`button-${id}-prev`}><ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />{t.prev}</button>
      <span data-testid={`text-${id}-page`}>{t.page(page, n)}</span>
      <button className={`${btnGhost} !px-2.5 !py-1.5 text-xs`} disabled={page >= n} onClick={() => onPage(page + 1)} data-testid={`button-${id}-next`}>{t.next}<ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" /></button>
    </div>
  );
}
function Chips({ items, render, empty = "—" }: { items: string[]; render?: (s: string) => string; empty?: string }) {
  if (!items?.length) return <span className="text-xs text-[#7d8a85]">{empty}</span>;
  return <div className="flex flex-wrap gap-1">{items.map((s, i) => <span key={`${s}-${i}`} dir="auto" className="rounded-md bg-[#ebe4d6] px-1.5 py-0.5 text-[11px] font-medium text-[#16302b]">{render ? render(s) : s}</span>)}</div>;
}

function VisitorRow({ v, active, onSelect, t, l }: { v: VisitorProfile; active: boolean; onSelect: () => void; t: typeof T.en; l: Lang }) {
  return (
    <li>
      <button onClick={onSelect} aria-pressed={active} data-testid={`card-visitor-${v.id}`}
        className={`w-full rounded-xl border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f5c4d]/40 ${active ? "border-[#0f5c4d] bg-[#e6f0ec]" : "border-[#e2dbcc] bg-[#fffdf8] hover:border-[#b9ad95]"}`}>
        <div className="flex items-center gap-2">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${v.name || v.emails.length ? "bg-[#16302b] text-[#f2c14e]" : "bg-[#ebe4d6] text-[#7d8a85]"}`}><UserRound className="h-3.5 w-3.5" /></span>
          <span dir="auto" className="min-w-0 flex-1 truncate text-sm font-semibold text-[#16302b]">{v.name || v.emails[0] || t.anon}</span>
          <span className="shrink-0 text-[11px] text-[#7d8a85]">{fmt(v.last_seen, l)}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5e6f69]">
          <span className="font-mono tabular-nums">{nf(v.event_count, l)} {t.events}</span>
          {v.downloads > 0 && <span className="inline-flex items-center gap-1 text-[#0b4a3e]"><Download className="h-3 w-3" />{nf(v.downloads, l)}</span>}
          {v.packages.length > 0 && <span className="rounded bg-[#f3e3b5] px-1.5 text-[#7a5a06]">{v.packages.map((p) => pkg(p, l)).join(" / ")}</span>}
          {v.sources.length > 0 && <span>{v.sources.map((s) => src(s, l)).join(", ")}</span>}
          <span>{v.countries.filter(Boolean).join(", ") || t.unknownCountry}</span>
        </div>
      </button>
    </li>
  );
}

function EventItem({ e, t, l }: { e: VisitorEvent; t: typeof T.en; l: Lang }) {
  const tone = EVENTS[e.event]?.tone ?? "bg-[#ebe4d6] text-[#5e6f69]";
  const target = e.event.startsWith("package_") && e.target ? pkg(e.target, l) : e.target;
  return (
    <li className="relative ps-6" data-testid={`row-visitor-event-${e.event_id}`}>
      <span className="absolute start-[5px] top-2 h-2 w-2 rounded-full bg-[#0f5c4d] ring-4 ring-[#fffdf8]" />
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{evLabel(e.event, l)}</span>
        <time className="text-[11px] text-[#7d8a85]" dateTime={e.created_at}>{fmt(e.created_at, l)}</time>
      </div>
      <dl className="mt-1 grid grid-cols-1 gap-x-4 gap-y-0.5 text-xs text-[#5e6f69] sm:grid-cols-2">
        {e.location && <div className="min-w-0 truncate" dir="ltr" title={e.location}>{e.location}</div>}
        {target && <div className="min-w-0 truncate"><span className="text-[#7d8a85]">{t.target}: </span><span dir="auto">{target}</span></div>}
        {(e.source || e.campaign) && <div className="min-w-0 truncate">{src(e.source, l)}{e.campaign ? <span dir="auto"> · {e.campaign}</span> : null}</div>}
        <div className="min-w-0 truncate">{[e.device, e.browser, e.country || t.unknownCountry].filter(Boolean).join(" · ")}</div>
        {e.session_id && <div className="min-w-0 truncate font-mono text-[10px] text-[#9aa49f]" dir="ltr">{t.session} {e.session_id.slice(0, 8)}</div>}
      </dl>
    </li>
  );
}

function VisitorDetailPanel({ id, onClose, onAuth, t, l }: { id: string; onClose: () => void; onAuth: (e: unknown) => void; t: typeof T.en; l: Lang }) {
  const [page, setPage] = useState(1);
  const q = useGetSupportVisitor(id, page, { query: { queryKey: getGetSupportVisitorQueryKey(id, page), retry: false, staleTime: 0, refetchInterval: 30000, placeholderData: (p) => p } });
  const authRef = useRef(onAuth); authRef.current = onAuth;
  useEffect(() => { if (q.error) authRef.current(toSupportError(q.error)); }, [q.error]);
  const p = q.data?.profile;
  return (
    <section aria-label={t.timeline} className="rounded-2xl border border-[#e2dbcc] bg-[#fffdf8]" data-testid="panel-visitor-detail">
      <header className="flex items-start gap-3 border-b border-[#e2dbcc] p-4">
        <div className="min-w-0 flex-1">
          <h3 dir="auto" className="truncate text-base font-bold text-[#16302b]" data-testid="text-visitor-name">{p ? p.name || p.emails[0] || t.anon : "\u00a0"}</h3>
          <div className="mt-0.5 font-mono text-[10px] text-[#7d8a85]" dir="ltr">{t.id} {id}</div>
        </div>
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-[#ebe4d6]" aria-label={t.close} data-testid="button-close-visitor"><X className="h-4 w-4" /></button>
      </header>
      {q.isLoading ? (
        <div className="space-y-2 p-4" aria-busy="true">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-[#ebe4d6]" />)}</div>
      ) : q.error ? <div className="p-4"><ErrorBox error={q.error} onRetry={() => q.refetch()} retry={t.retry} /></div> : p ? (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#e2dbcc] bg-[#e2dbcc] text-xs sm:grid-cols-4">
            {[[t.first, fmt(p.first_seen, l)], [t.last, fmt(p.last_seen, l)], [t.events, nf(p.event_count, l)], [t.downloads, nf(p.downloads, l)]].map(([k, v]) => (
              <div key={k} className="bg-[#fffdf8] p-2.5"><div className={label}>{k}</div><div className="mt-0.5 font-semibold text-[#16302b] tabular-nums">{v}</div></div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-[#f0dfb0] bg-[#fbf5e3] p-3">
            <div className={label}>{t.contact}</div>
            {p.emails.length || p.phones.length ? (
              <ul className="mt-1.5 space-y-1 text-sm">
                {p.emails.map((m) => <li key={m}><a href={`mailto:${m}`} dir="ltr" className="inline-flex items-center gap-1.5 text-[#0f5c4d] underline-offset-2 hover:underline" data-testid={`link-email-${m}`}><Mail className="h-3.5 w-3.5" />{m}</a></li>)}
                {p.phones.map((ph) => <li key={ph}><a href={`tel:${ph.replace(/[^\d+]/g, "")}`} dir="ltr" className="inline-flex items-center gap-1.5 text-[#0f5c4d] underline-offset-2 hover:underline" data-testid={`link-phone-${ph}`}><Phone className="h-3.5 w-3.5" />{ph}</a></li>)}
              </ul>
            ) : <p className="mt-1 text-xs text-[#7a5a06]">{t.noContact}</p>}
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><dt className={`${label} flex items-center gap-1`}><MonitorSmartphone className="h-3 w-3" />{t.devices}</dt><dd className="mt-1"><Chips items={p.devices} /></dd></div>
            <div><dt className={`${label} flex items-center gap-1`}><Globe className="h-3 w-3" />{t.countries}</dt><dd className="mt-1"><Chips items={p.countries.filter(Boolean)} empty={t.unknownCountry} /></dd></div>
            <div><dt className={label}>{t.sources}</dt><dd className="mt-1"><Chips items={p.sources} render={(s) => src(s, l)} /></dd></div>
            <div><dt className={label}>{t.packages}</dt><dd className="mt-1"><Chips items={p.packages} render={(s) => pkg(s, l)} /></dd></div>
          </dl>
          <h4 className={`${label} mt-5 mb-3`}>{t.timeline} <span className="font-mono normal-case tracking-normal">({nf(q.data?.total ?? 0, l)})</span></h4>
          {(q.data?.events ?? []).length === 0 ? <p className="py-6 text-center text-sm text-[#5e6f69]">{t.noEvents}</p> : (
            <ol className={`relative space-y-3 before:absolute before:start-[8px] before:top-1 before:bottom-1 before:w-px before:bg-[#e2dbcc] ${q.isPlaceholderData ? "opacity-60" : ""}`}>
              {q.data!.events.map((e) => <EventItem key={e.event_id} e={e} t={t} l={l} />)}
            </ol>
          )}
          <Pager id="timeline" page={page} total={q.data?.total ?? 0} size={q.data?.pageSize ?? 1} onPage={setPage} t={t} />
        </div>
      ) : null}
    </section>
  );
}

export function SupportVisitors({ onAuth }: { onAuth: (e: unknown) => void }) {
  const { language } = useLanguage();
  const l: Lang = language === "ar" ? "ar" : "en";
  const [source, setSource] = useState<"website" | "intercom">("website");
  const [candidate, setCandidate] = useState<string | null>(null);
  return <div className="space-y-4">
    <div className="flex gap-2" role="group" aria-label={l === "ar" ? "مصدر النشاط" : "Activity source"}>
      <button className={btnGhost} aria-pressed={source === "website"} onClick={() => setSource("website")}>{l === "ar" ? "نشاط الموقع" : "Website activity"}</button>
      <button className={btnGhost} aria-pressed={source === "intercom"} onClick={() => setSource("intercom")}>Intercom</button>
    </div>
    {source === "intercom" ? <IntercomVisitors l={l} onAuth={onAuth} onWebsite={id => { setCandidate(id); setSource("website"); }} />
      : <WebsiteVisitors onAuth={onAuth} initialSelected={candidate} />}
  </div>;
}

function WebsiteVisitors({ onAuth, initialSelected }: { onAuth: (e: unknown) => void; initialSelected: string | null }) {
  const { language } = useLanguage();
  const l: Lang = language === "ar" ? "ar" : "en";
  const t = T[l];
  const [days, setDays] = useState<GetSupportVisitorsDays>(30);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<string | null>(initialSelected);
  useEffect(() => { const h = setTimeout(() => { setSearch(draft.trim()); setPage(1); }, 350); return () => clearTimeout(h); }, [draft]);
  const params = { search: search || undefined, page, days };
  const q = useGetSupportVisitors(params, { query: { queryKey: getGetSupportVisitorsQueryKey(params), retry: false, staleTime: 0, refetchInterval: 30000, placeholderData: (p) => p } });
  const authRef = useRef(onAuth); authRef.current = onAuth;
  useEffect(() => { if (q.error) authRef.current(toSupportError(q.error)); }, [q.error]);
  const items = q.data?.items ?? [];

  return (
    <div className="space-y-4" data-testid="panel-visitors">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[#16302b]">{t.title}</h2>
        {q.data && <span className="rounded-full bg-[#ebe4d6] px-2.5 py-0.5 text-xs font-semibold text-[#5e6f69]" data-testid="text-visitors-total">{t.visitors(q.data.total)}</span>}
        <div className="ms-auto flex overflow-x-auto rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-1 text-xs" role="group">
          {DAYS.map((d) => (
            <button key={d} aria-pressed={days === d} onClick={() => { setDays(d); setPage(1); }} className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 font-semibold ${days === d ? "bg-[#16302b] text-[#f7f3ea]" : "text-[#5e6f69]"}`} data-testid={`filter-visitor-days-${d}`}>{t.days[d]}</button>
          ))}
        </div>
        <button onClick={() => q.refetch()} disabled={q.isFetching} className={btnGhost} data-testid="button-refresh-visitors"><RefreshCw className={`h-4 w-4 ${q.isFetching ? "animate-spin" : ""}`} />{t.refresh}</button>
      </div>

      <details className="group rounded-xl border border-[#cfe6dc] bg-[#e6f0ec] px-3.5 py-2.5 text-xs leading-relaxed text-[#0b4a3e]" open>
        <summary className="flex cursor-pointer items-center gap-2 font-semibold"><Info className="h-3.5 w-3.5 shrink-0" />{t.notes[0]}</summary>
        <ul className="mt-1.5 list-disc space-y-0.5 ps-9">{t.notes.slice(1).map((n) => <li key={n}>{n}</li>)}</ul>
      </details>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] [&>*]:min-w-0">
        <div className={sel ? "hidden lg:block" : ""}>
          <label className="relative block">
            <span className="sr-only">{t.search}</span>
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8a85]" />
            <input type="search" dir="auto" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t.search}
              className="w-full rounded-xl border border-[#d9d2c3] bg-[#fffdf8] py-2.5 pe-3.5 ps-9 text-sm text-[#16302b] outline-none focus:border-[#0f5c4d] focus:ring-2 focus:ring-[#0f5c4d]/15" data-testid="input-visitor-search" />
          </label>
          {q.dataUpdatedAt > 0 && <p className="mt-2 text-[11px] text-[#7d8a85]" data-testid="text-visitors-updated">{t.updated} {fmt(new Date(q.dataUpdatedAt).toISOString(), l)}</p>}
          <div className="mt-3">
            {q.isLoading ? (
              <div className="space-y-2" aria-busy="true">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[68px] animate-pulse rounded-xl bg-[#ebe4d6]" />)}</div>
            ) : q.error ? <ErrorBox error={q.error} onRetry={() => q.refetch()} retry={t.retry} /> : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cfc6b3] px-6 py-12 text-center text-sm text-[#5e6f69]" data-testid="status-visitors-empty">
                <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-[#cfc6b3] bg-[repeating-linear-gradient(45deg,#e8e0cf_0_4px,transparent_4px_8px)]" />
                <p className="font-semibold text-[#16302b]">{t.none}</p><p className="mt-1 text-xs">{t.noneHint}</p>
              </div>
            ) : (
              <>
                <ul className={`space-y-2 lg:max-h-[68vh] lg:overflow-y-auto lg:pe-1 ${q.isPlaceholderData ? "opacity-60" : ""}`}>
                  {items.map((v) => <VisitorRow key={v.id} v={v} active={sel === v.id} onSelect={() => setSel(v.id)} t={t} l={l} />)}
                </ul>
                <Pager id="visitors" page={page} total={q.data?.total ?? 0} size={q.data?.pageSize ?? 1} onPage={setPage} t={t} />
              </>
            )}
          </div>
        </div>
        {sel ? <VisitorDetailPanel key={sel} id={sel} onClose={() => setSel(null)} onAuth={onAuth} t={t} l={l} />
          : <div className="hidden rounded-2xl border border-dashed border-[#cfc6b3] p-10 text-center text-sm text-[#5e6f69] lg:block">{t.select}</div>}
      </div>
    </div>
  );
}
