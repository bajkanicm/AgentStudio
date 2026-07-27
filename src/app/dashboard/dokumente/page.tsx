import { PageHeader } from "@/components/dashboard/page-header";
import { DocumentsView } from "@/components/dashboard/documents-view";

export const metadata = { title: "Dokumente" };

export default function DokumentePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <PageHeader
        title="Dokumente"
        description="Deine Ablage: Rechnungen, Angebote, Lieferscheine — durchsuchbar und vom KI-Chat nutzbar."
      />
      <DocumentsView />
    </div>
  );
}
