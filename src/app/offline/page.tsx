import { Logo } from "@/components/logo";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <h1 className="text-2xl font-bold tracking-tight">Gerade keine Verbindung.</h1>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        hey247 braucht Internet, um deine Ablage und KI-Mitarbeiter zu
        erreichen. Sobald du wieder online bist, geht&apos;s hier weiter — die
        Seite lädt automatisch neu.
      </p>
    </div>
  );
}
