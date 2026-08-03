"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type SeraWashProps = MaterialSurfaceProps & {
  colors?: string[];
  angle?: number;
  opacity?: number;
  speed?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#F7F5F0", "#E8F0FF", "#D4C4A8", "#C5F0FF", "#F4F1EA"];

/**
 * Soft multi-stop CSS gradient wash — CSS-only, no WebGL.
 */
export function SeraWash({
  className,
  style,
  colors = DEFAULT_COLORS,
  angle = 125,
  opacity = 1,
  speed = 1,
  forceStatic = false,
}: SeraWashProps) {
  const duration = Math.max(0.01, 14 / Math.max(speed, 0.05));

  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          opacity,
          backgroundImage: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
          backgroundSize: "220% 220%",
          animation: `fl-sera-wash ${duration}s ease-in-out infinite`,
        }}
      />
    </MaterialShell>
  );
}
