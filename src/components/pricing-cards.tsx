import type { Locale } from "@/lib/locale";

const COPY = {
  de: {
    note: "Geplante Spannen — dein Feedback als Pilotbetrieb entscheidet mit.",
    foerder:
      "Digitalisierungsförderungen der Länder und des Bundes können die Kosten deutlich senken — wir helfen beim Antrag.",
    cards: [
      {
        dark: true,
        label: "Basis",
        price: "99 €",
        unit: "pro Betrieb / Monat",
        text: "Dashboard, Ablage und KI-Chat — das digitale Büro im Kern.",
      },
      {
        dark: false,
        label: "KI-Mitarbeiter",
        price: "ab 29 €",
        unit: "pro Mitarbeiter / Monat",
        text: "Buchhaltung ab 29 €, Telefonassistent 79–149 €. Nur zahlen, was du nutzt.",
      },
      {
        dark: false,
        label: "Einrichtung",
        price: "einmalig",
        unit: "Onboarding-Paket",
        text: "Wir übernehmen deine Daten und richten alles ein — du fängst nicht bei null an.",
      },
    ],
  },
  en: {
    note: "Planned ranges — your feedback as a pilot business shapes them.",
    foerder:
      "German federal and state digitalization grants can significantly lower the cost — we help with the application.",
    cards: [
      {
        dark: true,
        label: "Base",
        price: "€99",
        unit: "per business / month",
        text: "Dashboard, filing and AI chat — the digital office at its core.",
      },
      {
        dark: false,
        label: "AI employees",
        price: "from €29",
        unit: "per employee / month",
        text: "Bookkeeping from €29, phone assistant €79–149. Only pay for what you use.",
      },
      {
        dark: false,
        label: "Setup",
        price: "one-time",
        unit: "Onboarding package",
        text: "We migrate your data and set everything up — you don't start from zero.",
      },
    ],
  },
} as const;

/** Deck-style pricing: Basis / KI-Mitarbeiter / Einrichtung (cream section). */
export function PricingCards({ locale = "de" }: { locale?: Locale }) {
  const t = COPY[locale];
  return (
    <div>
      <p className="mb-8 text-ink-muted">{t.note}</p>
      <div className="grid gap-5 md:grid-cols-3">
        {t.cards.map((c) => (
          <div
            key={c.label}
            className={
              c.dark
                ? "rounded-2xl bg-background p-7 text-foreground shadow-lg"
                : "rounded-2xl bg-cream-card p-7 shadow-sm"
            }
          >
            <p
              className={
                c.dark ? "text-sm font-semibold" : "text-sm font-semibold text-ink-muted"
              }
            >
              {c.label}
            </p>
            <p className="mt-4 text-4xl font-bold tracking-tight">{c.price}</p>
            <p className={c.dark ? "mt-1 text-sm text-muted-foreground" : "mt-1 text-sm text-ink-muted"}>
              {c.unit}
            </p>
            <p
              className={
                c.dark
                  ? "mt-5 text-sm leading-relaxed text-muted-foreground"
                  : "mt-5 text-sm leading-relaxed text-ink-muted"
              }
            >
              {c.text}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-ink-muted">{t.foerder}</p>
    </div>
  );
}
