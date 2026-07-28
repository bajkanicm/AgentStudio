import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { clerkEnabled } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { SwRegister } from "@/components/sw-register";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://agentstudio.tech"),
  title: {
    default: "hey247 — Das digitale Büro für deinen Betrieb",
    template: "%s · hey247",
  },
  description:
    "KI-Mitarbeiter, die Anrufe annehmen, Rechnungen sortieren und Papierkram erledigen. 100 % deine Daten, 100 % in Deutschland. Werde Pilotbetrieb.",
  keywords: [
    "KI für Handwerker",
    "Telefonassistent Handwerk",
    "digitales Büro",
    "Rechnungen automatisieren",
    "Buchhaltung Handwerksbetrieb",
    "hey247",
  ],
  openGraph: {
    title: "hey247 — Das digitale Büro für deinen Betrieb",
    description:
      "KI-Mitarbeiter, die Anrufe annehmen, Rechnungen sortieren und Papierkram erledigen. 100 % in Deutschland.",
    url: "https://agentstudio.tech",
    siteName: "hey247",
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "hey247 — Das digitale Büro für deinen Betrieb",
    description:
      "KI-Mitarbeiter für Handwerksbetriebe: Telefon, Rechnungen, Buchhaltung, Angebote. 100 % in Deutschland.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "hey247",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a2c26",
  width: "device-width",
  initialScale: 1,
};

async function Providers({ children }: { children: React.ReactNode }) {
  if (!clerkEnabled) return <>{children}</>;
  const { ClerkProvider } = await import("@clerk/nextjs");
  const { deDE } = await import("@clerk/localizations");
  return (
    <ClerkProvider
      localization={deDE}
      appearance={{
        variables: {
          colorPrimary: "#e8590c",
          colorBackground: "#0e3b33",
          colorForeground: "#f2f1ec",
          colorInput: "#1c4a40",
          colorInputForeground: "#f2f1ec",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`dark ${plexSans.variable} ${plexMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
        <SwRegister />
      </body>
    </html>
  );
}
