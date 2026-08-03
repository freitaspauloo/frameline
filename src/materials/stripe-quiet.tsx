"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type StripeQuietProps = MaterialSurfaceProps & {
  colorA?: string;
  colorB?: string;
  angle?: number;
  stripeWidth?: number;
  opacity?: number;
  speed?: number;
  forceStatic?: boolean;
};

/**
 * Subtle CSS stripes — CSS-only, no WebGL.
 */
export function StripeQuiet({
  className,
  style,
  colorA = "#F4F1EA",
  colorB = "#E8E4DC",
  angle = 45,
  stripeWidth = 12,
  opacity = 1,
  speed = 0.25,
  forceStatic = false,
}: StripeQuietProps) {
  const w = Math.max(2, stripeWidth);
  const duration = Math.max(0.01, 20 / Math.max(speed, 0.05));

  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorA, colorB]}
      forceStatic={forceStatic}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          opacity,
          backgroundImage: `repeating-linear-gradient(${angle}deg, ${colorA}, ${colorA} ${w}px, ${colorB} ${w}px, ${colorB} ${w * 2}px)`,
          backgroundSize: `${w * 4}px ${w * 4}px`,
          animation: `fl-stripe-drift ${duration}s linear infinite`,
        }}
      />
    </MaterialShell>
  );
}
