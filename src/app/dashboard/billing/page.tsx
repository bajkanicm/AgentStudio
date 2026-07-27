import Link from "next/link";
import { redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { getPlan, PLANS } from "@/lib/plans";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");
  const current = getPlan(user.plan);

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-4 sm:p-6 lg:p-10">
      <PageHeader
        title="Billing & plans"
        description="Manage your subscription. Stripe checkout is being finalized — upgrades are activated by our team within a few hours."
      />

      {/* Current plan */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            {current.name}
            <Badge className="bg-primary/20 text-primary">
              {current.price}
              {current.id !== "enterprise" && current.id !== "starter" && "/mo"}
            </Badge>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{current.tagline}</p>
        </div>
        {current.id === "starter" && (
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              Upgrade to unlock more messages and unlimited agents.
            </p>
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === user.plan;
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-2xl border p-6",
                isCurrent
                  ? "border-primary/60 bg-primary/5"
                  : plan.highlighted
                    ? "border-primary/40 bg-card"
                    : "border-border bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{plan.name}</h2>
                {isCurrent && (
                  <Badge className="bg-primary text-primary-foreground">Current</Badge>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.priceNote}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button variant="outline" className="mt-6 w-full" disabled>
                  Your current plan
                </Button>
              ) : plan.id === "enterprise" ? (
                <Button variant="outline" className="mt-6 w-full" asChild>
                  <Link href="/done-for-you">Book a Call</Link>
                </Button>
              ) : (
                <Button
                  className={cn("mt-6 w-full", plan.highlighted && "glow-primary")}
                  asChild
                >
                  <Link
                    href={`mailto:sales@agentstudio.tech?subject=Upgrade to ${plan.name}&body=Hi! I'd like to upgrade my AgentStudio workspace to the ${plan.name} plan.`}
                  >
                    {plan.id === "starter" ? "Downgrade to Starter" : `Upgrade to ${plan.name}`}
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Payments are processed securely. Stripe self-serve checkout is on the
        roadmap — until then, plan changes are handled by our team at{" "}
        <a href="mailto:sales@agentstudio.tech" className="text-primary hover:underline">
          sales@agentstudio.tech
        </a>
        .
      </p>
    </div>
  );
}
