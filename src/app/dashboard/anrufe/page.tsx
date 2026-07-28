import { PageHeader } from "@/components/dashboard/page-header";
import { AnrufeView } from "@/components/dashboard/anrufe-view";
import { getLang } from "@/lib/lang";

export const metadata = { title: "Anrufe" };

export default async function AnrufePage() {
  const lang = await getLang();
  const en = lang === "en";
  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <PageHeader
        title={en ? "Calls" : "Anrufe"}
        description={en ? "Your phone assistant's notes: one call, one structured callback note." : "Die Notizen deines Telefonassistenten: ein Anruf, eine strukturierte Rückruf-Notiz."}
      />
      <AnrufeView lang={lang} />
    </div>
  );
}
