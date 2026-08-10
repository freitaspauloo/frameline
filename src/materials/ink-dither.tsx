"use client";

import { Dithering } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type InkDitherProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorFront?: string;
  speed?: number;
  size?: number;
  forceStatic?: boolean;
};

/**
 * High-contrast ink dither — sections, empty states, brand moments.
 */
export function InkDither({
  className,
  style,
  colorBack = "#FFFFFF",
  colorFront = "#2D6BFF",
  speed = 0.35,
  size = 3,
  forceStatic = false,
}: InkDitherProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorFront]}
      forceStatic={forceStatic}
      style={style}
    >
      <Dithering
        colorBack={colorBack}
        colorFront={colorFront}
        size={size}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
