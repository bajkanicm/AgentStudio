import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Imprint",
  description: "Legal notice (Impressum) for AgentStudio.",
};

export default function ImprintPage() {
  return (
    <>
      <h1>Imprint / Impressum</h1>
      <p>Information in accordance with § 5 TMG (German Telemedia Act).</p>

      <h2>Service provider</h2>
      <p>
        <strong>{COMPANY.legalName}</strong>
        <br />
        {COMPANY.address.street}
        <br />
        {COMPANY.address.zipCity}
        <br />
        {COMPANY.address.country}
      </p>

      <h2>Represented by</h2>
      <p>{COMPANY.representative}</p>

      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        <br />
        Website: <a href={COMPANY.website}>{COMPANY.website}</a>
      </p>

      {COMPANY.register && (
        <>
          <h2>Register entry</h2>
          <p>{COMPANY.register}</p>
        </>
      )}

      {COMPANY.vatId && (
        <>
          <h2>VAT ID</h2>
          <p>VAT identification number according to § 27a UStG: {COMPANY.vatId}</p>
        </>
      )}

      <h2>Responsible for content (§ 55 Abs. 2 RStV)</h2>
      <p>
        {COMPANY.representative}, {COMPANY.address.street}, {COMPANY.address.zipCity}
      </p>

      <h2>EU dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute
        resolution:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . We are neither obliged nor willing to participate in dispute
        resolution proceedings before a consumer arbitration board.
      </p>

      <h2>Liability for content</h2>
      <p>
        As a service provider we are responsible for our own content on these
        pages in accordance with general law. We are not obliged to monitor
        transmitted or stored third-party information or to investigate
        circumstances indicating illegal activity. Obligations to remove or
        block the use of information under general law remain unaffected.
      </p>

      <h2>Liability for links</h2>
      <p>
        Our site contains links to external third-party websites over whose
        content we have no influence. The respective provider or operator of
        linked pages is always responsible for their content.
      </p>
    </>
  );
}
