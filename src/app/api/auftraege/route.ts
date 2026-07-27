import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(1, "Titel fehlt").max(160),
  customer: z.string().max(120).optional().default(""),
  note: z.string().max(2000).optional().default(""),
  status: z.enum(["neu", "in_arbeit", "wartet_kunde", "erledigt"]).default("neu"),
  priority: z.enum(["normal", "dringend"]).default("normal"),
  source: z.enum(["telefon", "mail", "webformular", "manuell"]).default("manuell"),
});

const SAMPLES = [
  { title: "Anfrage Badsanierung – Fotos anbei", customer: "Familie Krause", status: "neu", priority: "normal", source: "mail", note: "Komplettsanierung, ca. 8 m². Fotos im Mail-Anhang." },
  { title: "Heizung fällt aus – Rückrufwunsch", customer: "Hausverwaltung Lenz", status: "neu", priority: "dringend", source: "telefon", note: "Objekt Lindenstr. 7, Heizung ohne Funktion seit heute früh." },
  { title: "Terminvorschlag Rohrreinigung KW 31", customer: "Hausverwaltung Lenz", status: "wartet_kunde", priority: "normal", source: "mail", note: "Zwei Terminvorschläge gesendet, warten auf Bestätigung." },
  { title: "Angebot Badsanierung Krause", customer: "Familie Krause", status: "in_arbeit", priority: "normal", source: "manuell", note: "Aufmaß am Di erledigt, Angebotsentwurf beim Angebots-Mitarbeiter." },
  { title: "Wartung der Gastherme", customer: "Familie Müller", status: "erledigt", priority: "normal", source: "telefon", note: "Thermostat getauscht, Rechnung RE-2026-0339 gestellt." },
];

export async function GET() {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const auftraege = await db.auftrag.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ auftraege });
}

export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const body = await req.json().catch(() => null);

  if (body?.loadSamples === true) {
    if ((await db.auftrag.count({ where: { userId: user.id } })) === 0) {
      await db.auftrag.createMany({
        data: SAMPLES.map((s, i) => ({
          ...s,
          userId: user.id,
          createdAt: new Date(Date.now() - i * 26 * 60 * 60 * 1000),
        })),
      });
    }
    const auftraege = await db.auftrag.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ auftraege }, { status: 201 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Anfrage" },
      { status: 400 }
    );
  }
  const auftrag = await db.auftrag.create({ data: { ...parsed.data, userId: user.id } });
  return NextResponse.json({ auftrag }, { status: 201 });
}
