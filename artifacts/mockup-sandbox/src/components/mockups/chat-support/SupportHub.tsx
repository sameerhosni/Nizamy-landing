import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarCheck, ChevronLeft, Gift, Home, MessageCircle, Minus, Search, Send, Wallet } from "lucide-react";
import "./_group.css";

const topics = [
  { id: "attendance", title: "الحضور من الجوال", subtitle: "من أول تسجيل إلى التقرير", icon: CalendarCheck, heading: "كيف أبدأ بالحضور من الجوال؟", intro: "رتّب إعدادات الحضور أولًا، ثم جرّب رحلة الموظف.", steps: ["راجع مواقع العمل وأوقات الدوام في حساب المنشأة.", "تأكد من إضافة الموظف وإتاحة تسجيل الدخول له.", "اطلب من الموظف فتح الحضور من جواله، وتفعيل إذن الموقع عند الحاجة.", "راجع سجل الحضور للتأكد من ظهور العملية."], note: "قد تختلف خيارات الحضور بحسب إعدادات منشأتك والصلاحيات المتاحة." },
  { id: "requests", title: "طلبات الموظفين", subtitle: "إجازات وموافقات أوضح", icon: BookOpen, heading: "كيف أتابع طلبات الموظفين؟", intro: "خلّ الطلب واضحًا من بدايته حتى قرار الموافقة.", steps: ["افتح قسم طلبات الموظفين في حسابك.", "اختر الطلب وراجع نوعه وتواريخه والملاحظات المرفقة.", "راجع الصلاحيات ومسار الموافقة المعتمد في المنشأة.", "اتخذ الإجراء المناسب وتأكد من تحديث حالة الطلب."], note: "راجع سياسة منشأتك قبل الموافقة على الإجازات أو رفضها." },
  { id: "payroll", title: "تقارير الرواتب", subtitle: "راجع بيانات الشهر بثقة", icon: Wallet, heading: "كيف أجهّز تقرير الرواتب؟", intro: "مراجعة بسيطة للبيانات قبل إعداد التقرير تساعدك على تجنّب الفروقات.", steps: ["راجع بيانات الموظفين والرواتب المسجلة.", "تأكد من اكتمال الحضور والإجازات للشهر المطلوب.", "راجع الاستحقاقات والاستقطاعات قبل اعتمادها.", "افتح تقارير الرواتب وحدد الفترة المطلوبة، ثم راجع التقرير."], note: "التقرير أداة للمراجعة، وليس تأكيدًا على تنفيذ تحويل الرواتب." },
  { id: "rewards", title: "النقاط والمكافآت", subtitle: "تعرّف على طريقة الاستفادة", icon: Gift, heading: "ما هي نقاط الترحيب؟", intro: "تتضمن الباقة المجانية 5000 نقطة ترحيبية.", steps: ["افتح قسم المكافآت في حسابك للاطلاع على الرصيد.", "راجع الخيارات المتاحة وتفاصيل كل مكافأة.", "تأكد من الشروط والمتطلبات قبل استخدام النقاط."], note: "خيارات المكافآت تخضع للشروط والتوفر. النقاط ليست وعدًا باسترداد نقدي." },
];
type Message = { text: string; user: boolean };

