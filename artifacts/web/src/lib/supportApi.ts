import type { SupportPreview } from "@workspace/api-client-react";

const BASE = `${import.meta.env.BASE_URL}api/support`;

export type Ticket = {
  id: number | string;
  ticketNumber: string;
  email: string;
  name: string | null;
  subject: string | null;
  summary: string | null;
  transcript: string;
  language: string;
  createdAt: string;
};
export type CaseStatus = "draft" | "approved" | "disabled";
export type SupportCase = {
  id: number | string;
  title: string;
  keywords: string;
  diagnosticQuestions: string;
  resolution: string;
  status: CaseStatus;
  source: "manual" | "email";
  sourceId: string | null;
  updatedAt: string;
};
export type Feedback = {
  id: number | string;
  caseId: number | string;
  comment: string;
  helpful: boolean;
  createdAt: string;
};
export type CaseInput = {
  title: string;
  keywords: string;
  diagnosticQuestions: string;
  resolution: string;
};

export type InboxSource = "chat" | "ticket" | "email" | "manual";
export type GapState = "suggested" | "confirmed" | "resolved" | "dismissed";
export type SupportGap = {
  id: number; inboxId: number; objectiveId: number; question: string; evidence: string;
  state: GapState; recordedState: GapState; stale: boolean; reviewedAt: string;
  source: InboxSource; sourceId: string | null; context: string; fingerprint: string; eligible: boolean;
};
export type SupportObjective = {
  id: number; title: string; caseId: number | null; guidanceTitle: string | null;
  guidanceStatus: CaseStatus | null; confirmedCount: number; suggestedCount: number; gaps: SupportGap[];
};
export type GapInput = {
  objectiveId?: number; title?: string; question: string; evidence: string; state: GapState; fingerprint: string;
};
export type InboxStatus = "new" | "reviewed" | "resolved";
export type Relevance = "pending" | "related" | "excluded";
export type InboxViewFilter = "active" | "excluded" | "review";
export type InboxItem = {
  id: number | string;
  source: InboxSource;
  sourceId: string | null;
  title: string;
  question: string;
  context: string | null;
  status: InboxStatus;
  caseId: number | null;
  createdAt: string;
  relevance: Relevance;
  relevanceVersion: number;
  relevanceReviewedAt: string | null;
  scopeAssessment: {scope: "related" | "greeting" | "unrelated" | "uncertain"; confidence: "high" | "low"; reason: string} | null;
};

export type EmailDeliveryStatus = "not_requested" | "no_address" | "pending" | "sending" | "sent" | "failed" | "unconfirmed";
export type StaffReply = {
  id: number; target: "chat" | "ticket"; body: string; createdAt: string; createdBy: string;
  recipientEmail: string | null; emailStatus: EmailDeliveryStatus; emailAttempts: number;
  emailSentAt: string | null; messageId: number | null; canRetryEmail: boolean;
};
export type ThreadMessage = { id: number; role: "user" | "assistant" | "staff"; content: string; createdAt: string; reply: StaffReply | null };
export type ReplyInput = { body: string; sendEmail: boolean; idempotencyKey: string };

