"use client";

import * as React from "react";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  MarketingSectionHeader,
  MarketingShell,
} from "@/components/marketing-shell";
import {
  AuroraMesh,
  GrainField,
  InkDither,
  MATERIALS_CATALOG,
  type MaterialCatalogEntry,
} from "@/materials";
import { cn } from "@/lib/utils";

function MaterialPreview({ entry }: { entry: MaterialCatalogEntry }) {
  const common = "absolute inset-0 h-full w-full";

  switch (entry.slug) {
    case "aurora-mesh":
      return <AuroraMesh className={common} />;
    case "ink-dither":
      return <InkDither className={common} />;
    case "grain-field":
      return <GrainField className={common} />;
    default:
      return (
        <div
          className={common}
          style={{
            backgroundImage: `linear-gradient(135deg, ${entry.fallbackColors.join(", ")})`,
          }}
        />
      );
  }
}

export function MaterialsCatalogPage() {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingSectionHeader>
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Materials · v0
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Surface as code
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Production-ready materials you can install. Live preview below —
            open any material to tune props and copy JSX.
          </p>
        </MarketingSectionHeader>

        <MarketingRuledGrid>
          {MATERIALS_CATALOG.map((entry) => (
            <MarketingRuledCell key={entry.slug} className="p-0 sm:p-0 lg:p-0">
              <Link
                className={cn(
                  "group block transition-colors hover:bg-muted/40",
                )}
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
