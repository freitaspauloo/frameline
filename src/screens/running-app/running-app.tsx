"use client";

import gsap from "gsap";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { useCallback, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { ScreenStage } from "@/screens/stage";

const HERO_SLIDES = [
  "/screens/running-app/hero-01.jpg",
  "/screens/running-app/hero-02.jpg",
  "/screens/running-app/hero-03.jpg",
  "/screens/running-app/hero-04.jpg",
  "/screens/running-app/hero-05.jpg",
  "/screens/running-app/hero-06.jpg",
  "/screens/running-app/hero-07.jpg",
] as const;

const NAV_LINKS = [
  { label: "Routes", badge: "12" },
  { label: "Training" },
  { label: "Pricing" },
  { label: "Stories" },
] as const;

const APP_NAME = "Passo";

const PILL_INK = "#f5f5f5";
const BADGE_BG = "#161618";

const CANVAS = "#161618";
const SLIDE_COVER = 1.04;

export type RunningAppVariant = "color" | "mono";

const THEMES = {
  color: { accent: "#d4ff00", accentInk: "#0a0a0a", grayscaleHero: false },
  mono: { accent: "#ffffff", accentInk: "#0a0a0a", grayscaleHero: true },
} as const;

export type RunningAppHeroProps = {
  className?: string;
  embed?: boolean;
  /** Dev / live pages — skip 16:9 letterboxing and fill the viewport. */
  fillViewport?: boolean;
  variant?: RunningAppVariant;
};

/**
 * Passo homepage — dark canvas, floating nav, hero card, two-column lockup.
 */
export function RunningAppHero({
  className,
  embed = false,
  fillViewport = false,
  variant = "color",
}: RunningAppHeroProps) {
  const { accent, accentInk, grayscaleHero } = THEMES[variant];
  const rootRef = useRef<HTMLElement>(null);
  const revealContentRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const brand = root.querySelector<HTMLElement>("[data-ra-brand]");
      const navPill = root.querySelector<HTMLElement>("[data-ra-nav-pill]");
      const navLinks = gsap.utils.toArray<HTMLElement>("[data-ra-nav-link]", root);
      const navActions = gsap.utils.toArray<HTMLElement>("[data-ra-nav-action]", root);
      const hero = root.querySelector<HTMLElement>("[data-ra-hero]");
      const headlineLines = gsap.utils.toArray<HTMLElement>("[data-ra-headline-line]", root);
      const headlineInners = gsap.utils.toArray<HTMLElement>("[data-ra-headline-inner]", root);
      const bodyBlock = root.querySelector<HTMLElement>("[data-ra-body-block]");
      const bodyWords = splitTextIntoWords(root.querySelector<HTMLElement>("[data-ra-body-text]"));
      const bottomCta = root.querySelector<HTMLElement>("[data-ra-bottom-cta]");

      gsap.set(brand, { autoAlpha: 0, x: -22, filter: "blur(8px)" });
      gsap.set(navPill, { autoAlpha: 0, x: 28, scale: 0.94, filter: "blur(6px)" });
      gsap.set(navLinks, { autoAlpha: 0, y: 10, rotateX: -18 });
      gsap.set(navActions, { autoAlpha: 0, scale: 0.88, y: 6 });
      gsap.set(hero, { scale: 0.988, transformOrigin: "50% 62%" });
      gsap.set(headlineLines, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(headlineInners, { yPercent: 105, transformOrigin: "0% 100%" });
      gsap.set(bodyBlock, { autoAlpha: 0, y: 22, filter: "blur(8px)" });
      gsap.set(bodyWords, { autoAlpha: 0, y: 14, filter: "blur(6px)" });
      gsap.set(bottomCta, { autoAlpha: 0, y: 16, scale: 0.92 });

      revealContentRef.current = () => {
        if (reduced) {
          gsap.set(
            [
              brand,
              navPill,
              ...navLinks,
              ...navActions,
              hero,
              ...headlineLines,
              ...headlineInners,
              bodyBlock,
              ...bodyWords,
              bottomCta,
            ],
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              yPercent: 0,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
              clipPath: "inset(0 0% 0 0)",
              clearProps: "transform,filter,clipPath",
            },
          );
          return;
        }

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(hero, { scale: 1, duration: 1.35, ease: "expo.out" }, 0)
          .to(brand, { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.85, ease: "power4.out" }, 0.02)
          .to(
            navPill,
            { autoAlpha: 1, x: 0, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "expo.out" },
            0.08,
          )
          .to(
            navLinks,
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.62,
              stagger: 0.055,
              ease: "back.out(1.35)",
            },
            0.18,
          )
          .to(
            navActions,
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.58, stagger: 0.07, ease: "back.out(1.6)" },
            0.28,
          )
          .to(
            headlineLines,
            { clipPath: "inset(0 0% 0 0)", duration: 0.95, stagger: 0.12, ease: "power4.inOut" },
            0.14,
          )
          .to(
            headlineInners,
            { yPercent: 0, duration: 1.05, stagger: 0.12, ease: "expo.out" },
            0.14,
          )
          .to(bodyBlock, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75 }, 0.42)
          .to(
            bodyWords,
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.55,
              stagger: 0.018,
              ease: "power2.out",
            },
            0.48,
          )
          .to(
            bottomCta,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.72, ease: "back.out(1.55)" },
            0.72,
          );
      };

      if (reduced) revealContentRef.current();
    }, root);

    return () => ctx.revert();
  }, []);

  const handleIntroComplete = useCallback(() => {
    revealContentRef.current?.();
  }, []);

  const page = (
    <section
      ref={rootRef}
      className={cn(
        GeistMono.className,
        variant === "mono" && "ra--mono",
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#161618] text-white antialiased uppercase",
        className,
      )}
    >
        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8">
          <div
            data-ra-nav
            className="relative z-20 mb-5 flex w-full shrink-0 items-center justify-between gap-4 sm:mb-6"
            aria-label="Primary"
          >
            <a
              data-ra-brand
              href="#top"
              className="ra-brand shrink-0 text-[13px] tracking-[-0.03em] text-white sm:text-[15px]"
            >
              <FlipLabel>{APP_NAME}</FlipLabel>
            </a>

            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              <div
                data-ra-nav-pill
                className="flex items-center gap-4 [perspective:720px] sm:gap-5"
              >
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.label}
                    data-ra-nav-link
                    href={`#${item.label.toLowerCase()}`}
                    className="ra-link inline-flex items-center gap-2 text-[11px] tracking-[0.03em] sm:text-[12px]"
                    style={{ color: PILL_INK }}
                  >
                    <FlipLabel>{item.label}</FlipLabel>
                    {"badge" in item && item.badge ? (
                      <span
                        className="ra-badge inline-flex min-w-[24px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] tracking-[0.02em] sm:text-[11px]"
                        style={{ backgroundColor: BADGE_BG, color: PILL_INK }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>

              <a
                data-ra-nav-action
                href="#account"
                className="ra-btn ra-btn-account inline-flex shrink-0 items-center justify-center text-white/85"
                aria-label="Account"
              >
                <UserIcon className="ra-btn-icon size-4 sm:size-[18px]" />
              </a>

              <a
                data-ra-nav-action
                href="#join"
                className="ra-btn ra-btn-accent inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] tracking-[0.05em] sm:px-5 sm:py-3 sm:text-[12px]"
                style={{ backgroundColor: accent, borderColor: accent, color: accentInk }}
              >
                <FlipLabel>Join</FlipLabel>
                <SendIcon className="ra-btn-icon size-3.5 sm:size-4" />
              </a>
            </div>
          </div>

          <div
            data-ra-hero
            className="relative isolate min-h-0 flex-1 overflow-hidden rounded-[20px] sm:rounded-[24px] [transform:translateZ(0)]"
          >
            <HeroSlideshow grayscale={grayscaleHero} onIntroComplete={handleIntroComplete} />
          </div>

          <div className="mt-6 grid shrink-0 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <h1
              className={cn(
                GeistSans.className,
                "min-w-0 w-full text-[clamp(1.75rem,4.2vw,3.25rem)] font-light leading-[1.04] tracking-[-0.03em] text-white normal-case sm:tracking-[-0.04em]",
              )}
            >
              <span
                data-ra-headline-line
                className="block w-fit max-w-full overflow-hidden py-[0.06em]"
              >
                <span
                  data-ra-headline-inner
                  className="block whitespace-nowrap will-change-transform"
                >
                  Built for the road.
                </span>
              </span>
              <span
                data-ra-headline-line
                className="block w-fit max-w-full overflow-hidden py-[0.06em]"
              >
                <span
                  data-ra-headline-inner
                  className="block whitespace-nowrap will-change-transform"
                >
                  Before the sun comes up.
                </span>
              </span>
            </h1>

            <div data-ra-body-block className="flex max-w-[46ch] flex-col gap-5 lg:pt-1">
              <p
                data-ra-body-text
                className="text-[11px] leading-[1.65] tracking-[0.08em] text-white/55 sm:text-[12px]"
              >
                GPS tracking, adaptive training plans, and live pace coaching for
                runners who train in every condition, on roads, trails, and track.
              </p>
              <a
                data-ra-bottom-cta
                href="#join"
                className="ra-btn ra-btn-accent inline-flex w-fit items-center gap-2.5 rounded-full border px-5 py-3 text-[11px] tracking-[0.1em] sm:text-[12px]"
                style={{ backgroundColor: accent, borderColor: accent, color: accentInk }}
              >
                <FlipLabel>Join</FlipLabel>
                <SendIcon className="ra-btn-icon size-3.5 sm:size-4" />
              </a>
            </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              .ra-flip {
                display: inline-block;
                overflow: hidden;
                height: 1.15em;
                line-height: 1.15;
                vertical-align: bottom;
                perspective: 420px;
              }
              .ra-flip-inner {
                display: block;
                transition: transform 0.52s cubic-bezier(0.19, 1, 0.22, 1);
                transform-style: preserve-3d;
              }
              .ra-flip-line {
                display: block;
                backface-visibility: hidden;
              }
              .ra-link .ra-flip-line:last-child,
              .ra-brand .ra-flip-line:last-child {
                color: ${accent};
              }
              .ra-badge {
                transition:
                  transform 0.32s cubic-bezier(0.23, 1, 0.32, 1),
                  background-color 0.32s ease,
                  color 0.32s ease;
              }
              .ra-word {
                margin-right: 0.28em;
              }
              .ra-word:last-child {
                margin-right: 0;
              }
              .ra-btn {
                transition:
                  transform 280ms cubic-bezier(0.23, 1, 0.32, 1),
                  background-color 280ms ease,
                  border-color 280ms ease,
                  color 280ms ease;
              }
              .ra-btn-icon {
                transition: transform 380ms cubic-bezier(0.19, 1, 0.22, 1);
                transform-origin: center center;
              }
              @media (hover: hover) and (pointer: fine) {
                .ra-link:hover .ra-flip-inner,
                .ra-brand:hover .ra-flip-inner,
                .ra-btn-accent:hover .ra-flip-inner {
                  transform: translateY(-50%) rotateX(-8deg);
                }
                .ra-link:hover .ra-badge {
                  transform: scale(1.08);
                  background-color: ${accent} !important;
                  color: ${accentInk} !important;
                }
                .ra-btn-account:hover {
                  transform: translateY(-1px);
                  color: ${accent};
                }
                .ra-btn-account:hover .ra-btn-icon {
                  transform: scale(1.06);
                }
                .ra-btn-accent:hover {
                  transform: translateY(-2px);
                  background-color: transparent !important;
                  color: ${accent} !important;
                }
                .ra-btn-accent:hover .ra-btn-icon {
                  transform: rotate(45deg) translate(2px, -2px) scale(1.08);
                }
              }
              @media (prefers-reduced-motion: reduce) {
                .ra-flip-inner,
                .ra-btn,
                .ra-btn-icon,
                .ra-badge {
                  transition: none;
                }
                .ra-link:hover .ra-flip-inner,
                .ra-brand:hover .ra-flip-inner,
                .ra-btn-accent:hover .ra-flip-inner {
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

export function RunningAppHeroMono(
  props: Omit<RunningAppHeroProps, "variant">,
) {
  return <RunningAppHero {...props} variant="mono" />;
}

function HeroSlideshow({
  grayscale = false,
  onIntroComplete,
}: {
  grayscale?: boolean;
  onIntroComplete?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onIntroCompleteRef = useRef(onIntroComplete);

  onIntroCompleteRef.current = onIntroComplete;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slides = gsap.utils.toArray<HTMLElement>("[data-ra-slide]", root);
    if (!slides.length) return;

    const ctx = gsap.context(() => {
      gsap.set(slides, {
        autoAlpha: 0,
        xPercent: 0,
        scale: SLIDE_COVER,
        transformOrigin: "50% 42%",
        willChange: "transform, opacity",
      });

      if (reduced) {
        gsap.set(slides[0], { autoAlpha: 1, scale: SLIDE_COVER });
        onIntroCompleteRef.current?.();
        return;
      }

      const FLASH = 0.07;
      const HOLD = 5;
      const FADE = 1.6;

      const intro = gsap.timeline();
      const loop = gsap.timeline({ repeat: -1, paused: true });

      // Phase 1 — three rapid full passes, hard cuts
      for (let pass = 0; pass < 3; pass++) {
        slides.forEach((slide, i) => {
          const whipRight = (pass * slides.length + i) % 2 === 0;
          intro.call(() => {
            gsap.set(slides, { autoAlpha: 0, zIndex: 0, xPercent: 0, scale: SLIDE_COVER });
            gsap.set(slide, {
              autoAlpha: 1,
              zIndex: 1,
              xPercent: whipRight ? 4 : -4,
              scale: 1.1,
            });
          });
          intro.to(slide, {
            xPercent: 0,
            scale: SLIDE_COVER,
            duration: FLASH * 0.55,
            ease: "power4.out",
          });
          intro.to({}, { duration: FLASH * 0.45 });
        });
      }

      // Phase 2 — smooth crossfade + Ken Burns loop
      intro.call(() => {
        gsap.set(slides, { autoAlpha: 0, xPercent: 0, zIndex: 0 });
        gsap.set(slides[0], { autoAlpha: 1, zIndex: 1, scale: 1.08 });
      });

      slides.forEach((slide, i) => {
        const next = slides[(i + 1) % slides.length];
        const zoomOut = i % 2 === 0;
        const start = i * HOLD;
        const fadeAt = start + HOLD - FADE;
        const zoomLo = SLIDE_COVER;
        const zoomHi = 1.08;

        loop.fromTo(
          slide,
          { scale: zoomOut ? zoomHi : zoomLo, immediateRender: false },
          { scale: zoomOut ? zoomLo : zoomHi, duration: HOLD, ease: "none" },
          start,
        );

        loop.to(slide, { autoAlpha: 0, duration: FADE, ease: "power2.inOut" }, fadeAt);
        loop.to(
          next,
          {
            autoAlpha: 1,
            duration: FADE,
            ease: "power2.inOut",
            scale: (i + 1) % 2 === 0 ? zoomHi : zoomLo,
          },
          fadeAt,
        );
      });

      intro.eventCallback("onComplete", () => {
        onIntroCompleteRef.current?.();
        loop.play();
      });
      intro.play();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden bg-[#161618] [transform:translateZ(0)]"
      aria-hidden
    >
      {HERO_SLIDES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- hero slideshow plate
        <img
          key={src}
          data-ra-slide
          src={src}
          alt=""
          className={cn(
            "absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] max-w-none object-cover object-center [backface-visibility:hidden]",
            grayscale && "grayscale contrast-[1.06]",
          )}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
    </div>
  );
}

function splitTextIntoWords(node: HTMLElement | null) {
  if (!node) return [] as HTMLElement[];

  const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (!text) return [] as HTMLElement[];

  node.textContent = "";
  const words = text.split(" ").map((word) => {
    const span = document.createElement("span");
    span.className = "ra-word inline-block";
    span.textContent = word;
    node.appendChild(span);
    return span;
  });

  return words;
}

function FlipLabel({ children }: { children: string }) {
  return (
    <span className="ra-flip">
      <span className="ra-flip-inner">
        <span className="ra-flip-line">{children}</span>
        <span className="ra-flip-line" aria-hidden>
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
