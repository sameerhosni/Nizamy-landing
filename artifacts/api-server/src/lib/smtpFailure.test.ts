import assert from "node:assert/strict";
import test from "node:test";
import { smtpFailureDetails } from "./smtpFailure";

test("SMTP diagnostics retain useful codes but omit raw error data", () => {
  const details = smtpFailureDetails({
    code: "EAUTH", responseCode: 535, command: "AUTH PLAIN",
    message: "private-value", response: "private-value", password: "private-value",
  }, true);
  assert.deepEqual(details, { configured: true, code: "EAUTH", responseCode: 535, command: "AUTH" });
  assert(!JSON.stringify(details).includes("private-value"));
});

test("recipient commands never log addresses", () => {
  assert.equal(smtpFailureDetails({ command: "RCPT TO:<private-value>" }, true).command, "RCPT TO");
});

test("missing configuration and unknown failures remain safe", () => {
  assert.deepEqual(smtpFailureDetails(null, false), {
    configured: false, code: "UNKNOWN", responseCode: undefined, command: "UNKNOWN",
  });
  assert.deepEqual(smtpFailureDetails({
    code: "private-value", command: "private-value", responseCode: "private-value",
  }, true), { configured: true, code: "UNKNOWN", responseCode: undefined, command: "UNKNOWN" });
});
