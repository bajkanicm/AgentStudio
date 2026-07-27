import Link from "next/link";
import { Logo } from "@/components/logo";
import { localeHref, type Locale } from "@/lib/locale";

const COPY = {
  de: {
    tagline:
      "Das digitale Büro für deinen Betrieb — KI-Mitarbeiter, die Anrufe annehmen, Rechnungen sortieren und Papierkram erledigen.",
    columns: [
      {
        title: "Produkt",
        links: [
          { label: "Live-Demo", href: "/#demo" },
          { label: "Module", href: "/#module" },
          { label: "Preise", href: "/#preise" },
          { label: "Dashboard", href: "/dashboard" },
        ],
      },
      {
        title: "Pilotprogramm",
        links: [
          { label: "Pilotbetrieb werden", href: "/pilot" },
          { label: "Gespräch anfragen", href: "/pilot#anfrage" },
        ],
      },
      {
        title: "KI-Mitarbeiter",
        links: [
          { label: "Telefonassistent", href: "/#demo" },
          { label: "Rechnungen", href: "/#demo" },
          { label: "Buchhaltung", href: "/#demo" },
          { label: "Angebote", href: "/#demo" },
        ],
      },
    ],
    legal: [
      { label: "Datenschutz", href: "/legal/privacy" },
      { label: "AGB", href: "/legal/terms" },
      { label: "Impressum", href: "/legal/imprint" },
    ],
    bottom: "hey247 · ein Produkt der flexC GmbH",
  },
  en: {
    tagline:
      "The digital office for your trade business — AI employees that answer calls, sort invoices and handle paperwork.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Live demo", href: "/#demo" },
          { label: "Modules", href: "/#module" },
          { label: "Pricing", href: "/#preise" },
          { label: "Dashboard", href: "/dashboard" },
        ],
      },
      {
        title: "Pilot program",
        links: [
          { label: "Become a pilot", href: "/pilot" },
          { label: "Request a call", href: "/pilot#anfrage" },
        ],
      },
      {
        title: "AI employees",
        links: [
          { label: "Phone assistant", href: "/#demo" },
          { label: "Invoices", href: "/#demo" },
          { label: "Bookkeeping", href: "/#demo" },
          { label: "Quotes", href: "/#demo" },
        ],
      },
    ],
    legal: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Imprint", href: "/legal/imprint" },
    ],
    bottom: "hey247 · a flexC GmbH product",
  },
} as const;

export function Footer({ locale = "de" }: { locale?: Locale }) {
  const t = COPY[locale];
  return (
    <footer className="border-t border-border/60 bg-black/20">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo href={localeHref(locale, "/")} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["DSGVO-konform", "Serverstandort Deutschland", "GoBD-Ausrichtung"].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          {t.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href.startsWith("/#") || l.href === "/pilot" || l.href === "/pilot#anfrage" ? localeHref(locale, l.href) : l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t.bottom}
          </p>
          <div className="flex gap-5">
            {t.legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
