import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["neu", "erledigt"]).optional(),
  urgency: z.enum(["normal", "dringend"]).optional(),
  noteItems: z.string().max(2000).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  const existing = await db.callNote.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  const call = await db.callNote.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ call });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const existing = await db.callNote.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  await db.callNote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
