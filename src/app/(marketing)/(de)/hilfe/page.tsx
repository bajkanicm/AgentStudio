import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import {
  Bot,
  CalendarDays,
  FolderOpen,
  Inbox,
  MessagesSquare,
  PhoneCall,
  Smartphone,
  UserPlus,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hilfe & Erste Schritte",
  description:
    "So nutzt du hey247: Konto anlegen, KI-Mitarbeiter einrichten, Dokumente hochladen, KI-Chat, Anrufe, Kalender und Aufträge.",
};

const SECTIONS = [
  {
    id: "start",
    icon: UserPlus,
    title: "1. Konto anlegen & erster Login",
    body: [
      "Gehe auf agentstudio.tech und klicke oben rechts auf „Anmelden“ bzw. „Pilotbetrieb werden“. Registrieren kannst du dich mit deiner E-Mail-Adresse oder deinem Google-Konto — ein Passwort-Zettel ist nicht nötig.",
      "Nach dem Login landest du in deinem eigenen Arbeitsbereich. Alles, was du dort ablegst, sieht nur dein Betrieb.",
    ],
  },
  {
    id: "ki-mitarbeiter",
    icon: Bot,
    title: "2. KI-Mitarbeiter einrichten",
    body: [
      "Unter „KI-Mitarbeiter“ → „Vorlagen“ findest du vier fertige Kollegen: Telefonassistent, Rechnungs-, Buchhaltungs- und Angebots-Mitarbeiter. Wähle eine Vorlage und klicke „Vorlage verwenden“.",
      "Im Playground kannst du sofort mit dem KI-Mitarbeiter sprechen. Rechts stellst du ihn ein: Name, Ton, Temperatur (präzise ↔ kreativ) und die Wissensbasis — dort gehören deine Preise, Leistungen, Öffnungszeiten und Notfallnummern hinein. Änderungen wirken sofort; „Speichern“ macht sie dauerhaft.",
      "Tipp: Je konkreter die Wissensbasis, desto besser die Antworten. Der KI-Mitarbeiter erfindet nichts dazu — was er nicht weiß, sagt er ehrlich.",
    ],
  },
  {
    id: "dokumente",
    icon: FolderOpen,
    title: "3. Dokumente hochladen (Ablage)",
    body: [
      "Unter „Dokumente“ klickst du auf „Hochladen“ und wählst ein PDF oder ein Foto (JPG/PNG) — zum Beispiel einen abfotografierten Lieferschein von der Baustelle.",
      "hey247 liest den Text automatisch aus (auch aus Fotos, per deutscher Texterkennung direkt auf unserem Server), erkennt den Dokumenttyp und den Betrag und legt alles durchsuchbar ab. Eingangsrechnungen landen mit Status „Wartet auf Freigabe“ — freigeben tust immer du.",
      "Das Original bleibt gespeichert: Klick auf den Dokumenttitel öffnet die Datei.",
    ],
  },
  {
    id: "ki-chat",
    icon: MessagesSquare,
    title: "4. Frag deine Ablage (KI-Chat)",
    body: [
      "Im „KI-Chat“ stellst du Fragen an deine eigenen Unterlagen: „Was haben wir Familie Müller angeboten?“ oder „Welche Rechnungen sind überfällig?“ — die Antwort kommt mit Quellenangabe auf die konkreten Dokumente.",
      "Der Chat hilft auch beim Formulieren: Mails, Zahlungserinnerungen, Angebotstexte. Jeder Chat wird links unter „Verläufe“ gespeichert.",
    ],
  },
  {
    id: "anrufe",
    icon: PhoneCall,
    title: "5. Anrufe & Rückruf-Notizen",
    body: [
      "Jedes Gespräch mit deinem Telefonassistenten erzeugt automatisch eine strukturierte Notiz unter „Anrufe“: Wer hat angerufen, worum geht es, unter welcher Nummer ist die Person erreichbar — Dringendes wird markiert.",
      "Mit „Rückruf planen“ legst du den Rückruf direkt in deinen Kalender. „Als erledigt markieren“ hält die Liste sauber.",
      "Die Anbindung an deine echte Telefonnummer richten wir gemeinsam in der Pilotphase ein.",
    ],
  },
  {
    id: "kalender-auftraege",
    icon: CalendarDays,
    title: "6. Kalender & Aufträge",
    body: [
      "Der „Kalender“ zeigt deine Woche: Kundentermine, Wartungen, Notfälle — farblich unterschieden, mit KW-Navigation.",
      "Unter „Aufträge“ wird jede Kundenanfrage ein Vorgang und wandert über die Spalten Neu → In Arbeit → Wartet auf Kunde → Erledigt. So geht nichts mehr unter — egal ob die Anfrage per Telefon, Mail oder Webformular kam.",
    ],
  },
  {
    id: "app",
    icon: Smartphone,
    title: "7. hey247 aufs Handy holen",
    body: [
      "hey247 lässt sich wie eine App installieren — ohne App Store:",
      "iPhone/iPad (Safari): agentstudio.tech öffnen → Teilen-Symbol → „Zum Home-Bildschirm“. Android (Chrome): Menü (⋮) → „App installieren“.",
      "Danach startet hey247 vom Home-Bildschirm im Vollbild — ideal, um auf der Baustelle schnell einen Lieferschein zu fotografieren und hochzuladen.",
    ],
  },
  {
    id: "daten",
    icon: Inbox,
    title: "8. Deine Daten",
    body: [
      "Deine Dokumente, Gespräche und Einstellungen gehören dir und sind pro Betrieb getrennt gespeichert. Wir nutzen deine Inhalte nicht zum Training von KI-Modellen.",
      "Details stehen in der Datenschutzerklärung. Fragen? Schreib uns — als Pilotbetrieb hast du den direkten Draht zum Team.",
    ],
  },
];

export default function HilfePage() {
  return (
    <div className="pt-16">
      <section className="bg-grid bg-grid-fade relative py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Hilfe
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Erste Schritte mit <span className="text-gradient">hey247</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            In zehn Minuten vom Login zum ersten KI-Mitarbeiter. Bei Fragen:{" "}
            <a href={`mailto:${COMPANY.pilotEmail}`} className="text-primary hover:underline">
              {COMPANY.pilotEmail}
            </a>
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 text-ink sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6">
          {SECTIONS.map((s) => (
            <article key={s.id} id={s.id} className="scroll-mt-24 rounded-2xl bg-cream-card p-7 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <s.icon className="size-4.5" />
                </span>
                {s.title}
              </h2>
              {s.body.map((paragraph, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}

          <p className="pt-4 text-center text-sm text-ink-muted">
            Direkt loslegen:{" "}
            <Link href="/dashboard" className="font-semibold text-primary hover:underline">
              Zum Dashboard
            </Link>{" "}
            · Noch kein Konto?{" "}
            <Link href="/pilot" className="font-semibold text-primary hover:underline">
              Pilotbetrieb werden
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
