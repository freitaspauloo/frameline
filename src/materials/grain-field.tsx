"use client";

import { GrainGradient } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type GrainFieldProps = MaterialSurfaceProps & {
  colors?: string[];
  speed?: number;
  softness?: number;
  intensity?: number;
  noise?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#F4F1EA", "#D4C4A8", "#2D6BFF", "#0A0A0A"];

/**
 * Soft grain field — cards, auth shells, quiet backgrounds.
 */
export function GrainField({
  className,
  style,
  colors = DEFAULT_COLORS,
  speed = 0.4,
  softness = 0.65,
  intensity = 0.45,
  noise = 0.35,
  forceStatic = false,
}: GrainFieldProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={colors}
      forceStatic={forceStatic}
      style={style}
    >
      <GrainGradient
        colors={colors}
        intensity={intensity}
        noise={noise}
        shape="blob"
        softness={softness}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
