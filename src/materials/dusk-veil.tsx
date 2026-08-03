"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type DuskVeilProps = MaterialSurfaceProps & {
  colors?: string[];
  angle?: number;
  opacity?: number;
  speed?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#0A0A0A", "#1A1210", "#2D4A6B", "#0A0A0ACC"];

/**
 * Dark translucent overlay gradient — CSS-only, no WebGL.
 */
export function DuskVeil({
  className,
  style,
  colors = DEFAULT_COLORS,
  angle = 160,
  opacity = 0.92,
  speed = 0.35,
  forceStatic = false,
}: DuskVeilProps) {
  const duration = Math.max(0.01, 10 / Math.max(speed, 0.05));

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
          backgroundImage: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
          animation: `fl-dusk-veil ${duration}s ease-in-out infinite`,
          opacity,
        }}
      />
    </MaterialShell>
  );
}
