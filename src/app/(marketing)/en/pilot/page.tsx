import type { Metadata } from "next";
import { PilotPage } from "@/components/pilot-page";

export const metadata: Metadata = {
  title: "Become a pilot business",
  description:
    "Become a hey247 pilot: free pilot phase, setup done by us, a direct line to the founding team.",
};

export default function PilotEN() {
  return <PilotPage locale="en" />;
}
