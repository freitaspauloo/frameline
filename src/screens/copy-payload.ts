import { registryUrl, rewriteAssetReferences } from "@/lib/registry-urls";
import { getScreenBySlug } from "@/screens/catalog";
import { DARK_PILL_HERO_PROMPT } from "@/screens/dark-pill-hero/copy";
import { SPACEMAN_MOON_PROMPT } from "@/screens/spaceman-moon/copy";

const FILES: Record<string, { files: string[]; prompt: string; note: string }> = {
  orb: {
    files: [
      "src/screens/built-for-yield/built-for-yield.tsx",
      "src/screens/built-for-yield/hero-orb.tsx",
      "src/screens/built-for-yield/built-for-yield.css",
      "src/screens/stage.tsx",
      "src/screens/stage.module.css",
    ],
    prompt: `Build the Built for Yield Hero — composing orb, glass Reticle header, yield stats footer.`,
    note: "Requires the thinking-orbs package and ScreenStage. Alias: built-for-yield.",
  },
  "feature-cards": {
    files: [
      "src/screens/catch-killer-defects/catch-killer-defects.tsx",
      "src/screens/catch-killer-defects/catch-killer-defects.css",
    ],
    prompt: `Build Performance Feature Cards — three-up ruled grid, fluted glass, GSAP entrance, yield stats.`,
    note: "Alias: catch-killer-defects.",
  },
  insights: {
    files: [
      "src/screens/defect-capture/defect-capture.tsx",
      "src/screens/defect-capture/defect-capture.css",
    ],
    prompt: `Build the Yield Inspection Dashboard — ranked list, highlight bar, metric cards.`,
    note: "Alias: defect-capture.",
  },
  "magenta-landscape": {
    files: [
      "src/screens/layouts/magenta-landscape.tsx",
      "src/screens/reticle-mark.tsx",
      "src/screens/stage.tsx",
    ],
    prompt: `Build the Magenta Landscape Hero — cinematic grain field, horizon, Reticle yield lockup.`,
    note: "Uses GrainGradient on ScreenStage. Alias: growcode.",
  },
  "browser-frame": {
    files: [
      "src/screens/layouts/browser-frame.tsx",
      "src/screens/reticle-mark.tsx",
      "src/screens/stage.tsx",
    ],
    prompt: `Build the AI Inspection Interface — wafer map and ranked classifications inside window chrome.`,
    note: "Reticle inspect surface in mac chrome. Alias: finlayer.",
  },
  "feature-rail": {
    files: [
      "src/screens/layouts/feature-rail.tsx",
      "src/screens/reticle-mark.tsx",
      "src/screens/stage.tsx",
    ],
    prompt: `Build Protect Yield Features — left rail of four yield beats, right magenta field.`,
    note: "1920×1080 split plate. Alias: features-sec.",
  },
  blueprint: {
    files: [
      "src/screens/layouts/blueprint.tsx",
      "src/screens/reticle-mark.tsx",
      "src/screens/stage.tsx",
    ],
    prompt: `Build the Pixel Cube Hero — die-resolution pixel cube, Reticle chrome, classified cells.`,
    note: "Technical plate on ScreenStage. Alias: chainova.",
  },
  "light-rays": {
    files: [
      "src/screens/layouts/light-rays.tsx",
      "src/screens/reticle-mark.tsx",
      "src/screens/stage.tsx",
    ],
    prompt: `Build Always-on Wafer Inspection — GodRays bloom, wafer rings, 24/7 yield lockup.`,
    note: "Uses @paper-design/shaders-react GodRays. Alias: aieigen.",
  },
  "prompt-bar": {
    files: [
      "src/screens/layouts/prompt-bar.tsx",
      "src/screens/reticle-mark.tsx",
      "src/screens/stage.tsx",
    ],
    prompt: `Build the Defect Assistant Hero — ranked defect thread above, pinned compose bar below.`,
    note: "AI workspace chrome on ScreenStage. Alias: incredible.",
  },
  "spaceman-moon": {
    files: [
      "src/screens/spaceman-moon/spaceman-moon.tsx",
      "src/screens/spaceman-moon/spaceman-moon.module.css",
    ],
    prompt: SPACEMAN_MOON_PROMPT,
    note: `Hero video, poster, and the Manrope subset are served from Frameline,
so this renders as-is. To self-host, download them and swap the URLs back to
local paths under public/.`,
  },
  "dark-pill-hero": {
    files: [
      "src/screens/dark-pill-hero/dark-pill-hero.tsx",
      "src/screens/dark-pill-hero/dark-pill-hero-skeleton.tsx",
      "src/screens/dark-pill-hero/dark-pill-hero-skeleton.css",
      "src/screens/reticle-mark.tsx",
    ],
    prompt: DARK_PILL_HERO_PROMPT,
    note: `Hero wave art from Paper reference; magenta color blend overlay in-component. Alias: klyro-hero.`,
  },
  "ascii-hero": {
    files: [
      "src/screens/ascii-hero/ascii-hero.tsx",
      "src/screens/ascii-hero/ascii-hero-skeleton.tsx",
      "src/screens/ascii-hero/ascii-hero-skeleton.css",
      "src/screens/reticle-mark.tsx",
    ],
    prompt: `Build the ASCII Yield Hero — dark ASCII art field, magenta color blend, @ deterioration cursor, GSAP headline reveal, fab marquee.`,
    note: "Alias: axion-hero, reticle-ascii-hero.",
  },
  softwave: {
    files: [
      "src/screens/softwave/softwave.tsx",
      "src/screens/softwave/softwave.module.css",
      "src/screens/softwave/softwave-skeleton.tsx",
      "src/screens/softwave/softwave-skeleton.css",
    ],
    prompt: `Build the Softwave Hero — vintage desktop hero with bliss hill video, pixel headline, glass pill nav, and analog-warmth copy.`,
    note: "Hero video and poster are served from Frameline under /screens/softwave/.",
  },
  "softwave-features": {
    files: [
      "src/screens/softwave-features/softwave-feature-cards.tsx",
      "src/screens/softwave-features/softwave-feature-cards.module.css",
      "src/screens/softwave-features/softwave-feature-cards-skeleton.tsx",
      "src/screens/softwave-features/softwave-feature-cards-skeleton.css",
      "src/screens/softwave-features/constants.ts",
    ],
    prompt: `Build Softwave Feature Cards — four-up ML ops cards with hover captions, drifting art, and Geist Pixel titles.`,
    note: "Card art PNGs are served from Frameline under /screens/softwave-features/.",
  },
  "bridge-dither": {
    files: [
      "src/screens/bridge-dither/bridge-dither.tsx",
      "src/screens/bridge-dither/bridge-dither-skeleton.tsx",
      "src/screens/bridge-dither/bridge-dither-skeleton.css",
      "src/screens/bridge-dither/dither-field.tsx",
      "src/screens/bridge-dither/constants.ts",
      "src/screens/reticle-mark.tsx",
    ],
    prompt: `Build the Bridge Dither Hero — warm bridge dither art, interactive canvas, progressive blur edges, GSAP headline clip reveal.`,
    note: "Bridge art PNG is served from Frameline. Alias: oasis-hero.",
  },
  "mexin-hero": {
    files: [
      "src/screens/mexin-hero/mexin-hero.tsx",
      "src/screens/mexin-hero/mexin-hero-skeleton.tsx",
      "src/screens/mexin-hero/mexin-hero-skeleton.css",
      "src/screens/reticle-mark.tsx",
    ],
    prompt: `Build the Mexin Hero — floating pill nav, light canvas, magenta color-blend over abstract art, fab wordmarks.`,
    note: "Hero background PNG is served from Frameline under /screens/mexin-hero/.",
  },
  "miracle-login": {
    files: [
      "src/screens/miracle-login/reticle-login.tsx",
      "src/screens/miracle-login/reticle-login-skeleton.tsx",
      "src/screens/miracle-login/reticle-login-skeleton.css",
      "src/screens/reticle-mark.tsx",
    ],
    prompt: `Build the Miracle Login screen — split-panel sign-in with magenta-tinted cover art and GSAP panel entrance.`,
    note: "Cover art PNG is served from Frameline. Alias: reticle-login.",
  },
  "yield-skeleton": {
    files: [
      "src/screens/yield-skeleton/yield-skeleton.tsx",
      "src/screens/yield-skeleton/yield-skeleton.css",
    ],
    prompt: `Build the loading skeleton for "Built for Yield": same 1920×1080 stage, shimmer bones for logo/nav/headline/stats, and a sweeping orb placeholder. Dark canvas. Scoped CSS.`,
    note: "Pairs with Built for Yield.",
  },
  "features-skeleton": {
    files: [
      "src/screens/features-skeleton/features-skeleton.tsx",
      "src/screens/features-skeleton/features-skeleton.css",
    ],
    prompt: `Build the loading skeleton for "Catch Killer Defects": white 1920×1088 ruled grid, three card bones, shimmer. Scoped CSS.`,
    note: "Pairs with Catch Killer Defects.",
  },
  "insights-skeleton": {
    files: [
      "src/screens/insights-skeleton/insights-skeleton.tsx",
      "src/screens/insights-skeleton/insights-skeleton.css",
    ],
    prompt: `Build the loading skeleton for "Yield Insights": white 1920×1200 list bones, metric card bones, highlight bar. Scoped CSS.`,
    note: "Pairs with Yield Insights.",
  },
  "dark-pill-hero-skeleton": {
    files: [
      "src/screens/dark-pill-hero/dark-pill-hero-skeleton.tsx",
      "src/screens/dark-pill-hero/dark-pill-hero-skeleton.css",
    ],
    prompt: `Build the loading skeleton for "Dark Pill Nav Hero": same void canvas, shimmer bones for segmented nav, headline, CTAs, and fab logos. Scoped CSS.`,
    note: "Pairs with Dark Pill Nav Hero.",
  },
  "softwave-skeleton": {
    files: [
      "src/screens/softwave/softwave-skeleton.tsx",
      "src/screens/softwave/softwave-skeleton.css",
    ],
    prompt: `Build the loading skeleton for Softwave Hero: shimmer bones over bliss hill, nav pills, and pixel headline.`,
    note: "Pairs with Softwave Hero.",
  },
  "softwave-features-skeleton": {
    files: [
      "src/screens/softwave-features/softwave-feature-cards-skeleton.tsx",
      "src/screens/softwave-features/softwave-feature-cards-skeleton.css",
    ],
    prompt: `Build the loading skeleton for Softwave Feature Cards: four card bones with title and caption placeholders.`,
    note: "Pairs with Softwave Feature Cards.",
  },
  "bridge-dither-skeleton": {
    files: [
      "src/screens/bridge-dither/bridge-dither-skeleton.tsx",
      "src/screens/bridge-dither/bridge-dither-skeleton.css",
    ],
    prompt: `Build the loading skeleton for Bridge Dither: shimmer bones over dither field, nav, and headline.`,
    note: "Pairs with Bridge Dither.",
  },
  "mexin-hero-skeleton": {
    files: [
      "src/screens/mexin-hero/mexin-hero-skeleton.tsx",
      "src/screens/mexin-hero/mexin-hero-skeleton.css",
    ],
    prompt: `Build the loading skeleton for Mexin Hero: shimmer bones over nav, headline, CTAs, and fab logos.`,
    note: "Pairs with Mexin Hero.",
  },
  "miracle-login-skeleton": {
    files: [
      "src/screens/miracle-login/reticle-login-skeleton.tsx",
      "src/screens/miracle-login/reticle-login-skeleton.css",
    ],
    prompt: `Build the loading skeleton for Miracle Login: split panel bones over cover art and sign-in form.`,
    note: "Pairs with Miracle Login.",
  },
  "ascii-hero-skeleton": {
    files: [
      "src/screens/ascii-hero/ascii-hero-skeleton.tsx",
      "src/screens/ascii-hero/ascii-hero-skeleton.css",
    ],
    prompt: `Build the loading skeleton for "ASCII Yield Hero": dark shimmer bones over nav, headline, CTAs, and fab marquee. Scoped CSS.`,
    note: "Pairs with ASCII Yield Hero.",
  },
};

