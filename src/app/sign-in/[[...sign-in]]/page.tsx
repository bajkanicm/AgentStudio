import { clerkEnabled } from "@/lib/auth";
import { AuthShell, DemoModeCard } from "@/components/auth-shell";

export const metadata = { title: "Anmelden" };

export default async function SignInPage() {
  if (clerkEnabled) {
    const { SignIn } = await import("@clerk/nextjs");
    return (
      <AuthShell>
        <SignIn />
      </AuthShell>
    );
  }
  return (
    <AuthShell>
      <DemoModeCard label="die Anmeldung" />
    </AuthShell>
  );
}
