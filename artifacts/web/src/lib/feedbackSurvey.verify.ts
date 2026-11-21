import assert from "node:assert/strict";
import { surveyState, buildFeedbackPayload, isValidRating, isDone, markDone } from "./feedbackSurvey";

const base = { done: false, submitted: false, activeMs: 0, blocked: false };
assert.equal(surveyState(base), "hidden");
assert.equal(surveyState({ ...base, activeMs: 19999 }), "hidden");
assert.equal(surveyState({ ...base, activeMs: 20000 }), "show");
assert.equal(surveyState({ ...base, submitted: true }), "show");
assert.equal(surveyState({ ...base, submitted: true, blocked: true }), "deferred");
assert.equal(surveyState({ ...base, submitted: true, done: true }), "hidden");
for (const r of [0, 6, 2.5, NaN]) assert.equal(isValidRating(r), false);
assert.throws(() => buildFeedbackPayload(0, "", "en"));
assert.deepEqual(buildFeedbackPayload(4, "  good  ", "ar"), { rating: 4, comment: "good", language: "ar" });
assert.equal(buildFeedbackPayload(5, "x".repeat(900), "en").comment.length, 500);
const m = new Map<string, string>();
const kv = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
assert.equal(isDone(kv), false); markDone(kv); assert.equal(isDone(kv), true);
console.log("Feedback survey logic: gating, deferral, once-per-session and payload passed.");
