import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { CreateLeadBody } from "@workspace/api-zod";
import { db, leadsTable } from "@workspace/db";
import { sendLeadConfirmation } from "../lib/mailer";

const router: IRouter = Router();

router.post("/lead", async (req, res) => {
  const parsed = CreateLeadBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const input = parsed.data;

  const [lead] = await db
    .insert(leadsTable)
    .values({
      name: input.name,
      company: input.company,
      email: input.email,
      whatsapp: input.whatsapp,
      employees: input.employees ?? null,
      tier: input.tier ?? null,
      tierPrice: input.tierPrice ?? null,
      subscription: input.subscription ?? null,
      totalReturn: input.totalReturn ?? null,
    })
    .returning();

  const earlier = await db
    .select({ id: leadsTable.id })
    .from(leadsTable)
    .where(
      sql`lower(${leadsTable.email}) = lower(${lead.email}) and ${leadsTable.id} < ${lead.id}`,
    )
    .limit(1);
  const isReturning = earlier.length > 0;

  sendLeadConfirmation({
    name: lead.name,
    company: lead.company,
    email: lead.email,
    whatsapp: lead.whatsapp,
    employees: lead.employees,
    tier: lead.tier,
    tierPrice: lead.tierPrice,
    subscription: lead.subscription,
    totalReturn: lead.totalReturn,
    createdAt: lead.createdAt.toISOString(),
    language: input.language === "en" ? "en" : "ar",
  }, isReturning).catch((err) => {
    req.log.error({ err }, "Failed to send lead confirmation email");
  });

  res.status(201).json({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
  });
});

export default router;
