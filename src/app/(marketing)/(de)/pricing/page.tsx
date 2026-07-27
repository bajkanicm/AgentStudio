import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "hey247 Preise: Basis 99 € pro Betrieb und Monat, KI-Mitarbeiter ab 29 €. Pilotbetriebe starten kostenlos.",
};

export default function PricingDE() {
  return <PricingPage locale="de" />;
}
