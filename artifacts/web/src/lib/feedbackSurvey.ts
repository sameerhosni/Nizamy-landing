// Pure logic + tiny event helper for the inline website feedback survey.
export const SUCCESS_EVENT = "nizamy:submission-success";
export const DONE_KEY = "nizamy_feedback_done";
export const ACTIVE_MS_THRESHOLD = 20000;

/** Dispatch only after a confirmed successful submission (never on click or failure). */
export function notifySubmissionSuccess(source: "marketing_form" | "chat_ticket") {
  try { window.dispatchEvent(new CustomEvent(SUCCESS_EVENT, { detail: { source } })); } catch { /* ignore */ }
}

export interface EligibilityInput {
  done: boolean; submitted: boolean; activeMs: number;
  blocked: boolean; // chatbot open, modal open, or a form field focused
}
export function surveyState(i: EligibilityInput): "hidden" | "deferred" | "show" {
  if (i.done) return "hidden";
  if (!i.submitted && i.activeMs < ACTIVE_MS_THRESHOLD) return "hidden";
  return i.blocked ? "deferred" : "show";
}

export function isValidRating(r: unknown): r is 1 | 2 | 3 | 4 | 5 {
  return typeof r === "number" && Number.isInteger(r) && r >= 1 && r <= 5;
}
export function buildFeedbackPayload(rating: number, comment: string, language: "ar" | "en") {
  if (!isValidRating(rating)) throw new Error("rating must be 1-5");
  return { rating, comment: comment.trim().slice(0, 500), language };
}

export interface KV { getItem(k: string): string | null; setItem(k: string, v: string): void }
export function isDone(s: KV | undefined): boolean { try { return s?.getItem(DONE_KEY) === "1"; } catch { return false; } }
export function markDone(s: KV | undefined) { try { s?.setItem(DONE_KEY, "1"); } catch { /* ignore */ } }
