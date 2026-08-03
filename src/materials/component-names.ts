/**
 * Slug → React component export name.
 * Keep in sync with `renderMaterial` cases in `renderers.tsx`.
 * Smoke asserts keys === MATERIALS_CATALOG slugs.
 */
export const COMPONENT_NAMES: Record<string, string> = {
  "aurora-mesh": "AuroraMesh",
  "ink-dither": "InkDither",
  "grain-field": "GrainField",
  "neuro-veil": "NeuroVeil",
  "tide-wave": "TideWave",
  "cell-voronoi": "CellVoronoi",
  "ink-swirl": "InkSwirl",
  "signal-dots": "SignalDots",
  "ember-warp": "EmberWarp",
  "halo-rays": "HaloRays",
  "ink-metaballs": "InkMetaballs",
  "smoke-ring": "SmokeRing",
  "simplex-field": "SimplexField",
  "halftone-signal": "HalftoneSignal",
  "liquid-chrome": "LiquidChrome",
  "panel-glass": "PanelGlass",
  "orbit-dots": "OrbitDots",
  "spiral-ink": "SpiralInk",
  "perlin-moss": "PerlinMoss",
  "pulse-frame": "PulseFrame",
  "water-sheet": "WaterSheet",
  "still-mesh": "StillMesh",
  "paper-tooth": "PaperTooth",
  "gem-haze": "GemHaze",
  "cmyk-halftone": "CmykHalftone",
  "radial-still": "RadialStill",
  "mesh-still": "MeshStill",
  "aurora-dusk": "AuroraDusk",
  "ink-dither-soft": "InkDitherSoft",
  "grain-night": "GrainNight",
  "wave-ribbon": "WaveRibbon",
  "voronoi-soft": "VoronoiSoft",
  "sera-wash": "SeraWash",
  "stone-band": "StoneBand",
  "blue-signal": "BlueSignal",
  "dusk-veil": "DuskVeil",
  "grid-ghost": "GridGhost",
  "stripe-quiet": "StripeQuiet",
  "glow-rim": "GlowRim",
  "fog-layer": "FogLayer",
};

/** Fallback name used when a slug has no registry entry (must not appear for catalog slugs). */
export const FALLBACK_COMPONENT_NAME = "GrainField";

export function getMaterialComponentName(slug: string): string {
  return COMPONENT_NAMES[slug] ?? FALLBACK_COMPONENT_NAME;
}

/** Expected PascalCase export from a kebab slug (e.g. aurora-mesh → AuroraMesh). */
export function slugToComponentName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
