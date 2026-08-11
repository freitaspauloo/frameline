"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { MaterialPreview } from "@/components/material-preview";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { marketingPad } from "@/components/marketing-shell";
import type { MaterialCatalogEntry } from "@/materials";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ACCENT = "#3A58F0";

/** Share of each span spent dwelling on a stage before it hands over. */
const HOLD = 0.55;

export type MaterialSequenceStage = {
  caption: string;
  entry: MaterialCatalogEntry;
  label: string;
};

function StageMeta({ index, stage }: { index: number; stage: MaterialSequenceStage }) {
  return (
    <>
      <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {String(index + 1).padStart(2, "0")} · {stage.label}
      </p>
      <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
        {stage.caption}
      </p>
    </>
  );
}

/** Stacked, ruled fallback — mobile and reduced motion read the same content. */
function StaticSequence({ stages }: { stages: readonly MaterialSequenceStage[] }) {
  return (
    <div className="divide-y divide-border">
      {stages.map((stage, index) => (
        <div key={stage.entry.slug} className={marketingPad}>
          <div className="relative aspect-[16/10] overflow-hidden bg-foreground">
            <MaterialPreview entry={stage.entry} />
          </div>
          <div className="mt-6">
            <StageMeta index={index} stage={stage} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The scroll beat: one pinned stage, three materials.
 *
 * A scrubbed timeline writes opacity straight to stacked frames — each stage
 * dwells, then the next fades in over the top, so the surface reads as one
 * plate developing rather than a carousel. The ledger on the left names the
 * stage and inks its rule as it arrives.
 */
function PinnedSequence({ stages }: { stages: readonly MaterialSequenceStage[] }) {
  const scope = React.useRef<HTMLDivElement>(null);
  const runwayRef = React.useRef<HTMLDivElement>(null);
  const counterRef = React.useRef<HTMLSpanElement>(null);
  const [live, setLive] = React.useState(false);

  /* Shaders only start once the stage is genuinely approaching the viewport —
     a display:none column never intersects, so mobile never mounts WebGL. */
  React.useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLive(true);
        io.disconnect();
      },
      { rootMargin: "15% 0px" },
    );
    io.observe(runway);

    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const root = scope.current;
      const runway = runwayRef.current;
      if (!root || !runway) return;

      const frames = gsap.utils.toArray<HTMLElement>("[data-seq-frame]", root);
      const captions = gsap.utils.toArray<HTMLElement>("[data-seq-caption]", root);
      const marks = gsap.utils.toArray<HTMLElement>("[data-seq-mark]", root);
      if (frames.length < 2) return;

      const last = frames.length - 1;
      let active = -1;

      const paint = (progress: number) => {
        const raw = gsap.utils.clamp(0, last, progress * last);
        const base = Math.min(Math.floor(raw), last);
        const eased =
          base + gsap.utils.clamp(0, 1, (raw - base - HOLD) / (1 - HOLD));

        frames.forEach((frame, i) => {
          /* Each plate lays over the one before it instead of cross-dissolving. */
          const w = gsap.utils.clamp(0, 1, eased - i + 1);
          frame.style.opacity = String(w);
          frame.style.transform = `scale(${1 + (1 - w) * 0.04})`;
        });

        captions.forEach((caption, i) => {
          const w = gsap.utils.clamp(0, 1, 1 - Math.abs(eased - i) * 1.8);
          caption.style.opacity = String(w);
          caption.style.transform = `translateY(${(1 - w) * 12}px)`;
        });

        const next = Math.round(eased);
        if (next === active) return;
        active = next;

        marks.forEach((mark, i) => {
          mark.dataset.active = i === next ? "true" : "false";
        });

        const counter = counterRef.current;
        if (counter) counter.textContent = String(next + 1).padStart(2, "0");
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const state = { p: 0 };
        const tween = gsap.to(state, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: runway,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
          },
          onUpdate: () => paint(state.p),
        });
        paint(0);

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [stages], scope },
  );

  return (
    <div ref={scope}>
      <div ref={runwayRef} className="h-[220vh]">
        <div className="sticky top-16 flex h-[calc(100dvh-4rem)] divide-x divide-border">
          <div className="relative flex w-[38%] shrink-0 flex-col justify-between p-12">
            <div>
              <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                Sequence
              </p>
              <h2 className="mt-5 font-heading text-3xl leading-tight font-light tracking-tight xl:text-4xl">
                One surface, three states
              </h2>
              <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-muted-foreground">
                Scroll the plate through mesh, dither, and grain — the same
                install, three different rooms.
              </p>
            </div>

            <div className="relative h-32">
              {stages.map((stage, index) => (
                <div
                  key={stage.entry.slug}
                  className="absolute inset-x-0 top-0"
                  data-seq-caption
                  style={{ opacity: index === 0 ? 1 : 0 }}
                >
                  <StageMeta index={index} stage={stage} />
                </div>
              ))}
            </div>

            <div>
              <ol className="space-y-4 border-t border-border pt-8">
                {stages.map((stage) => (
                  <li
                    key={stage.entry.slug}
                    className="group/mark flex items-center gap-4 text-muted-foreground transition-colors duration-500 data-[active=true]:text-foreground"
                    data-seq-mark
                  >
                    <span className="block h-px w-6 bg-border transition-all duration-500 ease-[var(--ease-emil)] group-data-[active=true]/mark:w-12 group-data-[active=true]/mark:bg-[#3A58F0]" />
                    <span className="font-mono text-[11px] tracking-widest uppercase">
                      {stage.entry.title}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 font-mono text-[10px] tracking-widest text-muted-foreground tabular-nums">
                <span ref={counterRef} className="text-foreground">
                  01
                </span>
                <span className="text-border"> / </span>
                {String(stages.length).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden bg-foreground">
            {stages.map((stage, index) => (
              <div
                key={stage.entry.slug}
                className="absolute inset-0 will-change-[opacity,transform]"
                data-seq-frame
                style={{ opacity: index === 0 ? 1 : 0, zIndex: index }}
              >
                <MaterialPreview entry={stage.entry} forceStatic={!live} />
                <span className="absolute bottom-6 left-6 z-10 font-mono text-[10px] tracking-widest text-background/80 uppercase">
                  {stage.entry.title}
                </span>
              </div>
            ))}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
              style={{ backgroundColor: ACCENT, opacity: 0.6 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MaterialSequence({
  className,
  stages,
}: {
  className?: string;
  stages: readonly MaterialSequenceStage[];
}) {
  const reduced = useReducedMotion();

  if (stages.length < 2) return null;

  if (reduced) {
    return (
      <div className={className}>
        <StaticSequence stages={stages} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="lg:hidden">
        <StaticSequence stages={stages} />
      </div>
      <div className="hidden lg:block">
        <PinnedSequence stages={stages} />
      </div>
    </div>
  );
}
