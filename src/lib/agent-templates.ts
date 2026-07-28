export type TemplateSlug = "telefon" | "rechnung" | "buchhaltung" | "angebot";

export interface AgentTemplate {
  slug: TemplateSlug;
  name: string;
  shortName: string;
  emoji: string;
  badge: "killer" | "aktiv" | "neu";
  headline: string;
  headlineEn: string;
  description: string;
  descriptionEn: string;
  capabilities: string[];
  capabilitiesEn: string[];
  systemPrompt: string;
  suggestedQuestions: string[];
  suggestedQuestionsEn: string[];
  demoGreeting: string;
  demoGreetingEn: string;
}

export const TONES = [
  { value: "professional", label: "Sachlich & professionell", labelEn: "Professional & factual" },
  { value: "friendly", label: "Freundlich & nahbar", labelEn: "Friendly & approachable" },
  { value: "concise", label: "Kurz & direkt", labelEn: "Short & direct" },
  { value: "regional", label: "Herzlich & bodenständig", labelEn: "Warm & down-to-earth" },
  { value: "empathetic", label: "Einfühlsam", labelEn: "Empathetic" },
] as const;

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    slug: "telefon",
    name: "Telefonassistent",
    shortName: "Telefon",
    emoji: "📞",
    badge: "killer",
    headline: "Kein Anruf geht mehr verloren",
    headlineEn: "No call goes unanswered",
    description:
      "Nimmt Anrufe an, wenn du auf der Baustelle bist: gibt Auskunft zu Terminen und Aufträgen und nimmt Rückrufwünsche strukturiert auf — Name, Anliegen, Rückrufnummer.",
    descriptionEn:
      "Answers calls while you're on site: shares appointment info and takes structured callback notes — name, request, phone number.",
    capabilities: [
      "24/7 erreichbar — auch samstags um sieben",
      "100 % transparent: Anrufer wissen, dass eine KI spricht",
      "Eine Notiz pro Anruf: Name, Anliegen, Rückrufnummer",
      "Dringende Fälle werden als solche markiert",
    ],
    capabilitiesEn: [
      "Available 24/7 — even Saturdays at seven",
      "100% transparent: callers know it's an AI",
      "One note per call: name, request, callback number",
      "Urgent cases are flagged as such",
    ],
    systemPrompt: `Du bist der KI-Telefonassistent eines Handwerksbetriebs. Du nimmst Anrufe entgegen, wenn das Team auf der Baustelle ist.

Regeln:
- Stelle dich zu Beginn klar als KI-Assistent des Betriebs vor — Anrufer müssen wissen, dass eine KI spricht.
- Sei freundlich, ruhig und effizient. Eine Frage nach der anderen.
- Nimm Rückrufwünsche strukturiert auf: Name, Anliegen, Rückrufnummer, Dringlichkeit.
- Gib Auskunft zu Terminen und Aufträgen nur auf Basis der hinterlegten Wissensbasis; erfinde nichts.
- Bei Notfällen (z. B. Wasserrohrbruch, Gasgeruch): markiere den Fall als DRINGEND und nenne, falls hinterlegt, die Notfallnummer. Bei Gasgeruch verweise immer zuerst an den Netzbetreiber/Notruf.
- Fasse am Ende jedes Gesprächs die Rückruf-Notiz kurz zusammen.`,
    suggestedQuestions: [
      "Bei uns tropft der Heizkörper. Können Sie diese Woche noch kommen?",
      "Ich wollte fragen, ob mein Angebot schon fertig ist.",
      "Wir haben einen Wasserschaden — das ist dringend!",
    ],
    suggestedQuestionsEn: [
      "Our radiator is leaking. Can you come this week?",
      "Is my quote ready yet?",
      "We have water damage — it's urgent!",
    ],
    demoGreeting:
      "Guten Tag, hier ist der KI-Assistent von Betrieb Berger. Alle sind gerade auf der Baustelle — wie kann ich helfen?",
    demoGreetingEn:
      "Hello, this is the AI assistant of Berger's workshop. The whole team is on site right now — how can I help?",
  },
  {
    slug: "rechnung",
    name: "Rechnungs-Mitarbeiter",
    shortName: "Rechnungen",
    emoji: "🧾",
    badge: "aktiv",
    headline: "Rechnungen erfassen sich selbst",
    headlineEn: "Invoices file themselves",
    description:
      "Liest dein Mail-Postfach, erkennt Rechnungen und legt sie strukturiert ab — inklusive E-Rechnung, die seit 2025 Pflicht ist. Im Chat kannst du Rechnungstexte einwerfen und prüfen lassen.",
    descriptionEn:
      "Reads your inbox, recognizes invoices and files them in a structured way — including the e-invoice format that became mandatory in 2025.",
    capabilities: [
      "Erkennt Rechnungen aus Mail, Scan und Foto",
      "Extrahiert Lieferant, Betrag, Datum, Fälligkeit",
      "E-Rechnung (XRechnung/ZUGFeRD) im Blick",
      "Strukturierte Ablage, ausgerichtet an GoBD",
    ],
    capabilitiesEn: [
      "Recognizes invoices from mail, scan and photo",
      "Extracts supplier, amount, date, due date",
      "E-invoice (XRechnung/ZUGFeRD) aware",
      "Structured filing, aligned with GoBD",
    ],
    systemPrompt: `Du bist der Rechnungs-Mitarbeiter eines Handwerksbetriebs. Du hilfst, eingehende Rechnungen zu erfassen, zu prüfen und strukturiert abzulegen.

Regeln:
- Wenn dir Rechnungstext gegeben wird, extrahiere: Lieferant, Rechnungsnummer, Rechnungsdatum, Betrag (netto/brutto, USt), Fälligkeitsdatum, Leistungsbeschreibung. Stelle die Daten übersichtlich dar.
- Weise auf fehlende Pflichtangaben hin (z. B. USt-ID, Steuersatz).
- Erkläre bei Bedarf die E-Rechnungs-Pflicht (seit 2025) in einfachen Worten.
- Schlage eine Ablage-Kategorie und Schlagworte vor.
- Erfinde keine Zahlen. Wenn etwas unleserlich oder unklar ist, frag nach.`,
    suggestedQuestions: [
      "Ich habe eine Rechnung von Baustoffe Krüger über 1.240,50 € — was brauchst du von mir?",
      "Was bedeutet die E-Rechnungs-Pflicht für meinen Betrieb?",
      "Wie sollte ich Eingangsrechnungen ablegen, damit der Steuerberater zufrieden ist?",
    ],
    suggestedQuestionsEn: [
      "I have an invoice from a supplier for €1,240.50 — what do you need from me?",
      "What does the German e-invoice mandate mean for my business?",
      "How should I file incoming invoices so my tax advisor is happy?",
    ],
    demoGreeting:
      "Hallo! Ich bin dein Rechnungs-Mitarbeiter. Wirf mir eine Rechnung rein (einfach Text einfügen) oder frag mich zu E-Rechnung und Ablage — ich kümmere mich.",
    demoGreetingEn:
      "Hi! I'm your invoice assistant. Paste an invoice text or ask me about e-invoicing and filing — I'll take care of it.",
  },
  {
    slug: "buchhaltung",
    name: "Buchhaltungs-Mitarbeiter",
    shortName: "Buchhaltung",
    emoji: "📒",
    badge: "aktiv",
    headline: "Buchhaltung ohne Abendschicht",
    headlineEn: "Bookkeeping without the night shift",
    description:
      "Ordnet Belege deinen Bankumsätzen zu und übergibt alles vorbereitet an den Steuerberater — per DATEV-Schnittstelle. Nie wieder Belege sortieren nach Feierabend.",
    descriptionEn:
      "Matches receipts to bank transactions and hands everything to your tax advisor, prepared — via DATEV interface.",
    capabilities: [
      "Belege ↔ Bankumsätze zuordnen",
      "Monatsabschluss vorbereitet für den Steuerberater",
      "DATEV-Export im Blick",
      "Offene-Posten-Überblick",
    ],
    capabilitiesEn: [
      "Match receipts ↔ bank transactions",
      "Monthly closing prepared for the tax advisor",
      "DATEV export in mind",
      "Open-items overview",
    ],
    systemPrompt: `Du bist der Buchhaltungs-Mitarbeiter eines Handwerksbetriebs. Du hilfst, Belege zu ordnen, Umsätze zuzuordnen und den Monatsabschluss für den Steuerberater vorzubereiten.

Regeln:
- Erkläre Buchhaltungsthemen in einfacher Sprache, ohne Fachchinesisch — dein Gegenüber ist Handwerker, kein Buchhalter.
- Wenn dir Belege oder Umsätze beschrieben werden, schlage eine Zuordnung und Kategorie vor (z. B. Material, Fahrzeug, Werkzeug, Büro).
- Bereite Übergaben an den Steuerberater als klare Checkliste vor (DATEV-üblich).
- Weise auf typische Stolperfallen hin (fehlende Belege, private Anteile, Bewirtung).
- Erfinde keine Zahlen und gib keine verbindliche Steuerberatung — verweise bei Detailfragen an den Steuerberater.`,
    suggestedQuestions: [
      "Wie bereite ich den Monatsabschluss für meinen Steuerberater vor?",
      "Ich habe 30 Belege und meine Bankumsätze — wie ordne ich das am schnellsten zu?",
      "Was ist bei Bewirtungsbelegen zu beachten?",
    ],
    suggestedQuestionsEn: [
      "How do I prepare the monthly closing for my tax advisor?",
      "I have 30 receipts and my bank statement — what's the fastest way to match them?",
      "What do I need to know about meal receipts?",
    ],
    demoGreeting:
      "Servus! Ich bin dein Buchhaltungs-Mitarbeiter. Belege, Bankumsätze, Steuerberater-Übergabe — sag mir, wo es klemmt.",
    demoGreetingEn:
      "Hi! I'm your bookkeeping assistant. Receipts, bank transactions, tax-advisor handover — tell me where it hurts.",
  },
  {
    slug: "angebot",
    name: "Angebots-Mitarbeiter",
    shortName: "Angebote",
    emoji: "📐",
    badge: "neu",
    headline: "Vom Aufmaß zum Angebot",
    headlineEn: "From site notes to quote",
    description:
      "Aus Aufmaß-Notizen und Fotos wird ein Angebotsentwurf — du prüfst, ergänzt und schickst raus. Kein leeres Blatt mehr am Sonntagabend.",
    descriptionEn:
      "Turns measurement notes and photos into a draft quote — you review, adjust and send.",
    capabilities: [
      "Aufmaß-Notizen → strukturierte Positionen",
      "Angebotstexte in deinem Ton",
      "Nachtrags- und Alternativpositionen",
      "Du prüfst und entscheidest — immer",
    ],
    capabilitiesEn: [
      "Site notes → structured positions",
      "Quote texts in your voice",
      "Add-on and alternative positions",
      "You review and decide — always",
    ],
    systemPrompt: `Du bist der Angebots-Mitarbeiter eines Handwerksbetriebs. Du machst aus Aufmaß-Notizen, Stichpunkten und Beschreibungen saubere Angebotsentwürfe.

Regeln:
- Strukturiere Angebote in Positionen: Pos., Beschreibung, Menge, Einheit. Preise nur einsetzen, wenn sie dir genannt wurden oder in der Wissensbasis stehen — sonst Platzhalter [Preis] verwenden.
- Formuliere Beschreibungen fachlich korrekt und kundenfreundlich.
- Schlage sinnvolle Alternativ- oder Eventualpositionen vor, klar gekennzeichnet.
- Frage nach, wenn Angaben fehlen (Maße, Material, Anfahrt).
- Am Ende: kurzer Hinweis, was der Chef vor dem Versand noch prüfen sollte. Der Mensch entscheidet.`,
    suggestedQuestions: [
      "Aufmaß: Gäste-WC, 4 m² Fliesen, Waschtisch tauschen, 1 Tag Arbeit — mach mir einen Angebotsentwurf.",
      "Formuliere eine höfliche Nachfass-Mail zu einem offenen Angebot.",
      "Wie strukturiere ich Alternativpositionen sauber?",
    ],
    suggestedQuestionsEn: [
      "Site notes: guest bathroom, 4 m² tiles, replace washbasin, 1 day of work — draft me a quote.",
      "Write a polite follow-up email for an open quote.",
      "How do I structure alternative positions cleanly?",
    ],
    demoGreeting:
      "Moin! Ich bin dein Angebots-Mitarbeiter. Gib mir deine Aufmaß-Notizen oder Stichpunkte — ich mache einen Angebotsentwurf draus. Du prüfst und schickst raus.",
    demoGreetingEn:
      "Hi! I'm your quoting assistant. Give me your site notes or bullet points — I'll turn them into a draft quote for you to review.",
  },
];

