import { PageHeader } from "@/components/dashboard/page-header";
import { AuftraegeView } from "@/components/dashboard/auftraege-view";

export const metadata = { title: "Aufträge" };

export default function AuftraegePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 py-2">
      <PageHeader
        title="Aufträge & Anfragen"
        description="Dein Anfragenboard: von Neu bis Erledigt — nichts geht unter."
      />
      <AuftraegeView />
    </div>
  );
}
