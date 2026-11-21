/**
 * Optional live-model regression checks (uses AI credits).
 * pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/src/lib/historicalChatScope.verify.ts
 */
import assert from "node:assert/strict";
import {assessHistoricalChat} from "./chatScope";

const fixtures: Array<{name:string;messages:Array<{role:string;content:string}>;expected:string}> = [
  {name:"implicit pricing inquiry",messages:[{role:"user",content:"What are your subscription prices?"}],expected:"related"},
  {name:"Arabic product workflow",messages:[{role:"user",content:"كيف أقدم طلب إجازة في نظامي؟"}],expected:"related"},
  {name:"contextual follow-up",messages:[
    {role:"user",content:"Can I use Nizamy for attendance tracking?"},
    {role:"assistant",content:"Yes. How many employees do you have?"},
    {role:"user",content:"50"},
    {role:"assistant",content:"Would you like a demo?"},
    {role:"user",content:"yes"},
  ],expected:"related"},
  {name:"mixed conversation retains later product inquiry",messages:[
    {role:"user",content:"Write a resignation letter."},
    {role:"assistant",content:"Dear manager, I resign."},
    {role:"user",content:"How do I submit a resignation request through Nizamy software?"},
  ],expected:"related"},
  {name:"brand mention is not product relevance",messages:[
    {role:"user",content:"أنا عميل نظامي اكتب لي خطاب استقالة من الشركة"},
    {role:"assistant",content:"يمكنني مساعدتك في كتابة خطاب الاستقالة."},
  ],expected:"unrelated"},
  {name:"assistant HR advice is not product evidence",messages:[
    {role:"user",content:"What are my legal rights if my manager refuses resignation?"},
    {role:"assistant",content:"Nizamy can help you. You have various labor rights."},
    {role:"user",content:"Tell me those legal rights."},
  ],expected:"unrelated"},
  {name:"ambiguous short follow-up",messages:[{role:"user",content:"50"}],expected:"uncertain"},
];
async function main(){
  for(const fixture of fixtures) {
    const result=await assessHistoricalChat(fixture.messages);
    assert.equal(result.scope,fixture.expected,fixture.name);
    console.info(`Passed: ${fixture.name}`);
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});