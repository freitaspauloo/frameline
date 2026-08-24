/**
 * Catalog / plans / collections integrity checks.
 * Run via: node --experimental-strip-types --import ./scripts/smoke-resolve.mjs scripts/smoke.mjs
 */

import { MATERIALS_CATALOG } from "../src/materials/catalog.ts";
import { MATERIALS_COLLECTIONS } from "../src/materials/collections.ts";
import {
  COMPONENT_NAMES,
  FALLBACK_COMPONENT_NAME,
  getMaterialComponentName,
  slugToComponentName,
} from "../src/materials/component-names.ts";
import { MATERIAL_PROPS } from "../src/materials/props.ts";
import { LICENSE_PLANS } from "../src/lib/license-plans.ts";
import {
  buildMaterialsHref,
  parseSmartQuery,
} from "../src/lib/catalog-query.ts";
import { SCREENS_CATALOG } from "../src/screens/catalog.ts";

const REQUIRED_CONTEXTS = [
  "hero",
  "section",
  "card",
  "empty",
  "loading",
  "auth",
];

const REQUIRED_PLAN_KEYS = [
  "free",
  "test",
  "static",
  "personal",
  "team",
  "screen",
  "screen_year",
  "screen_lifetime",
];

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

  const rendererKeys = new Set(Object.keys(COMPONENT_NAMES));
  assert(
    rendererKeys.size === slugs.size,
    `COMPONENT_NAMES keys (${rendererKeys.size}) !== catalog slugs (${slugs.size})`,
  );
  for (const slug of slugs) {
    assert(
      Object.hasOwn(COMPONENT_NAMES, slug),
      `Catalog slug missing from COMPONENT_NAMES (would fall back to ${FALLBACK_COMPONENT_NAME}): ${slug}`,
    );
    const name = getMaterialComponentName(slug);
    const expected = slugToComponentName(slug);
    assert(
      name === COMPONENT_NAMES[slug],
      `getMaterialComponentName(${slug}) returned ${name}, expected ${COMPONENT_NAMES[slug]}`,
    );
    assert(
      name === expected,
      `Wrong component name for ${slug}: got ${name}, expected ${expected}`,
    );
  }
  for (const key of rendererKeys) {
    assert(slugs.has(key), `Orphan COMPONENT_NAMES key (not in catalog): ${key}`);
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

  assert(SCREENS_CATALOG.length === 10, `Expected 10 screens, got ${SCREENS_CATALOG.length}`);
  const screenTitles = SCREENS_CATALOG.map((s) => s.title);
  for (const title of [
    "Built for Yield Hero",
    "Performance Feature Cards",
    "Yield Inspection Dashboard",
    "Magenta Landscape Hero",
    "AI Inspection Interface",
    "Protect Yield Features",
    "Pixel Cube Hero",
    "Space Explorer Hero",
    "Always-on Wafer Inspection",
    "Defect Assistant Hero",
  ]) {
    assert(screenTitles.includes(title), `Missing layout screen title: ${title}`);
  }

  const smart = parseSmartQuery("Aurora dither HERO");
  assert(smart.type === "dither", `parseSmartQuery type: ${smart.type}`);
  assert(smart.context === "hero", `parseSmartQuery context: ${smart.context}`);
  assert(smart.q === "aurora", `parseSmartQuery leftover: ${smart.q}`);
  assert(
    parseSmartQuery("spaceman moon").q === "spaceman moon",
    "parseSmartQuery should keep plain text",
  );
  assert(
    buildMaterialsHref({ type: "mesh", q: "aurora", sort: "name" }) ===
      "/materials?type=mesh&q=aurora",
    "buildMaterialsHref should omit default sort",
  );

  return {
    catalog: MATERIALS_CATALOG.length,
    free: freeCount,
    collections: MATERIALS_COLLECTIONS.length,
    renderers: rendererKeys.size,
    plans: planKeys,
  };
}
