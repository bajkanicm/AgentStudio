import path from "node:path";

/**
 * Text extraction for uploaded documents:
 *  - PDF  → pdf-parse (embedded text layer)
 *  - Bild → tesseract.js OCR (Deutsch + Englisch), WASM, läuft lokal im
 *    Container — keine externen Dienste, Daten verlassen den Server nicht.
 */
export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<{ text: string; via: "pdf" | "ocr" }> {
  if (mimeType === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      return { text: (result.text ?? "").trim(), via: "pdf" };
    } finally {
      await parser.destroy().catch(() => {});
    }
  }

  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["deu", "eng"], undefined, {
    cachePath: path.join(process.env.UPLOAD_DIR ?? "/tmp", ".tesseract"),
  });
  try {
    const { data } = await worker.recognize(buffer);
    return { text: (data.text ?? "").trim(), via: "ocr" };
  } finally {
    await worker.terminate().catch(() => {});
  }
}

/** Dokumenttyp-Heuristik über den extrahierten Text. */
export function classifyDocument(text: string, fileName: string): string {
  const t = (text + " " + fileName).toLowerCase();
  if (/lieferschein/.test(t)) return "lieferschein";
  if (/angebot|kostenvoranschlag/.test(t)) return "angebot";
  if (/vertrag|vereinbarung/.test(t)) return "vertrag";
  if (/rechnung|invoice|zahlbar|zahlungsziel|rechnungsbetrag/.test(t)) {
    // Ausgangsrechnung nur, wenn es klar nach eigener Rechnung aussieht
    return /unsere rechnung|rechnung an /.test(t) ? "ausgangsrechnung" : "eingangsrechnung";
  }
  return "sonstiges";
}

/** Größten Euro-Betrag aus dem Text ziehen (Brutto-Heuristik). */
export function extractAmount(text: string): number | null {
  const matches = [...text.matchAll(/(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})\s*(?:€|eur)/gi)];
  if (matches.length === 0) return null;
  const values = matches.map(
    (m) => parseFloat(m[1].replace(/\./g, "")) + parseFloat(m[2]) / 100
  );
  return Math.max(...values);
}
