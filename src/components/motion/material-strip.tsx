"use client";

import * as React from "react";
import Link from "next/link";

import { useMarqueeLoop } from "@/components/motion/use-marquee-loop";
import { screenPosterNeedsMagentaTint } from "@/screens/poster-tint";
import type { ScreenCatalogEntry } from "@/screens/types";
import { cn } from "@/lib/utils";

/** Minimum tiles per copy — the catalog repeats until the row overruns the rail. */
const MIN_TILES = 6;

function fill(entries: readonly ScreenCatalogEntry[]) {
  if (entries.length === 0) return [];
  const out: ScreenCatalogEntry[] = [];
  while (out.length < MIN_TILES) out.push(entries[out.length % entries.length]);
  return out;
}

function Tile({
  entry,
  index,
  mirrored,
}: {
  entry: ScreenCatalogEntry;
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={entry.poster}
        />
        {screenPosterNeedsMagentaTint(entry.slug) ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-[#d600bf] mix-blend-color"
          />
        ) : null}
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
 * Hero product strip — a paper band of screen stills drifting across the
 * dither. Ruled frames, no shadows; hover parks the row, reduced motion turns
 * it into a plain scrollable shelf.
 */
export function MaterialStrip({
  className,
  entries,
  speed = 34,
}: {
  className?: string;
  entries: readonly ScreenCatalogEntry[];
  speed?: number;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const tiles = React.useMemo(() => fill(entries), [entries]);

  const reduced = useMarqueeLoop({ hostRef, speed, trackRef });

  if (tiles.length === 0) return null;

  return (
    <div className={cn("bg-background/90 backdrop-blur-[2px]", className)}>
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