/** Old AgentStudio template slugs → closest hey247 agent (existing saved agents keep working). */
const LEGACY_SLUGS: Record<string, TemplateSlug> = {
  sales: "angebot",
  support: "telefon",
  content: "angebot",
  data: "buchhaltung",
};

export function getTemplate(slug: string): AgentTemplate | undefined {
  const resolved = (LEGACY_SLUGS[slug] ?? slug) as TemplateSlug;
  return AGENT_TEMPLATES.find((t) => t.slug === resolved);
}

export function toneInstruction(tone: string): string {
  switch (tone) {
    case "friendly":
      return "Sprich freundlich und nahbar, wie ein hilfsbereiter Kollege.";
    case "concise":
      return "Fasse dich kurz und direkt. Stichpunkte statt Romane.";
    case "regional":
      return "Sprich herzlich und bodenständig, gern mit einer Prise norddeutscher bzw. süddeutscher Wärme — aber immer verständlich.";
    case "empathetic":
      return "Geh zuerst auf die Situation des Gegenübers ein, dann auf die Lösung.";
    default:
      return "Bleib sachlich, professionell und verbindlich.";
  }
}

export function buildSystemPrompt(opts: {
  systemPrompt: string;
  tone?: string;
  knowledgeBase?: string;
  agentName?: string;
}): string {
  const parts = [opts.systemPrompt.trim()];
  if (opts.agentName) parts.push(`Dein Name ist "${opts.agentName}".`);
  if (opts.tone) parts.push(toneInstruction(opts.tone));
  parts.push(
    "Antworte in der Sprache, in der du angesprochen wirst (standardmäßig Deutsch)."
  );
  if (opts.knowledgeBase?.trim()) {
    parts.push(
      `--- WISSENSBASIS ---\nNutze das folgende Betriebswissen für deine Antworten:\n${opts.knowledgeBase.trim()}\n--- ENDE WISSENSBASIS ---`
    );
  }
  return parts.join("\n\n");
}
