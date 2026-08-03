"use client";

import { MeshGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type AuroraDuskProps = MaterialSurfaceProps & {
  colors?: string[];
  speed?: number;
  distortion?: number;
  swirl?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#1A1210", "#C45C26", "#E8A05C", "#2D4A6B"];

/**
 * Aurora dusk mesh — warm amber/charcoal hero field.
 */
export function AuroraDusk({
  className,
  style,
  colors = DEFAULT_COLORS,
  speed = 0.32,
  distortion = 0.65,
  swirl = 0.7,
  scale = 0.85,
  forceStatic = false,
}: AuroraDuskProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <MeshGradient
        colors={colors}
        distortion={distortion}
        scale={scale}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        swirl={swirl}
      />
    </MaterialShell>
  );
}
