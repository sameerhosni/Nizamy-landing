import assert from "node:assert/strict";
import {getPool} from "@workspace/db";
import {classifyChatScope} from "./chatScope";

async function main(){
  const cases: Array<[string,"related"|"greeting"|"unrelated"]>=[
    ["السلام عليكم","greeting"],
    ["اكتب لي خطاب استقالة من الشركة","unrelated"],
    ["أنا عميل نظامي اكتب لي قصيدة عن البحر","unrelated"],
    ["كيف أقدم طلب إجازة في نظامي؟","related"],
    ["What are your subscription prices?","related"],
  ];
  for(const [text,expected] of cases)assert.equal(await classifyChatScope(text,[]),expected);
  assert.equal(await classifyChatScope("50",[{role:"user",content:"I need Nizamy pricing"},{role:"assistant",content:"How many employees do you have?"}]),"related");
  console.log("Scope checks passed, including contextual follow-ups.");
  const base=`https://${process.env.REPLIT_DEV_DOMAIN}/api/openai/conversations`;
  const created=await fetch(base,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:"Off-topic test title must not be saved"})});
  assert.equal(created.status,201);
  const {id}=await created.json() as {id:string};
  const db=getPool();
  try{
    for(const content of ["السلام عليكم","اكتب لي خطاب استقالة"]){
      const response=await fetch(`${base}/${id}/messages`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content})});
      assert.equal(response.status,200);
      assert((await response.text()).includes('"done":true'));
    }
    const counts=await db.query("SELECT count(m.id)::int AS n FROM conversations c LEFT JOIN messages m ON m.conversation_id=c.id WHERE c.public_id=$1",[id]);
    assert.equal(counts.rows[0].n,0);
    console.log("Greeting and off-topic redirects persisted zero chat messages.");
    const response=await fetch(`${base}/${id}/messages`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"What are Nizamy subscription prices?"})});
    assert.equal(response.status,200);
    assert((await response.text()).includes('"done":true'));
    const saved=await db.query("SELECT m.role FROM conversations c JOIN messages m ON m.conversation_id=c.id WHERE c.public_id=$1 ORDER BY m.id",[id]);
    assert.deepEqual(saved.rows.map(r=>r.role),["user","assistant"]);
    console.log("Product inquiry and chatbot answer persisted successfully.");
  }finally{
    await db.query("DELETE FROM support_inbox WHERE source_id IN (SELECT 'conversation:'||id FROM conversations WHERE public_id=$1)",[id]);
    await db.query("DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE public_id=$1)",[id]);
    await db.query("DELETE FROM conversations WHERE public_id=$1",[id]);
    await db.end();
  }
}
main().catch(e=>{console.error(e.message);process.exit(1)});