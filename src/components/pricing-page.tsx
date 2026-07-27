import { PricingCards } from "@/components/pricing-cards";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";
import type { Locale } from "@/lib/locale";

const COPY = {
  de: {
    eyebrow: "Preise",
    title1: "Ehrliche Preise.",
    title2: "Keine Überraschungen.",
    sub: "Geplante Spannen aus der Pilotphase — dein Feedback als Pilotbetrieb entscheidet mit. Pilotbetriebe nutzen hey247 kostenlos und behalten danach einen dauerhaften Vorzugspreis.",
    faqTitle: "Häufige Fragen",
  },
  en: {
    eyebrow: "Pricing",
    title1: "Honest pricing.",
    title2: "No surprises.",
    sub: "Planned ranges from the pilot phase — your feedback as a pilot business shapes them. Pilots use hey247 for free and keep a permanent preferred price afterwards.",
    faqTitle: "Frequent questions",
  },
} as const;

export function PricingPage({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <div className="pt-16">
      <section className="bg-grid bg-grid-fade relative py-16 text-center sm:py-24">
        <div
          className="animate-aurora absolute -top-24 left-1/2 -z-10 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-orange-600/15 blur-[110px]"
          aria-hidden
        />
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
            {t.title1}
            <br />
            <span className="text-gradient">{t.title2}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{t.sub}</p>
        </div>
      </section>

      <section className="bg-cream py-16 text-ink sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <PricingCards locale={locale} />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            {t.faqTitle}
          </h2>
          <FAQ locale={locale} />
        </Reveal>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <FinalCTA locale={locale} />
        </Reveal>
      </div>
    </div>
  );
}
