import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Info, RefreshCw, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { SupportApiError } from "@/lib/supportApi";

type Num = number | string | null | undefined;
type SourceRow = { source: string; campaign: string | null; visits: Num; clicks: Num; submissions: Num; chats: Num; tickets: Num };
type RecentRow = { event: string; source: string | null; campaign: string | null; location: string | null; target: string | null; created_at: string };
type RecordRow = { kind: string; record_id: string | number; attribution: unknown; created_at: string };
type TrafficData = { sources: SourceRow[]; recent: RecentRow[]; records: RecordRow[] };
type Days = 0 | 1 | 7 | 30;

const BASE = `${import.meta.env.BASE_URL}api/support/traffic`;

async function fetchTraffic(days: Days): Promise<TrafficData> {
  let res: Response;
  try {
    res = await fetch(`${BASE}?days=${days}`, { credentials: "include" });
  } catch {
    throw new SupportApiError(0, "Network error");
  }
  let data: unknown = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    const msg = data && typeof data === "object" && typeof (data as { error?: unknown }).error === "string" ? (data as { error: string }).error : `Request failed (${res.status})`;
    throw new SupportApiError(res.status, msg);
  }
  const d = (data ?? {}) as Partial<TrafficData>;
  return { sources: Array.isArray(d.sources) ? d.sources : [], recent: Array.isArray(d.recent) ? d.recent : [], records: Array.isArray(d.records) ? d.records : [] };
}

const T = {
  en: {
    title: "Traffic and tracking", refresh: "Refresh", loading: "Loading", retry: "Retry", updated: "Updated",
    days: { 0: "All time", 1: "24 hours", 7: "7 days", 30: "30 days" } as Record<Days, string>,
    notice: "Visits include imported PostHog page views, followed by first-party visits after the imported history ends. These are page views, not unique people. Browser tracking can be blocked. Historical clicks are not imported; server-confirmed records are shown separately.",
    sources: "By source and campaign", recent: "Recent browser events", records: "Server-confirmed records",
    cols: { source: "Source", campaign: "Campaign", visits: "Visits", clicks: "Clicks", submissions: "Submissions", chats: "Chats", tickets: "Tickets" },
    rcols: { event: "Event", source: "Source", campaign: "Campaign", location: "Page", target: "Target", time: "Time" },
    kcols: { kind: "Type", id: "Record", attribution: "Attribution", time: "Time" },
    noSources: "No tracked traffic in this period yet.", noRecent: "No browser events recorded in this period.", noRecords: "No server-confirmed records in this period.",
    totals: "Totals", browserTag: "Browser-reported", serverTag: "Server-confirmed",
  },
  ar: {
    title: "الزيارات والتتبع", refresh: "تحديث", loading: "جارٍ التحميل", retry: "إعادة المحاولة", updated: "آخر تحديث",
    days: { 0: "كل الوقت", 1: "24 ساعة", 7: "7 أيام", 30: "30 يومًا" } as Record<Days, string>,
    notice: "تشمل الزيارات مشاهدات الصفحات المستوردة من PostHog ثم زيارات التتبع المحلي بعد نهاية السجل المستورد. هذه مشاهدات صفحات وليست أشخاصًا فريدين. قد يُحجب تتبع المتصفح. لم تُستورد النقرات السابقة، وتُعرض السجلات المؤكدة من الخادم بشكل منفصل.",
    sources: "حسب المصدر والحملة", recent: "أحدث أحداث المتصفح", records: "سجلات مؤكدة من الخادم",
    cols: { source: "المصدر", campaign: "الحملة", visits: "الزيارات", clicks: "النقرات", submissions: "الطلبات", chats: "المحادثات", tickets: "التذاكر" },
    rcols: { event: "الحدث", source: "المصدر", campaign: "الحملة", location: "الصفحة", target: "الهدف", time: "الوقت" },
    kcols: { kind: "النوع", id: "السجل", attribution: "الإسناد", time: "الوقت" },
    noSources: "لا توجد زيارات متتبعة في هذه الفترة بعد.", noRecent: "لا توجد أحداث متصفح في هذه الفترة.", noRecords: "لا توجد سجلات مؤكدة من الخادم في هذه الفترة.",
    totals: "الإجمالي", browserTag: "يبلغ عنه المتصفح", serverTag: "مؤكد من الخادم",
  },
};

const SOURCE_LABEL: Record<string, { en: string; ar: string }> = {
  meta: { en: "Meta", ar: "ميتا" }, google: { en: "Google", ar: "جوجل" }, chatgpt: { en: "ChatGPT", ar: "ChatGPT" }, direct: { en: "Direct", ar: "مباشر" },
};
const SOURCE_DOT: Record<string, string> = { meta: "bg-[#2b4a6b]", google: "bg-[#b5562f]", chatgpt: "bg-[#0f5c4d]", direct: "bg-[#7d8a85]" };

