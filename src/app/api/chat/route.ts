import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { estimateTokens, generateStream, type GenerateOptions } from "@/lib/ai";
import { buildSystemPrompt, getTemplate } from "@/lib/agent-templates";
import { getUsage, overMessageLimit } from "@/lib/usage";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(60),
  config: z.object({
    templateSlug: z.string(),
    agentId: z.string().optional(),
    name: z.string().max(120).optional(),
    systemPrompt: z.string().max(20_000).optional(),
    tone: z.string().max(40).optional(),
    temperature: z.number().min(0).max(1).optional(),
    knowledgeBase: z.string().max(500_000).optional(),
    model: z.string().max(20).optional(),
  }),
  conversationId: z.string().nullish(),
});

/**
 * Authenticated streaming chat. Persists the conversation when the chat is
 * bound to a saved agent, tracks token usage, and enforces plan limits.
 */
export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to chat" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { messages, config, conversationId } = parsed.data;

  const template = getTemplate(config.templateSlug);
  if (!template) {
    return NextResponse.json({ error: "Unknown agent template" }, { status: 400 });
  }

  const usage = await getUsage(user.id, user.plan);
  if (overMessageLimit(usage)) {
    return NextResponse.json(
      {
        error: `You've used all ${usage.messagesLimit} messages on the ${usage.planName} plan this month. Upgrade to keep chatting.`,
      },
      { status: 429 }
    );
  }

  // When bound to a saved agent, verify ownership and persist the exchange.
  let agent = null;
  if (config.agentId) {
    agent = await db.agent.findFirst({
      where: { id: config.agentId, userId: user.id },
    });
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
  }

  const system = buildSystemPrompt({
    systemPrompt: config.systemPrompt ?? agent?.systemPrompt ?? template.systemPrompt,
    tone: config.tone ?? agent?.tone,
    knowledgeBase: config.knowledgeBase ?? agent?.knowledgeBase,
    agentName: config.name ?? agent?.name,
  });

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  // Resolve the conversation (persistence only for agent-bound chats).
  let convId: string | null = null;
  if (agent) {
    if (conversationId) {
      const existing = await db.conversation.findFirst({
        where: { id: conversationId, userId: user.id },
        select: { id: true },
      });
      convId = existing?.id ?? null;
    }
    if (!convId) {
      const created = await db.conversation.create({
        data: {
          userId: user.id,
          agentId: agent.id,
          title: (lastUserMessage?.content ?? "New conversation").slice(0, 80),
        },
      });
      convId = created.id;
    }
    if (lastUserMessage) {
      await db.message.create({
        data: {
          conversationId: convId,
          role: "user",
          content: lastUserMessage.content,
          tokens: estimateTokens(lastUserMessage.content),
        },
      });
    }
  }

  const stream = generateStream({
    system,
    messages: messages.slice(-24),
    temperature: config.temperature ?? agent?.temperature ?? 0.7,
    model: (config.model ?? agent?.model ?? "auto") as GenerateOptions["model"],
    templateSlug: template.slug,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let full = "";
      try {
        for await (const chunk of stream) {
          full += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      // Persist the assistant reply + usage before closing the stream.
      try {
        if (convId) {
          const tokens = estimateTokens(full);
          await db.message.create({
            data: { conversationId: convId, role: "assistant", content: full, tokens },
          });
          await db.conversation.update({
            where: { id: convId },
            data: {
              tokensUsed: {
                increment: tokens + estimateTokens(lastUserMessage?.content ?? ""),
              },
            },
          });
        }
      } catch (err) {
        console.error("[chat] failed to persist conversation:", err);
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      ...(convId ? { "X-Conversation-Id": convId } : {}),
    },
  });
}
