import { PageHeader } from "@/components/dashboard/page-header";
import { KalenderView } from "@/components/dashboard/kalender-view";

export const metadata = { title: "Kalender" };

export default function KalenderPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 py-2">
      <PageHeader
        title="Kalender"
        description="Deine Woche auf einen Blick — Wartungen, Kundentermine, Notfälle."
      />
      <KalenderView />
    </div>
  );
}
