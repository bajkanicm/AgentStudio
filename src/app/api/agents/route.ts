import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { getTemplate } from "@/lib/agent-templates";
import { getPlan } from "@/lib/plans";

const createSchema = z.object({
  templateSlug: z.string(),
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(""),
  systemPrompt: z.string().min(1).max(20_000),
  tone: z.string().max(40).default("professional"),
  temperature: z.number().min(0).max(1).default(0.7),
  knowledgeBase: z.string().max(500_000).optional().default(""),
  model: z.string().max(20).default("auto"),
});

export async function GET() {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agents = await db.agent.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
  if (!getTemplate(parsed.data.templateSlug)) {
    return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  }

  const plan = getPlan(user.plan);
  if (plan.limits.agents !== -1) {
    const count = await db.agent.count({ where: { userId: user.id } });
    if (count >= plan.limits.agents) {
      return NextResponse.json(
        {
          error: `The ${plan.name} plan allows ${plan.limits.agents} saved agents. Upgrade to save more.`,
        },
        { status: 403 }
      );
    }
  }
  if (
    plan.limits.knowledgeBaseChars !== -1 &&
    parsed.data.knowledgeBase.length > plan.limits.knowledgeBaseChars
  ) {
    return NextResponse.json(
      {
        error: `Knowledge base exceeds the ${plan.name} plan limit of ${plan.limits.knowledgeBaseChars.toLocaleString()} characters.`,
      },
      { status: 403 }
    );
  }

  const agent = await db.agent.create({
    data: { ...parsed.data, userId: user.id },
  });
  return NextResponse.json({ agent }, { status: 201 });
}
