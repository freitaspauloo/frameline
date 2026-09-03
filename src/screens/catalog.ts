import type { ScreenCatalogEntry } from "@/screens/types";

const SCREEN = {
  priceCents: 900,
  priceLabel: "$9/mo",
  tier: "paid" as const,
};

/**
 * Storefront catalog — Reticle landing pages.
 * Layout slugs and old product slugs stay as aliases.
 *
 * Order: newest screens first (prepend new entries at the top).
 */
export const SCREENS_CATALOG: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "support-hero-skeleton",
    title: "Support Hero Skeleton",
    description:
      "Loading skeleton for Support — reticle pink color-blend plate, glass nav bones, headline, CTAs, and dashboard mock placeholder.",
    blurb: "Pink tint · glass nav bones · dashboard bone",
    poster: "/screens/support-hero-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "support-hero",
    title: "Support Hero",
    description:
      "Support product landing — reticle pink color-blend aurora, Geist type, floating glass nav that shrinks on scroll, GSAP entrance, dashboard mock.",
    blurb: "Geist · pink blend · GSAP · dashboard mock",
    poster: "/screens/support-hero/poster.png",
  },
  {
    ...SCREEN,
    slug: "health-ai-skeleton",
    title: "Pulse Skeleton",
    description:
      "Loading skeleton for Pulse — sky-blue shimmer bones over floating nav, hero video plate, headline, and body pill.",
    blurb: "Health loading state · hero plate · pill bones",
    poster: "/screens/health-ai-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "health-ai",
    title: "Pulse Hero",
    description:
      "AI health companion landing — light sky-blue canvas, hero video with fluted glass, GSAP morph intro, floating pill nav.",
    blurb: "Hero video · fluted glass · GSAP intro",
    poster: "/screens/health-ai/poster.png?v=20260831",
    aliases: ["pulse"],
  },
  {
    ...SCREEN,
    slug: "passo-mono-skeleton",
    title: "Passo Skeleton Mono",
    description:
      "Loading skeleton for Passo Mono — B&W hero plate shimmer and white accent bones over nav and lockup.",
    blurb: "Mono loading state · B&W plate · white accents",
    poster: "/screens/passo-mono-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "passo-skeleton",
    title: "Passo Skeleton",
    description:
      "Loading skeleton for Passo — shimmer bones over nav, hero card, headline, and Join CTA.",
    blurb: "Loading state · hero card · two-column lockup",
    poster: "/screens/passo-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "passo-mono",
    title: "Passo Mono",
    description:
      "Passo running homepage in monochrome — B&W hero slideshow, white accents, Geist Sans headline.",
    blurb: "B&W hero · white accents · dawn lockup",
    poster: "/screens/passo-mono/poster.png",
  },
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
    slug: "forgeai-lime-skeleton",
    title: "FORGE.AI Skeleton Lime",
    description:
      "Loading skeleton for FORGE.AI Lime — green-tinted shimmer bones over nav, prompt card, model chips, and template rail.",
    blurb: "Lime loading state · prompt bar · template peek",
    poster: "/screens/forgeai-lime-skeleton/poster.png",
  },
  {
    ...SCREEN,
    slug: "forgeai-pink-skeleton",
    title: "FORGE.AI Skeleton Pink",
    description:
      "Loading skeleton for FORGE.AI Pink — magenta-tinted shimmer bones over nav, prompt card, model chips, and template rail.",
    blurb: "Pink loading state · prompt bar · template peek",
    poster: "/screens/forgeai-pink-skeleton/poster.png",
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
    slug: "forgeai-skeleton",
    title: "FORGE.AI Skeleton",
    description:
      "Loading skeleton for FORGE.AI — blue-tinted shimmer bones over nav, prompt card, model chips, and template rail.",
    blurb: "Hero loading state · prompt bar · template rail",
    poster: "/screens/forgeai-skeleton/poster.png",
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
    slug: "miracle-login-cyan-skeleton",
    title: "Miracle Login Cyan Skeleton",
    description:
      "Loading skeleton for Miracle Login Cyan — split panel bones with cyan-tinted cover art shimmer.",
    blurb: "Auth loading state · cyan tint · form bones",
    poster: "/screens/miracle-login-cyan/poster.png",
  },
  {
    ...SCREEN,
    slug: "miracle-login-cyan",
    title: "Miracle Login Cyan",
    description:
      "Split-panel sign-in — cyan-tinted cover art, Reticle chrome, and GSAP panel entrance.",
    blurb: "Split panel · cyan art · sign-in form",
    poster: "/screens/miracle-login-cyan/poster.png",
    aliases: ["reticle-login-cyan"],
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
    poster: "/screens/defect-capture/poster.png",
    aliases: ["defect-capture"],
  },
  {
    ...SCREEN,
    slug: "magenta-landscape",
    title: "Magenta Landscape Hero",
    description:
      "Cinematic magenta field — horizon, grain, and a yield lockup across the line.",
    blurb: "Magenta grain · horizon · yield lockup",
    poster: "/screens/magenta-landscape/poster.png",
    aliases: ["growcode"],
  },
  {
    ...SCREEN,
    slug: "browser-frame",
    title: "AI Inspection Interface",
    description:
      "Wafer map and ranked classifications inside live window chrome.",
    blurb: "Wafer map · AI class · window chrome",
    poster: "/screens/browser-frame/poster.png",
    aliases: ["finlayer"],
  },
  {
    ...SCREEN,
    slug: "feature-rail",
    title: "Protect Yield Features",
    description:
      "Vertical feature rail — four beats that protect yield at production volume.",
    blurb: "In-line · classify · rank · protect",
    poster: "/screens/feature-rail/poster.png",
    aliases: ["features-sec"],
  },
  {
    ...SCREEN,
    slug: "blueprint",
    title: "Pixel Cube Hero",
    description:
      "Die-resolution pixel cube — classify every cell before it leaves the line.",
    blurb: "Pixel cube · die map · classified cells",
    poster: "/screens/blueprint/poster.png",
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
    poster: "/screens/light-rays/poster.png",
    aliases: ["aieigen"],
  },
  {
    ...SCREEN,
    slug: "prompt-bar",
    title: "Defect Assistant Hero",
    description:
      "Defect assistant workspace — ranked thread above, compose bar below.",
    blurb: "Assistant thread · ranked defects · compose",
    poster: "/screens/prompt-bar/poster.png",
    aliases: ["incredible"],
  },
  {
    ...SCREEN,
    slug: "ascii-hero",
    title: "ASCII Yield Hero",
    description:
      "Dark ASCII art hero — magenta color blend, @ deterioration cursor, GSAP entrance, fab marquee.",
    blurb: "ASCII art · magenta blend · cursor decay",
    poster: "/screens/ascii-hero/poster.png",
    aliases: ["axion-hero", "reticle-ascii-hero"],
  },
];

/** Still copyable, not listed in the public layout catalog. */
export const HIDDEN_SCREENS: ScreenCatalogEntry[] = [
  {
    ...SCREEN,
    slug: "picdrop-dashboard-skeleton",
    title: "Picdrop Dashboard Skeleton",
    description:
      "Loading skeleton for Picdrop — sidebar bones, stat cards, gallery rails, feedback panel, and table rows with GSAP entrance and shimmer.",
    blurb: "Dashboard loading state · GSAP · reticle pink accents",
    poster: "/screens/picdrop-dashboard-skeleton/poster.png",
  },
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
