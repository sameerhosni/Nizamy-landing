import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, BookCheck, ChevronDown, Link2, Target, TriangleAlert } from "lucide-react";
import { supportApi, type GapState, type SupportCase, type SupportGap, type SupportObjective } from "@/lib/supportApi";

const L = {
  en: {
    intro: "Group recurring product questions by objective. Confirmed gaps have staff-reviewed evidence; uncertain suggestions still need review. Teach an objective once for multiple conversations.",
    claims: "Customer messages are claims, not approved facts. Verify before writing guidance.",
    confirmed: "Confirmed unresolved", suggested: "Uncertain suggestions", closed: "Resolved or dismissed",
    occurrences: (n: number) => `${n} distinct conversation${n === 1 ? "" : "s"}`, suggestedN: (n: number) => `${n} awaiting review`,
    rep: "Representative question", evidence: "Evidence", context: "Full original context", source: "Source",
    guidance: "Linked guidance", noGuidance: "No guidance linked yet", createG: "Create guidance", editG: "Edit guidance",
    linkExisting: "Link an existing approved answer", choose: "Choose an approved answer", link: "Link",
    linkNote: "Linking or activating guidance never resolves gaps automatically. Mark each gap resolved after you verify the answer covers it.",
    stale: "The conversation or its relevance changed since review. Open gaps remain suggestions until the current product relevance and evidence are reviewed.",
    question: "Specific unanswered question", evidenceLabel: "Evidence: quote or describe the missing answer and confirm it is a product inquiry",
    act: { confirmed: "Confirm unresolved", suggested: "Keep as suggestion", resolved: "Mark resolved", dismissed: "Dismiss" } as Record<GapState, string>,
    review: "Review", cancel: "Cancel", saving: "Saving", loading: "Loading", retry: "Retry",
    empty: "No grouped objectives yet. Open a confirmed inbox item and record the unanswered question it contains.",
    none: "Nothing here.", status: { draft: "Draft", approved: "Approved", disabled: "Disabled" },
    state: { suggested: "Suggested", confirmed: "Confirmed", resolved: "Resolved", dismissed: "Dismissed" } as Record<GapState, string>,
    required: "Question and evidence are required.",
  },
  ar: {
    intro: "جمّع أسئلة المنتج المتكررة حسب الهدف. الفجوات المؤكدة لها دليل راجعه الفريق؛ والاقتراحات غير المؤكدة تحتاج مراجعة. علّم الهدف مرة واحدة لعدة محادثات.",
    claims: "رسائل العملاء ادعاءات وليست حقائق معتمدة. تحقق منها قبل كتابة الإرشاد.",
    confirmed: "فجوات مؤكدة بلا إجابة", suggested: "اقتراحات غير مؤكدة", closed: "تم حلها أو استبعادها",
    occurrences: (n: number) => `${n} محادثة مختلفة`, suggestedN: (n: number) => `${n} بانتظار المراجعة`,
    rep: "السؤال الممثل", evidence: "الدليل", context: "السياق الأصلي كاملًا", source: "المصدر",
    guidance: "الإرشاد المرتبط", noGuidance: "لا يوجد إرشاد مرتبط بعد", createG: "إنشاء إرشاد", editG: "تعديل الإرشاد",
    linkExisting: "ربط إجابة معتمدة موجودة", choose: "اختر إجابة معتمدة", link: "ربط",
    linkNote: "ربط الإرشاد أو تفعيله لا يحل الفجوات تلقائيًا. علّم كل فجوة كمحلولة بعد التحقق من أن الإجابة تغطيها.",
    stale: "تغيّرت المحادثة أو صلتها بالمنتج بعد المراجعة. تبقى الفجوات المفتوحة اقتراحات حتى مراجعة الصلة والدليل الحاليين.",
    question: "السؤال المحدد الذي لم يُجب عنه", evidenceLabel: "الدليل: اقتبس أو صف الإجابة الناقصة وأكد أنه استفسار عن المنتج",
    act: { confirmed: "تأكيد عدم الحل", suggested: "إبقاء كاقتراح", resolved: "تعليم كمحلولة", dismissed: "استبعاد" } as Record<GapState, string>,
    review: "مراجعة", cancel: "إلغاء", saving: "جارٍ الحفظ", loading: "جارٍ التحميل", retry: "إعادة المحاولة",
    empty: "لا توجد أهداف مجمعة بعد. افتح سؤالًا مؤكدًا في الصندوق وسجّل السؤال الذي لم يُجب عنه.",
    none: "لا شيء هنا.", status: { draft: "مسودة", approved: "معتمدة", disabled: "معطلة" },
    state: { suggested: "مقترحة", confirmed: "مؤكدة", resolved: "محلولة", dismissed: "مستبعدة" } as Record<GapState, string>,
    required: "السؤال والدليل مطلوبان.",
  },
};
type Lx = typeof L.en;
const field = "w-full rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3 py-2 text-sm text-[#16302b] outline-none focus:border-[#0f5c4d] focus:ring-2 focus:ring-[#0f5c4d]/15";
const ghost = "inline-flex items-center gap-1.5 rounded-lg border border-[#d9d2c3] bg-[#fffdf8] px-3 py-1.5 text-xs font-semibold text-[#16302b] hover:border-[#0f5c4d] disabled:opacity-40";
const primary = "inline-flex items-center gap-1.5 rounded-lg bg-[#0f5c4d] px-3 py-1.5 text-xs font-semibold text-[#f7f3ea] hover:bg-[#0b4a3e] disabled:opacity-40";
const em = (e: unknown) => (e instanceof Error ? e.message : String(e));

