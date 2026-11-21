import {Router} from "express";
import {getPool} from "@workspace/db";
import {EmailSyncInProgressError,syncLocalInbox,syncEmailInbox} from "../lib/supportInbox";
import relevanceRouter from "./supportRelevance";
import objectivesRouter from "./supportObjectives";
const router=Router();
router.use(relevanceRouter);
router.use(objectivesRouter);
const fields=`id,source,source_id AS "sourceId",title,question,context,status,case_id AS "caseId",created_at AS "createdAt",relevance,relevance_version AS "relevanceVersion",scope_assessment AS "scopeAssessment",relevance_reviewed_at AS "relevanceReviewedAt"`;
router.get("/inbox",async(req,res)=>{
  const view=req.query.view??"active";
  if(!["active","excluded","review"].includes(String(view))){res.status(400).json({error:"Invalid inbox view"});return;}
  let localSynced=true;
  try { await syncLocalInbox(); }
  catch {
    localSynced=false;
    req.log.warn({phase:"local_sync"},"Support inbox refresh failed; reading saved questions");
  }
  res.json({localSynced,items:(await getPool().query(`SELECT ${fields} FROM support_inbox
    WHERE (source IN ('manual','ticket') OR (source='chat' AND source_id LIKE 'conversation:%')
    OR (source='email' AND source_id LIKE 'email-thread:%' AND title<>'[excluded]'))
    AND (($1='active' AND (source<>'chat' OR relevance='related')) OR ($1='excluded' AND source='chat' AND relevance='excluded')
      OR ($1='review' AND source='chat' AND relevance='pending'))
    ORDER BY created_at DESC`,[view])).rows});
});
let syncing=false;
router.post("/inbox/sync",async(req,res)=>{
  if(syncing){res.status(409).json({error:"Mailbox synchronization already running"});return;}
  syncing=true;
  try{
    await syncLocalInbox();
    try {
      res.json({imported:await syncEmailInbox(),localSynced:true,emailSynced:true});
    } catch(error) {
      if(error instanceof EmailSyncInProgressError){
        res.status(409).json({error:error.message});return;
      }
      // Local questions remain usable even if the independent mail import fails.
      // Do not expose connector errors, tokens, or message contents to the client.
      const mailboxStatus=error instanceof Error
        ? /^Mailbox access failed \((\d{3})\)$/.exec(error.message)?.[1]
        : undefined;
      req.log.warn({phase:"email_sync",mailboxStatus:mailboxStatus?Number(mailboxStatus):undefined},
        "Support source sync partially completed");
      res.json({imported:null,localSynced:true,emailSynced:false});
    }
  }
  finally{syncing=false;}
});
router.post("/inbox",async(req,res)=>{
  const {title,question}=req.body??{};
  if(typeof title!=="string"||!title.trim()||title.length>200||typeof question!=="string"||!question.trim()||question.length>20000){res.status(400).json({error:"Enter a title and question"});return;}
  const {rows}=await getPool().query(`INSERT INTO support_inbox(source,title,question) VALUES('manual',$1,$2) RETURNING ${fields}`,[title,question]);
  res.status(201).json({item:rows[0]});
});
router.patch("/inbox/:id",async(req,res)=>{
  if(!/^\d+$/.test(String(req.params.id))||!["new","reviewed","resolved"].includes(req.body?.status)){res.status(400).json({error:"Invalid status"});return;}
  const {rows}=await getPool().query(`UPDATE support_inbox SET status=$2 WHERE id=$1 RETURNING ${fields}`,[req.params.id,req.body.status]);
  if(!rows.length){res.status(404).json({error:"Question not found"});return;}
  res.json({item:rows[0]});
});
router.post("/inbox/:id/case",async(req,res)=>{
  if(!/^\d+$/.test(String(req.params.id))){res.status(400).json({error:"Invalid question"});return;}
  await syncLocalInbox();
  const db=await getPool().connect();
  try{
    await db.query("BEGIN");
    const {rows}=await db.query("SELECT * FROM support_inbox WHERE id=$1 FOR UPDATE",[req.params.id]);
    const item=rows[0];
    if(!item){await db.query("ROLLBACK");res.status(404).json({error:"Question not found"});return;}
    if(item.source==='chat' && item.relevance!=='related' && !item.case_id){await db.query("ROLLBACK");res.status(409).json({error:"Confirm this chat is a Nizamy product inquiry before creating guidance"});return;}
    let id=item.case_id;
    if(!id){
      const result=await db.query(`INSERT INTO support_cases(title,diagnostic_questions,source,source_id) VALUES($1,$2,$3,$4) RETURNING id`,[item.title,`Customer question (remove identifying details before approving):\n${item.question}`.slice(0,10000),item.source==="email"?"email":"manual",`inbox:${item.id}`]);
      id=result.rows[0].id;
      await db.query("UPDATE support_inbox SET case_id=$2,status='reviewed' WHERE id=$1",[item.id,id]);
    }
    const result=await db.query(`SELECT id,title,keywords,diagnostic_questions AS "diagnosticQuestions",resolution,status,source,source_id AS "sourceId",updated_at AS "updatedAt" FROM support_cases WHERE id=$1`,[id]);
    await db.query("COMMIT");res.json({case:result.rows[0]});
  }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
});
export default router;
