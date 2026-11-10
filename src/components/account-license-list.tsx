"use client";

import Link from "next/link";

import { MaterialPreview } from "@/components/material-preview";
import { Button } from "@/components/ui/button";
import type { MaterialCatalogEntry } from "@/materials";

function LicensePreview({
  entry,
  locked,
}: {
  entry: MaterialCatalogEntry;
  locked?: boolean;
}) {
  return (
    <Link
      className={
        locked
          ? "group/preview relative aspect-[16/10] w-[4.75rem] shrink-0 overflow-hidden rounded border border-border bg-muted opacity-85 grayscale-[35%]"
          : "group/preview relative aspect-[16/10] w-[4.75rem] shrink-0 overflow-hidden rounded border border-border bg-muted"
      }
      href={`/materials/${entry.slug}`}
    >
      <div className="absolute inset-0 transition-transform duration-200 group-hover/preview:scale-105">
        <MaterialPreview entry={entry} />
      </div>
    </Link>
  );
}

export function AccountLicenseList({
  entitled,
  locked,
}: {
  entitled: MaterialCatalogEntry[];
  locked: MaterialCatalogEntry[];
}) {
  return (
    <div className="divide-y divide-border">
      {entitled.map((entry) => (
        <div
          key={entry.slug}
          className="flex flex-wrap items-center gap-3 px-6 py-5 sm:px-8 lg:px-12"
        >
          <LicensePreview entry={entry} />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-sm font-medium tracking-tight">
              {entry.title}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
              {entry.tier} · v0.1.0 · entitled
            </p>
          </div>
          <Button
            className="shrink-0"
            nativeButton={false}
            render={
              <Link href={`/docs/installation?material=${entry.slug}`} />
            }
            size="sm"
            variant="outline"
          >
            Install
          </Button>
        </div>
      ))}

      {locked.map((entry) => (
        <div
          key={entry.slug}
          className="flex flex-wrap items-center gap-3 px-6 py-5 sm:px-8 lg:px-12"
        >
          <LicensePreview entry={entry} locked />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-sm font-medium tracking-tight text-muted-foreground">
              {entry.title}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
              {entry.tier} · locked until purchase
            </p>
          </div>
          <Button
            className="shrink-0"
            nativeButton={false}
            render={<Link href="/materials" />}
            size="sm"
            variant="outline"
          >
            Unlock
          </Button>
        </div>
      ))}
    </div>
  );
}
