import { Hero } from "@/components/landing/hero";
import { LiveDemo } from "@/components/landing/live-demo";
import {
  ProblemSection,
  ModulesSection,
  AblageChatSection,
  MitarbeiterSection,
  TrustSection,
} from "@/components/landing/deck-sections";
import { PricingCards } from "@/components/pricing-cards";
import { PilotSection } from "@/components/landing/pilot-section";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import type { Locale } from "@/lib/locale";

const COPY = {
  de: {
    demoEyebrow: "Live-Demo",
    demoTitle: "Sprich mit deinen neuen KI-Mitarbeitern",
    demoSub: "Keine Anmeldung nötig. Wähle einen KI-Mitarbeiter und führe ein echtes Gespräch — das ist das Produkt, kein Video.",
    preisEyebrow: "Preise",
    preisTitle: "Was es kostet.",
    faqEyebrow: "Fragen",
    faqTitle: "Klartext, keine Fußnoten",
  },
  en: {
    demoEyebrow: "Live demo",
    demoTitle: "Talk to your new AI employees",
    demoSub: "No sign-up needed. Pick an AI employee and have a real conversation — this is the product, not a video.",
    preisEyebrow: "Pricing",
    preisTitle: "What it costs.",
    faqEyebrow: "Questions",
    faqTitle: "Straight answers, no footnotes",
  },
} as const;

export function LandingPage({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <>
      <Hero locale={locale} />

      <ProblemSection locale={locale} />

      {/* Live demo (dark) */}
      <section id="demo" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t.demoEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.demoTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.demoSub}</p>
          </Reveal>
          <Reveal delay={100}>
            <LiveDemo locale={locale} />
          </Reveal>
        </div>
      </section>

      <ModulesSection locale={locale} />

      <AblageChatSection locale={locale} />

      <MitarbeiterSection locale={locale} />

      <TrustSection locale={locale} />

      {/* Pricing (cream) */}
      <section id="preise" className="scroll-mt-20 bg-cream py-20 text-ink sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t.preisEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.preisTitle}
            </h2>
            <div className="mt-8">
              <PricingCards locale={locale} />
            </div>
          </Reveal>
        </div>
      </section>

      <PilotSection locale={locale} />

      {/* FAQ (dark) */}
      <section id="faq" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t.faqEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.faqTitle}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <FAQ locale={locale} />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <FinalCTA locale={locale} />
        </Reveal>
      </div>
    </>
  );
}
