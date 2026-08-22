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
        source: "/orb",
        destination: "/materials/orb",
        permanent: false,
      },
      {
        source: "/feature-cards",
        destination: "/materials/feature-cards",
        permanent: false,
      },
      {
        source: "/features",
        destination: "/materials/feature-cards",
        permanent: false,
      },
      {
        source: "/insights",
        destination: "/materials/insights",
        permanent: false,
      },
      {
        source: "/magenta-landscape",
        destination: "/materials/magenta-landscape",
        permanent: false,
      },
      {
        source: "/browser-frame",
        destination: "/materials/browser-frame",
        permanent: false,
      },
      {
        source: "/feature-rail",
        destination: "/materials/feature-rail",
        permanent: false,
      },
      {
        source: "/blueprint",
        destination: "/materials/blueprint",
        permanent: false,
      },
      {
        source: "/spaceman-moon",
        destination: "/materials/spaceman-moon",
        permanent: false,
      },
      {
        source: "/light-rays",
        destination: "/materials/light-rays",
        permanent: false,
      },
      {
        source: "/prompt-bar",
        destination: "/materials/prompt-bar",
        permanent: false,
      },
      {
        source: "/materials/built-for-yield",
        destination: "/materials/orb",
        permanent: false,
      },
      {
        source: "/materials/catch-killer-defects",
        destination: "/materials/feature-cards",
        permanent: false,
      },
      {
        source: "/materials/defect-capture",
        destination: "/materials/insights",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
