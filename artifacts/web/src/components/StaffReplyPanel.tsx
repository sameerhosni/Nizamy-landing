import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Bot, CheckCircle2, Clock3, Mail, MailX, RotateCcw, Send, UserRound, Users } from "lucide-react";
import {
  supportApi, SupportApiError, type EmailDeliveryStatus, type StaffReply, type ThreadMessage, type InboxItem, type Ticket,
} from "@/lib/supportApi";

type Props =
  | { mode: "chat"; inboxId: InboxItem["id"]; lang: string; onAuth: (e: unknown) => void }
  | { mode: "ticket"; ticketId: Ticket["id"]; lang: string; onAuth: (e: unknown) => void };

const L = {
  en: {
    heading: "Reply to customer", sub: "Written by staff, saved into the customer's conversation. This does not teach the AI.",
    thread: "Conversation", history: "Replies sent on this ticket", noReplies: "No staff replies yet.",
    customer: "Customer", ai: "AI assistant", team: "Nizamy team",
    placeholder: "Write your reply to the customer...", send: "Send reply", sending: "Sending",
    emailToo: (e: string) => `Also email this reply to ${e}`,
    noAddressChat: "No notification email on this chat. The customer did not leave one, so the reply will only appear in their chat window when they return in the same browser.",
    noAddressTicket: "This ticket has no usable email address. The reply will be saved but cannot be emailed.",
    linkedChat: "This ticket is linked to a website chat, so the reply also appears in that chat.",
    chars: (n: number) => `${n} / 4000`,
    retry: "Retry email", loadFail: "Could not load the conversation.", tryAgain: "Try again",
    savedNotice: "Reply saved to the conversation.", replayed: "This reply was already saved; no duplicate was created.",
    sendFail: "The reply could not be confirmed. Press Send again — it will not be duplicated.",
    status: {
      not_requested: "Chat only", no_address: "Chat only — no email address", pending: "Email queued", sending: "Email sending",
      sent: "Emailed", failed: "Saved in chat — email failed", unconfirmed: "Email outcome unconfirmed",
    } as Record<EmailDeliveryStatus, string>,
    by: "by", empty: "No messages in this conversation yet.",
  },
  ar: {
    heading: "الرد على العميل", sub: "يكتبه فريق العمل ويُحفظ في محادثة العميل نفسها. هذا لا يعلّم المساعد.",
    thread: "المحادثة", history: "الردود المرسلة على هذه التذكرة", noReplies: "لا توجد ردود من الفريق بعد.",
    customer: "العميل", ai: "المساعد الذكي", team: "فريق نظامي",
    placeholder: "اكتب ردك على العميل...", send: "إرسال الرد", sending: "جارٍ الإرسال",
    emailToo: (e: string) => `أرسل هذا الرد أيضًا إلى ${e}`,
    noAddressChat: "لا يوجد بريد للتنبيهات في هذه المحادثة. لم يترك العميل بريدًا، لذا سيظهر الرد فقط في نافذة المحادثة عند عودته من نفس المتصفح.",
    noAddressTicket: "لا يوجد بريد صالح لهذه التذكرة. سيُحفظ الرد لكن لا يمكن إرساله بالبريد.",
    linkedChat: "هذه التذكرة مرتبطة بمحادثة على الموقع، لذا سيظهر الرد في تلك المحادثة أيضًا.",
    chars: (n: number) => `${n} / 4000`,
    retry: "إعادة إرسال البريد", loadFail: "تعذر تحميل المحادثة.", tryAgain: "إعادة المحاولة",
    savedNotice: "تم حفظ الرد في المحادثة.", replayed: "هذا الرد محفوظ مسبقًا؛ لم يُنشأ رد مكرر.",
    sendFail: "تعذر تأكيد الرد. اضغط إرسال مجددًا — لن يتكرر.",
    status: {
      not_requested: "في المحادثة فقط", no_address: "في المحادثة فقط — لا يوجد بريد", pending: "البريد في الانتظار", sending: "جارٍ إرسال البريد",
      sent: "أُرسل بالبريد", failed: "حُفظ في المحادثة — فشل البريد", unconfirmed: "نتيجة البريد غير مؤكدة",
    } as Record<EmailDeliveryStatus, string>,
    by: "بواسطة", empty: "لا توجد رسائل في هذه المحادثة بعد.",
  },
};

const fmt = (d: string, lang: string) => {
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleString(lang === "ar" ? "ar-SA" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
};
const newKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16)));

