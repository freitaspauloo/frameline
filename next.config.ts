import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // Keep Admin SDK / Prisma out of the Turbopack server graph.
  serverExternalPackages: ["firebase-admin", "@prisma/client", "prisma"],
};

export default nextConfig;
