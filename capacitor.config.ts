import type { CapacitorConfig } from "@capacitor/cli";

/**
 * hey247 iOS-App: nativer Shell um die produktive Web-App (SSR — daher
 * remote URL statt gebündeltem Web-Build). capacitor-www/ enthält nur die
 * Offline-Fallback-Seite.
 */
const config: CapacitorConfig = {
  appId: "de.hey247.app",
  appName: "hey247",
  webDir: "capacitor-www",
  server: {
    url: "https://agentstudio.tech",
    // Clerk-Auth (Login-Redirects) muss innerhalb der App bleiben
    allowNavigation: [
      "agentstudio.tech",
      "*.agentstudio.tech",
      "hey247.de",
      "*.hey247.de",
      "*.clerk.accounts.dev",
      "accounts.google.com",
    ],
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#0a2c26",
  },
  // Server erkennt die App am User-Agent und blendet Marketing-Seiten aus
  // (App startet direkt in Login/Dashboard, siehe src/middleware.ts).
  appendUserAgent: "hey247App",
};

export default config;
