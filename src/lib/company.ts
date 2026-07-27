/**
 * Company details used by the legal pages (Impressum, Datenschutz, AGB)
 * and contact CTAs.
 *
 * ⚠️ FILL IN the bracketed values before announcing the site — they render
 * as-is on /legal/*. This is the only file you need to edit.
 */
export const COMPANY = {
  brand: "hey247",
  legalName: "flexC GmbH",
  address: {
    street: "[Straße und Hausnummer]",
    zipCity: "[PLZ Ort]",
    country: "Deutschland",
  },
  representative: "[Name der Geschäftsführung]",
  email: "hallo@hey247.de",
  pilotEmail: "pilot@hey247.de",
  privacyEmail: "datenschutz@hey247.de",
  /** Handelsregister, z. B. "HRB 12345, Amtsgericht Berlin" — oder "" */
  register: "",
  /** USt-IdNr., z. B. "DE123456789" — oder "" */
  vatId: "",
  website: "https://agentstudio.tech",
} as const;

export const LEGAL_LAST_UPDATED = "27. Juli 2026";
