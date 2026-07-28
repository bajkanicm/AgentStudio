import { redirect } from "next/navigation";
import { clerkEnabled, requireDbUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { getLang } from "@/lib/lang";
import { headers } from "next/headers";
import { DashboardShell } from "@/components/dashboard/shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");
  const lang = await getLang();
  const appMode = ((await headers()).get("user-agent") ?? "").includes("hey247App");

  return (
    <>
      {appMode && (
        // App-Modus: Seitenhintergrund = Panelfarbe, damit beim nativen
        // Bounce kein dunkelgrüner Rand aufblitzt.
        <style>{`html,body{background:#d8e5e1 !important}`}</style>
      )}
    <DashboardShell
      lang={lang}
      appMode={appMode}
      user={{
        name: user.name,
        email: user.email,
        plan: getPlan(user.plan).id,
        isDemo: !clerkEnabled,
      }}
    >
      {children}
    </DashboardShell>
    </>
  );
}
