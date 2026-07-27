import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const existing = await db.termin.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  await db.termin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
