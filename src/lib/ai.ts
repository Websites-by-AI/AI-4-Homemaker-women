/**
 * OpenRouter AI client — دستیار آموزشی دیجی‌آموزش
 * Chat + Embeddings از مسیر OpenRouter (سازگار با OpenAI API)
 * بدون پایتون؛ همه‌چیز داخل Next.js
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1";
const HF_ROUTER = "https://router.huggingface.co";

export const CHAT_MODEL =
  process.env.OPENROUTER_CHAT_MODEL || "google/gemini-2.0-flash-001";
export const EMBED_MODEL =
  process.env.OPENROUTER_EMBED_MODEL || "openai/text-embedding-3-small";
export const HF_CHAT_MODEL =
  process.env.HF_CHAT_MODEL || "Qwen/Qwen2.5-72B-Instruct:featherless-ai";
export const HF_EMBED_MODEL =
  process.env.HF_EMBED_MODEL || "intfloat/multilingual-e5-large";

/** بک‌اند فعال: OpenRouter در اولویت، سپس HuggingFace Inference */
export function aiBackend(): "openrouter" | "hf" | null {
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.HF_TOKEN) return "hf";
  return null;
}
export function aiConfigured(): boolean {
  return aiBackend() !== null;
}

function headers(): Record<string, string> {
  const b = aiBackend();
  const key = b === "openrouter" ? process.env.OPENROUTER_API_KEY : process.env.HF_TOKEN;
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "DigiAmoozesh AI Assistant",
  };
}

function chatUrlAndModel(): { url: string; model: string } {
  return aiBackend() === "openrouter"
    ? { url: `${OPENROUTER_URL}/chat/completions`, model: CHAT_MODEL }
    : { url: `${HF_ROUTER}/v1/chat/completions`, model: HF_CHAT_MODEL };
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function chatCompletion(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const { url, model } = chatUrlAndModel();
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.maxTokens ?? 1200,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI chat failed (${res.status}): ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (aiBackend() === "openrouter") {
    const res = await fetch(`${OPENROUTER_URL}/embeddings`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Embeddings failed (${res.status}): ${t.slice(0, 300)}`);
    }
    const data = await res.json();
    return (data.data || [])
      .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
      .map((d: { embedding: number[] }) => d.embedding);
  }
  // HuggingFace Inference — متن خام برمی‌گرداند (پیشوند query/passage در rag.ts می‌آید)
  const out: number[][] = [];
  for (let s = 0; s < texts.length; s += 16) {
    const res = await fetch(`${HF_ROUTER}/hf-inference/models/${HF_EMBED_MODEL}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ inputs: texts.slice(s, s + 16) }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`HF embeddings failed (${res.status}): ${t.slice(0, 300)}`);
    }
    const batch = await res.json();
    out.push(...batch);
  }
  return out;
}
