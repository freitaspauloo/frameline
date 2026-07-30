"use client";

import * as React from "react";

import { useMarqueeLoop } from "@/components/motion/use-marquee-loop";
import { cn } from "@/lib/utils";

/**
 * Credits row — placeholder wordmarks set as type, not logo art.
 *
 * The row drifts slowly enough to read at rest and holds under the pointer.
 * Reduced motion gets the same ruled row, static and scrollable.
 */
export function LogoWall({
  className,
  names,
  speed = 22,
}: {
  className?: string;
  names: readonly string[];
  speed?: number;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const reduced = useMarqueeLoop({ hostRef, hoverTimeScale: 0.15, speed, trackRef });

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
          names.map((name, index) => (
            <span
              key={`${mirrored ? "b" : "a"}-${name}-${index}`}
              aria-hidden={mirrored || undefined}
              className="flex shrink-0 items-center border-r border-border px-8 py-10 font-heading text-base font-medium tracking-[0.14em] text-muted-foreground uppercase opacity-70 transition-opacity duration-500 hover:opacity-100 sm:px-12 sm:py-12 sm:text-lg"
            >
              {name}
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
