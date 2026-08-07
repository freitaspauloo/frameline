"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useTransition, type FormEvent } from "react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { MaterialPreview } from "@/components/material-preview";
import {
  MarketingPageHeader,
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingShell,
} from "@/components/marketing-shell";
import {
  getV1LaunchCatalog,
  MATERIAL_TYPES,
  MATERIAL_USE_CONTEXTS,
  isMaterialType,
  isMaterialUseContext,
  type MaterialCatalogEntry,
  type MaterialTier,
  type MaterialType,
  type MaterialUseContext,
} from "@/materials";
import { cn } from "@/lib/utils";

/** Hairline filter — outline, not a soft pill. */
const CHIP =
  "border border-border px-4 py-2 text-[0.625rem] font-semibold tracking-widest uppercase transition-colors";

const TIER_FILTERS = [
  { value: "free" as const, label: "Free" },
  { value: "paid" as const, label: "Paid" },
];

export type CatalogTierFilter = "free" | "paid";
export type CatalogSort = "name" | "tier";

const TIER_SORT_RANK: Record<MaterialTier, number> = {
  free: 0,
  personal: 1,
  team: 2,
};

function isTierFilter(value: string): value is CatalogTierFilter {
  return value === "free" || value === "paid";
}

function isSort(value: string): value is CatalogSort {
  return value === "name" || value === "tier";
}

