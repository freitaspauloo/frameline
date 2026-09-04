"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistSans } from "geist/font/sans";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { LogoMark } from "@/components/relay-ui";
import { cn } from "@/lib/utils";

const HERO_BG =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/support-hero/support%20bg.png";
const DASHBOARD_UI =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/support-hero/support_dashbaord_ui.png";

const NAV_LINKS = ["Home", "Docs", "Pricing", "About", "GitHub"] as const;

const RETICLE_MAGENTA = "#D600BF";
const RETICLE_INK = "#10121c";
const RETICLE_VOID = "#010003";

function readScrollY(node: HTMLElement | null, eventTarget?: EventTarget | null) {
  let y = window.scrollY || document.documentElement.scrollTop || 0;
  if (eventTarget instanceof HTMLElement) {
    y = Math.max(y, eventTarget.scrollTop || 0);
  }
  let cur: HTMLElement | null = node?.parentElement ?? null;
  while (cur) {
    y = Math.max(y, cur.scrollTop || 0);
    cur = cur.parentElement;
  }
  return y;
}

/**
 * Support product hero — dark canvas, magenta color-blend aurora, floating glass nav, dashboard mock.
 * Dev preview: `/dev/support-hero`
 */
export type SupportHeroProps = {
  className?: string;
  embed?: boolean;
};

