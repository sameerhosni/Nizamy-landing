import { Router } from "express";
import { getPool } from "@workspace/db";
import { requestCode, verifyCode, requireStaff, session, logout } from "../lib/supportAuth";
import { importSupportReplies } from "../lib/supportImport";
import inboxRouter from "./supportInbox";
import repliesRouter from "./supportReplies";
import { trafficReportRouter } from "./traffic";
import { visitorsRouter } from "./visitors";
import { previewSupportReply, validPreviewInput } from "../lib/supportPreview";

const router = Router();
router.use((req,res,next)=>{
  res.setHeader("Cache-Control","no-store");
  if (req.method !== "GET" && req.get("X-Support-Request") !== "1") {
    res.status(403).json({error:"Invalid request"}); return;
  }
  next();
});
router.get("/session",async(req,res)=>{res.json({email:await session(req)});});
router.post("/login",requestCode);
router.post("/verify",verifyCode);
router.post("/logout",logout);
router.use(requireStaff);
router.post("/preview", async (req, res) => {
  if (!validPreviewInput(req.body)) {
    res.status(400).json({ error: "Invalid preview. Question: 1–4000 characters; title: 1–200; instruction fields: at most 10000 each; resolution required." });
    return;
  }
  try {
    res.json(await previewSupportReply(req.body));
  } catch {
    // Do not log temporary questions, instructions, or provider error payloads.
    res.status(503).json({ error: "Preview temporarily unavailable. Please retry." });
  }
});
router.use(visitorsRouter);
router.use(trafficReportRouter);
router.use(repliesRouter);
router.use(inboxRouter);
const fields=`id,title,keywords,diagnostic_questions AS "diagnosticQuestions",resolution,status,source,source_id AS "sourceId",updated_at AS "updatedAt"`;
router.get("/cases",async(_req,res)=>{
  res.json({cases:(await getPool().query(`SELECT ${fields} FROM support_cases ORDER BY updated_at DESC`)).rows});
});
router.get("/tickets",async(_req,res)=>{
  res.json({tickets:(await getPool().query(`SELECT id,ticket_number AS "ticketNumber",email,name,subject,summary,transcript,language,created_at AS "createdAt" FROM tickets ORDER BY created_at DESC LIMIT 200`)).rows});
});
router.post("/cases",async(req,res)=>{
  const b=req.body;
  if (!b || typeof b.title!=="string" || !b.title.trim() || b.title.length>200 ||
      ["keywords","diagnosticQuestions","resolution"].some(k=>typeof b[k]!=="string"||b[k].length>10000) ||
      !["draft","approved"].includes(b.status ?? "draft") ||
      (b.status==="approved" && (b.reviewed!==true || !b.resolution.trim()))) {
    res.status(400).json({error:"Invalid case"});return;
  }
  const {rows}=await getPool().query(`INSERT INTO support_cases(title,keywords,diagnostic_questions,resolution,status) VALUES($1,$2,$3,$4,$5) RETURNING ${fields}`,[b.title,b.keywords,b.diagnosticQuestions,b.resolution,b.status ?? "draft"]);
  res.status(201).json({case:rows[0]});
});
router.put("/cases/:id",async(req,res)=>{
  const b=req.body;
  if (!/^\d+$/.test(String(req.params.id)) || !b || typeof b.title!=="string" || !b.title.trim() || b.title.length>200 ||
    ["keywords","diagnosticQuestions","resolution"].some(k=>typeof b[k]!=="string"||b[k].length>10000) ||
    !["draft","approved","disabled"].includes(b.status) ||
    (b.status==="approved" && (b.reviewed!==true || !b.resolution.trim()))) {res.status(400).json({error:"Invalid case or approval not confirmed"});return;}
  const {rows}=await getPool().query(`UPDATE support_cases SET title=$2,keywords=$3,diagnostic_questions=$4,resolution=$5,status=$6,updated_at=now() WHERE id=$1 RETURNING ${fields}`,[req.params.id,b.title,b.keywords,b.diagnosticQuestions,b.resolution,b.status]);
  if (!rows.length){res.status(404).json({error:"Case not found"});return;}
  res.json({case:rows[0]});
});
router.post("/cases/:id/feedback",async(req,res)=>{
  if (!/^\d+$/.test(String(req.params.id)) || typeof req.body?.helpful!=="boolean" || typeof req.body?.comment!=="string" || !req.body.comment.trim() || req.body.comment.length>4000) {res.status(400).json({error:"Invalid feedback"});return;}
  await getPool().query("INSERT INTO support_feedback(case_id,comment,helpful) VALUES($1,$2,$3)",[req.params.id,req.body.comment,req.body.helpful]);
  res.json({ok:true});
});
router.get("/feedback",async(_req,res)=>{
  res.json({feedback:(await getPool().query(`SELECT id,case_id AS "caseId",comment,helpful,created_at AS "createdAt" FROM support_feedback ORDER BY created_at DESC LIMIT 500`)).rows});
});
router.post("/import",async(_req,res)=>{res.json({imported:await importSupportReplies()});});
router.use((err:unknown,req:import("express").Request,res:import("express").Response,_next:import("express").NextFunction)=>{
  req.log.error({err},"Support portal request failed");
  res.status(503).json({error:"Support service temporarily unavailable"});
});
export default router;
