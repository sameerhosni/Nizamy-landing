/** Use the latest user message with letters; numbers/emoji retain the previous language. */
export function getChatLanguage(
  messages: readonly { role: string; content: string }[],
  fallback: "ar" | "en",
): "ar" | "en" {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    const firstLetter = messages[i].content.match(/\p{Letter}/u)?.[0];
    if (firstLetter) return /\p{Script=Arabic}/u.test(firstLetter) ? "ar" : "en";
  }
  return fallback;
}
