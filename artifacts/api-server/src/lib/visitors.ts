import { randomUUID } from "node:crypto";
import { getPool } from "@workspace/db";

export const validVisitorId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);

// Contacts are accepted only after a successful server-side form/ticket operation.
// They are visitor-provided contact details, not proof of identity or marketing consent.
export async function linkVisitorContact(visitor: string, input: Record<string, unknown>) {
  if (!validVisitorId(visitor)) return;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const rawPhone = typeof (input.phone ?? input.whatsapp) === "string" ? String(input.phone ?? input.whatsapp) : "";
  const phone = rawPhone.replace(/[^\d+]/g, "").replace(/^00/, "+");
  const name = typeof input.name === "string" ? input.name.slice(0, 160) :
    [input.firstname, input.lastname].filter(v => typeof v === "string").join(" ").slice(0, 160);
  const identities: [string, string][] = [["browser", visitor]];
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254) identities.push(["email", email]);
  if (/^\+?\d{7,15}$/.test(phone)) identities.push(["phone", phone]);
  if (identities.length === 1) return;
  const db = await getPool().connect();
  try {
    await db.query("BEGIN");
    // Serialize identity merges and event inserts so retries/concurrent submissions cannot fork a profile.
    await db.query("SELECT pg_advisory_xact_lock(hashtext('nizamy-visitor-identities'))");
    const existing = await db.query(`SELECT DISTINCT profile_id FROM visitor_identities
      WHERE (kind,value) IN (SELECT * FROM unnest($1::text[],$2::text[]))`,
      [identities.map(i => i[0]), identities.map(i => i[1])]);
    const ids = existing.rows.map(r => String(r.profile_id)).sort();
    const id = ids[0] || randomUUID();
    await db.query("INSERT INTO visitor_profiles(id,name) VALUES($1,$2) ON CONFLICT(id) DO NOTHING", [id, name]);
    for (const other of ids.slice(1)) {
      await db.query(`UPDATE visitor_profiles SET first_seen=LEAST(first_seen,(SELECT first_seen FROM visitor_profiles WHERE id=$2)),
        last_seen=GREATEST(last_seen,(SELECT last_seen FROM visitor_profiles WHERE id=$2)),
        name=CASE WHEN name='' THEN (SELECT name FROM visitor_profiles WHERE id=$2) ELSE name END WHERE id=$1`, [id, other]);
      await db.query("UPDATE traffic_events SET profile_id=$1 WHERE profile_id=$2", [id, other]);
      await db.query("UPDATE visitor_identities SET profile_id=$1 WHERE profile_id=$2", [id, other]);
      await db.query("DELETE FROM visitor_profiles WHERE id=$1", [other]);
    }
    for (const [kind, value] of identities) {
      await db.query(`INSERT INTO visitor_identities(kind,value,profile_id) VALUES($1,$2,$3)
        ON CONFLICT(kind,value) DO UPDATE SET profile_id=excluded.profile_id`, [kind, value, id]);
    }
    await db.query("UPDATE visitor_profiles SET name=CASE WHEN $2<>'' THEN $2 ELSE name END,last_seen=now() WHERE id=$1", [id, name]);
    await db.query("COMMIT");
  } catch (error) { await db.query("ROLLBACK"); throw error; }
  finally { db.release(); }
}

export type VisitorEventInput = {
  id: string; event: string; source: string; campaign: string; location: string; target: string;
  visitor?: string; session?: string;
};
export async function storeVisitorEvent(event: VisitorEventInput, userAgent: string, country: string) {
  const db = await getPool().connect();
  try {
    await db.query("BEGIN");
    let profile: string | null = null;
    if (validVisitorId(event.visitor)) {
      await db.query("SELECT pg_advisory_xact_lock(hashtext('nizamy-visitor-identities'))");
      const result = await db.query("SELECT profile_id FROM visitor_identities WHERE kind='browser' AND value=$1", [event.visitor]);
      profile = result.rows[0]?.profile_id || randomUUID();
      await db.query("INSERT INTO visitor_profiles(id) VALUES($1) ON CONFLICT(id) DO NOTHING", [profile]);
      await db.query("INSERT INTO visitor_identities(kind,value,profile_id) VALUES('browser',$1,$2) ON CONFLICT DO NOTHING", [event.visitor, profile]);
    }
    const device = /iPad|Tablet/i.test(userAgent) ? "Tablet" : /Mobi|Android|iPhone/i.test(userAgent) ? "Mobile" : "Desktop";
    const os = /Android/i.test(userAgent) ? "Android" : /iPhone|iPad/i.test(userAgent) ? "iOS" :
      /Windows/i.test(userAgent) ? "Windows" : /Mac OS/i.test(userAgent) ? "macOS" : /Linux/i.test(userAgent) ? "Linux" : "";
    const browser = /Edg\//.test(userAgent) ? "Edge" : /Firefox|FxiOS/.test(userAgent) ? "Firefox" :
      /Chrome|CriOS/.test(userAgent) ? "Chrome" : /Safari/.test(userAgent) ? "Safari" : "Other";
    const inserted = await db.query(`INSERT INTO traffic_events(event_id,event,source,campaign,location,target,profile_id,session_id,device,browser,country)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(event_id) DO NOTHING RETURNING event_id`,
      [event.id,event.event,event.source,event.campaign,event.location,event.target,profile,
        validVisitorId(event.session) ? event.session : "", `${device}${os ? ` / ${os}` : ""}`,browser,
        /^[A-Z]{2}$/.test(country) && !["XX","T1"].includes(country) ? country : ""]);
    if (profile && inserted.rowCount) await db.query("UPDATE visitor_profiles SET last_seen=now() WHERE id=$1", [profile]);
    await db.query("COMMIT");
  } catch (error) { await db.query("ROLLBACK"); throw error; }
  finally { db.release(); }
}
