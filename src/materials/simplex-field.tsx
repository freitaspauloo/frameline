"use client";

import { SimplexNoise } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type SimplexFieldProps = MaterialSurfaceProps & {
  colors?: string[];
  stepsPerColor?: number;
  softness?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#F4F1EA", "#2D6BFF", "#C8BBA8", "#0A0A0A", "#E8E4DC"];

/**
 * Simplex field grain — cards, sections, and loading shells.
 */
export function SimplexField({
  className,
  style,
  colors = DEFAULT_COLORS,
  stepsPerColor = 2,
  softness = 0.35,
  speed = 0.4,
  scale = 0.7,
  forceStatic = false,
}: SimplexFieldProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <SimplexNoise
        colors={colors}
        scale={scale}
        softness={softness}
        speed={speed}
        stepsPerColor={stepsPerColor}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
