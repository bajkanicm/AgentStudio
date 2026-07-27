"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { localeHref, type Locale } from "@/lib/locale";
import { Menu, X } from "lucide-react";

const COPY = {
  de: {
    links: [
      { href: "/#demo", label: "Live-Demo" },
      { href: "/#module", label: "Module" },
      { href: "/#preise", label: "Preise" },
      { href: "/pilot", label: "Pilotbetrieb" },
    ],
    signIn: "Anmelden",
    cta: "Pilotbetrieb werden",
    switchLabel: "EN",
    switchHref: "/en",
  },
  en: {
    links: [
      { href: "/#demo", label: "Live demo" },
      { href: "/#module", label: "Modules" },
      { href: "/#preise", label: "Pricing" },
      { href: "/pilot", label: "Pilot program" },
    ],
    signIn: "Sign in",
    cta: "Become a pilot",
    switchLabel: "DE",
    switchHref: "/",
  },
} as const;

export function Navbar({ locale = "de" }: { locale?: Locale }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const t = COPY[locale];

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "glass border-b border-border/60 shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href={localeHref(locale, "/")} />

        <div className="hidden items-center gap-1 md:flex">
          {t.links.map((l) => (
            <Link
              key={l.href}
              href={localeHref(locale, l.href)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={t.switchHref}
            className="rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            aria-label={locale === "de" ? "Switch to English" : "Zu Deutsch wechseln"}
          >
            {t.switchLabel}
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">{t.signIn}</Link>
          </Button>
          <Button size="sm" className="glow-primary" asChild>
            <Link href={localeHref(locale, "/pilot")}>{t.cta}</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü umschalten"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-border/60 px-4 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {t.links.map((l) => (
              <Link
                key={l.href}
                href={localeHref(locale, l.href)}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={t.switchHref}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {locale === "de" ? "English version" : "Deutsche Version"}
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                {t.signIn}
              </Link>
            </Button>
            <Button asChild>
              <Link href={localeHref(locale, "/pilot")} onClick={() => setOpen(false)}>
                {t.cta}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
