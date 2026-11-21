import { describe, it, expect } from "vitest";
import { acquisitionCsv, csvCell } from "./acquisitionCsv";
describe("attribution CSV", () => {
  it("escapes quotes, commas, and spreadsheet formulas", () => {
    expect(csvCell('a,"b')).toBe('"a,""b"');
    expect(csvCell(" =1+1")).toBe('"\' =1+1"');
  });
  it("exports both touches and supports historical missing fields", () => {
    const csv = acquisitionCsv([{record_id:"request-1",created_at:"2026-11-12",attribution:{
      first:{source:"meta",campaign:"حملة",content:"ad1"},latest:{source:"google",marketer:"agency-b"},
    }}]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("first_content");
    expect(csv).toContain("latest_marketer");
    expect(csv).toContain("agency-b");
    expect(csv).toContain("حملة");
  });
});
