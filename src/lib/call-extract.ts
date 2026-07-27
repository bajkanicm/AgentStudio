import { db } from "@/lib/db";
import { generateStream, resolveProvider, type ChatMessage } from "@/lib/ai";

export interface ExtractedCall {
  callerName: string;
  callerPhone: string;
  summary: string;
  noteItems: string;
  urgency: "normal" | "dringend";
}

const PHONE_RE = /(\+49[\s\-/]?|0)[1-9][\d\s\-/]{6,14}\d/;
const URGENT_RE = /dringend|notfall|wasserschaden|rohrbruch|gasgeruch|heizung.{0,20}(aus|kaputt|fällt)/i;

/**
 * Macht aus einem Telefonassistent-Gespräch eine strukturierte Rückruf-Notiz
 * (eine pro Conversation, wird bei jedem Turn aktualisiert). Mit AI-Keys
 * extrahiert das Modell JSON; ohne Keys greift eine solide Heuristik.
 */
export async function upsertCallNoteFromConversation(
  userId: string,
  conversationId: string,
  messages: ChatMessage[]
): Promise<void> {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return;

  const extracted =
    resolveProvider("auto") === "mock"
      ? heuristicExtract(messages)
      : await aiExtract(messages).catch(() => heuristicExtract(messages));
  if (!extracted) return;

  await db.callNote.upsert({
    where: { conversationId },
    create: {
      userId,
      conversationId,
      ...extracted,
      durationSec: estimateCallSeconds(messages),
    },
    update: { ...extracted, durationSec: estimateCallSeconds(messages) },
  });
}

function estimateCallSeconds(messages: ChatMessage[]): number {
  const chars = messages.reduce((acc, m) => acc + m.content.length, 0);
  return Math.min(1800, Math.max(30, Math.round(chars / 12)));
}

function heuristicExtract(messages: ChatMessage[]): ExtractedCall | null {
  const userText = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const firstUser = messages.find((m) => m.role === "user")?.content ?? "";

  // Name: "hier ist/spricht X", "mein Name ist X"
  const nameMatch = userText.match(
    /(?:hier ist|hier spricht|mein name ist|ich bin)\s+(?:der |die |frau |herr )?([A-ZÄÖÜ][\wäöüß]+(?:\s+[A-ZÄÖÜ][\wäöüß]+)?)/i
  );
  const phoneMatch = userText.match(PHONE_RE);

  return {
    callerName: nameMatch
      ? nameMatch[1].trim()
      : phoneMatch
        ? "Unbekannter Anrufer"
        : "Anrufer (Playground)",
    callerPhone: phoneMatch ? phoneMatch[0].replace(/\s+/g, " ").trim() : "",
    summary: firstUser.slice(0, 400),
    noteItems: buildNoteItems(userText, phoneMatch?.[0] ?? ""),
    urgency: URGENT_RE.test(userText) ? "dringend" : "normal",
  };
}

function buildNoteItems(userText: string, phone: string): string {
  const items: string[] = [];
  if (URGENT_RE.test(userText)) items.push("Dringenden Rückruf priorisieren");
  else items.push("Rückruf vereinbaren");
  if (phone) items.push(`Rückrufnummer: ${phone.replace(/\s+/g, " ").trim()}`);
  if (/termin/i.test(userText)) items.push("Terminwunsch klären");
  if (/angebot/i.test(userText)) items.push("Angebotsstatus prüfen");
  return items.join("\n");
}

async function aiExtract(messages: ChatMessage[]): Promise<ExtractedCall | null> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "Anrufer" : "Assistent"}: ${m.content}`)
    .join("\n");
  let raw = "";
  for await (const chunk of generateStream({
    system:
      'Du extrahierst aus einem Telefonassistent-Transkript eine Rückruf-Notiz. Antworte NUR mit JSON: {"callerName": string, "callerPhone": string, "summary": string (max 2 Sätze), "noteItems": string (Zeilen mit \\n getrennt, 1-4 Punkte), "urgency": "normal"|"dringend"}. Unbekannte Felder: leerer String.',
    messages: [{ role: "user", content: transcript }],
    temperature: 0,
    model: "auto",
  })) {
    raw += chunk;
  }
  const json = raw.match(/\{[\s\S]*\}/)?.[0];
  if (!json) return null;
  const parsed = JSON.parse(json);
  if (typeof parsed.summary !== "string" || !parsed.summary) return null;
  return {
    callerName: String(parsed.callerName || "Unbekannter Anrufer").slice(0, 120),
    callerPhone: String(parsed.callerPhone || "").slice(0, 40),
    summary: String(parsed.summary).slice(0, 800),
    noteItems: String(parsed.noteItems || "").slice(0, 1000),
    urgency: parsed.urgency === "dringend" ? "dringend" : "normal",
  };
}
