import assert from "node:assert/strict";
import { websiteFormMessage, SECTOR_MAX_LENGTH, SECTOR_MESSAGE_RESERVE } from "./websiteFormMessage";

assert.equal(websiteFormMessage(" Hello ", " context "), "Hello\n\ncontext");
assert.equal(websiteFormMessage("", "", " Healthcare "), "Client sector: Healthcare");
assert.equal(websiteFormMessage("استفسار", "", "التعليم", "ar"), "استفسار\n\nقطاع المنشأة: التعليم");
assert.equal(websiteFormMessage("Hello", "", "  "), "Hello");
for (const locale of ["ar", "en"]) {
  const context = "Existing enquiry context";
  const message = "a".repeat(4000 - context.length - 2 - SECTOR_MESSAGE_RESERVE);
  const result = websiteFormMessage(message, context, "b".repeat(SECTOR_MAX_LENGTH), locale);
  assert(result.length <= 4000);
  assert(result.includes(message) && result.endsWith(context), "Never truncate customer data");
}
console.log("Sector message composition: AR/EN, optional values, existing context and maximum-length payload passed.");
