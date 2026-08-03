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
    fallbackColors: ["#0A0A0A", "#2D6BFF"],
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
      "Flowing wave mesh for heroes and sectional bands.",
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
      "Quiet dot grid for loading, empty states, and card surfaces.",
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
      "Radiating god rays for heroes and sectional light fields.",
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
      "Gooey ink blobs for heroes, empty states, and loading shells.",
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
      "Halftone dot dither for sections and empty states.",
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

export function getMaterial(slug: string) {
  return MATERIALS_CATALOG.find((m) => m.slug === slug);
}

export function getMaterialsByType(type: MaterialType) {
  return MATERIALS_CATALOG.filter((m) => m.type === type);
}

export function isMaterialType(value: string): value is MaterialType {
  return value === "mesh" || value === "dither" || value === "grain";
}
