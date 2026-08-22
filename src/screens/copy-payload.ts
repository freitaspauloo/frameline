import { getScreenBySlug } from "@/screens/catalog";
import { SPACEMAN_MOON_PROMPT } from "@/screens/spaceman-moon/copy";

const FILES: Record<string, { files: string[]; prompt: string; note: string }> = {
  "spaceman-moon": {
    files: [
      "src/screens/spaceman-moon/spaceman-moon.tsx",
      "src/screens/spaceman-moon/spaceman-moon.module.css",
    ],
    prompt: SPACEMAN_MOON_PROMPT,
    note: `Place hero media at:
  public/screens/spaceman-moon/hero.mp4
  public/screens/spaceman-moon/poster.png
and the font at:
  public/fonts/manrope-latin.woff2
`,
  },
  "built-for-yield": {
    files: [
      "src/screens/built-for-yield/built-for-yield.tsx",
      "src/screens/built-for-yield/hero-orb.tsx",
      "src/screens/built-for-yield/built-for-yield.css",
      "src/screens/stage.tsx",
      "src/screens/stage.module.css",
    ],
    prompt: `Build a full-viewport dark hero called "Built for Yield".

Layout
- 1920×1080 design stage that scales to the viewport.
- Giant composing orb (thinking-orbs engine, composing preset, 1600px canvas) behind the type.
- Glass header: radial wordmark, "Reticle", "Fab-native", nav links, Request Info CTA.
- Centered headline "Built for Yield", classification pill, short inspection lede.
- Footer: in-line / high-volume line plus 98% / 6.2x / 40M+ stats.

Motion: orb ticks continuously. Respect prefers-reduced-motion by leaving the last painted frame.

Keep Albert Sans. Do not Tailwind-rewrite the scoped CSS.`,
    note: "Requires the thinking-orbs package and ScreenStage.",
  },
  "catch-killer-defects": {
    files: [
      "src/screens/catch-killer-defects/catch-killer-defects.tsx",
      "src/screens/catch-killer-defects/catch-killer-defects.css",
    ],
    prompt: `Build a white 1920×1088 three-card features screen called "Catch Killer Defects".

- Hairline vertical/horizontal grid
- Three cards: Catch Killer Defects (fluted glass + dither), Built for Yield, Faster Than Review
- Stats 98%, 40M, 6.2x
- GSAP clip-path entrance (labels, visuals, copy, stats)
- Paper FlutedGlass on the first card

Media lives under public/screens/catch-killer-defects/. Keep the scoped CSS.`,
    note: `Place card media at public/screens/catch-killer-defects/ (card-1-dither.png, card-1-glass.webp, card-2.png, card-3.png).`,
  },
  "defect-capture": {
    files: [
      "src/screens/defect-capture/defect-capture.tsx",
      "src/screens/defect-capture/defect-capture.css",
    ],
    prompt: `Build a white 1920×1200 insights screen called "Yield Insights".

- Eyebrow: In-line Yield Inspection
- Headline: Yield insights backed by production models.
- Five selectable rows (Defect Capture, Production-Qualified Models, Ranked Review, Line-Level Assessment, Classification Preview)
- Sliding highlight bar, GSAP entrance, metric cards that focus with the active row
- Right visual uses public/screens/defect-capture/visual.png

Keep the scoped CSS and GSAP choreography.`,
    note: "Place visual.png at public/screens/defect-capture/visual.png.",
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
};

export function getScreenPrompt(slug: string): string | null {
  return FILES[slug]?.prompt ?? null;
}

export async function buildScreenCodePayload(slug: string): Promise<string | null> {
  const spec = FILES[slug];
  const entry = getScreenBySlug(slug);
  if (!spec || !entry) return null;

  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const root = process.cwd();
  const chunks: string[] = [spec.note, ""];

  for (const rel of spec.files) {
    const source = await readFile(path.join(root, rel), "utf8");
    chunks.push(`// ——— ${rel} ———`, source.trimEnd(), "");
  }

  return chunks.join("\n");
}
