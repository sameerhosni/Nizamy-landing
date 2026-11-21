export function csvCell(value: unknown): string {
  let text = value == null ? "" : String(value);
  // Quoting alone does not prevent spreadsheet formula execution.
  if (/^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return `"${text.replace(/"/g, '""')}"`;
}
export const touchFields = ["source", "medium", "campaign", "content", "term", "marketer", "landing", "at"] as const;
export function acquisitionCsv(rows: {record_id: string; created_at: Date | string; attribution: Record<string, any>}[]): string {
  const header = ["form_request_id", "submitted_at", ...["first", "latest"].flatMap(t => touchFields.map(f => `${t}_${f}`))];
  return "\uFEFF" + [header, ...rows.map(row => [
    row.record_id, row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    ...["first", "latest"].flatMap(t => touchFields.map(f => row.attribution?.[t]?.[f] ?? "")),
  ])].map(row => row.map(csvCell).join(",")).join("\r\n");
}
