import type { ScreenCatalogEntry } from "@/screens/types";

const SCREEN = {
  priceCents: 900,
  priceLabel: "$9/mo",
  tier: "paid" as const,
};

/**
 * Storefront catalog — Reticle landing pages.
 * Order: newest screens first (prepend new entries at the top).
 */
export const SCREENS_CATALOG: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "passo",
    title: "Passo",
    description:
      "Running app homepage — Paris night hero slideshow, lime accents, flip nav, two-column lockup.",
    blurb: "Hero slideshow · flip nav · lime Join CTA",
    poster: "/screens/passo/poster.png",
    aliases: ["running-app"],
  },
  {
    ...SCREEN,
    slug: "health-ai",
    title: "Pulse Hero",
    description:
      "AI health companion landing — light sky-blue canvas, hero video with fluted glass, GSAP morph intro, floating pill nav.",
    blurb: "Hero video · fluted glass · GSAP intro",
    poster: "/screens/health-ai/poster.png",
    aliases: ["pulse"],
  },
  {
    ...SCREEN,
    slug: "forgeai-pink",
    title: "FORGE.AI Hero Pink",
    description:
      "FORGE.AI builder hero with pink color-blend field — same prompt bar and template rail, magenta accents.",
    blurb: "Pink blend · prompt bar · template rail",
    poster: "/screens/forgeai-pink/poster.png",
  },
  {
    ...SCREEN,
    slug: "forgeai",
    title: "FORGE.AI Hero",
    description:
      "AI builder landing hero — blue gradient field, typewriter prompt, model and platform dropdowns, template rail.",
    blurb: "Prompt bar · model chips · template rail",
    poster: "/screens/forgeai/poster.png",
    aliases: ["fifty-x-hero"],
  },
  {
    ...SCREEN,
    slug: "forgeai-lime",
    title: "FORGE.AI Hero Lime",
    description:
      "FORGE.AI builder hero with lime color-blend field — same prompt bar and template rail, green accents.",
    blurb: "Lime blend · prompt bar · template rail",
    poster: "/screens/forgeai-lime/poster.png",
  },
];

/** Reserved for copy-only slugs that must never appear on /screens. Skeletons are dev-only — not listed here. */
export const HIDDEN_SCREENS: ScreenCatalogEntry[] = [];

export function getScreenBySlug(
  slug: string,
): ScreenCatalogEntry | undefined {
  return SCREENS_CATALOG.find(
    (entry) => entry.slug === slug || entry.aliases?.includes(slug),
  );
}

export function listScreens(): ScreenCatalogEntry[] {
  return SCREENS_CATALOG;
}

/** @deprecated Use listScreens(). Skeletons and dev-only slugs are excluded from the storefront. */
export function listAllScreenEntries(): ScreenCatalogEntry[] {
  return listScreens();
}
