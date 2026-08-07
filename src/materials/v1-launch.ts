import { MATERIALS_CATALOG } from "./catalog";
import type { MaterialCatalogEntry } from "./types";

/**
 * Lean V1 public catalog — heroes only.
 * Full MATERIALS_CATALOG stays in repo for admin / future drops.
 *
 * Mix: hero · free mesh · texture · signal · wild card
 */
export const V1_LAUNCH_MATERIAL_SLUGS = [
  "fog-layer",
  "aurora-mesh",
  "ink-dither",
  "blue-signal",
  "liquid-chrome",
] as const;

export type V1LaunchMaterialSlug = (typeof V1_LAUNCH_MATERIAL_SLUGS)[number];

const V1_ORDER = new Map<string, number>(
  V1_LAUNCH_MATERIAL_SLUGS.map((slug, index) => [slug, index]),
);

export function isV1LaunchMaterial(slug: string): boolean {
  return V1_ORDER.has(slug);
}

/** Filter + stable V1 order (launch sheet order). */
export function filterV1LaunchCatalog<T extends { slug: string }>(
  entries: readonly T[],
): T[] {
  return entries
    .filter((entry) => V1_ORDER.has(entry.slug))
    .slice()
    .sort(
      (a, b) => (V1_ORDER.get(a.slug) ?? 99) - (V1_ORDER.get(b.slug) ?? 99),
    );
}

/** Sync public catalog for client components (homepage strips, etc.). */
export function getV1LaunchCatalog(): MaterialCatalogEntry[] {
  return filterV1LaunchCatalog(MATERIALS_CATALOG);
}
