import type { Locale } from "@/lib/locale";
import {
  PhoneMissed,
  Mailbox,
  MoonStar,
  CalendarX,
  LayoutDashboard,
  FolderOpen,
  MessagesSquare,
  PhoneCall,
  Bot,
  CalendarDays,
  Inbox,
  Megaphone,
  FileSearch,
  ScanText,
  ShieldCheck,
  Lock,
  ScrollText,
  Server,
} from "lucide-react";

/* ────────────────────────── Problem (cream) ────────────────────────── */

const PROBLEM = {
  de: {
    title: "Der Papierkram frisst deine Woche.",
    sub: "Vier Baustellen, die nichts mit deinem Handwerk zu tun haben.",
    items: [
      {
        icon: PhoneMissed,
        title: "Verpasste Anrufe",
        text: "Du stehst auf der Baustelle, das Telefon klingelt im Büro. Jeder verpasste Anruf ist potenziell ein verlorener Auftrag.",
      },
      {
        icon: Mailbox,
        title: "Papier- und Mail-Chaos",
        text: "Lieferscheine im Handschuhfach, Rechnungen im Postfach, Angebote im Ordner. Nichts findet sich wieder.",
      },
      {
        icon: MoonStar,
        title: "Buchhaltung am Abend",
        text: "Belege sortieren, Umsätze zuordnen, alles für den Steuerberater vorbereiten — nach Feierabend, jeden Monat.",
      },
      {
        icon: CalendarX,
        title: "Keine Zeit für Kunden von morgen",
        text: "Website, Google-Profil, Bewertungen — wichtig, aber es bleibt liegen, weil der Tag voll ist.",
      },
    ],
  },
  en: {
    title: "Paperwork eats your week.",
    sub: "Four construction sites that have nothing to do with your craft.",
    items: [
      {
        icon: PhoneMissed,
        title: "Missed calls",
        text: "You're on site, the phone rings in the office. Every missed call is potentially a lost job.",
      },
      {
        icon: Mailbox,
        title: "Paper and email chaos",
        text: "Delivery notes in the glovebox, invoices in the inbox, quotes in a binder. Nothing can be found again.",
      },
      {
        icon: MoonStar,
        title: "Bookkeeping after hours",
        text: "Sorting receipts, matching transactions, preparing everything for the tax advisor — every month, after closing time.",
      },
      {
        icon: CalendarX,
        title: "No time for tomorrow's customers",
        text: "Website, Google profile, reviews — important, but they stay undone because the day is full.",
      },
    ],
  },
} as const;

