import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // Keep Admin SDK out of the Turbopack server graph (also in Next defaults).
  serverExternalPackages: ["firebase-admin"],
  // Ensure pnpm-nested firebase-admin lands in the Vercel serverless trace.
  outputFileTracingIncludes: {
    "/api/auth/firebase-status": [
      "./node_modules/firebase-admin/**/*",
      "./node_modules/.pnpm/firebase-admin@*/**/*",
    ],
    "/api/auth/session": [
      "./node_modules/firebase-admin/**/*",
      "./node_modules/.pnpm/firebase-admin@*/**/*",
    ],
  },
};

export default nextConfig;
