import type { GenerateOptions } from "./index";

/**
 * Eingebautes Mock-Modell: liefert glaubwürdige, template-spezifische
 * deutsche Antworten und streamt sie Wort für Wort, damit das Produkt ohne
 * API-Keys voll demonstrierbar ist. Sobald ANTHROPIC_API_KEY oder
 * OPENAI_API_KEY gesetzt ist, übernimmt automatisch das echte Modell.
 */
export async function* mockCompletionStream(
  opts: GenerateOptions
): AsyncGenerator<string> {
  const lastUser =
    [...opts.messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const reply = composeReply(opts.templateSlug ?? inferSlug(opts.system), lastUser, opts);

  const words = reply.split(/(\s+)/);
  for (let i = 0; i < words.length; i += 2) {
    yield words.slice(i, i + 2).join("");
    await sleep(18 + Math.random() * 30);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function inferSlug(system: string): string {
  const s = system.toLowerCase();
  if (s.includes("telefon")) return "telefon";
  if (s.includes("rechnungs-mitarbeiter") || s.includes("rechnung")) return "rechnung";
  if (s.includes("buchhaltung")) return "buchhaltung";
  if (s.includes("angebot")) return "angebot";
  return "general";
}

function composeReply(slug: string, userText: string, opts: GenerateOptions): string {
  const t = userText.toLowerCase();
  const kb = extractKb(opts.system);
  const kbNote = kb
    ? `\n\n_(Aus deiner Wissensbasis: "${kb.slice(0, 110)}${kb.length > 110 ? "…" : ""}")_`
    : "";

  switch (slug) {
    case "telefon":
      if (t.includes("dringend") || t.includes("wasserschaden") || t.includes("notfall") || t.includes("gas")) {
        if (t.includes("gas")) {
          return `Das nehme ich sehr ernst. **Bei Gasgeruch gilt: sofort Fenster öffnen, keine Schalter betätigen, Gebäude verlassen und den Notruf bzw. den Netzbetreiber anrufen** — das geht vor.\n\nSobald das erledigt ist: Ich habe Ihren Fall als **DRINGEND** markiert. Unter welcher Nummer erreichen wir Sie für den Rückruf?`;
        }
        return `Verstanden — das klingt dringend, das nehme ich sofort auf.\n\nIch habe Folgendes notiert:\n- **Anliegen:** Wasserschaden, dringend\n- **Priorität:** DRINGEND — Rückruf schnellstmöglich\n\nUnter welcher Nummer erreichen wir Sie am besten, und ist der Haupthahn schon zugedreht? Falls nicht: bitte zuerst den Haupthahn schließen.`;
      }
      if (t.includes("angebot")) {
        return `Gern schaue ich nach. Damit ich Sie richtig zuordne: Wie ist Ihr Name, und um welches Projekt ging es bei dem Angebot?\n\nIch trage das als Rückrufwunsch ein — das Team meldet sich heute noch bei Ihnen. Unter welcher Nummer sind Sie am besten erreichbar?${kbNote}`;
      }
      return `Das kriegen wir hin. Ich trage das als Rückrufwunsch ein — das Team ist heute auf der Baustelle, meldet sich aber verlässlich zurück.\n\nIch habe notiert:\n- **Anliegen:** ${userText.slice(0, 90)}${userText.length > 90 ? "…" : ""}\n\nZwei kurze Fragen: Wie ist Ihr Name, und unter welcher Nummer erreichen wir Sie heute Nachmittag?${kbNote}`;

    case "rechnung":
      if (t.includes("€") || t.includes("eur") || t.match(/\d+[.,]\d{2}/)) {
        return `Alles klar, die nehme ich auf. Aus deinen Angaben lese ich:\n\n- **Lieferant:** ${t.includes("krüger") ? "Baustoffe Krüger" : "[aus Rechnung übernehmen]"}\n- **Betrag (brutto):** ${userText.match(/\d[\d.,]*\s*€/)?.[0] ?? "[Betrag]"}\n- **Kategorie (Vorschlag):** Material\n- **Ablage:** Eingangsrechnungen → ${new Date().getFullYear()}\n\nDamit die Erfassung vollständig ist, brauche ich noch: **Rechnungsnummer, Rechnungsdatum und Fälligkeit**. Steht auf der Rechnung ein Skonto?${kbNote}`;
      }
      if (t.includes("e-rechnung") || t.includes("pflicht")) {
        return `Kurz und ohne Amtsdeutsch:\n\n1. **Seit 2025** müssen Betriebe im B2B-Geschäft E-Rechnungen **empfangen** können — ein PDF reicht dafür formal nicht mehr, gemeint sind strukturierte Formate wie **XRechnung** oder **ZUGFeRD**.\n2. Für das **Versenden** gelten Übergangsfristen, die schrittweise auslaufen.\n3. Praktisch heißt das: Dein Postfach bekommt XML-Anhänge — genau die lese ich automatisch aus und lege sie strukturiert ab.\n\nWillst du, dass ich dir zeige, wie eine erkannte E-Rechnung bei mir in der Ablage aussieht?`;
      }
      return `Gern. Am schnellsten geht es so: Wirf mir den Rechnungstext einfach in den Chat (oder später die Mail direkt ins angebundene Postfach). Ich extrahiere dann **Lieferant, Nummer, Datum, Betrag und Fälligkeit** und schlage Kategorie plus Ablageort vor.\n\nFür den Steuerberater gilt die Faustregel: **ein Beleg, ein Ort, ein Schlagwort-Satz** — genau so lege ich ab, ausgerichtet an GoBD.${kbNote}`;

    case "buchhaltung":
      if (t.includes("monatsabschluss") || t.includes("steuerberater")) {
        return `Hier ist deine Übergabe-Checkliste für den Monatsabschluss:\n\n1. **Bankumsätze** vollständig? (alle Konten, auch PayPal/Kreditkarte)\n2. **Belege zugeordnet** — ich matche Beträge und Daten automatisch und zeige dir nur die Fälle, bei denen ich unsicher bin.\n3. **Offene Posten**: unbezahlte Ausgangsrechnungen markiert.\n4. **Bar-Belege** fotografiert und kategorisiert.\n5. **Export** ans Steuerbüro — DATEV-üblich, dein Steuerberater bekommt alles vorbereitet.\n\nErfahrungswert: Wenn wir das wöchentlich 10 Minuten pflegen, ist der Abschluss am Monatsende in einer Viertelstunde durch — statt einem ganzen Abend.${kbNote}`;
      }
      if (t.includes("bewirtung")) {
        return `Bei Bewirtungsbelegen gilt:\n\n1. **Anlass und Teilnehmer** müssen auf dem Beleg stehen (direkt draufschreiben reicht).\n2. **70/30-Regel:** 70 % der Kosten sind als Betriebsausgabe abziehbar, die Vorsteuer dafür zu 100 %.\n3. Der Beleg muss **maschinell erstellt** sein (Registrierkasse), handschriftliche Quittungen reichen bei Restaurants nicht.\n\nMein Tipp: Foto direkt nach dem Essen machen und mir schicken — ich lege es richtig ab und erinnere dich an Anlass/Teilnehmer, solange du es noch weißt.\n\n_(Für den Einzelfall bitte den Steuerberater fragen — ich bereite vor, er entscheidet.)_`;
      }
      return `Das sortieren wir. Am schnellsten: Sag mir, was du vor dir hast — Belege (Papier/Foto/Mail?) und den Bankumsatz-Zeitraum. Ich schlage dann pro Umsatz den passenden Beleg und eine Kategorie vor (Material, Fahrzeug, Werkzeug, Büro …).\n\nDu bestätigst nur noch — **du behältst das letzte Wort**, ich mache die Fleißarbeit. Und am Monatsende geht alles vorbereitet an den Steuerberater.${kbNote}`;

    case "angebot":
      if (t.includes("aufmaß") || t.includes("wc") || t.includes("fliesen") || t.includes("bad")) {
        return `Hier ist dein Angebotsentwurf:\n\n**Angebot — Sanierung Gäste-WC**\n\n1. **Demontage** Bestand (Waschtisch, Altfliesen im Arbeitsbereich) — 1 psch — [Preis]\n2. **Fliesenarbeiten** ca. 4 m², Wand/Boden, inkl. Kleber und Fugmasse — 4 m² — [Preis]\n3. **Waschtisch liefern und montieren**, inkl. Anschluss an Bestand — 1 St — [Preis]\n4. **Silikonfugen** sanitär, dauerelastisch — 1 psch — [Preis]\n5. **An-/Abfahrt, Entsorgung** Bauschutt — 1 psch — [Preis]\n\n_Eventualposition:_ Austausch Eckventile bei Verschleiß — 2 St — [Preis]\n\n**Vor dem Versand prüfen:** Materialqualität (Fliesenpreisklasse?), aktueller Stundensatz, Anfahrtspauschale. Sobald du mir deine Preise nennst oder sie in der Wissensbasis stehen, setze ich sie direkt ein.${kbNote}`;
      }
      if (t.includes("nachfass") || t.includes("mail") || t.includes("follow")) {
        return `Gern — hier ein Entwurf:\n\n**Betreff:** Kurze Nachfrage zu unserem Angebot\n\nGuten Tag [Name],\n\nvor zwei Wochen haben wir Ihnen unser Angebot für [Projekt] geschickt. Ich wollte kurz nachhören, ob noch Fragen offen sind — etwa zu einzelnen Positionen oder zum Zeitplan.\n\nWenn Sie mögen, reservieren wir Ihnen unverbindlich einen Termin im [Monat] — die Auftragsbücher füllen sich gerade.\n\nMit freundlichen Grüßen\n[Dein Name]\n\n**Warum so:** freundlich, konkret, mit sanftem Terminanreiz — ohne Druck. Soll ich eine kürzere Variante für WhatsApp machen?`;
      }
      return `Pack mir einfach deine Stichpunkte hin — Räume, Maße, Material, Arbeitsschritte — und ich mache daraus saubere Angebotspositionen mit Beschreibung, Menge und Einheit. Preise setze ich nur ein, wenn du sie mir nennst; sonst bekommst du [Preis]-Platzhalter zum Ausfüllen.\n\nFaustregel für gute Angebote: **klare Positionen, Eventualpositionen gekennzeichnet, kurze verständliche Beschreibungen.** Den Feinschliff machst du — du prüfst, du entscheidest.${kbNote}`;

    default:
      return `Verstanden. Lass uns das in drei Schritten angehen: Was wissen wir, was fehlt noch, und was ist der nächste konkrete Schritt? Erzähl mir kurz mehr über deinen Betrieb und dein Anliegen — dann werde ich konkret.${kbNote}`;
  }
}

function extractKb(system: string): string | null {
  const match = system.match(/--- WISSENSBASIS ---\n([\s\S]*?)\n--- ENDE WISSENSBASIS ---/);
  if (!match) return null;
  const kb = match[1].replace(/^Nutze das folgende[^\n]*\n/, "").trim();
  return kb || null;
}
