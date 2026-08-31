import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { getPrisma, hasDatabaseUrl } from "@/lib/db";

import {
  MATERIALS_CATALOG,
  V1_LAUNCH_MATERIAL_SLUGS,
  applyCatalogOverride,
  filterV1LaunchCatalog,
  isV1LaunchMaterial,
  type CatalogMaterialOverride,
  type MaterialCatalogEntry,
} from "@/materials";
import {
  getScreenBySlug,
  listAllScreenEntries,
  SCREENS_CATALOG,
} from "@/screens/catalog";
import { isPriorityStorefrontScreen } from "@/screens/storefront-priority";
import type { ScreenCatalogEntry } from "@/screens/types";

export type ResolvedCatalogOptions = {
  /** Include full catalog (admin). Default: lean V1 public set only. */
  all?: boolean;
  /** Include draft items (admin storefront view). Default: hidden on public routes. */
  includeDrafts?: boolean;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const OVERRIDES_PATH = path.join(DATA_DIR, "catalog-overrides.json");
const ORDER_PATH = path.join(DATA_DIR, "catalog-order.json");

const STORE_KEYS = {
  overrides: "catalog-overrides",
  order: "catalog-order",
} as const;

let catalogStoreReady: Promise<void> | null = null;

/** Create CatalogStore on first use so production works without a manual db:push. */
async function ensureCatalogStoreTable(): Promise<void> {
  if (!hasDatabaseUrl()) return;

  if (!catalogStoreReady) {
    catalogStoreReady = (async () => {
      const prisma = getPrisma();
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CatalogStore" (
          "key" TEXT NOT NULL,
          "data" JSONB NOT NULL,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "CatalogStore_pkey" PRIMARY KEY ("key")
        );
      `);
    })().catch((err) => {
      catalogStoreReady = null;
      throw err;
    });
  }

  await catalogStoreReady;
}

async function readStoreJson<T>(storeKey: string, filePath: string, fallback: T): Promise<T> {
  if (hasDatabaseUrl()) {
    try {
      await ensureCatalogStoreTable();
      const prisma = getPrisma();
      const row = await prisma.catalogStore.findUnique({ where: { key: storeKey } });
      if (row?.data !== undefined && row.data !== null) {
        return row.data as T;
      }
    } catch {
      // Fall through to file fallback when DB is unavailable mid-request.
    }
  }

  return readJsonFile<T>(filePath, fallback);
}

async function writeStoreJson(storeKey: string, filePath: string, data: unknown): Promise<void> {
  let dbError: unknown;

  if (hasDatabaseUrl()) {
    try {
      await ensureCatalogStoreTable();
      const prisma = getPrisma();
      await prisma.catalogStore.upsert({
        where: { key: storeKey },
        create: { key: storeKey, data: data as object },
        update: { data: data as object },
      });
      return;
    } catch (err) {
      dbError = err;
    }
  }

  try {
    await writeJsonFile(filePath, data);
    return;
  } catch (err) {
    const message =
      dbError instanceof Error
        ? dbError.message
        : err instanceof Error
          ? err.message
          : "Catalog store write failed";
    throw new Error(message);
  }
}

export type CatalogOverridesFile = Record<string, CatalogMaterialOverride>;

export type AdminCatalogKind = "screen" | "material";

export type AdminCatalogRow = {
  kind: AdminCatalogKind;
  slug: string;
  title: string;
  description: string;
  typeLabel: string;
  tier: string;
  status: "draft" | "published";
  onStorefront: boolean;
  poster?: string;
  material?: MaterialCatalogEntry;
  screen?: ScreenCatalogEntry;
};

function applyScreenCatalogOverride(
  entry: ScreenCatalogEntry,
  override?: CatalogMaterialOverride | null,
): ScreenCatalogEntry {
  if (!override) return entry;
  return {
    ...entry,
    ...(override.title !== undefined ? { title: override.title } : {}),
    ...(override.description !== undefined
      ? { description: override.description }
      : {}),
  };
}

function isKnownCatalogSlug(slug: string): boolean {
  return (
    MATERIALS_CATALOG.some((entry) => entry.slug === slug) ||
    listAllScreenEntries().some((entry) => entry.slug === slug)
  );
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** Read storefront slug order from catalog store. */
export async function readCatalogOrder(): Promise<string[] | null> {
  const parsed = await readStoreJson<unknown>(STORE_KEYS.order, ORDER_PATH, null);
  if (!Array.isArray(parsed)) return null;
  return parsed.filter((slug): slug is string => typeof slug === "string");
}

/** Persist storefront slug order (V1 launch set only). */
export async function writeCatalogOrder(slugs: string[]): Promise<string[]> {
  const allowed = new Set<string>(V1_LAUNCH_MATERIAL_SLUGS);
  const seen = new Set<string>();
  const next: string[] = [];

  for (const slug of slugs) {
    if (!allowed.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    next.push(slug);
  }

  for (const slug of V1_LAUNCH_MATERIAL_SLUGS) {
    if (!seen.has(slug)) next.push(slug);
  }

  await writeStoreJson(STORE_KEYS.order, ORDER_PATH, next);
  return next;
}

function sortByCatalogOrder<T extends { slug: string }>(
  entries: readonly T[],
  orderSlugs: string[] | null,
): T[] {
  if (!orderSlugs?.length) {
    return filterV1LaunchCatalog(entries);
  }

  const order = new Map(orderSlugs.map((slug, index) => [slug, index]));
  return entries
    .filter((entry) => order.has(entry.slug))
    .slice()
    .sort(
      (a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99),
    );
}

/** Read draft metadata overrides from catalog store. */
export async function readCatalogOverrides(): Promise<CatalogOverridesFile> {
  const parsed = await readStoreJson<unknown>(STORE_KEYS.overrides, OVERRIDES_PATH, {});
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }
  return parsed as CatalogOverridesFile;
}

/** Merge a partial override for a known catalog slug (does not mutate source catalog). */
export async function writeCatalogOverride(
  slug: string,
  patch: CatalogMaterialOverride,
): Promise<CatalogMaterialOverride> {
  if (!isKnownCatalogSlug(slug)) {
    throw new Error(`Unknown catalog slug: ${slug}`);
  }

  const all = await readCatalogOverrides();
  const prev = all[slug] ?? {};
  const next: CatalogMaterialOverride = { ...prev };

  if (patch.title !== undefined) next.title = patch.title;
  if (patch.description !== undefined) next.description = patch.description;
  if (patch.status !== undefined) next.status = patch.status;
  if (patch.tier !== undefined) next.tier = patch.tier;

  // Drop empty keys
  for (const key of Object.keys(next) as (keyof CatalogMaterialOverride)[]) {
    if (next[key] === undefined || next[key] === "") {
      delete next[key];
    }
  }

  if (Object.keys(next).length === 0) {
    delete all[slug];
  } else {
    all[slug] = next;
  }

  await writeStoreJson(STORE_KEYS.overrides, OVERRIDES_PATH, all);
  return next;
}

/** Apply the same override patch to many slugs (bulk draft / publish / hide). */
export async function writeCatalogOverridesBulk(
  slugs: string[],
  patch: CatalogMaterialOverride,
): Promise<number> {
  const all = await readCatalogOverrides();
  let updated = 0;

  for (const slug of slugs) {
    if (!isKnownCatalogSlug(slug)) continue;
    const prev = all[slug] ?? {};
    const next: CatalogMaterialOverride = { ...prev, ...patch };

    for (const key of Object.keys(next) as (keyof CatalogMaterialOverride)[]) {
      if (next[key] === undefined || next[key] === "") {
        delete next[key];
      }
    }

    if (Object.keys(next).length === 0) {
      delete all[slug];
    } else {
      all[slug] = next;
    }
    updated += 1;
  }

  await writeStoreJson(STORE_KEYS.overrides, OVERRIDES_PATH, all);
  return updated;
}

/** Remove all overrides for slugs (reset to source catalog defaults). */
export async function removeCatalogOverrides(slugs: string[]): Promise<number> {
  const all = await readCatalogOverrides();
  let removed = 0;

  for (const slug of slugs) {
    if (!all[slug]) continue;
    delete all[slug];
    removed += 1;
  }

  await writeStoreJson(STORE_KEYS.overrides, OVERRIDES_PATH, all);
  return removed;
}

/** Public storefront screens with demo overrides applied. */
export async function getResolvedScreens(
  options: ResolvedCatalogOptions = {},
): Promise<ScreenCatalogEntry[]> {
  const overrides = await readCatalogOverrides();
  const source = options.all ? listAllScreenEntries() : SCREENS_CATALOG;
  const resolved = source.map((entry) =>
    applyScreenCatalogOverride(entry, overrides[entry.slug]),
  );

  if (options.includeDrafts) return resolved;

  return resolved.filter((entry) => {
    if (isPriorityStorefrontScreen(entry.slug)) return true;
    const status = overrides[entry.slug]?.status ?? "published";
    return status !== "draft";
  });
}

/** Single screen with overrides; hidden when draft on public routes. */
export async function getResolvedScreen(
  slug: string,
  options: ResolvedCatalogOptions = {},
): Promise<ScreenCatalogEntry | undefined> {
  const base = getScreenBySlug(slug);
  if (!base) return undefined;

  const overrides = await readCatalogOverrides();
  const status = overrides[base.slug]?.status ?? "published";
  const isPublic = SCREENS_CATALOG.some((entry) => entry.slug === base.slug);

  if (
    !options.all &&
    !options.includeDrafts &&
    status === "draft" &&
    !isPriorityStorefrontScreen(base.slug)
  ) {
    return undefined;
  }
  if (!options.all && !isPublic && !options.includeDrafts) {
    return undefined;
  }

  return applyScreenCatalogOverride(base, overrides[base.slug]);
}

/** Status for admin table (override status or published). */
export async function getAssetPublishStatus(
  slug: string,
): Promise<"draft" | "published"> {
  const overrides = await readCatalogOverrides();
  return overrides[slug]?.status ?? "published";
}

/** Unified admin rows: storefront (screens + materials) first, then back catalog. */
export async function getAdminCatalogRows(): Promise<AdminCatalogRow[]> {
  const [
    overrides,
    storefrontMaterials,
    allMaterials,
    storefrontScreens,
    allScreens,
  ] = await Promise.all([
    readCatalogOverrides(),
    getResolvedCatalog({ includeDrafts: true }),
    getResolvedCatalog({ all: true, includeDrafts: true }),
    getResolvedScreens({ includeDrafts: true }),
    getResolvedScreens({ all: true, includeDrafts: true }),
  ]);

  const storefrontMaterialSlugs = new Set(
    storefrontMaterials.map((entry) => entry.slug),
  );
  const storefrontScreenSlugs = new Set(
    SCREENS_CATALOG.map((entry) => entry.slug),
  );

  const toMaterialRow = (
    entry: MaterialCatalogEntry,
    onStorefront: boolean,
  ): AdminCatalogRow => ({
    kind: "material",
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    typeLabel: entry.type,
    tier: entry.tier,
    status: overrides[entry.slug]?.status ?? "published",
    onStorefront,
    material: entry,
  });

  const toScreenRow = (
    entry: ScreenCatalogEntry,
    onStorefront: boolean,
  ): AdminCatalogRow => ({
    kind: "screen",
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    typeLabel: "screen",
    tier: entry.tier,
    status: overrides[entry.slug]?.status ?? "published",
    onStorefront,
    poster: entry.poster,
    screen: entry,
  });

  const storefrontRows: AdminCatalogRow[] = [
    ...storefrontScreens.map((entry) => toScreenRow(entry, true)),
    ...storefrontMaterials.map((entry) => toMaterialRow(entry, true)),
  ];

  const backCatalogRows: AdminCatalogRow[] = [
    ...allScreens
      .filter((entry) => !storefrontScreenSlugs.has(entry.slug))
      .map((entry) => toScreenRow(entry, false)),
    ...allMaterials
      .filter((entry) => !storefrontMaterialSlugs.has(entry.slug))
      .map((entry) => toMaterialRow(entry, false)),
  ];

  return [...storefrontRows, ...backCatalogRows];
}

/** Source catalog with demo overrides applied. Public routes get V1 set only. */
export async function getResolvedCatalog(
  options: ResolvedCatalogOptions = {},
): Promise<MaterialCatalogEntry[]> {
  const [overrides, orderSlugs] = await Promise.all([
    readCatalogOverrides(),
    readCatalogOrder(),
  ]);
  const resolved = MATERIALS_CATALOG.map((entry) =>
    applyCatalogOverride(entry, overrides[entry.slug]),
  );
  if (options.all) return resolved;

  const ordered = sortByCatalogOrder(resolved, orderSlugs);

  if (options.includeDrafts) return ordered;

  return ordered.filter((entry) => {
    const status = overrides[entry.slug]?.status ?? "published";
    return status !== "draft";
  });
}

/** Single material with demo overrides applied. Hidden outside V1 unless `all`. */
export async function getResolvedMaterial(
  slug: string,
  options: ResolvedCatalogOptions = {},
): Promise<MaterialCatalogEntry | undefined> {
  const overrides = await readCatalogOverrides();
  const base = MATERIALS_CATALOG.find((m) => m.slug === slug);
  if (!base) return undefined;
  if (!options.all && !isV1LaunchMaterial(slug)) return undefined;
  if (!options.all && (overrides[slug]?.status ?? "published") === "draft") {
    return undefined;
  }
  return applyCatalogOverride(base, overrides[slug]);
}

/** @deprecated Use getAssetPublishStatus */
export async function getMaterialPublishStatus(
  slug: string,
): Promise<"draft" | "published"> {
  return getAssetPublishStatus(slug);
}
