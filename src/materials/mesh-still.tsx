"use client";

import { StaticMeshGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type MeshStillProps = MaterialSurfaceProps & {
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

const DEFAULT_COLORS = ["#013B65", "#03738C", "#A3D3FF", "#F2FAEF"];

/**
 * Mesh still — quiet static mesh for heroes and sectional bands.
 */
export function MeshStill({
  className,
  style,
  colors = DEFAULT_COLORS,
  positions = 4,
  waveX = 0.5,
  waveXShift = 0.15,
  waveY = 0.9,
  waveYShift = 0.55,
  mixing = 0.55,
  grainMixer = 0,
  grainOverlay = 0.05,
  rotation = 0,
  forceStatic = false,
}: MeshStillProps) {
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
