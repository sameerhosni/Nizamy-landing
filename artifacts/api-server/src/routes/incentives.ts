import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  CreateIncentiveSignupBody,
  CreateIncentiveSignupResponse,
} from "@workspace/api-zod";
import { getDb, incentiveSignupsTable } from "@workspace/db";
import { sendIncentiveSignupNotification } from "../lib/mailer";

const router: IRouter = Router();
const POINTS_AWARDED = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toLatinDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) =>
      String(digit.charCodeAt(0) - "٠".charCodeAt(0)),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String(digit.charCodeAt(0) - "۰".charCodeAt(0)),
    );
}

function normalizeSaudiMobile(value: string): string | null {
  const trimmed = value.trim();
  const plusCount = (trimmed.match(/\+/g) ?? []).length;

  if (
    !/^[+()\-\s0-9٠-٩۰-۹]+$/.test(trimmed) ||
    plusCount > 1 ||
    (plusCount === 1 && !trimmed.startsWith("+"))
  ) {
    return null;
  }

  let digits = toLatinDigits(trimmed).replace(/\D/g, "");

  if (digits.startsWith("00966")) {
    digits = digits.slice(5);
  } else if (digits.startsWith("966")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!/^5\d{8}$/.test(digits)) {
    return null;
  }

  return `+966${digits}`;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

router.post(
  "/incentive-signup",
  async (req, res): Promise<void> => {
    const parsed = CreateIncentiveSignupBody.safeParse(req.body);

    if (!parsed.success) {
      req.log.warn("Invalid incentive signup request");
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const rawEmail = parsed.data.email?.trim() ?? "";
    const email = rawEmail ? rawEmail.toLowerCase() : null;
    const rawMobile = parsed.data.mobile?.trim() ?? "";
    const mobile = rawMobile ? normalizeSaudiMobile(rawMobile) : null;

    if (
      (!email && !mobile) ||
      (email !== null && !EMAIL_PATTERN.test(email)) ||
      (rawMobile && mobile === null)
    ) {
      res.status(400).json({
        error: "Provide a valid email address or Saudi mobile number",
      });
      return;
    }

    if (!process.env["DATABASE_URL"]) {
      req.log.error("Database unavailable for incentive signup");
      res.status(503).json({ error: "Incentive service unavailable" });
      return;
    }

    const notifySales = (status: "awarded" | "already_claimed") => {
      sendIncentiveSignupNotification({
        intent: parsed.data.intent,
        email,
        mobile,
        language: parsed.data.language,
        status,
        pointsAwarded: POINTS_AWARDED,
        createdAt: new Date().toISOString(),
      }).catch((error) => {
        req.log.error(
          { err: error, status },
          "Failed to send incentive signup notification",
        );
      });
    };

    try {
      const database = getDb();

      const emailClaim = email
        ? await database
            .select({ id: incentiveSignupsTable.id })
            .from(incentiveSignupsTable)
            .where(eq(incentiveSignupsTable.email, email))
            .limit(1)
        : [];
      const mobileClaim = mobile
        ? await database
            .select({ id: incentiveSignupsTable.id })
            .from(incentiveSignupsTable)
            .where(eq(incentiveSignupsTable.mobile, mobile))
            .limit(1)
        : [];

      if (emailClaim.length > 0 || mobileClaim.length > 0) {
        notifySales("already_claimed");
        res.status(200).json(
          CreateIncentiveSignupResponse.parse({
            status: "already_claimed",
            pointsAwarded: POINTS_AWARDED,
          }),
        );
        return;
      }

      await database.insert(incentiveSignupsTable).values({
        intent: parsed.data.intent,
        email,
        mobile,
        pointsAwarded: POINTS_AWARDED,
        language: parsed.data.language,
      });

      notifySales("awarded");
      res.status(201).json(
        CreateIncentiveSignupResponse.parse({
          status: "awarded",
          pointsAwarded: POINTS_AWARDED,
        }),
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        notifySales("already_claimed");
        res.status(200).json(
          CreateIncentiveSignupResponse.parse({
            status: "already_claimed",
            pointsAwarded: POINTS_AWARDED,
          }),
        );
        return;
      }

      req.log.error({ err: error }, "Failed to create incentive signup");
      res.status(503).json({ error: "Incentive service unavailable" });
    }
  },
);

export default router;