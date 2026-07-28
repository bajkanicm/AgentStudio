"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import { UserMenu } from "@/components/dashboard/user-menu";
import { TabBar } from "@/components/dashboard/tab-bar";
import type { Lang } from "@/lib/lang-shared";

const NAV = [
  { href: "/dashboard", de: "Übersicht", en: "Overview", exact: true },
  { href: "/dashboard/anrufe", de: "Anrufe", en: "Calls" },
  { href: "/dashboard/chat", de: "KI-Chat", en: "AI Chat" },
  { href: "/dashboard/dokumente", de: "Dokumente", en: "Documents" },
  { href: "/dashboard/agents", de: "KI-Mitarbeiter", en: "AI Employees" },
  { href: "/dashboard/kalender", de: "Kalender", en: "Calendar" },
  { href: "/dashboard/auftraege", de: "Aufträge", en: "Jobs" },
  { href: "/dashboard/billing", de: "Kosten", en: "Costs" },
];

export interface ShellUser {
  name: string | null;
  email: string | null;
  plan: string;
  isDemo: boolean;
}

/**
 * App shell per the hey247 mobile mockups: dark Tannengrün frame with a
 * rounded pale-green panel, pill-tab navigation, search/bell chips and an
 * avatar. The panel is scoped to the light "theme-paper" token set.
 */
export function DashboardShell({
  user,
  lang = "de",
  appMode = false,
  children,
}: {
  user: ShellUser;
  lang?: Lang;
  appMode?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const initials =
    (user.name ?? "Demo User")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "DU";

  if (appMode) {
    // Nativer App-Modus: Vollbild-Panel, schlanker Header, Bottom-Tab-Bar.
    return (
      <div
        className="theme-paper flex min-h-dvh flex-col bg-background px-4"
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
          paddingBottom: "calc(72px + env(safe-area-inset-bottom))",
        }}
      >
        <header className="flex items-center gap-3">
          <Logo href="/dashboard" className="text-ink" />
          <span className="flex-1" />
          <UserMenu
            name={user.name ?? "Demo User"}
            email={user.email ?? "demo@hey247.de"}
            initials={initials}
            lang={lang}
            canSignOut={!user.isDemo}
          />
        </header>
        <main className="mt-4 min-w-0 flex-1">{children}</main>
        <TabBar lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-sidebar p-2.5 sm:p-5">
      <div className="theme-paper flex min-h-[calc(100dvh-1.25rem)] flex-col rounded-[28px] bg-background px-4 pb-6 pt-5 sm:min-h-[calc(100dvh-2.5rem)] sm:rounded-[36px] sm:px-8 sm:pt-7 lg:px-11">
        {/* Header */}
        <header className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Logo href="/dashboard" className="text-ink" />

          {/* Pill nav */}
          <nav className="no-scrollbar order-3 -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 sm:order-none sm:mx-0 sm:w-auto sm:flex-1 sm:flex-wrap sm:overflow-visible sm:px-0">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-[#0a2c26] text-[#f2f1ec]"
                      : "bg-card text-foreground hover:bg-card/70"
                  )}
                >
                  {item[lang]}
                </Link>
              );
            })}
          </nav>

          {/* Right chips */}
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <span
              className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground"
              title="Suche — bald verfügbar"
            >
              <Search className="size-4" />
            </span>
            <span
              className="relative flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground"
              title="Benachrichtigungen — bald verfügbar"
            >
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-primary" />
            </span>
            <UserMenu
              name={user.name ?? "Demo User"}
              email={user.email ?? "demo@hey247.de"}
              initials={initials}
              lang={lang}
              canSignOut={!user.isDemo}
            />
          </div>
        </header>

        {user.isDemo && (
          <p className="mt-4 rounded-xl border border-amber-600/30 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-800">
            {lang === "en"
              ? "Demo mode — shared demo workspace. Auth keys enable real accounts."
              : "Demo-Modus — gemeinsamer Demo-Workspace. Auth-Keys aktivieren echte Konten."}
          </p>
        )}

        {/* Content */}
        <main className="mt-6 min-w-0 flex-1 sm:mt-8">{children}</main>
      </div>
    </div>
  );
}
