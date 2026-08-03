import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  MATERIALS_CATALOG,
  applyCatalogOverride,
  type CatalogMaterialOverride,
  type MaterialCatalogEntry,
} from "@/materials";

const DATA_DIR = path.join(process.cwd(), ".data");
const OVERRIDES_PATH = path.join(DATA_DIR, "catalog-overrides.json");

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

/** Source catalog with demo overrides applied. */
export async function getResolvedCatalog(): Promise<MaterialCatalogEntry[]> {
  const overrides = await readCatalogOverrides();
  return MATERIALS_CATALOG.map((entry) =>
    applyCatalogOverride(entry, overrides[entry.slug]),
  );
}

/** Single material with demo overrides applied. */
export async function getResolvedMaterial(
  slug: string,
): Promise<MaterialCatalogEntry | undefined> {
  const overrides = await readCatalogOverrides();
  const base = MATERIALS_CATALOG.find((m) => m.slug === slug);
  if (!base) return undefined;
  return applyCatalogOverride(base, overrides[slug]);
}

/** Status for admin table (override status or published). */
export async function getMaterialPublishStatus(
  slug: string,
): Promise<"draft" | "published"> {
  const overrides = await readCatalogOverrides();
  return overrides[slug]?.status ?? "published";
}
