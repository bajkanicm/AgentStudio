import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://agentstudio.tech";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/done-for-you`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/sign-up`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
