import type { ScreenCatalogEntry } from "@/screens/types";

const SCREEN = {
  priceCents: 900,
  priceLabel: "$9/mo",
  tier: "paid" as const,
};

/**
 * Storefront catalog — Reticle landing pages.
 * Layout slugs and old product slugs stay as aliases.
 */
export const SCREENS_CATALOG: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "dark-pill-hero",
    title: "Dark Pill Nav Hero",
    description:
      "Void canvas hero — cinematic wave art, segmented pill nav, yield lockup, fab wordmarks.",
    blurb: "Pill nav · wave art · magenta blend",
    poster: "/screens/dark-pill-hero/poster.png",
    aliases: ["klyro-hero"],
  },
  {
    ...SCREEN,
    slug: "orb",
    title: "Built for Yield Hero",
    description:
      "Full-viewport composing orb behind the yield headline, glass header, and fab stats.",
    blurb: "Hero orb · glass chrome · 40M dies classified",
    poster: "/screens/built-for-yield/poster.webp",
    aliases: ["built-for-yield"],
  },
  {
    ...SCREEN,
    slug: "feature-cards",
    title: "Performance Feature Cards",
    description:
      "Three-up feature cards on a ruled grid — fluted glass, production stats, GSAP entrance.",
    blurb: "Three-up cards · killer defects · 6.2× review",
    poster: "/screens/catch-killer-defects/poster.webp",
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
    poster: "/screens/magenta-landscape/poster.webp",
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
    poster: "/screens/blueprint/poster.webp",
    aliases: ["chainova"],
  },
  {
    ...SCREEN,
    slug: "spaceman-moon",
    title: "Space Explorer Hero",
    description:
      "Full-bleed cinematic hero — magenta moon video, glass pills, yield pins.",
    blurb: "Cinematic lunar hero · yield pins · Request Info",
    poster: "/screens/spaceman-moon/poster.webp",
    aliases: ["nudgeai"],
  },
  {
    ...SCREEN,
    slug: "light-rays",
    title: "Always-on Wafer Inspection",
    description:
      "God-ray bloom over an always-on in-line wafer inspection lockup.",
    blurb: "Always-on · wafer · in-line models",
    poster: "/screens/light-rays/poster.webp",
    aliases: ["aieigen"],
  },
  {
    ...SCREEN,
    slug: "prompt-bar",
    title: "Defect Assistant Hero",
    description:
      "Defect assistant workspace — ranked thread above, compose bar below.",
    blurb: "Assistant thread · ranked defects · compose",
    poster: "/screens/prompt-bar/poster.webp",
    aliases: ["incredible"],
  },
  {
    ...SCREEN,
    slug: "ascii-hero",
    title: "ASCII Yield Hero",
    description:
      "Dark ASCII art hero — magenta color blend, @ deterioration cursor, GSAP entrance, fab marquee.",
    blurb: "ASCII art · magenta blend · cursor decay",
    poster: "/screens/ascii-hero/poster.webp",
    aliases: ["axion-hero", "reticle-ascii-hero"],
  },
  {
    ...SCREEN,
    slug: "softwave",
    title: "Softwave Hero",
    description:
      "Vintage desktop hero — bliss hill video, pixel headline, glass pill nav, and analog-warmth copy.",
    blurb: "Bliss hill · pixel headline · glass pills",
    poster: "/screens/softwave/poster.png",
  },
  {
    ...SCREEN,
    slug: "softwave-features",
    title: "Softwave Feature Cards",
    description:
      "Four-up ML ops cards — hover captions, drifting art, and Geist Pixel titles on a light canvas.",
    blurb: "Four cards · hover captions · drifting art",
    poster: "/screens/softwave-features/poster.png",
  },
  {
    ...SCREEN,
    slug: "bridge-dither",
    title: "Bridge Dither",
    description:
      "Warm bridge dither art hero — interactive canvas, progressive blur edges, and GSAP headline reveal.",
    blurb: "Bridge dither · progressive blur · clip headline",
    poster: "/screens/bridge-dither/poster.png",
    aliases: ["oasis-hero"],
  },
  {
    ...SCREEN,
    slug: "mexin-hero",
    title: "Mexin Hero",
    description:
      "Floating pill nav hero — light canvas, magenta color-blend over abstract art, fab wordmarks.",
    blurb: "Pill nav · magenta blend · fab logos",
    poster: "/screens/mexin-hero/poster.png",
  },
  {
    ...SCREEN,
    slug: "miracle-login",
    title: "Miracle Login",
    description:
      "Split-panel sign-in — magenta-tinted cover art, Reticle chrome, and GSAP panel entrance.",
    blurb: "Split panel · magenta art · sign-in form",
    poster: "/screens/miracle-login/poster.png",
    aliases: ["reticle-login"],
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
  {
    ...SCREEN,
    slug: "ascii-hero-skeleton",
    title: "ASCII Yield Skeleton",
    description:
      "Loading skeleton for ASCII Yield Hero — dark shimmer bones over nav, headline, CTAs, and fab marquee.",
    blurb: "Hero loading state · ASCII field · magenta tint",
    poster: "/screens/ascii-hero-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "dark-pill-hero-skeleton",
    title: "Dark Pill Nav Skeleton",
    description:
      "Loading skeleton for Dark Pill Nav Hero — dark shimmer bones over nav, headline, CTAs, and fab logos.",
    blurb: "Hero loading state · void canvas · magenta tint",
    poster: "/screens/dark-pill-hero-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "softwave-skeleton",
    title: "Softwave Skeleton",
    description:
      "Loading skeleton for Softwave Hero — shimmer bones over bliss hill, nav pills, and pixel headline.",
    blurb: "Hero loading state · bliss hill · pixel bones",
    poster: "/screens/softwave/poster.png",
  },
  {
    ...SCREEN,
    slug: "softwave-features-skeleton",
    title: "Softwave Features Skeleton",
    description:
      "Loading skeleton for Softwave Feature Cards — four card bones with title and caption placeholders.",
    blurb: "Feature-card loading state · four-up grid",
    poster: "/screens/softwave-features/poster.png",
  },
  {
    ...SCREEN,
    slug: "bridge-dither-skeleton",
    title: "Bridge Dither Skeleton",
    description:
      "Loading skeleton for Bridge Dither — shimmer bones over dither field, nav, and headline.",
    blurb: "Hero loading state · dither grid · clip bones",
    poster: "/screens/bridge-dither/poster.png",
  },
  {
    ...SCREEN,
    slug: "mexin-hero-skeleton",
    title: "Mexin Hero Skeleton",
    description:
      "Loading skeleton for Mexin Hero — shimmer bones over nav, headline, CTAs, and fab logos.",
    blurb: "Hero loading state · pill nav · fab bones",
    poster: "/screens/mexin-hero/poster.png",
  },
  {
    ...SCREEN,
    slug: "miracle-login-skeleton",
    title: "Miracle Login Skeleton",
    description:
      "Loading skeleton for Miracle Login — split panel bones over cover art and sign-in form.",
    blurb: "Auth loading state · split panel · form bones",
    poster: "/screens/miracle-login/poster.png",
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
