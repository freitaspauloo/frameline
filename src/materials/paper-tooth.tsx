"use client";

import { PaperTexture } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

import { MaterialShell } from "./material-shell";
import type { MaterialSurfaceProps } from "./types";

export type PaperToothProps = MaterialSurfaceProps & {
  colorFront?: string;
  colorBack?: string;
  contrast?: number;
  roughness?: number;
  fiber?: number;
  fiberSize?: number;
  crumples?: number;
  crumpleSize?: number;
  folds?: number;
  foldCount?: number;
  fade?: number;
  drops?: number;
  seed?: number;
  scale?: number;
  forceStatic?: boolean;
};

/**
 * Paper tooth grain — cards, auth shells, and quiet sectional texture.
 */
export function PaperTooth({
  className,
  style,
  colorFront = "#C8BBA8",
  colorBack = "#F7F5F0",
  contrast = 0.35,
  roughness = 0.45,
  fiber = 0.35,
  fiberSize = 0.22,
  crumples = 0.25,
  crumpleSize = 0.4,
  folds = 0.4,
  foldCount = 4,
  fade = 0.1,
  drops = 0.15,
  seed = 7.2,
  scale = 0.65,
  forceStatic = false,
}: PaperToothProps) {
  return (
    <MaterialShell
      className={cn("h-full w-full", className)}
      fallbackColors={[colorBack, colorFront]}
      forceStatic={forceStatic}
      style={style}
    >
      <PaperTexture
        colorBack={colorBack}
        colorFront={colorFront}
        contrast={contrast}
        crumpleSize={crumpleSize}
        crumples={crumples}
        drops={drops}
        fade={fade}
        fiber={fiber}
        fiberSize={fiberSize}
        foldCount={foldCount}
        folds={folds}
        roughness={roughness}
        scale={scale}
        seed={seed}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      />
    </MaterialShell>
  );
}