function GapRow({ gap, objectiveId, t, onAuth }: { gap: SupportGap; objectiveId: number; t: Lx; onAuth: (e: unknown) => void }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState(gap.question);
  const [evidence, setEvidence] = useState(gap.evidence);
  const save = useMutation({
    mutationFn: (state: GapState) => supportApi.saveGap(gap.inboxId, { objectiveId, question: question.trim(), evidence: evidence.trim(), state, fingerprint: gap.fingerprint }),
    onSuccess: () => { setOpen(false); qc.invalidateQueries({ queryKey: ["support", "objectives"] }); qc.invalidateQueries({ queryKey: ["support", "inbox"] }); },
    onError: (e) => { onAuth(e); qc.invalidateQueries({ queryKey: ["support", "objectives"] }); },
  });
  const ok = question.trim() && evidence.trim();
  return (
    <li className="rounded-xl border border-[#e2dbcc] bg-[#fffdf8] p-3" data-testid={`row-gap-${gap.id}`}>
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5e6f69]">
        <span className="rounded-full bg-[#ebe4d6] px-2 py-0.5 font-semibold">{t.state[gap.state]}</span>
        <span>{t.source}: {gap.source}</span>
        {gap.sourceId && <span dir="ltr" className="font-mono" data-testid={`text-gap-source-${gap.id}`}>{gap.sourceId}</span>}
        <span className="ms-auto">{new Date(gap.reviewedAt).toLocaleDateString()}</span>
      </div>
      {gap.stale && <p className="mt-2 flex gap-1.5 rounded-lg bg-[#f3e3b5]/70 px-2.5 py-1.5 text-xs text-[#7a5a06]" data-testid={`text-gap-stale-${gap.id}`}><TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t.stale}</p>}
      <p dir="auto" className="mt-2 text-sm font-semibold text-[#16302b]">{gap.question}</p>
      <p dir="auto" className="mt-1 text-xs text-[#5e6f69]"><span className="font-semibold">{t.evidence}: </span>{gap.evidence}</p>
      <details className="mt-2 text-xs">
        <summary className="cursor-pointer font-semibold text-[#0f5c4d]">{t.context}</summary>
        <pre dir="auto" className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#f4efe4] p-3 font-[inherit] text-sm">{gap.context}</pre>
      </details>
      {!open ? <button className={`${ghost} mt-2`} onClick={() => { setQuestion(gap.question); setEvidence(gap.evidence); setOpen(true); }} data-testid={`button-review-gap-${gap.id}`}>{t.review}</button> : (
        <div className="mt-3 space-y-2 border-t border-[#e2dbcc] pt-3">
          <label className="block text-xs font-semibold text-[#5e6f69]">{t.question}
            <input dir="auto" className={`${field} mt-1`} value={question} onChange={(e) => setQuestion(e.target.value)} data-testid={`input-gap-question-${gap.id}`} /></label>
          <label className="block text-xs font-semibold text-[#5e6f69]">{t.evidenceLabel}
            <textarea dir="auto" rows={3} className={`${field} mt-1`} value={evidence} onChange={(e) => setEvidence(e.target.value)} data-testid={`input-gap-evidence-${gap.id}`} /></label>
          {!ok && <p className="text-xs text-[#8a3a1c]">{t.required}</p>}
          {save.error ? <p role="alert" className="text-xs text-[#8a3a1c]" data-testid={`text-gap-error-${gap.id}`}>{em(save.error)}</p> : null}
          <div className="flex flex-wrap gap-1.5">
            {(["confirmed", "suggested", "resolved", "dismissed"] as const).map((s) => (
              <button key={s} disabled={!ok || save.isPending || (!gap.eligible && (s === "confirmed" || s === "suggested"))} onClick={() => save.mutate(s)} className={s === "confirmed" ? primary : ghost} data-testid={`button-gap-${s}-${gap.id}`}>{save.isPending && save.variables === s ? t.saving : t.act[s]}</button>
            ))}
            <button className={ghost} onClick={() => setOpen(false)}>{t.cancel}</button>
          </div>
        </div>
      )}
    </li>
  );
}

