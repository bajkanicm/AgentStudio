import { clerkEnabled } from "@/lib/auth";
import { getLang } from "@/lib/lang";
import { AuthShell, DemoModeCard } from "@/components/auth-shell";
import { SignInForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Anmelden" };

export default async function SignInPage() {
  const lang = await getLang();
  return (
    <AuthShell>
      {clerkEnabled ? <SignInForm lang={lang} /> : <DemoModeCard label="die Anmeldung" />}
    </AuthShell>
  );
}
