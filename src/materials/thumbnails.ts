import manifest from "./thumbnails.json";

/** A stored still for a catalog entry, written by the thumbnail studio. */
export type MaterialThumbnail = {
  /** Public path under `public/`, without the cache-busting query. */
  path: string;
  width: number;
  height: number;
  /** Short content hash — appended as `?v=` so replacements bust the cache. */
  hash: string;
  updatedAt: string;
};

export type MaterialThumbnailManifest = Record<string, MaterialThumbnail>;

export const MATERIAL_THUMBNAILS = manifest as MaterialThumbnailManifest;

/** Aspect every thumbnail is normalized to — matches the catalog card box. */
export const THUMBNAIL_ASPECT_RATIO = 16 / 10;
export const THUMBNAIL_WIDTH = 1600;
export const THUMBNAIL_HEIGHT = 1000;

export function getMaterialThumbnail(
  slug: string,
): MaterialThumbnail | undefined {
  return MATERIAL_THUMBNAILS[slug];
}

/** Public `src` for a slug, cache-busted by content hash. */
export function getMaterialThumbnailSrc(slug: string): string | undefined {
  const thumbnail = MATERIAL_THUMBNAILS[slug];
  if (!thumbnail) return undefined;
  return `${thumbnail.path}?v=${thumbnail.hash}`;
}

export function hasMaterialThumbnail(slug: string): boolean {
  return slug in MATERIAL_THUMBNAILS;
}
