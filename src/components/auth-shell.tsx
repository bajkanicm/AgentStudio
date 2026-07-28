import Link from "next/link";
import { Logo } from "@/components/logo";
import { LangToggle } from "@/components/lang-toggle";
import type { Lang } from "@/lib/lang-shared";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AuthShell({
  children,
  lang = "de",
}: {
  children: React.ReactNode;
  lang?: Lang;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-4 py-6 sm:gap-8 sm:py-10">
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
      <div
        className="animate-aurora absolute -top-32 left-1/2 -z-10 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-orange-600/15 blur-[110px]"
        aria-hidden
      />
      <div
        className="absolute right-4"
        style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      >
        <LangToggle lang={lang} />
      </div>
      <Logo />
      {children}
    </div>
  );
}

export function DemoModeCard({ label }: { label: string }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <h1 className="text-xl font-semibold">Demo-Modus</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Es sind keine Clerk-Keys hinterlegt — {label} ist deaktiviert und die App läuft mit einem gemeinsamen Demo-Workspace. Hinterlege{" "}
        <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        </code>{" "}
        and{" "}
        <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
          CLERK_SECRET_KEY
        </code>{" "}
        , um echte Konten zu aktivieren.
      </p>
      <Button className="mt-6 w-full" asChild>
        <Link href="/dashboard">
          Demo-Dashboard öffnen
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
