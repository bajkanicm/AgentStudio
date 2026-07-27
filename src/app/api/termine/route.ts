import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(1, "Titel fehlt").max(160),
  location: z.string().max(160).optional().default(""),
  start: z.string().datetime({ offset: true }),
  durationMin: z.number().int().min(15).max(600).default(60),
  kind: z.enum(["termin", "wartung", "notfall", "intern"]).default("termin"),
});

function sampleData(userId: string) {
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); // this week's Monday
  const at = (day: number, hour: number, min = 0) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + day);
    d.setHours(hour, min, 0, 0);
    return d;
  };
  return [
    { title: "Wartungstermin Gastherme", location: "Familie Müller · Ahornweg 12", start: at(1, 8), durationMin: 90, kind: "wartung" },
    { title: "Aufmaß Badsanierung", location: "Familie Krause · Birkenstr. 4", start: at(1, 14), durationMin: 60, kind: "termin" },
    { title: "Rohrreinigung Objekt Lindenstr.", location: "Hausverwaltung Lenz", start: at(2, 9, 30), durationMin: 120, kind: "termin" },
    { title: "Materialabholung", location: "Baustoffe Meyer", start: at(3, 7, 30), durationMin: 45, kind: "intern" },
    { title: "Leck unter Spüle", location: "Herr Weber · Kastanienallee 9", start: at(4, 11), durationMin: 90, kind: "notfall" },
  ].map((t) => ({ ...t, userId }));
}

export async function GET(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const termine = await db.termin.findMany({
    where: {
      userId: user.id,
      ...(from && to ? { start: { gte: new Date(from), lt: new Date(to) } } : {}),
    },
    orderBy: { start: "asc" },
    take: 300,
  });
  return NextResponse.json({ termine });
}

export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const body = await req.json().catch(() => null);

  if (body?.loadSamples === true) {
    if ((await db.termin.count({ where: { userId: user.id } })) === 0) {
      await db.termin.createMany({ data: sampleData(user.id) });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Anfrage" },
      { status: 400 }
    );
  }
  const termin = await db.termin.create({
    data: { ...parsed.data, start: new Date(parsed.data.start), userId: user.id },
  });
  return NextResponse.json({ termin }, { status: 201 });
}
