"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
} from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import {
  AuroraDusk,
  AuroraMesh,
  CellVoronoi,
  CmykHalftone,
  EmberWarp,
  GemHaze,
  GrainField,
  GrainNight,
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
  SignalDots,
  SimplexField,
  SmokeRing,
  SpiralInk,
  StillMesh,
  TideWave,
  VoronoiSoft,
  WaterSheet,
  WaveRibbon,
  getMaterial,
  getMaterialProps,
  type MaterialCatalogEntry,
  type MaterialPropDef,
} from "@/materials";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  initialParams?: Record<string, string | string[] | undefined>;
};

const ACCENT = "#3A58F0";

const COMPONENT_NAMES: Record<string, string> = {
  "aurora-mesh": "AuroraMesh",
  "ink-dither": "InkDither",
  "grain-field": "GrainField",
  "neuro-veil": "NeuroVeil",
  "tide-wave": "TideWave",
  "cell-voronoi": "CellVoronoi",
  "ink-swirl": "InkSwirl",
  "signal-dots": "SignalDots",
  "ember-warp": "EmberWarp",
  "halo-rays": "HaloRays",
  "ink-metaballs": "InkMetaballs",
  "smoke-ring": "SmokeRing",
  "simplex-field": "SimplexField",
  "halftone-signal": "HalftoneSignal",
  "liquid-chrome": "LiquidChrome",
  "panel-glass": "PanelGlass",
  "orbit-dots": "OrbitDots",
  "spiral-ink": "SpiralInk",
  "perlin-moss": "PerlinMoss",
  "pulse-frame": "PulseFrame",
  "water-sheet": "WaterSheet",
  "still-mesh": "StillMesh",
  "paper-tooth": "PaperTooth",
  "gem-haze": "GemHaze",
  "cmyk-halftone": "CmykHalftone",
  "radial-still": "RadialStill",
  "mesh-still": "MeshStill",
  "aurora-dusk": "AuroraDusk",
  "ink-dither-soft": "InkDitherSoft",
  "grain-night": "GrainNight",
  "wave-ribbon": "WaveRibbon",
  "voronoi-soft": "VoronoiSoft",
};

function buildJsxSnippet(slug: string, props: Record<string, unknown>) {
  const entries = Object.entries(props).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  const propsStr = entries
    .map(([k, v]) => {
      if (typeof v === "number") return `  ${k}={${v}}`;
      if (typeof v === "boolean") return v ? `  ${k}` : null;
      if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
      return `  ${k}=${JSON.stringify(String(v))}`;
    })
    .filter(Boolean)
    .join("\n");

  const name = COMPONENT_NAMES[slug] ?? "GrainField";

  return `import { ${name} } from "@/materials";\n\n<${name}\n${propsStr}\n  className="absolute inset-0"\n/>`;
}

function LivePreview({
  entry,
  forceStatic = false,
  props,
}: {
  entry: MaterialCatalogEntry;
  forceStatic?: boolean;
  props: Record<string, unknown>;
}) {
  const common = "absolute inset-0 h-full w-full";
  switch (entry.slug) {
    case "aurora-mesh":
      return (
        <AuroraMesh
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
          className={common}
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
    default:
      return null;
  }
}

type ControlField = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
};

type ColorField = { key: string; label: string };

type MaterialControls = {
  defaults: Record<string, unknown>;
  fields: ControlField[];
  colors?: ColorField[];
};

function mergePropsFromSearchParams(
  defaults: Record<string, unknown>,
  fields: ControlField[],
  colorFields: ColorField[] | undefined,
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): Record<string, unknown> {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) {
      return params.get(key) ?? undefined;
    }
    const raw = params[key];
    if (Array.isArray(raw)) return raw[0];
    return raw;
  };

  const next = { ...defaults };
  for (const field of fields) {
    const raw = get(field.key);
    if (raw == null || raw === "") continue;
    const n = Number(raw);
    if (!Number.isFinite(n)) continue;
    next[field.key] = Math.min(field.max, Math.max(field.min, n));
  }
  for (const c of colorFields ?? []) {
    const raw = get(c.key);
    if (raw && /^#[0-9A-Fa-f]{6}$/.test(raw)) {
      next[c.key] = raw;
    }
  }
  return next;
}

