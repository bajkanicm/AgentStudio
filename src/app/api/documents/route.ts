import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { DOC_SOURCES, DOC_STATUS, DOC_TYPES, SAMPLE_DOCUMENTS } from "@/lib/documents";

const createSchema = z.object({
  title: z.string().min(1, "Titel fehlt").max(200),
  type: z.enum(DOC_TYPES.map((t) => t.value) as [string, ...string[]]),
  status: z.enum(DOC_STATUS.map((s) => s.value) as [string, ...string[]]).default("abgelegt"),
  amount: z.number().nullable().optional(),
  content: z.string().max(100_000).optional().default(""),
  source: z.enum(DOC_SOURCES).default("manuell"),
  docDate: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const type = req.nextUrl.searchParams.get("type");
  const documents = await db.document.findMany({
    where: {
      userId: user.id,
      ...(type && type !== "alle" ? { type } : {}),
      ...(q
        ? { OR: [{ title: { contains: q } }, { content: { contains: q } }] }
        : {}),
    },
    orderBy: { docDate: "desc" },
    take: 200,
  });
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => null);

  // Empty-state helper: load the demo documents in one call.
  if (body?.loadSamples === true) {
    const existing = await db.document.count({ where: { userId: user.id } });
    if (existing === 0) {
      await db.document.createMany({
        data: SAMPLE_DOCUMENTS.map((d, i) => ({
          ...d,
          userId: user.id,
          docDate: new Date(Date.now() - i * 36 * 60 * 60 * 1000),
        })),
      });
    }
    const documents = await db.document.findMany({
      where: { userId: user.id },
      orderBy: { docDate: "desc" },
    });
    return NextResponse.json({ documents }, { status: 201 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Anfrage" },
      { status: 400 }
    );
  }
  const { docDate, ...data } = parsed.data;
  const document = await db.document.create({
    data: {
      ...data,
      amount: data.amount ?? null,
      userId: user.id,
      ...(docDate ? { docDate: new Date(docDate) } : {}),
    },
  });
  return NextResponse.json({ document }, { status: 201 });
}
