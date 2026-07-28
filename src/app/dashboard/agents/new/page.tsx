import Link from "next/link";
import { redirect } from "next/navigation";
import { getTemplate } from "@/lib/agent-templates";
import { PageHeader } from "@/components/dashboard/page-header";
import { CreateAgentForm } from "@/components/agents/create-agent-form";
import { getLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Neuer KI-Mitarbeiter" };

export default async function NewAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: slug } = await searchParams;
  const template = getTemplate(slug ?? "");
  const lang = await getLang();
  const en = lang === "en";
  if (!template) redirect("/dashboard/templates");

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2">
      <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
        <Link href="/dashboard/templates">
          <ArrowLeft className="size-4" />
          {en ? "Back to templates" : "Zurück zu den Vorlagen"}
        </Link>
      </Button>
      <PageHeader
        title={en ? `New ${template.name}` : `Neuer ${template.name}`}
        description={en ? "Configure everything now or save with the defaults — the playground opens next." : "Stell jetzt alles ein oder speichere mit den Voreinstellungen — danach öffnet sich der Playground."}
      />
      <CreateAgentForm template={template} lang={lang} />
    </div>
  );
}
