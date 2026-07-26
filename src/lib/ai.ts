/**
 * OpenRouter AI client — دستیار آموزشی دیجی‌آموزش
 * Chat + Embeddings از مسیر OpenRouter (سازگار با OpenAI API)
 * بدون پایتون؛ همه‌چیز داخل Next.js
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1";

export const CHAT_MODEL =
  process.env.OPENROUTER_CHAT_MODEL || "google/gemini-2.0-flash-001";
export const EMBED_MODEL =
  process.env.OPENROUTER_EMBED_MODEL || "openai/text-embedding-3-small";

export function aiConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "DigiAmoozesh AI Assistant",
  };
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function chatCompletion(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const res = await fetch(`${OPENROUTER_URL}/chat/completions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.maxTokens ?? 1200,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenRouter chat failed (${res.status}): ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const res = await fetch(`${OPENROUTER_URL}/embeddings`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenRouter embeddings failed (${res.status}): ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.data || [])
    .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
    .map((d: { embedding: number[] }) => d.embedding);
}
