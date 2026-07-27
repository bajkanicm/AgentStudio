import Link from "next/link";
import { redirect } from "next/navigation";
import { getTemplate } from "@/lib/agent-templates";
import { PageHeader } from "@/components/dashboard/page-header";
import { CreateAgentForm } from "@/components/agents/create-agent-form";
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
  if (!template) redirect("/dashboard/templates");

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-2">
      <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
        <Link href="/dashboard/templates">
          <ArrowLeft className="size-4" />
          Zurück zu den Vorlagen
        </Link>
      </Button>
      <PageHeader
        title={`Neuer ${template.name}`}
        description="Stell jetzt alles ein oder speichere mit den Voreinstellungen — danach öffnet sich der Playground."
      />
      <CreateAgentForm template={template} />
    </div>
  );
}
