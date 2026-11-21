import { createHash, randomBytes, randomInt, createHmac } from "node:crypto";
import { getPool } from "@workspace/db";
import type { Request, Response, NextFunction } from "express";
import { sendStaffLoginCode } from "./mailer";

export const staffEmail = "sales@nizamy.app";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const codeHash = (code: string) => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required for staff sign-in");
  return createHmac("sha256", secret).update(code).digest("hex");
};
export async function requestCode(req: Request, res: Response) {
  if (typeof req.body?.email !== "string" || req.body.email.trim().toLowerCase() !== staffEmail) {
    res.status(403).json({ error: "Staff access only" }); return;
  }
  const code = String(randomInt(100000, 1000000));
  const digest = codeHash(code);
  // One shared database throttle across all instances. Sending failure does not bypass it.
  const result = await getPool().query(`
    INSERT INTO support_login (email, code_hash, expires_at, requested_at, attempts)
    VALUES ($1,$2,now()+interval '10 minutes',now(),0)
    ON CONFLICT (email) DO UPDATE SET code_hash=$2,
      expires_at=now()+interval '10 minutes', requested_at=now(), attempts=0
    WHERE support_login.requested_at < now()-interval '5 minutes'
    RETURNING email`, [staffEmail, digest]);
  if (!result.rowCount) { res.status(429).json({ error: "Wait five minutes before requesting another code" }); return; }
  await sendStaffLoginCode(staffEmail, code);
  res.json({ sent: true });
}
export async function verifyCode(req: Request, res: Response) {
  const { email, code } = req.body ?? {};
  if (typeof email !== "string" || email.trim().toLowerCase() !== staffEmail ||
      typeof code !== "string" || !/^\d{6}$/.test(code)) {
    res.status(400).json({ error: "Invalid email or code" }); return;
  }
  const db = await getPool().connect();
  try {
    await db.query("BEGIN");
    const { rows } = await db.query("SELECT * FROM support_login WHERE email=$1 FOR UPDATE", [staffEmail]);
    const row = rows[0];
    if (!row || row.attempts >= 5 || new Date(row.expires_at).getTime() <= Date.now()) {
      await db.query("COMMIT"); res.status(401).json({ error: "Code invalid or expired" }); return;
    }
    await db.query("UPDATE support_login SET attempts=attempts+1 WHERE email=$1", [staffEmail]);
    if (row.code_hash !== codeHash(code)) {
      await db.query("COMMIT"); res.status(401).json({ error: "Code invalid or expired" }); return;
    }
    const token = randomBytes(32).toString("hex");
    await db.query("UPDATE support_login SET attempts=5 WHERE email=$1", [staffEmail]);
    await db.query("DELETE FROM support_sessions WHERE expires_at<now()");
    await db.query("INSERT INTO support_sessions (token_hash,email,expires_at) VALUES ($1,$2,now()+interval '3 days')", [hash(token),staffEmail]);
    await db.query("COMMIT");
    res.cookie("nz_staff", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/api/support", maxAge: 3*24*3600*1000 });
    res.json({ email: staffEmail });
  } catch (e) { await db.query("ROLLBACK"); throw e; } finally { db.release(); }
}
function token(req: Request) {
  return /(?:^|;\s*)nz_staff=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie ?? "")?.[1];
}
export async function session(req: Request) {
  const value = token(req);
  if (!value) return null;
  const { rows } = await getPool().query("SELECT email FROM support_sessions WHERE token_hash=$1 AND expires_at>now()", [hash(value)]);
  return rows[0]?.email === staffEmail ? staffEmail : null;
}
export async function logout(req: Request, res: Response) {
  const value = token(req);
  if (value) await getPool().query("DELETE FROM support_sessions WHERE token_hash=$1", [hash(value)]);
  res.clearCookie("nz_staff", { path: "/api/support", secure: true, sameSite: "strict", httpOnly:true });
  res.json({ ok:true });
}
export async function requireStaff(req: Request,res: Response,next: NextFunction) {
  if (!await session(req)) { res.status(401).json({error:"Staff sign-in required"}); return; }
  next();
}