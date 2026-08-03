"use client";

import { StaticMeshGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type StillMeshProps = MaterialSurfaceProps & {
  colors?: string[];
  positions?: number;
  waveX?: number;
  waveXShift?: number;
  waveY?: number;
  waveYShift?: number;
  mixing?: number;
  grainMixer?: number;
  grainOverlay?: number;
  rotation?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#FF6B35", "#1A1210", "#2D6BFF", "#F4E8D8"];

/**
 * Still mesh — static multi-point mesh for heroes and empty states.
 * (Heatmap requires a source image; this is the catalog-safe stand-in.)
 */
export function StillMesh({
  className,
  style,
  colors = DEFAULT_COLORS,
  positions = 18,
  waveX = 0.7,
  waveXShift = 0.4,
  waveY = 0.85,
  waveYShift = 0.3,
  mixing = 0.7,
  grainMixer = 0.08,
  grainOverlay = 0.12,
  rotation = 200,
  forceStatic = false,
}: StillMeshProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <StaticMeshGradient
        colors={colors}
        grainMixer={grainMixer}
        grainOverlay={grainOverlay}
        mixing={mixing}
        positions={positions}
        rotation={rotation}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        waveX={waveX}
        waveXShift={waveXShift}
        waveY={waveY}
        waveYShift={waveYShift}
      />
    </MaterialShell>
  );
}
