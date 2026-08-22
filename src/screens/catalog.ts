import type { ScreenCatalogEntry } from "@/screens/types";

const SCREEN = {
  priceCents: 900,
  priceLabel: "$9/mo",
  tier: "paid" as const,
};

/**
 * Storefront catalog — the ten Reticle landing pages.
 * Layout slugs and old product slugs stay as aliases.
 */
export const SCREENS_CATALOG: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "orb",
    title: "Built for Yield Hero",
    description:
      "Full-viewport composing orb behind the yield headline, glass header, and fab stats.",
    blurb: "Hero orb · glass chrome · 40M dies classified",
    poster: "/screens/built-for-yield/poster.png",
    aliases: ["built-for-yield"],
  },
  {
    ...SCREEN,
    slug: "feature-cards",
    title: "Performance Feature Cards",
    description:
      "Three-up feature cards on a ruled grid — fluted glass, production stats, GSAP entrance.",
    blurb: "Three-up cards · killer defects · 6.2× review",
    poster: "/screens/catch-killer-defects/poster.png",
    aliases: ["catch-killer-defects", "features"],
  },
  {
    ...SCREEN,
    slug: "insights",
    title: "Yield Inspection Dashboard",
    description:
      "Interactive insights list with ranked review metrics and a sliding highlight.",
    blurb: "Ranked review · capture rate · line-level yield",
    poster: "/screens/defect-capture/poster.webp",
    aliases: ["defect-capture"],
  },
  {
    ...SCREEN,
    slug: "magenta-landscape",
    title: "Magenta Landscape Hero",
    description:
      "Cinematic magenta field — horizon, grain, and a yield lockup across the line.",
    blurb: "Magenta grain · horizon · yield lockup",
    poster: "/screens/magenta-landscape/poster.svg",
    aliases: ["growcode"],
  },
  {
    ...SCREEN,
    slug: "browser-frame",
    title: "AI Inspection Interface",
    description:
      "Wafer map and ranked classifications inside live window chrome.",
    blurb: "Wafer map · AI class · window chrome",
    poster: "/screens/browser-frame/poster.webp",
    aliases: ["finlayer"],
  },
  {
    ...SCREEN,
    slug: "feature-rail",
    title: "Protect Yield Features",
    description:
      "Vertical feature rail — four beats that protect yield at production volume.",
    blurb: "In-line · classify · rank · protect",
    poster: "/screens/feature-rail/poster.webp",
    aliases: ["features-sec"],
  },
  {
    ...SCREEN,
    slug: "blueprint",
    title: "Pixel Cube Hero",
    description:
      "Die-resolution pixel cube — classify every cell before it leaves the line.",
    blurb: "Pixel cube · die map · classified cells",
    poster: "/screens/blueprint/poster.svg",
    aliases: ["chainova"],
  },
  {
    ...SCREEN,
    slug: "spaceman-moon",
    title: "Space Explorer Hero",
    description:
      "Full-bleed cinematic hero — magenta moon video, glass pills, yield pins.",
    blurb: "Cinematic lunar hero · yield pins · Request Info",
    poster: "/screens/spaceman-moon/poster.png",
    aliases: ["nudgeai"],
  },
  {
    ...SCREEN,
    slug: "light-rays",
    title: "Always-on Wafer Inspection",
    description:
      "God-ray bloom over an always-on in-line wafer inspection lockup.",
    blurb: "Always-on · wafer · in-line models",
    poster: "/screens/light-rays/poster.svg",
    aliases: ["aieigen"],
  },
  {
    ...SCREEN,
    slug: "prompt-bar",
    title: "Defect Assistant Hero",
    description:
      "Defect assistant workspace — ranked thread above, compose bar below.",
    blurb: "Assistant thread · ranked defects · compose",
    poster: "/screens/prompt-bar/poster.svg",
    aliases: ["incredible"],
  },
];

/** Still copyable, not listed in the public layout catalog. */
export const HIDDEN_SCREENS: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "yield-skeleton",
    title: "Yield Skeleton",
    description:
      "Loading skeleton for Built for Yield Hero — shimmer bones over the orb, header, and stats.",
    blurb: "Hero loading state · orb sweep · shimmer bones",
    poster: "/screens/yield-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "features-skeleton",
    title: "Features Skeleton",
    description:
      "Loading skeleton for Performance Feature Cards — ruled grid, card bones, and stat placeholders.",
    blurb: "Feature-card loading state · ruled grid",
    poster: "/screens/features-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "insights-skeleton",
    title: "Insights Skeleton",
    description:
      "Loading skeleton for Yield Inspection Dashboard — list rows, metric cards, and highlight bar.",
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
