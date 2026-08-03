"use client";

import { Voronoi } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type VoronoiSoftProps = MaterialSurfaceProps & {
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

const DEFAULT_COLORS = ["#F5E6F0", "#D4E8F0", "#E8F0D4"];

/**
 * Soft voronoi — pastel cell field for loading and empty states.
 */
export function VoronoiSoft({
  className,
  style,
  colors = DEFAULT_COLORS,
  colorGap = "#F7F5F0",
  colorGlow = "#FFFFFF",
  speed = 0.25,
  scale = 0.7,
  distortion = 0.2,
  gap = 0.02,
  glow = 0.08,
  forceStatic = false,
}: VoronoiSoftProps) {
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