export class SupportApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (method !== "GET") {
    headers["X-Support-Request"] = "1";
    headers["Content-Type"] = "application/json";
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      credentials: "same-origin",
      body: method !== "GET" ? JSON.stringify(body ?? {}) : undefined,
    });
  } catch {
    throw new SupportApiError(0, "Network error");
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Request failed (${res.status})`;
    throw new SupportApiError(res.status, msg);
  }
  return data as T;
}

export const supportApi = {
  objectives: () => request<{ objectives: SupportObjective[] }>("/objectives"),
  objectiveSuggestions: (id: InboxItem["id"], question: string) =>
    request<{fingerprint: string; context: string; matchingError?: string; objectives: {id: number; title: string}[]; guidance: {id: number; title: string}[]}>(
      `/inbox/${id}/objective-suggestions`, "POST", {question}),
  preview: (question: string, draft: CaseInput, caseId?: string) =>
    request<SupportPreview>(
      "/preview", "POST", { question, draft, caseId }),
  saveGap: (id: InboxItem["id"], input: GapInput) => request<{ok: true; objectiveId: number}>(`/inbox/${id}/gaps`, "POST", input),
  objectiveGuidance: (id: number, caseId?: number) => request<{case: SupportCase}>(`/objectives/${id}/guidance`, "POST", {caseId}),
  session: () => request<{ email: string | null }>("/session"),
  login: (email: string) => request<{ sent: true }>("/login", "POST", { email }),
  verify: (email: string, code: string) => request<{ email: string }>("/verify", "POST", { email, code }),
  logout: () => request<{ ok: true }>("/logout", "POST", {}),
  tickets: () => request<{ tickets: Ticket[] }>("/tickets"),
  cases: () => request<{ cases: SupportCase[] }>("/cases"),
  createCase: (input: CaseInput & { status?: CaseStatus; reviewed?: boolean }) =>
    request<{ case: SupportCase }>("/cases", "POST", { status: "draft", ...input }),
  updateCase: (id: SupportCase["id"], input: CaseInput & { status: CaseStatus; reviewed?: boolean }) =>
    request<{ case: SupportCase }>(`/cases/${encodeURIComponent(String(id))}`, "PUT", input),
  addFeedback: (id: SupportCase["id"], comment: string, helpful: boolean) =>
    request<{ ok: true }>(`/cases/${encodeURIComponent(String(id))}/feedback`, "POST", { comment, helpful }),
  importEmail: () => request<{ imported: number }>("/import", "POST", {}),
  inbox: (view: InboxViewFilter = "active") => request<{ items: InboxItem[]; localSynced?: boolean }>(`/inbox?view=${view}`),
  assessChat: (item: InboxItem) => request<{assessment: NonNullable<InboxItem["scopeAssessment"]>}>(`/inbox/${item.id}/assess`, "POST", {version:item.relevanceVersion}),
  reviewChat: (item: InboxItem, decision: Relevance, reason: string) => request<{ok:true}>(`/inbox/${item.id}/relevance`, "PATCH", {version:item.relevanceVersion,decision,reason}),
  relevanceHistory: (id: InboxItem["id"]) => request<{history:Array<{decision:Relevance;reason:string;reviewedAt:string}>}>(`/inbox/${id}/relevance-history`),
  createInbox: (title: string, question: string) => request<{ item: InboxItem }>("/inbox", "POST", { title, question }),
  syncInbox: () => request<{ imported: number | null; localSynced?: boolean; emailSynced?: boolean }>("/inbox/sync", "POST", {}),
  updateInbox: (id: InboxItem["id"], status: InboxStatus) =>
    request<{ item: InboxItem }>(`/inbox/${encodeURIComponent(String(id))}`, "PATCH", { status }),
  inboxToCase: (id: InboxItem["id"]) =>
    request<{ case: SupportCase }>(`/inbox/${encodeURIComponent(String(id))}/case`, "POST", {}),
  chatThread: (inboxId: InboxItem["id"]) =>
    request<{ notifyEmail: string | null; messages: ThreadMessage[] }>(`/inbox/${encodeURIComponent(String(inboxId))}/thread`),
  replyToChat: (inboxId: InboxItem["id"], input: ReplyInput) =>
    request<{ reply: StaffReply; replayed: boolean }>(`/inbox/${encodeURIComponent(String(inboxId))}/replies`, "POST", input),
  ticketReplies: (ticketId: Ticket["id"]) =>
    request<{ recipientEmail: string | null; linkedChat: boolean; replies: StaffReply[] }>(`/tickets/${encodeURIComponent(String(ticketId))}/replies`),
  replyToTicket: (ticketId: Ticket["id"], input: ReplyInput) =>
    request<{ reply: StaffReply; replayed: boolean }>(`/tickets/${encodeURIComponent(String(ticketId))}/replies`, "POST", input),
  retryReplyEmail: (replyId: StaffReply["id"]) =>
    request<{ reply: StaffReply }>(`/replies/${encodeURIComponent(String(replyId))}/retry-email`, "POST", {}),
  feedback: () => request<{ feedback: Feedback[] }>("/feedback"),
};
