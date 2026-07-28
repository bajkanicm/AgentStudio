"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Lang } from "@/lib/lang";
import { Loader2 } from "lucide-react";

/**
 * Eigene hey247-Auth-Oberfläche (headless Clerk) — kein sichtbares
 * Clerk-Branding. Unterstützt E-Mail+Passwort, Google-OAuth,
 * E-Mail-Verifizierung und Passwort-Reset.
 */

const L = {
  de: {
    signInTitle: "Willkommen zurück",
    signInSub: "Melde dich in deinem digitalen Büro an.",
    signUpTitle: "Konto anlegen",
    signUpSub: "In zwei Minuten startklar — kostenlos in der Pilotphase.",
    email: "E-Mail-Adresse",
    password: "Passwort",
    newPassword: "Neues Passwort",
    google: "Weiter mit Google",
    or: "oder",
    signIn: "Anmelden",
    signUp: "Registrieren",
    noAccount: "Noch kein Konto?",
    hasAccount: "Schon ein Konto?",
    forgot: "Passwort vergessen?",
    resetTitle: "Passwort zurücksetzen",
    resetSub: "Wir schicken dir einen Code per E-Mail.",
    sendCode: "Code senden",
    codeSentTo: "Code gesendet an",
    code: "Bestätigungscode",
    setPassword: "Passwort speichern",
    verifyTitle: "E-Mail bestätigen",
    verifySub: "Wir haben dir einen Code geschickt an",
    verify: "Bestätigen",
    back: "Zurück",
    genericError: "Das hat nicht geklappt. Bitte versuch es erneut.",
  },
  en: {
    signInTitle: "Welcome back",
    signInSub: "Sign in to your digital office.",
    signUpTitle: "Create your account",
    signUpSub: "Ready in two minutes — free during the pilot phase.",
    email: "Email address",
    password: "Password",
    newPassword: "New password",
    google: "Continue with Google",
    or: "or",
    signIn: "Sign in",
    signUp: "Sign up",
    noAccount: "No account yet?",
    hasAccount: "Already have an account?",
    forgot: "Forgot password?",
    resetTitle: "Reset password",
    resetSub: "We'll email you a verification code.",
    sendCode: "Send code",
    codeSentTo: "Code sent to",
    code: "Verification code",
    setPassword: "Save password",
    verifyTitle: "Verify your email",
    verifySub: "We sent a code to",
    verify: "Verify",
    back: "Back",
    genericError: "That didn't work. Please try again.",
  },
} as const;

function clerkError(err: unknown, fallback: string): string {
  const e = err as { errors?: { longMessage?: string; message?: string }[] };
  return e?.errors?.[0]?.longMessage ?? e?.errors?.[0]?.message ?? fallback;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/30">
      {children}
    </div>
  );
}

function GoogleButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <Button type="button" variant="outline" className="w-full" onClick={onClick} disabled={disabled}>
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z" />
      </svg>
      {label}
    </Button>
  );
}

export function SignInForm({ lang }: { lang: Lang }) {
  const t = L[lang];
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [mode, setMode] = React.useState<"form" | "reset-request" | "reset-code">("form");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const google = async () => {
    if (!isLoaded) return;
    setBusy(true);
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "form") {
        const res = await signIn.create({ identifier: email, password });
        if (res.status === "complete") {
          await setActive({ session: res.createdSessionId });
          router.push("/dashboard");
          return;
        }
        setError(t.genericError);
      } else if (mode === "reset-request") {
        await signIn.create({ strategy: "reset_password_email_code", identifier: email });
        setMode("reset-code");
      } else {
        const res = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code,
          password,
        });
        if (res.status === "complete") {
          await setActive({ session: res.createdSessionId });
          router.push("/dashboard");
          return;
        }
        setError(t.genericError);
      }
    } catch (err) {
      setError(clerkError(err, t.genericError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <h1 className="text-center text-xl font-bold tracking-tight">
        {mode === "form" ? t.signInTitle : t.resetTitle}
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        {mode === "form" ? t.signInSub : mode === "reset-request" ? t.resetSub : `${t.codeSentTo} ${email}`}
      </p>

      {mode === "form" && (
        <>
          <div className="mt-6">
            <GoogleButton label={t.google} onClick={google} disabled={busy || !isLoaded} />
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t.or}
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={submit} className="space-y-4">
        {(mode === "form" || mode === "reset-request") && (
          <div className="space-y-1.5">
            <Label htmlFor="si-email">{t.email}</Label>
            <Input id="si-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}
        {mode === "reset-code" && (
          <div className="space-y-1.5">
            <Label htmlFor="si-code">{t.code}</Label>
            <Input id="si-code" required inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        )}
        {(mode === "form" || mode === "reset-code") && (
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="si-password">{mode === "form" ? t.password : t.newPassword}</Label>
              {mode === "form" && (
                <button type="button" onClick={() => { setMode("reset-request"); setError(null); }} className="text-xs text-primary hover:underline">
                  {t.forgot}
                </button>
              )}
            </div>
            <Input id="si-password" type="password" required autoComplete={mode === "form" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="glow-primary w-full" disabled={busy || !isLoaded}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {mode === "form" ? t.signIn : mode === "reset-request" ? t.sendCode : t.setPassword}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {mode === "form" ? (
          <>
            {t.noAccount}{" "}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              {t.signUp}
            </Link>
          </>
        ) : (
          <button onClick={() => { setMode("form"); setError(null); }} className="text-primary hover:underline">
            {t.back}
          </button>
        )}
      </p>
    </Card>
  );
}

export function SignUpForm({ lang }: { lang: Lang }) {
  const t = L[lang];
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [mode, setMode] = React.useState<"form" | "verify">("form");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const google = async () => {
    if (!isLoaded) return;
    setBusy(true);
    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "form") {
        await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setMode("verify");
      } else {
        const res = await signUp.attemptEmailAddressVerification({ code });
        if (res.status === "complete") {
          await setActive({ session: res.createdSessionId });
          router.push("/dashboard");
          return;
        }
        setError(t.genericError);
      }
    } catch (err) {
      setError(clerkError(err, t.genericError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <h1 className="text-center text-xl font-bold tracking-tight">
        {mode === "form" ? t.signUpTitle : t.verifyTitle}
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        {mode === "form" ? t.signUpSub : `${t.verifySub} ${email}`}
      </p>

      {mode === "form" && (
        <>
          <div className="mt-6">
            <GoogleButton label={t.google} onClick={google} disabled={busy || !isLoaded} />
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t.or}
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={submit} className="space-y-4">
        {mode === "form" ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="su-email">{t.email}</Label>
              <Input id="su-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-password">{t.password}</Label>
              <Input id="su-password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="su-code">{t.code}</Label>
            <Input id="su-code" required inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {/* Clerk-Bot-Schutz (Smart CAPTCHA) rendert hier hinein, falls aktiv */}
        <div id="clerk-captcha" />
        <Button type="submit" className="glow-primary w-full" disabled={busy || !isLoaded}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {mode === "form" ? t.signUp : t.verify}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {mode === "form" ? (
          <>
            {t.hasAccount}{" "}
            <Link href="/sign-in" className="font-semibold text-primary hover:underline">
              {t.signIn}
            </Link>
          </>
        ) : (
          <button onClick={() => { setMode("form"); setError(null); }} className="text-primary hover:underline">
            {t.back}
          </button>
        )}
      </p>
    </Card>
  );
}
