import Link from "next/link";
import { Button } from "@/components/ui/button";
import { localeHref, type Locale } from "@/lib/locale";
import { ArrowRight } from "lucide-react";

const COPY = {
  de: {
    title: "Werde Pilotbetrieb.",
    text: "Wir suchen eine Handvoll Betriebe, die hey247 von Anfang an mitgestalten. Du bekommst die Plattform früh und vergünstigt — wir bekommen dein ehrliches Feedback.",
    benefits: [
      "Kostenlose Pilotphase — danach dauerhafter Vorzugspreis.",
      "Direkter Draht zum Gründerteam — deine Wünsche fließen in die Entwicklung ein.",
      "Einrichtung und Datenübernahme übernehmen wir.",
    ],
    stepsTitle: "So geht es weiter",
    steps: [
      { title: "Gespräch — 30 Minuten", text: "Deine größten Zeitfresser, ganz konkret." },
      { title: "Einrichtung durch uns", text: "Ablage und Telefonassistent startklar." },
      { title: "Loslegen und mitreden", text: "Alle vier Wochen ein kurzes Feedback-Gespräch." },
    ],
    cta: "Pilotbetrieb werden",
  },
  en: {
    title: "Become a pilot business.",
    text: "We're looking for a handful of businesses to shape hey247 from the start. You get the platform early and at a discount — we get your honest feedback.",
    benefits: [
      "Free pilot phase — then a permanent preferred price.",
      "A direct line to the founding team — your requests shape the roadmap.",
      "We handle setup and data migration.",
    ],
    stepsTitle: "How it continues",
    steps: [
      { title: "A 30-minute call", text: "Your biggest time sinks, in concrete terms." },
      { title: "We set everything up", text: "Filing and phone assistant ready to go." },
      { title: "Start and have a say", text: "A short feedback call every four weeks." },
    ],
    cta: "Become a pilot business",
  },
} as const;

export function PilotSection({ locale = "de" }: { locale?: Locale }) {
  const t = COPY[locale];
  return (
    <section id="pilot" className="scroll-mt-20 bg-cream py-20 text-ink sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">{t.text}</p>
          <ul className="mt-7 space-y-4">
            {t.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono text-sm font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-ink-muted">{b}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" className="glow-primary mt-9 h-12 px-7 text-base" asChild>
            <Link href={localeHref(locale, "/pilot")}>
              {t.cta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="rounded-2xl bg-cream-card p-7 shadow-sm sm:p-9">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t.stepsTitle}
          </p>
          <ol className="mt-6 space-y-7">
            {t.steps.map((s, i) => (
              <li key={s.title} className="flex items-start gap-4">
                <span
                  className={
                    i === 2
                      ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                      : "flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground"
                  }
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{s.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
