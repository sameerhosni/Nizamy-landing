import { notifySubmissionSuccess } from "@/lib/feedbackSurvey";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { BellRing, ImagePlus, MessageSquarePlus, Send, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import shahadAvatar from "@/assets/shahad-avatar.png";
import { track } from "@/lib/analytics";
import { getChatLanguage } from "@/lib/chat-language";
import { AppStoreLinks } from "@/components/ui/AppStoreLinks";

const API_BASE = `${import.meta.env.BASE_URL}api`;
const TICKET_MARKER = "[[OFFER_TICKET]]";

const SHOT_TYPES = ["image/png", "image/jpeg", "image/webp"];
const SHOT_MAX = 2 * 1024 * 1024;
type Shot = { name: string; type: string; data: string; preview: string };

function readBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

const STORE_KEY = "nizamy.chat.v1";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POLL_MS = 6000;
type Stored = { id: string; token: string };
function loadStored(): Stored | null {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_KEY) ?? "null");
    return v && typeof v.id === "string" && UUID_RE.test(v.id) && typeof v.token === "string" && /^[A-Za-z0-9_-]{43}$/.test(v.token) ? v : null;
  } catch { return null; }
}
function saveStored(v: Stored | null) {
  try { if (v) localStorage.setItem(STORE_KEY, JSON.stringify(v)); else localStorage.removeItem(STORE_KEY); } catch { /* storage unavailable */ }
}
type ServerMessage = { id: number; role: "user" | "assistant" | "staff"; content: string; createdAt: string };
function fromServer(rows: ServerMessage[]): ChatMessage[] {
  return rows.map((m) => ({
    role: m.role === "staff" ? "staff" : m.role === "assistant" ? "assistant" : "user",
    content: m.role === "assistant" ? m.content.replace(TICKET_MARKER, "").trimEnd() : m.content,
    offerTicket: m.role === "assistant" && m.content.includes(TICKET_MARKER),
  }));
}

type ChatMessage = {
  role: "user" | "assistant" | "staff";
  content: string;
  offerTicket?: boolean;
  ticketNumber?: string;
};

