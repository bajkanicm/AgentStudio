import Link from "next/link";
import { redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AgentChat } from "@/components/chat/agent-chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, ShieldCheck } from "lucide-react";

export const metadata = { title: "KI-Chat" };

/**
 * "Frag deine Ablage." — mockup layout: Verläufe list on the left,
 * grounded chat panel on the right.
 */
export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");
  const { c: selectedId } = await searchParams;

  const [conversations, docCount] = await Promise.all([
    db.conversation.findMany({
      where: { userId: user.id, agentId: null },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { id: true, title: true, updatedAt: true },
    }),
    db.document.count({ where: { userId: user.id } }),
  ]);

  const selected = selectedId
    ? await db.conversation.findFirst({
        where: { id: selectedId, userId: user.id, agentId: null },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 60 } },
      })
    : null;

  const initialMessages = selected?.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const suggestions =
    docCount > 0
      ? [
          "Was haben wir Familie Yilmaz angeboten?",
          "Welche Rechnungen warten auf Freigabe?",
          "Formulier mir eine Zahlungserinnerung an Familie Hoffmann.",
        ]
      : [
          "Was kannst du für mich tun?",
          "Wie bekomme ich meine Dokumente in die Ablage?",
        ];

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Verläufe */}
      <aside className="flex flex-col rounded-3xl bg-card p-5 shadow-sm lg:min-h-[calc(100dvh-260px)]">
        <Button className="w-full rounded-full" asChild>
          <Link href="/dashboard/chat">
            <Plus className="size-4" />
            Neuer Chat
          </Link>
        </Button>
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Verläufe
        </p>
        <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible">
          {conversations.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">
              Noch keine Chats — stell unten deine erste Frage.
            </p>
          )}
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/chat?c=${conv.id}`}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-2.5 transition-colors lg:shrink",
                conv.id === selected?.id
                  ? "bg-background"
                  : "hover:bg-secondary"
              )}
            >
              <p className="max-w-48 truncate text-sm font-semibold leading-tight lg:max-w-none">
                {conv.title}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                {conv.updatedAt.toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                ·{" "}
                {conv.updatedAt.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-4 hidden border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground lg:block">
          Antworten basieren auf deiner Ablage. Das Sprachmodell läuft in
          Deutschland.
        </p>
      </aside>

      {/* Chat panel */}
      <section className="flex min-h-[60dvh] flex-col rounded-3xl bg-card shadow-sm lg:min-h-[calc(100dvh-260px)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-6 py-4">
          <h1 className="font-logo text-xl font-semibold tracking-tight">
            Frag deine Ablage.
          </h1>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-[#0e3b33] sm:inline-flex">
            <ShieldCheck className="size-3.5" />
            DSGVO-konform · Serverstandort Deutschland
          </span>
        </div>
        <div className="min-h-0 flex-1">
          <AgentChat
            key={selected?.id ?? "new"}
            endpoint="/api/ablage-chat"
            config={{ templateSlug: "ablage" }}
            greeting={
              initialMessages?.length
                ? undefined
                : docCount > 0
                  ? `Moin! Deine Ablage enthält ${docCount} Dokument${docCount === 1 ? "" : "e"} — frag mich etwas dazu, oder lass mich Mails und Angebotstexte formulieren.`
                  : "Moin! Ich antworte auf Basis deiner Ablage — die ist noch leer. Leg unter **Dokumente** etwas an (oder lade dort die Beispiele) und frag mich dann."
            }
            suggestions={initialMessages?.length ? [] : suggestions}
            initialMessages={initialMessages}
            initialConversationId={selected?.id ?? null}
            placeholder="Frag etwas zu deinen Dokumenten, Angeboten, Kunden …"
          />
        </div>
      </section>
    </div>
  );
}
