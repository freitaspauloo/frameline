/**
 * Catalog / plans / collections integrity checks.
 * Run via: node --experimental-strip-types --import ./scripts/smoke-resolve.mjs scripts/smoke.mjs
 */

import { MATERIALS_CATALOG } from "../src/materials/catalog.ts";
import { MATERIALS_COLLECTIONS } from "../src/materials/collections.ts";
import { MATERIAL_PROPS } from "../src/materials/props.ts";
import { LICENSE_PLANS } from "../src/lib/license-plans.ts";

const REQUIRED_CONTEXTS = [
  "hero",
  "section",
  "card",
  "empty",
  "loading",
  "auth",
];

const REQUIRED_PLAN_KEYS = ["free", "static", "personal", "team"];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runCatalogSmoke() {
  assert(
    MATERIALS_CATALOG.length === 40,
    `Expected catalog length 40, got ${MATERIALS_CATALOG.length}`,
  );

  const slugs = new Set();
  for (const material of MATERIALS_CATALOG) {
    assert(Boolean(material.slug), "Material missing slug");
    assert(!slugs.has(material.slug), `Duplicate slug: ${material.slug}`);
    slugs.add(material.slug);

    assert(
      Array.isArray(MATERIAL_PROPS[material.slug]) &&
        MATERIAL_PROPS[material.slug].length > 0,
      `Missing props for slug: ${material.slug}`,
    );

    assert(
      Array.isArray(material.useContexts) && material.useContexts.length >= 1,
      `Material ${material.slug} needs ≥1 useContext`,
    );
  }

  for (const slug of Object.keys(MATERIAL_PROPS)) {
    assert(slugs.has(slug), `Orphan props entry (not in catalog): ${slug}`);
  }

  const contextsSeen = new Set(
    MATERIALS_CATALOG.flatMap((m) => m.useContexts ?? []),
  );
  for (const ctx of REQUIRED_CONTEXTS) {
    assert(contextsSeen.has(ctx), `Context never used in catalog: ${ctx}`);
  }

  const freeCount = MATERIALS_CATALOG.filter((m) => m.tier === "free").length;
  assert(freeCount >= 1, `Expected ≥1 free material, got ${freeCount}`);

  const planKeys = LICENSE_PLANS.map((p) => p.key);
  for (const key of REQUIRED_PLAN_KEYS) {
    assert(planKeys.includes(key), `License plans missing key: ${key}`);
  }

  assert(
    MATERIALS_COLLECTIONS.length >= 6,
    `Expected ≥6 collections, got ${MATERIALS_COLLECTIONS.length}`,
  );

  for (const collection of MATERIALS_COLLECTIONS) {
    const n = collection.materialSlugs?.length ?? 0;
    assert(
      n >= 3 && n <= 6,
      `Collection ${collection.slug} should have 3–6 slugs, got ${n}`,
    );
    for (const slug of collection.materialSlugs) {
      assert(
        slugs.has(slug),
        `Collection ${collection.slug} references unknown slug: ${slug}`,
      );
    }
  }

  return {
    catalog: MATERIALS_CATALOG.length,
    free: freeCount,
    collections: MATERIALS_COLLECTIONS.length,
    plans: planKeys,
  };
}