function propsToSearchParams(
  props: Record<string, unknown>,
  fields: ControlField[],
  colorFields: ColorField[] | undefined,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const field of fields) {
    const v = props[field.key];
    if (typeof v === "number" && Number.isFinite(v)) {
      params.set(field.key, String(v));
    }
  }
  for (const c of colorFields ?? []) {
    const v = props[c.key];
    if (typeof v === "string" && v) {
      params.set(c.key, v);
    }
  }
  return params;
}

function useMaterialControls(slug: string): MaterialControls {
  const defs = getMaterialProps(slug);
  const defaults: Record<string, unknown> = {};
  const fields: ControlField[] = [];
  const colorFields: ColorField[] = [];

  for (const def of defs) {
    defaults[def.key] = def.defaultValue;
    if (def.kind === "number" && def.min != null && def.max != null) {
      fields.push({
        key: def.key,
        label: def.label,
        min: def.min,
        max: def.max,
        step: def.step ?? 0.01,
      });
    } else if (def.kind === "color") {
      colorFields.push({ key: def.key, label: def.label });
    }
  }

  return {
    defaults,
    fields,
    colors: colorFields.length ? colorFields : undefined,
  };
}

function formatPropDefault(value: MaterialPropDef["defaultValue"]): string {
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

/** Small ruled panel used down the configurator column. */
function Panel({
  action,
  children,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className={marketingPad}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function MaterialDetailPage({ slug, initialParams }: Props) {
  const entry = getMaterial(slug);
  if (!entry) notFound();

  const controls = useMaterialControls(slug);
  const [props, setProps] = React.useState(() =>
    mergePropsFromSearchParams(
      controls.defaults,
      controls.fields,
      controls.colors,
      initialParams ?? {},
    ),
  );
  const [copied, setCopied] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const urlSyncReady = React.useRef(false);

  React.useEffect(() => {
    // Allow one frame so initial URL write doesn't fight hydration.
    const id = window.setTimeout(() => {
      urlSyncReady.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  React.useEffect(() => {
    if (!urlSyncReady.current) return;
    const handle = window.setTimeout(() => {
      const params = propsToSearchParams(
        props,
        controls.fields,
        controls.colors,
      );
      const qs = params.toString();
      const next = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;
      const current = `${window.location.pathname}${window.location.search}`;
      if (next !== current) {
        window.history.replaceState(null, "", next);
      }
    }, 200);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on prop values only
  }, [props, slug]);

  const snippet = React.useMemo(
    () => buildJsxSnippet(slug, props),
    [slug, props],
  );

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          action={
            <Button
              nativeButton={false}
              render={<Link href="/materials" />}
              size="sm"
              variant="outline"
            >
              <RiArrowLeftLine data-icon="inline-start" />
              All materials
            </Button>
          }
          description={entry.description}
          eyebrow={`Material · ${entry.type} · ${entry.tier === "free" ? "Free" : "Paid"}`}
          title={entry.title}
        />

        <div className="relative grid overflow-visible lg:grid-cols-[1.15fr_0.85fr] lg:divide-x lg:divide-border">
          <div
            className={cn(
              "border-b border-border lg:border-b-0",
              marketingPad,
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden border border-border bg-foreground">
              <LivePreview
                entry={entry}
                forceStatic={paused}
                props={props}
              />
              <div className="absolute right-3 bottom-3 z-10">
                <Button
                  aria-label={paused ? "Play preview" : "Pause preview"}
                  aria-pressed={paused}
                  size="sm"
                  type="button"
                  variant="outline"
                  className="border-border bg-background/90 text-foreground backdrop-blur-sm hover:bg-background"
                  onClick={() => setPaused((p) => !p)}
                >
                  {paused ? "Play" : "Pause"}
                </Button>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid-cols-3">
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Type
                </dt>
                <dd className="font-mono text-[11px] text-foreground">
                  {entry.type}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Contexts
                </dt>
                <dd className="font-mono text-[11px] text-foreground">
                  {entry.useContexts.join(" · ")}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Tags
                </dt>
                <dd className="font-mono text-[11px] text-foreground">
                  {entry.tags.join(" · ")}
                </dd>
              </div>
              {entry.perfNotes ? (
                <div className="col-span-2 space-y-1.5 sm:col-span-3">
                  <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                    Perf
                  </dt>
                  <dd className="font-mono text-[11px] leading-relaxed text-foreground">
                    {entry.renderingTechnique
                      ? `${entry.renderingTechnique} · ${entry.perfNotes}`
                      : entry.perfNotes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="divide-y divide-border">
            <Panel
              action={
                <Button
                  aria-label={paused ? "Play preview" : "Pause preview"}
                  aria-pressed={paused}
                  size="xs"
                  type="button"
                  variant="outline"
                  onClick={() => setPaused((p) => !p)}
                >
                  {paused ? "Play" : "Pause"}
                </Button>
              }
              title="Configurator"
            >
              <div className="space-y-6">
                {controls.fields.map((field) => (
                  <label className="block" key={field.key}>
                    <span className="flex justify-between font-mono text-[11px] text-muted-foreground">
                      <span>{field.label}</span>
                      <span className="text-foreground tabular-nums">
                        {Number(
                          props[field.key as keyof typeof props],
                        ).toFixed(2)}
                      </span>
                    </span>
                    <input
                      className="mt-3 w-full"
                      max={field.max}
                      min={field.min}
                      step={field.step}
                      style={{ accentColor: ACCENT }}
                      type="range"
                      value={Number(props[field.key as keyof typeof props])}
                      onChange={(e) =>
                        setProps((prev) => ({
                          ...prev,
                          [field.key]: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                ))}
                {"colors" in controls &&
                  controls.colors?.map((c) => (
                    <label
                      className="flex items-center justify-between gap-3 border-t border-border pt-5"
                      key={c.key}
                    >
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {c.label}
                      </span>
                      <input
                        className="size-7 cursor-pointer border border-border bg-transparent"
                        type="color"
                        value={String(props[c.key as keyof typeof props])}
                        onChange={(e) =>
                          setProps((prev) => ({
                            ...prev,
                            [c.key]: e.target.value,
                          }))
                        }
                      />
                    </label>
                  ))}
              </div>
            </Panel>

            <Panel
              action={
                <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                  {entry.tier}
                </span>
              }
              title={entry.tier === "free" ? "Install" : "Get access"}
            >
              <div className="space-y-3">
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={
                    <Link
                      href={
                        entry.tier === "free"
                          ? `/docs/installation?material=${entry.slug}`
                          : `/pricing?material=${entry.slug}`
                      }
                    />
                  }
                  size="lg"
                >
                  {entry.tier === "free" ? "Install material" : "Buy license"}
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={copySnippet}
                >
                  {copied
                    ? "Copied JSX"
                    : entry.tier === "free"
                      ? "Copy JSX"
                      : "Copy preview JSX"}
                </Button>
                <p className="pt-2 text-sm leading-relaxed text-muted-foreground">
                  {entry.tier === "free"
                    ? "Free — no account required. Source lands in your repo."
                    : "Install unlocks after purchase. Preview JSX is for evaluation."}
                </p>
              </div>
            </Panel>

            <Panel title="JSX">
              <pre className="overflow-x-auto bg-foreground p-5 font-mono text-[11px] leading-relaxed text-background">
                {snippet}
              </pre>
            </Panel>

            <Panel title="Props">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 pr-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Name
                      </th>
                      <th className="pb-3 pr-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Type
                      </th>
                      <th className="pb-3 pr-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Default
                      </th>
                      <th className="pb-3 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMaterialProps(slug).map((def) => (
                      <tr className="border-b border-border last:border-b-0" key={def.key}>
                        <td className="py-3 pr-4 align-top font-mono text-[11px] text-foreground">
                          {def.key}
                        </td>
                        <td className="py-3 pr-4 align-top font-mono text-[11px] text-muted-foreground">
                          {def.kind}
                        </td>
                        <td className="max-w-[10rem] truncate py-3 pr-4 align-top font-mono text-[11px] text-foreground">
                          {formatPropDefault(def.defaultValue)}
                        </td>
                        <td className="py-3 align-top text-[11px] leading-relaxed text-muted-foreground">
                          {def.description ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
