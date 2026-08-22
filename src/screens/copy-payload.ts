import { registryUrl } from "@/lib/registry-urls";
import { getScreenBySlug } from "@/screens/catalog";
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
    prompt: `Build a full-viewport Orb layout — composing orb, glass header, stats footer.`,
    note: "Requires the thinking-orbs package and ScreenStage. Alias: built-for-yield.",
  },
  "feature-cards": {
    files: [
      "src/screens/catch-killer-defects/catch-killer-defects.tsx",
      "src/screens/catch-killer-defects/catch-killer-defects.css",
    ],
    prompt: `Build a Feature cards layout — three-up ruled grid, fluted glass, GSAP entrance.`,
    note: "Alias: catch-killer-defects.",
  },
  insights: {
    files: [
      "src/screens/defect-capture/defect-capture.tsx",
      "src/screens/defect-capture/defect-capture.css",
    ],
    prompt: `Build an Insights layout — ranked list, highlight bar, metric cards.`,
    note: "Alias: defect-capture.",
  },
  "magenta-landscape": {
    files: ["src/screens/layouts/magenta-landscape.tsx", "src/screens/stage.tsx"],
    prompt: `Build a Magenta landscape layout — cinematic grain field, horizon, type lockup.`,
    note: "Uses GrainGradient on ScreenStage.",
  },
  "browser-frame": {
    files: ["src/screens/layouts/browser-frame.tsx", "src/screens/stage.tsx"],
    prompt: `Build a Browser frame layout — mac chrome around a live dither surface.`,
    note: "Uses Dithering inside window chrome.",
  },
  "feature-rail": {
    files: ["src/screens/layouts/feature-rail.tsx", "src/screens/stage.tsx"],
    prompt: `Build a Feature rail layout — left rail of four beats, right live visual.`,
    note: "1920×1080 split plate.",
  },
  blueprint: {
    files: ["src/screens/layouts/blueprint.tsx", "src/screens/stage.tsx"],
    prompt: `Build a Blueprint layout — navy hairline grid, callouts, measured type.`,
    note: "Technical plate on ScreenStage.",
  },
  "light-rays": {
    files: ["src/screens/layouts/light-rays.tsx", "src/screens/stage.tsx"],
    prompt: `Build a Light rays layout — GodRays bloom field and a quiet type lockup.`,
    note: "Uses @paper-design/shaders-react GodRays.",
  },
  "prompt-bar": {
    files: ["src/screens/layouts/prompt-bar.tsx", "src/screens/stage.tsx"],
    prompt: `Build a Prompt bar layout — thread above, pinned compose bar below.`,
    note: "AI workspace chrome on ScreenStage.",
  },
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
    chunks.push(`// ——— ${rel} ———`, source.trimEnd(), "");
  }

  return chunks.join("\n");
}
