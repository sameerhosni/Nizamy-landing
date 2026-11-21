import { Router } from "express";
import { getPool } from "@workspace/db";
import { storeVisitorEvent, validVisitorId } from "../lib/visitors";
import { acquisitionCsv } from "../lib/acquisitionCsv";
import { ExportWebsiteAcquisitionsQueryParams } from "@workspace/api-zod";
export const trafficRouter = Router();
export const trafficReportRouter = Router();
trafficReportRouter.get("/acquisitions.csv", async (req, res) => {
  const rawDays = req.query.days;
  const parsed = ExportWebsiteAcquisitionsQueryParams.safeParse({
    ...req.query,
    days: typeof rawDays === "string" && /^(0|1|7|30)$/.test(rawDays) ? Number(rawDays) : rawDays,
  });
  if (!parsed.success) { res.status(400).json({error:"Invalid date range"}); return; }
  const days = parsed.data.days ?? 0;
  const since = days === 0 ? new Date(0) : new Date(Date.now() - days * 86400000);
  const result = await getPool().query(
    "SELECT record_id,created_at,attribution FROM acquisition_records WHERE kind='/hubspot-form' AND created_at >= $1 ORDER BY created_at DESC,id DESC",
    [since],
  );
  res.setHeader("Content-Disposition", 'attachment; filename="nizamy-form-attribution.csv"');
  res.type("text/csv").send(acquisitionCsv(result.rows));
});
const buckets = new Map<string,{count:number;until:number}>();
trafficRouter.post("/traffic-event",async(req,res)=>{
  const ip=req.ip||"unknown", now=Date.now();
  if (buckets.size>10000) for(const [key,value] of buckets) if(value.until<now)buckets.delete(key);
  const bucket=buckets.get(ip);
  if(bucket && bucket.until>now && bucket.count>=300){res.sendStatus(429);return;}
  buckets.set(ip,bucket&&bucket.until>now?{...bucket,count:bucket.count+1}:{count:1,until:now+60000});
  const b=req.body;
  if(!b || !validVisitorId(b.id) || !["attributed_visit","website_click","submission_succeeded","chat_started","chat_ticket_created",
    "section_view","package_selected","package_cta_clicked","app_download_clicked","calculator_used","form_started","chatbot_opened"].includes(b.event) ||
    (b.visitor !== undefined && !validVisitorId(b.visitor)) || (b.session !== undefined && !validVisitorId(b.session)) ||
    ["source","campaign","location","target"].some(k=>typeof b[k]!=="string"||b[k].length>200)){
    res.status(400).json({error:"Invalid event"});return;
  }
  await storeVisitorEvent(b,req.get("user-agent") || "",req.get("cf-ipcountry") || "");
  res.sendStatus(204);
});
trafficReportRouter.get("/traffic",async(req,res)=>{
  const days=Number(req.query.days||7);
  if(![0,1,7,30].includes(days)){res.status(400).json({error:"Invalid date range"});return;}
  const since=days===0?new Date(0):new Date(Date.now()-days*86400000);
  const db=getPool();
  const [sources,recent,records]=await Promise.all([
    db.query(`WITH combined AS (
      SELECT event,source,campaign,created_at FROM traffic_events
      WHERE event <> 'attributed_visit' OR created_at > (SELECT COALESCE(max(created_at),'epoch') FROM posthog_visits)
      UNION ALL SELECT 'attributed_visit',source,campaign,created_at FROM posthog_visits
    ) SELECT source,campaign,
      count(*) FILTER(WHERE event='attributed_visit') AS visits,
      count(*) FILTER(WHERE event='website_click') AS clicks,
      count(*) FILTER(WHERE event='submission_succeeded') AS submissions,
      count(*) FILTER(WHERE event='chat_started') AS chats,
      count(*) FILTER(WHERE event='chat_ticket_created') AS tickets
      FROM combined WHERE created_at>=$1 GROUP BY source,campaign ORDER BY count(*) DESC`,[since]),
    db.query(`SELECT * FROM (
      SELECT event,source,campaign,location,target,created_at FROM traffic_events
      WHERE event <> 'attributed_visit' OR created_at > (SELECT COALESCE(max(created_at),'epoch') FROM posthog_visits)
      UNION ALL SELECT 'posthog_pageview',source,campaign,location,'PostHog import',created_at FROM posthog_visits
    ) e WHERE created_at>=$1 ORDER BY created_at DESC LIMIT 100`,[since]),
    db.query("SELECT kind,record_id,attribution,created_at FROM acquisition_records WHERE created_at>=$1 ORDER BY id DESC LIMIT 100",[since])
  ]);
  res.json({sources:sources.rows,recent:recent.rows,records:records.rows});
});
