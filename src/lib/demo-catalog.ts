import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  MATERIALS_CATALOG,
  V1_LAUNCH_MATERIAL_SLUGS,
  applyCatalogOverride,
  filterV1LaunchCatalog,
  isV1LaunchMaterial,
  type CatalogMaterialOverride,
  type MaterialCatalogEntry,
} from "@/materials";

export type ResolvedCatalogOptions = {
  /** Include full catalog (admin). Default: lean V1 public set only. */
  all?: boolean;
  /** Include draft items (admin storefront view). Default: hidden on public routes. */
  includeDrafts?: boolean;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const OVERRIDES_PATH = path.join(DATA_DIR, "catalog-overrides.json");
const ORDER_PATH = path.join(DATA_DIR, "catalog-order.json");

export type CatalogOverridesFile = Record<string, CatalogMaterialOverride>;

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

/** Read storefront slug order from `.data/catalog-order.json`. */
export async function readCatalogOrder(): Promise<string[] | null> {
  const parsed = await readJsonFile<unknown>(ORDER_PATH, null);
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

  await writeJsonFile(ORDER_PATH, next);
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

/** Read draft metadata overrides from `.data/catalog-overrides.json`. */
export async function readCatalogOverrides(): Promise<CatalogOverridesFile> {
  const parsed = await readJsonFile<unknown>(OVERRIDES_PATH, {});
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
  const base = MATERIALS_CATALOG.find((m) => m.slug === slug);
  if (!base) {
    throw new Error(`Unknown material slug: ${slug}`);
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

  await writeJsonFile(OVERRIDES_PATH, all);
  return next;
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

/** Status for admin table (override status or published). */
export async function getMaterialPublishStatus(
  slug: string,
): Promise<"draft" | "published"> {
  const overrides = await readCatalogOverrides();
  return overrides[slug]?.status ?? "published";
}
