"use client";

import Link from "next/link";

import { MaterialPreview } from "@/components/material-preview";
import {
  MarketingRuledCell,
  MarketingRuledGrid,
} from "@/components/marketing-shell";
import type { MaterialCatalogEntry } from "@/materials";

/**
 * Live material previews on the waitlist landing — proof before signup.
 */
export function WaitlistDemos({
  materials,
}: {
  materials: MaterialCatalogEntry[];
}) {
  return (
    <MarketingRuledGrid className="lg:grid-cols-3">
      {materials.map((entry) => (
        <MarketingRuledCell key={entry.slug} className="p-0 sm:p-0 lg:p-0">
          <Link
            className="group block transition-colors hover:bg-muted/40"
            href={`/materials/${entry.slug}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
              <MaterialPreview entry={entry} />
            </div>
            <div className="space-y-1 border-t border-border p-5 sm:p-6">
              <p className="font-heading text-sm font-medium tracking-tight text-foreground group-hover:text-muted-foreground">
                {entry.title}
              </p>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
            </div>
          </Link>
        </MarketingRuledCell>
      ))}
    </MarketingRuledGrid>
  );
}
