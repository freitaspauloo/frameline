import { getMaterial } from "@/materials/catalog";
import { getMaterialThumbnailSrc } from "@/materials/thumbnails";
import { getScreenBySlug } from "@/screens/catalog";

export type AssetCatalogMeta = {
  slug: string;
  title: string;
  kind: "material" | "screen";
  thumbnailSrc?: string;
  fallbackColors?: string[];
  href: string;
};

/** Resolve storefront metadata for a material or screen slug. */
export function resolveAssetMeta(slug: string): AssetCatalogMeta | null {
  const material = getMaterial(slug);
  if (material) {
    return {
      slug,
      title: material.title,
      kind: "material",
      thumbnailSrc: getMaterialThumbnailSrc(slug),
      fallbackColors: material.fallbackColors,
      href: `/materials/${slug}`,
    };
  }

  const screen = getScreenBySlug(slug);
  if (screen) {
    return {
      slug,
      title: screen.title,
      kind: "screen",
      thumbnailSrc: screen.poster,
      href: `/screens/${screen.slug}`,
    };
  }

  return null;
}

export function buildAssetMetaMap(
  slugs: readonly string[],
): Record<string, AssetCatalogMeta> {
  const map: Record<string, AssetCatalogMeta> = {};
  for (const slug of slugs) {
    const meta = resolveAssetMeta(slug);
    if (meta) map[slug] = meta;
  }
  return map;
}
