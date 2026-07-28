import Link from "next/link";
import { AGENT_TEMPLATES } from "@/lib/agent-templates";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export const metadata = { title: "Vorlagen" };

export default async function TemplatesPage() {
  const lang = await getLang();
  const en = lang === "en";
  return (
    <div className="mx-auto max-w-6xl space-y-8 py-2">
      <PageHeader
        title={en ? "Templates" : "Vorlagen"}
        description={en ? "Proven starting points. Pick, customize, deploy — your AI employees." : "Erprobte Startpunkte. Auswählen, anpassen, einsetzen — deine KI-Mitarbeiter."}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {AGENT_TEMPLATES.map((t) => (
          <div
            key={t.slug}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-2xl">
                {t.emoji}
              </span>
              <div>
                <h2 className="font-semibold leading-tight">{t.name}</h2>
                <p className="mt-0.5 text-sm text-primary">{en ? t.headlineEn : t.headline}</p>
              </div>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {en ? t.descriptionEn : t.description}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {(en ? t.capabilitiesEn : t.capabilities).map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              <Button className="flex-1" asChild>
                <Link href={`/dashboard/agents/new?template=${t.slug}`}>
                  {en ? "Use template" : "Vorlage verwenden"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
