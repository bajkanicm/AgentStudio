import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { clerkEnabled } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://agentstudio.tech"),
  title: {
    default: "AgentStudio — AI Agents That Work For You",
    template: "%s · AgentStudio",
  },
  description:
    "Deploy ready-made AI agents for sales, support, content and data in minutes — or have our team build custom agents for you. Start free.",
  keywords: [
    "AI agents",
    "AI sales agent",
    "AI customer support",
    "AI content marketing",
    "AI data analyst",
    "custom AI agents",
  ],
  openGraph: {
    title: "AgentStudio — AI Agents That Work For You",
    description:
      "Deploy ready-made AI agents for sales, support, content and data in minutes — or have our team build custom agents for you.",
    url: "https://agentstudio.tech",
    siteName: "AgentStudio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentStudio — AI Agents That Work For You",
    description:
      "Ready-made AI agents you can customize in minutes, or done-for-you agents built by our team.",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0d0d14",
  width: "device-width",
  initialScale: 1,
};

async function Providers({ children }: { children: React.ReactNode }) {
  if (!clerkEnabled) return <>{children}</>;
  const { ClerkProvider } = await import("@clerk/nextjs");
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7c5cff",
          colorBackground: "#14141d",
          colorForeground: "#f4f4f8",
          colorInput: "#1c1c28",
          colorInputForeground: "#f4f4f8",
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
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
