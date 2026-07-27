import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const updateSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  customer: z.string().max(120).optional(),
  note: z.string().max(2000).optional(),
  status: z.enum(["neu", "in_arbeit", "wartet_kunde", "erledigt"]).optional(),
  priority: z.enum(["normal", "dringend"]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  const existing = await db.auftrag.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  const auftrag = await db.auftrag.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ auftrag });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const existing = await db.auftrag.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  await db.auftrag.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