const n = (v: Num) => { const x = typeof v === "number" ? v : Number(v ?? 0); return Number.isFinite(x) ? x : 0; };
const fmt = (d: string, lang: string) => { const dt = new Date(d); return isNaN(dt.getTime()) ? d : dt.toLocaleString(lang === "ar" ? "ar-SA" : "en-GB", { dateStyle: "medium", timeStyle: "short" }); };
const attr = (a: unknown): string => {
  if (a == null || a === "") return "—";
  if (typeof a === "string") return a;
  if (typeof a === "object") return Object.entries(a as Record<string, unknown>).filter(([, v]) => v != null && v !== "").map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`).join(" · ") || "—";
  return String(a);
};

const btnGhost = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3.5 py-2 text-sm font-medium text-[#16302b] hover:border-[#0f5c4d] disabled:opacity-40 transition-colors";
const th = "px-3 py-2.5 text-start text-[11px] font-bold uppercase tracking-wider text-[#7d8a85] whitespace-nowrap";
const td = "px-3 py-2.5 text-sm text-[#16302b] align-top";

function Section({ title, tag, tone, children }: { title: string; tag: string; tone: "browser" | "server"; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e2dbcc] bg-[#fffdf8]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2dbcc] px-4 py-3">
        <h3 className="text-sm font-bold text-[#16302b]">{title}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone === "server" ? "bg-[#cfe6dc] text-[#0b4a3e]" : "bg-[#f3e3b5] text-[#7a5a06]"}`}>{tag}</span>
      </header>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}
function EmptyRow({ text }: { text: string }) {
  return <p className="px-4 py-10 text-center text-sm text-[#5e6f69]">{text}</p>;
}

