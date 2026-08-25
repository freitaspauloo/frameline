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
  type MaterialType,
  type MaterialUseContext,
} from "@/materials";
import { getMaterialThumbnailSrc } from "@/materials/thumbnails";
import { buildMaterialsHref, parseSmartQuery } from "@/lib/catalog-query";
import { listScreens } from "@/screens/catalog";
import { screenPosterNeedsMagentaTint } from "@/screens/poster-tint";
import type { ScreenCatalogEntry } from "@/screens/types";

const SELECT =
  "h-10 shrink-0 border border-border bg-transparent px-3 text-[0.625rem] font-semibold tracking-widest text-foreground uppercase outline-none focus-visible:border-foreground";

export function MaterialsCatalogPage({
  typeFilter,
  qFilter,
  contextFilter,
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
  const activeQ = qFilter?.trim() ?? "";

  const baseParams = {
    type: activeType,
    q: activeQ || undefined,
    context: activeContext,
  };

  const entries = useMemo(() => {
    let list = catalog.slice();

    if (activeType) {
      list = list.filter((m) => m.type === activeType);
    }
    if (activeContext) {
      list = list.filter((m) => m.useContexts.includes(activeContext));
    }
    if (activeQ) {
      const needle = activeQ.toLowerCase();
      list = list.filter((m) => {
        const hay = [m.title, m.description, ...m.tags].join(" ").toLowerCase();
        return hay.includes(needle);
      });
    }

    list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [catalog, activeType, activeContext, activeQ]);

  const screens = useMemo(() => {
    if (activeType || activeContext) return [] as ScreenCatalogEntry[];
    let list = listScreens();
    if (activeQ) {
      const needle = activeQ.toLowerCase();
      list = list.filter((screen) => {
        const hay = [screen.title, screen.description, screen.blurb]
          .join(" ")
          .toLowerCase();
        return hay.includes(needle);
      });
    }
    return list;
  }, [activeType, activeContext, activeQ]);

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
    const parsed = parseSmartQuery(String(fd.get("q") ?? ""));
    navigate({
      q: parsed.q,
      type: parsed.type ?? activeType,
      context: parsed.context ?? activeContext,
    });
  }

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <p className="font-mono text-[11px] text-muted-foreground">
              {screens.length + entries.length}{" "}
              {screens.length + entries.length === 1 ? "item" : "items"}
            </p>
          }
          description={
            typeMeta
              ? typeMeta.description
              : "Screen templates and production-ready materials you can install. Open any item to copy source or tune props."
          }
          eyebrow={`Materials${activeType ? ` · ${activeType}` : ""}`}
          title={typeMeta ? typeMeta.title : "Surface as code"}
        >
          <form
            className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap"
            onSubmit={onSearchSubmit}
          >
            <label className="sr-only" htmlFor="materials-catalog-search">
              Search
            </label>
            <input
              aria-label="Search materials"
              autoComplete="off"
              className="h-10 min-w-0 flex-1 border border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
              defaultValue={activeQ}
              id="materials-catalog-search"
              key={`${activeQ}|${activeType ?? ""}|${activeContext ?? ""}`}
              name="q"
              placeholder="Search — or type dither, hero…"
              type="search"
            />
            <select
              aria-label="Type"
              className={SELECT}
              onChange={(e) => {
                const value = e.target.value;
                navigate({
                  type: isMaterialType(value) ? value : undefined,
                });
              }}
              value={activeType ?? ""}
            >
              <option value="">All types</option>
              {MATERIAL_TYPES.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.title}
                </option>
              ))}
            </select>
            <select
              aria-label="Context"
              className={SELECT}
              onChange={(e) => {
                const value = e.target.value;
                navigate({
                  context: isMaterialUseContext(value) ? value : undefined,
                });
              }}
              value={activeContext ?? ""}
            >
              <option value="">Any context</option>
              {MATERIAL_USE_CONTEXTS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </form>
        </MarketingPageHeader>

        {screens.length === 0 && entries.length === 0 ? (
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
            {screens.map((screen) => (
              <MarketingRuledCell
                key={screen.slug}
                className="p-0 sm:p-0 lg:p-0"
                id={screen.slug === screens[0]?.slug ? "screens" : undefined}
              >
                <Link
                  className="group block transition-colors hover:bg-muted/40"
                  href={`/materials/${screen.slug}`}
                  aria-label={screen.title}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#140810]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="absolute inset-0 size-full object-cover opacity-90"
                      src={
                        getMaterialThumbnailSrc(screen.slug) ?? screen.poster
                      }
                    />
                    {screenPosterNeedsMagentaTint(screen.slug) ? (
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-[#d600bf] mix-blend-color"
                      />
                    ) : null}
                  </div>
                </Link>
              </MarketingRuledCell>
            ))}
            {entries.map((entry) => (
              <MarketingRuledCell key={entry.slug} className="p-0 sm:p-0 lg:p-0">
                <Link
                  className="group block transition-colors hover:bg-muted/40"
                  href={`/materials/${entry.slug}`}
                  aria-label={entry.title}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
                    <MaterialPreview entry={entry} />
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
