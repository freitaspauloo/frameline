import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Consistent inset from the vertical rails — use everywhere. */
export const marketingPadX = "px-6 sm:px-8 lg:px-10";
export const marketingPad = "p-6 sm:p-8 lg:p-10";

const CROSS_SIZE = "size-[5px]";

/**
 * Tiny squares centered on vertical-rail × horizontal-rule intersections.
 * Parent must be `relative`, unpadded, and span the rail width (`max-w-7xl`).
 *
 * Markers sit in a short overflow band that straddles the hairline so they
 * are not clipped by section edges or paint containment.
 */
export function MarketingRailCross({
  edge = "top",
  className,
}: {
  edge?: "top" | "bottom";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-30 h-[11px] overflow-visible",
        edge === "top" ? "-top-[5px]" : "-bottom-[5px]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-border",
          CROSS_SIZE,
        )}
      />
      <span
        className={cn(
          "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-border",
          CROSS_SIZE,
        )}
      />
    </div>
  );
}

/**
 * Continuous thin vertical rails at the marketing content edges —
 * the “delimiting lines” pattern used across Frameline.
 */
export function MarketingShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-visible bg-background text-foreground",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-full max-w-7xl -translate-x-1/2"
      >
        <div className="h-full border-x border-border" />
      </div>
      <div className="relative z-0 overflow-visible">{children}</div>
    </div>
  );
}

/** Section band that snaps to the rails with a top hairline. */
export function MarketingSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      className={cn(
        /* Single top hairline — previous blocks never paint a bottom on the same edge */
        /* No content-visibility: it applies paint containment and clips rail crosses */
        "overflow-visible border-t border-border",
        className,
      )}
      id={id}
    >
      <div className="relative mx-auto max-w-7xl overflow-visible">
        <MarketingRailCross edge="top" />
        {children}
      </div>
    </section>
  );
}

/** Header block inside a section — bottom rule separates intro from body. */
export function MarketingSectionHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-visible border-b border-border",
        className,
      )}
    >
      <MarketingRailCross edge="bottom" />
      <div className={cn("py-12 lg:py-16", marketingPadX)}>{children}</div>
    </div>
  );
}

/**
 * Ruled grid — internal hairlines only.
 * Outer left/right come from the shell rails; bottom comes from the next section’s border-t.
 */
export function MarketingRuledGrid({
  children,
  className,
  cols = 3,
}: {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        cols === 2
          ? [
              "sm:grid-cols-2",
              /* no right border on the last column (rail is the outer edge) */
              "sm:[&>*:nth-child(2n)]:border-r-0",
              /* no bottom border on the last row (next section draws the line) */
              "[&>*:last-child]:border-b-0",
              "sm:[&>*:nth-last-child(-n+2)]:border-b-0",
            ]
          : [
              "sm:grid-cols-3",
              "sm:[&>*:nth-child(3n)]:border-r-0",
              "[&>*:last-child]:border-b-0",
              "sm:[&>*:nth-last-child(-n+3)]:border-b-0",
            ],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MarketingRuledCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        /* Internal separators only — outer edges are the shell rails */
        "border-b border-border sm:border-r",
        marketingPad,
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Mid-column cross markers for MarketingSplit hairline intersections. */
function MarketingSplitCross({ edge }: { edge: "top" | "bottom" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-1/2 z-30 hidden size-[5px] -translate-x-1/2 bg-border lg:block",
        edge === "top"
          ? "top-0 -translate-y-1/2"
          : "bottom-0 translate-y-1/2",
      )}
    />
  );
}

/** Two-column split with a vertical delimiter (reference layout). */
export function MarketingSplit({
  left,
  right,
  className,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        /* Bottom edge comes from the next section’s border-t */
        "relative grid overflow-visible lg:grid-cols-2 lg:divide-x lg:divide-border",
        className,
      )}
    >
      <MarketingSplitCross edge="top" />
      <MarketingSplitCross edge="bottom" />
      <div
        className={cn(
          "border-b border-border lg:border-b-0",
          marketingPad,
        )}
      >
        {left}
      </div>
      <div className={marketingPad}>{right}</div>
    </div>
  );
}

/** Padded content block that sits flush to the rails with consistent inset. */
export function MarketingPad({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(marketingPadX, className)}>{children}</div>;
}
