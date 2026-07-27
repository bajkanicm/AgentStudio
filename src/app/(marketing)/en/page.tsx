import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "hey247 — The digital office for your trade business",
  description:
    "AI employees that answer calls, sort invoices and handle paperwork. 100% of your data hosted in Germany. Become a pilot business.",
};

export default function HomeEN() {
  return <LandingPage locale="en" />;
}
