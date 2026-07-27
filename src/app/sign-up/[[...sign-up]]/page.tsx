import { clerkEnabled } from "@/lib/auth";
import { AuthShell, DemoModeCard } from "@/components/auth-shell";

export const metadata = { title: "Registrieren" };

export default async function SignUpPage() {
  if (clerkEnabled) {
    const { SignUp } = await import("@clerk/nextjs");
    return (
      <AuthShell>
        <SignUp />
      </AuthShell>
    );
  }
  return (
    <AuthShell>
      <DemoModeCard label="die Registrierung" />
    </AuthShell>
  );
}
