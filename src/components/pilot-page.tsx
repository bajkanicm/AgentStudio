import { CustomRequestForm } from "@/components/custom-request-form";
import { Reveal } from "@/components/landing/reveal";
import { COMPANY } from "@/lib/company";
import type { Locale } from "@/lib/locale";
import { ClipboardList, Hammer, LifeBuoy, Rocket } from "lucide-react";

const COPY = {
  de: {
    eyebrow: "Pilotprogramm",
    title1: "Werde",
    title2: "Pilotbetrieb.",
    sub: "Wir suchen eine Handvoll Handwerksbetriebe, die hey247 von Anfang an mitgestalten. Du bekommst die Plattform früh und vergünstigt — wir bekommen dein ehrliches Feedback.",
    processTitle: "Vom ersten Gespräch zum digitalen Büro",
    process: [
      {
        icon: ClipboardList,
        title: "Gespräch",
        time: "30 Minuten",
        text: "Deine größten Zeitfresser, ganz konkret — kein Verkaufsgespräch, sondern eine Bestandsaufnahme.",
      },
      {
        icon: Hammer,
        title: "Einrichtung",
        time: "durch uns",
        text: "Wir übernehmen deine Daten und richten Ablage und Telefonassistent startklar ein — du fängst nicht bei null an.",
      },
      {
        icon: Rocket,
        title: "Loslegen",
        time: "ab Tag 1",
        text: "Du nutzt hey247 im Alltag — kostenlos während der gesamten Pilotphase.",
      },
      {
        icon: LifeBuoy,
        title: "Mitreden",
        time: "alle 4 Wochen",
        text: "Ein kurzes Feedback-Gespräch mit dem Gründerteam. Deine Wünsche fließen direkt in die Entwicklung ein.",
      },
    ],
    benefitsTitle: "Was du als Pilotbetrieb bekommst",
    benefits: [
      "Kostenlose Pilotphase — danach dauerhafter Vorzugspreis",
      "Direkter Draht zum Gründerteam",
      "Einrichtung und Datenübernahme durch uns",
      "100 % deine Daten, 100 % in Deutschland",
    ],
    formTitle: "Erzähl uns von deinem Betrieb",
    formSub: "Wir melden uns innerhalb eines Werktags mit einem Terminvorschlag für dein Gespräch.",
    mailNote: "Lieber direkt per Mail?",
  },
  en: {
    eyebrow: "Pilot program",
    title1: "Become a",
    title2: "pilot business.",
    sub: "We're looking for a handful of trade businesses to shape hey247 from the start. You get the platform early and at a discount — we get your honest feedback.",
    processTitle: "From first call to digital office",
    process: [
      {
        icon: ClipboardList,
        title: "Call",
        time: "30 minutes",
        text: "Your biggest time sinks, concretely — an assessment, not a sales pitch.",
      },
      {
        icon: Hammer,
        title: "Setup",
        time: "done by us",
        text: "We migrate your data and set up filing and the phone assistant — you don't start from zero.",
      },
      {
        icon: Rocket,
        title: "Get going",
        time: "from day 1",
        text: "You use hey247 day to day — free for the entire pilot phase.",
      },
      {
        icon: LifeBuoy,
        title: "Have a say",
        time: "every 4 weeks",
        text: "A short feedback call with the founding team. Your requests shape the roadmap directly.",
      },
    ],
    benefitsTitle: "What you get as a pilot",
    benefits: [
      "Free pilot phase — then a permanent preferred price",
      "A direct line to the founding team",
      "Setup and data migration done by us",
      "100% your data, 100% hosted in Germany",
    ],
    formTitle: "Tell us about your business",
    formSub: "We'll reply within one business day with a proposed time for your call.",
    mailNote: "Prefer email?",
  },
} as const;

export function PilotPage({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-grid bg-grid-fade relative overflow-hidden py-16 sm:py-24">
        <div
          className="animate-aurora absolute -top-24 left-1/2 -z-10 h-[340px] w-[600px] -translate-x-1/2 rounded-full bg-orange-600/15 blur-[110px]"
          aria-hidden
        />
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
            {t.title1} <span className="text-gradient">{t.title2}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{t.sub}</p>
        </div>
      </section>

      {/* Process (cream) */}
      <section className="bg-cream py-16 text-ink sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t.processTitle}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.process.map((step, i) => (
                <div key={step.title} className="relative rounded-2xl bg-cream-card p-6 shadow-sm">
                  <span className="absolute right-5 top-4 font-mono text-3xl font-bold text-ink/10">
                    {i + 1}
                  </span>
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <step.icon className="size-5" />
                  </span>
                  <p className="mt-4 font-mono text-xs uppercase tracking-wide text-primary">
                    {step.time}
                  </p>
                  <h3 className="mt-1 font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits + form */}
      <section id="anfrage" className="scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8">
          <Reveal className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t.benefitsTitle}
            </h2>
            <ul className="mt-8 space-y-5">
              {t.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <span className="mt-0.5 font-mono text-sm font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-muted-foreground">
              {t.mailNote}{" "}
              <a href={`mailto:${COMPANY.pilotEmail}`} className="text-primary hover:underline">
                {COMPANY.pilotEmail}
              </a>
            </p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-xl font-semibold">{t.formTitle}</h2>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.formSub}</p>
              <CustomRequestForm locale={locale} />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
