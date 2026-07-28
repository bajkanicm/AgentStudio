import { notFound, redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AgentWorkspace } from "@/components/agents/agent-workspace";
import { getLang } from "@/lib/lang";

export const metadata = { title: "Agent playground" };

export default async function AgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const lang = await getLang();
  const agent = await db.agent.findFirst({
    where: { id, userId: user.id },
  });
  if (!agent) notFound();

  return (
    <AgentWorkspace
      lang={lang}
      agent={{
        id: agent.id,
        templateSlug: agent.templateSlug,
        name: agent.name,
        description: agent.description,
        systemPrompt: agent.systemPrompt,
        tone: agent.tone,
        temperature: agent.temperature,
        knowledgeBase: agent.knowledgeBase,
        model: agent.model,
      }}
    />
  );
}
