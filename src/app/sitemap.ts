import type { MetadataRoute } from "next";

import { DOCS_NAV } from "@/components/docs-shell";
import {
  MATERIALS_CATALOG,
  MATERIALS_COLLECTIONS,
  MATERIAL_USE_CONTEXTS,
} from "@/materials";

const BASE = "https://frameline.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/materials",
    "/free",
    "/collections",
    "/pricing",
    "/about",
    "/license",
    "/privacy",
    "/terms",
    "/changelog",
    ...DOCS_NAV.map((item) => item.href),
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/materials" || path === "/free" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/materials" || path === "/pricing" || path === "/free"
          ? 0.9
          : 0.7,
  }));

  const materials: MetadataRoute.Sitemap = MATERIALS_CATALOG.map((m) => ({
    url: `${BASE}/materials/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    // Free installables surface higher; paid detail pages stay discoverable.
    priority: m.tier === "free" ? 0.85 : 0.8,
  }));

  const collections: MetadataRoute.Sitemap = MATERIALS_COLLECTIONS.map((c) => ({
    url: `${BASE}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const contexts: MetadataRoute.Sitemap = MATERIAL_USE_CONTEXTS.map((c) => ({
    url: `${BASE}/materials/contexts/${c.value}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.72,
  }));

  return [...staticRoutes, ...materials, ...collections, ...contexts];
}
