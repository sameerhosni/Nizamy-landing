import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookCheck, Sparkles } from "lucide-react";
import { supportApi, type GapState, type InboxItem, type SupportCase } from "@/lib/supportApi";

const L = {
  en: {
    title: "Record an unanswered question", note: "Name the specific question the customer did not get answered. Suggestions below are matched by meaning; they never prove the question is unresolved — your evidence does.",
    claims: "What customers say is a claim, not an approved fact.",
    ineligible: "Confirm this chat is a Nizamy product inquiry before recording a gap.",
    question: "Specific question", find: "Find matching objectives", busy: "Working…",
    suggestedObj: "Suggested objectives (meaning match)", guidance: "Possibly relevant approved guidance", none: "No suggestions.",
    objective: "Objective", pickExisting: "Existing objective", newObj: "Create a new objective", newTitle: "New objective title",
    evidence: "Evidence: quote or describe the missing answer", confirmInquiry: "I confirm this is a genuine Nizamy product inquiry.",
    state: "Record as", st: { suggested: "Uncertain suggestion", confirmed: "Confirmed unresolved" } as Record<"suggested" | "confirmed", string>,
    save: "Save gap", matchErr: "Automatic meaning matching is unavailable right now. Choose an objective and check existing guidance manually; an empty list does not mean no guidance exists.", noMatchNote: "No automatic matches found. This does not mean guidance is missing — check the answers list if unsure.", saved: "Saved to objective.", context: "Context used for this review",
  },
  ar: {
    title: "تسجيل سؤال لم يُجب عنه", note: "حدد السؤال الذي لم يحصل العميل على إجابته. الاقتراحات أدناه مطابقة بالمعنى ولا تثبت أن السؤال بلا إجابة — دليلك هو ما يثبت ذلك.",
    claims: "ما يقوله العميل ادعاء وليس حقيقة معتمدة.",
    ineligible: "أكّد أن هذه المحادثة استفسار عن منتج نظامي قبل تسجيل فجوة.",
    question: "السؤال المحدد", find: "البحث عن أهداف مطابقة", busy: "جارٍ التنفيذ…",
    suggestedObj: "أهداف مقترحة (مطابقة بالمعنى)", guidance: "إرشادات معتمدة قد تكون ذات صلة", none: "لا توجد اقتراحات.",
    objective: "الهدف", pickExisting: "هدف موجود", newObj: "إنشاء هدف جديد", newTitle: "عنوان الهدف الجديد",
    evidence: "الدليل: اقتبس أو صف الإجابة الناقصة", confirmInquiry: "أؤكد أن هذا استفسار حقيقي عن منتج نظامي.",
    state: "التسجيل كـ", st: { suggested: "اقتراح غير مؤكد", confirmed: "مؤكد بلا إجابة" } as Record<"suggested" | "confirmed", string>,
    save: "حفظ الفجوة", matchErr: "المطابقة الآلية بالمعنى غير متاحة حاليًا. اختر هدفًا وتحقق من الإرشادات الموجودة يدويًا؛ القائمة الفارغة لا تعني عدم وجود إرشاد.", noMatchNote: "لم تُعثر على مطابقات آلية. هذا لا يعني غياب الإرشاد — راجع قائمة الإجابات عند الشك.", saved: "تم الحفظ في الهدف.", context: "السياق المستخدم في المراجعة",
  },
};
const field = "mt-1 w-full rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3 py-2 text-sm text-[#16302b] outline-none focus:border-[#0f5c4d] focus:ring-2 focus:ring-[#0f5c4d]/15";
const ghost = "inline-flex items-center gap-1.5 rounded-lg border border-[#d9d2c3] bg-[#fffdf8] px-3 py-1.5 text-xs font-semibold hover:border-[#0f5c4d] disabled:opacity-40";
const primary = "inline-flex items-center gap-1.5 rounded-lg bg-[#0f5c4d] px-3 py-2 text-sm font-semibold text-[#f7f3ea] hover:bg-[#0b4a3e] disabled:opacity-40";
const em = (e: unknown) => (e instanceof Error ? e.message : String(e));

