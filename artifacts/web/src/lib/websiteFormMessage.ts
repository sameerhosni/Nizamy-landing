export const SECTOR_MAX_LENGTH = 120;
// Reserve room so entering a sector after a long message cannot exceed the API limit.
export const SECTOR_MESSAGE_RESERVE = 160;

export function websiteFormMessage(message: string, context: string, sector = "", locale = "en") {
  const sectorLine = sector.trim()
    ? `${locale === "ar" ? "قطاع المنشأة" : "Client sector"}: ${sector.trim()}`
    : "";
  return [message.trim(), sectorLine, context.trim()].filter(Boolean).join("\n\n");
}
