import assert from "node:assert/strict";
import test from "node:test";
import {
  parseReplyInput, resolveRecipient, initialEmailStatus, canClaimEmail, displayEmailStatus,
  sameReplayRequest, chatAccess, ticketLinkDecision, classifySendFailure, runDelivery, UNCONFIRMED_MARK, historyForModel, normalizeEmail, maskEmail, MAX_EMAIL_ATTEMPTS,
} from "./staffReplyCore";

const key = "3f2c8a8e-1b7d-4c1e-9a55-0f6f2a6b9c11";

test("reply input is validated and normalized", () => {
  assert.equal(parseReplyInput({ body: "  hi\r\nthere\u0007 ", idempotencyKey: key }).ok, true);
  const ok = parseReplyInput({ body: "  hi\r\nthere\u0007 ", idempotencyKey: key.toUpperCase(), sendEmail: true });
  assert.deepEqual(ok, { ok: true, value: { body: "hi\nthere", sendEmail: true, idempotencyKey: key } });
  assert.equal(parseReplyInput({ body: "   ", idempotencyKey: key }).ok, false);
  assert.equal(parseReplyInput({ body: "x".repeat(4001), idempotencyKey: key }).ok, false);
  assert.equal(parseReplyInput({ body: "x", idempotencyKey: "123" }).ok, false);
  assert.equal(parseReplyInput({ body: "x", idempotencyKey: key, sendEmail: "yes" }).ok, false);
  assert.equal(parseReplyInput(null).ok, false);
});

test("staff requests can never supply a recipient", () => {
  for (const field of ["to", "recipient", "email", "recipientEmail"]) {
    assert.equal(parseReplyInput({ body: "x", idempotencyKey: key, [field]: "attacker@example.com" }).ok, false);
  }
});

test("recipient is sourced only from the stored address for the target", () => {
  assert.equal(resolveRecipient("chat", { notifyEmail: "A@Example.com", ticketEmail: "t@example.com" }), "a@example.com");
  assert.equal(resolveRecipient("chat", { notifyEmail: null, ticketEmail: "t@example.com" }), null);
  assert.equal(resolveRecipient("ticket", { notifyEmail: "a@example.com", ticketEmail: "t@example.com" }), "t@example.com");
  assert.equal(resolveRecipient("ticket", { ticketEmail: "not-an-email" }), null);
  assert.equal(normalizeEmail("a@b.c\nBcc: x@y.z"), null);
});

test("email delivery states are truthful and never re-claim sent mail", () => {
  assert.equal(initialEmailStatus(false, "a@example.com"), "not_requested");
  assert.equal(initialEmailStatus(true, null), "no_address");
  assert.equal(initialEmailStatus(true, "a@example.com"), "pending");
  assert.equal(canClaimEmail("pending", 0, "a@example.com"), true);
  assert.equal(canClaimEmail("failed", 1, "a@example.com"), true);
  assert.equal(canClaimEmail("sent", 1, "a@example.com"), false);
  assert.equal(canClaimEmail("sending", 1, "a@example.com"), false);
  assert.equal(canClaimEmail("failed", MAX_EMAIL_ATTEMPTS, "a@example.com"), false);
  assert.equal(canClaimEmail("pending", 0, null), false);
  const now = Date.now();
  assert.equal(displayEmailStatus("sending", new Date(now - 1000), now), "sending");
  assert.equal(displayEmailStatus("sending", new Date(now - 16 * 60 * 1000), now), "unconfirmed");
});

test("idempotency replays must match target and body", () => {
  const a = { target: "chat", targetId: 4, bodyHash: "h1" };
  assert.equal(sameReplayRequest(a, { ...a }), true);
  assert.equal(sameReplayRequest(a, { ...a, targetId: 5 }), false);
  assert.equal(sameReplayRequest(a, { ...a, bodyHash: "h2" }), false);
  assert.equal(sameReplayRequest(a, { ...a, target: "ticket" }), false);
});

test("visitor capability checks", () => {
  assert.equal(chatAccess("abc", "abc"), "ok");
  assert.equal(chatAccess("abc", "abd"), "denied");
  assert.equal(chatAccess("abc", null), "denied");
  assert.equal(chatAccess(null, null), "denied");
  assert.equal(chatAccess(null, "abc"), "denied");
  assert.equal(maskEmail("sara@example.com"), "s***@example.com");
});

