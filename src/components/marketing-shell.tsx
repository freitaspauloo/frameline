import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Consistent inset from the vertical rails — use everywhere. */
export const marketingPadX = "px-6 sm:px-8 lg:px-10";
export const marketingPad = "p-6 sm:p-8 lg:p-10";

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
        "relative min-h-dvh bg-background text-foreground",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-full max-w-7xl -translate-x-1/2"
      >
        <div className="h-full border-x border-border" />
      </div>
      <div className="relative z-0">{children}</div>
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
        /* -mt-px collapses against a previous border-b so junctions stay 1px */
        "-mt-px border-t border-border",
        className,
      )}
      id={id}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
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
        "border-b border-border py-12 lg:py-16",
        marketingPadX,
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Ruled grid — thin 1px borders around every cell (blueprint / table feel).
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
        /* Top edge comes from section border-t or header border-b — no extra border-t */
        "grid border-l border-border",
        cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3",
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
        "border-r border-b border-border",
        marketingPad,
        className,
      )}
    >
      {children}
    </div>
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
        "grid lg:grid-cols-2 lg:divide-x lg:divide-border",
        className,
      )}
    >
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
