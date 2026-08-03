"use client";

import { Dithering } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type InkDitherSoftProps = MaterialSurfaceProps & {
  colorBack?: string;
  colorFront?: string;
  speed?: number;
  size?: number;
  forceStatic?: boolean;
};

/**
 * Soft ink dither — low-contrast dither for cards and empty states.
 */
export function InkDitherSoft({
  className,
  style,
  colorBack = "#E8E4DC",
  colorFront = "#6B7A99",
  speed = 0.2,
  size = 4.5,
  forceStatic = false,
}: InkDitherSoftProps) {
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
