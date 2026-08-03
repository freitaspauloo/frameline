"use client";

import * as React from "react";

import { AuroraDusk } from "./aurora-dusk";
import { AuroraMesh } from "./aurora-mesh";
import { BlueSignal } from "./blue-signal";
import { CellVoronoi } from "./cell-voronoi";
import { CmykHalftone } from "./cmyk-halftone";
import {
  COMPONENT_NAMES,
  getMaterialComponentName,
} from "./component-names";
import { DuskVeil } from "./dusk-veil";
import { EmberWarp } from "./ember-warp";
import { FogLayer } from "./fog-layer";
import { GemHaze } from "./gem-haze";
import { GlowRim } from "./glow-rim";
import { GrainField } from "./grain-field";
import { GrainNight } from "./grain-night";
import { GridGhost } from "./grid-ghost";
import { HalftoneSignal } from "./halftone-signal";
import { HaloRays } from "./halo-rays";
import { InkDither } from "./ink-dither";
import { InkDitherSoft } from "./ink-dither-soft";
import { InkMetaballs } from "./ink-metaballs";
import { InkSwirl } from "./ink-swirl";
import { LiquidChrome } from "./liquid-chrome";
import { MeshStill } from "./mesh-still";
import { NeuroVeil } from "./neuro-veil";
import { OrbitDots } from "./orbit-dots";
import { PanelGlass } from "./panel-glass";
import { PaperTooth } from "./paper-tooth";
import { PerlinMoss } from "./perlin-moss";
import { PulseFrame } from "./pulse-frame";
import { RadialStill } from "./radial-still";
import { SeraWash } from "./sera-wash";
import { SignalDots } from "./signal-dots";
import { SimplexField } from "./simplex-field";
import { SmokeRing } from "./smoke-ring";
import { SpiralInk } from "./spiral-ink";
import { StillMesh } from "./still-mesh";
import { StoneBand } from "./stone-band";
import { StripeQuiet } from "./stripe-quiet";
import { TideWave } from "./tide-wave";
import { VoronoiSoft } from "./voronoi-soft";
import { WaterSheet } from "./water-sheet";
import { WaveRibbon } from "./wave-ribbon";

export type MaterialRenderProps = {
  className?: string;
  forceStatic?: boolean;
  props: Record<string, unknown>;
};

export { COMPONENT_NAMES, getMaterialComponentName };

