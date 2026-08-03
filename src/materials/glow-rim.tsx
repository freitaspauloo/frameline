"use client";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type GlowRimProps = MaterialSurfaceProps & {
  colorRim?: string;
  colorCore?: string;
  opacity?: number;
  intensity?: number;
  speed?: number;
  forceStatic?: boolean;
};

/**
 * Radial vignette / rim light CSS — CSS-only, no WebGL.
 */
export function GlowRim({
  className,
  style,
  colorRim = "#2D6BFF",
  colorCore = "#0A0A0A",
  opacity = 1,
  intensity = 0.65,
  speed = 0.45,
  forceStatic = false,
}: GlowRimProps) {
  const rimStop = Math.round(40 + intensity * 35);
  const duration = Math.max(0.01, 8 / Math.max(speed, 0.05));

  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorCore, colorRim]}
      forceStatic={forceStatic}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          opacity,
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colorCore} 0%, ${colorCore} ${100 - rimStop}%, ${colorRim} 100%)`,
          animation: `fl-glow-rim ${duration}s ease-in-out infinite`,
          transformOrigin: "center",
        }}
      />
    </MaterialShell>
  );
}