test("staff replies are never presented to the model as user text", () => {
  const h = historyForModel([{ role: "user", content: "q" }, { role: "staff", content: "team" }, { role: "assistant", content: "a" }]);
  assert.deepEqual(h.map((m) => m.role), ["user", "assistant", "assistant"]);
  assert.match(h[1].content, /Nizamy support team/);
});

const conv = "8a1f2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d";
test("ticket linking requires the conversation capability token", () => {
  assert.equal(ticketLinkDecision(conv, "d1", "d1"), "link");
  assert.equal(ticketLinkDecision(conv, "d1", "d2"), "unlinked");
  assert.equal(ticketLinkDecision(conv, "d1", null), "unlinked");
  assert.equal(ticketLinkDecision(conv, null, "d1"), "unlinked");
  assert.equal(ticketLinkDecision(conv, undefined, "d1"), "unlinked");
});
test("tickets without a conversation are still accepted unlinked", () => {
  assert.equal(ticketLinkDecision(null, null, null), "unlinked");
  assert.equal(ticketLinkDecision(undefined, "d1", "d1"), "unlinked");
  assert.equal(ticketLinkDecision("not-a-uuid", "d1", "d1"), "unlinked");
});

test("only confirmed rejections or pre-DATA failures are retryable", () => {
  assert.equal(classifySendFailure({ responseCode: 550, command: "DATA" }), "rejected");
  assert.equal(classifySendFailure({ responseCode: 451, command: "RCPT TO" }), "rejected");
  assert.equal(classifySendFailure({ code: "EAUTH", command: "AUTH PLAIN" }), "rejected");
  assert.equal(classifySendFailure({ code: "ECONNECTION", command: "CONN" }), "rejected");
  assert.equal(classifySendFailure(new Error("SMTP not configured")), "rejected");
  assert.equal(classifySendFailure({ code: "ETIMEDOUT", command: "DATA" }), "unknown");
  assert.equal(classifySendFailure({ code: "ESOCKET" }), "unknown");
  assert.equal(classifySendFailure({ code: "ECONNRESET", command: "DATA" }), "unknown");
  assert.equal(classifySendFailure(null), "unknown");
  assert.equal(displayEmailStatus("sending", new Date(), Date.now(), UNCONFIRMED_MARK), "unconfirmed");
});

function io(over: Partial<Parameters<typeof runDelivery>[0]> = {}) {
  const calls: string[] = [];
  return { calls, io: {
    send: async () => { calls.push("send"); },
    markSent: async () => { calls.push("sent"); },
    markFailed: async () => { calls.push("failed"); },
    markUnconfirmed: async () => { calls.push("unconfirmed"); },
    log: () => {},
    ...over,
  } };
}

test("DB failure after accepted send never marks failed", async () => {
  const { calls, io: x } = io({ markSent: async () => { throw new Error("db down"); } });
  x.markFailed = async () => { calls.push("failed"); };
  assert.equal(await runDelivery(x), "sent_unrecorded");
  assert(!calls.includes("failed") && !calls.includes("unconfirmed"));
});

test("successful send records sent", async () => {
  const { calls, io: x } = io();
  assert.equal(await runDelivery(x), "sent");
  assert.deepEqual(calls, ["send", "sent"]);
});

test("ambiguous timeout during DATA stays unconfirmed, not failed", async () => {
  const { calls, io: x } = io({ send: async () => { throw Object.assign(new Error("t"), { code: "ETIMEDOUT", command: "DATA" }); } });
  assert.equal(await runDelivery(x), "unconfirmed");
  assert.deepEqual(calls, ["unconfirmed"]);
});

test("explicit rejection is marked failed and retryable", async () => {
  const { calls, io: x } = io({ send: async () => { throw Object.assign(new Error("r"), { responseCode: 550, command: "RCPT TO" }); } });
  assert.equal(await runDelivery(x), "failed");
  assert.deepEqual(calls, ["failed"]);
  assert.equal(canClaimEmail("failed", 1, "a@example.com"), true);
  assert.equal(canClaimEmail("sending", 1, "a@example.com"), false);
});

test("rejection whose failed-state write fails stays non-retryable", async () => {
  const { io: x } = io({
    send: async () => { throw { responseCode: 550 }; },
    markFailed: async () => { throw new Error("db down"); },
  });
  assert.equal(await runDelivery(x), "unconfirmed");
});
