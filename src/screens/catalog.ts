import type { ScreenCatalogEntry } from "@/screens/types";

/**
 * Storefront catalog for screen templates — separate from MATERIALS_CATALOG.
 */
export const SCREENS_CATALOG: ScreenCatalogEntry[] = [
  {
    slug: "spaceman-moon",
    title: "Spaceman on the Moon",
    description:
      "Full-bleed cinematic hero — magenta moon video, glass pills, floating pins. Copy the prompt or the real TSX + CSS.",
    priceCents: 900,
    priceLabel: "$9",
    tier: "paid",
    blurb: "Cinematic lunar hero · $9 · 1 free copy / day",
  },
];

export function getScreenBySlug(
  slug: string,
): ScreenCatalogEntry | undefined {
  return SCREENS_CATALOG.find((entry) => entry.slug === slug);
}

export function listScreens(): ScreenCatalogEntry[] {
  return SCREENS_CATALOG;
}
