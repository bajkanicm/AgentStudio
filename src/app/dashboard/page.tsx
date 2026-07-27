import Link from "next/link";
import { redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUsage } from "@/lib/usage";
import { AGENT_TEMPLATES } from "@/lib/agent-templates";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AgentCard } from "@/components/dashboard/agent-card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Coins,
  MessageSquare,
  MessagesSquare,
  Plus,
  Handshake,
} from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");

  const [usage, agents] = await Promise.all([
    getUsage(user.id, user.plan),
    db.agent.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { _count: { select: { conversations: true } } },
    }),
  ]);

  const firstName = user.name?.split(" ")[0] ?? "there";
  const msgPct =
    usage.messagesLimit === -1 ? 0 : usage.messagesUsed / usage.messagesLimit;

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-4 sm:p-6 lg:p-10">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's what your agents have been up to this month."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/done-for-you">
                <Handshake className="size-4" />
                Contact Sales
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/templates">
                <Plus className="size-4" />
                New Agent
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Messages this month"
          value={usage.messagesUsed.toLocaleString()}
          hint={
            usage.messagesLimit === -1
              ? "Unlimited on your plan"
              : `of ${usage.messagesLimit.toLocaleString()} on ${usage.planName}`
          }
          progress={usage.messagesLimit === -1 ? undefined : msgPct}
          icon={<MessageSquare className="size-4.5" />}
        />
        <StatCard
          label="Conversations"
          value={usage.conversations.toLocaleString()}
          hint="Started this month"
          icon={<MessagesSquare className="size-4.5" />}
        />
        <StatCard
          label="Tokens used"
          value={formatTokens(usage.tokensUsed)}
          hint="Estimated across all agents"
          icon={<Coins className="size-4.5" />}
        />
        <StatCard
          label="Saved agents"
          value={String(usage.agentsUsed)}
          hint={
            usage.agentsLimit === -1
              ? "Unlimited on your plan"
              : `of ${usage.agentsLimit} available`
          }
          progress={
            usage.agentsLimit === -1 ? undefined : usage.agentsUsed / usage.agentsLimit
          }
          icon={<Bot className="size-4.5" />}
        />
      </div>

      {/* Upgrade banner for starter plan near limit */}
      {usage.planId === "starter" && msgPct > 0.6 && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium">
              You&apos;ve used {Math.round(msgPct * 100)}% of your free messages
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upgrade to Growth for 5,000 messages/month and unlimited agents.
            </p>
          </div>
          <Button className="glow-primary shrink-0" asChild>
            <Link href="/dashboard/billing">Upgrade now</Link>
          </Button>
        </div>
      )}

      {/* My agents */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your agents</h2>
          {agents.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/agents">
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
        {agents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Bot className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-4 font-medium">No agents yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Pick a template below and customize it — your first agent can be
              live in under two minutes.
            </p>
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
      </section>

      {/* Quick-start templates */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Start from a template</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/templates">
              Browse all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AGENT_TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              href={`/dashboard/agents/new?template=${t.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <span className="text-2xl">{t.emoji}</span>
              <h3 className="mt-3 text-sm font-medium group-hover:text-primary">
                {t.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {t.headline}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
