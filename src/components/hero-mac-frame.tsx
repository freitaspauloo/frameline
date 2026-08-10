"use client";

import * as React from "react";
import Link from "next/link";

import { HeroMacOSDock } from "@/components/hero-macos-dock";
import { HeroDither } from "@/components/motion/hero-dither";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getMaterial,
  getMaterialPropDefaults,
  getMaterialProps,
} from "@/materials";
import { renderMaterial } from "@/materials/renderers";

const HERO_INK = "#3A58F0";
const HERO_PAPER = "#FFFFFF";
const ACCENT = "#3A58F0";
const SLUG = "ink-dither";

function TrafficLights() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span
        className="size-3 rounded-full"
        style={{
          background: "#FF5F57",
          boxShadow: "0 0 0 0.5px #E0443E",
        }}
      />
      <span
        className="size-3 rounded-full"
        style={{
          background: "#FEBC2E",
          boxShadow: "0 0 0 0.5px #D4A017",
        }}
      />
      <span
        className="size-3 rounded-full"
        style={{
          background: "#28C840",
          boxShadow: "0 0 0 0.5px #1AAB29",
        }}
      />
    </div>
  );
}

function useInkDitherControls() {
  const defs = getMaterialProps(SLUG);
  const defaults = getMaterialPropDefaults(SLUG);
  const fields = defs
    .filter(
      (d) => d.kind === "number" && d.min != null && d.max != null,
    )
    .map((d) => ({
      key: d.key,
      label: d.label,
      min: d.min!,
      max: d.max!,
      step: d.step ?? 0.01,
    }));
  const colors = defs
    .filter((d) => d.kind === "color")
    .map((d) => ({ key: d.key, label: d.label }));

  return { defaults, fields, colors };
}

