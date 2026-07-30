"use client";

import * as React from "react";
import Link from "next/link";

import { MaterialPreview } from "@/components/material-preview";
import { marketingPadX } from "@/components/marketing-shell";
import { useMarqueeLoop } from "@/components/motion/use-marquee-loop";
import type { MaterialCatalogEntry } from "@/materials";
import { cn } from "@/lib/utils";

/** Minimum tiles per copy — the catalog repeats until the row overruns the rail. */
const MIN_TILES = 6;

/** Fine halftone laid over each still so tiles read as print, not as cards. */
const HALFTONE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.28) 0.5px, transparent 0.75px)",
  backgroundSize: "4px 4px",
};

function fill(entries: readonly MaterialCatalogEntry[]) {
  if (entries.length === 0) return [];
  const out: MaterialCatalogEntry[] = [];
  while (out.length < MIN_TILES) out.push(entries[out.length % entries.length]);
  return out;
}

function Tile({
  entry,
  index,
  mirrored,
}: {
  entry: MaterialCatalogEntry;
  index: number;
  mirrored: boolean;
}) {
  return (
    <Link
      aria-hidden={mirrored || undefined}
      className="group relative flex w-[13.5rem] shrink-0 flex-col border-r border-border sm:w-[15rem]"
      href={`/materials/${entry.slug}`}
      tabIndex={mirrored ? -1 : undefined}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-foreground">
        <MaterialPreview entry={entry} />
        <span aria-hidden className="absolute inset-0" style={HALFTONE} />
        <span className="absolute inset-0 bg-background opacity-0 transition-opacity duration-500 group-hover:opacity-15" />
      </div>
      <div className="flex items-baseline justify-between gap-3 border-t border-border px-4 py-3">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase transition-colors duration-300 group-hover:text-foreground">
          {entry.title}
        </span>
        <span className="font-mono text-[10px] text-border tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </Link>
  );
}

/**
 * Hero product strip — a paper band of material stills drifting across the
 * dither. Ruled frames, no shadows; hover parks the row, reduced motion turns
 * it into a plain scrollable shelf.
 */
export function MaterialStrip({
  className,
  entries,
  hint = "Auto-scroll · hover to hold",
  label = "In rotation",
  speed = 34,
}: {
  className?: string;
  entries: readonly MaterialCatalogEntry[];
  hint?: string;
  label?: string;
  speed?: number;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const tiles = React.useMemo(() => fill(entries), [entries]);

  const reduced = useMarqueeLoop({ hostRef, speed, trackRef });

  if (tiles.length === 0) return null;

  return (
    <div
      className={cn(
        "border-t border-border bg-background/90 backdrop-blur-[2px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4 border-b border-border py-2.5",
          marketingPadX,
        )}
      >
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        <p className="font-mono text-[10px] tracking-widest text-border uppercase">
          {reduced ? "Swipe to browse" : hint}
        </p>
      </div>

      <div
        ref={hostRef}
        className={cn(
          "relative",
          /* Never let the drifting track widen the document. */
          reduced ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden",
        )}
      >
        <div ref={trackRef} className="flex w-max">
          {(reduced ? [false] : [false, true]).map((mirrored) =>
            tiles.map((entry, index) => (
              <Tile
                key={`${mirrored ? "b" : "a"}-${entry.slug}-${index}`}
                entry={entry}
                index={index}
                mirrored={mirrored}
              />
            )),
          )}
        </div>

        {/* Fades only belong on the drifting row — a scrolled row would drag them along. */}
        {reduced ? null : (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-20"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-20"
            />
          </>
        )}
      </div>
    </div>
  );
}
