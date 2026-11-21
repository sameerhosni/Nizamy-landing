import assert from "node:assert/strict";
import { getPool } from "@workspace/db";
import { supportKnowledge } from "./supportKnowledge";
import type { ApprovedGuidance } from "./supportSemanticMatching";

// No database connection or writes: exercise live-read behavior with a query stub.
async function main() {
  const pool = getPool();
  const original = pool.query;
  let approved = true;
  let resolution = "First approved resolution";
  let calls = 0;
  const select = async (rows: ApprovedGuidance[]) => rows;
  pool.query = (async (sql: string) => {
    assert.match(sql, /status='approved'/);
    assert.match(sql, /btrim\(resolution\)<>''/);
    calls++;
    return { rows: approved ? [{
      title: "School attendance correction", keywords: "",
      diagnostic_questions: "", resolution,
    }] : [] };
  }) as typeof pool.query;
  try {
    assert.match(await supportKnowledge("School attendance correction", "", select), /First approved resolution/);
    resolution = "Revised approved resolution";
    const revised = await supportKnowledge("School attendance correction", "", select);
    assert.match(revised, /Revised approved resolution/);
    assert.doesNotMatch(revised, /First approved resolution/);
    approved = false;
    assert.equal(await supportKnowledge("School attendance correction", "", select), "");
    assert.equal(calls, 3, "Every response must read current approval state");
    console.log("Approved guidance refresh/disable regression checks passed (no database accessed)");
  } finally {
    pool.query = original;
    await pool.end();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
