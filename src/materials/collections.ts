import { getMaterial } from "./catalog";
import type { MaterialCatalogEntry, MaterialCollection } from "./types";

export const MATERIALS_COLLECTIONS: MaterialCollection[] = [
  {
    slug: "hero-surfaces",
    title: "Hero surfaces",
    description:
      "Full-bleed materials for the first viewport — mesh and dither that hold brand and CTA.",
    featured: true,
    materialSlugs: ["aurora-mesh", "ink-dither"],
  },
  {
    slug: "quiet-fields",
    title: "Quiet fields",
    description:
      "Understated grain and soft mesh for cards, auth shells, and secondary bands.",
    featured: true,
    materialSlugs: ["grain-field", "aurora-mesh"],
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
