import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
      <Logo />
      <p className="text-7xl font-semibold tracking-tight text-gradient">404</p>
      <p className="max-w-sm text-muted-foreground">
        This page wandered off. Even our agents couldn&apos;t find it.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
