/** Paper NE-0 artboard — rotated hero plate is 1080×1440 → 1440×1080 viewport. */
export const FORGEAI_STAGE_WIDTH = 1440;
export const FORGEAI_STAGE_HEIGHT = 1080;

export const FORGEAI_SCREEN_SLUGS = new Set([
  "forgeai",
  "fifty-x-hero",
  "forgeai-pink",
  "forgeai-lime",
  "forgeai-skeleton",
  "forgeai-pink-skeleton",
  "forgeai-lime-skeleton",
]);

export function isForgeAiScreenSlug(slug: string): boolean {
  return FORGEAI_SCREEN_SLUGS.has(slug);
}
