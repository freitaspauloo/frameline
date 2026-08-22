import { MATERIALS_CATALOG } from "@/materials";
import { listAllScreenEntries } from "@/screens/catalog";

export type ThumbnailTargetKind = "material" | "screen";

/** A catalog card that can carry an uploaded still. */
export type ThumbnailTarget = {
  slug: string;
  title: string;
  kind: ThumbnailTargetKind;
  /** Shown when no still has been uploaded — screen poster or CSS gradient. */
  defaultPoster?: string;
  fallbackColors?: string[];
};

export function listThumbnailTargets(): ThumbnailTarget[] {
  const materials: ThumbnailTarget[] = MATERIALS_CATALOG.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    kind: "material",
    fallbackColors: entry.fallbackColors,
  }));

  const screens: ThumbnailTarget[] = listAllScreenEntries().map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    kind: "screen",
    defaultPoster: entry.poster,
  }));

  return [...screens, ...materials];
}

export function isThumbnailTargetSlug(slug: string): boolean {
  return listThumbnailTargets().some((target) => target.slug === slug);
}
