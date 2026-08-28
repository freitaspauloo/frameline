"use client";

import { FlutedGlass } from "@paper-design/shaders-react";
import gsap from "gsap";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { useEffect, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

const HERO_VIDEO = "/screens/health-ai/hero.mp4";
const HERO_POSTER = "/screens/health-ai/hero.png";

/** Paper FlutedGlass — lines / prism preset from the design panel */
const HERO_GLASS = {
  shape: "lines" as const,
  distortionShape: "prism" as const,
  fit: "cover" as const,
  size: 0.73,
  highlights: 0.1,
  shadows: 0.25,
  angle: 0,
  distortion: 0.08,
  shift: 0,
  stretch: 0,
  blur: 0,
  edges: 0,
  scale: 1,
  speed: 0,
  colorBack: "#00000000",
  colorHighlight: "#FFFFFF",
  colorShadow: "#000000",
};

const NAV_LINKS = [
  { label: "Insights", badge: "AI" },
  { label: "Coaching" },
  { label: "Pricing" },
  { label: "Research" },
] as const;

const PILL_INK = "#404040";
const BADGE_BG = "#e8e8ec";
const BADGE_INK = "#171717";
const INK = "#0a0a0a";
const ACCENT = "#4aabeb";
/** Page + surfaces — sky-blue tint to match the hero video */
const CANVAS = "#eef6fc";
const SURFACE = "#f5fafe";

const APP_NAME = "Pulse";

export type HealthAiHeroProps = {
  className?: string;
  embed?: boolean;
  /** Dev / live pages — skip 16:9 letterboxing and fill the viewport. */
  fillViewport?: boolean;
};

/**
 * Pulse homepage — AI health companion with light canvas, floating nav, hero card, bottom lockup.
 */
export function HealthAiHero({
  className,
  embed = false,
  fillViewport = false,
}: HealthAiHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shell = root.querySelector<HTMLElement>("[data-ha-shell]");
    const topbar = root.querySelector<HTMLElement>("[data-ha-topbar]");
    const brand = root.querySelector<HTMLElement>("[data-ha-brand]");
    const nav = root.querySelector<HTMLElement>("[data-ha-nav]");
    const navPill = root.querySelector<HTMLElement>("[data-ha-nav-pill]");
    const navLinks = gsap.utils.toArray<HTMLElement>("[data-ha-nav-link]", root);
    const navActions = gsap.utils.toArray<HTMLElement>("[data-ha-nav-action]", root);
    const hero = root.querySelector<HTMLElement>("[data-ha-hero]");
    const headline = root.querySelector<HTMLElement>("[data-ha-headline]");
    const headlineLines = gsap.utils.toArray<HTMLElement>("[data-ha-headline-line]", root);
    const headlineInners = gsap.utils.toArray<HTMLElement>("[data-ha-headline-inner]", root);
    const bodyBlock = root.querySelector<HTMLElement>("[data-ha-body-block]");
    const bodyWords = splitTextIntoWords(root.querySelector<HTMLElement>("[data-ha-body-text]"));
    const bottomCta = root.querySelector<HTMLElement>("[data-ha-bottom-cta]");
    const videoPlate = root.querySelector<HTMLElement>("[data-ha-video-plate]");
    const brandMark = brand?.querySelector<SVGElement>("svg") ?? null;

    if (!shell || !topbar || !nav || !hero || !headline || !bodyBlock || !bottomCta) return;

    const targetRect = hero.getBoundingClientRect();
    const targetRadius = parseFloat(getComputedStyle(hero).borderRadius) || 20;

    const uiTargets = [
      brand,
      navPill,
      ...navLinks,
      ...navActions,
      headline,
      ...headlineLines,
      ...headlineInners,
      bodyBlock,
      ...bodyWords,
      bottomCta,
    ];

    root.classList.remove("ha-booting");
    gsap.set(root, { autoAlpha: 1 });

    if (reduced) {
      root.classList.remove("ha-booting");
      gsap.set(root, { autoAlpha: 1 });
      gsap.set([topbar, brand, ...uiTargets], {
        autoAlpha: 1,
        x: 0,
        y: 0,
        yPercent: 0,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        clipPath: "inset(0 0% 0 0)",
        clearProps: "transform,filter,clipPath",
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(hero, {
        position: "fixed",
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        zIndex: 40,
        margin: 0,
        maxWidth: "none",
        maxHeight: "none",
        boxShadow: "0 0 0 rgba(0,0,0,0)",
      });
      if (videoPlate) gsap.set(videoPlate, { scale: 1.08, transformOrigin: "50% 50%" });
      gsap.set(shell, { autoAlpha: 0.35 });
      gsap.set(topbar, { autoAlpha: 0, y: -8 });
      gsap.set(brand, { autoAlpha: 0, x: -16, filter: "blur(6px)" });
      if (brandMark) gsap.set(brandMark, { rotate: -28, scale: 0.82, transformOrigin: "50% 50%" });
      gsap.set(navPill, { autoAlpha: 0, x: 18, scale: 0.96, filter: "blur(5px)" });
      gsap.set(navLinks, { autoAlpha: 0, y: 10, rotateX: -16, transformPerspective: 600 });
      gsap.set(navActions, { autoAlpha: 0, scale: 0.9, y: 8 });
      gsap.set(headline, { autoAlpha: 0, y: 48, filter: "blur(8px)" });
      gsap.set(headlineLines, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(headlineInners, { yPercent: 115, transformOrigin: "0% 100%" });
      gsap.set(bodyBlock, {
        autoAlpha: 0,
        x: 36,
        y: 48,
        scale: 0.86,
        rotate: 4,
        filter: "blur(12px)",
        transformOrigin: "100% 100%",
      });
      gsap.set(bodyWords, { autoAlpha: 0, y: 14, filter: "blur(5px)" });
      gsap.set(bottomCta, { autoAlpha: 0, scale: 0.82, y: 10 });

      const introHold = 0.65;
      const morphStart = introHold;
      const morphDur = 1.45;
      const uiStart = morphStart + 0.48;
      const contentStart = morphStart + morphDur - 0.15;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (videoPlate) {
        tl.to(videoPlate, { scale: 1.05, duration: introHold, ease: "sine.inOut" }, 0);
      }

      tl.to(
        hero,
        {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          borderRadius: targetRadius,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
          duration: morphDur,
          ease: "expo.inOut",
        },
        morphStart,
      );

      if (videoPlate) {
        tl.to(videoPlate, { scale: 1, duration: morphDur, ease: "expo.inOut" }, morphStart);
      }

      tl.to(shell, { autoAlpha: 1, duration: 0.55, ease: "power2.out" }, uiStart - 0.12)
        .to(topbar, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" }, uiStart - 0.06)
        .to(
          brand,
          { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.72, ease: "expo.out" },
          uiStart,
        );

      if (brandMark) {
        tl.to(
          brandMark,
          { rotate: 0, scale: 1, duration: 0.82, ease: "back.out(2.2)" },
          uiStart,
        );
      }

      tl.to(
          navPill,
          { autoAlpha: 1, x: 0, scale: 1, filter: "blur(0px)", duration: 0.62, ease: "expo.out" },
          uiStart + 0.05,
        )
        .to(
          navLinks,
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.55,
            stagger: { each: 0.05, from: "end" },
            ease: "back.out(1.45)",
          },
          uiStart + 0.1,
        )
        .to(
          navActions,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.07,
            ease: "back.out(1.75)",
          },
          uiStart + 0.16,
        )
        .to(
          headline,
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "expo.out" },
          contentStart,
        )
        .to(
          headlineLines,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1,
            stagger: 0.14,
            ease: "power4.inOut",
          },
          contentStart + 0.06,
        )
        .to(
          headlineInners,
          {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.14,
            ease: "expo.out",
          },
          contentStart + 0.06,
        )
        .to(
          bodyBlock,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "expo.out",
          },
          contentStart + 0.22,
        )
        .to(
          bodyWords,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            stagger: 0.022,
            ease: "power2.out",
          },
          contentStart + 0.38,
        )
        .to(
          bottomCta,
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.62, ease: "back.out(2.2)" },
          contentStart + 0.58,
        )
        .add(() => {
          gsap.set(hero, {
            clearProps:
              "position,top,left,width,height,borderRadius,zIndex,margin,maxWidth,maxHeight,boxShadow",
          });
          gsap.set(headline, { clearProps: "transform,filter" });
          gsap.set(bodyBlock, { clearProps: "transform,filter" });
          if (brandMark) gsap.set(brandMark, { clearProps: "transform" });
          if (videoPlate) gsap.set(videoPlate, { clearProps: "transform" });

          gsap.to(headline, {
            y: -4,
            duration: 3.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
          bodyBlock.classList.add("ha-idle");
        });
    }, root);

    return () => ctx.revert();
  }, []);

  const page = (
    <section
      ref={rootRef}
      className={cn(
        GeistMono.className,
        "ha-booting relative flex h-full min-h-0 w-full flex-col overflow-hidden text-neutral-950 antialiased uppercase",
        className,
      )}
      style={{ backgroundColor: CANVAS }}
    >
        <div
          data-ha-shell
          className="relative z-10 flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8"
        >
          <div
            data-ha-topbar
            className="relative z-20 flex w-full shrink-0 items-center justify-between gap-4"
          >
            <a
              data-ha-brand
              href="#top"
              className={cn(
                GeistMono.className,
                "ha-brand inline-flex shrink-0 items-center gap-2.5 text-[14px] font-normal tracking-[0.08em] text-neutral-950 uppercase sm:gap-3 sm:text-[15px]",
              )}
            >
              <FlowerIcon className="size-[18px] shrink-0 sm:size-5" />
              {APP_NAME}
            </a>

            <div data-ha-nav className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              <div
                data-ha-nav-pill
                className="flex items-center gap-4 [perspective:720px] sm:gap-5"
              >
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.label}
                    data-ha-nav-link
                    href={`#${item.label.toLowerCase()}`}
                    className="ha-link inline-flex items-center gap-2 text-[11px] tracking-[0.03em] sm:text-[12px]"
                    style={{ color: PILL_INK }}
                  >
                    <FlipLabel>{item.label}</FlipLabel>
                    {"badge" in item && item.badge ? (
                      <span
                        className="ha-badge inline-flex min-w-[24px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] tracking-[0.02em] sm:text-[11px]"
                        style={{ backgroundColor: BADGE_BG, color: BADGE_INK }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>

              <a
                data-ha-nav-action
                href="#account"
                className="ha-btn ha-btn-account inline-flex size-[38px] shrink-0 items-center justify-center rounded-full border sm:size-[42px]"
                style={{ backgroundColor: "transparent", borderColor: ACCENT, color: ACCENT }}
                aria-label="Account"
              >
                <UserIcon className="ha-btn-icon size-3.5 sm:size-4" />
              </a>

              <a
                data-ha-nav-action
                href="#join"
                className="ha-btn ha-btn-accent inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] tracking-[0.05em] sm:px-5 sm:py-3 sm:text-[12px]"
                style={{ backgroundColor: ACCENT, borderColor: ACCENT, color: "#ffffff" }}
              >
                <FlipLabel>Start</FlipLabel>
                <SendIcon className="ha-btn-icon size-3.5 sm:size-4" />
              </a>
            </div>
          </div>

          <div data-ha-lockup className="mt-auto flex min-h-0 flex-col gap-4 pt-10 sm:gap-5 sm:pt-14">
            <h1
              data-ha-headline
              className={cn(
                GeistSans.className,
                "min-w-0 max-w-[min(100%,42rem)] shrink-0 text-[clamp(1.625rem,3.64vw,2.925rem)] font-light leading-[1.04] tracking-[-0.03em] text-neutral-950 normal-case sm:tracking-[-0.04em]",
              )}
            >
              <span
                data-ha-headline-line
                className="block w-fit max-w-full overflow-hidden py-[0.06em]"
              >
                <span
                  data-ha-headline-inner
                  className="block whitespace-nowrap will-change-transform"
                >
                  Your health, understood.
                </span>
              </span>
              <span
                data-ha-headline-line
                className="block w-fit max-w-full overflow-hidden py-[0.06em]"
              >
                <span
                  data-ha-headline-inner
                  className="block whitespace-nowrap will-change-transform"
                >
                  Before you feel the shift.
                </span>
              </span>
            </h1>

            <div
              data-ha-hero
              className="relative isolate h-[min(84vh,800px)] w-full shrink-0 overflow-hidden rounded-[20px] sm:h-[min(88vh,880px)] sm:rounded-[24px] [transform:translateZ(0)]"
            >
            <HeroVideo />

            <div
              data-ha-body-block
              className="ha-body-pill pointer-events-auto absolute bottom-4 right-4 z-10 flex w-[min(calc(100%-2rem),17.5rem)] max-w-[280px] flex-col items-start gap-3 rounded-[24px] border border-black/5 px-4 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] sm:bottom-6 sm:right-6 sm:w-[18rem] sm:gap-3.5 sm:px-5 sm:py-4"
              style={{ backgroundColor: SURFACE }}
            >
              <p
                data-ha-body-text
                className={cn(
                  GeistMono.className,
                  "w-full text-[13px] font-light uppercase leading-[1.5] tracking-[0.06em] text-black sm:text-[14px] sm:leading-[1.55]",
                )}
              >
                AI-powered vitals tracking, personalized wellness insights, and proactive
                coaching that adapts to your sleep, stress, and daily rhythm.
              </p>
              <a
                data-ha-bottom-cta
                href="#join"
                className="ha-btn ha-btn-accent inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] tracking-[0.08em] sm:px-4 sm:py-2.5 sm:text-[11px]"
                style={{ backgroundColor: ACCENT, borderColor: ACCENT, color: "#ffffff" }}
              >
                <FlipLabel>Start</FlipLabel>
                <SendIcon className="ha-btn-icon size-3 sm:size-3.5" />
              </a>
            </div>
          </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              .ha-booting {
                opacity: 0;
              }
              .ha-flip {
                display: inline-block;
                overflow: hidden;
                height: 1.15em;
                line-height: 1.15;
                vertical-align: bottom;
                perspective: 420px;
              }
              .ha-flip-inner {
                display: block;
                transition: transform 0.62s cubic-bezier(0.22, 1, 0.36, 1);
                transform-style: preserve-3d;
              }
              .ha-link {
                transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
              }
              .ha-brand svg {
                transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
                transform-origin: center center;
              }
              .ha-body-pill {
                transition:
                  transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1);
                will-change: transform;
              }
              @keyframes ha-pill-float {
                0%,
                100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-6px);
                }
              }
              .ha-body-pill.ha-idle {
                animation: ha-pill-float 2.8s ease-in-out infinite;
                animation-delay: 0.4s;
              }
              .ha-body-pill.ha-idle:hover {
                animation-play-state: paused;
              }
              [data-ha-headline] {
                will-change: transform, opacity;
              }
              .ha-word {
                display: inline-block;
                margin-right: 0.28em;
              }
              .ha-word:last-child {
                margin-right: 0;
              }
              .ha-flip-line {
                display: block;
                backface-visibility: hidden;
              }
              .ha-link .ha-flip-line,
              .ha-link .ha-flip-line:last-child,
              .ha-brand .ha-flip-line:last-child {
                color: ${PILL_INK};
              }
              .ha-link:hover .ha-flip-line:last-child,
              .ha-brand:hover .ha-flip-line:last-child {
                color: ${ACCENT};
              }
              .ha-badge {
                transition:
                  transform 0.32s cubic-bezier(0.23, 1, 0.32, 1),
                  background-color 0.32s ease,
                  color 0.32s ease;
              }
              .ha-btn {
                transition:
                  transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                  background-color 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                  border-color 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                  color 0.38s cubic-bezier(0.22, 1, 0.36, 1);
              }
              .ha-btn-icon {
                transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
                transform-origin: center center;
              }
              @media (hover: hover) and (pointer: fine) {
                .ha-link:hover {
                  transform: translateY(-1px);
                }
                .ha-link:hover .ha-flip-inner,
                .ha-brand:hover .ha-flip-inner,
                .ha-btn-accent:hover .ha-flip-inner {
                  transform: translateY(-50%) rotateX(-10deg);
                }
                .ha-brand:hover svg {
                  transform: rotate(18deg) scale(1.08);
                }
                .ha-body-pill:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
                }
                .ha-link:hover .ha-badge {
                  transform: scale(1.08);
                  background-color: ${ACCENT} !important;
                  color: #ffffff !important;
                }
                .ha-btn-account:hover {
                  transform: translateY(-3px);
                  background-color: ${ACCENT} !important;
                  border-color: ${ACCENT} !important;
                  color: #ffffff !important;
                }
                .ha-btn-account:hover .ha-btn-icon {
                  transform: scale(1.06);
                }
                .ha-btn-accent:hover {
                  transform: translateY(-3px);
                  background-color: ${INK} !important;
                  border-color: ${INK} !important;
                  color: ${CANVAS} !important;
                }
                .ha-btn-accent:hover .ha-btn-icon {
                  transform: rotate(45deg) translate(2px, -2px) scale(1.08);
                }
              }
              @media (prefers-reduced-motion: reduce) {
                .ha-flip-inner,
                .ha-link,
                .ha-brand svg,
                .ha-body-pill,
                .ha-btn,
                .ha-btn-icon,
                .ha-badge {
                  transition: none;
                }
                .ha-link:hover .ha-flip-inner,
                .ha-brand:hover .ha-flip-inner,
                .ha-btn-accent:hover .ha-flip-inner {
                  transform: none;
                }
              }
            `,
          }}
        />
      </section>
  );

  if (fillViewport) {
    return (
      <div className="h-dvh w-full overflow-hidden" style={{ background: CANVAS }}>
        {page}
      </div>
    );
  }

  return (
    <ScreenStage embed={embed} background={CANVAS} className={className}>
      {page}
    </ScreenStage>
  );
}

function HeroVideo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glassHostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let started = false;

    const startPlayback = () => {
      if (started) return;
      started = true;

      video.playbackRate = 1;
      video.loop = true;
      video.currentTime = 0;

      if (reduced) {
        video.pause();
        return;
      }

      void video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", startPlayback);
    if (video.readyState >= 2) startPlayback();

    return () => {
      video.removeEventListener("loadeddata", startPlayback);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const host = glassHostRef.current;
    if (!video || !host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;

    const tick = () => {
      syncVideoToFlutedGlass(host, video);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={rootRef}
      data-ha-video-plate
      className="absolute inset-0 overflow-hidden [transform:translateZ(0)]"
      style={{ backgroundColor: CANVAS }}
      aria-hidden
    >
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-hidden
      />
      <div ref={glassHostRef} className="absolute inset-0">
        <FlutedGlass
          {...HERO_GLASS}
          image={HERO_POSTER}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
}

type ShaderMountInternals = {
  gl: WebGLRenderingContext;
  textures: Map<string, WebGLTexture>;
  textureUnitMap: Map<string, number>;
  uniformLocations: Record<string, WebGLUniformLocation | null>;
  render: (time: number) => void;
};

function syncVideoToFlutedGlass(host: HTMLElement, video: HTMLVideoElement) {
  const mountEl = host.firstElementChild as HTMLElement & {
    paperShaderMount?: ShaderMountInternals;
  };
  const mount = mountEl?.paperShaderMount;
  if (!mount?.gl || video.readyState < 2 || video.videoWidth <= 0) return;

  const uniformName = "u_image";
  const texture = mount.textures.get(uniformName);
  if (!texture) return;

  const { gl } = mount;
  const textureUnit = mount.textureUnitMap.get(uniformName) ?? 0;

  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

  const aspectLocation = mount.uniformLocations[`${uniformName}AspectRatio`];
  if (aspectLocation) {
    gl.uniform1f(aspectLocation, video.videoWidth / video.videoHeight);
  }

  mount.render(performance.now());
}

function splitTextIntoWords(node: HTMLElement | null) {
  if (!node) return [] as HTMLElement[];

  const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (!text) return [] as HTMLElement[];

  node.textContent = "";
  return text.split(" ").map((word) => {
    const span = document.createElement("span");
    span.className = "ha-word";
    span.textContent = word;
    node.appendChild(span);
    return span;
  });
}

function FlowerIcon({ className }: { className?: string }) {
  const petals = [0, 72, 144, 216, 288];

  return (
    <svg aria-hidden className={className} viewBox="0 0 20 20" fill="none">
      {petals.map((deg) => (
        <circle
          key={deg}
          cx="10"
          cy="5.15"
          r="2.05"
          stroke={ACCENT}
          strokeWidth="1.15"
          transform={`rotate(${deg} 10 10)`}
        />
      ))}
      <circle cx="10" cy="10" r="1.55" fill={ACCENT} />
    </svg>
  );
}

function FlipLabel({ children }: { children: string }) {
  return (
    <span className="ha-flip">
      <span className="ha-flip-inner">
        <span className="ha-flip-line">{children}</span>
        <span className="ha-flip-line" aria-hidden>
          {children}
        </span>
      </span>
    </span>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.25 16.25c.85-1.65 2.35-2.5 4.75-2.5s3.9.85 4.75 2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 16 16">
      <path
        d="M3.5 12.5 12.5 3.5M5.5 3.5h7v7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
