import { expect, it, vi } from "vitest";
const mail = vi.hoisted(() => ({ welcome: vi.fn(), sales: vi.fn() }));
vi.mock("./mailer", () => ({
  isMailerConfigured: () => true,
  sendWebsiteWelcome: mail.welcome,
  sendWebsiteFormNotification: mail.sales,
}));
vi.mock("./hubspotIncentiveContact", () => ({
  upsertHubspotContact: vi.fn(),
  toHubspotSignupIntentLabel: () => "Exploring",
}));
import { createWebsiteFormDependencies, processWebsiteFormSubmission } from "./websiteFormSubmission";
import { appDownloadConfirmation } from "./appDownloadConfirmation";
it.each(["ar", "en"] as const)("includes welcome points and both downloads in %s", language => {
  const email = appDownloadConfirmation(language);
  expect(email.text).toContain("5,000");
  expect(email.html).toContain("https://apps.apple.com/sa/app/id6792693395");
  expect(email.html).toContain("https://play.google.com/store/apps/details?id=com.t2.nizamy");
});
it("sends customer and team emails once on replay", async () => {
  const deps = createWebsiteFormDependencies(vi.fn().mockResolvedValue(undefined));
  const input = {requestId:"welcome-test", email:"visitor@example.test", language:"en" as const,
    intents:["exploring" as const, "seeking_hr" as const], consentToProcess:true, marketingOptIn:false,
    pageUri:"https://example.test", pageName:"Test"};
  await processWebsiteFormSubmission(input, deps);
  await processWebsiteFormSubmission(input, deps);
  expect(mail.welcome).toHaveBeenCalledExactlyOnceWith(input.email, "en");
  expect(mail.sales).toHaveBeenCalledTimes(1);
  expect(mail.sales).toHaveBeenCalledWith(expect.objectContaining({intents: input.intents}));
});
