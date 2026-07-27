import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { localeHref, type Locale } from "@/lib/locale";
import { ArrowRight, Check, PhoneCall, ShieldCheck } from "lucide-react";

const COPY = {
  de: {
    badge: "Pilotphase — wir suchen Handwerksbetriebe, die mitgestalten",
    h1a: "Das digitale Büro",
    h1b: "für deinen Betrieb.",
    sub: "KI-Mitarbeiter, die Anrufe annehmen, Rechnungen sortieren und Papierkram erledigen — damit du wieder Zeit für dein Handwerk hast.",
    ctaPrimary: "Pilotbetrieb werden",
    ctaSecondary: "Live ausprobieren",
    trust: ["100 % deine Daten", "100 % in Deutschland", "Einrichtung durch uns"],
    callHeader: "Eingehender Anruf",
    callTime: "Di · 09:41",
    callResult: "Rückrufwunsch angelegt",
    callUrgent: "Dringend",
    msg1: "Guten Tag, hier ist der KI-Assistent von Betrieb Berger. Alle sind gerade auf der Baustelle — wie kann ich helfen?",
    msg2: "Bei uns tropft der Heizkörper. Können Sie diese Woche noch kommen?",
    msg3: "Ich trage das als dringenden Rückruf ein. Unter welcher Nummer erreichen wir Sie heute Nachmittag?",
  },
  en: {
    badge: "Pilot phase — we're looking for trade businesses to shape hey247",
    h1a: "The digital office",
    h1b: "for your trade business.",
    sub: "AI employees that answer your calls, sort your invoices and handle your paperwork — so you can get back to your craft.",
    ctaPrimary: "Become a pilot business",
    ctaSecondary: "Try the live demo",
    trust: ["100 % your data", "100 % hosted in Germany", "We set everything up"],
    callHeader: "Incoming call",
    callTime: "Tue · 09:41",
    callResult: "Callback note created",
    callUrgent: "Urgent",
    msg1: "Hello, this is the AI assistant of Berger's workshop. The whole team is on site — how can I help?",
    msg2: "Our radiator is leaking. Could you come by this week?",
    msg3: "I'll log this as an urgent callback. What number can we reach you at this afternoon?",
  },
} as const;

export function Hero({ locale = "de" }: { locale?: Locale }) {
  const t = COPY[locale];
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="animate-aurora absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-orange-600/15 blur-[120px]" />
        <div className="animate-aurora absolute -top-20 right-[8%] h-[320px] w-[380px] rounded-full bg-emerald-700/20 blur-[100px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute top-40 left-[5%] h-[280px] w-[340px] rounded-full bg-teal-700/15 blur-[100px] [animation-delay:-12s]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <Badge
              variant="outline"
              className="animate-fade-up gap-1.5 border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-foreground"
            >
              <ShieldCheck className="size-3.5 text-primary" />
              {t.badge}
            </Badge>

            <h1 className="animate-fade-up mt-6 text-4xl font-bold leading-[1.06] tracking-tight [animation-delay:80ms] sm:text-5xl xl:text-6xl">
              {t.h1a}
              <br />
              <span className="text-gradient">{t.h1b}</span>
            </h1>

            <p className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground [animation-delay:160ms] sm:text-lg lg:mx-0">
              {t.sub}
            </p>

            <div className="animate-fade-up mt-9 flex flex-col items-center gap-3 [animation-delay:240ms] sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" className="glow-primary h-12 w-full px-7 text-base sm:w-auto" asChild>
                <Link href={localeHref(locale, "/pilot")}>
                  {t.ctaPrimary}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 w-full px-7 text-base sm:w-auto" asChild>
                <Link href={localeHref(locale, "/#demo")}>{t.ctaSecondary}</Link>
              </Button>
            </div>

            <div className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground [animation-delay:320ms] lg:justify-start">
              {t.trust.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Phone-call mock (deck slide) */}
          <div className="animate-fade-up relative [animation-delay:400ms]">
            <div className="glow-primary rounded-2xl border border-border/80 bg-cream-card text-ink shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <PhoneCall className="size-3.5" />
                  </span>
                  {t.callHeader}
                </p>
                <p className="font-mono text-xs text-ink-muted">{t.callTime}</p>
              </div>
              <div className="space-y-3 p-5">
                <CallBubble side="left">{t.msg1}</CallBubble>
                <CallBubble side="right">{t.msg2}</CallBubble>
                <CallBubble side="left">{t.msg3}</CallBubble>
              </div>
              <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3.5">
                <p className="text-sm text-ink-muted">{t.callResult}</p>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  {t.callUrgent}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallBubble({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className={side === "right" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          side === "right"
            ? "max-w-[85%] rounded-xl rounded-br-sm bg-background px-4 py-2.5 text-sm text-foreground"
            : "max-w-[85%] rounded-xl rounded-bl-sm bg-ink/5 px-4 py-2.5 text-sm"
        }
      >
        {children}
      </div>
    </div>
  );
}
