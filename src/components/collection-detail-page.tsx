"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import {
  getCollection,
  getCollectionMaterials,
} from "@/materials";
import { cn } from "@/lib/utils";

export function CollectionDetailPage({ slug }: { slug: string }) {
  const collection = getCollection(slug);
  if (!collection) notFound();

  const materials = getCollectionMaterials(collection);

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingSectionHeader>
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Collection
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {collection.description}
          </p>
          <div className="mt-6">
            <Button
              nativeButton={false}
              render={<Link href="/collections" />}
              size="sm"
              variant="outline"
            >
              All collections
            </Button>
          </div>
        </MarketingSectionHeader>

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
                <div className="space-y-2 border-t border-border p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-2">
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
