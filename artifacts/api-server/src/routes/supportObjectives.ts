import { Router } from "express";
import { getPool } from "@workspace/db";
import { syncLocalInbox } from "../lib/supportInbox";
import { effectiveGapState, isGapSourceEligible, sourceFingerprint } from "../lib/supportGaps";
import { selectSupportGuidance } from "../lib/supportSemanticMatching";

const router = Router();
const caseFields = `id,title,keywords,diagnostic_questions AS "diagnosticQuestions",resolution,status,source,source_id AS "sourceId",updated_at AS "updatedAt"`;
const validId = (id: unknown) => /^\d+$/.test(String(id));
const text = (v: unknown, max: number): v is string => typeof v === "string" && !!v.trim() && v.length <= max;

router.get("/objectives", async (_req, res) => {
  await syncLocalInbox();
  const db = getPool();
  const objectives = (await db.query(`SELECT o.id,o.title,o.case_id AS "caseId",c.title AS "guidanceTitle",c.status AS "guidanceStatus"
    FROM support_objectives o LEFT JOIN support_cases c ON c.id=o.case_id ORDER BY o.id DESC`)).rows;
  const rows = (await db.query(`SELECT g.*,i.source,i.source_id,i.title,i.question AS source_question,i.context,i.relevance
    FROM support_gap_evidence g JOIN support_inbox i ON i.id=g.inbox_id ORDER BY g.reviewed_at DESC`)).rows;
  const gaps = rows.map(row => {
    const item = { ...row, question: row.source_question };
    const stale = row.source_fingerprint !== sourceFingerprint(item) || !isGapSourceEligible(item);
    return { id: row.id, inboxId: row.inbox_id, objectiveId: row.objective_id, question: row.question,
      evidence: row.evidence, state: effectiveGapState(row, item), recordedState: row.state, stale,
      reviewedAt: row.reviewed_at, source: row.source, sourceId: row.source_id, context: row.context || row.source_question,
      fingerprint: sourceFingerprint(item), eligible: isGapSourceEligible(item) };
  });
  res.json({ objectives: objectives.map(o => ({ ...o, gaps: gaps.filter(g => g.objectiveId === o.id),
    confirmedCount: gaps.filter(g => g.objectiveId === o.id && g.state === "confirmed").length,
    suggestedCount: gaps.filter(g => g.objectiveId === o.id && g.state === "suggested").length,
  })).sort((a,b) => b.confirmedCount - a.confirmedCount || b.suggestedCount - a.suggestedCount) });
});

// Suggestions only: neither AI retrieval nor lack of an approved answer proves a gap.
router.post("/inbox/:id/objective-suggestions", async (req, res) => {
  if (!validId(req.params.id) || !text(req.body?.question, 4000)) { res.status(400).json({error:"Enter the specific customer question"}); return; }
  await syncLocalInbox();
  const db = getPool();
  const item = (await db.query("SELECT * FROM support_inbox WHERE id=$1", [req.params.id])).rows[0];
  if (!item) { res.status(404).json({error:"Question not found"}); return; }
  if (!isGapSourceEligible(item)) { res.status(409).json({error:"Confirm product relevance before assessing a gap"}); return; }
  const objectives = (await db.query("SELECT id,title,created_at AS updated_at FROM support_objectives ORDER BY id DESC")).rows;
  const approved = (await db.query("SELECT * FROM support_cases WHERE status='approved' ORDER BY updated_at DESC")).rows;
  let matches: {id: number | string; title: string}[] = [];
  let guidance: {id: number | string; title: string}[] = [];
  let matchingError: string | undefined;
  try {
    [matches, guidance] = await Promise.all([
      selectSupportGuidance(objectives.map(o => ({...o,keywords:"",diagnostic_questions:"",resolution:o.title})), req.body.question),
      selectSupportGuidance(approved, req.body.question),
    ]);
  } catch (err) {
    req.log.warn({err}, "Support objective matching unavailable");
    matchingError = "Meaning-based matching is unavailable. Select an objective manually; no conclusion about missing guidance was made.";
  }
  res.json({ fingerprint: sourceFingerprint(item), objectives: matches.map(o => ({id:o.id,title:o.title})),
    guidance: guidance.map(c => ({id:c.id,title:c.title})), context: item.context || item.question, matchingError });
});

