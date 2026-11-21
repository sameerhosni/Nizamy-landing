import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./_group.css";

type Message = { text: string; role: "user" | "assistant" };
type IconName = "chat" | "minus" | "send" | "clock" | "file" | "pay" | "gift" | "info";
const paths: Record<IconName, string> = {
  chat: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z",
  minus: "M5 12h14",
  send: "m12 19 0-14m-6 6 6-6 6 6",
  clock: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  file: "M8 3h8l4 4v14H4V3h4m7 0v5h5M8 12h8m-8 4h5",
  pay: "M3 5h18v14H3V5Zm0 4h18M7 15h3m5 0h2",
  gift: "M3 8h18v4H3V8Zm2 4v9h14v-9M12 8v13m0-13C3 9 5 0 9 4l3 4Zm0 0c9 1 7-8 3-4l-3 4Z",
  info: "M12 11v5m0-9h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};
function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
const topics: { label: string; icon: IconName; reply: string }[] = [
  { label: "الحضور بالجوال", icon: "clock", reply: "يتيح نظامي تسجيل الحضور والانصراف من الجوال. هل تبي تعرف أكثر عن تجربة الموظف، أو متابعة الحضور كمسؤول؟" },
  { label: "طلبات الموظفين", icon: "file", reply: "نظامي يساعدك تتابع طلبات الموظفين من مكان واحد، بدل تشتتها بين الرسائل. هل سؤالك عن تقديم الطلب أو متابعته؟" },
  { label: "تقارير الرواتب", icon: "pay", reply: "تقدر تستفيد من تقارير الرواتب لترتيب مراجعتك الشهرية. قل لنا وش تحتاج تعرف عن التقارير، ونوضح لك الفكرة في هذا التصوّر." },
  { label: "المكافآت والنقاط", icon: "gift", reply: "المكافآت جزء من تجربة نظامي لتقدير الموظفين. الباقة المجانية تتضمن ٥٬٠٠٠ نقطة ترحيبية. هذا مثال توضيحي، ولا يضيف نقاطًا فعلية." },
];

export function CompactChat() {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);
  useEffect(() => {
    if (shouldFocus.current) {
      if (open) inputRef.current?.focus();
      else launcherRef.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    if (messages.length && transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [messages]);
  function toggle(next: boolean) {
    shouldFocus.current = true;
    setOpen(next);
  }
  function ask(text: string, reply?: string) {
    const content = text.trim();
    if (!content) return;
    const match = topics.find(topic => content.includes(topic.label) ||
      (topic.icon === "clock" && /حضور|دوام/.test(content)) ||
      (topic.icon === "file" && /طلب|إجاز/.test(content)) ||
      (topic.icon === "pay" && /راتب|رواتب/.test(content)) ||
      (topic.icon === "gift" && /نقاط|مكاف/.test(content)));
    const answer = reply ?? match?.reply ?? (/سعر|اشتراك|باقة/.test(content)
      ? "باقة Starter بسعر ٣ ر.س لكل مستخدم شهريًا عند الدفع السنوي. هذه إجابة تجريبية، ولا يتم الاشتراك من هنا."
      : "وصل سؤالك في هذا التصوّر فقط. الردود هنا أمثلة جاهزة وليست من فريق الدعم. جرّب موضوعًا مثل الحضور أو الرواتب لتشوف شكل الإجابة.");
    setMessages(old => [...old, { role: "user", text: content }, { role: "assistant", text: answer }]);
    setDraft("");
    inputRef.current?.focus();
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); ask(draft); }
  return (
    <main className="nc-stage" dir="rtl" lang="ar">
      <div className="nc-caption">
        <div className="nc-eyebrow">نظامي / محادثة مختصرة</div>
        <h1>مساعدة على قدّ سؤالك.</h1>
        <p>بداية سريعة، بدون ما تغطي على شغلك.</p>
      </div>
      {open ? (
        <section className="nc-window" aria-label="تصوّر محادثة نظامي" onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); toggle(false); } }}>
          <header className="nc-header">
            <div className="nc-mark" aria-hidden="true">ن</div>
            <div className="nc-header-copy"><h2>حياك في نظامي</h2><p>نرتّب لك الفكرة، خطوة بخطوة</p></div>
            <button className="nc-icon-button" type="button" aria-label="تصغير المحادثة" title="تصغير المحادثة (Escape)" onClick={() => toggle(false)}><Icon name="minus" size={21} /></button>
          </header>
          <div className="nc-demo"><Icon name="info" size={12} /><span>تصوّر تفاعلي — ليس محادثة مباشرة</span></div>
          <div className="nc-conversation" ref={transcriptRef}>
            <div className="nc-today">بداية المحادثة</div>
            <h3 className="nc-welcome-title">وش نقدر نسهّل عليك؟</h3>
            <p className="nc-welcome-text">من أول حضور إلى آخر تقرير راتب.<br />اختر موضوعًا، أو اكتب سؤالك تحت.</p>
            <p className="nc-quick-label">نبدأ من هنا</p>
            <div className="nc-topics">{topics.map(topic => <button className="nc-topic" key={topic.label} type="button" onClick={() => ask(topic.label, topic.reply)}><Icon name={topic.icon} /><span>{topic.label}</span></button>)}</div>
            <div role="log" aria-live="polite" aria-relevant="additions" aria-label="رسائل تجريبية">
              {messages.map((message, index) => <div key={index} className={`nc-bubble ${message.role === "user" ? "is-user" : ""}`}><span className="nc-reply-label">{message.role === "user" ? "أنت" : "نظامي · رد تجريبي"}</span>{message.text}</div>)}
            </div>
          </div>
          <div className="nc-composer-area">
            <form className="nc-composer" onSubmit={submit}>
              <input ref={inputRef} value={draft} onChange={event => setDraft(event.target.value)} aria-label="اكتب سؤالك التجريبي" placeholder="اكتب سؤالك هنا…" maxLength={500} />
              <button className="nc-send" type="submit" aria-label="إرسال السؤال التجريبي" disabled={!draft.trim()}><Icon name="send" size={19} /></button>
            </form>
            <div className="nc-footer"><span>ردود تجريبية فقط · بدون إرسال أي بيانات</span><button className="nc-reset" type="button" onClick={() => { setMessages([]); setDraft(""); inputRef.current?.focus(); }}>بدء من جديد</button></div>
          </div>
        </section>
      ) : (
        <div className="nc-minimized">
          <button ref={launcherRef} className="nc-launcher" type="button" aria-label="فتح محادثة نظامي التجريبية" aria-expanded={false} onClick={() => toggle(true)}><Icon name="chat" size={23} /><span>عندك سؤال؟</span></button>
          <p>تصوّر تفاعلي — ليس محادثة مباشرة</p>
        </div>
      )}
      {open && <div className="nc-bottom-note"><Icon name="minus" size={13} /><span>صغّرها وكمّل شغلك. محادثتك تبقى هنا.</span></div>}
    </main>
  );
}
