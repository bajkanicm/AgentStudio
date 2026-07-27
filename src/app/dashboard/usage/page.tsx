import Link from "next/link";
import { redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUsage } from "@/lib/usage";
import { getPlan } from "@/lib/plans";
import { getTemplate } from "@/lib/agent-templates";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Nutzung" };

export default async function UsagePage() {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");

  const [usage, recentConversations] = await Promise.all([
    getUsage(user.id, user.plan),
    db.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: {
        agent: true,
        _count: { select: { messages: true } },
      },
    }),
  ]);
  const plan = getPlan(user.plan);

  const rows = [
    {
      label: "Nachrichten",
      used: usage.messagesUsed,
      limit: usage.messagesLimit,
      note: "Antworten der KI-Mitarbeiter zählen auf dein Monatslimit.",
    },
    {
      label: "Gespeicherte KI-Mitarbeiter",
      used: usage.agentsUsed,
      limit: usage.agentsLimit,
      note: "Aus Vorlagen angepasste und gespeicherte KI-Mitarbeiter.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-4 sm:p-6 lg:p-10">
      <PageHeader
        title="Nutzung & Limits"
        description={`Plan ${plan.name} · Zähler starten am ${nextResetLabel()} neu`}
        actions={
          getPlan(user.plan).id !== "komplett" && (
            <Button className="glow-primary" asChild>
              <Link href="/dashboard/billing">Pläne ansehen</Link>
            </Button>
          )
        }
      />

      {/* Limit bars */}
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => {
          const pct = row.limit === -1 ? 0 : Math.min(1, row.used / row.limit);
          return (
            <div key={row.label} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="font-medium">{row.label}</h2>
                <p className="text-sm text-muted-foreground">
                  {row.used.toLocaleString()}
                  {row.limit === -1 ? " · unbegrenzt" : ` / ${row.limit.toLocaleString()}`}
                </p>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    row.limit === -1
                      ? "w-full bg-gradient-to-r from-primary/40 to-primary/10"
                      : pct > 0.85
                        ? "bg-amber-400"
                        : "bg-primary"
                  )}
                  style={row.limit === -1 ? undefined : { width: `${pct * 100}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{row.note}</p>
            </div>
          );
        })}
      </div>

      {/* Token summary */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-medium">Token-Verbrauch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Geschätzte Tokens über alle KI-Mitarbeiter diesen Monat.
            </p>
          </div>
          <p className="text-3xl font-semibold tracking-tight">
            {usage.tokensUsed.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent conversations */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Letzte Gespräche</h2>
        {recentConversations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
            Noch keine Gespräche — öffne einen KI-Mitarbeiter und leg los.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Gespräch</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">KI-Mitarbeiter</th>
                  <th className="px-4 py-3 text-right font-medium">Nachrichten</th>
                  <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                    Tokens
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {recentConversations.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-secondary/30">
                    <td className="max-w-0 truncate px-4 py-3">
                      {c.agent ? (
                        <Link
                          href={`/dashboard/agents/${c.agent.id}`}
                          className="hover:text-primary"
                        >
                          {c.title}
                        </Link>
                      ) : (
                        c.title
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {c.agent
                        ? `${getTemplate(c.agent.templateSlug)?.emoji ?? ""} ${c.agent.name}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {c._count.messages}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                      {c.tokensUsed.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function nextResetLabel(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
}
