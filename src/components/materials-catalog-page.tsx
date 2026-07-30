"use client";

import Link from "next/link";
import { useMemo } from "react";

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
  MATERIALS_CATALOG,
  MATERIAL_TYPES,
  isMaterialType,
  type MaterialType,
} from "@/materials";
import { cn } from "@/lib/utils";

/** Hairline filter — outline, not a soft pill. */
const CHIP =
  "border border-border px-4 py-2 text-[0.625rem] font-semibold tracking-widest uppercase transition-colors";

export function MaterialsCatalogPage({
  typeFilter,
}: {
  typeFilter?: string;
}) {
  const activeType: MaterialType | undefined =
    typeFilter && isMaterialType(typeFilter) ? typeFilter : undefined;

  const entries = useMemo(
    () =>
      activeType
        ? MATERIALS_CATALOG.filter((m) => m.type === activeType)
        : MATERIALS_CATALOG,
    [activeType],
  );

  const typeMeta = MATERIAL_TYPES.find((t) => t.type === activeType);

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
          <div className="flex flex-wrap gap-2">
            <Link
              className={cn(
                CHIP,
                !activeType
                  ? "border-foreground bg-foreground text-background"
                  : "text-muted-foreground hover:border-foreground hover:text-foreground",
              )}
              href="/materials"
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
                href={`/materials?type=${t.type}`}
              >
                {t.title}
              </Link>
            ))}
          </div>
        </MarketingPageHeader>

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
                    <span
                      className={cn(
                        "text-[0.625rem] font-semibold tracking-widest uppercase",
                        entry.tier === "free"
                          ? "text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {entry.tier === "free" ? "Free" : "Paid"}
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
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