export function ProblemSection({ locale = "de" }: { locale?: Locale }) {
  const t = PROBLEM[locale];
  return (
    <section className="bg-cream py-20 text-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t.title}
        </h2>
        <p className="mt-3 max-w-2xl text-ink-muted">{t.sub}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {t.items.map((item, i) => (
            <div key={item.title} className="rounded-2xl bg-cream-card p-7 shadow-sm">
              <p className="font-mono text-sm font-semibold text-primary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 flex items-center gap-2.5 text-lg font-bold">
                <item.icon className="size-5 text-primary" />
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── Modules (cream) ────────────────────────── */

const MODULES = {
  de: {
    title: "hey247 ist dein digitales Büro.",
    sub: "Eine Oberfläche statt Tool-Chaos. hey247 ersetzt deine Handwerkersoftware nicht — es legt sich als KI- und Organisations-Schicht darüber.",
    wave1: "Welle 1",
    wave2: "Welle 2",
    wave3: "Welle 3",
    killer: "Killerfeature",
    items: [
      { icon: LayoutDashboard, title: "Dashboard", text: "Tagesüberblick: Dokumente, Aufgaben, Agenten-Aktivität.", wave: 1 },
      { icon: FolderOpen, title: "Ablage", text: "Sichere Dokumentenablage mit Suche und OCR.", wave: 1 },
      { icon: MessagesSquare, title: "KI-Chat", text: "Antworten aus deinen eigenen Unterlagen.", wave: 1 },
      { icon: PhoneCall, title: "Telefonassistent", text: "Nimmt Anrufe an, wenn du auf der Baustelle bist.", wave: 0 },
      { icon: Bot, title: "KI-Mitarbeiter", text: "Rechnungen, Buchhaltung, Angebote — automatisch vorbereitet.", wave: 2 },
      { icon: CalendarDays, title: "Kalender & Mail", text: "Deine Postfächer bleiben — hey247 dockt an.", wave: 2 },
      { icon: Inbox, title: "Anfragenboard", text: "Jede Kundenanfrage wird ein Vorgang — nichts geht unter.", wave: 3 },
      { icon: Megaphone, title: "Marketing", text: "Website, Google-Profil und Social Media im Griff.", wave: 3 },
    ],
  },
  en: {
    title: "hey247 is your digital office.",
    sub: "One surface instead of tool chaos. hey247 doesn't replace your trade software — it sits on top as an AI and organization layer.",
    wave1: "Wave 1",
    wave2: "Wave 2",
    wave3: "Wave 3",
    killer: "Killer feature",
    items: [
      { icon: LayoutDashboard, title: "Dashboard", text: "Daily overview: documents, tasks, agent activity.", wave: 1 },
      { icon: FolderOpen, title: "Filing", text: "Secure document storage with search and OCR.", wave: 1 },
      { icon: MessagesSquare, title: "AI chat", text: "Answers straight from your own documents.", wave: 1 },
      { icon: PhoneCall, title: "Phone assistant", text: "Answers calls while you're on site.", wave: 0 },
      { icon: Bot, title: "AI employees", text: "Invoices, bookkeeping, quotes — prepared automatically.", wave: 2 },
      { icon: CalendarDays, title: "Calendar & mail", text: "Your mailboxes stay — hey247 docks on.", wave: 2 },
      { icon: Inbox, title: "Request board", text: "Every customer request becomes a case — nothing gets lost.", wave: 3 },
      { icon: Megaphone, title: "Marketing", text: "Website, Google profile and social media under control.", wave: 3 },
    ],
  },
} as const;

export function ModulesSection({ locale = "de" }: { locale?: Locale }) {
  const t = MODULES[locale];
  const waveLabel = (w: number) =>
    w === 0 ? t.killer : w === 1 ? t.wave1 : w === 2 ? t.wave2 : t.wave3;
  return (
    <section id="module" className="scroll-mt-20 bg-cream py-20 text-ink sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t.title}
        </h2>
        <p className="mt-3 max-w-3xl text-ink-muted">{t.sub}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((m) => {
            const killer = m.wave === 0;
            return (
              <div
                key={m.title}
                className={
                  killer
                    ? "rounded-2xl bg-background p-6 text-foreground shadow-lg"
                    : "rounded-2xl bg-cream-card p-6 shadow-sm"
                }
              >
                <h3 className="flex items-center gap-2 font-bold">
                  <m.icon className={killer ? "size-4.5 text-primary" : "size-4.5 text-primary"} />
                  {m.title}
                </h3>
                <p
                  className={
                    killer
                      ? "mt-2 min-h-16 text-sm leading-relaxed text-muted-foreground"
                      : "mt-2 min-h-16 text-sm leading-relaxed text-ink-muted"
                  }
                >
                  {m.text}
                </p>
                <span
                  className={
                    killer
                      ? "mt-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                      : m.wave === 1
                        ? "mt-3 inline-block rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-medium text-emerald-800"
                        : "mt-3 inline-block rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink-muted"
                  }
                >
                  {waveLabel(m.wave)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Ablage + KI-Chat features (cream) ─────────────────── */

const ABLAGE = {
  de: {
    ablageTitle: "Deine Ablage sortiert sich selbst.",
    ablageText:
      "Foto vom Lieferschein, Rechnung aus der Mail, Vertrag vom Scanner — alles landet am richtigen Ort. Automatisch erkannt, verschlagwortet und wiederfindbar.",
    ablagePoints: [
      { icon: ScanText, text: "Texterkennung auch für Fotos von der Baustelle" },
      { icon: FileSearch, text: "Volltextsuche über alle Dokumente" },
      { icon: ScrollText, text: "Revisionssichere Ablage, ausgerichtet an GoBD" },
    ],
    docs: [
      { title: "Rechnung — Baustoffe Krüger", meta: "heute · aus Mail-Postfach", amount: "1.240,50 €" },
      { title: "Lieferschein — Baustelle Ahornweg", meta: "gestern · Foto vom Handy", badge: "Erkannt" },
      { title: "Angebot — Familie Müller", meta: "12.07. · aus Scanner", amount: "8.470,00 €" },
    ],
    chatTitle: "Frag einfach deine Unterlagen.",
    chatText:
      "Der KI-Chat kennt deine Ablage und antwortet mit Quellenangabe. Und er hilft im Alltag: Mails formulieren, Angebotstexte schreiben, Ausschreibungen zusammenfassen.",
    chatPoint: "Das Sprachmodell läuft in Deutschland — deine Fragen und Dokumente verlassen das Land nicht.",
    chatQ: "Was haben wir Kunde Müller 2025 angeboten?",
    chatA: "Zwei Angebote: Badsanierung über 8.470,00 € (12.03.2025, angenommen) und Gäste-WC über 2.910,00 € (28.08.2025, offen).",
    chatSources: ["Angebot_Mueller_0325.pdf", "Angebot_Mueller_0825.pdf"],
  },
  en: {
    ablageTitle: "Your filing sorts itself.",
    ablageText:
      "A photo of a delivery note, an invoice from your inbox, a contract from the scanner — everything lands in the right place. Recognized, tagged and findable.",
    ablagePoints: [
      { icon: ScanText, text: "Text recognition even for photos from the site" },
      { icon: FileSearch, text: "Full-text search across all documents" },
      { icon: ScrollText, text: "Audit-proof filing, aligned with German GoBD rules" },
    ],
    docs: [
      { title: "Invoice — Krüger Building Supplies", meta: "today · from mail inbox", amount: "€1,240.50" },
      { title: "Delivery note — Ahornweg site", meta: "yesterday · phone photo", badge: "Recognized" },
      { title: "Quote — Müller family", meta: "Jul 12 · from scanner", amount: "€8,470.00" },
    ],
    chatTitle: "Just ask your documents.",
    chatText:
      "The AI chat knows your filing and answers with sources. It also helps day to day: drafting emails, writing quote texts, summarizing tenders.",
    chatPoint: "The language model runs in Germany — your questions and documents never leave the country.",
    chatQ: "What did we quote the Müller family in 2025?",
    chatA: "Two quotes: bathroom renovation at €8,470.00 (Mar 12, 2025, accepted) and guest WC at €2,910.00 (Aug 28, 2025, open).",
    chatSources: ["Quote_Mueller_0325.pdf", "Quote_Mueller_0825.pdf"],
  },
} as const;

export function AblageChatSection({ locale = "de" }: { locale?: Locale }) {
  const t = ABLAGE[locale];
  return (
    <section className="bg-cream py-20 text-ink sm:py-24">
      <div className="mx-auto max-w-7xl space-y-24 px-4 sm:px-6 lg:px-8">
        {/* Ablage */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.ablageTitle}</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{t.ablageText}</p>
            <ul className="mt-6 space-y-3">
              {t.ablagePoints.map((p) => (
                <li key={p.text} className="flex items-start gap-3 text-sm">
                  <p.icon className="mt-0.5 size-4.5 shrink-0 text-primary" />
                  <span className="text-ink-muted">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            {t.docs.map((d) => (
              <div
                key={d.title}
                className="flex items-center justify-between gap-4 rounded-2xl bg-cream-card p-5 shadow-sm"
              >
                <div>
                  <p className="font-semibold">{d.title}</p>
                  <p className="mt-1 text-xs text-ink-muted">{d.meta}</p>
                </div>
                {"amount" in d && d.amount ? (
                  <p className="font-mono text-sm">{d.amount}</p>
                ) : (
                  <span className="rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-medium text-emerald-800">
                    {(d as { badge: string }).badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KI-Chat */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl bg-cream-card p-6 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                KI-Chat
              </p>
              <div className="mt-4 flex justify-end">
                <p className="max-w-[85%] rounded-xl rounded-br-sm bg-background px-4 py-2.5 text-sm text-foreground">
                  {t.chatQ}
                </p>
              </div>
              <div className="mt-3 flex justify-start">
                <p className="max-w-[90%] rounded-xl rounded-bl-sm bg-ink/5 px-4 py-2.5 text-sm">
                  {t.chatA}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.chatSources.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-ink/5 px-3 py-1 font-mono text-[11px] text-ink-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.chatTitle}</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{t.chatText}</p>
            <p className="mt-6 flex items-start gap-3 text-sm">
              <Server className="mt-0.5 size-4.5 shrink-0 text-primary" />
              <span className="text-ink-muted">{t.chatPoint}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── KI-Mitarbeiter (cream, 3 cards + banner) ─────────────── */

const MITARBEITER = {
  de: {
    title: "KI-Mitarbeiter erledigen den Rest.",
    sub: "Du schaltest sie ein wie du Mitarbeiter einstellst — und behältst das letzte Wort.",
    aktiv: "Aktiv",
    neu: "Neu",
    banner: "Jede Aktion ist im Dashboard sichtbar — kritische Schritte bestätigst du selbst.",
    bannerTag: "Mensch entscheidet",
    items: [
      {
        badge: "aktiv",
        title: "Rechnungs-Mitarbeiter",
        text: "Liest dein Mail-Postfach, erkennt Rechnungen und legt sie strukturiert ab — inklusive E-Rechnung, die seit 2025 Pflicht ist.",
      },
      {
        badge: "aktiv",
        title: "Buchhaltungs-Mitarbeiter",
        text: "Ordnet Belege deinen Bankumsätzen zu und übergibt alles vorbereitet an den Steuerberater — per DATEV-Schnittstelle.",
      },
      {
        badge: "neu",
        title: "Angebots-Mitarbeiter",
        text: "Aus Aufmaß-Notizen und Fotos wird ein Angebotsentwurf — du prüfst, ergänzt und schickst raus.",
      },
    ],
  },
  en: {
    title: "AI employees handle the rest.",
    sub: "You switch them on like you hire staff — and you always have the last word.",
    aktiv: "Active",
    neu: "New",
    banner: "Every action is visible in the dashboard — you confirm critical steps yourself.",
    bannerTag: "Humans decide",
    items: [
      {
        badge: "aktiv",
        title: "Invoice employee",
        text: "Reads your inbox, recognizes invoices and files them in a structured way — including Germany's mandatory e-invoice format.",
      },
      {
        badge: "aktiv",
        title: "Bookkeeping employee",
        text: "Matches receipts to bank transactions and hands everything to your tax advisor, prepared — via DATEV interface.",
      },
      {
        badge: "neu",
        title: "Quote employee",
        text: "Turns site notes and photos into a draft quote — you review, adjust and send.",
      },
    ],
  },
} as const;

export function MitarbeiterSection({ locale = "de" }: { locale?: Locale }) {
  const t = MITARBEITER[locale];
  return (
    <section className="bg-cream pb-20 text-ink sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t.title}</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">{t.sub}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t.items.map((m) => (
            <div key={m.title} className="rounded-2xl bg-cream-card p-7 shadow-sm">
              <span
                className={
                  m.badge === "aktiv"
                    ? "inline-block rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-medium text-emerald-800"
                    : "inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
                }
              >
                {m.badge === "aktiv" ? t.aktiv : t.neu}
              </span>
              <h3 className="mt-4 text-lg font-bold">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-2xl bg-background px-6 py-5 text-foreground sm:flex-row sm:items-center">
          <p className="text-sm">{t.banner}</p>
          <p className="font-mono text-sm text-muted-foreground">{t.bannerTag}</p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Trust / Daten (dark green) ──────────────────── */

const TRUST = {
  de: {
    title: "Deine Daten bleiben in Deutschland. Punkt.",
    badges: ["DSGVO-konform", "Serverstandort Deutschland", "GoBD-Ausrichtung"],
    items: [
      { icon: Server, text: "Server und KI-Modelle laufen in deutschen Rechenzentren — kein US-Hyperscaler." },
      { icon: ShieldCheck, text: "DSGVO-konform mit Vertrag zur Auftragsverarbeitung — dein Steuerberater wird es mögen." },
      { icon: Lock, text: "Deine Daten sind pro Betrieb getrennt und verschlüsselt — kein Training fremder Modelle." },
      { icon: ScrollText, text: "Jede KI-Aktion ist protokolliert und nachvollziehbar — Ablage ausgerichtet an GoBD." },
    ],
  },
  en: {
    title: "Your data stays in Germany. Period.",
    badges: ["GDPR-compliant", "Servers located in Germany", "GoBD-aligned"],
    items: [
      { icon: Server, text: "Servers and AI models run in German data centers — no US hyperscalers." },
      { icon: ShieldCheck, text: "GDPR-compliant with a data-processing agreement — your tax advisor will approve." },
      { icon: Lock, text: "Your data is isolated per business and encrypted — never used to train third-party models." },
      { icon: ScrollText, text: "Every AI action is logged and traceable — filing aligned with GoBD." },
    ],
  },
} as const;

export function TrustSection({ locale = "de" }: { locale?: Locale }) {
  const t = TRUST[locale];
  return (
    <section id="daten" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t.title}
        </h2>
        <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {t.items.map((item, i) => (
            <div key={i} className="flex items-start gap-4 border-t border-border pt-6">
              <span className="font-mono text-sm font-semibold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="leading-relaxed text-foreground/90">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          {t.badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
