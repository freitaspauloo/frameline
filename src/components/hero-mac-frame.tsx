"use client";

import * as React from "react";
import Link from "next/link";
import {
  RiCheckLine,
  RiPauseLine,
  RiPlayLine,
  RiResetLeftLine,
  RiShareLine,
  RiSlowDownLine,
  RiSpeedLine,
} from "@remixicon/react";

import { HeroMacOSDock } from "@/components/hero-macos-dock";
import { HeroDither } from "@/components/motion/hero-dither";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  getMaterial,
  getMaterialPropDefaults,
  getMaterialProps,
} from "@/materials";
import { renderMaterial } from "@/materials/renderers";

const HERO_INK = "#3A58F0";
const HERO_PAPER = "#FFFFFF";
/** Ink dither stage back is locked white in the hero. */
const LOCKED_BACK = "#FFFFFF";
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

function withLockedBack(
  props: Record<string, unknown>,
): Record<string, unknown> {
  return { ...props, colorBack: LOCKED_BACK };
}

function useInkDitherControls() {
  const defs = getMaterialProps(SLUG);
  const defaults = withLockedBack(getMaterialPropDefaults(SLUG));
  const fields = defs
    .filter((d) => d.kind === "number" && d.min != null && d.max != null)
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
  const liveProps = withLockedBack(props);

  function resetConfigurator() {
    setProps({ ...defaults });
  }

  async function copyCli() {
    await navigator.clipboard.writeText(cliSnippet);
    setCopiedCli(true);
    window.setTimeout(() => setCopiedCli(false), 1600);
  }

  async function shareConfig() {
    const params = new URLSearchParams();
    for (const field of fields) {
      const v = liveProps[field.key];
      if (typeof v === "number" && defaults[field.key] !== v) {
        params.set(field.key, String(v));
      }
    }
    for (const c of colors) {
      if (c.key === "colorBack") continue;
      const v = liveProps[c.key];
      if (typeof v === "string" && defaults[c.key] !== v) {
        params.set(c.key, v);
      }
    }
    // Always advertise white back on shared hero configs.
    params.set("colorBack", LOCKED_BACK);
    const url = `${window.location.origin}/materials/${SLUG}?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopiedShare(true);
    window.setTimeout(() => setCopiedShare(false), 1600);
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      {/* Preview + metadata */}
      <div className="flex min-h-0 flex-col gap-4 border-b border-border p-4 sm:p-5 lg:border-b-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-white">
          {renderMaterial(SLUG, {
            className: "absolute inset-0 h-full w-full",
            forceStatic,
            props: liveProps,
          })}
          <div className="absolute right-2.5 bottom-2.5 z-10 flex flex-wrap justify-end gap-1.5">
            <Button
              aria-label={paused ? "Play preview" : "Pause preview"}
              aria-pressed={paused}
              className="border-border bg-background/90 text-foreground backdrop-blur-sm hover:bg-background"
              size="icon-xs"
              type="button"
              variant="outline"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <RiPlayLine /> : <RiPauseLine />}
            </Button>
            <Button
              aria-label={
                reducedMotion
                  ? "Enable motion"
                  : "Use reduced motion shell fallback"
              }
              aria-pressed={reducedMotion}
              className="border-border bg-background/90 text-foreground backdrop-blur-sm hover:bg-background"
              size="icon-xs"
              type="button"
              variant="outline"
              onClick={() => setReducedMotion((v) => !v)}
            >
              {reducedMotion ? <RiSpeedLine /> : <RiSlowDownLine />}
            </Button>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-4 sm:grid-cols-3">
          <div className="space-y-1">
            <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Type
            </dt>
            <dd className="font-mono text-[11px] text-foreground">{entry.type}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Contexts
            </dt>
            <dd className="font-mono text-[11px] text-foreground">
              {entry.useContexts.join(" · ")}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Tags
            </dt>
            <dd className="font-mono text-[11px] text-foreground">
              {entry.tags.join(" · ")}
            </dd>
          </div>
          {entry.perfNotes ? (
            <div className="col-span-2 space-y-1 sm:col-span-3">
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

      {/* Configurator + access — mirrors updated material-detail-page */}
      <div className="flex min-h-0 flex-col divide-y divide-border lg:border-l lg:border-border">
        <section className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Configurator
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Button
                aria-label="Reset configurator to defaults"
                size="icon-xs"
                type="button"
                variant="outline"
                onClick={resetConfigurator}
              >
                <RiResetLeftLine />
              </Button>
              <Button
                aria-label={
                  copiedShare ? "Config link copied" : "Share config link"
                }
                size="icon-xs"
                type="button"
                variant="outline"
                onClick={shareConfig}
              >
                {copiedShare ? <RiCheckLine /> : <RiShareLine />}
              </Button>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Tune the live preview. Reset restores defaults; Share config copies
            a link to this exact setup.
          </p>

          <div className="space-y-5">
            {fields.map((field) => {
              const value = Number(liveProps[field.key]);
              const labelId = `hero-config-${field.key}`;
              return (
                <div key={field.key}>
                  <div className="flex items-baseline justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground" id={labelId}>
                      {field.label}
                    </span>
                    <span className="text-foreground tabular-nums">
                      {value.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={labelId}
                    className="mt-3 py-1"
                    max={field.max}
                    min={field.min}
                    step={field.step}
                    value={[value]}
                    onValueChange={(next) => {
                      const v = Array.isArray(next) ? next[0] : next;
                      if (typeof v !== "number" || !Number.isFinite(v)) return;
                      setProps((prev) => withLockedBack({ ...prev, [field.key]: v }));
                    }}
                  />
                </div>
              );
            })}

            {colors.map((c) => {
              const hex =
                c.key === "colorBack"
                  ? LOCKED_BACK
                  : String(liveProps[c.key] ?? "");
              const locked = c.key === "colorBack";
              return (
                <div
                  className="flex items-center justify-between gap-3 border-t border-border pt-4"
                  key={c.key}
                >
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-foreground uppercase tabular-nums">
                      {hex}
                    </span>
                    <input
                      aria-label={c.label}
                      className={cn(
                        "size-8 border border-border bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-moz-color-swatch]:rounded-none [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-none [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0",
                        locked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
                      )}
                      disabled={locked}
                      type="color"
                      value={hex}
                      onChange={(e) => {
                        if (locked) return;
                        setProps((prev) =>
                          withLockedBack({ ...prev, [c.key]: e.target.value }),
                        );
                      }}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Get access
            </h2>
            <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              {entry.tier}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              CLI
            </p>
            <div className="flex items-start gap-2">
              <code className="min-w-0 flex-1 overflow-x-auto border border-[#3A58F0] bg-[#EEF2FF] px-3 py-2 font-mono text-[11px] text-[#1A2A6B]">
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
 * Homepage hero visual: ink swirl (rail-bounded) behind a floating macOS
 * window that hosts the interactive Ink Dither material playground + dock.
 */
export function HeroMacFrame({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate flex h-full min-h-[min(62dvh,720px)] w-full flex-col",
        className,
      )}
    >
      {/* Dither atmosphere — clipped to the marketing shell rails (max-w-7xl) */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 z-0 w-full max-w-7xl -translate-x-1/2 overflow-hidden bg-white"
      >
        <HeroDither colorBack={HERO_PAPER} colorFront={HERO_INK} />
      </div>

      {/* Floating mac window */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-end justify-center px-4 pt-4 pb-6 sm:px-6 sm:pb-7 lg:px-8">
        <div className="relative w-full max-w-5xl pb-8 sm:pb-10">
          <div className="flex max-h-[min(70dvh,640px)] flex-col overflow-hidden rounded-[16px] border border-border bg-background shadow-[0_28px_90px_rgba(0,0,0,0.22)]">
            <div className="relative z-20 flex h-11 shrink-0 items-center border-b border-border bg-muted/60 px-4">
              <TrafficLights />
            </div>
            <HeroInkDitherPlayground />
          </div>

          {/* Dock sits on the window bottom, over the dither (no empty white strip below) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-3">
            <div className="pointer-events-auto">
              <HeroMacOSDock variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
