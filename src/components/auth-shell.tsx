import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
      <div
        className="animate-aurora absolute -top-32 left-1/2 -z-10 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]"
        aria-hidden
      />
      <Logo />
      {children}
    </div>
  );
}

export function DemoModeCard({ label }: { label: string }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <h1 className="text-xl font-semibold">Demo mode</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Clerk keys aren&apos;t configured, so {label} is disabled and the app runs
        with a shared demo workspace. Add{" "}
        <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        </code>{" "}
        and{" "}
        <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
          CLERK_SECRET_KEY
        </code>{" "}
        to enable real accounts.
      </p>
      <Button className="mt-6 w-full" asChild>
        <Link href="/dashboard">
          Enter demo dashboard
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
