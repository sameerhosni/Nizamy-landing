import { openai } from "@workspace/integrations-openai-ai-server";
import { approvedSupportGuidance, formatSupportGuidance } from "./supportKnowledge";
import { selectSupportGuidance } from "./supportSemanticMatching";
import { supportResponsePolicy } from "../routes/openai";

export type PreviewInput = {
  question: string;
  draft: { title: string; keywords: string; diagnosticQuestions: string; resolution: string };
  caseId?: string;
};

export function validPreviewInput(value: unknown): value is PreviewInput {
  if (!value || typeof value !== "object") return false;
  const b = value as PreviewInput;
  if (typeof b.question !== "string" || !b.question.trim() || b.question.length > 4000 ||
      (b.caseId !== undefined && (typeof b.caseId !== "string" || !/^[1-9]\d{0,18}$/.test(b.caseId))) ||
      !b.draft || typeof b.draft !== "object") return false;
  const d = b.draft;
  return typeof d.title === "string" && !!d.title.trim() && d.title.length <= 200 &&
    ["keywords", "diagnosticQuestions", "resolution"].every(k =>
      typeof d[k as keyof typeof d] === "string" && d[k as keyof typeof d].length <= 10000) &&
    !!d.resolution.trim();
}

// Deliberately read-only: never call customer-chat routes, writes, or notifications.
export async function previewSupportReply(input: PreviewInput) {
  const approved = await approvedSupportGuidance();
  const draftId = "preview-draft";
  const draft = {
    id: draftId, title: input.draft.title, keywords: input.draft.keywords,
    diagnostic_questions: input.draft.diagnosticQuestions, resolution: input.draft.resolution,
    updated_at: new Date().toISOString(),
  };
  // Simulate replacement, not two conflicting versions of the case being edited.
  const candidates = [draft, ...approved.filter(row => String(row.id) !== input.caseId)];
  const matches = await selectSupportGuidance(candidates, input.question);
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    max_completion_tokens: 2048,
    messages: [
      { role: "system", content: supportResponsePolicy(formatSupportGuidance(matches)) },
      { role: "user", content: input.question },
    ],
  }, { timeout: 30000, maxRetries: 0 });
  const reply = response.choices[0]?.message.content?.trim();
  if (!reply) throw new Error("Empty preview response");
  return {
    preview: true as const, reply,
    matches: matches.map(row => ({
      id: String(row.id), title: row.title,
      source: row.id === draftId ? "draft" as const : "approved" as const,
    })),
  };
}