function ObjectiveCard({ o, t, onAuth, onOpenCase, approved }: { o: SupportObjective; t: Lx; onAuth: (e: unknown) => void; onOpenCase: (c: SupportCase, ref?: string) => void; approved: SupportCase[] }) {
  const qc = useQueryClient();
  const [pick, setPick] = useState("");
  const confirmed = o.gaps.filter((g) => g.state === "confirmed");
  const suggested = o.gaps.filter((g) => g.state === "suggested");
  const closed = o.gaps.filter((g) => g.state === "resolved" || g.state === "dismissed");
  const rep = confirmed[0] ?? suggested[0] ?? closed[0];
  const guide = useMutation({
    mutationFn: (caseId?: number) => supportApi.objectiveGuidance(o.id, caseId),
    onSuccess: (r, caseId) => {
      qc.invalidateQueries({ queryKey: ["support", "objectives"] }); qc.invalidateQueries({ queryKey: ["support", "cases"] });
      if (caseId == null) onOpenCase(r.case, rep?.context); else setPick("");
    },
    onError: onAuth,
  });
  const group = (label: string, list: SupportGap[], key: string, defOpen: boolean) => (
    <details open={defOpen} className="group mt-3" data-testid={`group-${key}-${o.id}`}>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7d8a85]">
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />{label} ({list.length})
      </summary>
      {list.length === 0 ? <p className="mt-2 text-xs text-[#7d8a85]">{t.none}</p> :
        <ul className="mt-2 space-y-2">{list.map((g) => <GapRow key={`${g.id}-${g.fingerprint}`} gap={g} objectiveId={o.id} t={t} onAuth={onAuth} />)}</ul>}
    </details>
  );
  return (
    <article className="rounded-2xl border border-[#e2dbcc] bg-[#fbf8f1] p-5" data-testid={`card-objective-${o.id}`}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-[5.5rem] flex-col items-center rounded-xl bg-[#16302b] px-3 py-2 text-[#f7f3ea]">
          <span className="text-2xl font-bold text-[#f2c14e]" data-testid={`count-confirmed-${o.id}`}>{o.confirmedCount}</span>
          <span className="text-center text-[10px] leading-tight">{t.occurrences(o.confirmedCount)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 dir="auto" className="flex items-center gap-2 text-base font-bold text-[#16302b]"><Target className="h-4 w-4 shrink-0 text-[#0f5c4d]" />{o.title}</h3>
          {o.suggestedCount > 0 && <p className="mt-0.5 text-xs text-[#7a5a06]">{t.suggestedN(o.suggestedCount)}</p>}
          {rep && <p dir="auto" className="mt-2 border-s-2 border-[#f2c14e] ps-3 text-sm text-[#16302b]"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#7d8a85]">{t.rep}</span>{rep.question}</p>}
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-[#d9d2c3] bg-[#fffdf8] p-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <BookCheck className="h-4 w-4 text-[#0f5c4d]" /><span className="text-xs font-semibold text-[#5e6f69]">{t.guidance}:</span>
          {o.caseId != null ? <><span dir="auto" className="font-semibold">{o.guidanceTitle}</span>{o.guidanceStatus && <span className="rounded-full bg-[#cfe6dc] px-2 py-0.5 text-[11px] font-semibold text-[#0b4a3e]" data-testid={`status-guidance-${o.id}`}>{t.status[o.guidanceStatus]}</span>}</> : <span className="text-xs text-[#7d8a85]">{t.noGuidance}</span>}
          <button className={`${primary} ms-auto`} disabled={guide.isPending} onClick={() => guide.mutate(undefined)} data-testid={`button-guidance-${o.id}`}>{guide.isPending && guide.variables == null ? t.loading : o.caseId != null ? t.editG : t.createG}</button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`link-${o.id}`}>{t.linkExisting}</label>
          <select id={`link-${o.id}`} value={pick} onChange={(e) => setPick(e.target.value)} className={`${field} !w-auto max-w-full flex-1 !py-1.5 text-xs`} data-testid={`select-link-case-${o.id}`}>
            <option value="">{t.choose}</option>
            {approved.map((c) => <option key={c.id} value={String(c.id)}>{c.title}</option>)}
          </select>
          <button className={ghost} disabled={!pick || guide.isPending} onClick={() => guide.mutate(Number(pick))} data-testid={`button-link-case-${o.id}`}><Link2 className="h-3.5 w-3.5" />{t.link}</button>
        </div>
        <p className="mt-2 text-[11px] text-[#5e6f69]">{t.linkNote}</p>
        {guide.error ? <p role="alert" className="mt-1 text-xs text-[#8a3a1c]">{em(guide.error)}</p> : null}
      </div>
      {group(t.confirmed, confirmed, "confirmed", true)}
      {group(t.suggested, suggested, "suggested", suggested.some((g) => g.stale))}
      {group(t.closed, closed, "closed", false)}
    </article>
  );
}

export function SupportObjectives({ lang, onAuth, onOpenCase }: { lang: string; onAuth: (e: unknown) => void; onOpenCase: (c: SupportCase, reference?: string) => void }) {
  const t = L[lang === "ar" ? "ar" : "en"];
  const q = useQuery({ queryKey: ["support", "objectives"], queryFn: supportApi.objectives, retry: false, staleTime: 0, refetchInterval: 30000 });
  const cq = useQuery({ queryKey: ["support", "cases"], queryFn: supportApi.cases, retry: false });
  useEffect(() => { if (q.error) onAuth(q.error); }, [q.error, onAuth]);
  useEffect(() => { if (cq.error) onAuth(cq.error); }, [cq.error, onAuth]);
  const approved = useMemo(() => (cq.data?.cases ?? []).filter((c) => c.status === "approved"), [cq.data]);
  const list = useMemo(() => [...(q.data?.objectives ?? [])].sort((a, b) => b.confirmedCount - a.confirmedCount || b.suggestedCount - a.suggestedCount), [q.data]);
  return (
    <div data-testid="view-objectives">
      <p className="mb-2 flex items-start gap-2 rounded-xl border border-[#cfe6dc] bg-[#e6f0ec] px-3.5 py-2.5 text-xs text-[#0b4a3e]"><Target className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t.intro}</p>
      <p className="mb-5 rounded-xl bg-[#f3e3b5]/60 px-3.5 py-2 text-xs text-[#7a5a06]">{t.claims}</p>
      {cq.error ? <p role="alert" className="mb-3 text-sm text-[#8a3a1c]">{em(cq.error)} <button className="underline" onClick={() => cq.refetch()}>{t.retry}</button></p> : null}
      {q.isLoading ? <div className="space-y-3" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-[#ebe4d6]" />)}</div> :
        q.error ? <div className="rounded-xl border border-[#e3b9a6] bg-[#fbeee7] p-4 text-sm text-[#8a3a1c]" data-testid="status-objectives-error">
          <div className="flex gap-2"><AlertCircle className="mt-0.5 h-4 w-4" />{em(q.error)}</div>
          <button className="mt-2 font-semibold underline" onClick={() => q.refetch()}>{t.retry}</button></div> :
        list.length === 0 ? <div className="rounded-2xl border border-dashed border-[#cfc6b3] px-6 py-12 text-center text-sm text-[#5e6f69]" data-testid="empty-objectives">{t.empty}</div> :
        <div className="grid gap-4 xl:grid-cols-2 [overflow-wrap:anywhere]">{list.map((o) => <ObjectiveCard key={o.id} o={o} t={t} onAuth={onAuth} onOpenCase={onOpenCase} approved={approved} />)}</div>}
    </div>
  );
}
