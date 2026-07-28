import { PageHeader } from "@/components/dashboard/page-header";
import { KalenderView } from "@/components/dashboard/kalender-view";
import { getLang } from "@/lib/lang";

export const metadata = { title: "Kalender" };

export default async function KalenderPage() {
  const lang = await getLang();
  const en = lang === "en";
  return (
    <div className="mx-auto max-w-7xl space-y-6 py-2">
      <PageHeader
        title={en ? "Calendar" : "Kalender"}
        description={en ? "Your week at a glance — maintenance, customer appointments, emergencies." : "Deine Woche auf einen Blick — Wartungen, Kundentermine, Notfälle."}
      />
      <KalenderView lang={lang} />
    </div>
  );
}
