"use client";

import Link from "next/link";

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
  MATERIALS_COLLECTIONS,
  getCollectionMaterials,
} from "@/materials";

export function CollectionsIndexPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <p className="font-mono text-[11px] text-muted-foreground">
              {MATERIALS_COLLECTIONS.length} collections
            </p>
          }
          description="Editorial drops off the main catalog — materials grouped by job, not by trend."
          eyebrow="Collections"
          title="Curated sets"
        />

        <MarketingRuledGrid cols={2}>
          {MATERIALS_COLLECTIONS.map((collection) => {
            const materials = getCollectionMaterials(collection);
            const preview = materials[0];
            const countLabel =
              materials.length === 1
                ? "1 material"
                : `${materials.length} materials`;

            return (
              <MarketingRuledCell
                key={collection.slug}
                className="p-0 sm:p-0 lg:p-0"
              >
                <Link
                  className="group block h-full transition-colors hover:bg-muted/40"
                  href={`/collections/${collection.slug}`}
                >
                  <div className="relative aspect-[21/9] overflow-hidden bg-foreground">
                    {preview ? (
                      <MaterialPreview entry={preview} />
                    ) : (
                      <div className="absolute inset-0 bg-muted" />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-6 border-t border-border p-6 sm:p-8 lg:p-10">
                    <div className="min-w-0 space-y-2.5">
                      <h2 className="font-heading text-base font-medium tracking-tight">
                        {collection.title}
                      </h2>
                      <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                        {collection.description}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                      {countLabel}
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
