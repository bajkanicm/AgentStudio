import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing-cards";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import { Check, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for AgentStudio: free Starter plan, Growth at $49/mo, and fully managed Enterprise agents.",
};

const COMPARISON: {
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}[] = [
  { label: "Ready-made agent templates", values: ["All 4", "All 4", "All 4 + custom"] },
  { label: "Messages per month", values: ["200", "5,000", "Unlimited"] },
  { label: "Saved custom agents", values: ["3", "Unlimited", "Unlimited"] },
  { label: "Customization panel", values: [true, true, true] },
  { label: "Knowledge base size", values: ["20k chars", "500k chars", "Unlimited"] },
  { label: "Claude + GPT model routing", values: [false, true, true] },
  { label: "Usage analytics", values: [false, true, true] },
  { label: "Agents built by our team", values: [false, false, true] },
  { label: "Private integrations (CRM, helpdesk…)", values: [false, false, true] },
  { label: "Dedicated success manager", values: [false, false, true] },
  { label: "SLA & security review", values: [false, false, true] },
  { label: "Support", values: ["Community", "Priority email", "Dedicated"] },
];

export default function PricingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-16 text-center sm:py-24">
        <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
        <div
          className="animate-aurora absolute -top-24 left-1/2 -z-10 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]"
          aria-hidden
        />
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            Start free.
            <br />
            <span className="text-gradient">Scale when it works.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            No credit card to start, no per-seat games, no surprise bills. Move
            up only when your agents are earning their keep.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal>
          <PricingCards />
        </Reveal>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <Reveal>
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Compare plans in detail
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-5 py-4 text-left font-medium">Feature</th>
                  <th className="px-5 py-4 text-center font-medium">Starter</th>
                  <th className="px-5 py-4 text-center font-medium text-primary">
                    Growth
                  </th>
                  <th className="px-5 py-4 text-center font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-3.5 text-muted-foreground">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-5 py-3.5 text-center">
                        {v === true ? (
                          <Check className="mx-auto size-4 text-emerald-400" />
                        ) : v === false ? (
                          <Minus className="mx-auto size-4 text-muted-foreground/40" />
                        ) : (
                          <span className={i === 1 ? "font-medium" : "text-muted-foreground"}>
                            {v}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <Reveal>
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Pricing questions
          </h2>
          <FAQ />
        </Reveal>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <FinalCTA />
        </Reveal>
      </div>
    </div>
  );
}