router.post("/inbox/:id/gaps", async (req, res) => {
  const b = req.body;
  if (!validId(req.params.id) || !text(b?.question,4000) || !text(b?.evidence,4000) ||
    !["suggested","confirmed","resolved","dismissed"].includes(b?.state) || !text(b?.fingerprint,64) ||
    (b.objectiveId != null ? !validId(b.objectiveId) : !text(b.title,200))) {
    res.status(400).json({error:"Provide an objective, question, evidence and state"}); return;
  }
  await syncLocalInbox();
  const db = await getPool().connect();
  try {
    await db.query("BEGIN");
    const item = (await db.query("SELECT * FROM support_inbox WHERE id=$1 FOR UPDATE",[req.params.id])).rows[0];
    if (!item) { await db.query("ROLLBACK"); res.status(404).json({error:"Question not found"}); return; }
    if (sourceFingerprint(item) !== b.fingerprint || (["confirmed","suggested"].includes(b.state) && !isGapSourceEligible(item))) {
      await db.query("ROLLBACK"); res.status(409).json({error:"Conversation or relevance changed. Reload and review the current evidence."}); return;
    }
    let objectiveId = b.objectiveId;
    if (objectiveId) {
      if (!(await db.query("SELECT id FROM support_objectives WHERE id=$1",[objectiveId])).rowCount) {
        await db.query("ROLLBACK"); res.status(404).json({error:"Objective not found"}); return;
      }
    } else {
      // Serialize creation and reuse exact names on retries, without merging different meanings.
      await db.query("SELECT pg_advisory_xact_lock(hashtext($1))",["support-objective-create"]);
      objectiveId = (await db.query("SELECT id FROM support_objectives WHERE lower(title)=lower($1) ORDER BY id LIMIT 1",[b.title.trim()])).rows[0]?.id;
      if (!objectiveId) objectiveId = (await db.query("INSERT INTO support_objectives(title) VALUES($1) RETURNING id",[b.title.trim()])).rows[0].id;
    }
    const gap = (await db.query(`INSERT INTO support_gap_evidence(inbox_id,objective_id,state,question,evidence,source_fingerprint)
      VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(inbox_id,objective_id) DO UPDATE SET
      state=excluded.state,question=excluded.question,evidence=excluded.evidence,source_fingerprint=excluded.source_fingerprint,reviewed_at=now()
      RETURNING id`,[item.id,objectiveId,b.state,b.question.trim(),b.evidence.trim(),b.fingerprint])).rows[0];
    await db.query(`INSERT INTO support_gap_history(gap_id,state,question,evidence,source_fingerprint) VALUES($1,$2,$3,$4,$5)`,
      [gap.id,b.state,b.question.trim(),b.evidence.trim(),b.fingerprint]);
    await db.query("COMMIT");
    res.json({ok:true,objectiveId});
  } catch (e) { await db.query("ROLLBACK"); throw e; } finally { db.release(); }
});

router.post("/objectives/:id/guidance", async (req,res) => {
  if (!validId(req.params.id) || (req.body?.caseId != null && !validId(req.body.caseId))) { res.status(400).json({error:"Invalid guidance"}); return; }
  const db = await getPool().connect();
  try {
    await db.query("BEGIN");
    const objective = (await db.query("SELECT * FROM support_objectives WHERE id=$1 FOR UPDATE",[req.params.id])).rows[0];
    if (!objective) { await db.query("ROLLBACK"); res.status(404).json({error:"Objective not found"}); return; }
    let id = req.body?.caseId ?? objective.case_id;
    if (req.body?.caseId != null && !(await db.query("SELECT id FROM support_cases WHERE id=$1 AND status='approved'",[id])).rowCount) {
      await db.query("ROLLBACK"); res.status(409).json({error:"Only approved guidance can be linked"}); return;
    }
    if (!id) {
      // Only an objective title is copied. Customer claims never become approved facts.
      id = (await db.query("INSERT INTO support_cases(title) VALUES($1) RETURNING id",[objective.title])).rows[0].id;
    }
    await db.query("UPDATE support_objectives SET case_id=$2 WHERE id=$1",[objective.id,id]);
    const result = await db.query(`SELECT ${caseFields} FROM support_cases WHERE id=$1`,[id]);
    await db.query("COMMIT");
    res.json({case:result.rows[0]});
  } catch(e) { await db.query("ROLLBACK"); throw e; } finally {db.release();}
});
export default router;
