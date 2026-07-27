import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen für die Nutzung von hey247.",
};

export default function TermsPage() {
  return (
    <>
      <h1>Allgemeine Geschäftsbedingungen</h1>
      <p>
        Diese Bedingungen regeln die Nutzung von hey247, betrieben von{" "}
        {COMPANY.legalName} („wir“). Mit der Registrierung oder Nutzung des
        Dienstes stimmst du ihnen zu.
      </p>

      <h2>1. Der Dienst</h2>
      <p>
        hey247 ist das digitale Büro für Handwerksbetriebe: KI-Mitarbeiter für
        Telefon, Rechnungen, Buchhaltung und Angebote sowie ein Dashboard mit
        Ablage und KI-Chat. Der Funktionsumfang richtet sich nach dem gewählten
        Plan bzw. der Pilotvereinbarung.
      </p>

      <h2>2. Konto</h2>
      <p>
        Du machst wahrheitsgemäße Angaben und hältst deine Zugangsdaten geheim.
        Du bist für Aktivitäten in deinem Workspace verantwortlich. Der Dienst
        richtet sich an Unternehmer (B2B) und Personen ab 18 Jahren.
      </p>

      <h2>3. Zulässige Nutzung</h2>
      <ul>
        <li>Keine rechtswidrige, schädliche oder täuschende Nutzung — einschließlich Identitätsmissbrauch, Spam oder Inhalten, die Rechte Dritter verletzen.</li>
        <li>Keine Versuche, den Dienst zu stören, zu überlasten oder Plan-Limits zu umgehen.</li>
        <li>Für Inhalte, die du in KI-Mitarbeiter einspeist (Prompts, Wissensbasis), und für die Verwendung der Ausgaben bist du verantwortlich.</li>
      </ul>

      <h2>4. KI-Hinweis</h2>
      <p>
        KI-generierte Antworten können unvollständig oder fehlerhaft sein.{" "}
        <strong>
          Ausgaben dienen der Information und sind keine Rechts-, Steuer- oder
          sonstige Fachberatung.
        </strong>{" "}
        Prüfe Ausgaben, bevor du dich darauf verlässt oder sie an Kunden
        sendest — kritische Schritte bestätigst du selbst („Mensch
        entscheidet“).
      </p>

      <h2>5. Pilotphase, Preise &amp; Änderungen</h2>
      <p>
        Für Pilotbetriebe ist die Nutzung während der Pilotphase kostenlos;
        danach gilt der vereinbarte Vorzugspreis. Reguläre Preise und Limits
        werden auf der Preisseite ausgewiesen und können mit angemessener
        Ankündigung für künftige Abrechnungszeiträume angepasst werden.
      </p>

      <h2>6. Deine Inhalte &amp; unsere Rechte</h2>
      <p>
        Deine Inhalte bleiben deine. Du räumst uns die für den Betrieb des
        Dienstes erforderlichen Nutzungsrechte ein (Speicherung, Verarbeitung).
        Wir nutzen deine Inhalte nicht zum Training von KI-Modellen. Alle
        Rechte an der Plattform selbst liegen bei uns.
      </p>

      <h2>7. Verfügbarkeit &amp; Support</h2>
      <p>
        Wir bemühen uns um hohe Verfügbarkeit, garantieren sie aber ohne
        gesonderte SLA-Vereinbarung nicht. Supportwege richten sich nach dem
        Plan.
      </p>

      <h2>8. Haftung</h2>
      <p>
        Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach
        dem Produkthaftungsgesetz. Bei einfacher Fahrlässigkeit haften wir nur
        für die Verletzung wesentlicher Vertragspflichten (Kardinalpflichten),
        begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Für
        Datenverlust haften wir nur in Höhe des Wiederherstellungsaufwands, der
        bei ordnungsgemäßer Datensicherung deinerseits entstanden wäre.
      </p>

      <h2>9. Laufzeit &amp; Kündigung</h2>
      <p>
        Du kannst die Nutzung jederzeit beenden und dein Konto löschen. Wir
        können Konten sperren oder kündigen, die gegen diese Bedingungen
        verstoßen. Nach Beendigung werden gespeicherte Inhalte gemäß
        Datenschutzerklärung gelöscht.
      </p>

      <h2>10. Anwendbares Recht</h2>
      <p>
        Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Ist der
        Kunde Kaufmann, ist Gerichtsstand unser Sitz.
      </p>

      <h2>11. Kontakt</h2>
      <p>
        Fragen zu diesen Bedingungen:{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </p>
    </>
  );
}
