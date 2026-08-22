import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // Cursor Simple Browser hits 127.0.0.1 while next binds 0.0.0.0.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Keep Admin SDK / Prisma out of the Turbopack server graph.
  serverExternalPackages: ["firebase-admin", "@prisma/client", "prisma"],
  async redirects() {
    return [
      {
        source: "/screens",
        destination: "/materials",
        permanent: true,
      },
      {
        source: "/screens/:slug",
        destination: "/materials/:slug",
        permanent: true,
      },
      {
        source: "/collections",
        destination: "/materials",
        permanent: true,
      },
      {
        source: "/collections/:slug",
        destination: "/materials",
        permanent: true,
      },
      {
        source: "/features",
        destination: "/feature-cards",
        permanent: false,
      },
      {
        source: "/materials/built-for-yield",
        destination: "/orb",
        permanent: false,
      },
      {
        source: "/materials/catch-killer-defects",
        destination: "/feature-cards",
        permanent: false,
      },
      {
        source: "/materials/defect-capture",
        destination: "/insights",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
