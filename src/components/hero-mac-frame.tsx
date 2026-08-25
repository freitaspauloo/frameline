"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
  RiCheckLine,
  RiFileCopyLine,
  RiPauseLine,
  RiPlayLine,
  RiResetLeftLine,
  RiShareLine,
  RiSlowDownLine,
  RiSpeedLine,
} from "@remixicon/react";

import { HeroMacOSDock } from "@/components/hero-macos-dock";
import { HeroDither } from "@/components/motion/hero-dither";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  getMaterialPropDefaults,
  getMaterialProps,
} from "@/materials";
import { renderMaterial } from "@/materials/renderers";

const HERO_INK = "#3A58F0";
const HERO_PAPER = "#FFFFFF";
/** Ink dither stage back is locked white in the hero. */
const LOCKED_BACK = "#FFFFFF";
const SLUG = "ink-dither";
/** Screen linked from hero copy CTAs — matches homepage catalog tease. */
const HERO_SCREEN_SLUG = "orb";

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
  const { defaults, fields, colors } = useInkDitherControls();
  const [props, setProps] = React.useState<Record<string, unknown>>(() => ({
    ...defaults,
  }));
  const [paused, setPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [copiedShare, setCopiedShare] = React.useState(false);

  const forceStatic = paused || reducedMotion;
  const liveProps = withLockedBack(props);
  const screenHref = `/materials/${HERO_SCREEN_SLUG}`;

  function resetConfigurator() {
    setProps({ ...defaults });
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
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
      {/* Preview */}
      <div className="flex min-h-0 flex-col gap-4 border-b border-border p-4 sm:p-5 lg:min-h-[360px] lg:flex-1 lg:border-b-0">
        <div className="relative aspect-[16/10] min-h-[280px] w-full flex-1 overflow-hidden border border-border bg-white lg:aspect-auto lg:min-h-[320px]">
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
      </div>

      {/* Configurator + copy CTAs */}
      <div
        className="flex min-h-0 flex-1 flex-col lg:border-l lg:border-border"
        data-hero-stage="toolbar"
      >
        <section className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Configurator
            </h2>
            <div className="flex items-center gap-1">
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

          <div className="flex flex-1 flex-col gap-3">
            {fields.map((field) => {
              const value = Number(liveProps[field.key]);
              const labelId = `hero-config-${field.key}`;
              return (
                <div key={field.key}>
                  <div className="flex items-baseline justify-between gap-2 font-mono text-[10px]">
                    <span className="text-muted-foreground" id={labelId}>
                      {field.label}
                    </span>
                    <span className="text-foreground tabular-nums">
                      {value.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    aria-labelledby={labelId}
                    className="mt-1.5 py-0.5"
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
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-3">
            {colors.map((c) => {
              const hex =
                c.key === "colorBack"
                  ? LOCKED_BACK
                  : String(liveProps[c.key] ?? "");
              const locked = c.key === "colorBack";
              return (
                <div
                  className="flex items-center justify-between gap-2"
                  key={c.key}
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-foreground uppercase tabular-nums">
                      {hex}
                    </span>
                    <input
                      aria-label={c.label}
                      className={cn(
                        "size-6 border border-border bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-moz-color-swatch]:rounded-none [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-none [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0",
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

          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
            <Button
              className="min-w-0 flex-1 border-[#3A58F0]/40 bg-[#EEF2FF] text-[#1A2A6B] hover:border-[#3A58F0] hover:bg-[#E0E7FF] hover:text-[#1A2A6B]"
              nativeButton={false}
              render={<Link href={screenHref} />}
              size="sm"
              variant="outline"
            >
              <RiFileCopyLine data-icon="inline-start" />
              Copy prompt
            </Button>
            <Button
              className="min-w-0 flex-1 bg-[#3A58F0] text-white hover:bg-[#2F4AD4]"
              nativeButton={false}
              render={<Link href={screenHref} />}
              size="sm"
            >
              <RiFileCopyLine data-icon="inline-start" />
              Copy code
            </Button>
          </div>
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
  const reduced = useReducedMotion();
  const scope = React.useRef<HTMLDivElement>(null);
  const [bgReady, setBgReady] = React.useState(false);

  const handleBgReady = React.useCallback(() => {
    setBgReady(true);
  }, []);

  React.useEffect(() => {
    if (reduced || bgReady) return;
    const fallback = window.setTimeout(() => setBgReady(true), 450);
    return () => window.clearTimeout(fallback);
  }, [bgReady, reduced]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const chrome = root.querySelector<HTMLElement>(
        '[data-hero-stage="chrome"]',
      );
      const windowEl = root.querySelector<HTMLElement>(
        '[data-hero-stage="window"]',
      );
      const toolbar = root.querySelector<HTMLElement>(
        '[data-hero-stage="toolbar"]',
      );
      const dock = root.querySelector<HTMLElement>('[data-hero-stage="dock"]');

      if (!chrome || !windowEl || !toolbar) return;

      if (reduced) {
        gsap.set([chrome, windowEl, toolbar, dock], {
          opacity: 1,
          visibility: "visible",
          scale: 1,
          clearProps: "transform",
        });
        return;
      }

      if (!bgReady) return;

      gsap.set(chrome, { opacity: 1, visibility: "visible" });
      gsap.set(windowEl, {
        opacity: 0,
        visibility: "hidden",
        scale: 1.04,
        transformOrigin: "center bottom",
        pointerEvents: "none",
      });
      gsap.set([toolbar, dock], {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(windowEl, {
          opacity: 1,
          visibility: "visible",
          scale: 1,
          duration: 0.5,
          pointerEvents: "auto",
        })
        .to(
          toolbar,
          {
            display: "flex",
            opacity: 1,
            visibility: "visible",
            duration: 0.32,
            pointerEvents: "auto",
          },
          "+=0.12",
        )
        .to(
          dock,
          {
            opacity: 1,
            visibility: "visible",
            duration: 0.24,
            pointerEvents: "auto",
          },
          "-=0.08",
        );
    },
    { dependencies: [bgReady, reduced], scope },
  );

  return (
    <div
      ref={scope}
      className={cn(
        "hero-mac-intro relative isolate flex h-full min-h-[min(56dvh,640px)] w-full flex-col pb-8 sm:pb-10 lg:pb-12",
        bgReady && "hero-mac-intro--bg-ready",
        className,
      )}
    >
      {/* Dither atmosphere — wraps window, dock gap, and dock inside the hero band */}
      <div
        aria-hidden
        className="absolute inset-0 left-1/2 z-0 w-full max-w-7xl -translate-x-1/2 overflow-hidden bg-[#F3F5FE]"
        data-hero-stage="bg"
      >
        <HeroDither
          colorBack={HERO_PAPER}
          colorFront={HERO_INK}
          onReady={handleBgReady}
        />
      </div>

      {/* Floating mac window — fully suppressed until BG shader has painted */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-end justify-center px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14"
        data-hero-stage="chrome"
      >
        <div className="flex w-full max-w-5xl flex-col items-center gap-5 sm:gap-6">
          <div
            className="flex min-h-[min(54dvh,500px)] max-h-[min(80dvh,760px)] w-full flex-col overflow-hidden rounded-[16px] border border-border bg-background shadow-[0_24px_64px_rgba(0,0,0,0.18)]"
            data-hero-stage="window"
          >
            <div className="relative z-20 flex h-11 shrink-0 items-center border-b border-border bg-muted/60 px-4">
              <TrafficLights />
            </div>
            <HeroInkDitherPlayground />
          </div>

          <div
            className="flex w-full justify-center px-3"
            data-hero-stage="dock"
          >
            <HeroMacOSDock variant="inline" />
          </div>
        </div>
      </div>
    </div>
  );
}
