import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  systemPrompt: z.string().min(1).max(20_000).optional(),
  tone: z.string().max(40).optional(),
  temperature: z.number().min(0).max(1).optional(),
  knowledgeBase: z.string().max(500_000).optional(),
  model: z.string().max(20).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const agent = await db.agent.findFirst({ where: { id, userId: user.id } });
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ agent });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const existing = await db.agent.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const plan = getPlan(user.plan);
  if (
    parsed.data.knowledgeBase !== undefined &&
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

  const agent = await db.agent.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ agent });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await db.agent.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.agent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