export function SupportHub() {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<"home" | "messages">("home");
  const [article, setArticle] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ text: "أهلًا بك في نظامي. أنا المساعد التجريبي، أقدر أوضح لك خطوات الحضور والطلبات وتقارير الرواتب والمكافآت. وش تحب تعرف؟", user: false }]);
  const thread = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const selected = topics.find(t => t.id === article);
  const results = topics.filter(t => `${t.title} ${t.subtitle}`.includes(search.trim()));
  useEffect(() => { if (thread.current) thread.current.scrollTop = thread.current.scrollHeight; }, [messages, tab]);
  function send(text: string) {
    if (!text.trim()) return;
    const topic = topics.find(t => text.includes(t.title) || (t.id === "attendance" && text.includes("حضور")) || (t.id === "payroll" && text.includes("رواتب")));
    const answer = topic ? `${topic.intro}\n${topic.steps.slice(0, 2).join(" ")} للمزيد، افتح «${topic.title}» من الرئيسية.` : text.includes("سعر") || text.includes("باقة") ? "سعر باقة Starter هو 3 ر.س لكل مستخدم شهريًا عند الاشتراك السنوي. هذا رد توضيحي في التصوّر، ولا يتم تنفيذ أي اشتراك هنا." : "هذا رد تجريبي، ولم تُرسل رسالتك لأي فريق. تقدر تستكشف خطوات الحضور والطلبات والرواتب والمكافآت من الرئيسية، أو تختار أحد المواضيع هنا.";
    setMessages(prev => [...prev, { text: text.trim(), user: true }, { text: answer, user: false }]);
    setDraft("");
    composer.current?.focus();
  }
  function conversation() { setTab("messages"); setArticle(null); }
  return <main className="nh-stage" dir="rtl">
    {!open ? <div className="nh-minimized"><button className="nh-launcher" onClick={() => setOpen(true)} aria-label="إعادة فتح مركز مساعدة نظامي"><MessageCircle size={25}/><span><b>كيف نقدر نساعدك؟</b><small>تصوّر تفاعلي — ليس محادثة مباشرة</small></span></button></div> :
      <section className="nh-panel" aria-label="مركز مساعدة نظامي">
        <div className="nh-demo">تصوّر تفاعلي — ليس محادثة مباشرة</div>
        <header className="nh-top"><div className="nh-brand"><span className="nh-brandmark" aria-hidden="true">ن</span><div><strong>نظامي</strong><small>مركز المساعدة</small></div></div><button className="nh-icon-button" onClick={() => setOpen(false)} aria-label="تصغير مركز المساعدة"><Minus size={18}/></button></header>
        {tab === "home" ? <div className="nh-body">
          {selected ? <article className="nh-article">
            <button className="nh-back" onClick={() => setArticle(null)}><ArrowRight size={16}/>كل المواضيع</button>
            <span className="nh-topic-icon"><selected.icon size={21}/></span>
            <h1>{selected.heading}</h1><p>{selected.intro}</p>
            <ol>{selected.steps.map(step => <li key={step}>{step}</li>)}</ol>
            <div className="nh-article-note">{selected.note}<br/>إرشاد توضيحي ضمن التصوّر، وليس توثيقًا لشاشات المنتج.</div>
            <button className="nh-cta" onClick={conversation}>عندي سؤال عن هذا الموضوع<MessageCircle size={17}/></button>
          </article> : <div className="nh-home">
            <p className="nh-eyebrow">مساعدة قريبة من شغلك</p>
            <h1>حيّاك، كيف نقدر نساعدك؟</h1>
            <p className="nh-subtitle">إجابة سريعة، أو بداية محادثة.<br/>كل ما تحتاجه لإدارة فريقك، من مكان واحد.</p>
            <label className="nh-search"><Search size={18}/><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن الحضور، الرواتب، الطلبات..." aria-label="ابحث في مواضيع المساعدة"/></label>
            <div className="nh-section-label">ابدأ من هنا<span>أدلة سريعة</span></div>
            <div className="nh-topics">{results.map(topic => <button className="nh-topic" key={topic.id} onClick={() => setArticle(topic.id)}><span className="nh-topic-icon"><topic.icon size={18}/></span><span><b>{topic.title}</b><small>{topic.subtitle}</small></span></button>)}</div>
            {results.length === 0 && <div className="nh-empty">ما لقينا موضوعًا بهذا الاسم.<br/><button className="nh-back" style={{ margin: "12px auto 0" }} onClick={() => setSearch("")}>عرض كل المواضيع</button></div>}
            <div className="nh-contact"><h2>ما لقيت إجابتك؟</h2><p>خلّنا نبدأ بسؤالك، ونساعدك بالخطوة الجاية.</p><button className="nh-cta" onClick={conversation}><span>ابدأ محادثة تجريبية</span><ArrowLeft size={17}/></button></div>
            <p className="nh-footnote">جرّب بحرية. لا تُرسل رسائلك لأي فريق دعم.</p>
          </div>}
        </div> : <div className="nh-chat">
          <div className="nh-chat-heading"><strong>مساحة لسؤالك</strong><small>مساعد تجريبي · ردود توضيحية جاهزة</small></div>
          <div className="nh-thread" ref={thread} role="log" aria-label="الرسائل التجريبية" aria-live="polite"><div className="nh-date">هذه تجربة محلية فقط</div>{messages.map((message, i) => <div className={`nh-message${message.user ? " user" : ""}`} key={i}>{!message.user && <small>مساعد نظامي · تجريبي</small>}{message.text}</div>)}<div className="nh-quick">{["الحضور من الجوال", "تقارير الرواتب", "سعر الباقة"].map(text => <button key={text} onClick={() => send(text)}>{text}<ChevronLeft size={12} style={{ display: "inline", verticalAlign: "middle", marginInlineStart: 4 }}/></button>)}</div></div>
          <form className="nh-composer" onSubmit={e => { e.preventDefault(); send(draft); }}><div className="nh-input-row"><textarea ref={composer} value={draft} rows={1} onChange={e => setDraft(e.target.value)} placeholder="اكتب سؤالك هنا..." aria-label="رسالتك التجريبية" onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); } }}/><button className="nh-send" type="submit" disabled={!draft.trim()} aria-label="إرسال الرسالة التجريبية"><Send size={16}/></button></div><p>لا تشارك بيانات شخصية. الرسائل لا تغادر هذا التصوّر.</p></form>
        </div>}
        <nav className="nh-nav" aria-label="أقسام المساعدة"><button aria-current={tab === "home" ? "page" : undefined} onClick={() => { setTab("home"); setArticle(null); }}><Home size={18}/>الرئيسية</button><button aria-current={tab === "messages" ? "page" : undefined} onClick={conversation}><MessageCircle size={18}/>المحادثة</button></nav>
      </section>}
  </main>;
}
