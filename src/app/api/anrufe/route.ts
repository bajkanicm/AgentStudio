import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

const createSchema = z.object({
  callerName: z.string().min(1, "Name fehlt").max(120),
  callerPhone: z.string().max(40).optional().default(""),
  summary: z.string().min(1, "Zusammenfassung fehlt").max(2000),
  noteItems: z.string().max(2000).optional().default(""),
  durationSec: z.number().int().min(0).max(7200).optional().default(0),
  urgency: z.enum(["normal", "dringend"]).default("normal"),
});

const SAMPLES = [
  {
    callerName: "Frau Berger",
    callerPhone: "0221 555 8341",
    summary:
      "Rückruf morgen ab 16 Uhr gewünscht. Interesse an Badsanierung, möchte einen Vor-Ort-Termin vereinbaren.",
    noteItems: "Rückruf morgen ab 16 Uhr\nVor-Ort-Termin Badsanierung vorschlagen",
    durationSec: 167,
    urgency: "normal",
    status: "neu",
  },
  {
    callerName: "Hausverwaltung Klein",
    callerPhone: "0221 348 220",
    summary:
      "Wasserschaden im Keller Lindenstraße 7 — Notdienst-Einsatz nötig, Hausmeister ist vor Ort.",
    noteItems: "Notdienst-Einsatz einplanen\nHausmeister kontaktieren: 0221 348 221",
    durationSec: 252,
    urgency: "dringend",
    status: "neu",
  },
  {
    callerName: "Herr Yilmaz",
    callerPhone: "0176 555 9022",
    summary:
      "Angebot Gäste-WC angenommen, Termin für nächste Woche bestätigt.",
    noteItems: "Auftragsbestätigung senden",
    durationSec: 93,
    urgency: "normal",
    status: "erledigt",
  },
  {
    callerName: "Baustoffe Meyer",
    callerPhone: "0221 990 100",
    summary: "Lieferung Fliesen verschiebt sich auf Montag.",
    noteItems: "Bauleitung informieren\nZeitplan Baustelle Ahornweg anpassen",
    durationSec: 58,
    urgency: "normal",
    status: "erledigt",
  },
];

export async function GET() {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const calls = await db.callNote.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ calls });
}

export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const body = await req.json().catch(() => null);

  if (body?.loadSamples === true) {
    if ((await db.callNote.count({ where: { userId: user.id } })) === 0) {
      await db.callNote.createMany({
        data: SAMPLES.map((s, i) => ({
          ...s,
          userId: user.id,
          createdAt: new Date(Date.now() - i * 20 * 60 * 60 * 1000),
        })),
      });
    }
    const calls = await db.callNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ calls }, { status: 201 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Anfrage" },
      { status: 400 }
    );
  }
  const call = await db.callNote.create({ data: { ...parsed.data, userId: user.id } });
  return NextResponse.json({ call }, { status: 201 });
}
