import { useEffect, useRef, useState } from "react";
import { useGetIntercomContacts, useGetIntercomActivity, getGetIntercomActivityQueryKey, getGetIntercomContactsQueryKey } from "@workspace/api-client-react";
import { SupportApiError } from "@/lib/supportApi";

const COPY = {
  en: {
    title: "Intercom contacts", note: "Live Intercom metadata, separate from website tracking. Contacts are not website visitor counts. No message content is imported.",
    search: "Exact email address", apply: "Search", clear: "Clear", refresh: "Refresh", retry: "Retry",
    loading: "Loading Intercom…", empty: "No Intercom contacts found.", anonymous: "Unnamed contact",
    select: "Select an Intercom contact to view conversation activity.", prev: "Previous", next: "Next", close: "Close",
    created: "Created", updated: "Updated", lastSeen: "Last seen", conversations: "Intercom conversations",
    noConversations: "No conversations on this page.", match: "Possible website matches — exact email, unverified",
    matchNote: "The same email does not prove these are the same person. Records are never merged. Names, phone numbers and external IDs are not used for matching.",
    noMatch: "No exact-email website match. This contact remains separate.", open: "View website profile", fetched: "Fetched",
    state: "State", id: "Intercom contact ID", unknown: "Unknown",
    not_configured: "Intercom reporting is not configured. An administrator must set the server-only INTERCOM_ACCESS_TOKEN secret.",
    access_denied: "Intercom access was denied. Check the token, region, and read permissions for contacts and conversations.",
    rate_limited: "Intercom rate limit reached. Wait before retrying.",
    timeout: "Intercom did not respond in time. Please retry.",
    invalid_region: "An administrator must set INTERCOM_API_REGION to us, eu or au.",
    failed: "Intercom activity could not be loaded. Refresh and retry.",
  },
  ar: {
    title: "جهات اتصال Intercom", note: "بيانات مباشرة من Intercom، منفصلة عن تتبع الموقع. جهات الاتصال ليست عدد زوار الموقع. لا يُستورد محتوى الرسائل.",
    search: "عنوان البريد الإلكتروني الكامل", apply: "بحث", clear: "مسح", refresh: "تحديث", retry: "إعادة المحاولة",
    loading: "جارٍ تحميل Intercom…", empty: "لا توجد جهات اتصال مطابقة في Intercom.", anonymous: "جهة اتصال بلا اسم",
    select: "اختر جهة اتصال من Intercom لعرض نشاط المحادثات.", prev: "السابق", next: "التالي", close: "إغلاق",
    created: "تاريخ الإنشاء", updated: "آخر تحديث", lastSeen: "آخر ظهور", conversations: "محادثات Intercom",
    noConversations: "لا توجد محادثات في هذه الصفحة.", match: "تطابق محتمل مع الموقع — بريد مطابق وغير موثّق",
    matchNote: "تطابق البريد لا يثبت أن السجلين للشخص نفسه. لا تُدمج السجلات، ولا تُستخدم الأسماء أو الهواتف أو المعرّفات الخارجية للمطابقة.",
    noMatch: "لا يوجد تطابق بريد مع الموقع. تبقى جهة الاتصال منفصلة.", open: "عرض ملف الموقع", fetched: "وقت جلب البيانات",
    state: "الحالة", id: "معرّف جهة الاتصال في Intercom", unknown: "غير معروف",
    not_configured: "تقارير Intercom غير مهيأة. يجب على المسؤول إضافة السر INTERCOM_ACCESS_TOKEN على الخادم فقط.",
    access_denied: "رفض Intercom الوصول. تحقق من الرمز والمنطقة وصلاحيات قراءة جهات الاتصال والمحادثات.",
    rate_limited: "تم بلوغ حد طلبات Intercom. انتظر قبل إعادة المحاولة.",
    timeout: "لم يستجب Intercom في الوقت المحدد. أعد المحاولة.",
    invalid_region: "يجب على المسؤول تعيين INTERCOM_API_REGION إلى us أو eu أو au.",
    failed: "تعذر تحميل نشاط Intercom. حدّث وأعد المحاولة.",
  },
};
type Lang = keyof typeof COPY;
type Copy = typeof COPY.en;
const button = "rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3 py-2 text-sm text-[#16302b] disabled:opacity-40";
const box = "rounded-xl border border-[#e2dbcc] bg-[#fffdf8] p-4";
const format = (value: string | null, l: Lang) => value ? new Date(value).toLocaleString(l === "ar" ? "ar-SA" : "en-GB") : "—";
function useAuthError(error: unknown, onAuth: (error: unknown) => void) {
  const ref = useRef(onAuth); ref.current = onAuth;
  useEffect(() => {
    const e = error as { status?: number } | null;
    if (e?.status === 401 || e?.status === 403) ref.current(new SupportApiError(e.status, "Staff session required"));
  }, [error]);
}
function Failure({ error, retry, t }: { error: unknown; retry: () => void; t: Copy }) {
  const code = (error as { data?: { code?: string } })?.data?.code;
  const message = code && code in t ? t[code as keyof Copy] : t.failed;
  return <div role="alert" className="rounded-xl border border-[#e3b9a6] bg-[#fbeee7] p-4 text-sm text-[#8a3a1c]">
    <p>{message}</p><button className={`${button} mt-3`} onClick={retry}>{t.retry}</button>
  </div>;
}
function CursorPager({ history, next, pending, change, t }: {
  history: (string | undefined)[]; next?: string | null; pending: boolean;
  change: (history: (string | undefined)[]) => void; t: Copy;
}) {
  return <div className="mt-3 flex items-center justify-between gap-3">
    <button className={button} disabled={pending || history.length === 1} onClick={() => change(history.slice(0, -1))}>{t.prev}</button>
    <span className="text-xs">{history.length}</span>
    <button className={button} disabled={pending || !next || history.includes(next)} onClick={() => next && change([...history, next])}>{t.next}</button>
  </div>;
}
function ContactActivity({ id, l, onAuth, onClose, onWebsite }: {
  id: string; l: Lang; onAuth: (e: unknown) => void; onClose: () => void; onWebsite: (id: string) => void;
}) {
  const t = COPY[l];
  const [history, setHistory] = useState<(string | undefined)[]>([undefined]);
  const params = { contactId: id, cursor: history.at(-1) };
  const q = useGetIntercomActivity(params, { query: { queryKey: getGetIntercomActivityQueryKey(params), retry: false, staleTime: 0, gcTime: 0 } });
  useAuthError(q.error, onAuth);
  const c = q.data?.contact;
  return <section className={box} aria-label={t.conversations}>
    <div className="mb-3 flex flex-wrap gap-2">
      <h3 className="flex-1 font-bold">Intercom · {c?.name || c?.email || id}</h3>
      <button className={button} disabled={q.isFetching} onClick={() => q.refetch()}>{t.refresh}</button>
      <button className={button} onClick={onClose}>{t.close}</button>
    </div>
    {q.isLoading ? <p role="status">{t.loading}</p> : q.error ? <Failure error={q.error} retry={() => q.refetch()} t={t} /> : q.data && c ? <>
      <p className="break-all text-xs">{t.id}: <span dir="ltr">{c.id}</span></p>
      <p dir="auto" className="my-2 break-all">{c.email || "—"}</p>
      <dl className="space-y-1 text-xs text-[#5e6f69]">
        {[[t.created, c.createdAt], [t.updated, c.updatedAt], [t.lastSeen, c.lastSeenAt], [t.fetched, q.data.fetchedAt]].map(([label, value]) =>
          <div key={label}><dt className="inline font-semibold">{label}: </dt><dd className="inline">{format(value, l)}</dd></div>)}
      </dl>
      <div className="my-4 rounded-xl bg-[#fbf5e3] p-3 text-sm">
        <h4 className="font-bold">{t.match}</h4><p className="my-2 text-xs">{t.matchNote}</p>
        {q.data.candidates.length ? q.data.candidates.map(candidate =>
          <button key={candidate.profileId} className={`${button} mb-1 break-all text-start`} onClick={() => onWebsite(candidate.profileId)}>
            {t.open} · {candidate.profileId}
          </button>) : <p className="text-xs">{t.noMatch}</p>}
      </div>
      <h4 className="mb-2 font-bold">{t.conversations}</h4>
      {q.data.conversations.length ? <ol className="space-y-2">{q.data.conversations.map(conversation => <li key={conversation.id} className="rounded-lg border border-[#e2dbcc] p-3 text-xs">
        <p className="font-semibold">Intercom · #{conversation.id}</p>
        <p>{t.state}: {conversation.state === "open" ? (l === "ar" ? "مفتوحة" : "Open") : conversation.state === "closed" ? (l === "ar" ? "مغلقة" : "Closed") : conversation.state === "snoozed" ? (l === "ar" ? "مؤجلة" : "Snoozed") : conversation.state || t.unknown}</p>
        <p>{t.created}: {format(conversation.createdAt, l)}</p><p>{t.updated}: {format(conversation.updatedAt, l)}</p>
      </li>)}</ol> : <p>{t.noConversations}</p>}
      <CursorPager history={history} next={q.data.nextCursor} pending={q.isFetching} change={setHistory} t={t} />
    </> : null}
  </section>;
}
export function IntercomVisitors({ l, onAuth, onWebsite }: { l: Lang; onAuth: (e: unknown) => void; onWebsite: (id: string) => void }) {
  const t = COPY[l];
  const [draft, setDraft] = useState("");
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState<(string | undefined)[]>([undefined]);
  const [selected, setSelected] = useState<string | null>(null);
  const params = { email: email || undefined, cursor: history.at(-1) };
  const q = useGetIntercomContacts(params, { query: { queryKey: getGetIntercomContactsQueryKey(params), retry: false, staleTime: 0, gcTime: 0 } });
  useAuthError(q.error, onAuth);
  return <div className="space-y-4" data-testid="intercom-visitors">
    <h2 className="text-lg font-bold">{t.title}</h2><p className={`${box} text-sm`}>{t.note}</p>
    <form className="flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); setEmail(draft.trim().toLowerCase()); setHistory([undefined]); setSelected(null); }}>
      <input type="email" aria-label={t.search} placeholder={t.search} value={draft} onChange={e => setDraft(e.target.value)} maxLength={254} className={`${button} min-w-0 flex-1`} />
      <button className={button} type="submit">{t.apply}</button>
      <button className={button} type="button" onClick={() => { setDraft(""); setEmail(""); setHistory([undefined]); setSelected(null); }}>{t.clear}</button>
      <button className={button} type="button" disabled={q.isFetching} onClick={() => q.refetch()}>{t.refresh}</button>
    </form>
    <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
      <section aria-label={t.title}>
        {q.isLoading ? <p role="status">{t.loading}</p> : q.error ? <Failure error={q.error} retry={() => q.refetch()} t={t} /> : q.data ? <>
          <p className="mb-2 text-xs">{t.fetched}: {format(q.data.fetchedAt, l)}</p>
          {q.data.items.length ? <ul className="space-y-2">{q.data.items.map(c => <li key={c.id}>
            <button className={`${box} w-full text-start ${selected === c.id ? "!border-[#0f5c4d]" : ""}`} aria-pressed={selected === c.id} onClick={() => setSelected(c.id)}>
              <span className="text-xs font-semibold">Intercom</span><p dir="auto" className="break-all font-bold">{c.name || c.email || t.anonymous}</p>
              <p dir="auto" className="break-all text-xs">{c.email}</p><p className="text-xs">{t.created}: {format(c.createdAt, l)}</p>
            </button>
          </li>)}</ul> : <p className={box}>{t.empty}</p>}
          <CursorPager history={history} next={q.data.nextCursor} pending={q.isFetching} change={h => { setHistory(h); setSelected(null); }} t={t} />
        </> : null}
      </section>
      {selected ? <ContactActivity key={selected} id={selected} l={l} onAuth={onAuth} onClose={() => setSelected(null)} onWebsite={onWebsite} /> : <p className={box}>{t.select}</p>}
    </div>
  </div>;
}
