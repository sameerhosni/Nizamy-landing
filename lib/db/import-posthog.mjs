// One-off, rerunnable import. Never prints credentials or visitor identifiers.
import pg from "pg";
import fs from "node:fs";
const project = 519417;
const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});
async function query(query) {
 const r = await fetch(`https://us.posthog.com/api/projects/${project}/query/`, {
  method:"POST", headers:{Authorization:`Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,"Content-Type":"application/json"},
  body:JSON.stringify({query:{kind:"HogQLQuery",query}})
 });
 if(!r.ok) throw new Error(`PostHog HTTP ${r.status}`);
 const d=await r.json();
 if(!Array.isArray(d.results)) throw new Error("Incomplete PostHog response");
 return d.results;
}
try {
 await pool.query(fs.readFileSync(new URL("../../artifacts/api-server/migrations/20261005_posthog_visits.sql",import.meta.url),"utf8"));
 const cutoff=new Date().toISOString();
 const where=`event = '$pageview' AND timestamp < toDateTime('${cutoff}')`;
 const [[expected]]=await query(`SELECT count() FROM events WHERE ${where}`);
 let imported=0;
 let cursor="";
 const literal=v=>"'"+String(v).replaceAll("'","''")+"'";
 for(;;){
  const rows=await query(`SELECT uuid, timestamp, properties.$current_url, properties.utm_source, properties.utm_campaign, properties.$referring_domain FROM events WHERE ${where} ${cursor} ORDER BY timestamp, uuid LIMIT 1000`);
  for(const [id,date,url,utm,campaign,ref] of rows){
   let location="",source=utm||"";
   try {const u=new URL(url);location=u.hostname+u.pathname;
    source=source||u.searchParams.get("utm_source")||(u.searchParams.has("gclid")?"google":u.searchParams.has("fbclid")?"meta":"");
    if(!source && ref && ref!=="$direct" && ref!==u.hostname) source=ref;
   } catch {}
   await pool.query("INSERT INTO posthog_visits VALUES($1,$2,$3,$4,$5) ON CONFLICT(event_id) DO NOTHING",
    [id,String(source||"direct").slice(0,200),String(campaign||"").slice(0,200),location.slice(0,400),date]);
   imported++;
  }
  if(rows.length<1000)break;
  const last=rows.at(-1);
  cursor=`AND (timestamp > toDateTime64(${literal(last[1])},6) OR (timestamp = toDateTime64(${literal(last[1])},6) AND uuid > ${literal(last[0])}))`;
 }
 if(imported!==Number(expected))throw new Error(`Count mismatch: ${imported}/${expected}; rerun import`);
 console.log({verifiedPageviews:imported,...(await pool.query("SELECT min(created_at) AS earliest,max(created_at) AS latest,count(*) AS stored FROM posthog_visits")).rows[0]});
} finally {await pool.end();}
