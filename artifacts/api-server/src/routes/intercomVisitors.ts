import { Router } from "express";
import { getPool } from "@workspace/db";
import { GetIntercomContactsQueryParams, GetIntercomContactsResponse, GetIntercomActivityQueryParams, GetIntercomActivityResponse } from "@workspace/api-zod";
import { getIntercomContact, listIntercomContacts, listIntercomConversations, IntercomReportingError } from "../lib/intercomReporting";

// Mounted inside visitorsRouter, after support's requireStaff middleware.
export const intercomVisitorsRouter = Router();
intercomVisitorsRouter.use((_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });

intercomVisitorsRouter.get("/", async (req, res): Promise<void> => {
  const input = GetIntercomContactsQueryParams.safeParse(req.query);
  if (!input.success || Object.values(req.query).some(v => typeof v !== "string")) {
    res.status(400).json({ error: "Invalid Intercom filters" }); return;
  }
  const email = input.data.email?.trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Enter a complete email address" }); return;
  }
  res.json(GetIntercomContactsResponse.parse(await listIntercomContacts(email, input.data.cursor)));
});
intercomVisitorsRouter.get("/activity", async (req, res): Promise<void> => {
  const input = GetIntercomActivityQueryParams.safeParse(req.query);
  if (typeof req.query.contactId !== "string" || !input.success || Object.values(req.query).some(v => typeof v !== "string")) {
    res.status(400).json({ error: "Invalid Intercom contact or cursor" }); return;
  }
  const contact = await getIntercomContact(input.data.contactId);
  const activity = await listIntercomConversations(contact.id, input.data.cursor);
  // Exact normalized email is only a candidate, never proof of identity. Do not
  // match names/phones/external_id or modify the existing identity graph.
  const email = contact.email?.trim().toLowerCase();
  const candidates = email ? (await getPool().query(
    "SELECT DISTINCT profile_id FROM visitor_identities WHERE kind='email' AND value=$1 ORDER BY profile_id", [email],
  )).rows.map(row => ({ profileId: String(row.profile_id), basis: "exact_email_unverified" as const })) : [];
  res.json(GetIntercomActivityResponse.parse({ contact, ...activity, candidates, fetchedAt: new Date().toISOString() }));
});
intercomVisitorsRouter.use((error: unknown, _req: import("express").Request, res: import("express").Response, _next: import("express").NextFunction) => {
  if (error instanceof IntercomReportingError) {
    res.status(error.status).json({ error: error.message, code: error.code }); return;
  }
  res.status(503).json({ error: "Intercom activity could not be loaded. Please retry.", code: "report_unavailable" });
});
