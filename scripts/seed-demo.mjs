#!/usr/bin/env node
/**
 * Seed demo store data under `.data/` so admin / account aren't empty.
 *
 * Idempotent: re-running keeps existing seeded rows (matched by stable ids /
 * emails) and only fills missing pieces.
 *
 * Usage:
 *   pnpm demo:seed
 *   node scripts/seed-demo.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, ".data");

const ORDERS_PATH = path.join(DATA_DIR, "orders.json");
const ENTITLEMENTS_PATH = path.join(DATA_DIR, "entitlements.json");
const WAITLIST_PATH = path.join(DATA_DIR, "waitlist.json");
const OVERRIDES_PATH = path.join(DATA_DIR, "catalog-overrides.json");

const SEED_MARKER = "seed_demo";

/** Stable demo fixtures — ids must stay fixed for idempotency. */
const SEED_ORDERS = [
  {
    id: "ord_seed_personal_01",
    email: "buyer@studio.dev",
    userId: null,
    paymentProviderRef: `${SEED_MARKER}_personal`,
    status: "paid",
    planKey: "personal",
    licenseVersion: "2026.1",
    subtotal: 4900,
    tax: 0,
    total: 4900,
    createdAt: "2026-03-01T12:00:00.000Z",
    materialSlug: null,
    registryToken: "fl_demo_seed_personal_tok01",
    entitlementId: "ent_seed_personal_01",
  },
  {
    id: "ord_seed_static_01",
    email: "static@studio.dev",
    userId: null,
    paymentProviderRef: `${SEED_MARKER}_static`,
    status: "paid",
    planKey: "static",
    licenseVersion: "2026.1",
    subtotal: 1900,
    tax: 0,
    total: 1900,
    createdAt: "2026-03-05T15:30:00.000Z",
    materialSlug: "aurora-mesh",
    registryToken: "fl_demo_seed_static_tok01",
    entitlementId: "ent_seed_static_01",
  },
];

const SEED_ENTITLEMENTS = [
  {
    id: "ent_seed_personal_01",
    orderId: "ord_seed_personal_01",
    userEmail: "buyer@studio.dev",
    planKey: "personal",
    licenseVersion: "2026.1",
    materialScope: { kind: "all" },
    status: "active",
    grantedAt: "2026-03-01T12:00:00.000Z",
    revokedAt: null,
  },
  {
    id: "ent_seed_static_01",
    orderId: "ord_seed_static_01",
    userEmail: "static@studio.dev",
    planKey: "static",
    licenseVersion: "2026.1",
    materialScope: { kind: "set", materialSlugs: ["aurora-mesh"] },
    status: "active",
    grantedAt: "2026-03-05T15:30:00.000Z",
    revokedAt: null,
  },
];

const SEED_TOKENS = [
  {
    id: "tok_seed_personal_01",
    userEmail: "buyer@studio.dev",
    tokenHash: "fl_demo_seed_personal_tok01",
    entitlementId: "ent_seed_personal_01",
    createdAt: "2026-03-01T12:00:00.000Z",
    lastUsedAt: null,
    revokedAt: null,
  },
  {
    id: "tok_seed_static_01",
    userEmail: "static@studio.dev",
    tokenHash: "fl_demo_seed_static_tok01",
    entitlementId: "ent_seed_static_01",
    createdAt: "2026-03-05T15:30:00.000Z",
    lastUsedAt: null,
    revokedAt: null,
  },
];

const SEED_WAITLIST = [
  {
    email: "alex@design.co",
    source: "seed",
    createdAt: "2026-02-10T09:00:00.000Z",
  },
  {
    email: "jordan@product.io",
    source: "seed",
    createdAt: "2026-02-18T14:20:00.000Z",
  },
  {
    email: "sam@agency.studio",
    source: "homepage",
    createdAt: "2026-02-28T11:05:00.000Z",
  },
];

/** One optional catalog override so admin materials shows a draft edit. */
const SEED_OVERRIDE_SLUG = "aurora-mesh";
const SEED_OVERRIDE = {
  description:
    "[Demo override] Soft aurora mesh for heroes — seeded for admin publish UI.",
};

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function mergeById(existing, seeds, idKey = "id") {
  const list = Array.isArray(existing) ? [...existing] : [];
  let added = 0;
  for (const seed of seeds) {
    if (list.some((row) => row && row[idKey] === seed[idKey])) continue;
    list.push(seed);
    added++;
  }
  return { list, added };
}

function mergeWaitlist(existing, seeds) {
  const list = Array.isArray(existing) ? [...existing] : [];
  let added = 0;
  for (const seed of seeds) {
    if (list.some((row) => row && row.email === seed.email)) continue;
    list.push(seed);
    added++;
  }
  return { list, added };
}

function main() {
  console.log("\nSeeding demo data → .data/\n");

  const ordersResult = mergeById(readJson(ORDERS_PATH, []), SEED_ORDERS);
  writeJson(ORDERS_PATH, ordersResult.list);
  console.log(
    `  orders.json          +${ordersResult.added} (total ${ordersResult.list.length})`,
  );

  const entStore = readJson(ENTITLEMENTS_PATH, {
    entitlements: [],
    tokens: [],
  });
  const entitlementsResult = mergeById(
    Array.isArray(entStore.entitlements) ? entStore.entitlements : [],
    SEED_ENTITLEMENTS,
  );
  const tokensResult = mergeById(
    Array.isArray(entStore.tokens) ? entStore.tokens : [],
    SEED_TOKENS,
  );
  writeJson(ENTITLEMENTS_PATH, {
    entitlements: entitlementsResult.list,
    tokens: tokensResult.list,
  });
  console.log(
    `  entitlements.json    +${entitlementsResult.added} entitlements, +${tokensResult.added} tokens`,
  );

  const waitlistResult = mergeWaitlist(
    readJson(WAITLIST_PATH, []),
    SEED_WAITLIST,
  );
  writeJson(WAITLIST_PATH, waitlistResult.list);
  console.log(
    `  waitlist.json        +${waitlistResult.added} (total ${waitlistResult.list.length})`,
  );

  const overrides = readJson(OVERRIDES_PATH, {});
  const overridesObj =
    overrides && typeof overrides === "object" && !Array.isArray(overrides)
      ? { ...overrides }
      : {};
  let overrideAdded = 0;
  if (!overridesObj[SEED_OVERRIDE_SLUG]) {
    overridesObj[SEED_OVERRIDE_SLUG] = SEED_OVERRIDE;
    overrideAdded = 1;
    writeJson(OVERRIDES_PATH, overridesObj);
  }
  console.log(
    `  catalog-overrides    +${overrideAdded} (${SEED_OVERRIDE_SLUG})`,
  );

  console.log("\nDone. Re-run is safe (idempotent).\n");
}

main();