export function SupportHero({ className, embed = false }: SupportHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const reduced = useReducedMotion();
  const [navCompact, setNavCompact] = useState(false);
  const [artReady, setArtReady] = useState(false);

  const handleArtLoad = useCallback(() => {
    setArtReady(true);
  }, []);

  useEffect(() => {
    if (reduced) {
      setArtReady(true);
      return;
    }
    const fallback = window.setTimeout(() => setArtReady(true), 700);
    return () => window.clearTimeout(fallback);
  }, [reduced]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    lastScrollY.current = readScrollY(root);

    const onScroll = (event?: Event) => {
      const y = readScrollY(root, event?.target ?? null);
      const prev = lastScrollY.current;
      const delta = y - prev;
      lastScrollY.current = y;

      if (y <= 16) {
        setNavCompact(false);
        return;
      }
      if (delta > 2) {
        setNavCompact(true);
        return;
      }
      if (delta < -2) {
        setNavCompact(false);
      }
    };

    const onResize = () => onScroll();

    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();

    return () => {
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !artReady) return;

      const targets = [
        "[data-sh-bg]",
        "[data-sh-tint]",
        "[data-sh-blur]",
        "[data-sh-vignette]",
        "[data-sh-nav]",
        "[data-sh-brand]",
        "[data-sh-nav-link]",
        "[data-sh-nav-cta]",
        "[data-sh-badge]",
        "[data-sh-headline]",
        "[data-sh-copy]",
        "[data-sh-cta]",
        "[data-sh-dash]",
      ];

      if (reduced) {
        gsap.set(targets, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform,filter" });
        return;
      }

      const ctx = gsap.context(() => {
        const bg = root.querySelector<HTMLElement>("[data-sh-bg]");
        const tint = root.querySelector<HTMLElement>("[data-sh-tint]");
        const blur = root.querySelector<HTMLElement>("[data-sh-blur]");
        const vignette = root.querySelector<HTMLElement>("[data-sh-vignette]");
        const nav = root.querySelector<HTMLElement>("[data-sh-nav]");
        const brand = root.querySelector<HTMLElement>("[data-sh-brand]");
        const navLinks = gsap.utils.toArray<HTMLElement>("[data-sh-nav-link]", root);
        const navCta = root.querySelector<HTMLElement>("[data-sh-nav-cta]");
        const badge = root.querySelector<HTMLElement>("[data-sh-badge]");
        const headline = root.querySelector<HTMLElement>("[data-sh-headline]");
        const copy = root.querySelector<HTMLElement>("[data-sh-copy]");
        const ctas = gsap.utils.toArray<HTMLElement>("[data-sh-cta]", root);
        const dash = root.querySelector<HTMLElement>("[data-sh-dash]");

        gsap.set(bg, { autoAlpha: 0, scale: 1.05 });
        gsap.set(tint, { autoAlpha: 0 });
        gsap.set(blur, { autoAlpha: 0 });
        gsap.set(vignette, { autoAlpha: 0 });
        gsap.set(nav, { autoAlpha: 0, y: -14 });
        gsap.set(brand, { autoAlpha: 0, y: -8 });
        gsap.set(navLinks, { autoAlpha: 0, y: -6 });
        gsap.set(navCta, { autoAlpha: 0, y: -8, scale: 0.96 });
        gsap.set(badge, { autoAlpha: 0, y: 18, filter: "blur(6px)" });
        gsap.set(headline, { autoAlpha: 0, y: 18, filter: "blur(6px)" });
        gsap.set(copy, { autoAlpha: 0, y: 14 });
        gsap.set(ctas, { autoAlpha: 0, y: 12 });
        gsap.set(dash, { autoAlpha: 0, y: 36, scale: 0.98 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(bg, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0)
          .to(tint, { autoAlpha: 1, duration: 0.9 }, 0.08)
          .to(blur, { autoAlpha: 1, duration: 0.8 }, 0.14)
          .to(vignette, { autoAlpha: 1, duration: 0.85 }, 0.18)
          .to(nav, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.12)
          .to(brand, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.2)
          .to(navLinks, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05 }, 0.26)
          .to(navCta, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 }, 0.34)
          .to(badge, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75 }, 0.36)
          .to(headline, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 0.44)
          .to(copy, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.54)
          .to(ctas, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.62)
          .to(dash, { autoAlpha: 1, y: 0, scale: 1, duration: 1.05 }, 0.72)
          .eventCallback("onComplete", () => {
            gsap.set([badge, headline], { clearProps: "filter" });
          });
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef, dependencies: [artReady, reduced] },
  );

  return (
    <section
      ref={rootRef}
      className={cn(
        GeistSans.className,
        "relative flex w-full flex-col text-white antialiased",
        embed ? "h-full min-h-0" : "min-h-dvh",
        className,
      )}
      style={{ backgroundColor: RETICLE_VOID }}
    >
      {/* Full-bleed aurora background + magenta color blend */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote marketing hero art */}
        <img
          data-sh-bg
          src={HERO_BG}
          alt=""
          onLoad={handleArtLoad}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          data-sh-tint
          className="absolute inset-0"
          style={{ background: RETICLE_MAGENTA, mixBlendMode: "color" }}
        />
        <div data-sh-blur className="absolute inset-0 backdrop-blur-[5px]" />
        <div
          data-sh-vignette
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
        />
      </div>

      {/* Floating glass nav — sticky; only horizontal width shrinks on scroll */}
      <header className="sticky top-0 z-40 flex w-full justify-center bg-transparent px-4 pt-4 sm:px-6 sm:pt-5">
        <nav
          data-sh-nav
          className={cn(
            "sh-nav flex w-full items-center justify-between border border-white/10 bg-[#151515]/90 py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[40px] [border-radius:15px]",
            navCompact ? "max-w-[980px]" : "max-w-[1340px]",
          )}
          aria-label="Primary"
          data-compact={navCompact ? "true" : "false"}
        >
          <a
            data-sh-brand
            href="#top"
            aria-label="frameline.ai home"
            className="flex shrink-0 items-center gap-2 px-2"
          >
            <LogoMark className="size-[18px]" />
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-white">
              frameline.ai
            </span>
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                data-sh-nav-link
                href={`#${label.toLowerCase()}`}
                className="sh-link text-[13px] font-medium text-white/55 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <a
            data-sh-nav-cta
            href="#start"
            className="sh-btn sh-btn-primary inline-flex min-w-[84px] max-w-[480px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-white"
            style={{
              borderColor: RETICLE_MAGENTA,
              backgroundColor: RETICLE_INK,
            }}
          >
            Get started
            <ArrowUpRight className="size-3.5 opacity-90" />
          </a>
        </nav>
      </header>

      {/* Hero copy */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div
          data-sh-badge
          className="inline-flex items-center justify-center gap-2.5 rounded-[10px] border border-white/20 bg-white/15 px-2.5 py-1.5 text-[12.5px] font-medium text-white/80 backdrop-blur-[15px]"
        >
          <GitHubMark className="size-3.5 shrink-0 text-white" />
          <span>
            Proudly <span className="font-semibold text-white">Open-source</span> on GitHub.
          </span>
        </div>

        <h1
          data-sh-headline
          className="mt-5 w-full max-w-[730px] text-[clamp(2.4rem,5.5vw,4.25rem)] font-medium capitalize leading-[1.03] tracking-[-0.06em] text-white [font-feature-settings:'dlig'_on] sm:text-[68px] sm:leading-[70px] sm:tracking-[-4.08px]"
        >
          The Intelligence Layer For Your Hardware
        </h1>

        <p
          data-sh-copy
          className="mt-5 max-w-xl text-[18px] font-normal leading-6 tracking-[-1.08px] text-white/70 [font-feature-settings:'dlig'_on]"
        >
          A system of record for GPUs, NPUs, and AI-capable devices. Understand real aging, not
          assumptions.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            data-sh-cta
            href="#install"
            className="sh-btn sh-btn-primary inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] px-5 py-2.5 text-[14px] font-semibold text-white"
            style={{
              borderColor: RETICLE_MAGENTA,
              backgroundColor: RETICLE_INK,
            }}
          >
            Install the Agent
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            data-sh-cta
            href="#github"
            className="sh-btn inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border border-white/20 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-[15px]"
          >
            View on Github
            <ArrowUpRight className="size-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Dashboard mock */}
      <div className="relative z-10 mx-auto mt-12 w-full max-w-[1236px] flex-1 px-4 pb-8 sm:mt-14 sm:px-6 lg:mt-16 lg:px-8">
        <div
          data-sh-dash
          className="relative mx-auto aspect-[371/190] h-auto w-full max-w-[1236px] shrink-0 overflow-hidden rounded-[15px] border border-white/10 bg-black/40 shadow-[0_-8px_60px_rgba(0,0,0,0.45)] sm:h-[633px] sm:max-h-[633px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote dashboard mock */}
          <img
            src={DASHBOARD_UI}
            alt="Support product dashboard"
            className="block h-full w-full object-cover object-top"
          />
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .sh-nav {
              transition: max-width 320ms cubic-bezier(0.22, 1, 0.36, 1);
            }
            .sh-btn {
              transition: transform 180ms ease, filter 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 200ms ease;
            }
            @media (hover: hover) and (pointer: fine) {
              .sh-btn:hover {
                transform: translateY(-1px);
                filter: brightness(1.06) saturate(1.05);
              }
              .sh-btn-primary:hover {
                background: ${RETICLE_MAGENTA} !important;
                box-shadow: 0 0 0 1px rgba(255,255,255,0.12), 0 0 22px rgba(214,0,191,0.35);
              }
              .sh-btn[href="#github"]:hover {
                border-color: rgba(214,0,191,0.45);
                box-shadow: 0 0 0 1px rgba(255,255,255,0.18), 0 0 18px rgba(214,0,191,0.2);
              }
              .sh-link:hover { color: rgba(255,255,255,0.95); }
            }
            @media (prefers-reduced-motion: reduce) {
              .sh-nav,
              .sh-btn {
                transition: none !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
