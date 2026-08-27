import type { MetadataRoute } from "next";

import { DOCS_NAV } from "@/components/docs-shell";
import { getResolvedCatalog, getResolvedScreens } from "@/lib/demo-catalog";
import { MATERIAL_USE_CONTEXTS } from "@/materials";

const BASE = "https://frameline.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [materialsCatalog, screensCatalog] = await Promise.all([
    getResolvedCatalog(),
    getResolvedScreens(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/materials",
    "/free",
    "/pricing",
    "/waitlist",
    "/about",
    "/contact",
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
        : path === "/materials" || path === "/pricing" || path === "/free" || path === "/waitlist"
          ? 0.9
          : 0.7,
  }));

  const materials: MetadataRoute.Sitemap = materialsCatalog.map((m) => ({
    url: `${BASE}/materials/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: m.tier === "free" ? 0.85 : 0.8,
  }));

  const screens: MetadataRoute.Sitemap = screensCatalog.map((screen) => ({
    url: `${BASE}/materials/${screen.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const contexts: MetadataRoute.Sitemap = MATERIAL_USE_CONTEXTS.map((c) => ({
    url: `${BASE}/materials/contexts/${c.value}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.72,
  }));

  return [...staticRoutes, ...screens, ...materials, ...contexts];
}
