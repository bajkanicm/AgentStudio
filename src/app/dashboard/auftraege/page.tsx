import { PageHeader } from "@/components/dashboard/page-header";
import { AuftraegeView } from "@/components/dashboard/auftraege-view";
import { getLang } from "@/lib/lang";

export const metadata = { title: "Aufträge" };

export default async function AuftraegePage() {
  const lang = await getLang();
  const en = lang === "en";
  return (
    <div className="mx-auto max-w-7xl space-y-6 py-2">
      <PageHeader
        title={en ? "Jobs & Requests" : "Aufträge & Anfragen"}
        description={en ? "Your request board: from New to Done — nothing gets lost." : "Dein Anfragenboard: von Neu bis Erledigt — nichts geht unter."}
      />
      <AuftraegeView lang={lang} />
    </div>
  );
}
