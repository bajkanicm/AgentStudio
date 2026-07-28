import { redirect } from "next/navigation";
import { clerkEnabled, requireDbUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { getLang } from "@/lib/lang";
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

  return (
    <DashboardShell
      lang={lang}
      user={{
        name: user.name,
        email: user.email,
        plan: getPlan(user.plan).id,
        isDemo: !clerkEnabled,
      }}
    >
      {children}
    </DashboardShell>
  );
}
