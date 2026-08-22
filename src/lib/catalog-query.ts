import { isMaterialType } from "@/materials/catalog";
import {
  isMaterialUseContext,
  type MaterialType,
  type MaterialUseContext,
} from "@/materials/types";

export type CatalogTierFilter = "free" | "paid";
export type CatalogSort = "name" | "tier";

export function isTierFilter(value: string): value is CatalogTierFilter {
  return value === "free" || value === "paid";
}

export function isSort(value: string): value is CatalogSort {
  return value === "name" || value === "tier";
}

export function buildMaterialsHref(params: {
  type?: string;
  q?: string;
  context?: string;
  tier?: string;
  sort?: string;
}) {
  const sp = new URLSearchParams();
  if (params.type) sp.set("type", params.type);
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.context) sp.set("context", params.context);
  if (params.tier) sp.set("tier", params.tier);
  if (params.sort && params.sort !== "name") sp.set("sort", params.sort);
  const qs = sp.toString();
  return qs ? `/materials?${qs}` : "/materials";
}

/** Pull type / context / tier tokens out of a free-text search. */
export function parseSmartQuery(raw: string): {
  q?: string;
  type?: MaterialType;
  context?: MaterialUseContext;
  tier?: CatalogTierFilter;
} {
  const leftover: string[] = [];
  let type: MaterialType | undefined;
  let context: MaterialUseContext | undefined;
  let tier: CatalogTierFilter | undefined;

  for (const token of raw.trim().toLowerCase().split(/\s+/).filter(Boolean)) {
    if (!type && isMaterialType(token)) {
      type = token;
      continue;
    }
    if (!context && isMaterialUseContext(token)) {
      context = token;
      continue;
    }
    if (!tier && isTierFilter(token)) {
      tier = token;
      continue;
    }
    leftover.push(token);
  }

  return {
    q: leftover.length ? leftover.join(" ") : undefined,
    type,
    context,
    tier,
  };
}
