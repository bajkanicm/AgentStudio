import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "hey247 pricing: base €99 per business per month, AI employees from €29. Pilot businesses start for free.",
};

export default function PricingEN() {
  return <PricingPage locale="en" />;
}
