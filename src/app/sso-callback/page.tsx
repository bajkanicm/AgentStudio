import { redirect } from "next/navigation";
import { clerkEnabled } from "@/lib/auth";

export const metadata = { title: "Anmeldung" };

export default async function SsoCallbackPage() {
  if (!clerkEnabled) redirect("/dashboard");
  const { AuthenticateWithRedirectCallback } = await import("@clerk/nextjs");
  return (
    <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
      <AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard" />
      …
    </div>
  );
}
