import Link from "next/link";
import { redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlan } from "@/lib/plans";
import { PageHeader } from "@/components/dashboard/page-header";
import { AgentCard } from "@/components/dashboard/agent-card";
import { Button } from "@/components/ui/button";
import { Bot, Plus } from "lucide-react";

export const metadata = { title: "KI-Mitarbeiter" };

export default async function AgentsPage() {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");

  const agents = await db.agent.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { conversations: true } } },
  });
  const plan = getPlan(user.plan);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-10">
      <PageHeader
        title="Deine KI-Mitarbeiter"
        description={
          plan.limits.agents === -1
            ? `${agents.length} gespeichert · unbegrenzt im Plan ${plan.name}`
            : `${agents.length} von ${plan.limits.agents} im Plan ${plan.name}`
        }
        actions={
          <Button asChild>
            <Link href="/dashboard/templates">
              <Plus className="size-4" />
              Neuer KI-Mitarbeiter
            </Link>
          </Button>
        }
      />

      {agents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Bot className="mx-auto size-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">Noch keine KI-Mitarbeiter gespeichert</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Starte mit einer Vorlage und pass sie an — deine KI-Mitarbeiter wohnen dann hier, bereit zum Einsatz.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/dashboard/templates">Vorlagen ansehen</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              conversationCount={agent._count.conversations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
