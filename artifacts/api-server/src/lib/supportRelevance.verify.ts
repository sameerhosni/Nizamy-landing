/**
 * Development-only API regression checks, using isolated fixtures and no mailbox calls.
 * NODE_ENV=development pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/src/lib/supportRelevance.verify.ts
 */
import assert from "node:assert/strict";
import {createHash,randomBytes,randomUUID} from "node:crypto";
import express from "express";
import {getPool} from "@workspace/db";
import supportRouter from "../routes/support";
import {staffEmail} from "./supportAuth";
import {assessHistoricalChat} from "./chatScope";

async function main() {
  assert.equal(process.env.NODE_ENV,"development","Only run against development");
  const db=getPool();
  const token=randomBytes(32).toString("hex");
  const digest=createHash("sha256").update(token).digest("hex");
  const fixture=`relevance-regression-${randomUUID()}`;
  let conversation:number|undefined;
  let inbox:number|undefined;
  let caseId:number|undefined;
  const app=express();
  app.use(express.json());
  app.use("/support",supportRouter);
  const server=app.listen(0,"127.0.0.1");
  await new Promise<void>(resolve=>server.once("listening",resolve));
  const address=server.address();
  assert(address && typeof address!=="string");
  const base=`http://127.0.0.1:${address.port}/support`;
  async function request(path:string, method="GET",body?:unknown, auth=true, header=true) {
    return fetch(base+path,{method,headers:{
      ...(auth?{cookie:`nz_staff=${token}`} : {}),
      ...(header?{"X-Support-Request":"1"}:{}),
      "Content-Type":"application/json",
    },body:body===undefined?undefined:JSON.stringify(body)});
  }
  async function list(view="active") {
    const result=await request(`/inbox?view=${view}`);
    assert.equal(result.status,200);
    return ((await result.json()) as {items:Array<any>}).items;
  }
  async function item(view="active") {
    const row=(await list(view)).find(i=>i.sourceId===`conversation:${conversation}`);
    assert(row);
    inbox=row.id;
    return row;
  }
  try {
    await db.query("INSERT INTO support_sessions(token_hash,email,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[digest,staffEmail]);
    conversation=(await db.query("INSERT INTO conversations(title) VALUES($1) RETURNING id",[fixture])).rows[0].id;
    await db.query("INSERT INTO messages(conversation_id,role,content) VALUES($1,'user',$2),($1,'assistant','Please clarify')",[conversation,`${fixture}: Write a resignation letter`]);
    let current=await item("review");
    assert.equal(current.relevance,"pending");
    assert(!(await list()).some(i=>i.id===inbox),"Unreviewed legacy chats must not appear in teaching");
    assert.equal((await request(`/inbox/${inbox}/case`,"POST",{})).status,409,"Pending chat cannot create teaching guidance");
    caseId=(await db.query("INSERT INTO support_cases(title,resolution,status) VALUES($1,'Preserved approved answer','approved') RETURNING id",[fixture])).rows[0].id;
    await db.query("UPDATE support_inbox SET case_id=$2 WHERE id=$1",[inbox,caseId]);
    const path=`/inbox/${inbox}/relevance`;
    const decision={decision:"excluded",reason:"Unrelated writing request",version:current.relevanceVersion};
    assert.equal((await request(path,"PATCH",decision,false)).status,401);
    assert.equal((await request(path,"PATCH",decision,true,false)).status,403);
    assert.equal((await request(path,"PATCH",{...decision,decision:"delete"})).status,400);
    assert.equal((await request(path,"PATCH",{...decision,reason:"  "})).status,400);
    assert.equal((await request(path,"PATCH",decision)).status,200);
    assert(!(await list()).some(i=>i.id===inbox));
    assert(!(await list("review")).some(i=>i.id===inbox));
    current=await item("excluded");
    assert.equal(current.relevance,"excluded");
    assert.equal((await request(path,"PATCH",decision)).status,409,"Stale decisions must not overwrite newer reviews");
    assert.equal((await request(`/inbox/${inbox}/case`,"POST",{})).status,200,"Existing guidance remains accessible");
    assert.equal((await db.query("SELECT count(*)::int AS n FROM messages WHERE conversation_id=$1",[conversation])).rows[0].n,2);
    assert.deepEqual((await db.query("SELECT status,resolution FROM support_cases WHERE id=$1",[caseId])).rows[0],{status:"approved",resolution:"Preserved approved answer"});
    // Restoration survives sync and maintains existing status/linkage.
    assert.equal((await request(path,"PATCH",{decision:"pending",reason:"Restore for manual review",version:current.relevanceVersion})).status,200);
    current=await item("review");
    assert.equal(current.caseId,caseId);
    assert(!(await list()).some(i=>i.id===inbox),"Restoration returns to review, not teaching");
    assert.equal((await request(path,"PATCH",{decision:"related",reason:"Staff confirmation",version:current.relevanceVersion})).status,200);
    assert(!(await list("review")).some(i=>i.id===inbox));
    current=await item();
    assert.equal(current.relevance,"related");
    // Re-exclude, then add a real product request: sync must bring it back for review.
    assert.equal((await request(path,"PATCH",{decision:"excluded",reason:"Correction",version:current.relevanceVersion})).status,200);
    current=await item("excluded");
    await db.query("UPDATE support_inbox SET scope_assessment=$2 WHERE id=$1",[inbox,JSON.stringify({scope:"unrelated",confidence:"high",reason:"Fixture assessment"})]);
    await db.query("INSERT INTO messages(conversation_id,role,content) VALUES($1,'user','What are your Nizamy subscription prices?')",[conversation]);
    assert.equal((await request(path,"PATCH",{decision:"excluded",reason:"Stale transcript",version:current.relevanceVersion})).status,409);
    current=await item("review");
    assert.equal(current.scopeAssessment,null);
    assert.equal(current.relevanceReviewedAt,null);
    assert.equal(current.caseId,caseId);
    assert(current.context.includes("subscription prices"));
    assert(!(await list()).some(i=>i.id===inbox),"Changed chats return to review, away from teaching");
    const history=await request(`/inbox/${inbox}/relevance-history`);
    const audit=((await history.json()) as {history:Array<{decision:string}>}).history;
    assert.deepEqual(audit.map((a:any)=>a.decision),["excluded","related","pending","excluded"]);
    // Without a linked case, excluded records cannot create new teaching guidance.
    await db.query("UPDATE support_inbox SET case_id=NULL WHERE id=$1",[inbox]);
    assert.equal((await request(path,"PATCH",{decision:"excluded",reason:"Check conversion guard",version:current.relevanceVersion})).status,200);
    assert.equal((await request(`/inbox/${inbox}/case`,"POST",{})).status,409);
    // Oversized/empty transcripts are explicitly uncertain, never silently truncated.
    assert.equal((await assessHistoricalChat([])).scope,"uncertain");
    assert.equal((await assessHistoricalChat([{role:"user",content:"x".repeat(60001)}])).confidence,"low");
    console.info("Relevance regression checks passed: auth, validation, exclude/restore, concurrency, transcript changes, audit, preservation and uncertainty.");
  } finally {
    if(inbox) {
      await db.query("DELETE FROM support_relevance_audit WHERE inbox_id=$1",[inbox]);
      await db.query("DELETE FROM support_inbox WHERE id=$1",[inbox]);
    }
    if(conversation) {
      await db.query("DELETE FROM messages WHERE conversation_id=$1",[conversation]);
      await db.query("DELETE FROM conversations WHERE id=$1",[conversation]);
    }
    if(caseId)await db.query("DELETE FROM support_cases WHERE id=$1",[caseId]);
    await db.query("DELETE FROM support_sessions WHERE token_hash=$1",[digest]);
    await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));
    await db.end();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});