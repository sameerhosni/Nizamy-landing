import {useState} from "react";
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import {supportApi,type InboxItem,type Relevance} from "@/lib/supportApi";

const labels = {
  en: {
    title:"Chat relevance review", note:"AI suggestions never hide chats automatically. Excluding a chat only hides it from teaching; source messages and approved answers stay unchanged.",
    state:{pending:"Needs relevance review",related:"Confirmed product inquiry",excluded:"Excluded from teaching"},
    scope:{related:"Product-related",greeting:"Greeting only",unrelated:"Unrelated",uncertain:"Uncertain — manual review needed"},
    high:"High confidence (AI estimate)",low:"Low confidence — review carefully", assess:"Suggest classification", busy:"Working…",
    reason:"Reason (optional when confirming a product inquiry; required to exclude)",keep:"Confirm product inquiry — enable answer editing",exclude:"Exclude from teaching",restore:"Restore for review",
    history:"Review history",empty:"No staff decisions yet.",suggestion:"AI suggestion",retry:"Refresh",
  },
  ar: {
    title:"مراجعة صلة المحادثة", note:"اقتراحات الذكاء الاصطناعي لا تخفي المحادثات تلقائيًا. الاستبعاد يخفي المحادثة من التعليم فقط؛ تبقى الرسائل الأصلية والإجابات المعتمدة دون تغيير.",
    state:{pending:"تحتاج مراجعة الصلة",related:"استفسار منتج مؤكد",excluded:"مستبعدة من التعليم"},
    scope:{related:"متعلقة بالمنتج",greeting:"تحية فقط",unrelated:"غير متعلقة",uncertain:"غير مؤكد — تحتاج مراجعة يدوية"},
    high:"ثقة عالية (تقدير آلي)",low:"ثقة منخفضة — راجع بعناية",assess:"اقتراح تصنيف",busy:"جارٍ التنفيذ…",
    reason:"سبب القرار (اختياري لتأكيد استفسار المنتج، مطلوب للاستبعاد)",keep:"تأكيد استفسار عن المنتج — تفعيل تحرير الإجابة",exclude:"استبعاد من التعليم",restore:"استعادة للمراجعة",
    history:"سجل المراجعة",empty:"لا توجد قرارات للفريق بعد.",suggestion:"اقتراح آلي",retry:"تحديث",
  },
};
export function ChatRelevanceReview({item,lang,onAuth,onKeep}:{item:InboxItem;lang:string;onAuth:(error:unknown)=>void;onKeep?:()=>void}) {
  const t=labels[lang==="ar"?"ar":"en"];
  const qc=useQueryClient();
  const [reason,setReason]=useState("");
  const history=useQuery({queryKey:["support","relevance-history",item.id],queryFn:()=>supportApi.relevanceHistory(item.id),staleTime:0,refetchInterval:30000});
  const refresh=async()=>{await Promise.all([
    qc.invalidateQueries({queryKey:["support","inbox"]}),
    qc.invalidateQueries({queryKey:["support","relevance-history",item.id]}),
  ]);};
  const onError=(error:unknown)=>{onAuth(error);void refresh();};
  const assess=useMutation({mutationFn:()=>supportApi.assessChat(item),onSuccess:refresh,onError});
  const review=useMutation({mutationFn:(decision:Relevance)=>supportApi.reviewChat(item,decision,reason.trim() || (decision==="related" ? "Staff confirmed this conversation is a Nizamy product inquiry." : "")),onSuccess:async(_,decision)=>{setReason("");await refresh();if(decision==="related")onKeep?.();},onError});
  const pending=assess.isPending||review.isPending;
  const error=assess.error||review.error;
  const button="rounded-lg border border-[#d9d2c3] px-3 py-2 text-sm font-semibold disabled:opacity-40";
  return <section className="mt-4 space-y-3 rounded-xl border border-[#d9d2c3] bg-[#f4efe4] p-4" data-testid="relevance-review">
    <h3 className="font-bold">{t.title}</h3>
    <p className="text-xs">{t.note}</p>
    <p className="text-sm font-semibold" data-testid="relevance-state">{t.state[item.relevance]}</p>
    {item.scopeAssessment && <div className="rounded-lg bg-[#fffdf8] p-3 text-sm" data-testid="scope-suggestion">
      <strong>{t.suggestion}: {t.scope[item.scopeAssessment.scope]}</strong>
      <p>{item.scopeAssessment.confidence==="high"?t.high:t.low}</p>
      <p dir="auto" className="mt-1">{item.scopeAssessment.reason}</p>
    </div>}
    <button className={button} disabled={pending} onClick={()=>assess.mutate()} data-testid="button-assess-chat">{pending?t.busy:t.assess}</button>
    <label className="block text-xs">{t.reason}
      <textarea className="mt-1 w-full rounded-lg border p-2 text-sm" dir="auto" value={reason} maxLength={1000} onChange={e=>setReason(e.target.value)} data-testid="relevance-reason" />
    </label>
    <div className="flex flex-wrap gap-2">
      <button className={button} disabled={pending} onClick={()=>review.mutate("related")} data-testid="button-keep-chat">{t.keep}</button>
      {item.relevance!=="excluded" ? <button className={button} disabled={pending||!reason.trim()} onClick={()=>review.mutate("excluded")} data-testid="button-exclude-chat">{t.exclude}</button> :
        <button className={button} disabled={pending||!reason.trim()} onClick={()=>review.mutate("pending")} data-testid="button-restore-chat">{t.restore}</button>}
    </div>
    {error ? <p role="alert" className="text-sm text-[#8a3a1c]">{error instanceof Error?error.message:String(error)}</p> : null}
    <details><summary className="cursor-pointer text-sm">{t.history}</summary>
      {history.isLoading?<p>{t.busy}</p>:history.error?<button onClick={()=>history.refetch()}>{t.retry}</button>:
        history.data?.history.length?history.data.history.map((h,i)=><div key={i} className="mt-2 border-t pt-2 text-xs">
          <strong>{t.state[h.decision]}</strong> · {new Date(h.reviewedAt).toLocaleString(lang)}
          <p dir="auto">{h.reason}</p>
        </div>):<p className="mt-2 text-xs">{t.empty}</p>}
    </details>
  </section>;
}