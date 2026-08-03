"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type GridGhostProps = MaterialSurfaceProps & {
  colorLine?: string;
  colorBack?: string;
  cellSize?: number;
  opacity?: number;
  speed?: number;
  forceStatic?: boolean;
};

/**
 * CSS repeating linear-gradient grid — CSS-only, no WebGL.
 */
export function GridGhost({
  className,
  style,
  colorLine = "#2D6BFF33",
  colorBack = "#F7F5F0",
  cellSize = 24,
  opacity = 1,
  speed = 0.5,
  forceStatic = false,
}: GridGhostProps) {
  const size = Math.max(4, cellSize);
  const duration = Math.max(0.01, 6 / Math.max(speed, 0.05));

  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorLine]}
      forceStatic={forceStatic}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          opacity,
          backgroundColor: colorBack,
          backgroundImage: [
            `repeating-linear-gradient(0deg, transparent, transparent ${size - 1}px, ${colorLine} ${size - 1}px, ${colorLine} ${size}px)`,
            `repeating-linear-gradient(90deg, transparent, transparent ${size - 1}px, ${colorLine} ${size - 1}px, ${colorLine} ${size}px)`,
          ].join(", "),
          animation: `fl-grid-pulse ${duration}s ease-in-out infinite`,
        }}
      />
    </MaterialShell>
  );
}
