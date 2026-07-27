export const DOC_TYPES = [
  { value: "eingangsrechnung", label: "Eingangsrechnung" },
  { value: "ausgangsrechnung", label: "Ausgangsrechnung" },
  { value: "angebot", label: "Angebot" },
  { value: "lieferschein", label: "Lieferschein" },
  { value: "vertrag", label: "Vertrag" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

export const DOC_STATUS = [
  { value: "wartet_freigabe", label: "Wartet auf Freigabe", tone: "warning" },
  { value: "angenommen", label: "Angenommen", tone: "success" },
  { value: "abgelegt", label: "Abgelegt", tone: "neutral" },
  { value: "ueberfaellig", label: "Überfällig", tone: "danger" },
  { value: "erledigt", label: "Erledigt", tone: "success" },
] as const;

export const DOC_SOURCES = ["mail", "scan", "foto", "manuell"] as const;

export function docTypeLabel(value: string): string {
  return DOC_TYPES.find((t) => t.value === value)?.label ?? "Sonstiges";
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
