// Opt-in against the running development server; creates and removes only unique fixtures.
import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { getPool } from "@workspace/db";
import { sourceFingerprint } from "./supportGaps";

if (process.env.RUN_SUPPORT_GAP_INTEGRATION !== "1") throw new Error("Opt-in required");
const dev = new URL(process.env.DATABASE_URL!);
const prod = process.env.NIZAMY_PRODUCTION_DATABASE_URL ? new URL(process.env.NIZAMY_PRODUCTION_DATABASE_URL) : null;
assert(prod && (dev.hostname !== prod.hostname || dev.pathname !== prod.pathname), "Development database identity must differ from production");
const pool = getPool();
const token = randomBytes(32).toString("hex");
const hash = createHash("sha256").update(token).digest("hex");
const marker = `GAP_CHECK_${randomBytes(8).toString("hex")}`;
const inboxIds: number[] = [];
const objectiveIds: number[] = [];
const caseIds: number[] = [];
const base = "http://localhost:8080/api/support";
async function api(path: string, body?: unknown, status = 200): Promise<any> {
  const res = await fetch(base + path, {method: body === undefined ? "GET" : "POST",
    headers: {Cookie:`nz_staff=${token}`,"X-Support-Request":"1","Content-Type":"application/json"},
    body: body === undefined ? undefined : JSON.stringify(body)});
  const data = await res.json();
  assert.equal(res.status,status,`Unexpected response for ${path}: ${JSON.stringify(data)}`);
  return data;
}
try {
  await pool.query("INSERT INTO support_sessions(token_hash,email,expires_at) VALUES($1,'sales@nizamy.app',now()+interval '10 minutes')",[hash]);
  for (const question of ["Why are my Nizamy reward points not increasing?", "رصيدي في نقاط نظامي ثابت رغم الاستخدام"]) {
    const r = await api("/inbox",{title:marker,question},201);
    inboxIds.push(r.item.id);
  }
  const question = "Why are my Nizamy reward points not increasing?";
  const fingerprint = sourceFingerprint({question,context:""});
  const input = {title:`${marker} Reward points not increasing`,question,evidence:"Staff reviewed: the response has no steps for earning points.",state:"confirmed",fingerprint};
  const first = await api(`/inbox/${inboxIds[0]}/gaps`,input);
  objectiveIds.push(first.objectiveId);
  await api(`/inbox/${inboxIds[0]}/gaps`,input); // retries count once
  await api(`/inbox/${inboxIds[0]}/gaps`,{...input,evidence:""},400);
  await api(`/inbox/${inboxIds[0]}/gaps`,{...input,fingerprint:"stale"},409);
  const secondQuestion = "رصيدي في نقاط نظامي ثابت رغم الاستخدام";
  const second = {...input,title:undefined,objectiveId:first.objectiveId,question:secondQuestion,
    fingerprint:sourceFingerprint({question:secondQuestion,context:""}),state:"suggested"};
  await api(`/inbox/${inboxIds[1]}/gaps`,second);
  const getObjective = async () => (await api("/objectives")).objectives.find((o: {id:number}) => o.id === first.objectiveId);
  let objective = await getObjective();
  assert.equal(objective.confirmedCount,1);
  assert.equal(objective.suggestedCount,1);
  const draft = await api(`/objectives/${first.objectiveId}/guidance`,{});
  caseIds.push(draft.case.id);
  assert.equal(draft.case.status,"draft");
  assert.equal(draft.case.resolution,"");
  assert.equal(draft.case.diagnosticQuestions,"");
  assert.equal((await api(`/objectives/${first.objectiveId}/guidance`,{})).case.id,draft.case.id);
  await api(`/objectives/${first.objectiveId}/guidance`,{caseId:draft.case.id},409);
  const approved = (await pool.query("INSERT INTO support_cases(title,resolution,status) VALUES($1,'Synthetic approved instruction','approved') RETURNING id",[marker])).rows[0];
  caseIds.push(approved.id);
  await api(`/objectives/${first.objectiveId}/guidance`,{caseId:approved.id});
  assert.equal((await getObjective()).confirmedCount,1,"Linking must not resolve a gap");
  await api(`/inbox/${inboxIds[1]}/gaps`,{...second,state:"confirmed"});
  assert.equal((await getObjective()).confirmedCount,2);
  await api(`/inbox/${inboxIds[0]}/gaps`,{...input,objectiveId:first.objectiveId,state:"resolved",evidence:"Staff verified the new guidance covers this question."});
  assert.equal((await getObjective()).confirmedCount,1);
  await pool.query("UPDATE support_inbox SET context='A new reply arrived' WHERE id=$1",[inboxIds[1]]);
  objective = await getObjective();
  assert.equal(objective.confirmedCount,0);
  assert.equal(objective.suggestedCount,1);
  assert.equal(objective.gaps.find((g: {inboxId:number}) => g.inboxId===inboxIds[1]).stale,true);
  await api(`/inbox/${inboxIds[1]}/gaps`,{...second,state:"confirmed"},409);
  const inbox = (await pool.query("SELECT status,case_id FROM support_inbox WHERE id=ANY($1::int[])",[inboxIds])).rows;
  assert(inbox.every(i => i.status==="new" && i.case_id===null),"Gap writes must not alter inbox review or links");
  assert((await pool.query("SELECT count(*)::int AS n FROM support_gap_history h JOIN support_gap_evidence g ON g.id=h.gap_id WHERE g.objective_id=$1",[first.objectiveId])).rows[0].n >= 5);
  assert.equal((await fetch(base+"/objectives")).status,401);
  assert.equal((await fetch(base+`/objectives/${first.objectiveId}/guidance`,{method:"POST",headers:{Cookie:`nz_staff=${token}`}})).status,403);
  console.log("Support objective persistence, counts, draft reuse, approval links, evidence, stale-source guards and authorization passed");
} finally {
  await pool.query("DELETE FROM support_gap_history WHERE gap_id IN (SELECT id FROM support_gap_evidence WHERE inbox_id=ANY($1::int[]))",[inboxIds]);
  await pool.query("DELETE FROM support_gap_evidence WHERE inbox_id=ANY($1::int[])",[inboxIds]);
  await pool.query("DELETE FROM support_objectives WHERE id=ANY($1::int[])",[objectiveIds]);
  await pool.query("DELETE FROM support_cases WHERE id=ANY($1::int[])",[caseIds]);
  await pool.query("DELETE FROM support_inbox WHERE id=ANY($1::int[])",[inboxIds]);
  await pool.query("DELETE FROM support_sessions WHERE token_hash=$1",[hash]);
  await pool.end();
}
