import type { Metadata } from "next";
import { PilotPage } from "@/components/pilot-page";

export const metadata: Metadata = {
  title: "Pilotbetrieb werden",
  description:
    "Werde hey247-Pilotbetrieb: kostenlose Pilotphase, Einrichtung durch uns, direkter Draht zum Gründerteam. Lass uns über deinen Betrieb sprechen.",
};

export default function PilotDE() {
  return <PilotPage locale="de" />;
}
