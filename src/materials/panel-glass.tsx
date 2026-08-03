"use client";

import { ColorPanels } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type PanelGlassProps = MaterialSurfaceProps & {
  colors?: string[];
  colorBack?: string;
  angle1?: number;
  angle2?: number;
  length?: number;
  edges?: boolean;
  blur?: number;
  fadeIn?: number;
  fadeOut?: number;
  density?: number;
  gradient?: number;
  speed?: number;
  scale?: number;
  forceStatic?: boolean;
};

const DEFAULT_COLORS = ["#00CFFF", "#FF2D55", "#34C759", "#AF52DE"];

/**
 * Panel glass mesh — translucent rotating panels for heroes and sections.
 */
export function PanelGlass({
  className,
  style,
  colors = DEFAULT_COLORS,
  colorBack = "#FFFFFF00",
  angle1 = 0.3,
  angle2 = 0.3,
  length = 1,
  edges = true,
  blur = 0.25,
  fadeIn = 0.85,
  fadeOut = 0.3,
  density = 1.6,
  gradient = 0,
  speed = 1,
  scale = 0.9,
  forceStatic = false,
}: PanelGlassProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[...colors, "#E8F0FF"]}
      forceStatic={forceStatic}
      style={style}
    >
      <ColorPanels
        angle1={angle1}
        angle2={angle2}
        blur={blur}
        colorBack={colorBack}
        colors={colors}
        density={density}
        edges={edges}
        fadeIn={fadeIn}
        fadeOut={fadeOut}
        gradient={gradient}
        length={length}
        scale={scale}
        speed={speed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
