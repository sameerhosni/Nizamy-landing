import {Router} from "express";
import {getPool} from "@workspace/db";
import {assessHistoricalChat} from "../lib/chatScope";
import {staffEmail} from "../lib/supportAuth";
import {syncLocalInbox} from "../lib/supportInbox";
import {AssessSupportChatBody, AssessSupportChatParams, ReviewSupportChatBody, ReviewSupportChatParams} from "@workspace/api-zod";

const router = Router();

router.post("/inbox/:id/assess", async (req,res) => {
  if (!AssessSupportChatParams.safeParse(req.params).success || !AssessSupportChatBody.safeParse(req.body).success) {res.status(400).json({error:"Invalid review version"});return;}
  await syncLocalInbox();
  const db = getPool();
  const item = (await db.query("SELECT * FROM support_inbox WHERE id=$1 AND source='chat' AND source_id LIKE 'conversation:%'",[req.params.id])).rows[0];
  if (!item) {res.status(404).json({error:"Chat not found"});return;}
  if (item.relevance_version !== req.body.version) {res.status(409).json({error:"Conversation changed. Refresh and review again."});return;}
  const messages = (await db.query("SELECT role,content FROM messages WHERE conversation_id=$1 ORDER BY id",[item.source_id.slice("conversation:".length)])).rows;
  const assessment = await assessHistoricalChat(messages);
  await syncLocalInbox();
  const result = await db.query(`UPDATE support_inbox SET scope_assessment=$3,relevance_version=relevance_version+1
    WHERE id=$1 AND relevance_version=$2 RETURNING id`,[item.id,req.body.version,JSON.stringify(assessment)]);
  if (!result.rowCount) {res.status(409).json({error:"Conversation or review changed. Refresh and review again."});return;}
  res.json({assessment});
});

router.patch("/inbox/:id/relevance", async (req,res) => {
  const {decision,reason,version} = req.body ?? {};
  if (!ReviewSupportChatParams.safeParse(req.params).success || !ReviewSupportChatBody.safeParse(req.body).success ||
      typeof reason !== "string" || !reason.trim() || reason.length > 1000) {
    res.status(400).json({error:"Choose a relevance decision and enter a reason (up to 1000 characters)"});return;
  }
  await syncLocalInbox();
  const db = await getPool().connect();
  try {
    await db.query("BEGIN");
    const result = await db.query(`UPDATE support_inbox SET relevance=$3,relevance_reviewed_at=now(),relevance_version=relevance_version+1
      WHERE id=$1 AND relevance_version=$2 AND source='chat' AND source_id LIKE 'conversation:%' RETURNING id`,
      [req.params.id,version,decision]);
    if (!result.rowCount) {await db.query("ROLLBACK");res.status(409).json({error:"Chat or review changed. Refresh and review again."});return;}
    await db.query("INSERT INTO support_relevance_audit(inbox_id,decision,reason,reviewed_by) VALUES($1,$2,$3,$4)",[req.params.id,decision,reason.trim(),staffEmail]);
    await db.query("COMMIT");
    res.json({ok:true});
  } catch(error) {await db.query("ROLLBACK");throw error;} finally {db.release();}
});

router.get("/inbox/:id/relevance-history",async(req,res)=>{
  if (!/^\d+$/.test(String(req.params.id))) {res.status(400).json({error:"Invalid chat"});return;}
  res.json({history:(await getPool().query(`SELECT decision,reason,reviewed_at AS "reviewedAt"
    FROM support_relevance_audit WHERE inbox_id=$1 ORDER BY id DESC`,[req.params.id])).rows});
});
export default router;