export type Guidance = {
  title: string;
  keywords: string;
  diagnostic_questions: string;
  resolution: string;
};

const stopWords = new Set("what how can does do the a an is are to of for and in my me your with about please nizamy نظامي ماذا كيف هل انا من في عن على الي الى ما هو هي لي لنا اريد عند عندي ممكن يقدم تقدم الذي التي هذا هذه".split(" "));
export function normalizeGuidanceText(text: string) {
  return text.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/ـ/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
}
function words(text: string) {
  return [...new Set((normalizeGuidanceText(text).match(/[\p{L}\p{N}]{2,}/gu) ?? [])
    .map(w => w.startsWith("ال") && w.length > 4 ? w.slice(2) : w)
    .filter(w => !stopWords.has(w)))].slice(-80);
}
export function rankSupportGuidance<T extends Guidance>(rows: T[], question: string, context = ""): T[] {
  const current = words(question);
  const previous = words(context);
  const query = normalizeGuidanceText(question).trim();
  return rows.map((row, order) => {
    const heading = words(`${row.title} ${row.keywords}`);
    const body = words(`${row.diagnostic_questions} ${row.resolution}`);
    const overlap = (tokens: string[]) => tokens.reduce((sum, w) =>
      sum + (heading.includes(w) ? 4 : body.includes(w) ? 1 : 0), 0);
    const title = normalizeGuidanceText(row.title).trim();
    const exact = query.length >= 6 && query === title;
    const score = (exact ? 1000 : 0) + overlap(current) * 10 + overlap(previous);
    // Previous user context helps follow-ups, but assistant answers never enter the query.
    return { row, order, score };
  }).filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 3).map(r => r.row);
}
