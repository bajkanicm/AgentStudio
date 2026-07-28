"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/lang-shared";
import {
  FolderOpen,
  LayoutGrid,
  MessagesSquare,
  MoreHorizontal,
  PhoneCall,
} from "lucide-react";

const TABS = [
  { href: "/dashboard", de: "Übersicht", en: "Home", icon: LayoutGrid, exact: true },
  { href: "/dashboard/anrufe", de: "Anrufe", en: "Calls", icon: PhoneCall },
  { href: "/dashboard/chat", de: "KI-Chat", en: "AI Chat", icon: MessagesSquare },
  { href: "/dashboard/dokumente", de: "Dokumente", en: "Docs", icon: FolderOpen },
  { href: "/dashboard/mehr", de: "Mehr", en: "More", icon: MoreHorizontal },
];

/** Nativer iOS-Stil: fixe Bottom-Tab-Bar, nur im App-Modus gerendert. */
export function TabBar({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  return (
    <nav
      className="shrink-0 border-t border-border bg-card"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-w-16 flex-col items-center gap-0.5 px-2 pb-1.5 pt-2 text-[10px] font-semibold transition-colors active:opacity-60",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className="size-5" strokeWidth={active ? 2.4 : 2} />
              {tab[lang]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
