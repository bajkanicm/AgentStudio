import Link from "next/link";
import { redirect } from "next/navigation";
import { getTemplate } from "@/lib/agent-templates";
import { PageHeader } from "@/components/dashboard/page-header";
import { CreateAgentForm } from "@/components/agents/create-agent-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New agent" };

export default async function NewAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: slug } = await searchParams;
  const template = getTemplate(slug ?? "");
  if (!template) redirect("/dashboard/templates");

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-6 lg:p-10">
      <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
        <Link href="/dashboard/templates">
          <ArrowLeft className="size-4" />
          Back to templates
        </Link>
      </Button>
      <PageHeader
        title={`New ${template.name}`}
        description="Tune every detail now, or save with the defaults and refine later — the playground opens next."
      />
      <CreateAgentForm template={template} />
    </div>
  );
}
