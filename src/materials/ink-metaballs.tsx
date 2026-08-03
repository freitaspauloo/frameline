"use client";

import { Metaballs } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type InkMetaballsProps = MaterialSurfaceProps & {
  colors?: string[];
  colorBack?: string;
  count?: number;
  size?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#2D6BFF", "#C8BBA8", "#0A0A0A", "#5B8CFF"];

/**
 * Ink metaballs mesh — heroes, empty states, and loading shells.
 */
export function InkMetaballs({
  className,
  style,
  colors = DEFAULT_COLORS,
  colorBack = "#F4F1EA",
  count = 12,
  size = 0.72,
  speed = 0.55,
  scale = 1.2,
  forceStatic = false,
}: InkMetaballsProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, ...colors]}
      forceStatic={forceStatic}
      style={style}
    >
      <Metaballs
        colorBack={colorBack}
        colors={colors}
        count={count}
        scale={scale}
        size={size}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
