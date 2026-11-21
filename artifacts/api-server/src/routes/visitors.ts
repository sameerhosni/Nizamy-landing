import { Router } from "express";
import { getPool } from "@workspace/db";
import { validVisitorId } from "../lib/visitors";
import { intercomVisitorsRouter } from "./intercomVisitors";

export const visitorsRouter = Router();
visitorsRouter.use("/visitors/intercom", intercomVisitorsRouter);
const profileSelect = `SELECT p.*,
  ARRAY(SELECT value FROM visitor_identities WHERE profile_id=p.id AND kind='email' ORDER BY value) AS emails,
  ARRAY(SELECT value FROM visitor_identities WHERE profile_id=p.id AND kind='phone' ORDER BY value) AS phones,
  ARRAY(SELECT DISTINCT device FROM traffic_events WHERE profile_id=p.id AND device<>'' ORDER BY device) AS devices,
  ARRAY(SELECT DISTINCT country FROM traffic_events WHERE profile_id=p.id AND country<>'' ORDER BY country) AS countries,
  ARRAY(SELECT DISTINCT source FROM traffic_events WHERE profile_id=p.id AND source<>'' ORDER BY source) AS sources,
  ARRAY(SELECT DISTINCT target FROM traffic_events WHERE profile_id=p.id AND event IN ('package_selected','package_cta_clicked') AND target<>'' ORDER BY target) AS packages,
  (SELECT count(*)::int FROM traffic_events WHERE profile_id=p.id AND event='app_download_clicked') AS downloads,
  (SELECT count(*)::int FROM traffic_events WHERE profile_id=p.id) AS event_count
  FROM visitor_profiles p`;
visitorsRouter.get("/visitors", async (req,res) => {
  const page = Number(req.query.page || 1), days = Number(req.query.days || 0);
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || ![0,1,7,30,90].includes(days) || search.length > 200) {
    res.status(400).json({error:"Invalid visitor filters"}); return;
  }
  const since = days ? new Date(Date.now()-days*86400000) : new Date(0);
  const term = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
  const where = ` WHERE p.last_seen >= $1 AND (p.name ILIKE $2 OR p.id::text ILIKE $2 OR
    EXISTS(SELECT 1 FROM visitor_identities i WHERE i.profile_id=p.id AND i.kind<>'browser' AND i.value ILIKE $2))`;
  const db=getPool();
  const [items,total] = await Promise.all([
    db.query(`${profileSelect}${where} ORDER BY p.last_seen DESC,p.id LIMIT 30 OFFSET $3`,[since,term,(page-1)*30]),
    db.query(`SELECT count(*)::int AS count FROM visitor_profiles p${where}`,[since,term])
  ]);
  res.json({items:items.rows,total:total.rows[0].count,page,pageSize:30});
});
visitorsRouter.get("/visitors/:id/pages/:page", async(req,res) => {
  const id=req.params.id, page=Number(req.params.page);
  if (!validVisitorId(id) || !Number.isSafeInteger(page) || page<1 || page>100000) {
    res.status(400).json({error:"Invalid visitor"}); return;
  }
  const db=getPool();
  const profile=await db.query(`${profileSelect} WHERE p.id=$1`,[id]);
  if (!profile.rowCount) { res.status(404).json({error:"Visitor not found; refresh the list if records were merged"}); return; }
  const events=await db.query(`SELECT event_id,event,created_at,location,target,source,campaign,device,browser,country,session_id
    FROM traffic_events WHERE profile_id=$1 ORDER BY created_at DESC,event_id LIMIT 50 OFFSET $2`,[id,(page-1)*50]);
  res.json({profile:profile.rows[0],events:events.rows,total:profile.rows[0].event_count,page,pageSize:50});
});
