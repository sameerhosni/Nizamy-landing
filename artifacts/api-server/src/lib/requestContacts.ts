import { normalizeEmail } from "./staffReplyCore";

/** Only inspect visitor-authored text, never AI suggestions or attribution metadata. */
export function requestContacts(messages: string[], savedEmail?: string | null) {
  const text = messages.join("\n");
  const emails = [...new Set([savedEmail, ...(text.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])]
    .map(normalizeEmail).filter((v): v is string => !!v))];
  const digits = text.replace(/[٠-٩۰-۹]/g, c => String("٠١٢٣٤٥٦٧٨٩".includes(c) ? "٠١٢٣٤٥٦٧٨٩".indexOf(c) : "۰۱۲۳۴۵۶۷۸۹".indexOf(c)));
  const phones = [...new Set((digits.match(/(?:\+|00)\d[\d ()-]{7,22}\d|\b05\d(?:[ -]?\d){7}\b/g) ?? [])
    .map(v => v.trim()).filter(v => { const n = v.replace(/\D/g, "").length; return n >= 9 && n <= 15; }))];
  return {
    replyTo: emails.length === 1 ? emails[0] : undefined,
    text: `Customer contact details (customer-provided, not verified)\nEmail: ${emails.join(", ") || "Not provided"}\nPhone / WhatsApp mentioned: ${phones.join(", ") || "Not provided"}`,
  };
}
