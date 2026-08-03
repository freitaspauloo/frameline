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
  SignalDots,
  SimplexField,
  SmokeRing,
  TideWave,
  getMaterial,
  type MaterialCatalogEntry,
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
  if (slug === "aurora-mesh") {
    return {
      defaults: {
        speed: 0.47,
        distortion: 0.8,
        swirl: 0.5,
        scale: 0.69,
        colors: ["#E3FFFE", "#C5F0FF", "#FF008D", "#B700FF"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "distortion", label: "Distortion", min: 0, max: 1, step: 0.01 },
        { key: "swirl", label: "Swirl", min: 0, max: 1, step: 0.01 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
      ],
    };
  }
  if (slug === "ink-dither") {
    return {
      defaults: {
        speed: 0.35,
        size: 3,
        colorBack: "#0A0A0A",
        colorFront: "#2D6BFF",
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "size", label: "Size", min: 1, max: 12, step: 0.5 },
      ],
      colors: [
        { key: "colorBack", label: "Back" },
        { key: "colorFront", label: "Front" },
      ],
    };
  }
  if (slug === "grain-field") {
    return {
      defaults: {
        speed: 0.4,
        softness: 0.65,
        intensity: 0.45,
        noise: 0.35,
        colors: ["#F4F1EA", "#D4C4A8", "#2D6BFF", "#0A0A0A"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
        { key: "intensity", label: "Intensity", min: 0, max: 1, step: 0.01 },
        { key: "noise", label: "Noise", min: 0, max: 1, step: 0.01 },
      ],
    };
  }
  if (slug === "neuro-veil") {
    return {
      defaults: {
        speed: 0.6,
        brightness: 0.08,
        contrast: 0.35,
        scale: 1,
        colorFront: "#E8F0FF",
        colorMid: "#2D6BFF",
        colorBack: "#0A0A0A",
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "brightness", label: "Brightness", min: 0, max: 1, step: 0.01 },
        { key: "contrast", label: "Contrast", min: 0, max: 1, step: 0.01 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
      ],
      colors: [
        { key: "colorFront", label: "Front" },
        { key: "colorMid", label: "Mid" },
        { key: "colorBack", label: "Back" },
      ],
    };
  }
  if (slug === "tide-wave") {
    return {
      defaults: {
        scale: 0.7,
        shape: 1.2,
        frequency: 0.45,
        amplitude: 0.4,
        spacing: 1.1,
        proportion: 0.35,
        softness: 0.15,
        colorFront: "#2D6BFF",
        colorBack: "#0B1C2D",
      },
      fields: [
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
        { key: "shape", label: "Shape", min: 0, max: 3, step: 0.01 },
        { key: "frequency", label: "Frequency", min: 0, max: 2, step: 0.01 },
        { key: "amplitude", label: "Amplitude", min: 0, max: 1, step: 0.01 },
        { key: "spacing", label: "Spacing", min: 0, max: 2, step: 0.01 },
        { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
      ],
      colors: [
        { key: "colorFront", label: "Front" },
        { key: "colorBack", label: "Back" },
      ],
    };
  }
  if (slug === "cell-voronoi") {
    return {
      defaults: {
        speed: 0.4,
        scale: 0.55,
        distortion: 0.35,
        gap: 0.03,
        glow: 0.15,
        colors: ["#F4F1EA", "#C8BBA8", "#2D6BFF"],
        colorGap: "#0A0A0A",
        colorGlow: "#FFFFFF",
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
        { key: "distortion", label: "Distortion", min: 0, max: 0.5, step: 0.01 },
        { key: "gap", label: "Gap", min: 0, max: 0.1, step: 0.005 },
        { key: "glow", label: "Glow", min: 0, max: 1, step: 0.01 },
      ],
      colors: [
        { key: "colorGap", label: "Gap" },
        { key: "colorGlow", label: "Glow" },
      ],
    };
  }
  if (slug === "ink-swirl") {
    return {
      defaults: {
        speed: 0.32,
        bandCount: 4,
        twist: 0.45,
        center: 0.2,
        softness: 0.2,
        noise: 0.15,
        colorBack: "#0A0A0A",
        colors: ["#2D6BFF", "#5B8CFF", "#1A3A8F"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "bandCount", label: "Bands", min: 0, max: 15, step: 1 },
        { key: "twist", label: "Twist", min: 0, max: 1, step: 0.01 },
        { key: "center", label: "Center", min: 0, max: 1, step: 0.01 },
        { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
        { key: "noise", label: "Noise", min: 0, max: 1, step: 0.01 },
      ],
      colors: [{ key: "colorBack", label: "Back" }],
    };
  }
  if (slug === "signal-dots") {
    return {
      defaults: {
        size: 2.5,
        gapX: 28,
        gapY: 28,
        sizeRange: 0,
        opacityRange: 0.15,
        colorBack: "#F7F5F0",
        colorFill: "#2D6BFF",
        colorStroke: "#2D6BFF",
      },
      fields: [
        { key: "size", label: "Size", min: 1, max: 20, step: 0.5 },
        { key: "gapX", label: "Gap X", min: 8, max: 80, step: 1 },
        { key: "gapY", label: "Gap Y", min: 8, max: 80, step: 1 },
        { key: "opacityRange", label: "Opacity range", min: 0, max: 1, step: 0.01 },
      ],
      colors: [
        { key: "colorBack", label: "Back" },
        { key: "colorFill", label: "Fill" },
        { key: "colorStroke", label: "Stroke" },
      ],
    };
  }
  if (slug === "ember-warp") {
    return {
      defaults: {
        speed: 0.7,
        proportion: 0.45,
        softness: 0.85,
        distortion: 0.3,
        swirl: 0.65,
        shapeScale: 0.12,
        colors: ["#0A0A0A", "#C45C26", "#1A1210", "#E8A05C"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "proportion", label: "Proportion", min: 0, max: 1, step: 0.01 },
        { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
        { key: "distortion", label: "Distortion", min: 0, max: 1, step: 0.01 },
        { key: "swirl", label: "Swirl", min: 0, max: 1, step: 0.01 },
        { key: "shapeScale", label: "Shape scale", min: 0, max: 1, step: 0.01 },
      ],
    };
  }
  if (slug === "halo-rays") {
    return {
      defaults: {
        speed: 0.65,
        density: 0.35,
        spotty: 0.28,
        midIntensity: 0.45,
        midSize: 0.22,
        intensity: 0.75,
        bloom: 0.35,
        scale: 1,
        colorBack: "#0A0A0A",
        colorBloom: "#2D6BFF",
        colors: ["#2D6BFF", "#5B8CFF", "#E8F0FF", "#1A3A8F"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "density", label: "Density", min: 0, max: 1, step: 0.01 },
        { key: "spotty", label: "Spotty", min: 0, max: 1, step: 0.01 },
        { key: "intensity", label: "Intensity", min: 0, max: 1, step: 0.01 },
        { key: "bloom", label: "Bloom", min: 0, max: 1, step: 0.01 },
        { key: "midSize", label: "Mid size", min: 0, max: 1, step: 0.01 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
      ],
      colors: [
        { key: "colorBack", label: "Back" },
        { key: "colorBloom", label: "Bloom" },
      ],
    };
  }
  if (slug === "ink-metaballs") {
    return {
      defaults: {
        speed: 0.55,
        count: 12,
        size: 0.72,
        scale: 1.2,
        colorBack: "#F4F1EA",
        colors: ["#2D6BFF", "#C8BBA8", "#0A0A0A", "#5B8CFF"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "count", label: "Count", min: 1, max: 20, step: 1 },
        { key: "size", label: "Size", min: 0, max: 1, step: 0.01 },
        { key: "scale", label: "Scale", min: 0.2, max: 4, step: 0.01 },
      ],
      colors: [{ key: "colorBack", label: "Back" }],
    };
  }
  if (slug === "smoke-ring") {
    return {
      defaults: {
        speed: 0.45,
        noiseScale: 2.4,
        noiseIterations: 6,
        radius: 0.32,
        thickness: 0.55,
        innerShape: 0.75,
        scale: 0.9,
        colorBack: "#0A0A0A",
        colors: ["#E8E4DC", "#2D6BFF", "#C8BBA8"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "noiseScale", label: "Noise scale", min: 0.01, max: 5, step: 0.01 },
        { key: "noiseIterations", label: "Iterations", min: 1, max: 8, step: 1 },
        { key: "radius", label: "Radius", min: 0, max: 1, step: 0.01 },
        { key: "thickness", label: "Thickness", min: 0.01, max: 1, step: 0.01 },
        { key: "innerShape", label: "Inner shape", min: 0, max: 4, step: 0.01 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
      ],
      colors: [{ key: "colorBack", label: "Back" }],
    };
  }
  if (slug === "simplex-field") {
    return {
      defaults: {
        speed: 0.4,
        softness: 0.35,
        stepsPerColor: 2,
        scale: 0.7,
        colors: ["#F4F1EA", "#2D6BFF", "#C8BBA8", "#0A0A0A", "#E8E4DC"],
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
        { key: "stepsPerColor", label: "Steps", min: 1, max: 10, step: 1 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
      ],
    };
  }
  if (slug === "halftone-signal") {
    return {
      defaults: {
        speed: 0.2,
        size: 0.55,
        radius: 1.2,
        contrast: 0.45,
        grainMixer: 0.15,
        grainOverlay: 0.18,
        colorBack: "#F4F1EA",
        colorFront: "#2D6BFF",
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "size", label: "Size", min: 0, max: 1, step: 0.01 },
        { key: "radius", label: "Radius", min: 0, max: 2, step: 0.01 },
        { key: "contrast", label: "Contrast", min: 0, max: 1, step: 0.01 },
        { key: "grainMixer", label: "Grain mixer", min: 0, max: 1, step: 0.01 },
        { key: "grainOverlay", label: "Grain overlay", min: 0, max: 1, step: 0.01 },
      ],
      colors: [
        { key: "colorBack", label: "Back" },
        { key: "colorFront", label: "Front" },
      ],
    };
  }
  if (slug === "liquid-chrome") {
    return {
      defaults: {
        speed: 0.8,
        distortion: 0.12,
        repetition: 2.2,
        shiftRed: 0.25,
        shiftBlue: 0.35,
        contour: 0.35,
        softness: 0.15,
        angle: 70,
        scale: 0.85,
        colorBack: "#1A1A1C",
        colorTint: "#2D6BFF",
      },
      fields: [
        { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
        { key: "distortion", label: "Distortion", min: 0, max: 1, step: 0.01 },
        { key: "repetition", label: "Repetition", min: 1, max: 10, step: 0.1 },
        { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
        { key: "contour", label: "Contour", min: 0, max: 1, step: 0.01 },
        { key: "angle", label: "Angle", min: 0, max: 360, step: 1 },
        { key: "scale", label: "Scale", min: 0.2, max: 2, step: 0.01 },
      ],
      colors: [
        { key: "colorBack", label: "Back" },
        { key: "colorTint", label: "Tint" },
      ],
    };
  }
  return {
    defaults: {
      speed: 0.4,
      softness: 0.65,
      intensity: 0.45,
      noise: 0.35,
      colors: ["#F4F1EA", "#D4C4A8", "#2D6BFF", "#0A0A0A"],
    },
    fields: [
      { key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
      { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01 },
      { key: "intensity", label: "Intensity", min: 0, max: 1, step: 0.01 },
      { key: "noise", label: "Noise", min: 0, max: 1, step: 0.01 },
    ],
  };
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
          </div>
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}
