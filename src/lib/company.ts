/**
 * Company details used by the legal pages (Impressum, Datenschutz, AGB)
 * and contact CTAs. Registry data as published in the flexC GmbH
 * Impressum (flexc.de/impressum).
 */
export const COMPANY = {
  brand: "hey247",
  legalName: "flexC GmbH",
  address: {
    street: "Julius-Hatry-Straße 1",
    zipCity: "68163 Mannheim",
    country: "Deutschland",
  },
  representative: "Nenad Latinovic",
  phone: "+49 (0) 621 43179944",
  email: "hallo@hey247.de",
  pilotEmail: "pilot@hey247.de",
  privacyEmail: "datenschutz@hey247.de",
  register: "Amtsgericht Mannheim, HRB 735477",
  vatId: "DE328365484",
  website: "https://agentstudio.tech",
} as const;

export const LEGAL_LAST_UPDATED = "27. Juli 2026";
