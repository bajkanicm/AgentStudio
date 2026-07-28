import Link from "next/link";
import { getLang } from "@/lib/lang";
import {
  Bot,
  Blocks,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Gauge,
  Inbox,
  LifeBuoy,
} from "lucide-react";

export const metadata = { title: "Mehr" };

/** iOS-Settings-Stil: Liste der weiteren Module (App-Tab „Mehr"). */
export default async function MehrPage() {
  const lang = await getLang();
  const en = lang === "en";
  const items = [
    { href: "/dashboard/agents", icon: Bot, de: "KI-Mitarbeiter", en: "AI Employees" },
    { href: "/dashboard/templates", icon: Blocks, de: "Vorlagen", en: "Templates" },
    { href: "/dashboard/kalender", icon: CalendarDays, de: "Kalender", en: "Calendar" },
    { href: "/dashboard/auftraege", icon: Inbox, de: "Aufträge & Anfragen", en: "Jobs & Requests" },
    { href: "/dashboard/usage", icon: Gauge, de: "Nutzung & Limits", en: "Usage & limits" },
    { href: "/dashboard/billing", icon: CreditCard, de: "Kosten & Pläne", en: "Costs & plans" },
    { href: "/hilfe", icon: LifeBuoy, de: "Hilfe & Erste Schritte", en: "Help & getting started" },
  ] as const;
  return (
    <div className="mx-auto max-w-lg space-y-4 py-2">
      <h1 className="px-1 text-2xl font-bold tracking-tight">{en ? "More" : "Mehr"}</h1>
      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-secondary"
            style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
              <item.icon className="size-4" />
            </span>
            <span className="flex-1 text-sm font-semibold">{item[lang]}</span>
            <ChevronRight className="size-4 text-muted-foreground/60" />
          </Link>
        ))}
      </div>
    </div>
  );
}
