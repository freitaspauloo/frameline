import type { ScreenCatalogEntry } from "@/screens/types";

const SCREEN = {
  priceCents: 900,
  priceLabel: "$9/mo",
  tier: "paid" as const,
};

/**
 * Storefront catalog for screen templates — separate from MATERIALS_CATALOG.
 * Titles match the shipped Reticle screens.
 */
export const SCREENS_CATALOG: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "spaceman-moon",
    title: "Spaceman on the Moon",
    description:
      "Full-bleed cinematic hero — magenta moon video, glass pills, floating pins. Copy the prompt or the real TSX + CSS.",
    blurb: "Cinematic lunar hero · $9 · 1 free copy / week",
    poster: "/screens/spaceman-moon/poster.png",
  },
  {
    ...SCREEN,
    slug: "built-for-yield",
    title: "Built for Yield",
    description:
      "Fab-native hero with a composing orb, glass header, and yield stats. The Reticle home screen.",
    blurb: "In-line inspection hero · composing orb · yield stats",
    poster: "/screens/built-for-yield/poster.png",
  },
  {
    ...SCREEN,
    slug: "catch-killer-defects",
    title: "Catch Killer Defects",
    description:
      "Three-up feature cards on a ruled grid — fluted glass, production stats, and GSAP page entrance.",
    blurb: "Feature cards · fluted glass · 98% capture",
    poster: "/screens/catch-killer-defects/poster.png",
  },
  {
    ...SCREEN,
    slug: "defect-capture",
    title: "Yield Insights",
    description:
      "Interactive insights list with ranked review metrics. Headline: yield insights backed by production models.",
    blurb: "Insights list · ranked review · line-level metrics",
    poster: "/screens/defect-capture/poster.png",
  },
  {
    ...SCREEN,
    slug: "yield-skeleton",
    title: "Yield Skeleton",
    description:
      "Loading skeleton for Built for Yield — shimmer bones over the orb, header, and stats.",
    blurb: "Hero loading state · orb sweep · shimmer bones",
    poster: "/screens/yield-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "features-skeleton",
    title: "Features Skeleton",
    description:
      "Loading skeleton for Catch Killer Defects — ruled grid, card bones, and stat placeholders.",
    blurb: "Feature-card loading state · ruled grid",
    poster: "/screens/features-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "insights-skeleton",
    title: "Insights Skeleton",
    description:
      "Loading skeleton for Yield Insights — list rows, metric cards, and highlight bar.",
    blurb: "Insights loading state · list + metrics",
    poster: "/screens/insights-skeleton/poster.png",
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
