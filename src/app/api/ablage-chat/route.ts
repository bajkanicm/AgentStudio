import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { estimateTokens, generateStream } from "@/lib/ai";
import { docTypeLabel } from "@/lib/documents";
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
  conversationId: z.string().nullish(),
});

const SYSTEM_BASE = `Du bist der KI-Chat von hey247, dem digitalen Büro für Handwerksbetriebe. Du beantwortest Fragen ausschließlich auf Basis der Ablage des Betriebs (unten) und hilfst im Alltag: Mails formulieren, Angebotstexte schreiben, Dokumente zusammenfassen.

Regeln:
- Antworte auf Deutsch, klar und knapp.
- Nenne bei Antworten aus der Ablage immer die Quelle(n) in der Form **Quellen:** _Dokumenttitel_.
- Wenn die Ablage nichts hergibt, sag das ehrlich und schlage vor, das Dokument anzulegen.
- Erfinde keine Beträge, Daten oder Dokumente.`;

/**
 * "Frag deine Ablage" — chat grounded on the user's documents.
 * Persists the conversation (agentId = null) with title from first message.
 */
export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const { messages, conversationId } = parsed.data;

  const usage = await getUsage(user.id, user.plan);
  if (overMessageLimit(usage)) {
    return NextResponse.json(
      {
        error: `Du hast alle ${usage.messagesLimit} Nachrichten deines Plans „${usage.planName}" für diesen Monat verbraucht.`,
      },
      { status: 429 }
    );
  }

  // Serialize the Ablage into the knowledge base (### blocks, char-capped).
  const documents = await db.document.findMany({
    where: { userId: user.id },
    orderBy: { docDate: "desc" },
    take: 60,
  });
  let kb = "";
  for (const d of documents) {
    const amount =
      d.amount != null
        ? `, ${d.amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`
        : "";
    const entry = `### ${d.title} (${docTypeLabel(d.type)}${amount}, ${d.docDate.toLocaleDateString("de-DE")}, Status: ${d.status})\n${d.content}\n\n`;
    if (kb.length + entry.length > 60_000) break;
    kb += entry;
  }

  const system = `${SYSTEM_BASE}\n\n--- WISSENSBASIS ---\nNutze das folgende Betriebswissen für deine Antworten:\n${kb.trim() || "(Die Ablage ist leer.)"}\n--- ENDE WISSENSBASIS ---`;

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  // Conversation (agentId null = Ablage chat)
  let convId: string | null = null;
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
        title: (lastUserMessage?.content ?? "Neuer Chat").slice(0, 80),
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

  const stream = generateStream({
    system,
    messages: messages.slice(-24),
    temperature: 0.4,
    model: "auto",
    templateSlug: "ablage",
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
      try {
        const tokens = estimateTokens(full);
        await db.message.create({
          data: { conversationId: convId!, role: "assistant", content: full, tokens },
        });
        await db.conversation.update({
          where: { id: convId! },
          data: {
            tokensUsed: {
              increment: tokens + estimateTokens(lastUserMessage?.content ?? ""),
            },
          },
        });
      } catch (err) {
        console.error("[ablage-chat] persist failed:", err);
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Conversation-Id": convId,
    },
  });
}
