import { redirect } from "next/navigation";
import { clerkEnabled, requireDbUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireDbUser();
  if (!user) redirect("/sign-in");

  let userButton: React.ReactNode = null;
  if (clerkEnabled) {
    const { UserButton } = await import("@clerk/nextjs");
    userButton = <UserButton />;
  }

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        plan: user.plan,
        isDemo: !clerkEnabled,
      }}
      userButton={userButton}
    >
      {children}
    </DashboardShell>
  );
}
