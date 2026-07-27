import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  // Keep OCR/PDF libs as regular node_modules so their worker files and
  // WASM assets survive standalone output tracing.
  serverExternalPackages: ["tesseract.js", "pdf-parse", "@napi-rs/canvas"],
  // Output tracing misses files loaded by worker threads / dynamic requires —
  // force-include the complete packages for the upload route.
  outputFileTracingIncludes: {
    "/api/documents/upload": [
      "./node_modules/tesseract.js/**/*",
      "./node_modules/tesseract.js-core/**/*",
      // tesseract worker-thread runtime deps (not seen by static tracing)
      "./node_modules/bmp-js/**/*",
      "./node_modules/idb-keyval/**/*",
      "./node_modules/is-url/**/*",
      "./node_modules/node-fetch/**/*",
      "./node_modules/regenerator-runtime/**/*",
      "./node_modules/wasm-feature-detect/**/*",
      "./node_modules/zlibjs/**/*",
      "./node_modules/whatwg-url/**/*",
      "./node_modules/tr46/**/*",
      "./node_modules/webidl-conversions/**/*",
      "./node_modules/pdf-parse/**/*",
      "./node_modules/pdfjs-dist/**/*",
      "./node_modules/@napi-rs/canvas/**/*",
    ],
  },
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
