"use client";

import Link from "next/link";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { MaterialPreview } from "@/components/material-preview";
import {
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingSectionHeader,
  MarketingShell,
} from "@/components/marketing-shell";
import {
  MATERIALS_COLLECTIONS,
  getCollectionMaterials,
} from "@/materials";

export function CollectionsIndexPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingSectionHeader>
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Collections
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Curated sets
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Editorial drops off the main catalog — materials grouped by job, not
            by trend.
          </p>
        </MarketingSectionHeader>

        <MarketingRuledGrid cols={2}>
          {MATERIALS_COLLECTIONS.map((collection) => {
            const materials = getCollectionMaterials(collection);
            const preview = materials[0];

            return (
              <MarketingRuledCell
                key={collection.slug}
                className="p-0 sm:p-0 lg:p-0"
              >
                <Link
                  className="group block transition-colors hover:bg-muted/40"
                  href={`/collections/${collection.slug}`}
                >
                  <div className="relative aspect-[21/9] overflow-hidden bg-foreground">
                    {preview ? (
                      <MaterialPreview entry={preview} />
                    ) : (
                      <div className="absolute inset-0 bg-muted" />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-border p-6 sm:p-8">
                    <div className="space-y-2">
                      <h2 className="font-heading text-base font-medium tracking-tight">
                        {collection.title}
                      </h2>
                      <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                        {collection.description}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {materials.length} materials
                    </p>
                  </div>
                </Link>
              </MarketingRuledCell>
            );
          })}
        </MarketingRuledGrid>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
