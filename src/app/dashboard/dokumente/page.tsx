import { PageHeader } from "@/components/dashboard/page-header";
import { DocumentsView } from "@/components/dashboard/documents-view";
import { getLang } from "@/lib/lang";

export const metadata = { title: "Dokumente" };

export default async function DokumentePage() {
  const lang = await getLang();
  const en = lang === "en";
  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <PageHeader
        title={en ? "Documents" : "Dokumente"}
        description={en ? "Your filing: invoices, quotes, delivery notes — searchable and usable by the AI chat." : "Deine Ablage: Rechnungen, Angebote, Lieferscheine — durchsuchbar und vom KI-Chat nutzbar."}
      />
      <DocumentsView lang={lang} />
    </div>
  );
}