function HeroInkDitherPlayground() {
  const entry = getMaterial(SLUG)!;
  const { defaults, fields, colors } = useInkDitherControls();
  const [props, setProps] = React.useState<Record<string, unknown>>(() => ({
    ...defaults,
  }));
  const [paused, setPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [copiedCli, setCopiedCli] = React.useState(false);
  const [copiedShare, setCopiedShare] = React.useState(false);

  const forceStatic = paused || reducedMotion;
  const cliSnippet = `npx shadcn@latest add @frameline/${SLUG}`;

  function resetConfigurator() {
    setProps({ ...getMaterialPropDefaults(SLUG) });
  }

  async function copyCli() {
    await navigator.clipboard.writeText(cliSnippet);
    setCopiedCli(true);
    window.setTimeout(() => setCopiedCli(false), 1600);
  }

  async function shareConfig() {
    const params = new URLSearchParams();
    for (const field of fields) {
      const v = props[field.key];
      if (typeof v === "number" && defaults[field.key] !== v) {
        params.set(field.key, String(v));
      }
    }
    for (const c of colors) {
      const v = props[c.key];
      if (typeof v === "string" && defaults[c.key] !== v) {
        params.set(c.key, v);
      }
    }
    const qs = params.toString();
    const url = `${window.location.origin}/materials/${SLUG}${qs ? `?${qs}` : ""}`;
    await navigator.clipboard.writeText(url);
    setCopiedShare(true);
    window.setTimeout(() => setCopiedShare(false), 1600);
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-[1.15fr_0.85fr] lg:divide-x lg:divide-black/8">
      {/* Preview + metadata */}
      <div className="flex min-h-0 flex-col gap-4 p-4 sm:p-5">
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-black/10 bg-black">
          {renderMaterial(SLUG, {
            className: "absolute inset-0 h-full w-full",
            forceStatic,
            props,
          })}
          <div className="absolute right-2.5 bottom-2.5 z-10 flex flex-wrap justify-end gap-1.5">
            <Button
              aria-pressed={paused}
              className="border-white/20 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "Play" : "Pause"}
            </Button>
            <Button
              aria-pressed={reducedMotion}
              className="border-white/20 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setReducedMotion((v) => !v)}
            >
              {reducedMotion ? "Motion on" : "Reduced motion"}
            </Button>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          <div className="space-y-1">
            <dt className="text-[0.625rem] font-semibold tracking-widest text-black/40 uppercase">
              Type
            </dt>
            <dd className="font-mono text-[11px] text-black/80">{entry.type}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.625rem] font-semibold tracking-widest text-black/40 uppercase">
              Contexts
            </dt>
            <dd className="font-mono text-[11px] text-black/80">
              {entry.useContexts.join(" · ")}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.625rem] font-semibold tracking-widest text-black/40 uppercase">
              Tags
            </dt>
            <dd className="font-mono text-[11px] text-black/80">
              {entry.tags.join(" · ")}
            </dd>
          </div>
          {entry.perfNotes ? (
            <div className="col-span-2 space-y-1 sm:col-span-3">
              <dt className="text-[0.625rem] font-semibold tracking-widest text-black/40 uppercase">
                Perf
              </dt>
              <dd className="font-mono text-[11px] leading-relaxed text-black/80">
                {entry.renderingTechnique
                  ? `${entry.renderingTechnique} · ${entry.perfNotes}`
                  : entry.perfNotes}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      {/* Configurator + access */}
      <div className="flex min-h-0 flex-col divide-y divide-black/8">
        <section className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[0.625rem] font-semibold tracking-widest text-black/40 uppercase">
              Configurator
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Button
                size="xs"
                type="button"
                variant="outline"
                onClick={resetConfigurator}
              >
                Reset
              </Button>
              <Button
                size="xs"
                type="button"
                variant="outline"
                onClick={shareConfig}
              >
                {copiedShare ? "Copied link" : "Share config"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <label className="block" key={field.key}>
                <span className="flex justify-between font-mono text-[11px] text-black/45">
                  <span>{field.label}</span>
                  <span className="text-black/85 tabular-nums">
                    {Number(props[field.key]).toFixed(2)}
                  </span>
                </span>
                <input
                  aria-label={field.label}
                  className="mt-2 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A58F0]/40"
                  max={field.max}
                  min={field.min}
                  step={field.step}
                  style={{ accentColor: ACCENT }}
                  type="range"
                  value={Number(props[field.key])}
                  onChange={(e) =>
                    setProps((prev) => ({
                      ...prev,
                      [field.key]: Number(e.target.value),
                    }))
                  }
                />
              </label>
            ))}
            {colors.map((c) => (
              <label
                className="flex items-center justify-between gap-3 border-t border-black/8 pt-4"
                key={c.key}
              >
                <span className="font-mono text-[11px] text-black/45">
                  {c.label}
                </span>
                <input
                  aria-label={c.label}
                  className="size-7 cursor-pointer border border-black/15 bg-transparent"
                  type="color"
                  value={String(props[c.key])}
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
        </section>

        <section className="space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[0.625rem] font-semibold tracking-widest text-black/40 uppercase">
              Get access
            </h2>
            <span className="font-mono text-[11px] tracking-wide text-black/40 uppercase">
              {entry.tier}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-[0.625rem] font-semibold tracking-widest text-black/40 uppercase">
              CLI
            </p>
            <div className="flex items-start gap-2">
              <code className="min-w-0 flex-1 overflow-x-auto border border-black/10 bg-black px-3 py-2 font-mono text-[11px] text-white">
                {cliSnippet}
              </code>
              <Button size="xs" type="button" variant="outline" onClick={copyCli}>
                {copiedCli ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={`/materials/${SLUG}`} />}
            size="sm"
          >
            Open material
          </Button>
        </section>
      </div>
    </div>
  );
}

/**
 * Homepage hero visual: full-bleed ink swirl behind a floating macOS window
 * that hosts the interactive Ink Dither material playground + dock.
 */
export function HeroMacFrame({ className }: { className?: string }) {
  return (
    <div className={cn("relative isolate flex h-full min-h-[min(62dvh,720px)] w-full flex-col", className)}>
      {/* Full-bleed dither atmosphere */}
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-white">
        <HeroDither colorBack={HERO_PAPER} colorFront={HERO_INK} />
      </div>

      {/* Floating mac window */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-end justify-center px-4 pb-10 pt-4 sm:px-6 sm:pb-12 lg:px-8">
        <div className="relative w-full max-w-5xl">
          <div className="flex max-h-[min(70dvh,640px)] flex-col overflow-hidden rounded-[16px] border border-black/10 bg-white shadow-[0_28px_90px_rgba(0,0,0,0.22)]">
            <div className="relative z-20 flex h-11 shrink-0 items-center border-b border-black/8 bg-[#F5F5F5] px-4">
              <TrafficLights />
              <span className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-medium tracking-[-0.01em] text-black/45">
                Ink Dither
              </span>
            </div>
            <HeroInkDitherPlayground />
          </div>

          {/* Dock straddles the window’s bottom edge */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex translate-y-1/2 justify-center px-3">
            <div className="pointer-events-auto">
              <HeroMacOSDock variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