export function GapReview({ item, lang, onAuth, onOpenCase }: { item: InboxItem; lang: string; onAuth: (e: unknown) => void; onOpenCase: (c: SupportCase, reference?: string) => void }) {
  const t = L[lang === "ar" ? "ar" : "en"];
  const qc = useQueryClient();
  const eligible = item.source !== "chat" || item.relevance === "related";
  const [question, setQuestion] = useState(item.question.slice(0, 300));
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [objId, setObjId] = useState("");
  const [title, setTitle] = useState("");
  const [evidence, setEvidence] = useState("");
  const [confirmInq, setConfirmInq] = useState(false);
  const [state, setState] = useState<Extract<GapState, "suggested" | "confirmed">>("suggested");
  const objs = useQuery({ queryKey: ["support", "objectives"], queryFn: supportApi.objectives, retry: false, enabled: eligible });
  const cases = useQuery({ queryKey: ["support", "cases"], queryFn: supportApi.cases, retry: false, enabled: eligible });
  useEffect(() => { if (objs.error) onAuth(objs.error); if (cases.error) onAuth(cases.error); }, [objs.error, cases.error, onAuth]);
  const sugg = useMutation({
    mutationFn: () => supportApi.objectiveSuggestions(item.id, question.trim()),
    onSuccess: (r) => { if (r.objectives[0] && !objId) { setMode("existing"); setObjId(String(r.objectives[0].id)); } },
    onError: onAuth,
  });
  const save = useMutation({
    mutationFn: async () => {
      if (!sugg.data) throw new Error(t.find);
      return supportApi.saveGap(item.id, {
        ...(mode === "existing" ? { objectiveId: Number(objId) } : { title: title.trim() }),
        question: question.trim(), evidence: evidence.trim(), state, fingerprint: sugg.data.fingerprint,
      });
    },
    onSuccess: () => { setEvidence(""); setConfirmInq(false); qc.invalidateQueries({ queryKey: ["support", "objectives"] }); qc.invalidateQueries({ queryKey: ["support", "inbox"] }); },
    onError: onAuth,
  });
  if (!eligible) return <p className="mt-4 rounded-xl border border-dashed border-[#cfc6b3] p-3 text-xs text-[#5e6f69]" data-testid="gap-review-ineligible">{t.ineligible}</p>;
  const openGuidance = (id: number) => {
    const c = (cases.data?.cases ?? []).find((x) => Number(x.id) === id);
    if (c) onOpenCase(c, sugg.data?.context ?? item.context ?? item.question);
  };
  const canSave = sugg.data && !sugg.isPending && question.trim() && evidence.trim() && confirmInq && (mode === "existing" ? !!objId : !!title.trim()) && !save.isPending;
  return (
    <section className="mt-4 space-y-3 rounded-xl border border-[#d9d2c3] bg-[#fbf8f1] p-4" data-testid="gap-review">
      <h3 className="font-bold text-[#16302b]">{t.title}</h3>
      <p className="text-xs text-[#5e6f69]">{t.note}</p>
      <p className="rounded-lg bg-[#f3e3b5]/60 px-2.5 py-1.5 text-xs text-[#7a5a06]">{t.claims}</p>
      <label className="block text-xs font-semibold text-[#5e6f69]">{t.question}
        <input dir="auto" maxLength={4000} className={field} value={question} onChange={(e) => { setQuestion(e.target.value); sugg.reset(); }} data-testid="input-gap-question" /></label>
      <button className={ghost} disabled={!question.trim() || sugg.isPending} onClick={() => sugg.mutate()} data-testid="button-gap-suggest"><Sparkles className="h-3.5 w-3.5" />{sugg.isPending ? t.busy : t.find}</button>
      {sugg.error ? <p role="alert" className="text-xs text-[#8a3a1c]">{em(sugg.error)}</p> : null}
      {sugg.data?.matchingError ? <p role="alert" className="rounded-lg border border-[#e3b9a6] bg-[#fbeee7] px-2.5 py-1.5 text-xs text-[#8a3a1c]" data-testid="text-matching-error">{t.matchErr}</p>
        : sugg.data && !sugg.data.objectives.length && !sugg.data.guidance.length ? <p className="text-xs text-[#5e6f69]" data-testid="text-no-matches">{t.noMatchNote}</p> : null}
      {sugg.data && (
        <div className="grid gap-3 sm:grid-cols-2" data-testid="gap-suggestions">
          <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#7d8a85]">{t.suggestedObj}</p>
            {sugg.data.objectives.length === 0 ? <p className="text-xs text-[#7d8a85]">{t.none}</p> : sugg.data.objectives.map((o) =>
              <button key={o.id} onClick={() => { setMode("existing"); setObjId(String(o.id)); }} className={`mt-1 block w-full rounded-lg border px-2.5 py-1.5 text-start text-xs ${objId === String(o.id) && mode === "existing" ? "border-[#0f5c4d] bg-[#e6f0ec]" : "border-[#e2dbcc] bg-[#fffdf8]"}`} data-testid={`button-suggested-objective-${o.id}`}><span dir="auto">{o.title}</span></button>)}
          </div>
          <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#7d8a85]">{t.guidance}</p>
            {cases.error ? <p role="alert" className="text-xs text-[#8a3a1c]">{em(cases.error)}</p> : null}
            {sugg.data.guidance.length === 0 ? <p className="text-xs text-[#7d8a85]">{t.none}</p> : sugg.data.guidance.map((g) =>
              <button key={g.id} disabled={!cases.data} onClick={() => openGuidance(g.id)} className="mt-1 flex w-full items-center gap-1.5 rounded-lg border border-[#e2dbcc] bg-[#fffdf8] px-2.5 py-1.5 text-start text-xs text-[#0f5c4d] underline-offset-2 hover:underline disabled:opacity-40" data-testid={`link-suggested-guidance-${g.id}`}><BookCheck className="h-3.5 w-3.5 shrink-0" /><span dir="auto">{g.title}</span></button>)}
          </div>
          <details className="sm:col-span-2 text-xs"><summary className="cursor-pointer font-semibold text-[#0f5c4d]">{t.context}</summary>
            <pre dir="auto" className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#f4efe4] p-3 font-[inherit] text-sm">{sugg.data.context}</pre></details>
        </div>
      )}
      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold text-[#5e6f69]">{t.objective}</legend>
        <div className="flex gap-3 text-sm">
          <label className="flex items-center gap-1.5"><input type="radio" checked={mode === "existing"} onChange={() => setMode("existing")} className="accent-[#0f5c4d]" data-testid="radio-objective-existing" />{t.pickExisting}</label>
          <label className="flex items-center gap-1.5"><input type="radio" checked={mode === "new"} onChange={() => setMode("new")} className="accent-[#0f5c4d]" data-testid="radio-objective-new" />{t.newObj}</label>
        </div>
        {mode === "existing" ? (
          <select aria-label={t.pickExisting} className={field} value={objId} onChange={(e) => setObjId(e.target.value)} disabled={objs.isLoading} data-testid="select-gap-objective">
            <option value="">{objs.isLoading ? t.busy : "—"}</option>
            {(objs.data?.objectives ?? []).map((o) => <option key={o.id} value={String(o.id)}>{o.title}</option>)}
          </select>
        ) : <input dir="auto" aria-label={t.newTitle} placeholder={t.newTitle} className={field} value={title} onChange={(e) => setTitle(e.target.value)} data-testid="input-gap-objective-title" />}
        {objs.error ? <p className="text-xs text-[#8a3a1c]">{em(objs.error)}</p> : null}
      </fieldset>
      <label className="block text-xs font-semibold text-[#5e6f69]">{t.evidence}
        <textarea dir="auto" rows={3} className={field} value={evidence} onChange={(e) => setEvidence(e.target.value)} data-testid="input-gap-evidence" /></label>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={confirmInq} onChange={(e) => setConfirmInq(e.target.checked)} className="mt-1 accent-[#0f5c4d]" data-testid="checkbox-gap-inquiry" />{t.confirmInquiry}</label>
      <fieldset className="flex flex-wrap gap-3 text-sm"><legend className="mb-1 text-xs font-semibold text-[#5e6f69]">{t.state}</legend>
        {(["suggested", "confirmed"] as const).map((s) => <label key={s} className="flex items-center gap-1.5"><input type="radio" checked={state === s} onChange={() => setState(s)} className="accent-[#0f5c4d]" data-testid={`radio-gap-${s}`} />{t.st[s]}</label>)}
      </fieldset>
      {save.error ? <p role="alert" className="text-xs text-[#8a3a1c]" data-testid="text-gap-save-error">{em(save.error)}</p> : null}
      {save.isSuccess && <p role="status" className="text-xs text-[#0f5c4d]" data-testid="text-gap-saved">{t.saved}</p>}
      <button className={primary} disabled={!canSave} onClick={() => save.mutate()} data-testid="button-save-gap">{save.isPending ? t.busy : t.save}</button>
    </section>
  );
}
