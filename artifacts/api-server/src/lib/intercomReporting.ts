// Live, read-only reporting. No provider payloads or message bodies are persisted.
const hosts: Record<string, string> = {
  us: "https://api.intercom.io", eu: "https://api.eu.intercom.io", au: "https://api.au.intercom.io",
};
export class IntercomReportingError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const invalid = () => new IntercomReportingError(502, "invalid_response", "Intercom returned an invalid response. Please retry.");
type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw invalid();
  return value as ObjectValue;
}
const text = (value: unknown) => typeof value === "string" ? value : null;
function id(value: unknown) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value)) throw invalid();
  return value;
}
function date(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 253402300799) throw invalid();
  return new Date(value * 1000).toISOString();
}
export function contactMetadata(value: unknown) {
  const c = object(value);
  return { id: id(c.id), source: "intercom" as const, name: text(c.name), email: text(c.email),
    role: text(c.role), createdAt: date(c.created_at), updatedAt: date(c.updated_at), lastSeenAt: date(c.last_seen_at) };
}
function nextCursor(value: unknown) {
  if (value == null) return null;
  const next = object(value).next;
  if (next == null) return null;
  const cursor = object(next).starting_after;
  if (typeof cursor !== "string" || !cursor.length || cursor.length > 2048) throw invalid();
  return cursor;
}
async function request(path: string, body?: unknown): Promise<ObjectValue> {
  const token = process.env.INTERCOM_ACCESS_TOKEN?.trim();
  if (!token) throw new IntercomReportingError(503, "not_configured", "Intercom reporting is not configured. Set the server-only INTERCOM_ACCESS_TOKEN secret.");
  const host = hosts[process.env.INTERCOM_API_REGION || "us"];
  if (!host) throw new IntercomReportingError(503, "invalid_region", "Set INTERCOM_API_REGION to us, eu or au on the server.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${host}${path}`, {
      method: body === undefined ? "GET" : "POST", redirect: "error", signal: controller.signal,
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", "Intercom-Version": "2.14" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      // Never expose upstream bodies, tokens, URLs or customer content in errors/logs.
      void response.body?.cancel().catch(() => {});
      if ([401, 403].includes(response.status)) throw new IntercomReportingError(503, "access_denied", "Intercom access was denied. Check the token, region and read permissions for contacts and conversations.");
      if (response.status === 404) throw new IntercomReportingError(404, "not_found", "This Intercom contact is no longer available. Refresh the contact list.");
      if (response.status === 429) throw new IntercomReportingError(429, "rate_limited", "Intercom rate limit reached. Wait before retrying.");
      throw new IntercomReportingError(502, "upstream_error", "Intercom is unavailable or rejected this request. Refresh and retry.");
    }
    return object(await response.json());
  } catch (error) {
    if (error instanceof IntercomReportingError) throw error;
    if (controller.signal.aborted) throw new IntercomReportingError(504, "timeout", "Intercom did not respond in time. Please retry.");
    throw new IntercomReportingError(502, "upstream_error", "Intercom could not be reached or returned an invalid response. Please retry.");
  } finally { clearTimeout(timer); }
}
export async function listIntercomContacts(email?: string, cursor?: string) {
  const result = await request("/contacts/search", {
    query: email ? { field: "email", operator: "=", value: email } : { field: "created_at", operator: ">", value: 0 },
    pagination: { per_page: 30, ...(cursor ? { starting_after: cursor } : {}) },
    sort: { field: "created_at", order: "descending" },
  });
  if (!Array.isArray(result.data)) throw invalid();
  return { items: result.data.map(contactMetadata), nextCursor: nextCursor(result.pages), fetchedAt: new Date().toISOString() };
}
export async function getIntercomContact(contactId: string) {
  return contactMetadata(await request(`/contacts/${encodeURIComponent(contactId)}`));
}
export async function listIntercomConversations(contactId: string, cursor?: string) {
  const result = await request("/conversations/search", {
    query: { field: "contact_ids", operator: "=", value: contactId },
    pagination: { per_page: 30, ...(cursor ? { starting_after: cursor } : {}) },
    sort: { field: "updated_at", order: "descending" },
  });
  if (!Array.isArray(result.conversations)) throw invalid();
  return {
    conversations: result.conversations.map(value => {
      const c = object(value);
      return { id: id(c.id), source: "intercom" as const, state: text(c.state),
        createdAt: date(c.created_at), updatedAt: date(c.updated_at) };
    }),
    nextCursor: nextCursor(result.pages),
  };
}
