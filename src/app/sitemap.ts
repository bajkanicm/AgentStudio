import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://agentstudio.tech";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/en`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pilot`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/en/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/en/pilot`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
