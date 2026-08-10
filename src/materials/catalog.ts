import type { MaterialCatalogEntry, MaterialType } from "./types";

export const MATERIALS_CATALOG: MaterialCatalogEntry[] = [
  {
    slug: "aurora-mesh",
    title: "Aurora Mesh",
    description:
      "Soft multi-color mesh for heroes and marketing shells. Token-friendly color array.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "free",
    tags: ["mesh", "gradient", "hero", "motion"],
    fallbackColors: ["#E3FFFE", "#C5F0FF", "#FF008D", "#B700FF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Lightweight MeshGradient — fine for one full-bleed hero; pause off-screen.",
  },
  {
    slug: "ink-dither",
    title: "Ink Dither",
    description:
      "High-contrast two-tone dither for sections, empty states, and brand moments.",
    type: "dither",
    useContexts: ["section", "empty", "loading"],
    tier: "personal",
    tags: ["dither", "ink", "contrast", "motion"],
    fallbackColors: ["#FFFFFF", "#2D6BFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Two-tone dither is cheap; keep size moderate on retina to avoid alias noise.",
  },
  {
    slug: "grain-field",
    title: "Grain Field",
    description:
      "Quiet grain gradient for cards, auth shells, and understated backgrounds.",
    type: "grain",
    useContexts: ["card", "auth", "section"],
    tier: "personal",
    tags: ["grain", "noise", "soft", "motion"],
    fallbackColors: ["#F4F1EA", "#D4C4A8", "#2D6BFF", "#0A0A0A"],
    renderingTechnique: "webgl",
    perfNotes:
      "Soft grain loop — good for cards; prefer forceStatic in long lists.",
  },
  {
    slug: "neuro-veil",
    title: "Neuro Veil",
    description:
      "Glowing neural grain for cards, sections, and loading shells.",
    type: "grain",
    useContexts: ["card", "section", "loading"],
    tier: "free",
    tags: ["grain", "neuro", "noise", "motion"],
    fallbackColors: ["#0A0A0A", "#2D6BFF", "#E8F0FF"],
    renderingTechnique: "webgl",
    perfNotes:
      "NeuroNoise is mid-weight; one instance is fine, avoid stacking many.",
  },
  {
    slug: "tide-wave",
    title: "Tide Wave",
    description:
      "Horizontal swell lines that read as tide, not generic wave noise — for heroes and sectional bands.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "personal",
    tags: ["mesh", "waves", "hero", "pattern"],
    fallbackColors: ["#0B1C2D", "#2D6BFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Waves fragment is light; safe for sectional bands at modest scale.",
  },
  {
    slug: "cell-voronoi",
    title: "Cell Voronoi",
    description:
      "Animated cell mesh for heroes, empty states, and sectional fields.",
    type: "mesh",
    useContexts: ["hero", "empty", "section"],
    tier: "personal",
    tags: ["mesh", "voronoi", "cells", "motion"],
    fallbackColors: ["#F4F1EA", "#C8BBA8", "#2D6BFF", "#0A0A0A"],
    renderingTechnique: "webgl",
    perfNotes:
      "Voronoi costs rise with cell density — keep scale ≥0.4 on mobile.",
  },
  {
    slug: "ink-swirl",
    title: "Ink Swirl",
    description:
      "Twisting ink bands for heroes, sections, and brand moments.",
    type: "dither",
    useContexts: ["hero", "section"],
    tier: "personal",
    tags: ["dither", "swirl", "ink", "motion"],
    fallbackColors: ["#0A0A0A", "#2D6BFF", "#5B8CFF", "#1A3A8F"],
    renderingTechnique: "webgl",
    perfNotes:
      "Swirl is mid-cost; lower bandCount if you mount more than one.",
  },
  {
    slug: "signal-dots",
    title: "Signal Dots",
    description:
      "Sparse telemetry grid — dots that feel like a live feed, not wallpaper, for loading and empty shells.",
    type: "dither",
    useContexts: ["loading", "empty", "card"],
    tier: "free",
    tags: ["dither", "dots", "grid", "signal"],
    fallbackColors: ["#F7F5F0", "#2D6BFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "DotGrid is inexpensive; fine for loading shells and small cards.",
  },
  {
    slug: "ember-warp",
    title: "Ember Warp",
    description:
      "Warped ember mesh for heroes and sectional heat fields.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "team",
    tags: ["mesh", "warp", "ember", "motion"],
    fallbackColors: ["#0A0A0A", "#C45C26", "#1A1210", "#E8A05C"],
    renderingTechnique: "webgl",
    perfNotes:
      "Warp mesh is mid-heavy — one hero instance; static fallback for grids.",
  },
  {
    slug: "halo-rays",
    title: "Halo Rays",
    description:
      "Bloomed radial spokes from a single light well — cinematic rim light for heroes, not a lens-flare sticker.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "personal",
    tags: ["mesh", "rays", "halo", "motion"],
    fallbackColors: ["#0A0A0A", "#2D6BFF", "#5B8CFF", "#E8F0FF"],
    renderingTechnique: "webgl",
    perfNotes:
      "GodRays bloom adds fill-rate cost; dial bloom down on low-end GPUs.",
  },
  {
    slug: "ink-metaballs",
    title: "Ink Metaballs",
    description:
      "Merging ink masses with soft meniscus edges — organic weight for empty and loading states.",
    type: "mesh",
    useContexts: ["hero", "empty", "loading"],
    tier: "personal",
    tags: ["mesh", "metaballs", "ink", "motion"],
    fallbackColors: ["#F4F1EA", "#2D6BFF", "#C8BBA8", "#0A0A0A"],
    renderingTechnique: "webgl",
    perfNotes:
      "Cost scales with blob count — keep count ≤12 on mobile heroes.",
  },
  {
    slug: "smoke-ring",
    title: "Smoke Ring",
    description:
      "Soft smoke ring grain for sections, auth shells, and cards.",
    type: "grain",
    useContexts: ["section", "auth", "card"],
    tier: "personal",
    tags: ["grain", "smoke", "ring", "motion"],
    fallbackColors: ["#0A0A0A", "#E8E4DC", "#2D6BFF", "#C8BBA8"],
    renderingTechnique: "webgl",
    perfNotes:
      "Noise iterations dominate cost — ≤6 iterations keeps auth shells smooth.",
  },
  {
    slug: "simplex-field",
    title: "Simplex Field",
    description:
      "Animated simplex noise grain for cards, sections, and loading.",
    type: "grain",
    useContexts: ["card", "section", "loading"],
    tier: "free",
    tags: ["grain", "simplex", "noise", "motion"],
    fallbackColors: ["#F4F1EA", "#2D6BFF", "#C8BBA8", "#0A0A0A"],
    renderingTechnique: "webgl",
    perfNotes:
      "SimplexNoise is light-to-mid; forceStatic in catalog grids.",
  },
  {
    slug: "halftone-signal",
    title: "Halftone Signal",
    description:
      "Print-press dot fields that pulse like a broadcast — sectional texture with ink-on-paper grit.",
    type: "dither",
    useContexts: ["section", "empty"],
    tier: "personal",
    tags: ["dither", "halftone", "dots", "signal"],
    fallbackColors: ["#F4F1EA", "#2D6BFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Halftone + grain overlay is mid-cost; one sectional instance is fine.",
  },
  {
    slug: "liquid-chrome",
    title: "Liquid Chrome",
    description:
      "Liquid metal mesh for heroes and sectional chrome fields.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "team",
    tags: ["mesh", "metal", "chrome", "motion"],
    fallbackColors: ["#1A1A1C", "#2D6BFF", "#C8C8CA"],
    renderingTechnique: "webgl",
    perfNotes:
      "LiquidMetal is heavier — prefer a single hero; pause when scrolled away.",
  },
  {
    slug: "panel-glass",
    title: "Panel Glass",
    description:
      "Translucent rotating color panels for heroes and sectional glass fields.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "personal",
    tags: ["mesh", "panels", "glass", "motion"],
    fallbackColors: ["#00CFFF", "#FF2D55", "#34C759", "#AF52DE"],
    renderingTechnique: "webgl",
    perfNotes:
      "ColorPanels with edges/blur is mid-heavy — one full-bleed surface at a time.",
  },
  {
    slug: "orbit-dots",
    title: "Orbit Dots",
    description:
      "Orbiting dot field for loading shells, empty states, and quiet cards.",
    type: "dither",
    useContexts: ["loading", "empty", "card"],
    tier: "free",
    tags: ["dither", "dots", "orbit", "signal"],
    fallbackColors: ["#F7F5F0", "#2D6BFF", "#5B8CFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "DotOrbit uses a noise texture — light for cards; static in dense grids.",
  },
  {
    slug: "spiral-ink",
    title: "Spiral Ink",
    description:
      "Ink spiral dither for heroes and high-contrast sectional bands.",
    type: "dither",
    useContexts: ["hero", "section"],
    tier: "personal",
    tags: ["dither", "spiral", "ink", "motion"],
    fallbackColors: ["#0A0A0A", "#2D6BFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Spiral is mid-light; noise Frequency bumps cost — keep noise low on mobile.",
  },
  {
    slug: "perlin-moss",
    title: "Perlin Moss",
    description:
      "Organic Perlin grain for cards, sections, and auth shells.",
    type: "grain",
    useContexts: ["card", "section", "auth"],
    tier: "free",
    tags: ["grain", "perlin", "moss", "noise"],
    fallbackColors: ["#1A2E1A", "#7CB87C", "#C8BBA8"],
    renderingTechnique: "webgl",
    perfNotes:
      "Octave count drives cost — ≤4 octaves keeps auth/cards smooth.",
  },
  {
    slug: "pulse-frame",
    title: "Pulse Frame",
    description:
      "Glowing pulsing border contour for heroes and framed card surfaces.",
    type: "mesh",
    useContexts: ["hero", "card"],
    tier: "team",
    tags: ["mesh", "border", "pulse", "glow"],
    fallbackColors: ["#0A0A0A", "#2D6BFF", "#5B8CFF", "#AF52DE"],
    renderingTechnique: "webgl",
    perfNotes:
      "PulsingBorder + smoke uses noise texture — heavier; one hero or card max.",
  },
  {
    slug: "water-sheet",
    title: "Water Sheet",
    description:
      "Caustic water mesh for heroes and sectional bands — works as a standalone texture.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "personal",
    tags: ["mesh", "water", "caustic", "motion"],
    fallbackColors: ["#1A4A6B", "#E8F4FF", "#2D6BFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Water caustics are mid-weight — one full-bleed hero; pause when off-screen.",
  },
  {
    slug: "still-mesh",
    title: "Still Mesh",
    description:
      "Static multi-point mesh for heroes and empty states. Warm heat-adjacent palette.",
    type: "mesh",
    useContexts: ["hero", "empty"],
    tier: "personal",
    tags: ["mesh", "static", "gradient", "heat"],
    fallbackColors: ["#FF6B35", "#1A1210", "#2D6BFF", "#F4E8D8"],
    renderingTechnique: "webgl",
    perfNotes:
      "StaticMeshGradient has no animation loop — cheap for grids and empty shells.",
  },
  {
    slug: "paper-tooth",
    title: "Paper Tooth",
    description:
      "Fiber and fold paper grain for cards, auth shells, and quiet sections.",
    type: "grain",
    useContexts: ["card", "auth", "section"],
    tier: "free",
    tags: ["grain", "paper", "texture", "fiber"],
    fallbackColors: ["#F7F5F0", "#C8BBA8"],
    renderingTechnique: "webgl",
    perfNotes:
      "PaperTexture is static noise — light; fine for cards and auth backgrounds.",
  },
  {
    slug: "gem-haze",
    title: "Gem Haze",
    description:
      "Glassy smoke field for heroes and framed cards. Stand-in for image-bound fluted glass.",
    type: "mesh",
    useContexts: ["hero", "card"],
    tier: "team",
    tags: ["mesh", "smoke", "gem", "glass"],
    fallbackColors: ["#0A0A0A", "#2D6BFF", "#AF52DE", "#E8F0FF"],
    renderingTechnique: "webgl",
    perfNotes:
      "GemSmoke with shape is mid-heavy — one hero or card; prefer static in grids.",
  },
  {
    slug: "cmyk-halftone",
    title: "CMYK Halftone",
    description:
      "Print-style CMYK halftone dither for sections and empty states.",
    type: "dither",
    useContexts: ["section", "empty"],
    tier: "personal",
    tags: ["dither", "halftone", "cmyk", "print"],
    fallbackColors: ["#FBFAF5", "#00B4FF", "#FC519F", "#FFD800"],
    renderingTechnique: "webgl",
    perfNotes:
      "CMYK flood dots are mid-light; one sectional instance is fine.",
  },
  {
    slug: "radial-still",
    title: "Radial Still",
    description:
      "Still radial bloom from center — quiet focal gravity for auth shells without a motion loop.",
    type: "mesh",
    useContexts: ["hero", "section", "auth"],
    tier: "free",
    tags: ["mesh", "static", "radial", "gradient"],
    fallbackColors: ["#0A0A0A", "#2D6BFF", "#5B8CFF", "#E8F0FF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Static radial — no animation cost; safe for auth and marketing shells.",
  },
  {
    slug: "mesh-still",
    title: "Mesh Still",
    description:
      "Quiet static mesh gradient for heroes and sectional bands — sea palette.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "free",
    tags: ["mesh", "static", "gradient", "sea"],
    fallbackColors: ["#013B65", "#03738C", "#A3D3FF", "#F2FAEF"],
    renderingTechnique: "webgl",
    perfNotes:
      "StaticMeshGradient — free for full-bleed heroes; no GPU loop cost.",
  },
  {
    slug: "aurora-dusk",
    title: "Aurora Dusk",
    description:
      "Warm dusk mesh — amber, charcoal, and deep blue for hero shells.",
    type: "mesh",
    useContexts: ["hero"],
    tier: "personal",
    tags: ["mesh", "gradient", "dusk", "hero"],
    fallbackColors: ["#1A1210", "#C45C26", "#E8A05C", "#2D4A6B"],
    renderingTechnique: "webgl",
    perfNotes:
      "Same cost as Aurora Mesh — one full-bleed hero; pause off-screen.",
  },
  {
    slug: "ink-dither-soft",
    title: "Ink Dither Soft",
    description:
      "Softer low-contrast dither for cards and quiet empty states.",
    type: "dither",
    useContexts: ["card", "empty"],
    tier: "free",
    tags: ["dither", "ink", "soft", "quiet"],
    fallbackColors: ["#E8E4DC", "#6B7A99"],
    renderingTechnique: "webgl",
    perfNotes:
      "Two-tone dither is cheap; larger size softens alias on retina.",
  },
  {
    slug: "grain-night",
    title: "Grain Night",
    description:
      "Dark night grain for auth shells and understated card surfaces.",
    type: "grain",
    useContexts: ["auth", "card"],
    tier: "personal",
    tags: ["grain", "night", "dark", "auth"],
    fallbackColors: ["#0A0A0A", "#1A1A2E", "#2D4A6B", "#0D1520"],
    renderingTechnique: "webgl",
    perfNotes:
      "Soft grain loop — good for auth; forceStatic in long card lists.",
  },
  {
    slug: "wave-ribbon",
    title: "Wave Ribbon",
    description:
      "Compressed ribbon bands sized for thin sectional strips — tide energy without a full-bleed swell.",
    type: "mesh",
    useContexts: ["section"],
    tier: "personal",
    tags: ["mesh", "waves", "ribbon", "pattern"],
    fallbackColors: ["#0A1628", "#5B8CFF"],
    renderingTechnique: "webgl",
    perfNotes:
      "Waves fragment is light — safe for sectional ribbons at modest scale.",
  },
  {
    slug: "voronoi-soft",
    title: "Voronoi Soft",
    description:
      "Soft pastel cell field for loading shells and empty states.",
    type: "mesh",
    useContexts: ["loading", "empty"],
    tier: "personal",
    tags: ["mesh", "voronoi", "pastel", "soft"],
    fallbackColors: ["#F5E6F0", "#D4E8F0", "#E8F0D4", "#F7F5F0"],
    renderingTechnique: "webgl",
    perfNotes:
      "Lower density than Cell Voronoi — fine for loading and empty shells.",
  },
  {
    slug: "sera-wash",
    title: "Sera Wash",
    description:
      "Soft multi-stop CSS gradient wash for heroes and sectional bands.",
    type: "mesh",
    useContexts: ["hero", "section"],
    tier: "free",
    tags: ["css", "gradient", "wash", "hero"],
    fallbackColors: ["#F7F5F0", "#E8F0FF", "#D4C4A8", "#C5F0FF", "#F4F1EA"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
  {
    slug: "stone-band",
    title: "Stone Band",
    description:
      "Horizontal banded CSS gradient for sectional strips and quiet cards.",
    type: "grain",
    useContexts: ["section", "card"],
    tier: "free",
    tags: ["css", "bands", "stone", "section"],
    fallbackColors: ["#E8E4DC", "#C8BBA8", "#A89880", "#D4C4A8", "#F4F1EA"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
  {
    slug: "blue-signal",
    title: "Blue Signal",
    description:
      "Diagonal brand-blue CSS wash for heroes and empty states.",
    type: "mesh",
    useContexts: ["hero", "empty"],
    tier: "free",
    tags: ["css", "gradient", "blue", "brand"],
    fallbackColors: ["#E8F0FF", "#5B8CFF", "#2D6BFF"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
  {
    slug: "dusk-veil",
    title: "Dusk Veil",
    description:
      "Dark translucent CSS overlay for auth shells and framed cards.",
    type: "grain",
    useContexts: ["auth", "card"],
    tier: "personal",
    tags: ["css", "veil", "dark", "auth"],
    fallbackColors: ["#0A0A0A", "#1A1210", "#2D4A6B", "#0A0A0ACC"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
  {
    slug: "grid-ghost",
    title: "Grid Ghost",
    description:
      "Hairline CSS lattice that suggests structure without stealing focus — loading and empty scaffolds.",
    type: "dither",
    useContexts: ["loading", "empty"],
    tier: "free",
    tags: ["css", "grid", "loading", "signal"],
    fallbackColors: ["#F7F5F0", "#2D6BFF33"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
  {
    slug: "stripe-quiet",
    title: "Stripe Quiet",
    description:
      "Subtle CSS stripes for cards and understated sectional bands.",
    type: "dither",
    useContexts: ["card", "section"],
    tier: "personal",
    tags: ["css", "stripes", "quiet", "card"],
    fallbackColors: ["#F4F1EA", "#E8E4DC"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
  {
    slug: "glow-rim",
    title: "Glow Rim",
    description:
      "Radial vignette / rim-light CSS for heroes and framed cards.",
    type: "mesh",
    useContexts: ["hero", "card"],
    tier: "personal",
    tags: ["css", "vignette", "rim", "glow"],
    fallbackColors: ["#0A0A0A", "#2D6BFF"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
  {
    slug: "fog-layer",
    title: "Fog Layer",
    description:
      "Layered soft CSS gradients for foggy sections and auth shells.",
    type: "grain",
    useContexts: ["section", "auth"],
    tier: "personal",
    tags: ["css", "fog", "layers", "soft"],
    fallbackColors: ["#E8E4DC", "#C8BBA8", "#F7F5F0", "#D4C4A8"],
    renderingTechnique: "css",
    perfNotes: "CSS-only · negligible GPU",
  },
];

export const MATERIAL_TYPES: {
  type: MaterialType;
  title: string;
  description: string;
}[] = [
  {
    type: "mesh",
    title: "Mesh",
    description: "Soft multi-color fields for heroes and marketing shells.",
  },
  {
    type: "dither",
    title: "Dither",
    description: "High-contrast ink surfaces for empty states and brand moments.",
  },
  {
    type: "grain",
    title: "Grain",
    description: "Quiet textured fields for cards, auth, and understated panels.",
  },
];

/** Draft metadata override applied at read time (admin demo publish). */
export type CatalogMaterialOverride = {
  title?: string;
  description?: string;
  status?: "draft" | "published";
  tier?: MaterialCatalogEntry["tier"];
};

export function applyCatalogOverride(
  entry: MaterialCatalogEntry,
  override?: CatalogMaterialOverride | null,
): MaterialCatalogEntry {
  if (!override) return entry;
  return {
    ...entry,
    ...(override.title !== undefined ? { title: override.title } : {}),
    ...(override.description !== undefined
      ? { description: override.description }
      : {}),
    ...(override.tier !== undefined ? { tier: override.tier } : {}),
  };
}

export function getMaterial(
  slug: string,
  overrides?: Record<string, CatalogMaterialOverride> | null,
) {
  const base = MATERIALS_CATALOG.find((m) => m.slug === slug);
  if (!base) return undefined;
  return applyCatalogOverride(base, overrides?.[slug]);
}

export function getMaterialsByType(type: MaterialType) {
  return MATERIALS_CATALOG.filter((m) => m.type === type);
}

export function isMaterialType(value: string): value is MaterialType {
  return value === "mesh" || value === "dither" || value === "grain";
}
