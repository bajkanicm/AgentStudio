import { Star } from "lucide-react";

// Placeholder testimonials — swap with real customer quotes as they come in.
const TESTIMONIALS = [
  {
    quote:
      "We pointed the support agent at our help docs on a Tuesday. By Friday it was resolving 60% of tickets before a human ever saw them.",
    name: "Maya R.",
    role: "Head of Support, Bluepeak SaaS",
    initials: "MR",
  },
  {
    quote:
      "The sales agent qualifies every inbound lead overnight. My AEs wake up to a ranked call list instead of a cold inbox.",
    name: "Daniel K.",
    role: "VP Sales, Orbital CRM",
    initials: "DK",
  },
  {
    quote:
      "I asked their team to build us a custom onboarding agent. Two weeks later it was live inside our product. Zero engineering time on our side.",
    name: "Sofia L.",
    role: "COO, Finlayer",
    initials: "SL",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <figure
          key={t.name}
          className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7"
        >
          <div>
            <div className="flex gap-1" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
              “{t.quote}”
            </blockquote>
          </div>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              {t.initials}
            </span>
            <span>
              <span className="block text-sm font-medium">{t.name}</span>
              <span className="block text-xs text-muted-foreground">{t.role}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
