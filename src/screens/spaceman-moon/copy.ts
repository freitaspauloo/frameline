/**
 * Agent brief buyers paste into Cursor — enough to rebuild the hero without
 * reverse-engineering the CSS module.
 */
export const SPACEMAN_MOON_PROMPT = `Build a full-viewport cinematic hero called "Space Explorer Hero" (Reticle).

Layout & look
- Full-bleed looping background video of an astronaut on a magenta moon, with a still poster underneath.
- Magenta color-blend overlay (#d600bf, mix-blend-mode: color), soft pink glow blob, and bottom vignette.
- Glass pill nav (blur + translucent border): Reticle wordmark + Portfolio/Company/Careers + Request Info.
- Centered headline "Built for yield, beyond the line.", short lede about killer defects, two in-hero CTAs, "Trusted by" logo strip (TSMC, ASML, KLA, Applied).
- Four floating feature pins: Catch killer defects, Classify dies in-line, Rank for review, Protect yield at volume.
- Hover on pins pauses the video and lifts the pin; soft tick audio on hover (respect prefers-reduced-motion).

Motion
- Video playbackRate ≈ 0.55. Custom fade-in/fade-out loop (opacity transition ~1.5s) — not native loop.
- CSS entrance choreography with staggered delays; idle float on pins/logos.
- prefers-reduced-motion: freeze on poster, no entrance animations, no tick audio.

Files
- Component: src/screens/spaceman-moon/spaceman-moon.tsx ("use client")
- Styles: src/screens/spaceman-moon/spaceman-moon.module.css (scoped module — keep the ~700 lines; do not Tailwind-rewrite)
- Media: public/screens/spaceman-moon/hero.mp4 + poster.png
- Font: public/fonts/manrope-latin.woff2 (Manrope via @font-face)
`;

/** One-liner buyers need after pasting the component. */
export const SPACEMAN_MOON_MEDIA_NOTE = `Place hero media at:
  public/screens/spaceman-moon/hero.mp4
  public/screens/spaceman-moon/poster.png
and the font at:
  public/fonts/manrope-latin.woff2
`;

/**
 * Assemble the copyable source from the live files on disk (server-only).
 */
export async function buildSpacemanMoonCodePayload(): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const root = process.cwd();
  const tsx = await readFile(
    path.join(root, "src/screens/spaceman-moon/spaceman-moon.tsx"),
    "utf8",
  );
  const css = await readFile(
    path.join(root, "src/screens/spaceman-moon/spaceman-moon.module.css"),
    "utf8",
  );
  const index = `export { SpacemanMoon } from "./spaceman-moon";\nexport type { SpacemanMoonProps } from "./spaceman-moon";\n`;

  return [
    SPACEMAN_MOON_MEDIA_NOTE,
    "",
    "// ——— spaceman-moon.tsx ———",
    tsx.trimEnd(),
    "",
    "// ——— spaceman-moon.module.css ———",
    css.trimEnd(),
    "",
    "// ——— index.ts ———",
    index.trimEnd(),
    "",
  ].join("\n");
}
