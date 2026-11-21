import assert from "node:assert/strict";
import { rankSupportGuidance } from "./supportKnowledgeRanking";

const school = { title: "فوائد نظامي للمدارس", keywords: "", diagnostic_questions: "", resolution: "يساعد مديره المدرسه في اداره الاجازات والحضور." };
const payroll = { title: "Payroll export", keywords: "salaries", diagnostic_questions: "", resolution: "Export payroll from reports." };
assert.equal(rankSupportGuidance([payroll, school], "أنا مديرة المدرسة، كيف يساعدني نظامي؟")[0], school);
assert.equal(rankSupportGuidance([school, payroll], "How do I export payroll?")[0], payroll);
assert.deepEqual(rankSupportGuidance([school, payroll], "unmatchedxyz"), []);
const corrected = { ...school, resolution: "Latest corrected answer" };
assert.equal(rankSupportGuidance([corrected, school], school.title)[0], corrected);
assert.equal(rankSupportGuidance([payroll, school], "وما الخطوات؟", "مديرة مدرسة")[0], school);
console.log("Support guidance ranking regression checks passed");