function buildMaterialsHref(params: {
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

export function MaterialsCatalogPage({
  typeFilter,
  qFilter,
  contextFilter,
  tierFilter,
  sortFilter,
  catalog = getV1LaunchCatalog(),
}: {
  typeFilter?: string;
  qFilter?: string;
  contextFilter?: string;
  tierFilter?: string;
  sortFilter?: string;
  /** Resolved catalog (demo overrides merged). Defaults to source catalog. */
  catalog?: MaterialCatalogEntry[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const activeType: MaterialType | undefined =
    typeFilter && isMaterialType(typeFilter) ? typeFilter : undefined;
  const activeContext: MaterialUseContext | undefined =
    contextFilter && isMaterialUseContext(contextFilter)
      ? contextFilter
      : undefined;
  const activeTier: CatalogTierFilter | undefined =
    tierFilter && isTierFilter(tierFilter) ? tierFilter : undefined;
  const activeSort: CatalogSort =
    sortFilter && isSort(sortFilter) ? sortFilter : "name";
  const activeQ = qFilter?.trim() ?? "";

  const baseParams = {
    type: activeType,
    q: activeQ || undefined,
    context: activeContext,
    tier: activeTier,
    sort: activeSort,
  };

  const entries = useMemo(() => {
    let list = catalog.slice();

    if (activeType) {
      list = list.filter((m) => m.type === activeType);
    }
    if (activeContext) {
      list = list.filter((m) => m.useContexts.includes(activeContext));
    }
    if (activeTier === "free") {
      list = list.filter((m) => m.tier === "free");
    } else if (activeTier === "paid") {
      list = list.filter((m) => m.tier === "personal" || m.tier === "team");
    }
    if (activeQ) {
      const needle = activeQ.toLowerCase();
      list = list.filter((m) => {
        const hay = [m.title, m.description, ...m.tags].join(" ").toLowerCase();
        return hay.includes(needle);
      });
    }

    list.sort((a, b) => {
      if (activeSort === "tier") {
        const diff = TIER_SORT_RANK[a.tier] - TIER_SORT_RANK[b.tier];
        if (diff !== 0) return diff;
      }
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [catalog, activeType, activeContext, activeTier, activeQ, activeSort]);

  const contextCoverage = useMemo(() => {
    return MATERIAL_USE_CONTEXTS.map((c) => ({
      ...c,
      count: catalog.filter((m) => m.useContexts.includes(c.value)).length,
    }));
  }, [catalog]);

  const typeMeta = MATERIAL_TYPES.find((t) => t.type === activeType);

  function navigate(next: Partial<typeof baseParams>) {
    const href = buildMaterialsHref({ ...baseParams, ...next });
    startTransition(() => {
      router.push(href);
    });
  }

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const q = String(fd.get("q") ?? "");
    navigate({ q: q || undefined });
  }

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <p className="font-mono text-[11px] text-muted-foreground">
              {entries.length} {entries.length === 1 ? "material" : "materials"}
            </p>
          }
          description={
            typeMeta
              ? typeMeta.description
              : "Production-ready materials you can install. Open any material to tune props and copy JSX."
          }
          eyebrow={`Materials${activeType ? ` · ${activeType}` : ""}`}
          title={typeMeta ? typeMeta.title : "Surface as code"}
        >
          <div className="space-y-6">
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              Contexts:{" "}
              {contextCoverage.map((c, i) => (
                <span key={c.value}>
                  {i > 0 ? " · " : null}
                  <Link
                    className="hover:text-foreground"
                    href={`/materials/contexts/${c.value}`}
                  >
                    {c.value} ({c.count})
                  </Link>
                </span>
              ))}
            </p>

            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={onSearchSubmit}
            >
              <label
                className="min-w-0 flex-1 space-y-2"
                htmlFor="materials-catalog-search"
              >
                <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Search
                </span>
                <input
                  aria-label="Search materials"
                  className="h-10 w-full border border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
                  defaultValue={activeQ}
                  id="materials-catalog-search"
                  key={activeQ}
                  name="q"
                  placeholder="Title, description, tags…"
                  type="search"
                />
              </label>
              <button className={cn(CHIP, "text-foreground")} type="submit">
                Search
              </button>
              <label className="space-y-2">
                <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Sort
                </span>
                <select
                  className="flex h-10 border border-border bg-transparent px-3 text-[0.625rem] font-semibold tracking-widest text-foreground uppercase outline-none focus-visible:border-foreground"
                  onChange={(e) => {
                    const value = e.target.value;
                    navigate({
                      sort: isSort(value) ? value : "name",
                    });
                  }}
                  value={activeSort}
                >
                  <option value="name">Name</option>
                  <option value="tier">Tier</option>
                </select>
              </label>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                className={cn(
                  CHIP,
                  !activeType
                    ? "border-foreground bg-foreground text-background"
                    : "text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
                href={buildMaterialsHref({ ...baseParams, type: undefined })}
              >
                All
              </Link>
              {MATERIAL_TYPES.map((t) => (
                <Link
                  key={t.type}
                  className={cn(
                    CHIP,
                    activeType === t.type
                      ? "border-foreground bg-foreground text-background"
                      : "text-muted-foreground hover:border-foreground hover:text-foreground",
                  )}
                  href={buildMaterialsHref({ ...baseParams, type: t.type })}
                >
                  {t.title}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="self-center pr-1 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Context
              </span>
              <Link
                className={cn(
                  CHIP,
                  !activeContext
                    ? "border-foreground bg-foreground text-background"
                    : "text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
                href={buildMaterialsHref({
                  ...baseParams,
                  context: undefined,
                })}
              >
                Any
              </Link>
              {MATERIAL_USE_CONTEXTS.map((c) => (
                <Link
                  key={c.value}
                  className={cn(
                    CHIP,
                    activeContext === c.value
                      ? "border-foreground bg-foreground text-background"
                      : "text-muted-foreground hover:border-foreground hover:text-foreground",
                  )}
                  href={buildMaterialsHref({
                    ...baseParams,
                    context: c.value,
                  })}
                >
                  {c.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="self-center pr-1 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Tier
              </span>
              <Link
                className={cn(
                  CHIP,
                  !activeTier
                    ? "border-foreground bg-foreground text-background"
                    : "text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
                href={buildMaterialsHref({ ...baseParams, tier: undefined })}
              >
                Any
              </Link>
              {TIER_FILTERS.map((t) => (
                <Link
                  key={t.value}
                  className={cn(
                    CHIP,
                    activeTier === t.value
                      ? "border-foreground bg-foreground text-background"
                      : "text-muted-foreground hover:border-foreground hover:text-foreground",
                  )}
                  href={buildMaterialsHref({ ...baseParams, tier: t.value })}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </MarketingPageHeader>

        {entries.length === 0 ? (
          <div className="border-b border-border px-6 py-16 text-center sm:px-8 lg:px-12">
            <p className="text-sm text-muted-foreground">
              No materials match these filters.
            </p>
            <Link
              className="mt-4 inline-block text-sm text-foreground underline underline-offset-4"
              href="/materials"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <MarketingRuledGrid>
            {entries.map((entry) => (
              <MarketingRuledCell key={entry.slug} className="p-0 sm:p-0 lg:p-0">
                <Link
                  className="group block transition-colors hover:bg-muted/40"
                  href={`/materials/${entry.slug}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
                    <MaterialPreview entry={entry} />
                  </div>
                  <div className="space-y-2.5 border-t border-border p-6 sm:p-8 lg:p-10">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-heading text-base font-medium tracking-tight">
                        {entry.title}
                      </h2>
                      <span className="flex shrink-0 items-center gap-2 text-[0.625rem] font-semibold tracking-widest uppercase">
                        <span className="text-muted-foreground">
                          {(entry.renderingTechnique ?? "webgl").toUpperCase()}
                        </span>
                        <span
                          className={
                            entry.tier === "free"
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }
                        >
                          {entry.tier === "free" ? "Free" : "Paid"}
                        </span>
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </Link>
              </MarketingRuledCell>
            ))}
          </MarketingRuledGrid>
        )}
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