export function renderMaterial(
  slug: string,
  opts: MaterialRenderProps,
): React.ReactNode {
  const { className, forceStatic = false, props } = opts;

  switch (slug) {
    case "aurora-mesh":
      return (
        <AuroraMesh
          className={className}
          colors={props.colors as string[] | undefined}
          distortion={props.distortion as number | undefined}
          forceStatic={forceStatic}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
          swirl={props.swirl as number | undefined}
        />
      );
    case "ink-dither":
      return (
        <InkDither
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          forceStatic={forceStatic}
          size={props.size as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "grain-field":
      return (
        <GrainField
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          intensity={props.intensity as number | undefined}
          noise={props.noise as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "neuro-veil":
      return (
        <NeuroVeil
          brightness={props.brightness as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          colorMid={props.colorMid as string | undefined}
          contrast={props.contrast as number | undefined}
          forceStatic={forceStatic}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "tide-wave":
      return (
        <TideWave
          amplitude={props.amplitude as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          forceStatic={forceStatic}
          frequency={props.frequency as number | undefined}
          proportion={props.proportion as number | undefined}
          scale={props.scale as number | undefined}
          shape={props.shape as number | undefined}
          softness={props.softness as number | undefined}
          spacing={props.spacing as number | undefined}
        />
      );
    case "cell-voronoi":
      return (
        <CellVoronoi
          className={className}
          colorGap={props.colorGap as string | undefined}
          colorGlow={props.colorGlow as string | undefined}
          colors={props.colors as string[] | undefined}
          distortion={props.distortion as number | undefined}
          forceStatic={forceStatic}
          gap={props.gap as number | undefined}
          glow={props.glow as number | undefined}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "ink-swirl":
      return (
        <InkSwirl
          bandCount={props.bandCount as number | undefined}
          center={props.center as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          noise={props.noise as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
          twist={props.twist as number | undefined}
        />
      );
    case "signal-dots":
      return (
        <SignalDots
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFill={props.colorFill as string | undefined}
          colorStroke={props.colorStroke as string | undefined}
          forceStatic={forceStatic}
          gapX={props.gapX as number | undefined}
          gapY={props.gapY as number | undefined}
          opacityRange={props.opacityRange as number | undefined}
          size={props.size as number | undefined}
          sizeRange={props.sizeRange as number | undefined}
        />
      );
    case "ember-warp":
      return (
        <EmberWarp
          className={className}
          colors={props.colors as string[] | undefined}
          distortion={props.distortion as number | undefined}
          forceStatic={forceStatic}
          proportion={props.proportion as number | undefined}
          shapeScale={props.shapeScale as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
          swirl={props.swirl as number | undefined}
        />
      );
    case "halo-rays":
      return (
        <HaloRays
          bloom={props.bloom as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorBloom={props.colorBloom as string | undefined}
          colors={props.colors as string[] | undefined}
          density={props.density as number | undefined}
          forceStatic={forceStatic}
          intensity={props.intensity as number | undefined}
          midIntensity={props.midIntensity as number | undefined}
          midSize={props.midSize as number | undefined}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
          spotty={props.spotty as number | undefined}
        />
      );
    case "ink-metaballs":
      return (
        <InkMetaballs
          className={className}
          colorBack={props.colorBack as string | undefined}
          colors={props.colors as string[] | undefined}
          count={props.count as number | undefined}
          forceStatic={forceStatic}
          scale={props.scale as number | undefined}
          size={props.size as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "smoke-ring":
      return (
        <SmokeRing
          className={className}
          colorBack={props.colorBack as string | undefined}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          innerShape={props.innerShape as number | undefined}
          noiseIterations={props.noiseIterations as number | undefined}
          noiseScale={props.noiseScale as number | undefined}
          radius={props.radius as number | undefined}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
          thickness={props.thickness as number | undefined}
        />
      );
    case "simplex-field":
      return (
        <SimplexField
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          scale={props.scale as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
          stepsPerColor={props.stepsPerColor as number | undefined}
        />
      );
    case "halftone-signal":
      return (
        <HalftoneSignal
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          contrast={props.contrast as number | undefined}
          forceStatic={forceStatic}
          grainMixer={props.grainMixer as number | undefined}
          grainOverlay={props.grainOverlay as number | undefined}
          radius={props.radius as number | undefined}
          size={props.size as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "liquid-chrome":
      return (
        <LiquidChrome
          angle={props.angle as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorTint={props.colorTint as string | undefined}
          contour={props.contour as number | undefined}
          distortion={props.distortion as number | undefined}
          forceStatic={forceStatic}
          repetition={props.repetition as number | undefined}
          scale={props.scale as number | undefined}
          shiftBlue={props.shiftBlue as number | undefined}
          shiftRed={props.shiftRed as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "panel-glass":
      return (
        <PanelGlass
          angle1={props.angle1 as number | undefined}
          angle2={props.angle2 as number | undefined}
          blur={props.blur as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colors={props.colors as string[] | undefined}
          density={props.density as number | undefined}
          fadeIn={props.fadeIn as number | undefined}
          fadeOut={props.fadeOut as number | undefined}
          forceStatic={forceStatic}
          gradient={props.gradient as number | undefined}
          length={props.length as number | undefined}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "orbit-dots":
      return (
        <OrbitDots
          className={className}
          colorBack={props.colorBack as string | undefined}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          scale={props.scale as number | undefined}
          size={props.size as number | undefined}
          sizeRange={props.sizeRange as number | undefined}
          speed={props.speed as number | undefined}
          spreading={props.spreading as number | undefined}
          stepsPerColor={props.stepsPerColor as number | undefined}
        />
      );
    case "spiral-ink":
      return (
        <SpiralInk
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          density={props.density as number | undefined}
          distortion={props.distortion as number | undefined}
          forceStatic={forceStatic}
          noise={props.noise as number | undefined}
          noiseFrequency={props.noiseFrequency as number | undefined}
          scale={props.scale as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
          strokeCap={props.strokeCap as number | undefined}
          strokeTaper={props.strokeTaper as number | undefined}
          strokeWidth={props.strokeWidth as number | undefined}
        />
      );
    case "perlin-moss":
      return (
        <PerlinMoss
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          forceStatic={forceStatic}
          lacunarity={props.lacunarity as number | undefined}
          octaveCount={props.octaveCount as number | undefined}
          persistence={props.persistence as number | undefined}
          proportion={props.proportion as number | undefined}
          scale={props.scale as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "pulse-frame":
      return (
        <PulseFrame
          bloom={props.bloom as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          intensity={props.intensity as number | undefined}
          pulse={props.pulse as number | undefined}
          roundness={props.roundness as number | undefined}
          scale={props.scale as number | undefined}
          smoke={props.smoke as number | undefined}
          smokeSize={props.smokeSize as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
          spotSize={props.spotSize as number | undefined}
          spots={props.spots as number | undefined}
          thickness={props.thickness as number | undefined}
        />
      );
    case "water-sheet":
      return (
        <WaterSheet
          caustic={props.caustic as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorHighlight={props.colorHighlight as string | undefined}
          edges={props.edges as number | undefined}
          forceStatic={forceStatic}
          highlights={props.highlights as number | undefined}
          layering={props.layering as number | undefined}
          scale={props.scale as number | undefined}
          size={props.size as number | undefined}
          speed={props.speed as number | undefined}
          waves={props.waves as number | undefined}
        />
      );
    case "still-mesh":
      return (
        <StillMesh
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          grainMixer={props.grainMixer as number | undefined}
          grainOverlay={props.grainOverlay as number | undefined}
          mixing={props.mixing as number | undefined}
          positions={props.positions as number | undefined}
          rotation={props.rotation as number | undefined}
          waveX={props.waveX as number | undefined}
          waveXShift={props.waveXShift as number | undefined}
          waveY={props.waveY as number | undefined}
          waveYShift={props.waveYShift as number | undefined}
        />
      );
    case "paper-tooth":
      return (
        <PaperTooth
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          contrast={props.contrast as number | undefined}
          crumpleSize={props.crumpleSize as number | undefined}
          crumples={props.crumples as number | undefined}
          drops={props.drops as number | undefined}
          fade={props.fade as number | undefined}
          fiber={props.fiber as number | undefined}
          fiberSize={props.fiberSize as number | undefined}
          foldCount={props.foldCount as number | undefined}
          folds={props.folds as number | undefined}
          forceStatic={forceStatic}
          roughness={props.roughness as number | undefined}
          scale={props.scale as number | undefined}
          seed={props.seed as number | undefined}
        />
      );
    case "gem-haze":
      return (
        <GemHaze
          angle={props.angle as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorInner={props.colorInner as string | undefined}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          innerDistortion={props.innerDistortion as number | undefined}
          innerGlow={props.innerGlow as number | undefined}
          offset={props.offset as number | undefined}
          outerDistortion={props.outerDistortion as number | undefined}
          outerGlow={props.outerGlow as number | undefined}
          scale={props.scale as number | undefined}
          size={props.size as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "cmyk-halftone":
      return (
        <CmykHalftone
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorC={props.colorC as string | undefined}
          colorK={props.colorK as string | undefined}
          colorM={props.colorM as string | undefined}
          colorY={props.colorY as string | undefined}
          contrast={props.contrast as number | undefined}
          floodC={props.floodC as number | undefined}
          floodK={props.floodK as number | undefined}
          floodM={props.floodM as number | undefined}
          floodY={props.floodY as number | undefined}
          forceStatic={forceStatic}
          gainC={props.gainC as number | undefined}
          gainK={props.gainK as number | undefined}
          gainM={props.gainM as number | undefined}
          gainY={props.gainY as number | undefined}
          grainMixer={props.grainMixer as number | undefined}
          grainOverlay={props.grainOverlay as number | undefined}
          grainSize={props.grainSize as number | undefined}
          gridNoise={props.gridNoise as number | undefined}
          scale={props.scale as number | undefined}
          size={props.size as number | undefined}
          softness={props.softness as number | undefined}
        />
      );
    case "radial-still":
      return (
        <RadialStill
          className={className}
          colorBack={props.colorBack as string | undefined}
          colors={props.colors as string[] | undefined}
          distortion={props.distortion as number | undefined}
          distortionFreq={props.distortionFreq as number | undefined}
          distortionShift={props.distortionShift as number | undefined}
          falloff={props.falloff as number | undefined}
          focalAngle={props.focalAngle as number | undefined}
          focalDistance={props.focalDistance as number | undefined}
          forceStatic={forceStatic}
          grainMixer={props.grainMixer as number | undefined}
          grainOverlay={props.grainOverlay as number | undefined}
          mixing={props.mixing as number | undefined}
          radius={props.radius as number | undefined}
          scale={props.scale as number | undefined}
        />
      );
    case "mesh-still":
      return (
        <MeshStill
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          grainMixer={props.grainMixer as number | undefined}
          grainOverlay={props.grainOverlay as number | undefined}
          mixing={props.mixing as number | undefined}
          positions={props.positions as number | undefined}
          rotation={props.rotation as number | undefined}
          waveX={props.waveX as number | undefined}
          waveXShift={props.waveXShift as number | undefined}
          waveY={props.waveY as number | undefined}
          waveYShift={props.waveYShift as number | undefined}
        />
      );
    case "aurora-dusk":
      return (
        <AuroraDusk
          className={className}
          colors={props.colors as string[] | undefined}
          distortion={props.distortion as number | undefined}
          forceStatic={forceStatic}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
          swirl={props.swirl as number | undefined}
        />
      );
    case "ink-dither-soft":
      return (
        <InkDitherSoft
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          forceStatic={forceStatic}
          size={props.size as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "grain-night":
      return (
        <GrainNight
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          intensity={props.intensity as number | undefined}
          noise={props.noise as number | undefined}
          softness={props.softness as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "wave-ribbon":
      return (
        <WaveRibbon
          amplitude={props.amplitude as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          forceStatic={forceStatic}
          frequency={props.frequency as number | undefined}
          proportion={props.proportion as number | undefined}
          scale={props.scale as number | undefined}
          shape={props.shape as number | undefined}
          softness={props.softness as number | undefined}
          spacing={props.spacing as number | undefined}
        />
      );
    case "voronoi-soft":
      return (
        <VoronoiSoft
          className={className}
          colorGap={props.colorGap as string | undefined}
          colorGlow={props.colorGlow as string | undefined}
          colors={props.colors as string[] | undefined}
          distortion={props.distortion as number | undefined}
          forceStatic={forceStatic}
          gap={props.gap as number | undefined}
          glow={props.glow as number | undefined}
          scale={props.scale as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "sera-wash":
      return (
        <SeraWash
          angle={props.angle as number | undefined}
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "stone-band":
      return (
        <StoneBand
          bandCount={props.bandCount as number | undefined}
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "blue-signal":
      return (
        <BlueSignal
          angle={props.angle as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorFront={props.colorFront as string | undefined}
          colorMid={props.colorMid as string | undefined}
          forceStatic={forceStatic}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "dusk-veil":
      return (
        <DuskVeil
          angle={props.angle as number | undefined}
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "grid-ghost":
      return (
        <GridGhost
          cellSize={props.cellSize as number | undefined}
          className={className}
          colorBack={props.colorBack as string | undefined}
          colorLine={props.colorLine as string | undefined}
          forceStatic={forceStatic}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "stripe-quiet":
      return (
        <StripeQuiet
          angle={props.angle as number | undefined}
          className={className}
          colorA={props.colorA as string | undefined}
          colorB={props.colorB as string | undefined}
          forceStatic={forceStatic}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
          stripeWidth={props.stripeWidth as number | undefined}
        />
      );
    case "glow-rim":
      return (
        <GlowRim
          className={className}
          colorCore={props.colorCore as string | undefined}
          colorRim={props.colorRim as string | undefined}
          forceStatic={forceStatic}
          intensity={props.intensity as number | undefined}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    case "fog-layer":
      return (
        <FogLayer
          className={className}
          colors={props.colors as string[] | undefined}
          forceStatic={forceStatic}
          opacity={props.opacity as number | undefined}
          speed={props.speed as number | undefined}
        />
      );
    default:
      return null;
  }
}
