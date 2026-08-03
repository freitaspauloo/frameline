"use client";

import { DotGrid } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type SignalDotsProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorFill?: string;
  colorStroke?: string;
  size?: number;
  gapX?: number;
  gapY?: number;
  sizeRange?: number;
  opacityRange?: number;
  forceStatic?: boolean;
};

/**
 * Signal dots dither — loading, empty, and card grids.
 */
export function SignalDots({
  className,
  style,
  colorBack = "#F7F5F0",
  colorFill = "#2D6BFF",
  colorStroke = "#2D6BFF",
  size = 2.5,
  gapX = 28,
  gapY = 28,
  sizeRange = 0,
  opacityRange = 0.15,
  forceStatic = false,
}: SignalDotsProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorFill]}
      forceStatic={forceStatic}
      style={style}
    >
      <DotGrid
        colorBack={colorBack}
        colorFill={colorFill}
        colorStroke={colorStroke}
        gapX={gapX}
        gapY={gapY}
        opacityRange={opacityRange}
        shape="circle"
        size={size}
        sizeRange={sizeRange}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
