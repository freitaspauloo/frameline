"use client";

import * as React from "react";

import {
  AuroraDusk,
  AuroraMesh,
  BlueSignal,
  CellVoronoi,
  CmykHalftone,
  DuskVeil,
  EmberWarp,
  FogLayer,
  GemHaze,
  GlowRim,
  GrainField,
  GrainNight,
  GridGhost,
  HalftoneSignal,
  HaloRays,
  InkDither,
  InkDitherSoft,
  InkMetaballs,
  InkSwirl,
  LiquidChrome,
  MeshStill,
  NeuroVeil,
  OrbitDots,
  PanelGlass,
  PaperTooth,
  PerlinMoss,
  PulseFrame,
  RadialStill,
  SeraWash,
  SignalDots,
  SimplexField,
  SmokeRing,
  SpiralInk,
  StillMesh,
  StoneBand,
  StripeQuiet,
  TideWave,
  VoronoiSoft,
  WaterSheet,
  WaveRibbon,
  type MaterialCatalogEntry,
} from "@/materials";
import { usePrefersReducedMotion } from "@/materials/hooks";

function PreviewSurface({
  entry,
  forceStatic,
}: {
  entry: MaterialCatalogEntry;
  forceStatic: boolean;
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
    case "water-sheet":
      return <WaterSheet className={common} forceStatic={forceStatic} />;
    case "still-mesh":
      return <StillMesh className={common} forceStatic={forceStatic} />;
    case "paper-tooth":
      return <PaperTooth className={common} forceStatic={forceStatic} />;
    case "gem-haze":
      return <GemHaze className={common} forceStatic={forceStatic} />;
    case "cmyk-halftone":
      return <CmykHalftone className={common} forceStatic={forceStatic} />;
    case "radial-still":
      return <RadialStill className={common} forceStatic={forceStatic} />;
    case "mesh-still":
      return <MeshStill className={common} forceStatic={forceStatic} />;
    case "aurora-dusk":
      return <AuroraDusk className={common} forceStatic={forceStatic} />;
    case "ink-dither-soft":
      return <InkDitherSoft className={common} forceStatic={forceStatic} />;
    case "grain-night":
      return <GrainNight className={common} forceStatic={forceStatic} />;
    case "wave-ribbon":
      return <WaveRibbon className={common} forceStatic={forceStatic} />;
    case "voronoi-soft":
      return <VoronoiSoft className={common} forceStatic={forceStatic} />;
    case "sera-wash":
      return <SeraWash className={common} forceStatic={forceStatic} />;
    case "stone-band":
      return <StoneBand className={common} forceStatic={forceStatic} />;
    case "blue-signal":
      return <BlueSignal className={common} forceStatic={forceStatic} />;
    case "dusk-veil":
      return <DuskVeil className={common} forceStatic={forceStatic} />;
    case "grid-ghost":
      return <GridGhost className={common} forceStatic={forceStatic} />;
    case "stripe-quiet":
      return <StripeQuiet className={common} forceStatic={forceStatic} />;
    case "glow-rim":
      return <GlowRim className={common} forceStatic={forceStatic} />;
    case "fog-layer":
      return <FogLayer className={common} forceStatic={forceStatic} />;
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

/**
 * Catalog / grid preview. Animates only while in the viewport;
 * off-screen and prefers-reduced-motion always use the static shell.
 */
export function MaterialPreview({
  entry,
  forceStatic = false,
}: {
  entry: MaterialCatalogEntry;
  /** When true, always show the static shell (ignores intersection). */
  forceStatic?: boolean;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([obs]) => {
        setInView(obs?.isIntersecting ?? false);
      },
      { rootMargin: "80px 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staticMode =
    forceStatic || prefersReducedMotion || !inView;

  return (
    <div ref={rootRef} className="absolute inset-0 h-full w-full">
      <PreviewSurface entry={entry} forceStatic={staticMode} />
    </div>
  );
}
