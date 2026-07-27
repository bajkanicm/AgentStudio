import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  async redirects() {
    return [
      // Pre-hey247 route, kept for old links
      { source: "/done-for-you", destination: "/pilot", permanent: true },
      // German-friendly aliases
      { source: "/preise", destination: "/pricing", permanent: false },
      { source: "/pilotbetrieb", destination: "/pilot", permanent: false },
      { source: "/impressum", destination: "/legal/imprint", permanent: false },
      { source: "/datenschutz", destination: "/legal/privacy", permanent: false },
      { source: "/agb", destination: "/legal/terms", permanent: false },
    ];
  },
};

export default nextConfig;
