"use client";

import {
  AuroraMesh,
  CellVoronoi,
  EmberWarp,
  GrainField,
  HalftoneSignal,
  HaloRays,
  InkDither,
  InkMetaballs,
  InkSwirl,
  LiquidChrome,
  NeuroVeil,
  OrbitDots,
  PanelGlass,
  PerlinMoss,
  PulseFrame,
  SignalDots,
  SimplexField,
  SmokeRing,
  SpiralInk,
  TideWave,
  getMaterial,
} from "@/materials";
import { cn } from "@/lib/utils";

export function WireframeMaterialPreview({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const entry = getMaterial(slug);
  const common = cn("absolute inset-0 h-full w-full", className);

  switch (slug) {
    case "aurora-mesh":
      return <AuroraMesh className={common} />;
    case "ink-dither":
      return <InkDither className={common} />;
    case "grain-field":
      return <GrainField className={common} />;
    case "neuro-veil":
      return <NeuroVeil className={common} />;
    case "tide-wave":
      return <TideWave className={common} />;
    case "cell-voronoi":
      return <CellVoronoi className={common} />;
    case "ink-swirl":
      return <InkSwirl className={common} />;
    case "signal-dots":
      return <SignalDots className={common} />;
    case "ember-warp":
      return <EmberWarp className={common} />;
    case "halo-rays":
      return <HaloRays className={common} />;
    case "ink-metaballs":
      return <InkMetaballs className={common} />;
    case "smoke-ring":
      return <SmokeRing className={common} />;
    case "simplex-field":
      return <SimplexField className={common} />;
    case "halftone-signal":
      return <HalftoneSignal className={common} />;
    case "liquid-chrome":
      return <LiquidChrome className={common} />;
    case "panel-glass":
      return <PanelGlass className={common} />;
    case "orbit-dots":
      return <OrbitDots className={common} />;
    case "spiral-ink":
      return <SpiralInk className={common} />;
    case "perlin-moss":
      return <PerlinMoss className={common} />;
    case "pulse-frame":
      return <PulseFrame className={common} />;
    default:
      return (
        <div
          className={common}
          style={{
            backgroundImage: `linear-gradient(135deg, ${(entry?.fallbackColors ?? ["#E6E8EC", "#0B0D12"]).join(", ")})`,
          }}
        />
      );
  }
}
