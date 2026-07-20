import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const API_BASE = `${import.meta.env.BASE_URL}api`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      title: "Nizamy Assistant",
      subtitle: "Ask anything about Nizamy HR",
      placeholder: "Type your question...",
      greeting:
        "Hi! I'm the Nizamy assistant. Ask me anything about the HR system, pricing, or the return model.",
      error: "Something went wrong. Please try again.",
      open: "Chat with us",
    },
    ar: {
      title: "مساعد نظامي",
      subtitle: "اسأل أي شيء عن نظامي اتش آر",
      placeholder: "اكتب سؤالك...",
      greeting:
        "أهلًا! أنا مساعد نظامي. اسألني عن النظام، الأسعار، أو نموذج العائد.",
      error: "حدث خطأ، حاول مرة أخرى.",
      open: "تحدث معنا",
    },
  }[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, open]);

  async function ensureConversation(): Promise<string> {
    if (conversationId !== null) return conversationId;
    const res = await fetch(`${API_BASE}/openai/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Website chat" }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    const data = await res.json();
    setConversationId(data.id);
    return data.id;
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || busy) return;

    setInput("");
    setBusy(true);
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content },
      { role: "assistant", content: "" },
    ]);

    try {
      const id = await ensureConversation();
      const res = await fetch(`${API_BASE}/openai/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          if (payload.content) {
            setChatMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = {
                ...last,
                content: last.content + payload.content,
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
    }
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="fixed bottom-5 end-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[min(92vw,380px)] h-[520px] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-bold">{t.title}</div>
                <div className="text-xs text-blue-100">{t.subtitle}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-ss-sm px-4 py-3 text-sm text-slate-700 max-w-[85%]">
                {t.greeting}
              </div>
              {chatMessages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
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
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
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
        onClick={() => setOpen((v) => !v)}
        aria-label={t.open}
        className="ms-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 px-5 py-3.5 font-semibold text-sm transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        {!open && <span>{t.open}</span>}
      </button>
    </div>
  );
}
