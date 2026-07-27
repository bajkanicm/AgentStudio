import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BotMark } from "@/components/logo";
import { ArrowRight, Check, Phone, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* Backdrop: grid + aurora blobs */}
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="animate-aurora absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="animate-aurora absolute -top-20 right-[8%] h-[320px] w-[380px] rounded-full bg-fuchsia-600/15 blur-[100px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute top-40 left-[5%] h-[280px] w-[340px] rounded-full bg-indigo-600/15 blur-[100px] [animation-delay:-12s]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="animate-fade-up gap-1.5 border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            Powered by Claude &amp; GPT — with smart model routing
          </Badge>

          <h1 className="animate-fade-up mt-6 text-4xl font-semibold leading-[1.08] tracking-tight [animation-delay:80ms] sm:text-6xl lg:text-7xl">
            AI agents that
            <br />
            <span className="text-gradient">actually do the work</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground [animation-delay:160ms] sm:text-lg">
            Deploy ready-made agents for sales, support, content and data in
            minutes. Customize every detail yourself — or have our team build
            and manage custom agents for you.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row">
            <Button size="lg" className="glow-primary h-12 w-full px-7 text-base sm:w-auto" asChild>
              <Link href="/sign-up">
                Start Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full px-7 text-base sm:w-auto"
              asChild
            >
              <Link href="/done-for-you">
                <Phone className="size-4" />
                Book a Call
              </Link>
            </Button>
          </div>

          <div className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground [animation-delay:320ms]">
            {["No credit card required", "4 ready-made agents", "Live in under 2 minutes"].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-400" />
                  {t}
                </span>
              )
            )}
          </div>
        </div>

        {/* Product mock */}
        <div className="animate-fade-up relative mx-auto mt-16 max-w-4xl [animation-delay:400ms]">
          <div className="glow-primary glass relative overflow-hidden rounded-2xl border border-border/80">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <span className="size-3 rounded-full bg-red-500/70" />
              <span className="size-3 rounded-full bg-yellow-500/70" />
              <span className="size-3 rounded-full bg-green-500/70" />
              <span className="ml-3 flex items-center gap-2 text-xs text-muted-foreground">
                <BotMark className="size-3.5 text-primary" />
                Sales Qualification Agent · Playground
              </span>
            </div>
            {/* Static conversation preview */}
            <div className="space-y-4 p-5 sm:p-8">
              <MockBubble side="right">
                We get ~200 inbound leads a month but my team only calls back a
                fraction of them. Can this help?
              </MockBubble>
              <MockBubble side="left">
                Absolutely — that&apos;s exactly what I do. I&apos;ll engage every lead
                within seconds, qualify them on budget, authority, need and
                timeline, and hand your team a ranked list. Quick question:
                what&apos;s your average deal size?
              </MockBubble>
              <MockBubble side="right">Around $8k ARR.</MockBubble>
              <MockBubble side="left" typing>
                Great — at that deal size, even a 10% lift in callbacks pays for
                itself in week one. Want me to walk you through…
              </MockBubble>
            </div>
          </div>

          {/* Floating agent chips */}
          <FloatingChip className="-left-24 top-10 hidden xl:flex" emoji="🛟" label="Support Agent" note="resolving ticket #4821" />
          <FloatingChip className="-right-28 top-32 hidden xl:flex" emoji="✍️" label="Content Agent" note="drafting launch email" />
          <FloatingChip className="-left-28 bottom-10 hidden xl:flex" emoji="📊" label="Data Agent" note="churn analysis ready" />
        </div>

        {/* Stats */}
        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 text-center">
          {[
            ["1M+", "messages handled"],
            ["500+", "teams onboarded"],
            ["12 hrs", "saved per week, avg"],
          ].map(([stat, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="text-2xl font-semibold tracking-tight sm:text-4xl">{stat}</dd>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function MockBubble({
  side,
  typing,
  children,
}: {
  side: "left" | "right";
  typing?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={side === "right" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          side === "right"
            ? "max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
            : "max-w-[80%] rounded-2xl rounded-bl-md border border-border bg-secondary/60 px-4 py-2.5 text-sm"
        }
      >
        {children}
        {typing && <span className="animate-blink ml-1 inline-block h-3.5 w-[2px] translate-y-0.5 bg-primary" />}
      </div>
    </div>
  );
}

function FloatingChip({
  className,
  emoji,
  label,
  note,
}: {
  className?: string;
  emoji: string;
  label: string;
  note: string;
}) {
  return (
    <div
      className={`absolute items-center gap-2.5 rounded-xl border border-border/80 bg-card px-3.5 py-2.5 shadow-xl shadow-black/30 ${className}`}
    >
      <span className="text-lg">{emoji}</span>
      <span>
        <span className="block text-xs font-medium">{label}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          {note}
        </span>
      </span>
    </div>
  );
}
