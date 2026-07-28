export const DOC_TYPES = [
  { value: "eingangsrechnung", label: "Eingangsrechnung", labelEn: "Incoming invoice" },
  { value: "ausgangsrechnung", label: "Ausgangsrechnung", labelEn: "Outgoing invoice" },
  { value: "angebot", label: "Angebot", labelEn: "Quote" },
  { value: "lieferschein", label: "Lieferschein", labelEn: "Delivery note" },
  { value: "vertrag", label: "Vertrag", labelEn: "Contract" },
  { value: "sonstiges", label: "Sonstiges", labelEn: "Other" },
] as const;

export const DOC_STATUS = [
  { value: "wartet_freigabe", label: "Wartet auf Freigabe", labelEn: "Awaiting approval", tone: "warning" },
  { value: "angenommen", label: "Angenommen", labelEn: "Accepted", tone: "success" },
  { value: "abgelegt", label: "Abgelegt", labelEn: "Filed", tone: "neutral" },
  { value: "ueberfaellig", label: "Überfällig", labelEn: "Overdue", tone: "danger" },
  { value: "erledigt", label: "Erledigt", labelEn: "Done", tone: "success" },
] as const;

export const DOC_SOURCES = ["mail", "scan", "foto", "manuell"] as const;

export function docTypeLabel(value: string, lang: "de" | "en" = "de"): string {
  const t = DOC_TYPES.find((x) => x.value === value);
  if (!t) return lang === "en" ? "Other" : "Sonstiges";
  return lang === "en" ? t.labelEn : t.label;
}

export function docStatusMeta(value: string) {
  return DOC_STATUS.find((s) => s.value === value) ?? DOC_STATUS[2];
}

/** Demo documents (mockup content) loadable via the empty state. */
export const SAMPLE_DOCUMENTS = [
  {
    title: "RE-2026-0341 · Baustoffe Meyer",
    type: "eingangsrechnung",
    status: "wartet_freigabe",
    amount: 1240.5,
    source: "mail",
    content:
      "Rechnung RE-2026-0341 von Baustoffe Meyer GmbH über 1.240,50 € brutto (Material Baustelle Ahornweg: Fliesenkleber, Fugmasse, Silikon). Zahlungsziel 14 Tage, 2 % Skonto bei Zahlung binnen 7 Tagen.",
  },
  {
    title: "AN-2026-0088 · Fam. Yilmaz",
    type: "angebot",
    status: "angenommen",
    amount: 8470,
    source: "scan",
    content:
      "Angebot AN-2026-0088 an Familie Yilmaz: Badsanierung komplett, 8.470,00 € brutto. Positionen: Demontage, Fliesenarbeiten 12 m², Waschtisch und WC liefern und montieren, Silikonfugen, Entsorgung. Angenommen am 14.07.2026.",
  },
  {
    title: "LS-2026-0217 · Fliesen Runde 2",
    type: "lieferschein",
    status: "abgelegt",
    amount: null,
    source: "foto",
    content:
      "Lieferschein LS-2026-0217, Baustelle Ahornweg: 24 Pakete Feinsteinzeug 60x60 anthrazit, 5 Sack Flexkleber. Angeliefert 21.07.2026, angenommen von J. Mustermann.",
  },
  {
    title: "RE-2026-0322 · Fam. Hoffmann",
    type: "ausgangsrechnung",
    status: "ueberfaellig",
    amount: 2910,
    source: "manuell",
    content:
      "Ausgangsrechnung RE-2026-0322 an Familie Hoffmann über 2.910,00 € brutto (Gäste-WC Renovierung). Fällig seit 12.07.2026 — Zahlungserinnerung empfohlen.",
  },
  {
    title: "Wartungsvertrag · Hausverwaltung Lenz",
    type: "vertrag",
    status: "abgelegt",
    amount: null,
    source: "mail",
    content:
      "Wartungsvertrag mit Hausverwaltung Lenz: jährliche Wartung von 12 Gasthermen in der Lindenstraße 3-9, pauschal 240,00 € je Therme. Nächster Wartungstermin: KW 38.",
  },
] as const;
