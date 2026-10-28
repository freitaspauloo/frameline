/** Hero screens that must stay on the public grid even if admin draft overrides exist. */
export const PRIORITY_STOREFRONT_SCREEN_SLUGS = [
  "health-ai",
  "passo",
  "forgeai",
  "softwave",
  "bridge-dither",
  "miracle-login",
  "dark-pill-hero",
  "insights",
  "spaceman-moon",
  "ascii-hero",
] as const;

export type PriorityStorefrontScreenSlug =
  (typeof PRIORITY_STOREFRONT_SCREEN_SLUGS)[number];

const PRIORITY_SET = new Set<string>(PRIORITY_STOREFRONT_SCREEN_SLUGS);

export function isPriorityStorefrontScreen(slug: string): boolean {
  return PRIORITY_SET.has(slug);
}
