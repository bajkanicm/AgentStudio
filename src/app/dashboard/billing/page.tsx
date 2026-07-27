import Link from "next/link";
import { redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { getPlan, PLANS } from "@/lib/plans";
import { COMPANY } from "@/lib/company";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "Abrechnung" };

export default async function BillingPage() {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");
  const current = getPlan(user.plan);

  return (
    <div className="mx-auto max-w-6xl space-y-10 py-2">
      <PageHeader
        title="Abrechnung & Pläne"
        description="Während der Pilotphase werden Planwechsel persönlich vom Team eingerichtet — eine kurze Mail genügt."
      />

      {/* Current plan */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Dein Plan</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            {current.name}
            <Badge className="bg-primary/20 text-primary">{current.price}</Badge>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{current.tagline}</p>
        </div>
        {current.id === "pilot" && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Kostenlos während der Pilotphase — danach dauerhafter Vorzugspreis.
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === current.id;
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-2xl border p-6",
                isCurrent ? "border-primary/60 bg-primary/5" : "border-border bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{plan.name}</h2>
                {isCurrent && (
                  <Badge className="bg-primary text-primary-foreground">Aktuell</Badge>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.priceNote}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button variant="outline" className="mt-6 w-full" disabled>
                  Dein aktueller Plan
                </Button>
              ) : (
                <Button variant={plan.id === "komplett" ? "default" : "outline"} className="mt-6 w-full" asChild>
                  <Link
                    href={`mailto:${COMPANY.pilotEmail}?subject=Planwechsel zu ${plan.name}&body=Hallo! Ich möchte meinen hey247-Workspace auf den Plan „${plan.name}" umstellen.`}
                  >
                    Zu {plan.name} wechseln
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Selbstbedienung per Stripe ist in Vorbereitung. Bis dahin richtet das
        Team Planwechsel innerhalb weniger Stunden ein:{" "}
        <a href={`mailto:${COMPANY.pilotEmail}`} className="text-primary hover:underline">
          {COMPANY.pilotEmail}
        </a>
        . Digitalisierungsförderungen können die Kosten senken — wir helfen beim Antrag.
      </p>
    </div>
  );
}
