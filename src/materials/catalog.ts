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