export function SupportTraffic({ onAuth }: { onAuth: (e: unknown) => void }) {
  const { language } = useLanguage();
  const lang = language === "ar" ? "ar" : "en";
  const t = T[lang];
  const [days, setDays] = useState<Days>(0);
  const q = useQuery({ queryKey: ["support", "traffic", days], queryFn: () => fetchTraffic(days), retry: false, staleTime: 0, refetchInterval: 60000 });
  useEffect(() => { if (q.error) onAuth(q.error); }, [q.error, onAuth]);

  const sources = q.data?.sources ?? [];
  const recent = q.data?.recent ?? [];
  const records = q.data?.records ?? [];
  const keys = ["visits", "clicks", "submissions", "chats", "tickets"] as const;
  const totals = keys.map((k) => sources.reduce((s, r) => s + n(r[k]), 0));
  const srcLabel = (s: string | null) => (s ? SOURCE_LABEL[s.toLowerCase()]?.[lang] ?? s : "—");
  const nf = (v: number) => v.toLocaleString(lang === "ar" ? "ar-SA" : "en-GB");

  return (
    <div className="space-y-4" data-testid="panel-traffic">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-[#16302b]">{t.title}</h2>
        <div className="ms-auto flex rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-1 text-xs">
          {([1, 7, 30, 0] as const).map((d) => (
            <button key={d} onClick={() => setDays(d)} className={`rounded-lg px-2.5 py-1.5 font-semibold ${days === d ? "bg-[#16302b] text-[#f7f3ea]" : "text-[#5e6f69]"}`} data-testid={`filter-days-${d}`}>{t.days[d]}</button>
          ))}
        </div>
        <button onClick={() => q.refetch()} disabled={q.isFetching} className={btnGhost} data-testid="button-refresh-traffic">
          <RefreshCw className={`h-4 w-4 ${q.isFetching ? "animate-spin" : ""}`} />{t.refresh}
        </button>
      </div>
      <p className="flex items-start gap-2 rounded-xl border border-[#cfe6dc] bg-[#e6f0ec] px-3.5 py-2.5 text-xs leading-relaxed text-[#0b4a3e]"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t.notice}</p>
      {q.dataUpdatedAt > 0 && <p className="text-[11px] text-[#7d8a85]" data-testid="text-traffic-updated">{t.updated} {fmt(new Date(q.dataUpdatedAt).toISOString(), lang)}</p>}

      {q.isLoading ? (
        <div className="space-y-2.5" aria-busy="true">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-[#ebe4d6] animate-pulse" />)}</div>
      ) : q.error ? (
        <div className="rounded-xl border border-[#e3b9a6] bg-[#fbeee7] p-4 text-sm text-[#8a3a1c]" data-testid="status-traffic-error">
          <div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{q.error instanceof Error ? q.error.message : String(q.error)}</div>
          <button onClick={() => q.refetch()} className="mt-3 font-semibold underline" data-testid="button-retry-traffic">{t.retry}</button>
        </div>
      ) : (
        <>
          <Section title={t.sources} tag={t.browserTag} tone="browser">
            {sources.length === 0 ? <EmptyRow text={t.noSources} /> : (
              <table className="w-full min-w-[640px]">
                <thead><tr><th className={th}>{t.cols.source}</th><th className={th}>{t.cols.campaign}</th>{keys.map((k) => <th key={k} className={`${th} text-end`}>{t.cols[k]}</th>)}</tr></thead>
                <tbody className="divide-y divide-[#eee8db]">
                  {sources.map((r, i) => (
                    <tr key={`${r.source}-${r.campaign}-${i}`} data-testid={`row-source-${i}`}>
                      <td className={td}><span className="inline-flex items-center gap-2 font-semibold"><span className={`h-2 w-2 rounded-full ${SOURCE_DOT[r.source?.toLowerCase()] ?? "bg-[#cfc6b3]"}`} />{srcLabel(r.source)}</span></td>
                      <td className={`${td} text-[#5e6f69]`} dir="auto">{r.campaign || "—"}</td>
                      {keys.map((k) => <td key={k} className={`${td} text-end font-mono tabular-nums`}>{nf(n(r[k]))}</td>)}
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="border-t-2 border-[#e2dbcc] bg-[#f4efe4]"><td className={`${td} font-bold`} colSpan={2}>{t.totals}</td>{totals.map((v, i) => <td key={i} className={`${td} text-end font-mono font-bold tabular-nums`}>{nf(v)}</td>)}</tr></tfoot>
              </table>
            )}
          </Section>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 [&>*]:min-w-0">
            <Section title={t.records} tag={t.serverTag} tone="server">
              <div className="space-y-2 p-4">
                <a className={btnGhost} href={`${import.meta.env.BASE_URL}api/support/acquisitions.csv?days=${days}`} data-testid="export-form-attribution">
                  {lang === "ar" ? "تصدير مصادر نماذج الموقع CSV" : "Export website form attribution CSV"}
                </a>
                <p className="text-xs text-[#5e6f69]">
                  {lang === "ar"
                    ? "التصدير يشمل جميع النماذج المتتبّعة في الفترة المحددة، مع أول وآخر مصدر والحملة والإعلان والمسوق. الجدول يعرض أحدث 100 سجل فقط. هذه طلبات الموقع وليست تسجيلات التطبيق."
                    : "Export includes all tracked forms in this period, with first/last source, campaign, ad and marketer. The table shows the latest 100 records only. These are website inquiries, not app registrations."}
                </p>
              </div>
              {records.length === 0 ? <EmptyRow text={t.noRecords} /> : (
                <table className="w-full min-w-[480px]">
                  <thead><tr><th className={th}>{t.kcols.kind}</th><th className={th}>{t.kcols.id}</th><th className={th}>{t.kcols.attribution}</th><th className={th}>{t.kcols.time}</th></tr></thead>
                  <tbody className="divide-y divide-[#eee8db]">
                    {records.map((r, i) => (
                      <tr key={`${r.kind}-${r.record_id}-${i}`} data-testid={`row-record-${i}`}>
                        <td className={td}><span className="inline-flex items-center gap-1.5 font-semibold"><ShieldCheck className="h-3.5 w-3.5 text-[#0f5c4d]" />{r.kind}</span></td>
                        <td className={`${td} font-mono text-xs`} dir="ltr">{String(r.record_id)}</td>
                        <td className={`${td} text-xs text-[#5e6f69] [overflow-wrap:anywhere]`} dir="ltr">{attr(r.attribution)}</td>
                        <td className={`${td} whitespace-nowrap text-xs text-[#7d8a85]`}>{fmt(r.created_at, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>
            <Section title={t.recent} tag={t.browserTag} tone="browser">
              {recent.length === 0 ? <EmptyRow text={t.noRecent} /> : (
                <table className="w-full min-w-[560px]">
                  <thead><tr><th className={th}>{t.rcols.event}</th><th className={th}>{t.rcols.source}</th><th className={th}>{t.rcols.location}</th><th className={th}>{t.rcols.target}</th><th className={th}>{t.rcols.time}</th></tr></thead>
                  <tbody className="divide-y divide-[#eee8db]">
                    {recent.map((r, i) => (
                      <tr key={i} data-testid={`row-event-${i}`}>
                        <td className={`${td} font-semibold`}>{r.event}</td>
                        <td className={td}>{srcLabel(r.source)}{r.campaign ? <div className="text-xs text-[#7d8a85]" dir="auto">{r.campaign}</div> : null}</td>
                        <td className={`${td} text-xs text-[#5e6f69] [overflow-wrap:anywhere]`} dir="ltr">{r.location || "—"}</td>
                        <td className={`${td} text-xs text-[#5e6f69] [overflow-wrap:anywhere]`} dir="ltr">{r.target || "—"}</td>
                        <td className={`${td} whitespace-nowrap text-xs text-[#7d8a85]`}>{fmt(r.created_at, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>
          </div>
        </>
      )}
    </div>
  );
}
