import type { ScreenCatalogEntry } from "@/screens/types";

const SCREEN = {
  priceCents: 900,
  priceLabel: "$9/mo",
  tier: "paid" as const,
};

/**
 * Storefront catalog — named for the layout.
 * Old product slugs stay as aliases.
 */
export const SCREENS_CATALOG: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "orb",
    title: "Orb",
    description:
      "Full-viewport composing orb behind headline, glass header, and yield stats.",
    blurb: "Hero orb · glass chrome · stats footer",
    poster: "/screens/built-for-yield/poster.png",
    aliases: ["built-for-yield"],
  },
  {
    ...SCREEN,
    slug: "feature-cards",
    title: "Feature cards",
    description:
      "Three-up feature cards on a ruled grid — fluted glass, production stats, GSAP entrance.",
    blurb: "Three-up cards · ruled grid · fluted glass",
    poster: "/screens/catch-killer-defects/poster.png",
    aliases: ["catch-killer-defects", "features"],
  },
  {
    ...SCREEN,
    slug: "insights",
    title: "Insights",
    description:
      "Interactive insights list with ranked review metrics and a sliding highlight.",
    blurb: "Insights list · ranked review · metrics",
    poster: "/screens/defect-capture/poster.png",
    aliases: ["defect-capture"],
  },
  {
    ...SCREEN,
    slug: "magenta-landscape",
    title: "Magenta landscape",
    description:
      "Cinematic magenta field — horizon, grain, and a landscape hero lockup.",
    blurb: "Cinematic field · magenta grain · horizon",
    poster: "/screens/magenta-landscape/poster.svg",
  },
  {
    ...SCREEN,
    slug: "browser-frame",
    title: "Browser frame",
    description:
      "Product surface inside realistic window chrome — traffic lights, tab, and address bar.",
    blurb: "Mac chrome · tab bar · live surface",
    poster: "/screens/browser-frame/poster.svg",
  },
  {
    ...SCREEN,
    slug: "feature-rail",
    title: "Feature rail",
    description:
      "Vertical feature rail on the left, live visual on the right. One surface, four beats.",
    blurb: "Left rail · four beats · live visual",
    poster: "/screens/feature-rail/poster.svg",
  },
  {
    ...SCREEN,
    slug: "blueprint",
    title: "Blueprint",
    description:
      "Navy technical plate — hairline grid, callouts, and measured type.",
    blurb: "Navy grid · callouts · measured type",
    poster: "/screens/blueprint/poster.svg",
  },
  {
    ...SCREEN,
    slug: "spaceman-moon",
    title: "Spaceman on the moon",
    description:
      "Full-bleed cinematic hero — magenta moon video, glass pills, floating pins.",
    blurb: "Cinematic lunar hero · glass pills · pins",
    poster: "/screens/spaceman-moon/poster.png",
  },
  {
    ...SCREEN,
    slug: "light-rays",
    title: "Light rays",
    description:
      "God-ray bloom field with a quiet type lockup. Heroes that read as light, not stock glow.",
    blurb: "God rays · bloom field · type lockup",
    poster: "/screens/light-rays/poster.svg",
  },
  {
    ...SCREEN,
    slug: "prompt-bar",
    title: "Prompt bar",
    description:
      "AI workspace with a pinned prompt bar — thread above, compose below.",
    blurb: "Pinned prompt · thread · compose",
    poster: "/screens/prompt-bar/poster.svg",
  },
];

/** Still copyable, not listed in the public layout catalog. */
export const HIDDEN_SCREENS: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "yield-skeleton",
    title: "Yield Skeleton",
    description:
      "Loading skeleton for Orb — shimmer bones over the orb, header, and stats.",
    blurb: "Hero loading state · orb sweep · shimmer bones",
    poster: "/screens/yield-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "features-skeleton",
    title: "Features Skeleton",
    description:
      "Loading skeleton for Feature cards — ruled grid, card bones, and stat placeholders.",
    blurb: "Feature-card loading state · ruled grid",
    poster: "/screens/features-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "insights-skeleton",
    title: "Insights Skeleton",
    description:
      "Loading skeleton for Insights — list rows, metric cards, and highlight bar.",
    blurb: "Insights loading state · list + metrics",
    poster: "/screens/insights-skeleton/poster.png",
  },
];

export function getScreenBySlug(
  slug: string,
): ScreenCatalogEntry | undefined {
  return (
    SCREENS_CATALOG.find(
      (entry) => entry.slug === slug || entry.aliases?.includes(slug),
    ) ?? HIDDEN_SCREENS.find((entry) => entry.slug === slug)
  );
}

export function listScreens(): ScreenCatalogEntry[] {
  return SCREENS_CATALOG;
}

export function listAllScreenEntries(): ScreenCatalogEntry[] {
  return [...SCREENS_CATALOG, ...HIDDEN_SCREENS];
}
