"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import {
  getCollection,
  getCollectionMaterials,
} from "@/materials";

export function CollectionDetailPage({ slug }: { slug: string }) {
  const collection = getCollection(slug);
  if (!collection) notFound();

  const materials = getCollectionMaterials(collection);

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <Button
              nativeButton={false}
              render={<Link href="/collections" />}
              size="sm"
              variant="outline"
            >
              All collections
            </Button>
          }
          description={collection.description}
          eyebrow={`Collection · ${materials.length} materials`}
          title={collection.title}
        />

        <MarketingRuledGrid>
          {materials.map((entry) => (
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
                    <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                      {(entry.renderingTechnique ?? "webgl").toUpperCase()}
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
