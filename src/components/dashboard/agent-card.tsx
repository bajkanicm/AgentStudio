import Link from "next/link";
import type { Agent } from "@prisma/client";
import { getTemplate } from "@/lib/agent-templates";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Thermometer } from "lucide-react";

export function AgentCard({
  agent,
  conversationCount,
}: {
  agent: Agent;
  conversationCount?: number;
}) {
  const template = getTemplate(agent.templateSlug);
  return (
    <Link
      href={`/dashboard/agents/${agent.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-lg">
          {template?.emoji ?? "🤖"}
        </span>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {template?.shortName ?? agent.templateSlug}
        </Badge>
      </div>
      <h3 className="mt-3 font-medium leading-tight group-hover:text-primary">
        {agent.name}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {agent.description || template?.description}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Thermometer className="size-3.5" />
          {agent.temperature.toFixed(1)}
        </span>
        {typeof conversationCount === "number" && (
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            {conversationCount} Gespräch{conversationCount === 1 ? "" : "e"}
          </span>
        )}
        <span className="ml-auto capitalize">{agent.tone}</span>
      </div>
    </Link>
  );
}
