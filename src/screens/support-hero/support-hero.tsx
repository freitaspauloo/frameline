"use client";

import { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const HERO_BG =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/support-hero/support%20bg.png";
const DASHBOARD_UI =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/support-hero/support_dashbaord_ui.png";

const NAV_LINKS = ["Home", "Docs", "Pricing", "About", "GitHub"] as const;

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
 * Support product hero — dark canvas, teal aurora bg, floating glass nav, dashboard mock.
 * Dev preview: `/dev/support-hero`
 */
const NAV_LINK_DELAYS = ["support-d2", "support-d3", "support-d3", "support-d4", "support-d4"] as const;

export type SupportHeroProps = {
  className?: string;
};

export function SupportHero({ className }: SupportHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [navCompact, setNavCompact] = useState(false);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    lastScrollY.current = readScrollY(root);

    const onScroll = (event?: Event) => {
      const y = readScrollY(root, event?.target ?? null);
      const prev = lastScrollY.current;
      const delta = y - prev;
      lastScrollY.current = y;

      // Shrink only while scrolling down; expand immediately on scroll up.
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

    // Capture catches nested preview scrollers (overflow-y-auto parents).
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

  return (
    <section
      ref={sectionRef}
      className={cn(
        inter.className,
        "relative flex min-h-dvh w-full flex-col bg-black text-white antialiased",
        motionReady && "support-motion-ready",
        className,
      )}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes support-enter {
              from { opacity: 0; transform: translateY(18px); filter: blur(6px); }
              to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            @keyframes support-enter-soft {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes support-bg-enter {
              from { opacity: 0; transform: scale(1.05); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes support-fade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes support-dash-enter {
              from { opacity: 0; transform: translateY(36px) scale(0.98); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .support-motion-ready .support-enter {
              animation: support-enter 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .support-motion-ready .support-enter-soft {
              animation: support-enter-soft 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .support-motion-ready .support-bg-enter {
              animation: support-bg-enter 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .support-motion-ready .support-fade {
              animation: support-fade 1s ease both;
            }
            .support-motion-ready .support-dash-enter {
              animation: support-dash-enter 1.05s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .support-enter,
            .support-enter-soft,
            .support-bg-enter,
            .support-fade,
            .support-dash-enter {
              opacity: 0;
            }
            .support-d0 { animation-delay: 40ms; }
            .support-d1 { animation-delay: 120ms; }
            .support-d2 { animation-delay: 200ms; }
            .support-d3 { animation-delay: 280ms; }
            .support-d4 { animation-delay: 360ms; }
            .support-d5 { animation-delay: 440ms; }
            .support-d6 { animation-delay: 540ms; }
            .support-d7 { animation-delay: 640ms; }
            .support-d8 { animation-delay: 760ms; }
            .support-d9 { animation-delay: 900ms; }
            .support-btn {
              transition: filter 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 200ms ease, padding 220ms ease, font-size 220ms ease;
            }
            .support-nav {
              transition: max-width 320ms cubic-bezier(0.22, 1, 0.36, 1);
            }
            @media (hover: hover) and (pointer: fine) {
              .support-btn:hover {
                filter: brightness(1.08) saturate(1.05);
                box-shadow: 0 0 0 1px rgba(255,255,255,0.12), 0 0 22px rgba(0,157,242,0.22);
              }
              .support-btn[href="#github"]:hover {
                box-shadow: 0 0 0 1px rgba(255,255,255,0.18), 0 0 18px rgba(255,255,255,0.12);
              }
              .support-link:hover { color: rgba(255,255,255,0.95); }
            }
            @media (prefers-reduced-motion: reduce) {
              .support-enter,
              .support-enter-soft,
              .support-bg-enter,
              .support-fade,
              .support-dash-enter {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
                filter: none !important;
              }
              .support-nav,
              .support-btn {
                transition: none !important;
              }
            }
          `,
        }}
      />

      {/* Full-bleed aurora background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote marketing hero art */}
        <img
          src={HERO_BG}
          alt=""
          className="support-bg-enter support-d0 absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="support-fade support-d1 absolute inset-0 backdrop-blur-[5px]" />
        <div className="support-fade support-d2 absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
      </div>

      {/* Floating glass nav — sticky; only horizontal width shrinks on scroll */}
      <header className="support-enter-soft support-d1 sticky top-0 z-40 flex w-full justify-center bg-transparent px-4 pt-4 sm:px-6 sm:pt-5">
        <nav
          className={cn(
            "support-nav flex w-full items-center justify-between border border-white/10 bg-[#151515] py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[40px] [border-radius:15px]",
            navCompact ? "max-w-[980px]" : "max-w-[1340px]",
          )}
          aria-label="Primary"
          data-compact={navCompact ? "true" : "false"}
        >
          <a
            href="#top"
            className="support-enter-soft support-d2 shrink-0 px-2 text-[15px] font-semibold tracking-[-0.02em] text-white"
          >
            Support
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
            {NAV_LINKS.map((label, index) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className={cn(
                  "support-enter-soft support-link text-[13px] font-medium text-white/55 transition-colors",
                  NAV_LINK_DELAYS[index],
                )}
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="#start"
            className="support-enter-soft support-d5 support-btn inline-flex min-w-[84px] max-w-[480px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-[#009DF2] bg-[#0072AF] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-white"
          >
            Get started
            <ArrowUpRight className="size-3.5 opacity-90" />
          </a>
        </nav>
      </header>

      {/* Hero copy */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="support-enter support-d4 inline-flex items-center justify-center gap-2.5 rounded-[10px] border border-white/20 bg-white/15 px-2.5 py-1.5 text-[12.5px] font-medium text-white/80 backdrop-blur-[15px]">
          <GitHubMark className="size-3.5 shrink-0 text-white" />
          <span>
            Proudly <span className="font-semibold text-white">Open-source</span> on GitHub.
          </span>
        </div>

        <h1 className="support-enter support-d5 mt-5 w-full max-w-[730px] text-[clamp(2.4rem,5.5vw,4.25rem)] font-medium capitalize leading-[1.03] tracking-[-0.06em] text-white [font-feature-settings:'dlig'_on] sm:text-[68px] sm:leading-[70px] sm:tracking-[-4.08px]">
          The Intelligence Layer For Your Hardware
        </h1>

        <p className="support-enter support-d6 mt-5 max-w-xl text-[18px] font-normal leading-6 tracking-[-1.08px] text-white/70 [font-feature-settings:'dlig'_on]">
          A system of record for GPUs, NPUs, and AI-capable devices. Understand real aging, not
          assumptions.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#install"
            className="support-enter support-d7 support-btn inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-[#009DF2] bg-[#0072AF] px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            Install the Agent
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href="#github"
            className="support-enter support-d8 support-btn inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border border-white/20 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-[15px]"
          >
            View on Github
            <ArrowUpRight className="size-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Dashboard mock */}
      <div className="relative z-10 mx-auto mt-12 w-full max-w-[1236px] flex-1 px-4 pb-8 sm:mt-14 sm:px-6 lg:mt-16 lg:px-8">
        <div className="support-dash-enter support-d9 relative mx-auto aspect-[371/190] h-auto w-full max-w-[1236px] shrink-0 overflow-hidden rounded-[15px] border border-white/10 bg-black/40 shadow-[0_-8px_60px_rgba(0,0,0,0.45)] sm:h-[633px] sm:max-h-[633px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote dashboard mock */}
          <img
            src={DASHBOARD_UI}
            alt="Support product dashboard"
            className="block h-full w-full object-cover object-top"
          />
        </div>
      </div>
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
