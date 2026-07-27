import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { requireDbUser } from "@/lib/auth";
import { classifyDocument, extractAmount, extractText } from "@/lib/extract";

export const runtime = "nodejs";
export const maxDuration = 120; // OCR kann dauern

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function uploadRoot() {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
}

/** Echter Datei-Upload: PDF-Textextraktion bzw. deutsche OCR für Fotos. */
export async function POST(req: NextRequest) {
  const user = await requireDbUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten" }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Erlaubt sind PDF, JPG, PNG und WebP" },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Datei größer als 15 MB" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let text = "";
  let via: "pdf" | "ocr" = "pdf";
  try {
    ({ text, via } = await extractText(buffer, file.type));
  } catch (err) {
    console.error("[upload] extraction failed:", err);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "Dokument";
  const type = classifyDocument(text, file.name);
  const amount = extractAmount(text);

  const document = await db.document.create({
    data: {
      userId: user.id,
      title: baseName,
      type,
      status: type === "eingangsrechnung" ? "wartet_freigabe" : "abgelegt",
      amount,
      content: text.slice(0, 100_000),
      source: via === "ocr" ? "foto" : "upload",
      fileName: file.name,
      mimeType: file.type,
    },
  });

  // Original ablegen (Volume in Docker; ./uploads lokal)
  try {
    const dir = path.join(uploadRoot(), user.id);
    await mkdir(dir, { recursive: true });
    const rel = path.join(user.id, `${document.id}${ext}`);
    await writeFile(path.join(uploadRoot(), rel), buffer);
    await db.document.update({ where: { id: document.id }, data: { filePath: rel } });
  } catch (err) {
    console.error("[upload] file store failed (text is preserved):", err);
  }

  return NextResponse.json(
    {
      document: { ...document, filePath: "" },
      extracted: { via, chars: text.length, type, amount },
    },
    { status: 201 }
  );
}
