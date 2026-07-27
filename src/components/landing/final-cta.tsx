import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import { localeHref, type Locale } from "@/lib/locale";
import { ArrowRight, Mail } from "lucide-react";

const COPY = {
  de: {
    title1: "Weniger Papierkram.",
    title2: "Mehr Handwerk.",
    sub: "Lass uns über deinen Betrieb sprechen — unverbindlich, 30 Minuten.",
    cta: "Pilotbetrieb werden",
    note: "Kostenlose Pilotphase · Einrichtung durch uns · Jederzeit kündbar",
  },
  en: {
    title1: "Less paperwork.",
    title2: "More craft.",
    sub: "Let's talk about your business — no strings attached, 30 minutes.",
    cta: "Become a pilot business",
    note: "Free pilot phase · We set everything up · Cancel anytime",
  },
} as const;

export function FinalCTA({ locale = "de" }: { locale?: Locale }) {
  const t = COPY[locale];
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-background to-card px-6 py-16 text-center sm:px-16">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
    <div
        className="absolute left-1/2 top-0 h-40 w-[480px] -translate-x-1/2 rounded-full bg-orange-500/15 blur-[100px]"
        aria-hidden
      />
      <div className="relative">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
          {t.title1} <span className="text-gradient">{t.title2}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.sub}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="glow-primary h-12 w-full px-8 text-base sm:w-auto" asChild>
            <Link href={localeHref(locale, "/pilot")}>
              {t.cta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 w-full px-8 text-base sm:w-auto" asChild>
            <a href={`mailto:${COMPANY.pilotEmail}`}>
              <Mail className="size-4" />
              {COMPANY.pilotEmail}
            </a>
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">{t.note}</p>
      </div>
    </div>
  );
}
