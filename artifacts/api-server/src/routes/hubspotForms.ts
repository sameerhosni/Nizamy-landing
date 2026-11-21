import { Router, type IRouter } from "express";
import {
  SubmitHubspotFormBody,
  SubmitHubspotFormResponse,
} from "@workspace/api-zod";
import { processWebsiteFormSubmission } from "../lib/websiteFormSubmission";
import { recordAcquisition } from "../lib/attribution";
import { MarketingConsentUnavailableError, ProcessingConsentRequiredError } from "../lib/websiteFormConsent";
import {
  WebsiteFormRequestConflictError,
  WebsiteFormRetryableError,
} from "../lib/websiteFormSubmissionCore";

const router: IRouter = Router();
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 12 };
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  bucket.count += 1;
  if (buckets.size > 10_000) {
    for (const [storedKey, storedBucket] of buckets) {
      if (storedBucket.resetAt <= now) buckets.delete(storedKey);
    }
  }
  return bucket.count > RATE_LIMIT.max;
}

router.post("/hubspot-form", async (req, res): Promise<void> => {
  if (rateLimited(`hubspot-form:${req.ip}`)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  const parsed = SubmitHubspotFormBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn("Invalid website form request");
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    const result = await processWebsiteFormSubmission(parsed.data);
    // Keep the established submission result if optional tracking storage fails.
    // The unique request ID prevents retries from changing the original attribution.
    try {
      await recordAcquisition("/hubspot-form", parsed.data.requestId);
    } catch (error) {
      req.log.error({ err: error, requestId: parsed.data.requestId }, "Website form accepted but attribution storage failed");
    }
    if (!result.notificationEmailSent) {
      req.log.error(
        { requestId: parsed.data.requestId },
        "HubSpot accepted website form but sales notification email failed",
      );
    }
    res.status(200).json(SubmitHubspotFormResponse.parse(result));
  } catch (error) {
    if (error instanceof ProcessingConsentRequiredError) {
      res.status(400).json({ error: "Processing consent is required" });
      return;
    }
    if (error instanceof MarketingConsentUnavailableError) {
      req.log.error({ requestId: parsed.data.requestId }, "Marketing consent configuration is unavailable");
      res.status(503).json({
        error: "Marketing signup is unavailable; no submission was sent",
        reason: "marketing_consent_unavailable",
      });
      return;
    }
    if (error instanceof WebsiteFormRequestConflictError) {
      res.status(409).json({
        error: "Request identifier was reused with different form data",
        reason: "request_id_reused",
      });
      return;
    }
    if (error instanceof WebsiteFormRetryableError) {
      res.status(503).json({
        error: "Form submission is still being processed",
        reason: "submission_pending",
      });
      return;
    }
    req.log.error(
      { err: error, requestId: parsed.data.requestId },
      "HubSpot website form submission failed",
    );
    res.status(503).json({
      error: "Form submission service unavailable",
    });
  }
});

export default router;