export type ScreenFileSpec = { files: string[]; prompt: string; note: string };

/** File list / prompt / install note for a screen, resolving catalog aliases. */
export function getScreenFileSpec(slug: string): ScreenFileSpec | null {
  const entry = getScreenBySlug(slug);
  return FILES[entry?.slug ?? slug] ?? FILES[slug] ?? null;
}

export function getScreenPrompt(slug: string, copyId?: string | null): string | null {
  const entry = getScreenBySlug(slug);
  const prompt = FILES[entry?.slug ?? slug]?.prompt ?? FILES[slug]?.prompt;
  if (!prompt) return null;

  const canonical = entry?.slug ?? slug;
  // Agents resolve URLs they are given, so the manifest link doubles as the
  // signal that this prompt was pasted into one.
  return [
    prompt,
    "",
    `Manifest (file list, assets, install notes): ${registryUrl(canonical, copyId)}`,
  ].join("\n");
}

export async function buildScreenCodePayload(
  slug: string,
  copyId?: string | null,
): Promise<string | null> {
  const entry = getScreenBySlug(slug);
  const spec = FILES[entry?.slug ?? slug] ?? FILES[slug];
  if (!spec || !entry) return null;

  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const root = process.cwd();
  const chunks: string[] = [
    `// ${entry.title} — Frameline`,
    `// Manifest: ${registryUrl(entry.slug, copyId)}`,
    "",
    spec.note,
    "",
  ];

  for (const rel of spec.files) {
    const source = await readFile(path.join(root, rel), "utf8");
    // Media points at Frameline so this renders as-is on paste.
    chunks.push(
      `// ——— ${rel} ———`,
      rewriteAssetReferences(source, copyId).trimEnd(),
      "",
    );
  }

  return chunks.join("\n");
}
