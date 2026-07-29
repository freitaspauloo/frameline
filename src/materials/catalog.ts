import type { MaterialCatalogEntry } from "./types";

export const MATERIALS_CATALOG: MaterialCatalogEntry[] = [
  {
    slug: "aurora-mesh",
    title: "Aurora Mesh",
    description:
      "Soft multi-color mesh for heroes and marketing shells. Token-friendly color array.",
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
    useContexts: ["card", "auth", "section"],
    tier: "personal",
    tags: ["grain", "noise", "soft", "motion"],
    fallbackColors: ["#F4F1EA", "#D4C4A8", "#2D6BFF", "#0A0A0A"],
  },
];

export function getMaterial(slug: string) {
  return MATERIALS_CATALOG.find((m) => m.slug === slug);
}
