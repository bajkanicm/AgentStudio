"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  Gauge,
  LayoutDashboard,
  Blocks,
  Handshake,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/templates", label: "Templates", icon: Blocks },
  { href: "/dashboard/agents", label: "My Agents", icon: Bot },
  { href: "/dashboard/usage", label: "Usage", icon: Gauge },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export interface ShellUser {
  name: string | null;
  email: string | null;
  plan: string;
  isDemo: boolean;
}

export function DashboardShell({
  user,
  userButton,
  children,
}: {
  user: ShellUser;
  userButton?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarContent user={user} userButton={userButton} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xl lg:hidden">
        <Logo href="/dashboard" />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar pt-2 lg:hidden">
            <div className="flex items-center justify-between px-4 py-2">
              <Logo href="/dashboard" />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-muted-foreground"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent user={user} userButton={userButton} />
          </aside>
        </>
      )}

      {/* Main */}
      <main className="min-w-0 flex-1 pt-14 lg:ml-64 lg:pt-0">{children}</main>
    </div>
  );
}

function SidebarContent({
  user,
  userButton,
}: {
  user: ShellUser;
  userButton?: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      <div className="hidden px-5 py-5 lg:block">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 lg:py-0">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-4.5", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4">
          <Link
            href="/done-for-you"
            className="flex items-center gap-3 rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 px-3 py-2.5 text-sm text-fuchsia-300 transition-colors hover:bg-fuchsia-500/10"
          >
            <Handshake className="size-4.5" />
            Get a Custom Agent
            <ArrowUpRight className="ml-auto size-3.5" />
          </Link>
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        {user.plan === "starter" && (
          <Button size="sm" className="glow-primary mb-4 w-full" asChild>
            <Link href="/dashboard/billing">Upgrade to Growth</Link>
          </Button>
        )}
        <div className="flex items-center gap-3">
          {userButton ?? (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              {(user.name ?? "Demo").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name ?? "Demo User"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email ?? "demo@agentstudio.tech"}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 border-primary/40 text-[10px] uppercase">
            {user.plan}
          </Badge>
        </div>
        {user.isDemo && (
          <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] leading-snug text-amber-300">
            Demo mode — add Clerk keys for real accounts.
          </p>
        )}
      </div>
    </>
  );
}
