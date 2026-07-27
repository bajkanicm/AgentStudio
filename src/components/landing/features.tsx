import {
  Blocks,
  BrainCircuit,
  Gauge,
  MessageSquareText,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Database,
} from "lucide-react";
import { AGENT_TEMPLATES } from "@/lib/agent-templates";

export function Features() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {/* Templates card — wide */}
      <FeatureCard
        className="lg:col-span-4"
        icon={<Blocks className="size-5" />}
        title="Four agents, ready on day one"
        description="Sales qualification, customer support, content & marketing, and data analysis — each with a proven system prompt you can ship as-is or remix."
      >
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AGENT_TEMPLATES.map((t) => (
            <div
              key={t.slug}
              className="rounded-xl border border-border bg-secondary/40 p-3 text-center transition-colors hover:border-primary/40"
            >
              <span className="text-xl">{t.emoji}</span>
              <p className="mt-1.5 text-xs font-medium">{t.shortName}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                {t.headline}
              </p>
            </div>
          ))}
        </div>
      </FeatureCard>

      <FeatureCard
        className="lg:col-span-2"
        icon={<SlidersHorizontal className="size-5" />}
        title="Total control"
        description="Name, system prompt, tone, temperature, knowledge base — every dial is yours. Save variations and reuse them across projects."
      />

      <FeatureCard
        className="lg:col-span-2"
        icon={<BrainCircuit className="size-5" />}
        title="Claude + GPT routing"
        description="Bring an Anthropic or OpenAI key and route each agent to the best model — or let auto mode decide."
      />

      <FeatureCard
        className="lg:col-span-2"
        icon={<MessageSquareText className="size-5" />}
        title="Real-time playground"
        description="Token-streamed conversations with typing indicators, markdown, code blocks and one-click resets."
      />

      <FeatureCard
        className="lg:col-span-2"
        icon={<Database className="size-5" />}
        title="Knowledge grounding"
        description="Paste docs, FAQs and policies into each agent's knowledge base so answers stay on your facts. File upload coming soon."
      />

      <FeatureCard
        className="lg:col-span-3"
        icon={<Gauge className="size-5" />}
        title="Usage you can see"
        description="Conversations, messages and token spend tracked per month, with plan limits shown right in your dashboard — no surprise bills."
      />

      <FeatureCard
        className="lg:col-span-3"
        icon={<Smartphone className="size-5" />}
        title="Works where you work"
        description="Fully responsive with a mobile-optimized chat. Built API-first, ready to become a PWA or native app."
      />

      <FeatureCard
        className="sm:col-span-2 lg:col-span-6"
        icon={<ShieldCheck className="size-5" />}
        title="Yours to trust"
        description="Your prompts and knowledge bases stay in your workspace. Clerk-secured authentication, isolated per-user data, and an enterprise track with SLAs, security review and white-labeling when you need it."
      />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  className,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 sm:p-7 ${className ?? ""}`}
    >
      <div className="absolute -right-20 -top-20 size-40 rounded-full bg-violet-600/5 blur-3xl transition-colors group-hover:bg-violet-600/10" />
      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
