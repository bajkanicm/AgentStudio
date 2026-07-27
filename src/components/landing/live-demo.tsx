"use client";

import * as React from "react";
import { AGENT_TEMPLATES } from "@/lib/agent-templates";
import { AgentChat } from "@/components/chat/agent-chat";
import { cn } from "@/lib/utils";

/**
 * Interactive landing-page demo: pick one of the 4 agents and talk to it
 * for real via /api/demo-chat (streaming).
 */
export function LiveDemo() {
  const [slug, setSlug] = React.useState(AGENT_TEMPLATES[0].slug);
  const template = AGENT_TEMPLATES.find((t) => t.slug === slug)!;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Agent picker */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        {AGENT_TEMPLATES.map((t) => (
          <button
            key={t.slug}
            onClick={() => setSlug(t.slug)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
              t.slug === slug
                ? "glow-primary border-primary/60 bg-primary/15 text-foreground"
                : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            <span>{t.emoji}</span>
            {t.name}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="glass overflow-hidden rounded-2xl border border-border/80 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-base">
              {template.emoji}
            </span>
            <div>
              <p className="text-sm font-medium leading-none">{template.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Online — try it, it&apos;s live
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
            Live demo
          </span>
        </div>
        <div className="h-[420px] sm:h-[460px]">
          <AgentChat
            key={slug}
            endpoint="/api/demo-chat"
            config={{ templateSlug: slug }}
            greeting={template.demoGreeting}
            suggestions={template.suggestedQuestions}
            compact
          />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        This is the real product — the same agents you&apos;ll customize in your
        dashboard.
      </p>
    </div>
  );
}
