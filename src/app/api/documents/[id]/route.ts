import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { DOC_STATUS, DOC_TYPES } from "@/lib/documents";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.enum(DOC_TYPES.map((t) => t.value) as [string, ...string[]]).optional(),
  status: z.enum(DOC_STATUS.map((s) => s.value) as [string, ...string[]]).optional(),
  amount: z.number().nullable().optional(),
  content: z.string().max(100_000).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const existing = await db.document.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  const document = await db.document.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ document });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const existing = await db.document.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  await db.document.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
