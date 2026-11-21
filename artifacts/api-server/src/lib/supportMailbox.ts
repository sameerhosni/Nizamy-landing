import { ImapFlow, type SearchObject } from "imapflow";
import { simpleParser } from "mailparser";
import { ReplitConnectors } from "@replit/connectors-sdk";

const excludedSubject = (subject: string | undefined) => /explee/i.test(subject || "");
/** Gmail IMAP exposes decimal IDs; Gmail REST and our existing records use hex. */
export function gmailId(value: string | undefined): string {
  if (!value || !/^\d+$/.test(value)) throw new Error("Missing Gmail IMAP identity");
  return BigInt(value).toString(16);
}

export async function withSupportMailbox<T>(email: string, run: (get: (path: string) => Promise<any>) => Promise<T>): Promise<T> {
  if (process.env.SUPPORT_MAIL_PROVIDER === "replit") {
    const connector = new ReplitConnectors();
    const get = async (path: string): Promise<any> => {
      const response = await connector.proxy("google-mail", path, { method: "GET" });
      if (!response.ok) throw new Error(`Mailbox access failed (${response.status})`);
      return response.json();
    };
    return run(async path => {
      const url = new URL(path, "https://gmail.invalid");
      const detail = url.pathname.match(/\/(threads|messages)\/([a-f0-9]+)$/);
      if (detail) {
        const metadata = await get(`${url.pathname}?format=metadata&metadataHeaders=Subject`);
        const messages = detail[1] === "threads" ? metadata.messages ?? [] : [metadata];
        if (messages.some((m: any) => (m.payload?.headers ?? []).some((h: any) => h.name.toLowerCase() === "subject" && excludedSubject(h.value)))) {
          return detail[1] === "threads" ? { messages: [] } : null;
        }
      } else if (/\/(threads|messages)$/.test(url.pathname)) {
        url.searchParams.set("q", `${url.searchParams.get("q") || ""} -subject:Explee`);
        path = url.pathname + url.search;
      }
      return get(path);
    });
  }
  const user = process.env.IMAP_USERNAME || process.env.SMTP_USERNAME;
  const pass = process.env.IMAP_PASSWORD || process.env.SMTP_PASSWORD;
  if (user?.toLowerCase() !== email.toLowerCase() || !pass) throw new Error("Configure IMAP credentials for the support mailbox");
  const lists = new Map<string, string[]>();
  return run(async path => {
    const url = new URL(path, "https://gmail.invalid");
    if (url.pathname.endsWith("/profile")) return { emailAddress: user };
    const detail = url.pathname.match(/\/(threads|messages)\/([a-f0-9]+)$/);
    const threads = url.pathname.endsWith("/threads");
    const query = url.searchParams.get("q") || "";
    const cacheKey = `${threads}:${query}`;
    if (detail || !lists.has(cacheKey)) {
      const result = await readMailbox(user, pass, async messages => {
        if (detail) {
          const decimal = BigInt(`0x${detail[2]}`).toString();
          const found = await messages({ [detail[1] === "threads" ? "threadId" : "emailId"]: decimal, gmailraw: "-in:spam -in:trash -in:drafts" }, true);
          // A message can be moved/deleted after listing. Never confuse that with
          // a dropped connection (readMailbox checks it before returning).
          return detail[1] === "threads" ? { messages: found, historyId: `imap-${found.map(m => m.id).join("-")}` } : found[0] ?? null;
        }
        const found = await messages({ gmailraw: `${query} -in:spam -in:trash -in:drafts` }, false);
        return [...new Set(found.map(m => threads ? m.threadId : m.id))].reverse();
      });
      if (detail) return result;
      lists.set(cacheKey, result);
    }
    const ids = lists.get(cacheKey)!;
    const offset = Number(url.searchParams.get("pageToken") || 0);
    const size = Math.min(100, Number(url.searchParams.get("maxResults") || 50));
    return { [threads ? "threads" : "messages"]: ids.slice(offset, offset + size).map(id => ({ id })), nextPageToken: offset + size < ids.length ? String(offset + size) : undefined };
  });
}

/** Bound network reads, not the time the caller spends classifying or saving mail. */
async function readMailbox<T>(user: string, pass: string, run: (messages: (query: SearchObject, bodies: boolean) => Promise<any[]>) => Promise<T>): Promise<T> {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || "imap.gmail.com",
    port: Number(process.env.IMAP_PORT || 993), secure: true,
    auth: { user, pass }, logger: false,
    connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 30000,
  });
  let connectionError: Error | undefined;
  client.on("error", () => { connectionError = new Error("IMAP connection failed"); });
  let deadline: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    deadline = setTimeout(() => {
      connectionError = new Error("IMAP mailbox read exceeded four-minute deadline");
      reject(connectionError);
      client.close();
    }, 240000);
  });
  function checkConnection() {
    if (connectionError) {
      client.close();
      throw connectionError;
    }
    if (!client.usable) throw new Error("IMAP connection closed during mailbox read; retry the import");
  }
  const operation = async () => {
    await client.connect();
    checkConnection();
    if (!client.capabilities.has("X-GM-EXT-1")) throw new Error("Support import requires Gmail IMAP extensions");
    const mailbox = (await client.list()).find(m => m.specialUse === "\\All");
    checkConnection();
    if (!mailbox) throw new Error("Gmail All Mail folder unavailable");
    await client.mailboxOpen(mailbox.path, { readOnly: true });
    checkConnection();
    async function messages(query: SearchObject, bodies: boolean) {
      checkConnection();
      const uids = await client.search(query, { uid: true });
      checkConnection();
      if (!uids || !uids.length) return [];
      const result: any[] = [];
      // Fetch in bounded batches; never execute another command inside fetch iteration.
      for (let i = 0; i < uids.length; i += 50) {
        const allowed: number[] = [];
        // Inspect headers only before requesting any source/body bytes.
        for await (const m of client.fetch(uids.slice(i, i + 50), { envelope: true }, { uid: true })) {
          if (!m.envelope) throw new Error("Cannot check email subject before import");
          if (!excludedSubject(m.envelope.subject)) allowed.push(m.uid);
        }
        checkConnection();
        if (!allowed.length) continue;
        for await (const m of client.fetch(allowed, { emailId: true, threadId: true, internalDate: true, ...(bodies ? { source: { start: 0, maxLength: 2_000_000 }, size: true } : {}) }, { uid: true })) {
          if (bodies && (m.size ?? 0) > 2_000_000) throw new Error("Support email exceeds 2 MB import limit");
          const parsed = bodies ? await simpleParser(m.source!) : undefined;
          result.push({
            id: gmailId(m.emailId), threadId: gmailId(m.threadId),
            internalDate: String(m.internalDate ? new Date(m.internalDate).getTime() : 0),
            payload: parsed ? {
              mimeType: "text/plain",
              headers: [{ name: "subject", value: parsed.subject || "" }, { name: "from", value: parsed.from?.text || "" }, { name: "in-reply-to", value: parsed.inReplyTo || "" }],
              body: { data: Buffer.from(parsed.text || "").toString("base64url") },
            } : undefined,
          });
        }
      }
      checkConnection();
      return result.sort((a,b) => Number(a.internalDate) - Number(b.internalDate));
    }
    const result = await run(messages);
    checkConnection();
    return result;
  };
  try {
    return await Promise.race([operation(), timeout]);
  } finally {
    clearTimeout(deadline!);
    client.close();
  }
}
