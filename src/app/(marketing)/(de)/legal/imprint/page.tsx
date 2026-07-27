import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von hey247 (flexC GmbH).",
};

export default function ImprintPage() {
  return (
    <>
      <h1>Impressum</h1>
      <p>Angaben gemäß § 5 TMG.</p>

      <h2>Diensteanbieter</h2>
      <p>
        <strong>{COMPANY.legalName}</strong>
        <br />
        {COMPANY.address.street}
        <br />
        {COMPANY.address.zipCity}
        <br />
        {COMPANY.address.country}
      </p>

      <h2>Vertreten durch</h2>
      <p>Geschäftsführer: {COMPANY.representative}</p>

      <h2>Kontakt</h2>
      <p>
        Telefon: {COMPANY.phone}
        <br />
        E-Mail: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        <br />
        Website: <a href={COMPANY.website}>{COMPANY.website}</a>
      </p>

      {COMPANY.register && (
        <>
          <h2>Registereintrag</h2>
          <p>
            Eintragung im Handelsregister.
            <br />
            {COMPANY.register}
          </p>
        </>
      )}

      {COMPANY.vatId && (
        <>
          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {COMPANY.vatId}
          </p>
        </>
      )}

      <h2>Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)</h2>
      <p>
        {COMPANY.representative}, {COMPANY.address.street}, {COMPANY.address.zipCity}
      </p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur
        Online-Streitbeilegung (OS) bereit:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . Wir sind nicht bereit oder verpflichtet, an
        Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach
        den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht
        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
        überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
        Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
        Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
        hiervon unberührt.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten
        Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
        verantwortlich.
      </p>
    </>
  );
}
