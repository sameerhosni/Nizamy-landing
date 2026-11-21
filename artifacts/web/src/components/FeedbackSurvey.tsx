import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import {
  SUCCESS_EVENT, surveyState, buildFeedbackPayload, isDone, markDone,
} from "@/lib/feedbackSurvey";

const copy = {
  en: {
    title: "How was your visit to Nizamy's website?",
    sub: "One quick rating. No name or contact details needed.",
    scale: ["Very poor", "Poor", "Okay", "Good", "Excellent"],
    comment: "Anything we should improve? (optional)",
    send: "Send feedback", dismiss: "No thanks",
    thanks: "Thank you. Your feedback helps us improve the site.",
    group: "Rate your website experience from 1 to 5",
  },
  ar: {
    title: "كيف كانت تجربتك مع موقع نظامي؟",
    sub: "تقييم سريع واحد. لا نحتاج اسمك أو بيانات تواصلك.",
    scale: ["سيئة جدًا", "سيئة", "مقبولة", "جيدة", "ممتازة"],
    comment: "هل هناك ما يمكننا تحسينه؟ (اختياري)",
    send: "إرسال التقييم", dismiss: "لا، شكرًا",
    thanks: "شكرًا لك. ملاحظاتك تساعدنا على تحسين الموقع.",
    group: "قيّم تجربتك مع الموقع من 1 إلى 5",
  },
};

function storage() { try { return window.sessionStorage; } catch { return undefined; } }

function isBlocked(): boolean {
  if (document.querySelector("[data-nizamy-chat-panel]")) return true;
  if (document.querySelector('[role="dialog"], [role="alertdialog"], [aria-modal="true"]')) return true;
  const a = document.activeElement as HTMLElement | null;
  if (a && !a.closest("[data-feedback-survey]") && a.matches("input, textarea, select, [contenteditable='true']")) return true;
  return false;
}

export function FeedbackSurvey({ languageOverride }: { languageOverride?: "en" | "ar" }) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;
  const dir = language === "ar" ? "rtl" : "ltr";
  const t = copy[language];
  const [done, setDone] = useState(() => isDone(storage()));
  const [submitted, setSubmitted] = useState(false);
  const [activeMs, setActiveMs] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    if (done) return;
    const onSuccess = () => setSubmitted(true);
    window.addEventListener(SUCCESS_EVENT, onSuccess);
    let last = performance.now();
    let lastInput = last;
    const bump = () => { lastInput = performance.now(); };
    const evs = ["pointermove", "keydown", "scroll", "touchstart", "wheel"];
    evs.forEach(e => window.addEventListener(e, bump, { passive: true }));
    // Active = tab visible and an interaction within the last 30s.
    const id = window.setInterval(() => {
      const now = performance.now();
      if (document.visibilityState === "visible" && document.hasFocus() && now - lastInput < 30000) {
        setActiveMs(ms => ms + (now - last));
      }
      last = now;
      setBlocked(isBlocked());
    }, 1000);
    return () => {
      window.removeEventListener(SUCCESS_EVENT, onSuccess);
      evs.forEach(e => window.removeEventListener(e, bump));
      window.clearInterval(id);
    };
  }, [done]);

  const state = surveyState({ done, submitted, activeMs, blocked });

  if (thanks) {
    return (
      <section data-feedback-survey dir={dir} className="container mx-auto px-4 sm:px-6 max-w-7xl mb-8">
        <p role="status" className="rounded-2xl border border-teal-200 bg-teal-50/70 px-5 py-4 text-sm font-semibold text-teal-900">{t.thanks}</p>
      </section>
    );
  }
  if (state !== "show") return null;

  const finish = () => { markDone(storage()); setDone(true); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating == null) return;
    track("website_feedback_submitted", buildFeedbackPayload(rating, comment, language));
    markDone(storage());
    setDone(true);
    setThanks(true);
  };

  return (
    <section data-feedback-survey dir={dir} aria-labelledby="feedback-survey-title"
      className="container mx-auto px-4 sm:px-6 max-w-7xl mb-10">
      <form onSubmit={submit}
        className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50/60 via-white to-teal-50/50 p-5 sm:p-6 shadow-[0_10px_30px_-20px_rgba(15,60,70,0.35)]">
        <div className="flex flex-col gap-1 mb-4">
          <h2 id="feedback-survey-title" className="text-lg font-bold text-slate-900">{t.title}</h2>
          <p className="text-sm text-slate-500">{t.sub}</p>
        </div>
        <fieldset>
          <legend className="sr-only">{t.group}</legend>
          <div role="radiogroup" aria-label={t.group} className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <label key={n}
                className={`cursor-pointer select-none rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-1 ${rating === n ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-teal-500"}`}>
                <input type="radio" name="feedback-rating" value={n} checked={rating === n}
                  onChange={() => setRating(n)} className="sr-only" />
                <span className="tabular-nums">{n}</span>
                <span className="ms-1.5 font-medium opacity-80">{t.scale[n - 1]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor="feedback-comment" className="mt-4 block text-sm font-medium text-slate-700">{t.comment}</label>
        <textarea id="feedback-comment" value={comment} maxLength={500} rows={2}
          onChange={e => setComment(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={rating == null}
            className="rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">{t.send}</button>
          <button type="button" onClick={finish}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">{t.dismiss}</button>
        </div>
      </form>
    </section>
  );
}
