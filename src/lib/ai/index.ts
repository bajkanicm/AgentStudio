import { mockCompletionStream } from "./mock";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GenerateOptions {
  system: string;
  messages: ChatMessage[];
  temperature: number;
  /** "auto" picks Claude if available, then GPT, then the built-in mock. */
  model?: "auto" | "claude" | "gpt" | "mock";
  templateSlug?: string;
}

export type Provider = "anthropic" | "openai" | "mock";

export function resolveProvider(model: GenerateOptions["model"] = "auto"): Provider {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  if (model === "claude" && hasAnthropic) return "anthropic";
  if (model === "gpt" && hasOpenAI) return "openai";
  if (model === "mock") return "mock";
  if (hasAnthropic) return "anthropic";
  if (hasOpenAI) return "openai";
  return "mock";
}

/**
 * Returns an async iterable of text chunks from the selected provider.
 * Falls back to a realistic built-in mock when no API keys are configured,
 * so the whole product works out of the box.
 */
export async function* generateStream(opts: GenerateOptions): AsyncGenerator<string> {
  const provider = resolveProvider(opts.model);
  try {
    if (provider === "anthropic") {
      yield* anthropicStream(opts);
      return;
    }
    if (provider === "openai") {
      yield* openaiStream(opts);
      return;
    }
  } catch (err) {
    console.error(`[ai] ${provider} provider failed, falling back to mock:`, err);
  }
  yield* mockCompletionStream(opts);
}

async function* anthropicStream(opts: GenerateOptions): AsyncGenerator<string> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const stream = client.messages.stream({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
    max_tokens: 1024,
    temperature: Math.min(opts.temperature, 1),
    system: opts.system,
    messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
  });
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

async function* openaiStream(opts: GenerateOptions): AsyncGenerator<string> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI();
  const stream = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: opts.temperature,
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: "system" as const, content: opts.system },
      ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) yield text;
  }
}

/** Rough token estimate used for usage tracking when providers don't report it. */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.length / 4));
}
