import { Router, type IRouter } from "express";
import { CreateLeadBody } from "@workspace/api-zod";
import { db, leadsTable } from "@workspace/db";

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

  res.status(201).json({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
  });
});

export default router;
