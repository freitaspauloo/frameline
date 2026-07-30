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
