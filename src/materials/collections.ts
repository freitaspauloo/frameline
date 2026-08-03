import { getMaterial } from "./catalog";
import type { MaterialCatalogEntry, MaterialCollection } from "./types";

export const MATERIALS_COLLECTIONS: MaterialCollection[] = [
  {
    slug: "hero-surfaces",
    title: "Hero surfaces",
    description:
      "Full-bleed materials for the first viewport — mesh and dither that hold brand and CTA.",
    featured: true,
    materialSlugs: [
      "aurora-mesh",
      "tide-wave",
      "ember-warp",
      "liquid-chrome",
      "sera-wash",
      "blue-signal",
    ],
  },
  {
    slug: "quiet-fields",
    title: "Quiet fields",
    description:
      "Understated grain and soft mesh for cards, auth shells, and secondary bands.",
    featured: true,
    materialSlugs: [
      "grain-field",
      "neuro-veil",
      "smoke-ring",
      "paper-tooth",
      "stone-band",
      "stripe-quiet",
    ],
  },
  {
    slug: "signal-systems",
    title: "Signal systems",
    description:
      "Free-tier materials for loading shells, cards, and signal-led surfaces.",
    featured: true,
    materialSlugs: [
      "signal-dots",
      "simplex-field",
      "radial-still",
      "mesh-still",
      "ink-dither-soft",
      "grid-ghost",
    ],
  },
  {
    slug: "still-gradients",
    title: "Still gradients",
    description:
      "Static mesh and radial fields — no animation loop, full atmosphere.",
    featured: true,
    materialSlugs: [
      "still-mesh",
      "mesh-still",
      "radial-still",
      "paper-tooth",
    ],
  },
  {
    slug: "nocturnal",
    title: "Nocturnal",
    description:
      "Dark and dusk materials for night auth shells, heroes, and quiet cards.",
    featured: true,
    materialSlugs: [
      "grain-night",
      "aurora-dusk",
      "water-sheet",
      "gem-haze",
      "dusk-veil",
      "glow-rim",
    ],
  },
  {
    slug: "css-essentials",
    title: "CSS essentials",
    description:
      "CSS-only surfaces with negligible GPU cost — washes, bands, grids, and soft layers.",
    featured: true,
    materialSlugs: [
      "sera-wash",
      "stone-band",
      "blue-signal",
      "grid-ghost",
      "dusk-veil",
      "fog-layer",
    ],
  },
];

export function getCollection(slug: string) {
  return MATERIALS_COLLECTIONS.find((c) => c.slug === slug);
}

export function getCollectionMaterials(
  collection: MaterialCollection,
): MaterialCatalogEntry[] {
  return collection.materialSlugs
    .map((slug) => getMaterial(slug))
    .filter((m): m is MaterialCatalogEntry => Boolean(m));
}

export function getFeaturedCollections() {
  return MATERIALS_COLLECTIONS.filter((c) => c.featured);
}