export function ChatWidget() {
  const { language } = useLanguage();

  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const [notifyEmail, setNotifyEmail] = useState<string | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyInput, setNotifyInput] = useState("");
  const [notifyConsent, setNotifyConsent] = useState(false);
  const [notifyBusy, setNotifyBusy] = useState(false);
  const [notifyError, setNotifyError] = useState(false);
  const [ticketNote, setTicketNote] = useState<ChatMessage | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatLanguage = getChatLanguage(chatMessages, language);
  const isRtl = chatLanguage === "ar";
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ticketFormOpen, setTicketFormOpen] = useState(false);
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketPhone, setTicketPhone] = useState("");
  const [ticketConsent, setTicketConsent] = useState(false);
  const autoOpenedTicketRef = useRef(-1);
  const [ticketBusy, setTicketBusy] = useState(false);
  const [ticketError, setTicketError] = useState(false);
  const [shots, setShots] = useState<Shot[]>([]);
  const [shotError, setShotError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = {
    en: {
      title: "Shahad",
      subtitle: "Ask anything about Nizamy HR",
      placeholder: "Type your question...",
      greeting:
        "Hi! I'm Shahad, the Nizamy assistant. Ask me anything about the HR system, pricing, or the return model.",
      error: "Something went wrong. Please try again.",
      open: "Ask Shahad",
      createTicket: "Create a support ticket",
      ticketFormTitle: "Leave an email or WhatsApp number so our team can follow up on this request.",
      nameLabel: "Name (optional)",
      emailLabel: "Email (optional)",
      phoneLabel: "WhatsApp number (optional)",
      phonePlaceholder: "+9665XXXXXXXX",
      contactNeed: "Enter a valid email or WhatsApp number.",
      emailInvalid: "This email doesn't look valid.",
      phoneInvalid: "Use international format: + then 8 to 15 digits.",
      ticketConsentLabel: "I agree that Nizamy may contact me using the details above to follow up on this request only (not for marketing).",
      namePlaceholder: "Your name (optional)",
      emailPlaceholder: "Your email",
      submitTicket: "Submit ticket",
      cancel: "Cancel",
      ticketCreated: (num: string) =>
        `Your request has been saved. Reference number: ${num}. Download the Nizamy app now, sign in, and find your points inside the app.`,
      ticketFailed: "Couldn't create the ticket. Please try again.",
      addShots: "Attach screenshots (up to 3)",
      shotWarn: "Hide passwords, salaries, ID numbers and other sensitive details before attaching.",
      shotType: "Only PNG, JPEG or WebP images are allowed.",
      shotSize: "Each image must be 2MB or smaller.",
      shotMax: "You can attach up to three screenshots.",
      removeShot: "Remove screenshot",
      team: "Nizamy team",
      newChat: "New chat",
      notifyCta: "Email me when the team replies",
      notifyTitle: "Optional: the Nizamy team can reply here in this chat. Leave an email if you also want their replies sent to your inbox.",
      notifyConsent: "Send team replies about this chat to this email.",
      notifySave: "Save email",
      notifyOn: (e: string) => `Team replies will also be emailed to ${e}`,
      notifyRemove: "Remove",
      notifyFailed: "Couldn't save the email. Check it and try again.",
    },
    ar: {
      title: "شهد",
      subtitle: "اسأل أي شيء عن نظامي اتش آر",
      placeholder: "اكتب سؤالك...",
      greeting:
        "أهلًا! أنا شهد، مساعدة نظامي. اسألني عن النظام، الأسعار، أو نموذج العائد.",
      error: "حدث خطأ، حاول مرة أخرى.",
      open: "اسأل شهد",
      createTicket: "إنشاء تذكرة دعم",
      ticketFormTitle: "اترك بريدك الإلكتروني أو رقم واتساب ليتابع فريقنا طلبك.",
      nameLabel: "الاسم (اختياري)",
      emailLabel: "البريد الإلكتروني (اختياري)",
      phoneLabel: "رقم واتساب (اختياري)",
      phonePlaceholder: "+9665XXXXXXXX",
      contactNeed: "أدخل بريدًا إلكترونيًا صحيحًا أو رقم واتساب صحيحًا.",
      emailInvalid: "يبدو أن البريد الإلكتروني غير صحيح.",
      phoneInvalid: "استخدم الصيغة الدولية: + ثم من 8 إلى 15 رقمًا.",
      ticketConsentLabel: "أوافق على أن يتواصل معي نظامي عبر البيانات أعلاه لمتابعة هذا الطلب فقط (وليس لأغراض تسويقية).",
      namePlaceholder: "اسمك (اختياري)",
      emailPlaceholder: "بريدك الإلكتروني",
      submitTicket: "إرسال التذكرة",
      cancel: "إلغاء",
      ticketCreated: (num: string) =>
        `تم حفظ طلبك. الرقم المرجعي: ${num}. حمّل تطبيق نظامي الآن، وسجّل دخولك، واكتشف نقاطك داخل التطبيق.`,
      ticketFailed: "تعذّر إنشاء التذكرة، حاول مرة أخرى.",
      addShots: "إرفاق لقطات شاشة (حتى 3)",
      shotWarn: "أخفِ كلمات المرور والرواتب وأرقام الهوية وأي بيانات حساسة قبل الإرفاق.",
      shotType: "يُسمح فقط بصور PNG أو JPEG أو WebP.",
      shotSize: "يجب ألا يتجاوز حجم كل صورة 2 ميجابايت.",
      shotMax: "يمكنك إرفاق ثلاث لقطات كحد أقصى.",
      removeShot: "إزالة اللقطة",
      team: "فريق نظامي",
      newChat: "محادثة جديدة",
      notifyCta: "راسلني عند رد الفريق",
      notifyTitle: "اختياري: يمكن لفريق نظامي الرد هنا في هذه المحادثة. اترك بريدك إن أردت أن تصلك ردودهم على بريدك أيضًا.",
      notifyConsent: "أرسل ردود الفريق على هذه المحادثة إلى هذا البريد.",
      notifySave: "حفظ البريد",
      notifyOn: (e: string) => `ستصلك ردود الفريق أيضًا على ${e}`,
      notifyRemove: "إزالة",
      notifyFailed: "تعذر حفظ البريد. تحقق منه وحاول مجددًا.",
    },
  }[chatLanguage];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, open, ticketNote]);

  function chatHeaders(json = false): Record<string, string> {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (tokenRef.current) h["X-Chat-Token"] = tokenRef.current;
    return h;
  }

  function resetChat() {
    saveStored(null);
    tokenRef.current = null;
    setConversationId(null);
    setChatMessages([]);
    setNotifyEmail(null);
    setNotifyOpen(false);
    setNotifyInput("");
    setNotifyConsent(false);
    setTicketNote(null);
    setTicketFormOpen(false);
    setTicketConsent(false);
    autoOpenedTicketRef.current = -1;
  }

  // Pull the authoritative thread (AI, visitor and staff messages). Never runs while
  // an AI reply is streaming, so it cannot overwrite in-progress text.
  const refreshRef = useRef<() => Promise<void>>(async () => {});
  refreshRef.current = async () => {
    const id = conversationId;
    if (!id || !tokenRef.current || busyRef.current) return;
    try {
      const res = await fetch(`${API_BASE}/openai/conversations/${id}/thread`, { headers: chatHeaders(), cache: "no-store" });
      if (res.status === 404) { resetChat(); return; }
      if (!res.ok) return;
      const data = (await res.json()) as { notifyEmail: string | null; messages: ServerMessage[] };
      if (busyRef.current || id !== conversationIdRef.current) return;
      setNotifyEmail(data.notifyEmail);
      setChatMessages((prev) => {
        const next = fromServer(data.messages);
        // Keep a locally shown error/placeholder only if the server has not caught up yet.
        return next.length >= prev.filter((m) => m.content).length || next.length > 0 ? next : prev;
      });
    } catch { /* offline: keep current view */ }
  };
  const conversationIdRef = useRef<string | null>(null);
  conversationIdRef.current = conversationId;

  // Recover the conversation in this browser after reload.
  useEffect(() => {
    const stored = loadStored();
    if (stored) { tokenRef.current = stored.token; setConversationId(stored.id); }
  }, []);
  useEffect(() => { if (conversationId && tokenRef.current) void refreshRef.current(); }, [conversationId]);

  // Poll only while the chat is open and the tab is visible.
  useEffect(() => {
    if (!open || !conversationId) return;
    const tick = () => { if (document.visibilityState === "visible") void refreshRef.current(); };
    tick();
    const timer = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, [open, conversationId]);

  async function saveNotify() {
    const email = notifyInput.trim();
    if (!conversationId || !tokenRef.current || !notifyConsent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setNotifyBusy(true); setNotifyError(false);
    try {
      const res = await fetch(`${API_BASE}/openai/conversations/${conversationId}/notify-email`, {
        method: "PUT", headers: chatHeaders(true), body: JSON.stringify({ email, consent: true }),
      });
      if (!res.ok) throw new Error("save failed");
      const data = await res.json();
      setNotifyEmail(data.notifyEmail); setNotifyOpen(false); setNotifyInput(""); setNotifyConsent(false);
    } catch { setNotifyError(true); } finally { setNotifyBusy(false); }
  }
  async function removeNotify() {
    if (!conversationId || !tokenRef.current) return;
    setNotifyBusy(true);
    try {
      const res = await fetch(`${API_BASE}/openai/conversations/${conversationId}/notify-email`, { method: "DELETE", headers: chatHeaders() });
      if (res.ok) setNotifyEmail(null);
    } finally { setNotifyBusy(false); }
  }

  async function ensureConversation(): Promise<string> {
    if (conversationId !== null) return conversationId;
    const res = await fetch(`${API_BASE}/openai/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Website chat" }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    const data = await res.json();
    if (typeof data.accessToken === "string") {
      tokenRef.current = data.accessToken;
      saveStored({ id: data.id, token: data.accessToken });
    }
    conversationIdRef.current = data.id;
    setConversationId(data.id);
    return data.id;
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || busy) return;

    setInput("");
    setBusy(true);
    busyRef.current = true;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content },
      { role: "assistant", content: "" },
    ]);

    try {
      const id = await ensureConversation();
      const res = await fetch(`${API_BASE}/openai/conversations/${id}/messages`, {
        method: "POST",
        headers: chatHeaders(true),
        body: JSON.stringify({ content }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let errored = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.ticketCreated) { track("chat_ticket_created", {language}); notifySubmissionSuccess("chat_ticket"); }
          if (payload.content) {
            setChatMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              const raw = last.content + payload.content;
              const offerTicket = last.offerTicket || raw.includes(TICKET_MARKER);
              next[next.length - 1] = {
                ...last,
                content: raw.replace(TICKET_MARKER, "").trimEnd(),
                offerTicket,
              };
              return next;
            });
          }
          if (payload.error) errored = true;
        }
      }

      if (errored) throw new Error("Stream error");
    } catch {
      setChatMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last.role === "assistant" && last.content === "") {
          next[next.length - 1] = { ...last, content: t.error };
        }
        return next;
      });
    } finally {
      setBusy(false);
      busyRef.current = false;
    }
  }

  async function addShots(files: FileList | null) {
    setShotError(null);
    if (!files) return;
    const next = [...shots];
    for (const f of Array.from(files)) {
      if (next.length >= 3) { setShotError(t.shotMax); break; }
      if (!SHOT_TYPES.includes(f.type)) { setShotError(t.shotType); continue; }
      if (f.size > SHOT_MAX) { setShotError(t.shotSize); continue; }
      try {
        const data = await readBase64(f);
        next.push({ name: f.name, type: f.type, data, preview: URL.createObjectURL(f) });
      } catch {
        setShotError(t.ticketFailed);
      }
    }
    setShots(next);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeShot(i: number) {
    setShots((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, j) => j !== i);
    });
    setShotError(null);
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^\+[0-9]{8,15}$/;
  const tEmail = ticketEmail.trim();
  const tPhone = ticketPhone.replace(/[\s()-]/g, "");
  const emailBad = tEmail !== "" && !EMAIL_RE.test(tEmail);
  const phoneBad = tPhone !== "" && !PHONE_RE.test(tPhone);
  const hasContact = (tEmail !== "" && !emailBad) || (tPhone !== "" && !phoneBad);
  const ticketValid = hasContact && !emailBad && !phoneBad && ticketConsent;

  async function createTicket() {
    if (!ticketValid || ticketBusy) return;

    setTicketBusy(true);
    setTicketError(false);
    try {
      const transcript = chatMessages
        .filter((m) => m.content && !m.ticketNumber)
        .slice(-40)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content.slice(0, 4000) }));

      const res = await fetch(`${API_BASE}/ticket`, {
        method: "POST",
        headers: chatHeaders(true),
        body: JSON.stringify({
          ...(tEmail ? { email: tEmail } : {}),
          ...(tPhone ? { whatsapp: tPhone } : {}),
          contactConsent: true,
          name: ticketName.trim() || null,
          conversationId,
          language: chatLanguage,
          transcript,
          screenshots: shots.map(({ name, type, data }) => ({ name, type, data })),
        }),
      });
      if (!res.ok) throw new Error("Ticket request failed");
      const data = await res.json();

      setTicketFormOpen(false);
      shots.forEach((s) => URL.revokeObjectURL(s.preview));
      setShots([]);
      setTicketNote({
        role: "assistant",
        content: t.ticketCreated(data.ticketNumber),
        ticketNumber: data.ticketNumber,
      });
    } catch {
      setTicketError(true);
    } finally {
      setTicketBusy(false);
    }
  }

  const showTicketOffer =
    !busy && chatMessages.some((m) => m.offerTicket) && !ticketNote;

  // Auto-open the contact form once per new offer, after streaming finishes.
  useEffect(() => {
    if (busy || ticketNote) return;
    let idx = -1;
    chatMessages.forEach((m, i) => { if (m.offerTicket) idx = i; });
    if (idx > autoOpenedTicketRef.current) {
      autoOpenedTicketRef.current = idx;
      setTicketFormOpen(true);
    }
  }, [busy, chatMessages, ticketNote]);
  const shown = ticketNote ? [...chatMessages, ticketNote] : chatMessages;

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="fixed bottom-5 start-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            data-nizamy-chat-panel
            dir={isRtl ? "rtl" : "ltr"}
            lang={chatLanguage}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[min(92vw,380px)] h-[520px] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-start"
          >
            <div className="bg-blue-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={shahadAvatar}
                  alt={t.title}
                  className="w-11 h-11 rounded-full border-2 border-white/60 object-cover bg-white"
                />
                <div>
                  <div className="font-bold">{t.title}</div>
                  <div className="text-xs text-blue-100">{t.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
              {conversationId && (
                <button
                  onClick={resetChat}
                  disabled={busy}
                  aria-label={t.newChat}
                  title={t.newChat}
                  className="p-1.5 rounded-full hover:bg-white/15 transition-colors disabled:opacity-40"
                  data-testid="button-new-chat"
                >
                  <MessageSquarePlus className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              </div>
            </div>

            {conversationId && tokenRef.current && (
              <div className="border-b border-slate-200 bg-blue-50/70 px-4 py-2 text-xs text-slate-700">
                {notifyEmail ? (
                  <div className="flex items-center gap-2" data-testid="text-notify-on">
                    <BellRing className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                    <span className="flex-1">{t.notifyOn("")}<span dir="ltr">{notifyEmail}</span></span>
                    <button onClick={removeNotify} disabled={notifyBusy} className="font-semibold text-blue-700 underline disabled:opacity-40" data-testid="button-notify-remove">{t.notifyRemove}</button>
                  </div>
                ) : !notifyOpen ? (
                  <button onClick={() => setNotifyOpen(true)} className="flex items-center gap-2 font-semibold text-blue-700 hover:underline" data-testid="button-notify-open">
                    <BellRing className="w-3.5 h-3.5" />{t.notifyCta}
                  </button>
                ) : (
                  <form className="space-y-2 py-1" onSubmit={(e) => { e.preventDefault(); void saveNotify(); }}>
                    <p className="text-slate-600">{t.notifyTitle}</p>
                    <input
                      value={notifyInput}
                      onChange={(e) => { setNotifyInput(e.target.value); setNotifyError(false); }}
                      type="email" dir="ltr" maxLength={254}
                      placeholder={t.emailPlaceholder}
                      className={`w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isRtl ? "text-right placeholder:text-right" : ""}`}
                      data-testid="input-notify-email"
                    />
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={notifyConsent} onChange={(e) => setNotifyConsent(e.target.checked)} className="mt-0.5 accent-blue-600" data-testid="checkbox-notify-consent" />
                      <span>{t.notifyConsent}</span>
                    </label>
                    {notifyError && <p className="text-red-600">{t.notifyFailed}</p>}
                    <div className="flex gap-2">
                      <button type="submit" disabled={notifyBusy || !notifyConsent || !notifyInput.trim().includes("@")} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg px-3 py-1.5 font-semibold" data-testid="button-notify-save">{notifyBusy ? "..." : t.notifySave}</button>
                      <button type="button" onClick={() => { setNotifyOpen(false); setNotifyError(false); }} className="px-3 py-1.5 text-slate-500">{t.cancel}</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
              <div className="flex items-end gap-2">
                <img src={shahadAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 bg-white" />
                <div className="bg-white border border-slate-200 rounded-2xl rounded-ss-sm px-4 py-3 text-sm text-slate-700 max-w-[85%]">
                  {t.greeting}
                </div>
              </div>
              {shown.map((m, i) => m.role === "staff" ? (
                <div key={i} className="flex items-end gap-2 justify-start" data-testid="chat-staff-message">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-slate-800 text-white flex items-center justify-center"><Users className="w-3.5 h-3.5" /></div>
                  <div className="bg-white border border-slate-200 border-s-4 border-s-slate-800 rounded-2xl rounded-ss-sm px-4 py-3 text-sm text-slate-800 max-w-[85%]">
                    <div className="text-[11px] font-bold text-slate-900 mb-1">{t.team}</div>
                    <div dir="auto" style={{ textAlign: "start" }} className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              ) : (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex items-end gap-2 justify-start"}>
                  {m.role === "assistant" && (
                    <img src={shahadAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 bg-white" />
                  )}
                  <div
                    dir="auto"
                    style={{ textAlign: "start" }}
                    className={
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-2xl rounded-ee-sm px-4 py-3 text-sm max-w-[85%] whitespace-pre-wrap"
                        : "bg-white border border-slate-200 rounded-2xl rounded-ss-sm px-4 py-3 text-sm text-slate-700 max-w-[85%] whitespace-pre-wrap"
                    }
                  >
                    {m.content || (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    )}
                    {ticketNote && m === ticketNote && (
                      <AppStoreLinks language={language === "ar" ? "ar" : "en"} source="chat_ticket_success" className="mt-3 justify-start" />
                    )}
                  </div>
                </div>
              ))}

              {showTicketOffer && !ticketFormOpen && (
                <div className="flex justify-start ps-9">
                  <button
                    onClick={() => setTicketFormOpen(true)}
                    className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                  >
                    {t.createTicket}
                  </button>
                </div>
              )}

              {showTicketOffer && ticketFormOpen && (
                <div className="ms-9 bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5">
                  <p className="text-xs text-slate-500">{t.ticketFormTitle}</p>
                  <label htmlFor="ticket-name" className="block text-xs font-medium text-slate-600">{t.nameLabel}</label>
                  <input
                    id="ticket-name"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    autoComplete="name"
                    className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="ticket-email" className="block text-xs font-medium text-slate-600">{t.emailLabel}</label>
                  <input
                    id="ticket-email"
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    type="email"
                    dir="ltr"
                    maxLength={254}
                    autoComplete="email"
                    aria-invalid={emailBad}
                    aria-describedby={emailBad ? "ticket-email-err" : undefined}
                    placeholder={t.emailPlaceholder}
                    className={`w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isRtl ? "text-right placeholder:text-right" : ""}`}
                    data-testid="input-ticket-email"
                  />
                  {emailBad && <p id="ticket-email-err" className="text-xs text-red-600">{t.emailInvalid}</p>}
                  <label htmlFor="ticket-whatsapp" className="block text-xs font-medium text-slate-600">{t.phoneLabel}</label>
                  <input
                    id="ticket-whatsapp"
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    maxLength={24}
                    autoComplete="tel"
                    aria-invalid={phoneBad}
                    aria-describedby={phoneBad ? "ticket-whatsapp-err" : undefined}
                    placeholder={t.phonePlaceholder}
                    className={`w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isRtl ? "text-right placeholder:text-right" : ""}`}
                    data-testid="input-ticket-whatsapp"
                  />
                  {phoneBad && <p id="ticket-whatsapp-err" className="text-xs text-red-600">{t.phoneInvalid}</p>}
                  {!hasContact && !emailBad && !phoneBad && (
                    <p className="text-[11px] text-slate-500">{t.contactNeed}</p>
                  )}
                  <label className="flex items-start gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={ticketConsent}
                      onChange={(e) => setTicketConsent(e.target.checked)}
                      required
                      aria-required="true"
                      className="mt-0.5"
                      data-testid="checkbox-ticket-consent"
                    />
                    <span>{t.ticketConsentLabel}</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => addShots(e.target.files)}
                      data-testid="input-ticket-screenshots"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={shots.length >= 3 || ticketBusy}
                      className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-600 hover:border-blue-500 disabled:opacity-40"
                      data-testid="button-add-screenshots"
                    >
                      <ImagePlus className="w-4 h-4" />
                      {t.addShots}
                    </button>
                    <p className="text-[11px] text-amber-700">{t.shotWarn}</p>
                    {shots.length > 0 && (
                      <div className="flex gap-2">
                        {shots.map((s, i) => (
                          <div key={s.preview} className="relative w-16 h-16">
                            <img src={s.preview} alt={s.name} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                            <button
                              type="button"
                              onClick={() => removeShot(i)}
                              aria-label={t.removeShot}
                              className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center"
                              data-testid={`button-remove-screenshot-${i}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {shotError && <p className="text-xs text-red-600">{shotError}</p>}
                  </div>
                  {ticketError && (
                    <p className="text-xs text-red-600">{t.ticketFailed}</p>
                  )}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={createTicket}
                      disabled={ticketBusy || !ticketValid}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                    >
                      {ticketBusy ? "..." : t.submitTicket}
                    </button>
                    <button
                      onClick={() => {
                        setTicketFormOpen(false);
                        setTicketError(false);
                      }}
                      disabled={ticketBusy}
                      className="px-4 py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                dir={input ? "auto" : isRtl ? "rtl" : "ltr"}
                style={{ textAlign: "start" }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={t.placeholder}
                className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="w-10 h-10 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 transition-colors"
              >
                <Send className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => { if (!open) track("chatbot_opened"); setOpen((v) => !v); }}
        aria-label={t.open}
        className="ms-auto flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 ps-2 pe-5 py-2 font-semibold text-sm transition-colors"
      >
        <img
          src={shahadAvatar}
          alt=""
          className="w-9 h-9 rounded-full border-2 border-white/70 object-cover bg-white"
        />
        {!open && <span>{t.open}</span>}
      </button>
    </div>
  );
}
