"use client";

import Link from "next/link";
import { useState } from "react";

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
import type { MaterialCatalogEntry } from "@/materials";
import { cn } from "@/lib/utils";

function FreeMaterialInstall({ entry }: { entry: MaterialCatalogEntry }) {
  const [copied, setCopied] = useState(false);
  const cli = `npx shadcn@latest add @frameline/${entry.slug}`;

  async function copyCli() {
    try {
      await navigator.clipboard.writeText(cli);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4 border-t border-border p-6 sm:p-8 lg:p-10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <Link
            className="font-heading text-base font-medium tracking-tight text-foreground hover:text-muted-foreground"
            href={`/materials/${entry.slug}`}
          >
            {entry.title}
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {entry.description}
          </p>
        </div>
        <span className="shrink-0 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Free
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Install
        </p>
        <div className="flex items-start gap-2">
          <pre className="min-w-0 flex-1 overflow-x-auto bg-foreground p-3 font-mono text-[11px] leading-relaxed text-background">
            {cli}
          </pre>
          <Button
            aria-label={`Copy install command for ${entry.title}`}
            size="sm"
            type="button"
            variant="outline"
            onClick={copyCli}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          nativeButton={false}
          render={<Link href={`/docs/installation?material=${entry.slug}`} />}
          size="sm"
        >
          Installation docs
        </Button>
        <Button
          nativeButton={false}
          render={<Link href={`/materials/${entry.slug}`} />}
          size="sm"
          variant="outline"
        >
          Open material
        </Button>
      </div>
    </div>
  );
}

export function FreeFunnelPage({
  materials,
}: {
  materials: MaterialCatalogEntry[];
}) {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <p className="font-mono text-[11px] text-muted-foreground">
              {materials.length} free{" "}
              {materials.length === 1 ? "material" : "materials"}
            </p>
          }
          description="Same craft bar as paid — CLI or copy-paste, no account required. Install under 60 seconds and evaluate in your own build."
          eyebrow="Free"
          title="Start with free materials"
        >
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              nativeButton={false}
              render={<Link href="/docs/installation" />}
              size="lg"
            >
              Installation guide
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/materials?tier=free" />}
              size="lg"
              variant="outline"
            >
              Browse in catalog
            </Button>
          </div>
        </MarketingPageHeader>

        <MarketingRuledGrid>
          {materials.map((entry) => (
            <MarketingRuledCell
              key={entry.slug}
              className="p-0 sm:p-0 lg:p-0"
            >
              <div className={cn("group block")}>
                <Link
                  className="block transition-colors hover:bg-muted/40"
                  href={`/materials/${entry.slug}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
                    <MaterialPreview entry={entry} />
                  </div>
                </Link>
                <FreeMaterialInstall entry={entry} />
              </div>
            </MarketingRuledCell>
          ))}
        </MarketingRuledGrid>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
