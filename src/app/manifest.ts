import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AgentStudio — AI Agents That Work For You",
    short_name: "AgentStudio",
    description:
      "Deploy ready-made AI agents for sales, support, content and data — or have our team build custom agents for you.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0d0d14",
    theme_color: "#0d0d14",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
