import { clerkEnabled } from "@/lib/auth";
import { getLang } from "@/lib/lang";
import { AuthShell, DemoModeCard } from "@/components/auth-shell";
import { SignUpForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Registrieren" };

export default async function SignUpPage() {
  const lang = await getLang();
  return (
    <AuthShell>
      {clerkEnabled ? <SignUpForm lang={lang} /> : <DemoModeCard label="die Registrierung" />}
    </AuthShell>
  );
}
