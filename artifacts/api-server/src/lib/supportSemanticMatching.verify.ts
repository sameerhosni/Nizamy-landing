/**
 * Synthetic fixtures only: no database writes, customer messages, or notifications.
 * pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/src/lib/supportSemanticMatching.verify.ts [--live]
 */
import assert from "node:assert/strict";
import { openai } from "@workspace/integrations-openai-ai-server";
import { formatSupportGuidance } from "./supportKnowledge";
import { parseIntentMatches, selectSupportGuidance, type ApprovedGuidance } from "./supportSemanticMatching";

const rows: ApprovedGuidance[] = [
  { id: "points", title: "Reward balance unchanged", keywords: "Missing earned rewards; not redemption",
    diagnostic_questions: "Ask which reward-earning activity was completed and when, unless already stated.",
    resolution: "When a Nizamy customer says earned points have not arrived, first establish the activity and completion time. Do not promise points or money, invent earning rules or claim you have changed the balance. If the cause cannot be established, offer support.",
    updated_at: "2026-10-11" },
  { id: "school", title: "School administrators", keywords: "Only schools; not other industries",
    diagnostic_questions: "", resolution: "Explain how Nizamy helps school leaders organize staff attendance and leave requests. Tailor the explanation to the person's responsibilities. Do not claim that it manages student grades or curriculum.",
    updated_at: "2026-10-11" },
];

async function main() {
  assert.deepEqual(parseIntentMatches('{"matches":[]}', new Set()), []);
  assert.throws(() => parseIntentMatches('{"matches":[{"id":"fake","relevance":3}]}', new Set(["points"])));
  assert.throws(() => parseIntentMatches('{"matches":[{"id":"points","relevance":1}]}', new Set(["points"])));
  assert.throws(() => parseIntentMatches("not json", new Set()));
  const prompt = formatSupportGuidance([rows[0]]);
  assert.match(prompt, /NOT canned customer replies/);
  assert.match(prompt, /SAME OBJECTIVE/);
  if (!process.argv.includes("--live")) { console.log("Semantic selection validation passed"); return; }
  const examples: Array<[string, string, string[]]> = [
    ["رصيدي ما تحرك من أمس مع إني استخدمت التطبيق، ليش؟", "", ["points"]],
    ["The rewards I earned still haven't shown up in Nizamy.", "", ["points"]],
    ["أنا ناظرة مدرسة، إيش أستفيد من نظامي لتنظيم شغل المعلمات؟", "", ["school"]],
    ["I run a school. Can this help organize teachers taking time off?", "", ["school"]],
    ["How can I exchange my Nizamy points for a gift card?", "", []],
    ["I manage a factory. Tell me about school-only rules for my factory.", "", []],
    ["How do I redeem the balance?", "My earned rewards did not arrive.", []],
  ];
  for (const [question, context, expected] of examples) {
    const actual = (await selectSupportGuidance(rows, question, context)).map(r => r.id);
    assert.deepEqual(actual, expected, `Intent mismatch for synthetic question: ${question}`);
  }
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    max_completion_tokens: 1800,
    messages: [
      { role: "system", content: "You are Nizamy's product assistant. Reply in the customer's language. " + prompt },
      { role: "user", content: "رصيدي ما تحرك، ليش؟" },
    ],
  }, { timeout: 45000, maxRetries: 0 });
  const reply = completion.choices[0]?.message.content ?? "";
  assert.match(reply, /[\u0600-\u06ff]/, "Reply should adapt English teaching instructions into Arabic");
  assert.doesNotMatch(reply, /When a Nizamy customer|first establish|Do not promise/i, "Must not paste staff instructions");
  assert.match(reply, /متى|وقت|نشاط|إيش|ايش|ماذا/, "Should ask for missing diagnostic context");
  console.log("Live AI checks passed: 7 intent/scope examples and 1 naturally composed Arabic reply; no real customer data used.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
