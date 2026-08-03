"use client";

import { Voronoi } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type CellVoronoiProps = MaterialSurfaceProps & {
  colors?: string[];
  colorGap?: string;
  colorGlow?: string;
  speed?: number;
  scale?: number;
  distortion?: number;
  gap?: number;
  glow?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#F4F1EA", "#C8BBA8", "#2D6BFF"];

/**
 * Cell voronoi mesh — heroes, empty states, sectional fields.
 */
export function CellVoronoi({
  className,
  style,
  colors = DEFAULT_COLORS,
  colorGap = "#0A0A0A",
  colorGlow = "#FFFFFF",
  speed = 0.4,
  scale = 0.55,
  distortion = 0.35,
  gap = 0.03,
  glow = 0.15,
  forceStatic = false,
}: CellVoronoiProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[...colors, colorGap]}
      forceStatic={forceStatic}
      style={style}
    >
      <Voronoi
        colorGap={colorGap}
        colorGlow={colorGlow}
        colors={colors}
        distortion={distortion}
        gap={gap}
        glow={glow}
        scale={scale}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
