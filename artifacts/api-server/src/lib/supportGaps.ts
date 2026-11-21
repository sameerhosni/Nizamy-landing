import { createHash } from "node:crypto";

export function sourceFingerprint(item: { question: string; context: string }) {
  return createHash("sha256").update(JSON.stringify([item.question, item.context])).digest("hex");
}

// Review completion is deliberately NOT an answer-outcome signal.
export function isGapSourceEligible(item: { source: string; source_id: string | null; title: string; relevance: string }) {
  if (item.source === "chat") return item.source_id?.startsWith("conversation:") === true && item.relevance === "related";
  if (item.source === "email") return item.source_id?.startsWith("email-thread:") === true && item.title !== "[excluded]";
  return item.source === "manual" || item.source === "ticket";
}

export function effectiveGapState(gap: { state: string; source_fingerprint: string }, item: Parameters<typeof sourceFingerprint>[0] & Parameters<typeof isGapSourceEligible>[0]) {
  if (gap.state === "resolved" || gap.state === "dismissed") return gap.state;
  return isGapSourceEligible(item) && gap.source_fingerprint === sourceFingerprint(item) ? gap.state : "suggested";
}
