import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Users } from "lucide-react";
import { SupportVisitors } from "@/pages/SupportVisitors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookCheck, Inbox, LogOut, Mail, MessageSquareText, Plus, RefreshCw, ShieldCheck, ThumbsDown, ThumbsUp, Languages, AlertCircle, X, Sparkles, ArrowRightLeft, CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { stopStaffAnalytics } from "@/lib/analytics";
import { SupportTraffic } from "@/components/SupportTraffic";
import { ChatRelevanceReview } from "@/components/ChatRelevanceReview";
import { StaffReplyPanel } from "@/components/StaffReplyPanel";
import type { InboxViewFilter } from "@/lib/supportApi";
import { supportApi, SupportApiError, type CaseInput, type CaseStatus, type SupportCase, type Ticket, type InboxItem, type InboxSource, type InboxStatus } from "@/lib/supportApi";

import { SupportObjectives } from "@/components/SupportObjectives";
import { GapReview } from "@/components/GapReview";

const T = {
  en: {
    brand: "Teach Nizamy", tag: "Customer conversations and reusable chatbot answers",
    loginTitle: "Sign in with an email code", loginBody: "Enter your work email. If it is allowed, a one-time code will arrive in your inbox.",
    email: "Email", sendCode: "Send code", code: "Six-digit code", verify: "Verify and enter", back: "Use a different email",
    codeSent: "If this address is permitted, a code has been sent.", tickets: "Tickets", cases: "Chatbot answers", feedback: "Feedback",
    logout: "Sign out", lang: "العربية", loading: "Loading", retry: "Retry", noTickets: "No tickets have been submitted yet.",
    noCases: "No cases yet. Write one manually or import drafts from the support inbox.", noFeedback: "No feedback recorded yet.",
    selectTicket: "Select a ticket to read its transcript.", transcript: "Transcript", summary: "Summary",
    newCase: "New case", importDrafts: "Import email drafts", imported: (n: number) => `${n} draft(s) imported.`,
    title: "Topic / customer objective", keywords: "When this applies — scope, exceptions and optional examples", questions: "Diagnostic questions to ask only when needed", resolution: "Teach the AI: facts, instructions, steps and what to avoid",
    inbox: "Customer questions", sync: "Sync sources", synced: (n: number) => `${n} new question(s) imported.`,
    partialSync: "Website conversations synced, but email import did not finish. Existing questions are still available. Ask your administrator to check the incoming-mail connection on this server; SMTP sending settings do not control it.",
    syncFailed: "Source sync could not complete. Previously loaded questions are still shown. Retry, or ask your administrator to check the server logs.",
    inboxRefreshFailed: "Questions could not be refreshed. Any available saved questions are still shown and may be out of date. Retry, or ask your administrator to check the server logs.",
    views: {active:"Teaching inbox",review:"Chats needing relevance review",excluded:"Excluded chats"},
    relevanceNotice:"Only staff-confirmed Nizamy chats appear in the teaching inbox. Older and changed chats stay in “Chats needing relevance review” until confirmed. Original messages and approved answers are preserved.",
    noTeaching:"No confirmed questions here yet. Open “Chats needing relevance review” to check older conversations.",
    newQuestion: "Add question", qTitle: "Short title", qBody: "Customer question", addQ: "Add to inbox",
    noInbox: "No questions match. Sync sources or add one manually.", selectQ: "Select a question to review its details and context.",
    context: "Complete conversation", convert: "Add answer & instructions", openCase: "Edit chatbot answer", markReviewed: "Mark reviewed", markResolved: "Finish review", reopen: "Review again",
    newCount: "Not yet reviewed", unresolved: "Awaiting review", allSources: "All sources",
    qSource: { chat: "Chat", ticket: "Ticket", email: "Email", manual: "Manual" } as Record<InboxSource, string>,
    qStatus: { new: "New", reviewed: "Reviewed", resolved: "Review complete" } as Record<InboxStatus, string>,
    howItWorks: "Teach an objective once, then activate it. AI matches future questions by meaning in Arabic and English and writes a suitable reply from your instructions—not a copy of your wording. It stays within the facts and scope you approve; new or unclear issues may still need guidance.",
    save: "Save changes", create: "Save draft (not used by chatbot)", cancel: "Cancel", approve: "Save & activate for chatbot", disable: "Disable", toDraft: "Return to draft",
    reviewCheck: "I removed all customer-specific details (names, emails, IDs, salaries) and reviewed this content.",
    status: { draft: "Draft", approved: "Approved", disabled: "Disabled" } as Record<CaseStatus, string>,
    source: { manual: "Manual", email: "Email" }, updated: "Updated", helpful: "Helpful", notHelpful: "Not helpful",
    comment: "Comment", addFeedback: "Record feedback", sessionExpired: "Your session ended. Sign in again.",
    privacy: "Guidance must never contain customer identities.", selectCase: "Select a case to edit, or create a new one.",
    all: "All",
    previewTitle: "Test draft — preview only",
    previewNotice: "Uses your unsaved instructions and current approved guidance. Does not save or activate anything, create customer conversations, or send notifications.",
    previewQuestion: "Sample question in Arabic or English (up to 4,000 characters)",
    previewRun: "Preview reply",
    previewReply: "Simulated reply",
    previewMatches: "Matched instructions",
    previewNone: "No instructions matched. The reply uses the default product policy.",
    previewDraft: "Unsaved draft",
    previewApproved: "Approved guidance",
    previewStale: "Inputs changed. Run the preview again to see the current result.",
  },
  ar: {
    brand: "تعليم مساعد نظامي", tag: "محادثات العملاء وإجابات المساعد القابلة لإعادة الاستخدام",
    loginTitle: "الدخول برمز عبر البريد", loginBody: "أدخل بريد العمل. إن كان مسموحًا سيصلك رمز لمرة واحدة.",
    email: "البريد الإلكتروني", sendCode: "إرسال الرمز", code: "الرمز المكوّن من ستة أرقام", verify: "تحقق وادخل", back: "استخدام بريد آخر",
    codeSent: "إذا كان هذا البريد مسموحًا فقد أُرسل الرمز.", tickets: "التذاكر", cases: "إجابات المساعد", feedback: "الملاحظات",
    logout: "تسجيل الخروج", lang: "English", loading: "جارٍ التحميل", retry: "إعادة المحاولة", noTickets: "لا توجد تذاكر بعد.",
    noCases: "لا توجد حالات بعد. اكتب حالة يدويًا أو استورد مسودات من بريد الدعم.", noFeedback: "لا توجد ملاحظات مسجلة بعد.",
    selectTicket: "اختر تذكرة لقراءة المحادثة.", transcript: "المحادثة", summary: "الملخص",
    newCase: "حالة جديدة", importDrafts: "استيراد مسودات البريد", imported: (n: number) => `تم استيراد ${n} مسودة.`,
    title: "الموضوع / هدف العميل", keywords: "متى تنطبق التعليمات — النطاق والاستثناءات وأمثلة اختيارية", questions: "أسئلة تشخيصية تُطرح فقط عند الحاجة", resolution: "علّم المساعد: الحقائق والتعليمات والخطوات وما يجب تجنّبه",
    inbox: "أسئلة العملاء", sync: "مزامنة المصادر", synced: (n: number) => `تم استيراد ${n} سؤال جديد.`,
    partialSync: "تمت مزامنة محادثات الموقع، لكن لم يكتمل استيراد البريد. الأسئلة المحفوظة ما زالت متاحة. اطلب من المسؤول التحقق من اتصال قراءة البريد على هذا الخادم؛ إعدادات إرسال SMTP لا تتحكم فيه.",
    syncFailed: "تعذر إكمال مزامنة المصادر. ما زالت الأسئلة المحملة سابقاً ظاهرة. أعد المحاولة أو اطلب من المسؤول مراجعة سجلات الخادم.",
    inboxRefreshFailed: "تعذر تحديث الأسئلة. ما زالت الأسئلة المحفوظة المتاحة ظاهرة وقد لا تكون محدثة. أعد المحاولة أو اطلب من المسؤول مراجعة سجلات الخادم.",
    views: {active:"صندوق التعليم",review:"محادثات تحتاج مراجعة الصلة",excluded:"المحادثات المستبعدة"},
    relevanceNotice:"تظهر في صندوق التعليم فقط المحادثات التي أكد الفريق صلتها بنظامي. تبقى المحادثات القديمة أو التي أضيفت إليها رسائل في «محادثات تحتاج مراجعة الصلة» حتى تأكيدها. تبقى الرسائل الأصلية والإجابات المعتمدة محفوظة.",
    noTeaching:"لا توجد أسئلة مؤكدة هنا بعد. افتح «محادثات تحتاج مراجعة الصلة» للتحقق من المحادثات القديمة.",
    newQuestion: "إضافة سؤال", qTitle: "عنوان مختصر", qBody: "سؤال العميل", addQ: "إضافة إلى الصندوق",
    noInbox: "لا توجد أسئلة مطابقة. زامن المصادر أو أضف سؤالًا يدويًا.", selectQ: "اختر سؤالًا لمراجعة تفاصيله وسياقه.",
    context: "المحادثة كاملة", convert: "إضافة إجابة وتعليمات", openCase: "تعديل إجابة المساعد", markReviewed: "تمت المراجعة", markResolved: "إنهاء المراجعة", reopen: "مراجعة مجددًا",
    newCount: "لم تتم مراجعتها", unresolved: "بانتظار المراجعة", allSources: "كل المصادر",
    qSource: { chat: "محادثة", ticket: "تذكرة", email: "بريد", manual: "يدوي" } as Record<InboxSource, string>,
    qStatus: { new: "جديد", reviewed: "تمت مراجعته", resolved: "اكتملت المراجعة" } as Record<InboxStatus, string>,
    howItWorks: "علّم المساعد الهدف مرة واحدة ثم فعّل التعليمات. يطابق الذكاء الاصطناعي الأسئلة بالمعنى بالعربية والإنجليزية ويصوغ رداً مناسباً، لا نسخة من كلامك. يلتزم بالحقائق والنطاق المعتمد؛ وقد تحتاج المسائل الجديدة أو الغامضة إلى إرشاد إضافي.",
    save: "حفظ التعديلات", create: "حفظ مسودة (لا يستخدمها المساعد)", cancel: "إلغاء", approve: "حفظ وتفعيل للمساعد", disable: "تعطيل", toDraft: "إرجاع إلى مسودة",
    reviewCheck: "أزلت جميع التفاصيل الخاصة بالعميل (الأسماء، البريد، الأرقام، الرواتب) وراجعت المحتوى.",
    status: { draft: "مسودة", approved: "معتمدة", disabled: "معطلة" } as Record<CaseStatus, string>,
    source: { manual: "يدوي", email: "بريد" }, updated: "آخر تحديث", helpful: "مفيد", notHelpful: "غير مفيد",
    comment: "التعليق", addFeedback: "تسجيل ملاحظة", sessionExpired: "انتهت الجلسة. سجّل الدخول مجددًا.",
    privacy: "يجب ألا يحتوي الإرشاد على هوية أي عميل.", selectCase: "اختر حالة لتعديلها أو أنشئ حالة جديدة.",
    all: "الكل",
    previewTitle: "اختبار المسودة — معاينة فقط",
    previewNotice: "يستخدم تعليماتك غير المحفوظة والإرشادات المعتمدة الحالية. لا يحفظ أو يفعّل أي تعليمات، ولا ينشئ محادثات عملاء، ولا يرسل إشعارات.",
    previewQuestion: "سؤال تجريبي بالعربية أو الإنجليزية (حتى ٤٬٠٠٠ حرف)",
    previewRun: "معاينة الرد",
    previewReply: "رد تجريبي",
    previewMatches: "التعليمات المطابقة",
    previewNone: "لم تتطابق أي تعليمات. يعتمد الرد على سياسة المنتج الأساسية.",
    previewDraft: "مسودة غير محفوظة",
    previewApproved: "إرشادات معتمدة",
    previewStale: "تغيّرت المدخلات. أعد المعاينة لرؤية النتيجة الحالية.",
  },
};
type Dict = typeof T.en;

