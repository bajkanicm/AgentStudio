import { clerkEnabled } from "@/lib/auth";
import { AuthShell, DemoModeCard } from "@/components/auth-shell";

export const metadata = { title: "Start free" };

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
      <DemoModeCard label="sign-up" />
    </AuthShell>
  );
}
