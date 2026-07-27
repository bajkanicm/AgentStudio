import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake, Rocket, Check } from "lucide-react";

/** The two ways to use AgentStudio: self-serve vs done-for-you. */
export function Paths() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Self-serve */}
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40 sm:p-10">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-violet-600/10 blur-3xl transition-opacity group-hover:opacity-150" />
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Rocket className="size-5" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">Self-serve</h3>
        <p className="mt-1 text-sm font-medium text-primary">Live today, free to start</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Pick a ready-made agent, make it yours in the customization panel, and
          put it to work in the chat playground — all in one sitting.
        </p>
        <ul className="mt-6 space-y-2.5 text-sm">
          {[
            "4 battle-tested agent templates",
            "Edit the prompt, tone, temperature & knowledge base",
            "Save unlimited variations of your agents",
            "Streamed responses from Claude or GPT",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
        <Button className="mt-8" asChild>
          <Link href="/sign-up">
            Start Free
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* Done-for-you */}
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-violet-950/40 p-8 transition-colors hover:border-fuchsia-500/40 sm:p-10">
        <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-400">
          <Handshake className="size-5" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">Done-for-you</h3>
        <p className="mt-1 text-sm font-medium text-fuchsia-400">
          Built and managed by our team
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Want AI agents without the setup? Tell us your workflow and we design,
          build, integrate and manage custom agents for your business.
        </p>
        <ul className="mt-6 space-y-2.5 text-sm">
          {[
            "Discovery call to map your highest-ROI use case",
            "Custom prompts, tools & integrations (CRM, helpdesk…)",
            "Ongoing tuning, monitoring & support",
            "Launch in weeks, not quarters",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="mt-8 border-fuchsia-500/40 hover:bg-fuchsia-500/10"
          asChild
        >
          <Link href="/done-for-you">
            Get a Custom Agent
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
