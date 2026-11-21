import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestHandler } from "express";
import { getPool } from "@workspace/db";
import { logger } from "./logger";
import { linkVisitorContact } from "./visitors";

const context = new AsyncLocalStorage<Record<string, unknown>>();
export function acquisitionText() {
  const value = context.getStore();
  return value ? `\n\nAcquisition (visitor-reported): ${JSON.stringify(value)}` : "";
}
export async function identifyAcquiredVisitor(input: Record<string, unknown>) {
  const visitor=context.getStore()?.session;
  if (typeof visitor === "string") await linkVisitorContact(visitor,input);
}
export async function recordAcquisition(kind:string, id:string) {
  const value = context.getStore();
  if (!value || !process.env.DATABASE_URL) return;
  const query = {
    text: "INSERT INTO acquisition_records(kind,record_id,attribution) VALUES($1,$2,$3) ON CONFLICT(kind,record_id) DO NOTHING",
    values: [kind,id,JSON.stringify(value)],
    query_timeout: 1500,
  };
  await getPool().query(query);
}
export const attributionMiddleware:RequestHandler = (req,res,next) => {
  let attribution:Record<string,unknown> = {};
  try {
    const raw = req.get("X-Nizamy-Attribution") || "";
    if (raw.length > 6000) throw new Error("Oversized attribution");
    const value = JSON.parse(decodeURIComponent(raw));
    if (!/^[a-f0-9-]{36}$/i.test(value.session)) throw new Error("Invalid session");
    attribution.session = value.session;
    for (const key of ["first","latest"]) {
      const touch:Record<string,string> = {};
      for (const field of ["source","medium","campaign","content","landing","term","marketer","at"]) {
        if (typeof value[key]?.[field] === "string") touch[field] = value[key][field].replace(/[\r\n<>]/g,"").slice(0,160);
      }
      attribution[key] = touch;
    }
  } catch { next(); return; }
  context.run(attribution, () => {
    const original = res.json.bind(res);
    res.json = ((body:any) => {
      if(req.method==="POST" && res.statusCode<300 && /\/(lead|ticket|submit|signup|incentive-signup|hubspot-form|conversations)$/.test(req.path)) {
        const id = String(body?.ticketNumber || body?.id || req.body?.requestId || attribution.session);
        // The website form awaits its attribution write before sending success.
        if (!req.path.endsWith("/hubspot-form"))
          void recordAcquisition(req.path,id).catch(err=>logger.error({err},"Could not store acquisition"));
        if (/\/(lead|ticket|submit|signup|incentive-signup|hubspot-form)$/.test(req.path)) {
          void identifyAcquiredVisitor(req.body ?? {}).catch(err=>logger.error({err},"Could not link submitted visitor contact"));
        }
      }
      return original(body);
    }) as typeof res.json;
    next();
  });
};
