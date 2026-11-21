import assert from "node:assert/strict";
import { attributionMiddleware, acquisitionText } from "./attribution";
const source = {session:"11111111-1111-4111-8111-111111111111",first:{source:"meta"},latest:{source:"google",campaign:"test"}};
let calls = 0;
const req:any = {get:()=>encodeURIComponent(JSON.stringify(source)),method:"GET"};
const res:any = {json:()=>{}};
attributionMiddleware(req,res,()=>{
  calls++;
  assert.match(acquisitionText(), /google/);
  assert.match(acquisitionText(), /meta/);
});
assert.equal(calls,1);
assert.equal(acquisitionText(),"");
req.get=()=>"%bad";
attributionMiddleware(req,res,()=>{calls++;assert.equal(acquisitionText(),"");});
assert.equal(calls,2);
console.log("PASS: source parsing, context isolation, malformed header does not block request");
