import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Locale } from "@/lib/locale";

const FAQS = {
  de: [
    {
      q: "Merken Anrufer, dass eine KI ans Telefon geht?",
      a: "Ja, ganz bewusst: Der Telefonassistent stellt sich immer als KI-Assistent deines Betriebs vor. Das ist ehrlich, rechtlich sauber — und die Erfahrung zeigt: Kunden finden es besser, als auf der Mailbox zu landen. Pro Anruf entsteht eine strukturierte Notiz mit Name, Anliegen und Rückrufnummer.",
    },
    {
      q: "Wo laufen meine Daten und die KI-Modelle?",
      a: "In deutschen Rechenzentren — kein US-Hyperscaler. DSGVO-konform mit Vertrag zur Auftragsverarbeitung, Daten pro Betrieb getrennt und verschlüsselt, kein Training fremder Modelle. Jede KI-Aktion wird protokolliert, die Ablage ist an GoBD ausgerichtet.",
    },
    {
      q: "Ersetzt hey247 meine Handwerkersoftware?",
      a: "Nein. hey247 legt sich als KI- und Organisations-Schicht über das, was du hast: Deine Postfächer bleiben, deine Software bleibt. hey247 nimmt dir das Sortieren, Erfassen und Nachtelefonieren ab.",
    },
    {
      q: "Entscheidet die KI selbstständig?",
      a: "Nein — Mensch entscheidet. Jede Aktion der KI-Mitarbeiter ist im Dashboard sichtbar, und kritische Schritte (z. B. ein Angebot verschicken) bestätigst du selbst.",
    },
    {
      q: "Was kostet hey247?",
      a: "Geplant sind 99 € pro Betrieb und Monat für die Basis (Dashboard, Ablage, KI-Chat) plus KI-Mitarbeiter ab 29 € monatlich — der Telefonassistent liegt je nach Umfang bei 79–149 €. Als Pilotbetrieb nutzt du hey247 in der Pilotphase kostenlos und behältst danach einen dauerhaften Vorzugspreis. Digitalisierungsförderungen können die Kosten zusätzlich senken — wir helfen beim Antrag.",
    },
    {
      q: "Wie aufwendig ist die Einrichtung?",
      a: "Für dich: ein 30-Minuten-Gespräch. Einrichtung und Datenübernahme übernehmen wir — Ablage und Telefonassistent sind startklar, bevor du das erste Mal einloggst.",
    },
  ],
  en: [
    {
      q: "Do callers notice they're talking to an AI?",
      a: "Yes — deliberately. The phone assistant always introduces itself as your business's AI assistant. That's honest, legally clean, and customers prefer it to voicemail. Every call produces a structured note with name, request and callback number.",
    },
    {
      q: "Where do my data and the AI models run?",
      a: "In German data centers — no US hyperscalers. GDPR-compliant with a data-processing agreement, data isolated per business and encrypted, never used to train third-party models. Every AI action is logged; filing follows German GoBD rules.",
    },
    {
      q: "Does hey247 replace my existing trade software?",
      a: "No. hey247 sits on top of what you already use as an AI and organization layer: your mailboxes stay, your software stays. hey247 takes over the sorting, data entry and phone tag.",
    },
    {
      q: "Does the AI act on its own?",
      a: "No — humans decide. Every action of the AI employees is visible in the dashboard, and you confirm critical steps (like sending a quote) yourself.",
    },
    {
      q: "What does hey247 cost?",
      a: "Planned pricing is €99 per business per month for the base (dashboard, filing, AI chat) plus AI employees from €29 monthly — the phone assistant is €79–149 depending on scope. Pilot businesses use hey247 free during the pilot phase and keep a permanent preferred price afterwards.",
    },
    {
      q: "How much setup effort is it for me?",
      a: "One 30-minute call. We handle setup and data migration — filing and the phone assistant are ready before your first login.",
    },
  ],
} as const;

export function FAQ({ locale = "de" }: { locale?: Locale }) {
  return (
    <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
      {FAQS[locale].map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left text-base hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
