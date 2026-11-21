import assert from "node:assert/strict";
import {getPool} from "@workspace/db";
import {syncLocalInbox, syncEmailInbox} from "./supportInbox";

async function main() {
  await syncLocalInbox();
  await syncLocalInbox();
  const db=getPool();
  const source=await db.query("SELECT count(DISTINCT conversation_id)::int AS n FROM messages WHERE role='user'");
  const grouped=await db.query("SELECT count(*)::int AS n FROM support_inbox WHERE source_id LIKE 'conversation:%'");
  assert.equal(grouped.rows[0].n,source.rows[0].n);
  const incomplete=await db.query(`SELECT count(*)::int AS n FROM support_inbox i
    JOIN (SELECT conversation_id,string_agg(role||': '||content,E'\\n\\n' ORDER BY id) AS transcript
    FROM messages GROUP BY conversation_id) m ON i.source_id='conversation:'||m.conversation_id
    WHERE i.context<>m.transcript`);
  assert.equal(incomplete.rows[0].n,0);
  console.log("Conversation grouping, full transcripts and repeat-sync checks passed:",grouped.rows[0].n);
  console.log("Email threads imported:",await syncEmailInbox());
  const classified=await db.query(`SELECT count(*) FILTER(WHERE title='[excluded]')::int AS excluded,
    count(*) FILTER(WHERE title<>'[excluded]')::int AS relevant FROM support_inbox WHERE source_id LIKE 'email-thread:%'`);
  console.log("Email classification counts:",classified.rows[0]);
  await db.end();
}
main().catch(error=>{console.error(error.message);process.exit(1);});