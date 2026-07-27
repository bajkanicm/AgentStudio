import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function FinalCTA() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-violet-950/60 to-card px-6 py-16 text-center sm:px-16">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute left-1/2 top-0 h-40 w-[480px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]"
        aria-hidden
      />
      <div className="relative">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          Put your first agent to work <span className="text-gradient">today</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Start free with ready-made agents, or book a call and let our team
          build exactly what your business needs.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="glow-primary h-12 w-full px-8 text-base sm:w-auto" asChild>
            <Link href="/sign-up">
              Start Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 w-full px-8 text-base sm:w-auto" asChild>
            <Link href="/done-for-you">
              <Phone className="size-4" />
              Book a Call
            </Link>
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Free forever plan · No credit card · Cancel anytime
        </p>
      </div>
    </div>
  );
}
