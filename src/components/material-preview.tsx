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
  type MaterialCatalogEntry,
} from "@/materials";

export function MaterialPreview({
  entry,
  forceStatic = true,
}: {
  entry: MaterialCatalogEntry;
  forceStatic?: boolean;
}) {
  const common = "absolute inset-0 h-full w-full";

  switch (entry.slug) {
    case "aurora-mesh":
      return <AuroraMesh className={common} forceStatic={forceStatic} />;
    case "ink-dither":
      return <InkDither className={common} forceStatic={forceStatic} />;
    case "grain-field":
      return <GrainField className={common} forceStatic={forceStatic} />;
    case "neuro-veil":
      return <NeuroVeil className={common} forceStatic={forceStatic} />;
    case "tide-wave":
      return <TideWave className={common} forceStatic={forceStatic} />;
    case "cell-voronoi":
      return <CellVoronoi className={common} forceStatic={forceStatic} />;
    case "ink-swirl":
      return <InkSwirl className={common} forceStatic={forceStatic} />;
    case "signal-dots":
      return <SignalDots className={common} forceStatic={forceStatic} />;
    case "ember-warp":
      return <EmberWarp className={common} forceStatic={forceStatic} />;
    case "halo-rays":
      return <HaloRays className={common} forceStatic={forceStatic} />;
    case "ink-metaballs":
      return <InkMetaballs className={common} forceStatic={forceStatic} />;
    case "smoke-ring":
      return <SmokeRing className={common} forceStatic={forceStatic} />;
    case "simplex-field":
      return <SimplexField className={common} forceStatic={forceStatic} />;
    case "halftone-signal":
      return <HalftoneSignal className={common} forceStatic={forceStatic} />;
    case "liquid-chrome":
      return <LiquidChrome className={common} forceStatic={forceStatic} />;
    case "panel-glass":
      return <PanelGlass className={common} forceStatic={forceStatic} />;
    case "orbit-dots":
      return <OrbitDots className={common} forceStatic={forceStatic} />;
    case "spiral-ink":
      return <SpiralInk className={common} forceStatic={forceStatic} />;
    case "perlin-moss":
      return <PerlinMoss className={common} forceStatic={forceStatic} />;
    case "pulse-frame":
      return <PulseFrame className={common} forceStatic={forceStatic} />;
    default:
      return (
        <div
          className={common}
          style={{
            backgroundImage: `linear-gradient(135deg, ${entry.fallbackColors.join(", ")})`,
          }}
        />
      );
  }
}
