import { registryUrl, rewriteAssetReferences } from "@/lib/registry-urls";
import { getScreenBySlug } from "@/screens/catalog";

const FILES: Record<string, { files: string[]; prompt: string; note: string }> = {
  passo: {
    files: [
      "src/screens/running-app/running-app.tsx",
      "src/screens/running-app/running-app-skeleton.tsx",
      "src/screens/running-app/running-app-skeleton.css",
      "src/screens/stage.tsx",
      "src/screens/stage.module.css",
    ],
    prompt: `Build Passo — running app homepage with Paris night hero slideshow, lime accents, MWG-style flip nav, two-column lockup.`,
    note: "Hero JPGs under /screens/running-app/. Alias: running-app. Skeleton source included; dev-only at /dev/passo/skeleton.",
  },
  "health-ai": {
    files: [
      "src/screens/health-ai/health-ai.tsx",
      "src/screens/health-ai/health-ai-skeleton.tsx",
      "src/screens/health-ai/health-ai-skeleton.css",
      "src/screens/stage.tsx",
      "src/screens/stage.module.css",
    ],
    prompt: `Build the Pulse health AI landing — light sky-blue canvas, hero loop video with Paper FlutedGlass overlay, GSAP fullscreen-to-card morph, floating pill nav, headline clip reveal.`,
    note: "Hero video and poster under /screens/health-ai/. Alias: pulse. Plate 1920×1080.",
  },
  "forgeai-pink": {
    files: [
      "src/screens/fifty-x-hero/fifty-x-hero.tsx",
      "src/screens/fifty-x-hero/fifty-x-hero.css",
      "src/screens/fifty-x-hero/fifty-x-hero-skeleton.tsx",
      "src/screens/fifty-x-hero/fifty-x-hero-skeleton.css",
      "src/screens/fifty-x-hero/accents.ts",
      "src/screens/fifty-x-hero/index.ts",
    ],
    prompt: `Build the FORGE.AI landing hero (pink variant) — same layout as forgeai with pink color-blend overlay and magenta accents on CTAs, form glow, and dropdown selection.`,
    note: "Shares hero art from /screens/forgeai/. Plate 1440×1080.",
  },
  forgeai: {
    files: [
      "src/screens/fifty-x-hero/fifty-x-hero.tsx",
      "src/screens/fifty-x-hero/fifty-x-hero.css",
      "src/screens/fifty-x-hero/fifty-x-hero-skeleton.tsx",
      "src/screens/fifty-x-hero/fifty-x-hero-skeleton.css",
      "src/screens/fifty-x-hero/accents.ts",
      "src/screens/fifty-x-hero/index.ts",
    ],
    prompt: `Build the FORGE.AI landing hero — blue gradient field, typewriter prompt, model/platform/attach dropdowns, template rail, GSAP entrance.`,
    note: "Hero art and icons under /screens/forgeai/. Alias: fifty-x-hero. Plate 1440×1080.",
  },
  "forgeai-lime": {
    files: [
      "src/screens/fifty-x-hero/fifty-x-hero.tsx",
      "src/screens/fifty-x-hero/fifty-x-hero.css",
      "src/screens/fifty-x-hero/fifty-x-hero-skeleton.tsx",
      "src/screens/fifty-x-hero/fifty-x-hero-skeleton.css",
      "src/screens/fifty-x-hero/accents.ts",
      "src/screens/fifty-x-hero/index.ts",
    ],
    prompt: `Build the FORGE.AI landing hero (lime variant) — same layout as forgeai with lime color-blend overlay and green accents on CTAs, form glow, and dropdown selection.`,
    note: "Shares hero art from /screens/forgeai/. Plate 1440×1080.",
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
    chunks.push(
      `// ——— ${rel} ———`,
      rewriteAssetReferences(source, copyId).trimEnd(),
      "",
    );
  }

  return chunks.join("\n");
}
