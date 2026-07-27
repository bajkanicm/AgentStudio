import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "hey247 — Das digitale Büro für deinen Betrieb",
    short_name: "hey247",
    description:
      "KI-Mitarbeiter, die Anrufe annehmen, Rechnungen sortieren und Papierkram erledigen — 100 % in Deutschland.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a2c26",
    theme_color: "#0a2c26",
    lang: "de",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
