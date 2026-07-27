export type PlanId = "pilot" | "basis" | "komplett";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  limits: {
    messagesPerMonth: number; // -1 = unbegrenzt
    agents: number; // -1 = unbegrenzt
    knowledgeBaseChars: number;
  };
  features: string[];
}

/**
 * App-interne Pläne (Nutzungslimits im Dashboard). Die Marketing-Preise
 * (Basis 99 € / KI-Mitarbeiter ab 29 € / Einrichtung einmalig) leben in
 * PricingCards; hier steht, was ein Workspace technisch darf.
 */
export const PLANS: Plan[] = [
  {
    id: "pilot",
    name: "Pilotbetrieb",
    price: "0 €",
    priceNote: "während der Pilotphase",
    tagline: "Voller Funktionsumfang — dein Feedback ist der Preis.",
    limits: { messagesPerMonth: 1000, agents: 5, knowledgeBaseChars: 200_000 },
    features: [
      "Alle 4 KI-Mitarbeiter",
      "1.000 Nachrichten / Monat",
      "Bis zu 5 gespeicherte KI-Mitarbeiter",
      "Einrichtung und Datenübernahme durch uns",
      "Direkter Draht zum Gründerteam",
    ],
  },
  {
    id: "basis",
    name: "Basis",
    price: "99 €",
    priceNote: "pro Betrieb / Monat",
    tagline: "Dashboard, Ablage und KI-Chat — das digitale Büro im Kern.",
    limits: { messagesPerMonth: 2000, agents: 5, knowledgeBaseChars: 500_000 },
    features: [
      "Alle 4 KI-Mitarbeiter",
      "2.000 Nachrichten / Monat",
      "Bis zu 5 gespeicherte KI-Mitarbeiter",
      "Claude + GPT Modell-Routing",
      "E-Mail-Support",
    ],
  },
  {
    id: "komplett",
    name: "Basis + KI-Mitarbeiter",
    price: "ab 128 €",
    priceNote: "pro Betrieb / Monat",
    tagline: "Basis plus aktivierte KI-Mitarbeiter nach Bedarf.",
    limits: { messagesPerMonth: -1, agents: -1, knowledgeBaseChars: -1 },
    features: [
      "Unbegrenzte Nachrichten & KI-Mitarbeiter",
      "Telefonassistent (79–149 €)",
      "Buchhaltungs-Mitarbeiter (ab 29 €)",
      "DATEV-Übergabe an den Steuerberater",
      "Bevorzugter Support",
    ],
  },
];

/** Alte AgentStudio-Plan-IDs → hey247-Pläne (bestehende Nutzer). */
const LEGACY_PLAN_IDS: Record<string, PlanId> = {
  starter: "pilot",
  growth: "basis",
  enterprise: "komplett",
};

export function getPlan(id: string): Plan {
  const resolved = LEGACY_PLAN_IDS[id] ?? id;
  return PLANS.find((p) => p.id === resolved) ?? PLANS[0];
}
