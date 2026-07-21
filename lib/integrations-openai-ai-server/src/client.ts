import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (client) return client;

  const baseURL =
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || process.env.OPENAI_BASE_URL;
  const apiKey =
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No OpenAI credentials found. Set AI_INTEGRATIONS_OPENAI_BASE_URL + AI_INTEGRATIONS_OPENAI_API_KEY (Replit AI integration) or OPENAI_API_KEY (and optionally OPENAI_BASE_URL) for standard OpenAI access.",
    );
  }

  client = new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
  return client;
}

export const isReplitAiProxy = Boolean(
  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
);

export const openai: OpenAI = new Proxy({} as OpenAI, {
  get(_target, prop) {
    const value = Reflect.get(getClient(), prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
