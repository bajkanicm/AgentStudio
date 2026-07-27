import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/** Original-Datei eines Dokuments ausliefern (nur für den Besitzer). */
export async function GET(_req: NextRequest, { params }: Params) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { id } = await params;
  const doc = await db.document.findFirst({ where: { id, userId: user.id } });
  if (!doc || !doc.filePath) {
    return NextResponse.json({ error: "Keine Datei hinterlegt" }, { status: 404 });
  }
  const root = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
  const abs = path.join(root, doc.filePath);
  if (!abs.startsWith(root)) {
    return NextResponse.json({ error: "Ungültiger Pfad" }, { status: 400 });
  }
  try {
    const data = await readFile(abs);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(doc.fileName || "dokument")}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }
}
