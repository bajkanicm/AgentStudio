import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pricing tier cards — shared by the landing section and /pricing page. */
export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "relative flex flex-col rounded-2xl border p-7 sm:p-8",
            plan.highlighted
              ? "glow-primary border-primary/60 bg-gradient-to-b from-primary/10 to-card"
              : "border-border bg-card"
          )}
        >
          {plan.highlighted && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
              Most popular
            </Badge>
          )}
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.tagline}</p>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
            <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
          </div>
          <ul className="mt-7 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <Button
            className={cn("mt-8 w-full", plan.highlighted && "glow-primary")}
            variant={plan.highlighted ? "default" : "outline"}
            asChild
          >
            <Link href={plan.ctaHref}>{plan.cta}</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