function DeliveryChip({ reply, t }: { reply: StaffReply; t: typeof L.en }) {
  const s = reply.emailStatus;
  const tone =
    s === "sent" ? "bg-[#cfe6dc] text-[#0b4a3e]" :
    s === "failed" || s === "unconfirmed" ? "bg-[#fbeee7] text-[#8a3a1c]" :
    s === "pending" || s === "sending" ? "bg-[#f3e3b5] text-[#7a5a06]" : "bg-[#ebe4d6] text-[#5e6f69]";
  const Icon = s === "sent" ? CheckCircle2 : s === "failed" || s === "unconfirmed" ? AlertCircle : s === "pending" || s === "sending" ? Clock3 : s === "no_address" ? MailX : Users;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`} data-testid={`status-reply-email-${reply.id}`}>
      <Icon className="h-3 w-3" />{t.status[s]}
      {reply.recipientEmail && s !== "not_requested" && <span dir="ltr" className="font-normal opacity-80">· {reply.recipientEmail}</span>}
    </span>
  );
}

function Bubble({ m, t, lang, onRetry, retrying }: { m: { role: ThreadMessage["role"]; content: string; createdAt: string; reply: StaffReply | null }; t: typeof L.en; lang: string; onRetry: (r: StaffReply) => void; retrying: boolean }) {
  if (m.role === "staff") {
    return (
      <div className="flex justify-end" data-testid="bubble-staff">
        <div className="max-w-[88%] rounded-2xl rounded-ee-sm border border-[#0b4a3e] bg-[#0f5c4d] px-4 py-3 text-[#f7f3ea] shadow-[0_8px_24px_-16px_rgba(15,92,77,0.9)]">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#f2c14e]">
            <Users className="h-3.5 w-3.5" />{t.team}
            <span className="font-normal text-[#cfe6dc]">{fmt(m.createdAt, lang)}</span>
          </div>
          <p dir="auto" className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
          {m.reply && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-[#fffdf8] px-2 py-1.5">
              <DeliveryChip reply={m.reply} t={t} />
              {m.reply.canRetryEmail && (
                <button onClick={() => onRetry(m.reply!)} disabled={retrying} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0f5c4d] underline disabled:opacity-40" data-testid={`button-retry-email-${m.reply.id}`}>
                  <RotateCcw className="h-3 w-3" />{t.retry}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  const ai = m.role === "assistant";
  return (
    <div className="flex justify-start">
      <div className={`max-w-[88%] rounded-2xl rounded-ss-sm px-4 py-3 ${ai ? "border border-dashed border-[#cfc6b3] bg-[#f4efe4]" : "border border-[#e2dbcc] bg-[#fffdf8]"}`}>
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#7d8a85]">
          {ai ? <Bot className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5 text-[#16302b]" />}
          <span className={ai ? "" : "text-[#16302b]"}>{ai ? t.ai : t.customer}</span>
          <span className="font-normal">{fmt(m.createdAt, lang)}</span>
        </div>
        <p dir="auto" className={`whitespace-pre-wrap text-sm leading-relaxed ${ai ? "text-[#5e6f69]" : "text-[#16302b]"}`}>{m.content.replace("[[OFFER_TICKET]]", "").trimEnd()}</p>
      </div>
    </div>
  );
}

export function StaffReplyPanel(props: Props) {
  const { lang, onAuth } = props;
  const t = lang === "ar" ? L.ar : L.en;
  const qc = useQueryClient();
  const queryKey = props.mode === "chat" ? ["support", "thread", String(props.inboxId)] : ["support", "ticket-replies", String(props.ticketId)];
  const chatQ = useQuery({
    queryKey: ["support", "thread", props.mode === "chat" ? String(props.inboxId) : "inactive"], enabled: props.mode === "chat", retry: false, refetchInterval: 10000,
    queryFn: () => supportApi.chatThread((props as { inboxId: InboxItem["id"] }).inboxId),
  });
  const ticketQ = useQuery({
    queryKey: ["support", "ticket-replies", props.mode === "ticket" ? String(props.ticketId) : "inactive"], enabled: props.mode === "ticket", retry: false, refetchInterval: 15000,
    queryFn: () => supportApi.ticketReplies((props as { ticketId: Ticket["id"] }).ticketId),
  });
  const q = props.mode === "chat" ? chatQ : ticketQ;
  useEffect(() => { if (q.error instanceof SupportApiError && (q.error.status === 401 || q.error.status === 403)) onAuth(q.error); }, [q.error, onAuth]);

  const recipient = props.mode === "chat" ? chatQ.data?.notifyEmail ?? null : ticketQ.data?.recipientEmail ?? null;
  const [body, setBody] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const keyRef = useRef<string>(newKey());
  useEffect(() => { setSendEmail(false); }, [recipient]);

  const send = useMutation({
    mutationFn: () => {
      const input = { body: body.trim(), sendEmail: sendEmail && !!recipient, idempotencyKey: keyRef.current };
      return props.mode === "chat" ? supportApi.replyToChat(props.inboxId, input) : supportApi.replyToTicket(props.ticketId, input);
    },
    onSuccess: (r) => {
      keyRef.current = newKey();
      setBody(""); setSendEmail(false);
      setNotice(r.replayed ? t.replayed : t.savedNotice);
      qc.invalidateQueries({ queryKey });
      qc.invalidateQueries({ queryKey: ["support", "inbox"] });
    },
    onError: onAuth,
  });
  const retry = useMutation({
    mutationFn: (r: StaffReply) => supportApi.retryReplyEmail(r.id),
    onSettled: () => qc.invalidateQueries({ queryKey }), onError: onAuth,
  });

  const items = useMemo(() => {
    if (props.mode === "chat") return chatQ.data?.messages ?? [];
    return (ticketQ.data?.replies ?? []).map((r) => ({ role: "staff" as const, content: r.body, createdAt: r.createdAt, reply: r }));
  }, [props.mode, chatQ.data, ticketQ.data]);

  const scroller = useRef<HTMLDivElement>(null);
  const count = items.length;
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [count]);

  const len = body.trim().length;
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-[#16302b]/15 bg-[#fffdf8]" data-testid={`panel-staff-reply-${props.mode}`}>
      <header className="flex items-start gap-3 border-b border-[#e2dbcc] bg-[#16302b] px-4 py-3 text-[#f7f3ea]">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2c14e] text-[#16302b]"><Send className="h-4 w-4 rtl:-scale-x-100" /></div>
        <div>
          <h3 className="text-sm font-bold">{t.heading}</h3>
          <p className="text-xs text-[#cfe6dc]">{t.sub}</p>
        </div>
      </header>

      <div className="px-4 pt-3 text-[11px] font-bold uppercase tracking-wider text-[#7d8a85]">{props.mode === "chat" ? t.thread : t.history}</div>
      <div ref={scroller} className="max-h-[46vh] space-y-2.5 overflow-y-auto px-4 py-3 [overflow-wrap:anywhere]" data-testid="list-reply-thread">
        {q.isLoading ? (
          <div className="space-y-2" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className={`h-14 animate-pulse rounded-2xl bg-[#ebe4d6] ${i % 2 ? "ms-auto w-2/3" : "w-3/4"}`} />)}</div>
        ) : q.error ? (
          <div className="rounded-xl border border-[#e3b9a6] bg-[#fbeee7] p-3 text-sm text-[#8a3a1c]">
            <div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{q.error instanceof Error ? q.error.message : t.loadFail}</div>
            <button onClick={() => q.refetch()} className="mt-2 font-semibold underline">{t.tryAgain}</button>
          </div>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-xs text-[#7d8a85]">{props.mode === "chat" ? t.empty : t.noReplies}</p>
        ) : items.map((m, i) => <Bubble key={i} m={m} t={t} lang={lang} onRetry={(r) => retry.mutate(r)} retrying={retry.isPending} />)}
      </div>

      <form className="border-t border-[#e2dbcc] bg-[#f9f5ec] p-4" onSubmit={(e) => { e.preventDefault(); if (len && !send.isPending) send.mutate(); }}>
        {props.mode === "ticket" && ticketQ.data?.linkedChat && <p className="mb-2 text-xs text-[#0f5c4d]">{t.linkedChat}</p>}
        <textarea
          dir="auto" rows={4} maxLength={4000} value={body}
          onChange={(e) => { setBody(e.target.value); setNotice(null); if (!send.isPending) { keyRef.current = newKey(); send.reset(); } }}
          placeholder={t.placeholder}
          className="w-full resize-y rounded-xl border border-[#d9d2c3] bg-[#fffdf8] px-3.5 py-2.5 text-sm text-[#16302b] outline-none focus:border-[#0f5c4d] focus:ring-2 focus:ring-[#0f5c4d]/15"
          data-testid="input-staff-reply"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {q.isLoading ? null : recipient ? (
            <label className="flex items-center gap-2 text-sm text-[#16302b]">
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="accent-[#0f5c4d]" data-testid="checkbox-send-email" />
              <Mail className="h-4 w-4 text-[#0f5c4d]" /><span>{t.emailToo("")}<span dir="ltr" className="font-mono text-xs">{recipient}</span></span>
            </label>
          ) : (
            <p className="flex items-start gap-2 rounded-lg bg-[#ebe4d6] px-3 py-2 text-xs text-[#5e6f69]" data-testid="text-no-address">
              <MailX className="mt-0.5 h-3.5 w-3.5 shrink-0" />{props.mode === "chat" ? t.noAddressChat : t.noAddressTicket}
            </p>
          )}
          <span className="ms-auto font-mono text-[11px] text-[#7d8a85]">{t.chars(len)}</span>
          <button type="submit" disabled={!len || send.isPending || !!q.error} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f5c4d] px-4 py-2.5 text-sm font-semibold text-[#f7f3ea] transition-colors hover:bg-[#0b4a3e] disabled:opacity-40" data-testid="button-send-staff-reply">
            <Send className="h-4 w-4 rtl:-scale-x-100" />{send.isPending ? t.sending : t.send}
          </button>
        </div>
        {notice && <p role="status" className="mt-2 text-xs text-[#0f5c4d]" data-testid="text-reply-saved">{notice}</p>}
        {send.error ? <p role="alert" className="mt-2 text-xs text-[#8a3a1c]" data-testid="text-reply-error">{send.error instanceof SupportApiError && send.error.status !== 0 && send.error.status < 500 ? send.error.message : t.sendFail}</p> : null}
        {retry.error ? <p role="alert" className="mt-2 text-xs text-[#8a3a1c]">{retry.error instanceof Error ? retry.error.message : t.sendFail}</p> : null}
      </form>
    </section>
  );
}
