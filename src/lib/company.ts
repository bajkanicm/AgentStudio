/**
 * Company details used by the legal pages (Impressum, Privacy, Terms).
 *
 * ⚠️ FILL THESE IN before announcing the site to real customers — the
 * bracketed values render as-is on /legal/* pages. This is the only file
 * you need to edit.
 */
export const COMPANY = {
  legalName: "[Your Company Legal Name]",
  address: {
    street: "[Street and Number]",
    zipCity: "[ZIP City]",
    country: "[Country]",
  },
  representative: "[Full Name of Managing Director / Owner]",
  email: "hello@agentstudio.tech",
  salesEmail: "sales@agentstudio.tech",
  privacyEmail: "privacy@agentstudio.tech",
  /** Commercial register entry, e.g. "HRB 12345, Amtsgericht Berlin" — or "" if none */
  register: "",
  /** VAT ID (USt-IdNr.), e.g. "DE123456789" — or "" if none */
  vatId: "",
  website: "https://agentstudio.tech",
} as const;

export const LEGAL_LAST_UPDATED = "July 27, 2026";
