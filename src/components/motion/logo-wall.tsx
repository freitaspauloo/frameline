"use client";

import * as React from "react";

import { useMarqueeLoop } from "@/components/motion/use-marquee-loop";
import type { ClientLogo } from "@/lib/client-logos";
import { cn } from "@/lib/utils";

/** Minimum tiles per copy — the catalog repeats until the row overruns the rail. */
const MIN_TILES = 6;

function fill(entries: readonly ClientLogo[]) {
  if (entries.length === 0) return [];
  const out: ClientLogo[] = [];
  while (out.length < MIN_TILES) out.push(entries[out.length % entries.length]);
  return out;
}

/**
 * Credits row — monochrome client logos drifting across the hero band.
 *
 * The row drifts slowly enough to read at rest and holds under the pointer.
 * Reduced motion gets the same ruled row, static and scrollable.
 */
export function LogoWall({
  className,
  logos,
  speed = 22,
}: {
  className?: string;
  logos: readonly ClientLogo[];
  speed?: number;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const tiles = React.useMemo(() => fill(logos), [logos]);

  const reduced = useMarqueeLoop({ hostRef, hoverTimeScale: 0.15, speed, trackRef });

  if (tiles.length === 0) return null;

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative",
        reduced ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden",
        className,
      )}
    >
      <div ref={trackRef} className="flex w-max">
        {(reduced ? [false] : [false, true]).map((mirrored) =>
          tiles.map((logo, index) => (
            <span
              key={`${mirrored ? "b" : "a"}-${logo.name}-${index}`}
              aria-hidden={mirrored || undefined}
              className="flex shrink-0 items-center border-r border-border px-6 py-3 sm:px-10 sm:py-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={mirrored ? "" : `${logo.name} logo`}
                className="h-5 w-auto max-w-[7.5rem] object-contain object-center brightness-0 opacity-45 transition-opacity duration-500 hover:opacity-80 sm:h-6 sm:max-w-[8.5rem]"
                src={logo.src}
              />
            </span>
          )),
        )}
      </div>

      {reduced ? null : (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24"
          />
        </>
      )}
    </div>
  );
}
