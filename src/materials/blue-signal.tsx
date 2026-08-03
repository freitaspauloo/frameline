"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type BlueSignalProps = MaterialSurfaceProps & {
  colorFront?: string;
  colorBack?: string;
  colorMid?: string;
  angle?: number;
  opacity?: number;
  speed?: number;
  forceStatic?: boolean;
};

/**
 * Diagonal brand-blue CSS wash — CSS-only, no WebGL.
 */
export function BlueSignal({
  className,
  style,
  colorFront = "#2D6BFF",
  colorMid = "#5B8CFF",
  colorBack = "#E8F0FF",
  angle = 135,
  opacity = 1,
  speed = 0.6,
  forceStatic = false,
}: BlueSignalProps) {
  const duration = Math.max(0.01, 12 / Math.max(speed, 0.05));

  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorMid, colorFront]}
      forceStatic={forceStatic}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          opacity,
          backgroundImage: `linear-gradient(${angle}deg, ${colorBack} 0%, ${colorMid} 45%, ${colorFront} 100%)`,
          backgroundSize: "200% 200%",
          animation: `fl-blue-signal ${duration}s ease-in-out infinite`,
        }}
      />
    </MaterialShell>
  );
}
