import { PageHeader } from "@/components/dashboard/page-header";
import { AnrufeView } from "@/components/dashboard/anrufe-view";

export const metadata = { title: "Anrufe" };

export default function AnrufePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <PageHeader
        title="Anrufe"
        description="Die Notizen deines Telefonassistenten: ein Anruf, eine strukturierte Rückruf-Notiz."
      />
      <AnrufeView />
    </div>
  );
}
