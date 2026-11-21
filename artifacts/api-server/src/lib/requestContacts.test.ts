import { test } from "node:test";
import assert from "node:assert/strict";
import { requestContacts } from "./requestContacts";

test("includes saved email and visitor phone", () => {
  const c = requestContacts(["Call +966 50 123 4567"], "CLIENT@example.com");
  assert.equal(c.replyTo, "client@example.com");
  assert.match(c.text, /\+966 50 123 4567/);
});
test("missing contacts are explicit", () => {
  assert.match(requestContacts(["What is the price?"]).text, /Email: Not provided/);
  assert.equal(requestContacts([]).replyTo, undefined);
});
test("handles Arabic phone digits and does not choose between different emails", () => {
  const c = requestContacts(["٠٥٠١٢٣٤٥٦٧ first@example.com second@example.com"]);
  assert.match(c.text, /0501234567/);
  assert.equal(c.replyTo, undefined);
});
