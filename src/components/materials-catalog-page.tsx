"use client";

import * as React from "react";
import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
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
    <div className="min-h-dvh bg-relay-white text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-10 lg:px-8">
        <header className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-relay-secondary">
            Materials · v0
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Surface as code
          </h1>
          <p className="mt-4 text-base leading-relaxed text-relay-secondary sm:text-lg">
            Production-ready materials you can install. Live preview below —
            open any material to tune props and copy JSX.
          </p>
        </header>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIALS_CATALOG.map((entry) => (
            <li key={entry.slug}>
              <Link
                className={cn(
                  "group block overflow-hidden rounded-relay-lg border border-relay-border bg-relay-panel",
                  "transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-relay-sm",
                )}
                href={`/materials/${entry.slug}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-relay-ink">
                  <MaterialPreview entry={entry} />
                </div>
                <div className="space-y-2 border-t border-relay-border px-4 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-medium tracking-tight">
                      {entry.title}
                    </h2>
                    <span
                      className={cn(
                        "font-mono text-[11px] uppercase tracking-wide",
                        entry.tier === "free"
                          ? "text-emerald-700"
                          : "text-relay-blue-deep",
                      )}
                    >
                      {entry.tier === "free" ? "Free" : "Paid"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-relay-secondary">
                    {entry.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
