import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateStream } from "@/lib/ai";
import { buildSystemPrompt, getTemplate } from "@/lib/agent-templates";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(30),
  config: z.object({
    templateSlug: z.string(),
  }),
});

/**
 * Public endpoint powering the landing-page live demo.
 * Stateless; uses the built-in mock model unless DEMO_USE_REAL_AI=true.
 */
export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { messages, config } = parsed.data;

  const template = getTemplate(config.templateSlug);
  if (!template) {
    return NextResponse.json({ error: "Unknown agent template" }, { status: 400 });
  }

  const system = buildSystemPrompt({ systemPrompt: template.systemPrompt });
  const useRealAI = process.env.DEMO_USE_REAL_AI === "true";

  const stream = generateStream({
    system,
    messages: messages.slice(-12),
    temperature: 0.7,
    model: useRealAI ? "auto" : "mock",
    templateSlug: template.slug,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async pull(controller) {
      try {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