const fmt = (d: string, lang: string) => {
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleString(lang === "ar" ? "ar-SA" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
};
const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

function useNoindex() {
  useEffect(() => {
    stopStaffAnalytics();
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex, nofollow, noarchive";
    document.head.appendChild(m);
    const prev = document.title;
    document.title = "Nizamy Support";
    return () => { m.remove(); document.title = prev; };
  }, []);
}

const input = "w-full rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#16302b] outline-none focus:border-[#0f5c4d] focus:ring-2 focus:ring-[#0f5c4d]/15";
const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f5c4d] px-4 py-2.5 text-sm font-semibold text-[#f7f3ea] hover:bg-[#0b4a3e] disabled:opacity-40 transition-colors";
const btnGhost = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3.5 py-2 text-sm font-medium text-[#16302b] hover:border-[#0f5c4d] disabled:opacity-40 transition-colors";

function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2.5" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-[#ebe4d6] animate-pulse" />
      ))}
    </div>
  );
}
function ErrorBox({ error, onRetry, t }: { error: unknown; onRetry: () => void; t: Dict }) {
  return (
    <div className="rounded-xl border border-[#e3b9a6] bg-[#fbeee7] p-4 text-sm text-[#8a3a1c]" data-testid="status-error">
      <div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{errMsg(error)}</div>
      <button onClick={onRetry} className="mt-3 font-semibold underline" data-testid="button-retry">{t.retry}</button>
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfc6b3] px-6 py-12 text-center text-sm text-[#5e6f69]">
      <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-[#cfc6b3] bg-[repeating-linear-gradient(45deg,#e8e0cf_0_4px,transparent_4px_8px)]" />
      {children}
    </div>
  );
}
function StatusPill({ status, t }: { status: CaseStatus; t: Dict }) {
  const c = { draft: "bg-[#f3e3b5] text-[#7a5a06]", approved: "bg-[#cfe6dc] text-[#0b4a3e]", disabled: "bg-[#e5e1d8] text-[#6b6a64]" }[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{t.status[status]}</span>;
}

function Login({ t, onDone }: { t: Dict; onDone: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const send = useMutation({ mutationFn: () => supportApi.login(email.trim()), onSuccess: () => setStage("code") });
  const verify = useMutation({ mutationFn: () => supportApi.verify(email.trim(), code.trim()), onSuccess: (r) => onDone(r.email) });
  const err = send.error || verify.error;
  return (
    <div className="w-full max-w-md rounded-3xl border border-[#d9d2c3] bg-[#fffdf8] p-8 shadow-[0_20px_60px_-30px_rgba(15,92,77,0.45)]">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f5c4d] text-[#f2c14e]"><ShieldCheck className="h-6 w-6" /></div>
      <h1 className="text-2xl font-bold text-[#16302b]">{t.loginTitle}</h1>
      <p className="mt-2 text-sm text-[#5e6f69]">{t.loginBody}</p>
      <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); stage === "email" ? send.mutate() : verify.mutate(); }}>
        <label className="block text-xs font-semibold text-[#5e6f69]">{t.email}
          <input dir="ltr" type="email" required value={email} disabled={stage === "code"} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-1`} data-testid="input-email" />
        </label>
        {stage === "code" && (
          <>
            <p className="text-xs text-[#0f5c4d]" data-testid="text-code-sent">{t.codeSent}</p>
            <label className="block text-xs font-semibold text-[#5e6f69]">{t.code}
              <input dir="ltr" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value)} className={`${input} mt-1 tracking-[0.4em] font-mono`} data-testid="input-code" />
            </label>
          </>
        )}
        {err && <p className="text-sm text-[#8a3a1c]" data-testid="text-login-error">{errMsg(err)}</p>}
        <button type="submit" disabled={send.isPending || verify.isPending} className={`${btnPrimary} w-full`} data-testid="button-login-submit">
          {send.isPending || verify.isPending ? t.loading : stage === "email" ? t.sendCode : t.verify}
        </button>
        {stage === "code" && (
          <button type="button" onClick={() => { setStage("email"); setCode(""); verify.reset(); }} className="w-full text-sm text-[#5e6f69] underline" data-testid="button-back">{t.back}</button>
        )}
      </form>
    </div>
  );
}

function TicketsView({ t, lang, onAuth }: { t: Dict; lang: string; onAuth: (e: unknown) => void }) {
  const q = useQuery({ queryKey: ["support", "tickets"], queryFn: supportApi.tickets, retry: false });
  const [sel, setSel] = useState<Ticket | null>(null);
  useEffect(() => { if (q.error) onAuth(q.error); }, [q.error, onAuth]);
  if (q.isLoading) return <Skeleton />;
  if (q.error) return <ErrorBox error={q.error} onRetry={() => q.refetch()} t={t} />;
  const tickets = q.data?.tickets ?? [];
  if (!tickets.length) return <Empty>{t.noTickets}</Empty>;
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <ul className="space-y-2 lg:max-h-[72vh] lg:overflow-y-auto lg:pe-1">
        {tickets.map((tk) => (
          <li key={tk.id}>
            <button onClick={() => setSel(tk)} data-testid={`card-ticket-${tk.id}`}
              className={`w-full rounded-xl border p-3.5 text-start transition-colors ${sel?.id === tk.id ? "border-[#0f5c4d] bg-[#e6f0ec]" : "border-[#e2dbcc] bg-[#fffdf8] hover:border-[#b9ad95]"}`}>
              <div className="flex items-center justify-between gap-2">
                <span dir="ltr" className="font-mono text-xs font-semibold text-[#0f5c4d]">{tk.ticketNumber}</span>
                <span className="text-[11px] text-[#7d8a85]">{fmt(tk.createdAt, lang)}</span>
              </div>
              <div className="mt-1 truncate text-sm font-semibold text-[#16302b]">{tk.subject || tk.summary || tk.email}</div>
              <div dir="ltr" className="truncate text-xs text-[#5e6f69] text-start">{tk.name ? `${tk.name} · ` : ""}{tk.email}</div>
            </button>
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-[#e2dbcc] bg-[#fffdf8] p-5">
        {!sel ? <p className="py-16 text-center text-sm text-[#5e6f69]">{t.selectTicket}</p> : (
          <div data-testid="panel-ticket-detail">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5e6f69]">
              <span dir="ltr" className="font-mono font-semibold text-[#0f5c4d]">{sel.ticketNumber}</span>
              <span className="rounded-full bg-[#ebe4d6] px-2 py-0.5 uppercase">{sel.language}</span>
              <span>{fmt(sel.createdAt, lang)}</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-[#16302b]">{sel.subject || "—"}</h2>
            <div dir="ltr" className="text-sm text-[#5e6f69] text-start">{sel.name ? `${sel.name} <${sel.email}>` : sel.email}</div>
            {sel.summary && (<><h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-[#7d8a85]">{t.summary}</h3><p className="mt-1 whitespace-pre-wrap text-sm text-[#16302b]">{sel.summary}</p></>)}
            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-[#7d8a85]">{t.transcript}</h3>
            <pre dir="auto" className="mt-2 max-h-[48vh] overflow-auto whitespace-pre-wrap rounded-xl bg-[#f4efe4] p-4 font-[inherit] text-sm leading-relaxed text-[#16302b]" data-testid="text-transcript">{sel.transcript}</pre>
            <StaffReplyPanel key={String(sel.id)} mode="ticket" ticketId={sel.id} lang={lang} onAuth={onAuth} />
          </div>
        )}
      </div>
    </div>
  );
}

const emptyCase: CaseInput = { title: "", keywords: "", diagnosticQuestions: "", resolution: "" };

function DraftPreview({ t, draft, caseId, onAuth }: { t: Dict; draft: CaseInput; caseId?: string; onAuth: (e: unknown) => void }) {
  const [question, setQuestion] = useState("");
  const signature = JSON.stringify({ question, draft, caseId });
  const preview = useMutation({
    mutationFn: async (snapshot: string) => {
      const input = JSON.parse(snapshot);
      return { snapshot, result: await supportApi.preview(input.question, input.draft, input.caseId) };
    },
    onError: onAuth,
    gcTime: 0,
  });
  const current = preview.data?.snapshot === signature;
  const valid = question.trim() && question.length <= 4000 && draft.title.trim() && draft.title.length <= 200 &&
    draft.resolution.trim() && [draft.keywords, draft.diagnosticQuestions, draft.resolution].every(v => v.length <= 10000);
  return <section className="my-5 space-y-3 rounded-xl border border-[#cfc6b3] bg-[#f4efe4] p-4" data-testid="draft-preview">
    <h3 className="font-bold">{t.previewTitle}</h3>
    <p className="text-xs text-[#5e6f69]">{t.previewNotice}</p>
    <label className="block text-sm">{t.previewQuestion}
      <textarea dir="auto" rows={3} maxLength={4000} value={question} onChange={e => setQuestion(e.target.value)} className={`${input} mt-1`} data-testid="input-preview-question" />
    </label>
    <button type="button" disabled={!valid || preview.isPending} onClick={() => preview.mutate(signature)} className={btnGhost} data-testid="button-preview">
      {preview.isPending ? t.loading : t.previewRun}
    </button>
    <div aria-live="polite" aria-busy={preview.isPending}>
      {preview.error ? <p role="alert" className="text-sm text-[#8a3a1c]">{errMsg(preview.error)}</p> : null}
      {!preview.isPending && preview.data && (!current ? <p className="text-sm">{t.previewStale}</p> : <>
        <h4 className="text-sm font-bold">{t.previewReply}</h4>
        <p dir="auto" className="my-2 whitespace-pre-wrap text-sm" data-testid="preview-reply">{preview.data.result.reply}</p>
        <h4 className="text-sm font-bold">{t.previewMatches}</h4>
        {preview.data.result.matches.length ? <ul className="mt-2 space-y-1 text-sm">
          {preview.data.result.matches.map(m => <li key={m.id}><span dir="auto">{m.title}</span> — {m.source === "draft" ? t.previewDraft : t.previewApproved}</li>)}
        </ul> : <p className="text-sm">{t.previewNone}</p>}
      </>)}
    </div>
  </section>;
}

function CaseEditor({ t, lang, c, onClose, onAuth }: { t: Dict; lang: string; c: SupportCase | null; onClose: () => void; onAuth: (e: unknown) => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<CaseInput>(c ? { title: c.title, keywords: c.keywords, diagnosticQuestions: c.diagnosticQuestions, resolution: c.resolution } : emptyCase);
  const [reviewed, setReviewed] = useState(false);
  const [fbComment, setFbComment] = useState("");
  const [fbHelpful, setFbHelpful] = useState(true);
  const valid = form.title.trim() && form.resolution.trim();
  const done = () => qc.invalidateQueries({ queryKey: ["support"] });
  const save = useMutation({
    mutationFn: (status?: CaseStatus) => {
      const target = status ?? c?.status ?? "draft";
      const payload = { ...form, status: target, ...(target === "approved" ? { reviewed } : {}) };
      return c ? supportApi.updateCase(c.id, payload) : supportApi.createCase(payload);
    },
    onSuccess: () => { done(); onClose(); }, onError: onAuth,
  });
  const fb = useMutation({
    mutationFn: () => supportApi.addFeedback(c!.id, fbComment.trim(), fbHelpful),
    onSuccess: () => { setFbComment(""); qc.invalidateQueries({ queryKey: ["support", "feedback"] }); }, onError: onAuth,
  });
  const fq = useQuery({ queryKey: ["support", "feedback"], queryFn: supportApi.feedback, enabled: !!c, retry: false });
  const mine = useMemo(() => (fq.data?.feedback ?? []).filter((f) => c && String(f.caseId) === String(c.id)), [fq.data, c]);
  const set = (k: keyof CaseInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="rounded-2xl border border-[#e2dbcc] bg-[#fffdf8] p-5" data-testid="panel-case-editor">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">{c && <StatusPill status={c.status} t={t} />}<span className="text-sm font-bold text-[#16302b]">{c ? c.title : t.newCase}</span></div>
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-[#ebe4d6]" aria-label={t.cancel} data-testid="button-close-editor"><X className="h-4 w-4" /></button>
      </div>
      <p className="mb-4 rounded-lg bg-[#f3e3b5]/60 px-3 py-2 text-xs text-[#7a5a06]">{t.privacy}</p>
      <p className="mb-4 rounded-lg bg-[#e6f0ec] px-3 py-3 text-sm text-[#0b4a3e]">{lang === "ar"
        ? "اكتب تعليمات للمساعد، وليس رسالة جاهزة للعميل. حدّد متى تنطبق، وما الذي يوضحه أو يسأل عنه، وما الذي لا يجوز أن يعد به، ومتى يصعّد للفريق. بعد التفعيل سيستخدمها للأسئلة ذات الهدف نفسه ويصوغ الرد حسب السياق، دون الحاجة لكتابة كل صيغة محتملة."
        : "Write instructions for the AI, not a ready-made customer message. Explain when they apply, what to explain or ask, what not to promise, and when to escalate. Once active, it reuses them for the same objective and writes a contextual reply—you do not need every possible phrasing."}</p>
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-[#5e6f69]">{t.title}<input dir="auto" value={form.title} onChange={set("title")} className={`${input} mt-1`} data-testid="input-case-title" /></label>
        <label className="block text-xs font-semibold text-[#5e6f69]">{t.keywords}<input dir="auto" value={form.keywords} onChange={set("keywords")} className={`${input} mt-1`} data-testid="input-case-keywords" /></label>
        <label className="block text-xs font-semibold text-[#5e6f69]">{t.questions}<textarea dir="auto" rows={4} value={form.diagnosticQuestions} onChange={set("diagnosticQuestions")} className={`${input} mt-1`} data-testid="input-case-questions" /></label>
        <label className="block text-xs font-semibold text-[#5e6f69]">{t.resolution}<textarea dir="auto" rows={6} value={form.resolution} onChange={set("resolution")} className={`${input} mt-1`} data-testid="input-case-resolution" /></label>
      </div>
      <p className="mt-4 text-sm" role="status">{lang === "ar"
        ? (c?.status === "approved" ? "هذه الإجابة مفعّلة. راجع التعديلات ثم احفظها لتستخدم في الردود الجديدة." : "هذه الإجابة غير مفعّلة. حفظ المسودة أو إنهاء المراجعة لا يعلّم المساعد؛ اضغط حفظ وتفعيل بعد مراجعة المحتوى.")
        : (c?.status === "approved" ? "This answer is active. Review and save your changes to use them in new replies." : "This answer is not active. Saving a draft or finishing inbox review does not teach the chatbot; review the content, then Save & activate.")}</p>
      {(
        <label className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#d9d2c3] p-3 text-sm text-[#16302b]">
          <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} className="mt-1 accent-[#0f5c4d]" data-testid="checkbox-reviewed" />{t.reviewCheck}
        </label>
      )}
      <DraftPreview t={t} draft={form} caseId={c ? String(c.id) : undefined} onAuth={onAuth} />
      {save.error ? <p className="mt-3 text-sm text-[#8a3a1c]" data-testid="text-save-error">{errMsg(save.error)}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button disabled={!valid || save.isPending || (c?.status === "approved" && !reviewed)} onClick={() => save.mutate(undefined)} className={btnGhost} data-testid="button-save-case">{save.isPending ? t.loading : c?.status === "approved" ? t.save : t.create}</button>
        {c?.status !== "approved" && <button disabled={!valid || !reviewed || save.isPending} onClick={() => save.mutate("approved")} className={btnPrimary} data-testid="button-approve-case"><BookCheck className="h-4 w-4" />{t.approve}</button>}
        {c && c.status !== "disabled" && <button disabled={save.isPending} onClick={() => save.mutate("disabled")} className={btnGhost} data-testid="button-disable-case">{t.disable}</button>}
        {c && c.status !== "draft" && <button disabled={save.isPending} onClick={() => save.mutate("draft")} className={btnGhost} data-testid="button-draft-case">{t.toDraft}</button>}
      </div>
      {c && (
        <div className="mt-6 border-t border-[#e2dbcc] pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d8a85]">{t.feedback}</h3>
          <p className="mt-2 text-xs text-[#5e6f69]">{lang === "ar" ? "الملاحظات للتقييم فقط. لتغيير رد المساعد، عدّل الإجابة أعلاه واحفظها مع التفعيل." : "Feedback is for evaluation only. To change the chatbot's reply, edit the answer above and save it as active."}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setFbHelpful(true)} className={`${btnGhost} ${fbHelpful ? "!border-[#0f5c4d] !bg-[#e6f0ec]" : ""}`} data-testid="button-fb-helpful"><ThumbsUp className="h-4 w-4" />{t.helpful}</button>
            <button onClick={() => setFbHelpful(false)} className={`${btnGhost} ${!fbHelpful ? "!border-[#b5562f] !bg-[#fbeee7]" : ""}`} data-testid="button-fb-unhelpful"><ThumbsDown className="h-4 w-4" />{t.notHelpful}</button>
          </div>
          <textarea dir="auto" rows={2} placeholder={t.comment} value={fbComment} onChange={(e) => setFbComment(e.target.value)} className={`${input} mt-2`} data-testid="input-fb-comment" />
          {fb.error ? <p className="mt-2 text-sm text-[#8a3a1c]">{errMsg(fb.error)}</p> : null}
          <button disabled={!fbComment.trim() || fb.isPending} onClick={() => fb.mutate()} className={`${btnGhost} mt-2`} data-testid="button-add-feedback">{fb.isPending ? t.loading : t.addFeedback}</button>
          <div className="mt-4 space-y-2">
            {fq.isLoading ? <Skeleton rows={2} /> : fq.error ? <ErrorBox error={fq.error} onRetry={() => fq.refetch()} t={t} /> :
              mine.length === 0 ? <p className="text-xs text-[#7d8a85]">{t.noFeedback}</p> :
                mine.map((f) => (
                  <div key={f.id} className="rounded-lg bg-[#f4efe4] p-3 text-sm" data-testid={`row-feedback-${f.id}`}>
                    <div className="flex items-center gap-2 text-xs text-[#5e6f69]">{f.helpful ? <ThumbsUp className="h-3.5 w-3.5 text-[#0f5c4d]" /> : <ThumbsDown className="h-3.5 w-3.5 text-[#b5562f]" />}{fmt(f.createdAt, lang)}</div>
                    <p dir="auto" className="mt-1 whitespace-pre-wrap text-[#16302b]">{f.comment}</p>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CasesView({ t, lang, onAuth, initial, reference }: { t: Dict; lang: string; onAuth: (e: unknown) => void; initial?: SupportCase | null; reference?: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["support", "cases"], queryFn: supportApi.cases, retry: false });
  const [editing, setEditing] = useState<SupportCase | "new" | null>(initial ?? null);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const imp = useMutation({ mutationFn: supportApi.importEmail, onSuccess: () => qc.invalidateQueries({ queryKey: ["support", "cases"] }), onError: onAuth });
  useEffect(() => { if (q.error) onAuth(q.error); }, [q.error, onAuth]);
  const cases = (q.data?.cases ?? []).filter((c) => filter === "all" || c.status === filter);
  return (
    <div>
      <p className="mb-4 flex items-start gap-2 rounded-xl border border-[#cfe6dc] bg-[#e6f0ec] px-3.5 py-2.5 text-xs text-[#0b4a3e]"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t.howItWorks}</p>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setEditing("new")} className={btnPrimary} data-testid="button-new-case"><Plus className="h-4 w-4" />{t.newCase}</button>
        {imp.data && <span className="text-sm text-[#0f5c4d]" data-testid="text-imported">{t.imported(imp.data.imported)}</span>}
        {imp.error ? <span className="text-sm text-[#8a3a1c]">{errMsg(imp.error)}</span> : null}
        <div className="ms-auto flex rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-1 text-xs">
          {(["all", "draft", "approved", "disabled"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-2.5 py-1.5 font-semibold ${filter === s ? "bg-[#16302b] text-[#f7f3ea]" : "text-[#5e6f69]"}`} data-testid={`filter-${s}`}>{s === "all" ? t.all : t.status[s]}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] [&>*]:min-w-0 [overflow-wrap:anywhere]">
        <div>
          {q.isLoading ? <Skeleton /> : q.error ? <ErrorBox error={q.error} onRetry={() => q.refetch()} t={t} /> : cases.length === 0 ? <Empty>{t.noCases}</Empty> : (
            <ul className="space-y-2">
              {cases.map((c) => (
                <li key={c.id}>
                  <button onClick={() => setEditing(c)} data-testid={`card-case-${c.id}`}
                    className={`w-full rounded-xl border p-3.5 text-start ${editing !== "new" && editing?.id === c.id ? "border-[#0f5c4d] bg-[#e6f0ec]" : "border-[#e2dbcc] bg-[#fffdf8] hover:border-[#b9ad95]"}`}>
                    <div className="flex items-center gap-2"><StatusPill status={c.status} t={t} /><span className="text-[11px] text-[#7d8a85]">{t.source[c.source]} · {t.updated} {fmt(c.updatedAt, lang)}</span></div>
                    <div dir="auto" className="mt-1.5 text-sm font-semibold text-[#16302b]">{c.title}</div>
                    {c.keywords && <div dir="auto" className="truncate text-xs text-[#5e6f69]">{c.keywords}</div>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {editing ? (
          <div className="min-w-0">
            {reference && editing !== "new" && editing.id === initial?.id && <details className="mb-3 rounded-xl border border-[#e2dbcc] bg-[#fffdf8] p-4">
              <summary className="cursor-pointer text-sm font-semibold">{t.context}</summary>
              <pre dir="auto" className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words font-[inherit] text-sm">{reference}</pre>
            </details>}
            <CaseEditor key={editing === "new" ? "new" : String(editing.id) + editing.updatedAt} t={t} lang={lang} c={editing === "new" ? null : editing} onClose={() => setEditing(null)} onAuth={onAuth} />
          </div>
        ) : <div className="hidden rounded-2xl border border-dashed border-[#cfc6b3] p-10 text-center text-sm text-[#5e6f69] lg:block">{t.selectCase}</div>}
      </div>
    </div>
  );
}

function FeedbackView({ t, lang, onAuth }: { t: Dict; lang: string; onAuth: (e: unknown) => void }) {
  const fq = useQuery({ queryKey: ["support", "feedback"], queryFn: supportApi.feedback, retry: false });
  const cq = useQuery({ queryKey: ["support", "cases"], queryFn: supportApi.cases, retry: false });
  useEffect(() => { if (fq.error) onAuth(fq.error); }, [fq.error, onAuth]);
  if (fq.isLoading) return <Skeleton />;
  if (fq.error) return <ErrorBox error={fq.error} onRetry={() => fq.refetch()} t={t} />;
  const list = fq.data?.feedback ?? [];
  if (!list.length) return <Empty>{t.noFeedback}</Empty>;
  const titles = new Map((cq.data?.cases ?? []).map((c) => [String(c.id), c.title]));
  return (
    <ul className="space-y-2">
      {list.map((f) => (
        <li key={f.id} className="flex gap-3 rounded-xl border border-[#e2dbcc] bg-[#fffdf8] p-4" data-testid={`row-feedback-${f.id}`}>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${f.helpful ? "bg-[#cfe6dc] text-[#0b4a3e]" : "bg-[#fbeee7] text-[#b5562f]"}`}>{f.helpful ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}</div>
          <div className="min-w-0">
            <div className="text-xs text-[#7d8a85]"><span dir="auto" className="font-semibold text-[#16302b]">{titles.get(String(f.caseId)) ?? `#${f.caseId}`}</span> · {fmt(f.createdAt, lang)}</div>
            <p dir="auto" className="mt-1 whitespace-pre-wrap text-sm text-[#16302b]">{f.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const qPill: Record<InboxStatus, string> = { new: "bg-[#f3e3b5] text-[#7a5a06]", reviewed: "bg-[#dfe7f0] text-[#2b4a6b]", resolved: "bg-[#cfe6dc] text-[#0b4a3e]" };

function InboxView({ t, lang, onAuth, onOpenCase }: { t: Dict; lang: string; onAuth: (e: unknown) => void; onOpenCase: (c: SupportCase, reference?: string) => void }) {
  const qc = useQueryClient();
  const [view,setView]=useState<InboxViewFilter>("active");
  const q = useQuery({ queryKey: ["support", "inbox",view], queryFn: ()=>supportApi.inbox(view), retry: false, staleTime:0,refetchInterval:30000 });
  const cq = useQuery({ queryKey: ["support", "cases"], queryFn: supportApi.cases, retry: false });
  const [src, setSrc] = useState<InboxSource | "all">("all");
  const [st, setSt] = useState<InboxStatus | "all">("all");
  const [selId, setSelId] = useState<InboxItem["id"] | null>(null);
  const [adding, setAdding] = useState(false);
  const [nt, setNt] = useState(""); const [nq, setNq] = useState("");
  useEffect(() => { if (q.error) onAuth(q.error); }, [q.error, onAuth]);
  const refresh = () => qc.invalidateQueries({ queryKey: ["support", "inbox"] });
  const sync = useMutation({ mutationFn: supportApi.syncInbox, onSuccess: refresh, onError: onAuth });
  const create = useMutation({ mutationFn: () => supportApi.createInbox(nt.trim(), nq.trim()),
    onSuccess: (r) => { setNt(""); setNq(""); setAdding(false); setSelId(r.item.id); refresh(); }, onError: onAuth });
  const upd = useMutation({ mutationFn: (v: { id: InboxItem["id"]; status: InboxStatus }) => supportApi.updateInbox(v.id, v.status), onSuccess: refresh, onError: onAuth });
  const conv = useMutation({ mutationFn: (id: InboxItem["id"]) => supportApi.inboxToCase(id),
    onSuccess: (r) => { refresh(); qc.invalidateQueries({ queryKey: ["support", "cases"] }); onOpenCase(r.case, sel?.context ?? sel?.question); }, onError: onAuth });
  const all = q.data?.items ?? [];
  const items = all.filter((i) => (src === "all" || i.source === src) && (st === "all" || i.status === st));
  const sel = items.find((i) => String(i.id) === String(selId)) ?? null;
  const nNew = all.filter((i) => i.status === "new").length;
  const nOpen = all.filter((i) => i.status !== "resolved").length;
  const linked = sel?.caseId != null ? (cq.data?.cases ?? []).find((c) => String(c.id) === String(sel.caseId)) : undefined;
  const seg = (on: boolean) => `rounded-lg px-2.5 py-1.5 font-semibold ${on ? "bg-[#16302b] text-[#f7f3ea]" : "text-[#5e6f69]"}`;
  return (
    <div>
      <p className="mb-4 flex items-start gap-2 rounded-xl border border-[#cfe6dc] bg-[#e6f0ec] px-3.5 py-2.5 text-xs text-[#0b4a3e]"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t.howItWorks}</p>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-[#e2dbcc] bg-[#fffdf8] p-3"><div className="text-2xl font-bold text-[#7a5a06]" data-testid="count-new">{q.isLoading ? "–" : nNew}</div><div className="text-[11px] text-[#5e6f69]">{t.newCount}</div></div>
        <div className="rounded-xl border border-[#e2dbcc] bg-[#fffdf8] p-3"><div className="text-2xl font-bold text-[#0f5c4d]" data-testid="count-unresolved">{q.isLoading ? "–" : nOpen}</div><div className="text-[11px] text-[#5e6f69]">{t.unresolved}</div></div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setAdding((v) => !v)} className={btnPrimary} data-testid="button-new-question"><Plus className="h-4 w-4" />{t.newQuestion}</button>
        <button onClick={() => sync.mutate()} disabled={sync.isPending} className={btnGhost} data-testid="button-sync"><RefreshCw className={`h-4 w-4 ${sync.isPending ? "animate-spin" : ""}`} />{sync.isPending ? t.loading : t.sync}</button>
        {!sync.isPending && !sync.error && !q.error && q.data?.localSynced !== false && sync.data && (
          <span role="status" className={sync.data.emailSynced === false ? "text-sm text-[#8a3a1c]" : "text-sm text-[#0f5c4d]"} data-testid="text-synced">
            {sync.data.emailSynced === false ? t.partialSync : t.synced(sync.data.imported ?? 0)}
          </span>
        )}
        {sync.error ? <span role="alert" className="text-sm text-[#8a3a1c]">{t.syncFailed}</span> : null}
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <div className="flex flex-wrap rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-1">
          {(["active","review","excluded"] as const).map(v=><button key={v} className={seg(view===v)} data-testid={`filter-relevance-${v}`} onClick={()=>{setView(v);setSelId(null);setSrc("all");setSt("all");}}>{t.views[v]}</button>)}
        </div>
        <div className="flex flex-wrap rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-1">
          {(["all", "chat", "ticket", "email", "manual"] as const).map((s) => <button key={s} onClick={() => setSrc(s)} className={seg(src === s)} data-testid={`filter-source-${s}`}>{s === "all" ? t.allSources : t.qSource[s]}</button>)}
        </div>
        <div className="flex flex-wrap rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-1">
          {(["all", "new", "reviewed", "resolved"] as const).map((s) => <button key={s} onClick={() => setSt(s)} className={seg(st === s)} data-testid={`filter-status-${s}`}>{s === "all" ? t.all : t.qStatus[s]}</button>)}
        </div>
      </div>
      <p className="mb-4 rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-3 text-sm text-[#5e6f69]" data-testid="relevance-inbox-notice">{t.relevanceNotice}</p>
      {adding && (
        <form className="mb-4 space-y-2 rounded-2xl border border-[#e2dbcc] bg-[#fffdf8] p-4" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
          <p className="text-xs text-[#7a5a06]">{t.privacy}</p>
          <input dir="auto" placeholder={t.qTitle} value={nt} onChange={(e) => setNt(e.target.value)} className={input} data-testid="input-question-title" />
          <textarea dir="auto" rows={3} placeholder={t.qBody} value={nq} onChange={(e) => setNq(e.target.value)} className={input} data-testid="input-question-body" />
          {create.error ? <p className="text-sm text-[#8a3a1c]">{errMsg(create.error)}</p> : null}
          <div className="flex gap-2">
            <button type="submit" disabled={!nt.trim() || !nq.trim() || create.isPending} className={btnPrimary} data-testid="button-add-question">{create.isPending ? t.loading : t.addQ}</button>
            <button type="button" onClick={() => setAdding(false)} className={btnGhost}>{t.cancel}</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] [&>*]:min-w-0 [overflow-wrap:anywhere]">
        <div>
          {(q.error || q.data?.localSynced === false) && (
            <div role="alert" className="mb-3 rounded-xl border border-[#e3b9a6] bg-[#fbeee7] p-4 text-sm text-[#8a3a1c]">
              {t.inboxRefreshFailed}
              <button onClick={() => q.refetch()} disabled={q.isFetching} className="ms-3 font-semibold underline" data-testid="button-inbox-retry">{t.retry}</button>
            </div>
          )}
          {q.isLoading ? <Skeleton /> : !q.data && q.error ? null : items.length === 0 ? <Empty>{view==="active"?t.noTeaching:t.noInbox}</Empty> : (
            <ul className="space-y-2 lg:max-h-[68vh] lg:overflow-y-auto lg:pe-1">
              {items.map((i) => (
                <li key={i.id}>
                  <button onClick={() => setSelId(i.id)} data-testid={`card-inbox-${i.id}`}
                    className={`w-full rounded-xl border p-3.5 text-start transition-colors ${String(selId) === String(i.id) ? "border-[#0f5c4d] bg-[#e6f0ec]" : "border-[#e2dbcc] bg-[#fffdf8] hover:border-[#b9ad95]"}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${qPill[i.status]}`}>{t.qStatus[i.status]}</span>
                      <span className="rounded-full bg-[#ebe4d6] px-2 py-0.5 text-[11px] font-semibold text-[#5e6f69]">{t.qSource[i.source]}</span>
                      {i.caseId != null && <BookCheck className="h-3.5 w-3.5 text-[#0f5c4d]" />}
                      <span className="ms-auto text-[11px] text-[#7d8a85]">{fmt(i.createdAt, lang)}</span>
                    </div>
                    <div dir="auto" className="mt-1.5 truncate text-sm font-semibold text-[#16302b]">{i.title}</div>
                    <div dir="auto" className="truncate text-xs text-[#5e6f69]">{i.question}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-[#e2dbcc] bg-[#fffdf8] p-5">
          {!sel ? <p className="py-16 text-center text-sm text-[#5e6f69]">{t.selectQ}</p> : (
            <div data-testid="panel-inbox-detail">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5e6f69]">
                <span className={`rounded-full px-2.5 py-0.5 font-semibold ${qPill[sel.status]}`}>{t.qStatus[sel.status]}</span>
                <span className="rounded-full bg-[#ebe4d6] px-2 py-0.5">{t.qSource[sel.source]}</span>
                {sel.sourceId && <span dir="ltr" className="font-mono">{sel.sourceId}</span>}
                <span>{fmt(sel.createdAt, lang)}</span>
              </div>
              <h2 dir="auto" className="mt-2 text-lg font-bold text-[#16302b]">{sel.title}</h2>
              {sel.source==="chat" && <ChatRelevanceReview key={String(sel.id)} item={sel} lang={lang} onAuth={onAuth} onKeep={()=>{setView("active");setSt("all");setSrc("all");}} />}
              {(sel.source !== "chat" || sel.relevance === "related") && <GapReview key={`gap-${sel.id}`} item={sel} lang={lang} onAuth={onAuth} onOpenCase={onOpenCase} />}
              <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-[#7d8a85]">{t.qBody}</h3>
              <p dir="auto" className="mt-1 whitespace-pre-wrap text-sm text-[#16302b]">{sel.question}</p>
              {sel.context && (<><h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-[#7d8a85]">{t.context}</h3>
                <pre dir="auto" className="mt-2 max-h-[40vh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#f4efe4] p-4 font-[inherit] text-sm leading-relaxed text-[#16302b]">{sel.context}</pre></>)}
              {(upd.error || conv.error) ? <p className="mt-3 text-sm text-[#8a3a1c]">{errMsg(upd.error || conv.error)}</p> : null}
              <p className="mt-4 text-xs text-[#5e6f69]">{lang==="ar" ? "«تمت المراجعة» و«إنهاء المراجعة» لتنظيم الصندوق فقط. لتعليم المساعد: أكّد صلة المحادثة، أضف الإجابة الصحيحة ثم احفظها وفعّلها." : "Mark reviewed and Finish review only organize the inbox. To teach the chatbot: confirm the chat is product-related, add the correct answer, then save and activate it."}</p>
              {sel.source === "chat" && sel.sourceId?.startsWith("conversation:") && <StaffReplyPanel key={`reply-${sel.id}`} mode="chat" inboxId={sel.id} lang={lang} onAuth={onAuth} />}
              <div className="mt-5 flex flex-wrap gap-2">
                {sel.caseId == null ? (
                  <button onClick={() => conv.mutate(sel.id)} disabled={conv.isPending || (sel.source==="chat" && sel.relevance!=="related")} className={btnPrimary} data-testid="button-convert"><ArrowRightLeft className="h-4 w-4" />{conv.isPending ? t.loading : t.convert}</button>
                ) : (
                  <button onClick={() => linked && onOpenCase(linked, sel.context ?? sel.question)} disabled={!linked} className={btnPrimary} data-testid="button-open-case"><BookCheck className="h-4 w-4" />{t.openCase}</button>
                )}
                {sel.status !== "reviewed" && <button disabled={upd.isPending} onClick={() => upd.mutate({ id: sel.id, status: "reviewed" })} className={btnGhost} data-testid="button-mark-reviewed">{t.markReviewed}</button>}
                {sel.status !== "resolved" && <button disabled={upd.isPending} onClick={() => upd.mutate({ id: sel.id, status: "resolved" })} className={btnGhost} data-testid="button-mark-resolved"><CheckCircle2 className="h-4 w-4" />{t.markResolved}</button>}
                {sel.status !== "new" && <button disabled={upd.isPending} onClick={() => upd.mutate({ id: sel.id, status: "new" })} className={btnGhost} data-testid="button-mark-new">{t.reopen}</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Support() {
  useNoindex();
  const { language, toggleLanguage, dir } = useLanguage();
  const t = T[language];
  const qc = useQueryClient();
  const session = useQuery({ queryKey: ["support", "session"], queryFn: supportApi.session, retry: false });
  const [location, setLocation] = useLocation();
  const onVisitors = location.replace(/\/$/, "") === "/support/visitors";
  const [tabState, setTabState] = useState<"inbox" | "objectives" | "tickets" | "cases" | "feedback" | "traffic">("inbox");
  const tab: typeof tabState | "visitors" = onVisitors ? "visitors" : tabState;
  const setTab = (id: typeof tabState | "visitors") => {
    if (id === "visitors") { if (!onVisitors) setLocation("/support/visitors"); return; }
    setTabState(id);
    if (onVisitors) setLocation("/support");
  };
  const [openCase, setOpenCase] = useState<SupportCase | null>(null);
  const [reference, setReference] = useState<string>();
  const [expired, setExpired] = useState(false);
  const logout = useMutation({ mutationFn: supportApi.logout, onSuccess: () => { qc.removeQueries({ queryKey: ["support"] }); qc.setQueryData(["support", "session"], { email: null }); } });
  const [onAuth] = useState(() => (e: unknown) => {
    if (e instanceof SupportApiError && (e.status === 401 || e.status === 403)) {
      setExpired(true);
      qc.setQueryData(["support", "session"], { email: null });
    }
  });
  const email = session.data?.email ?? null;
  const tabs = [
    { id: "inbox" as const, label: t.inbox, icon: Sparkles },
    { id: "tickets" as const, label: t.tickets, icon: Inbox },
    { id: "objectives" as const, label: language === "ar" ? "الأهداف غير المحلولة" : "Objectives", icon: Inbox },
    { id: "cases" as const, label: t.cases, icon: BookCheck },
    { id: "feedback" as const, label: t.feedback, icon: MessageSquareText },
    { id: "traffic" as const, label: language === "ar" ? "الزيارات والتتبع" : "Traffic / Tracking", icon: ArrowRightLeft },
    { id: "visitors" as const, label: language === "ar" ? "نشاط الزوار" : "Visitors", icon: Users },
  ];

  return (
    <div dir={dir} className="min-h-[100dvh] bg-[#f4efe4] text-[#16302b]" style={{ fontFamily: "'IBM Plex Sans Arabic', 'Salma', sans-serif" }}>
      <div className="pointer-events-none fixed inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(90deg,#0f5c4d_0_28px,#f2c14e_28px_36px)]" />
      <header className="border-b border-[#e2dbcc] bg-[#fffdf8]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16302b] font-bold text-[#f2c14e]">ن</div>
          <div><div className="text-sm font-bold">{t.brand}</div><div className="text-xs text-[#5e6f69]">{t.tag}</div></div>
          <div className="ms-auto flex items-center gap-2">
            {email && <span dir="ltr" className="hidden text-xs text-[#5e6f69] sm:inline" data-testid="text-session-email">{email}</span>}
            <button onClick={toggleLanguage} className={btnGhost} data-testid="button-toggle-language"><Languages className="h-4 w-4" />{t.lang}</button>
            {email && <button onClick={() => logout.mutate()} disabled={logout.isPending} className={btnGhost} data-testid="button-logout"><LogOut className="h-4 w-4" />{t.logout}</button>}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        {session.isLoading ? <Skeleton rows={3} /> :
          session.error ? <ErrorBox error={session.error} onRetry={() => session.refetch()} t={t} /> :
            !email ? (
              <div className="flex flex-col items-center pt-10">
                {expired && <p className="mb-4 text-sm text-[#8a3a1c]" data-testid="text-expired">{t.sessionExpired}</p>}
                <Login t={t} onDone={(e) => { setExpired(false); qc.setQueryData(["support", "session"], { email: e }); }} />
              </div>
            ) : (
              <>
                <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-[#e2dbcc]">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => { setTab(id); setOpenCase(null); }} data-testid={`tab-${id}`}
                      className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${tab === id ? "border-[#0f5c4d] text-[#0f5c4d]" : "border-transparent text-[#5e6f69] hover:text-[#16302b]"}`}>
                      <Icon className="h-4 w-4" />{label}
                    </button>
                  ))}
                  <button onClick={() => qc.invalidateQueries({ queryKey: ["support"] })} className="ms-auto p-3 text-[#5e6f69] hover:text-[#0f5c4d]" aria-label={t.retry} data-testid="button-refresh"><RefreshCw className="h-4 w-4" /></button>
                </nav>
                {tab === "inbox" && <InboxView t={t} lang={language} onAuth={onAuth} onOpenCase={(c, context) => { setOpenCase(c); setReference(context); setTab("cases"); }} />}
                {tab === "objectives" && <SupportObjectives lang={language} onAuth={onAuth} onOpenCase={(c, context) => { setOpenCase(c); setReference(context); setTab("cases"); }} />}
                {tab === "tickets" && <TicketsView t={t} lang={language} onAuth={onAuth} />}
                {tab === "cases" && <CasesView key={openCase ? String(openCase.id) : "list"} t={t} lang={language} onAuth={onAuth} initial={openCase} reference={reference} />}
                {tab === "feedback" && <FeedbackView t={t} lang={language} onAuth={onAuth} />}
                {tab === "traffic" && <SupportTraffic onAuth={onAuth} />}
                {tab === "visitors" && <SupportVisitors onAuth={onAuth} />}
              </>
            )}
      </main>
    </div>
  );
}
