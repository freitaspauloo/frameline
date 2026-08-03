"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type StoneBandProps = MaterialSurfaceProps & {
  colors?: string[];
  bandCount?: number;
  opacity?: number;
  speed?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#E8E4DC", "#C8BBA8", "#A89880", "#D4C4A8", "#F4F1EA"];

/**
 * Horizontal banded CSS gradient — CSS-only, no WebGL.
 */
export function StoneBand({
  className,
  style,
  colors = DEFAULT_COLORS,
  bandCount = 5,
  opacity = 1,
  speed = 0.4,
  forceStatic = false,
}: StoneBandProps) {
  const stops = colors.slice(0, Math.max(2, Math.round(bandCount)));
  const step = 100 / Math.max(stops.length - 1, 1);
  const gradient = stops
    .map((c, i) => `${c} ${Math.round(i * step)}%`)
    .join(", ");
  const duration = Math.max(0.01, 18 / Math.max(speed, 0.05));

  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={stops}
      forceStatic={forceStatic}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          opacity,
          backgroundImage: `linear-gradient(180deg, ${gradient})`,
          backgroundSize: "100% 160%",
          animation: `fl-stone-shift ${duration}s ease-in-out infinite`,
        }}
      />
    </MaterialShell>
  );
}
