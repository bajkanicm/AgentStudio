import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Wie hey247 deine Daten verarbeitet und schützt.",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Datenschutzerklärung</h1>
      <p>
        Diese Erklärung beschreibt, welche personenbezogenen Daten{" "}
        {COMPANY.legalName} ({COMPANY.address.street}, {COMPANY.address.zipCity},{" "}
        {COMPANY.address.country} — „wir“) bei der Nutzung von hey247 unter{" "}
        <a href={COMPANY.website}>{COMPANY.website}</a> verarbeitet, und welche
        Rechte dir nach der DSGVO zustehen.
      </p>

      <h2>1. Welche Daten wir verarbeiten</h2>
      <ul>
        <li>
          <strong>Kontodaten</strong> — bei der Registrierung: E-Mail-Adresse,
          Name und Authentifizierungs-Kennungen. Die Authentifizierung betreibt
          unser Auftragsverarbeiter Clerk Inc.
        </li>
        <li>
          <strong>Inhalte</strong> — Konfigurationen deiner KI-Mitarbeiter
          (System-Prompts, Wissensbasis) und Chat-Nachrichten. Diese Inhalte
          werden gespeichert, damit du sie wiederverwenden kannst.
        </li>
        <li>
          <strong>Pilotanfragen</strong> — beim Absenden des Formulars: Name,
          E-Mail, Betrieb, Gewerk, Betriebsgröße und deine Beschreibung.
        </li>
        <li>
          <strong>Nutzungsdaten</strong> — Nachrichten- und Token-Zähler pro
          Workspace zur Durchsetzung der Plan-Limits.
        </li>
        <li>
          <strong>Technische Daten</strong> — kurzlebige Server-Logs
          (IP-Adresse, Zeitstempel, aufgerufene URL) zur Sicherheit und
          Fehlerbehebung.
        </li>
      </ul>

      <h2>2. Was wir NICHT tun</h2>
      <ul>
        <li>Wir verkaufen keine personenbezogenen Daten.</li>
        <li>Deine Prompts und Wissensbasen werden nicht zum Training von KI-Modellen verwendet.</li>
        <li>Keine Werbung Dritter, keine Werbe-Tracker.</li>
      </ul>

      <h2>3. KI-Verarbeitung</h2>
      <p>
        Wenn du mit einem KI-Mitarbeiter chattest, werden das Gespräch und die
        Konfiguration an einen KI-Modellanbieter übermittelt, um die Antwort zu
        erzeugen. Ziel ist der Betrieb der Modelle in deutschen Rechenzentren;
        je nach Konfiguration können derzeit auch Anthropic (Claude) oder
        OpenAI (GPT) als Auftragsverarbeiter eingesetzt werden — jeweils unter
        Geschäftsbedingungen, die ein Training auf API-Daten ausschließen.
        Bitte gib keine besonders sensiblen personenbezogenen Daten in Chats
        und Wissensbasen ein.
      </p>

      <h2>4. Rechtsgrundlagen</h2>
      <p>
        Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) für Konto-, Inhalts- und
        Nutzungsdaten; Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
        Sicherheit und Betrieb) für technische Logs; Art. 6 Abs. 1 lit. b DSGVO
        (vorvertragliche Maßnahmen) für Pilotanfragen.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Wir setzen ausschließlich technisch notwendige Cookies ein — vor allem
        Sitzungs-Cookies der Authentifizierung (Clerk). Keine Analyse- oder
        Werbe-Cookies.
      </p>

      <h2>6. Auftragsverarbeiter &amp; Empfänger</h2>
      <ul>
        <li>Hosting: Server in Deutschland (Alfahosting GmbH).</li>
        <li>Authentifizierung: Clerk Inc. (USA — EU-U.S. Data Privacy Framework / SCC), sofern aktiviert.</li>
        <li>KI-Modelle: Anthropic PBC und/oder OpenAI LLC (USA — SCC), nur wenn KI-Funktionen genutzt werden.</li>
      </ul>

      <h2>7. Speicherdauer</h2>
      <p>
        Konto- und Inhaltsdaten bleiben gespeichert, bis du sie oder dein Konto
        löschst. Server-Logs werden innerhalb weniger Tage rotiert.
        Pilotanfragen speichern wir so lange, wie es für die Bearbeitung und
        eine etwaige Zusammenarbeit erforderlich ist.
      </p>

      <h2>8. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung,
        Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie das Recht
        auf Beschwerde bei einer Aufsichtsbehörde. Kontakt:{" "}
        <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>.
      </p>

      <h2>9. Änderungen</h2>
      <p>
        Wir aktualisieren diese Erklärung, wenn sich der Dienst weiterentwickelt
        (z. B. beim Start der Online-Bezahlung), und vermerken unten das Datum
        der letzten Änderung.
      </p>
    </>
  );
}
