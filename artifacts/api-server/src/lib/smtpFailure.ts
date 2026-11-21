// Do not log raw SMTP errors: responses can contain addresses or credentials.
export function smtpFailureDetails(error: unknown, configured: boolean) {
  const failure = error && typeof error === "object"
    ? error as { code?: unknown; responseCode?: unknown; command?: unknown }
    : {};
  const knownCodes = ["EAUTH", "ETIMEDOUT", "ECONNECTION", "ECONNRESET",
    "ECONNREFUSED", "ENOTFOUND", "EDNS", "ESOCKET", "ETLS", "EENVELOPE", "EMESSAGE"];
  const code = typeof failure.code === "string" && knownCodes.includes(failure.code)
    ? failure.code : "UNKNOWN";
  const responseCode = typeof failure.responseCode === "number"
    && Number.isInteger(failure.responseCode)
    && failure.responseCode >= 400 && failure.responseCode <= 599
    ? failure.responseCode : undefined;
  const rawCommand = typeof failure.command === "string" ? failure.command : "";
  const command = ["AUTH", "CONN", "EHLO", "HELO", "STARTTLS", "MAIL FROM", "RCPT TO", "DATA"]
    .find(value => rawCommand === value || rawCommand.startsWith(`${value} `)
      || rawCommand.startsWith(`${value}:`)) ?? "UNKNOWN";
  return { configured, code, responseCode, command };
}
