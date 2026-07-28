import Link from "next/link";
import { redirect } from "next/navigation";
import { requireDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUsage } from "@/lib/usage";
import { getLang } from "@/lib/lang";
import { AGENT_TEMPLATES } from "@/lib/agent-templates";
import { PageHeader } from "@/components/dashboard/page-header";
import { AgentCard } from "@/components/dashboard/agent-card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Coins,
  FileText,
  PhoneIncoming,
  Plus,
  Handshake,
} from "lucide-react";

export const metadata = { title: "Übersicht" };

export default async function DashboardPage() {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");
  const lang = await getLang();
  const en = lang === "en";

  const [usage, agents, docCount, docsOpen, callCount, callsNew] = await Promise.all([
    getUsage(user.id, user.plan),
    db.agent.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { _count: { select: { conversations: true } } },
    }),
    db.document.count({ where: { userId: user.id } }),
    db.document.count({ where: { userId: user.id, status: "wartet_freigabe" } }),
    db.callNote.count({ where: { userId: user.id } }),
    db.callNote.count({ where: { userId: user.id, status: "neu" } }),
  ]);

  const firstName = user.name?.split(" ")[0] ?? "Chef";
  const msgPct =
    usage.messagesLimit === -1 ? 0 : usage.messagesUsed / usage.messagesLimit;

  return (
    <div className="mx-auto max-w-6xl space-y-10 py-2">
      <PageHeader
        title={`${en ? "Hello" : "Hallo"}, ${firstName}`}
        description={en ? "What your AI employees got done this month." : "Das haben deine KI-Mitarbeiter diesen Monat geschafft."}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/pilot">
                <Handshake className="size-4" />
                {en ? "Pilot program" : "Pilotprogramm"}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/templates">
                <Plus className="size-4" />
                {en ? "New AI employee" : "Neuer KI-Mitarbeiter"}
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats (mockup-style cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MockCard
          icon={<PhoneIncoming className="size-4.5" />}
          circle="bg-[#fdeadf] text-[#e8590c]"
          title={en ? "Calls answered" : "Angenommene Anrufe"}
          value={callCount.toLocaleString("de-DE")}
          unit={en ? "logged" : "notiert"}
          sub={callsNew === 0 ? (en ? "No open callbacks" : "Keine offenen Rückrufe") : en ? `${callsNew} open callback${callsNew === 1 ? "" : "s"}` : `${callsNew} offene${callsNew === 1 ? "r" : ""} Rückruf${callsNew === 1 ? "" : "e"}`}
        />
        <MockCard
          icon={<FileText className="size-4.5" />}
          circle="bg-[#e1f1e7] text-[#1e7d46]"
          title={en ? "Documents filed" : "Dokumente sortiert"}
          value={docCount.toLocaleString("de-DE")}
          unit={en ? "in your filing" : "in der Ablage"}
          sub={docCount === 0 ? (en ? "Add your first document" : "Leg dein erstes Dokument an") : en ? "Full-text searchable" : "Volltext durchsuchbar"}
        />
        <MockCard
          icon={<Coins className="size-4.5" />}
          circle="bg-[#f8eedc] text-[#b7791f]"
          title={en ? "Pending approvals" : "Offene Freigaben"}
          value={String(docsOpen)}
          unit={en ? "documents" : "Dokumente"}
          sub={docsOpen === 0 ? (en ? "All approved" : "Alles freigegeben") : en ? "waiting for your OK" : "warten auf dein OK"}
        />
        <MockCard
          icon={<Bot className="size-4.5" />}
          circle="bg-[#d8e5e1] text-[#0e3b33]"
          title={en ? "Time saved" : "Gesparte Zeit"}
          value={(Math.round(((usage.messagesUsed * 3) / 60) * 10) / 10).toLocaleString("de-DE")}
          unit={en ? "hours · estimated" : "Stunden · geschätzt"}
          sub={en ? "~3 min per handled message" : "ca. 3 Min pro erledigter Nachricht"}
        />
      </div>

      {/* Upgrade banner for starter plan near limit */}
      {usage.planId === "pilot" && msgPct > 0.6 && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium">
              {en ? `You've used ${Math.round(msgPct * 100)}% of your messages` : `Du hast ${Math.round(msgPct * 100)} % deiner Nachrichten verbraucht`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {en ? "Talk to us about the right plan for your business." : "Sprich mit uns über den passenden Plan für deinen Betrieb."}
            </p>
          </div>
          <Button className="glow-primary shrink-0" asChild>
            <Link href="/dashboard/billing">{en ? "View plans" : "Pläne ansehen"}</Link>
          </Button>
        </div>
      )}

      {/* My agents */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{en ? "Your AI employees" : "Deine KI-Mitarbeiter"}</h2>
          {agents.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/agents">
                {en ? "View all" : "Alle ansehen"}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
        {agents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Bot className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-4 font-medium">{en ? "No AI employees yet" : "Noch keine KI-Mitarbeiter"}</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              {en ? "Pick a template below and customize it — your first AI employee is ready in under two minutes." : "Wähle unten eine Vorlage und pass sie an — dein erster KI-Mitarbeiter ist in unter zwei Minuten startklar."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                lang={lang}
                conversationCount={agent._count.conversations}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick-start templates */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{en ? "Start from a template" : "Mit einer Vorlage starten"}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/templates">
              {en ? "All templates" : "Alle Vorlagen"}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AGENT_TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              href={`/dashboard/agents/new?template=${t.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <span className="text-2xl">{t.emoji}</span>
              <h3 className="mt-3 text-sm font-medium group-hover:text-primary">
                {en ? t.nameEn : t.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {en ? t.headlineEn : t.headline}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function MockCard({
  icon,
  circle,
  title,
  value,
  unit,
  sub,
}: {
  icon: React.ReactNode;
  circle: string;
  title: string;
  value: string;
  unit: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm">
      <span className={`flex size-10 items-center justify-center rounded-full ${circle}`}>
        {icon}
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="font-logo text-4xl font-bold tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
