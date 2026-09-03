"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistSans } from "geist/font/sans";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

const HERO_BG =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/support-hero/support%20bg.png";
const DASHBOARD_UI =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/support-hero/support_dashbaord_ui.png";

const NAV_LINKS = ["Home", "Docs", "Pricing", "About", "GitHub"] as const;

const RETICLE_MAGENTA = "#D600BF";

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

/** Support product hero — dark canvas, reticle pink color blend, glass nav, dashboard mock. */
export function SupportHero({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [navCompact, setNavCompact] = useState(false);
  const reduced = useReducedMotion();
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
    const root = sectionRef.current;
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
      const root = sectionRef.current;
      if (!root || !artReady) return;

      if (reduced) {
        gsap.set(
          [
            "[data-sh-bg]",
            "[data-sh-tint]",
            "[data-sh-blur]",
            "[data-sh-gradient]",
            "[data-sh-nav]",
            "[data-sh-nav-item]",
            "[data-sh-enter]",
            "[data-sh-dash]",
          ],
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", clearProps: "transform,filter" },
        );
        return;
      }

      const ctx = gsap.context(() => {
        const bg = root.querySelector<HTMLElement>("[data-sh-bg]");
        const tint = root.querySelector<HTMLElement>("[data-sh-tint]");
        const blur = root.querySelector<HTMLElement>("[data-sh-blur]");
        const gradient = root.querySelector<HTMLElement>("[data-sh-gradient]");
        const nav = root.querySelector<HTMLElement>("[data-sh-nav]");
        const navItems = gsap.utils.toArray<HTMLElement>("[data-sh-nav-item]", root);
        const enters = gsap.utils.toArray<HTMLElement>("[data-sh-enter]", root);
        const dash = root.querySelector<HTMLElement>("[data-sh-dash]");

        gsap.set(bg, { autoAlpha: 0, scale: 1.05 });
        gsap.set(tint, { autoAlpha: 0 });
        gsap.set([blur, gradient], { autoAlpha: 0 });
        gsap.set(nav, { autoAlpha: 0, y: 12 });
        gsap.set(navItems, { autoAlpha: 0, y: 10 });
        gsap.set(enters, { autoAlpha: 0, y: 18, filter: "blur(6px)" });
        gsap.set(dash, { autoAlpha: 0, y: 36, scale: 0.98 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(bg, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0)
          .to(tint, { autoAlpha: 1, duration: 1.05 }, 0.08)
          .to([blur, gradient], { autoAlpha: 1, duration: 0.85, stagger: 0.08 }, 0.12)
          .to(nav, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.1)
          .to(navItems, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.06 }, 0.18)
          .to(
            enters,
            { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.85, stagger: 0.08 },
            0.28,
          )
          .to(dash, { autoAlpha: 1, y: 0, scale: 1, duration: 1.05 }, 0.52);
      }, root);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [artReady, reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        GeistSans.className,
        "relative flex min-h-dvh w-full flex-col bg-black text-white antialiased",
        className,
      )}
    >
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
          data-sh-gradient
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
        />
      </div>

      <header className="sticky top-0 z-40 flex w-full justify-center bg-transparent px-4 pt-4 sm:px-6 sm:pt-5">
        <nav
          data-sh-nav
          className={cn(
            "support-nav flex w-full items-center justify-between border border-white/10 bg-[#151515] py-2.5 pl-5 pr-2.5 shadow-[0_2px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[40px] [border-radius:15px]",
            navCompact ? "max-w-[980px]" : "max-w-[1340px]",
          )}
          aria-label="Primary"
          data-compact={navCompact ? "true" : "false"}
        >
          <a
            data-sh-nav-item
            href="#top"
            className="shrink-0 px-2 text-[15px] font-semibold tracking-[-0.02em] text-white"
          >
            Support
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                data-sh-nav-item
                href={`#${label.toLowerCase()}`}
                className="support-link text-[13px] font-medium text-white/55 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <a
            data-sh-nav-item
            href="#start"
            className="support-btn inline-flex min-w-[84px] max-w-[480px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-white"
            style={{
              borderColor: "rgba(214, 0, 191, 0.55)",
              backgroundColor: RETICLE_MAGENTA,
            }}
          >
            Get started
            <ArrowUpRight className="size-3.5 opacity-90" />
          </a>
        </nav>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div
          data-sh-enter
          className="inline-flex items-center justify-center gap-2.5 rounded-[10px] border px-2.5 py-1.5 text-[12.5px] font-medium text-white/80 backdrop-blur-[15px]"
          style={{
            borderColor: "rgba(214, 0, 191, 0.35)",
            backgroundColor: "rgba(214, 0, 191, 0.18)",
          }}
        >
          <GitHubMark className="size-3.5 shrink-0 text-white" />
          <span>
            Proudly <span className="font-semibold text-white">Open-source</span> on GitHub.
          </span>
        </div>

        <h1
          data-sh-enter
          className="mt-5 w-full max-w-[730px] text-[clamp(2.4rem,5.5vw,4.25rem)] font-medium capitalize leading-[1.03] tracking-[-0.06em] text-white [font-feature-settings:'dlig'_on] sm:text-[68px] sm:leading-[70px] sm:tracking-[-4.08px]"
        >
          The Intelligence Layer For Your Hardware
        </h1>

        <p
          data-sh-enter
          className="mt-5 max-w-xl text-[18px] font-normal leading-6 tracking-[-1.08px] text-white/70 [font-feature-settings:'dlig'_on]"
        >
          A system of record for GPUs, NPUs, and AI-capable devices. Understand real aging, not
          assumptions.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            data-sh-enter
            href="#install"
            className="support-btn inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] px-5 py-2.5 text-[14px] font-semibold text-white"
            style={{
              borderColor: "rgba(214, 0, 191, 0.55)",
              backgroundColor: RETICLE_MAGENTA,
            }}
          >
            Install the Agent
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            data-sh-enter
            href="#github"
            className="support-btn inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-2.5 rounded-[10px] border px-5 py-2.5 text-[14px] font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-[15px]"
            style={{ borderColor: "rgba(214, 0, 191, 0.35)", backgroundColor: "rgba(214, 0, 191, 0.12)" }}
          >
            View on Github
            <ArrowUpRight className="size-3.5 opacity-80" />
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 w-full max-w-[1236px] flex-1 px-4 pb-8 sm:mt-14 sm:px-6 lg:mt-16 lg:px-8">
        <div
          data-sh-dash
          className="relative mx-auto aspect-[371/190] h-auto w-full max-w-[1236px] shrink-0 overflow-hidden rounded-[15px] border bg-black/40 shadow-[0_-8px_60px_rgba(0,0,0,0.45)] sm:h-[633px] sm:max-h-[633px]"
          style={{ borderColor: "rgba(214, 0, 191, 0.2)" }}
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
            .support-nav {
              transition: max-width 320ms cubic-bezier(0.22, 1, 0.36, 1);
            }
            .support-btn {
              transition: filter 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 200ms ease;
            }
            @media (hover: hover) and (pointer: fine) {
              .support-btn:hover {
                filter: brightness(1.08) saturate(1.05);
                box-shadow: 0 0 0 1px rgba(214, 0, 191, 0.35), 0 0 22px rgba(214, 0, 191, 0.28);
              }
              .support-btn[href="#github"]:hover {
                background: rgba(214, 0, 191, 0.22) !important;
                box-shadow: 0 0 0 1px rgba(214, 0, 191, 0.4), 0 0 18px rgba(214, 0, 191, 0.18);
              }
              .support-link:hover { color: rgba(255,255,255,0.95); }
            }
            @media (prefers-reduced-motion: reduce) {
              .support-nav,
              .support-btn {
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
