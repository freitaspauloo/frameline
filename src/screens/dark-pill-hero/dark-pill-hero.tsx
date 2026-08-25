"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistSans } from "geist/font/sans";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ReticleMark } from "@/screens/reticle-mark";

const HERO_BG =
  "https://app.paper.design/file-assets/01M08YKZXH384A258MHEFVW6GK/1VRV0MS1S2FPC67BQ96J7YNSC0.png";
const HERO_BG_FALLBACK = "/screens/dark-pill-hero/hero.png";

const NAV_LINKS = ["Portfolio", "Company", "Careers", "Inspect"] as const;
const FAB_LOGOS = ["TSMC", "ASML", "KLA", "Applied", "Lam"] as const;

const RETICLE_MAGENTA = "#D600BF";
const RETICLE_INK = "#10121c";
const RETICLE_VOID = "#010003";

export type DarkPillHeroProps = {
  className?: string;
  embed?: boolean;
};

/**
 * Dark Pill Nav Hero — cinematic wave art, segmented nav pills, yield lockup.
 * Reticle copy, magenta color blend, GSAP entrance, fab wordmarks.
 */
export function DarkPillHero({ className, embed = false }: DarkPillHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [bgSrc, setBgSrc] = useState(HERO_BG);
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

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !artReady) return;

      if (reduced) {
        gsap.set(
          [
            "[data-dph-bg]",
            "[data-dph-brand]",
            "[data-dph-nav-tab]",
            "[data-dph-nav-cta]",
            "[data-dph-headline]",
            "[data-dph-copy]",
            "[data-dph-cta]",
            "[data-dph-trust]",
            "[data-dph-logo]",
          ],
          { autoAlpha: 1, y: 0, x: 0, scale: 1, clipPath: "none", clearProps: "transform,filter" },
        );
        return;
      }

      const ctx = gsap.context(() => {
        const bg = root.querySelector<HTMLElement>("[data-dph-bg]");
        const brand = gsap.utils.toArray<HTMLElement>("[data-dph-brand]", root);
        const navTabs = gsap.utils.toArray<HTMLElement>("[data-dph-nav-tab]", root);
        const navCtas = gsap.utils.toArray<HTMLElement>("[data-dph-nav-cta]", root);
        const headline = root.querySelector<HTMLElement>("[data-dph-headline]");
        const copy = root.querySelector<HTMLElement>("[data-dph-copy]");
        const ctas = gsap.utils.toArray<HTMLElement>("[data-dph-cta]", root);
        const trust = root.querySelector<HTMLElement>("[data-dph-trust]");
        const logos = gsap.utils.toArray<HTMLElement>("[data-dph-logo]", root);

        gsap.set(bg, { autoAlpha: 0, scale: 1.06 });
        gsap.set(brand, { autoAlpha: 0, y: -14 });
        gsap.set(navTabs, { autoAlpha: 0, y: -8 });
        gsap.set(navCtas, { autoAlpha: 0, y: -8, scale: 0.96 });
        gsap.set(headline, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(copy, { autoAlpha: 0, y: 16 });
        gsap.set(ctas, { autoAlpha: 0, y: 14 });
        gsap.set(trust, { autoAlpha: 0, y: 12 });
        gsap.set(logos, { autoAlpha: 0, y: 10 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(bg, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0)
          .to(brand, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.1)
          .to(navTabs, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05 }, 0.2)
          .to(navCtas, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 }, 0.28)
          .to(
            headline,
            { clipPath: "inset(0 0% 0 0)", duration: 1.05, ease: "power4.inOut" },
            0.24,
          )
          .to(copy, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.42)
          .to(ctas, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.5)
          .to(trust, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.62)
          .to(logos, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07 }, 0.68)
          .eventCallback("onComplete", () => {
            gsap.set(headline, { clearProps: "clipPath" });
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
        "relative flex w-full flex-col overflow-hidden text-white antialiased",
        embed ? "h-full min-h-0" : "min-h-dvh",
        className,
      )}
      style={{ backgroundColor: RETICLE_VOID }}
    >
      {/* Full-bleed hero art */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- marketing hero art */}
        <img
          data-dph-bg
          src={bgSrc}
          alt=""
          onLoad={handleArtLoad}
          className="absolute inset-0 h-full w-full object-cover object-[50%_100%] scale-[1.04]"
          onError={() => {
            if (bgSrc !== HERO_BG_FALLBACK) setBgSrc(HERO_BG_FALLBACK);
          }}
        />
        <div
          data-dph-tint
          className="absolute inset-0"
          style={{ background: RETICLE_MAGENTA, mixBlendMode: "color" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[#010003]/80 to-transparent"
          aria-hidden
        />
      </div>

      {/* Nav */}
      <header className="relative z-20 flex items-center justify-between px-6 py-2.5 sm:px-10 lg:px-[60px] lg:py-2.5">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8 lg:gap-10">
          <a
            data-dph-brand
            href="#top"
            className="flex shrink-0 items-center gap-2.5"
          >
            <ReticleMark className="size-7" />
            <span className="text-[20px] font-bold tracking-[-0.04em] text-white sm:text-[24px]">
              Reticle
            </span>
          </a>

          <nav
            className="hidden items-center rounded-[15px] bg-[#1A191C] p-1 md:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((label, index) => (
              <a
                key={label}
                data-dph-nav-tab
                href={`#${label.toLowerCase()}`}
                className={cn(
                  "rounded-xl px-3.5 py-2.5 text-[15px] tracking-[-0.04em] transition-colors",
                  index === 0
                    ? "bg-[#010003] text-white/90"
                    : "text-white/60 hover:text-white/80",
                )}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            data-dph-nav-cta
            href="#login"
            className="dph-btn hidden h-12 items-center justify-center rounded-[15px] border-b-[3px] border-b-[#222222] bg-white/10 px-5 text-[15px] font-semibold tracking-[-0.04em] text-white backdrop-blur-sm sm:inline-flex"
          >
            Log in
          </a>
          <a
            data-dph-nav-cta
            href="#request"
            className="dph-btn inline-flex h-10 items-center justify-center rounded-[15px] border-b-2 border-b-[#959595] bg-white px-4 text-[14px] font-semibold tracking-[-0.04em] text-[#0B0D13] backdrop-blur-sm sm:h-12 sm:px-5 sm:text-[15px]"
          >
            Request Info
          </a>
        </div>
      </header>

      {/* Hero copy */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-10 lg:px-[50px] lg:pb-14 lg:pt-10">
        <div className="max-w-[823px]">
          <h1
            data-dph-headline
            className="max-w-[14ch] text-[clamp(2.75rem,7vw,5.3125rem)] font-normal leading-none tracking-[-0.04em] text-[#D9D9D9] sm:max-w-none lg:text-[85px]"
          >
            Yield inspection that actually scales
          </h1>

          <div className="mt-5 flex max-w-[553px] flex-col gap-5 sm:mt-6">
            <p
              data-dph-copy
              className="text-[15px] leading-[150%] tracking-[-0.04em] text-white/90"
            >
              Reticle is an all-in-one inspection platform that handles defect
              classification, access control, and real-time yield insights — so
              your fab scales without friction.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <a
                data-dph-cta
                href="#docs"
                className="dph-btn inline-flex h-[53px] items-center justify-center rounded-[15px] border-b-[3px] border-b-[#1A191C] bg-white/[0.05] px-5 text-[15px] tracking-[-0.02em] text-white"
              >
                View docs
              </a>
              <a
                data-dph-cta
                href="#request"
                className="dph-btn group inline-flex h-[53px] items-center gap-3.5 rounded-[15px] border-b-2 border-b-[#959595] bg-white py-2.5 pl-3.5 pr-3 text-[15px] font-medium tracking-[-0.02em] text-black backdrop-blur-sm"
              >
                Request Info
                <span
                  className="inline-flex items-center justify-center rounded-[7px] px-3 py-1.5 text-[15px] font-medium text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] transition-colors group-hover:bg-[#D600BF]"
                  style={{ backgroundColor: RETICLE_INK }}
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        <div
          data-dph-trust
          className="mt-auto flex flex-col gap-4 pt-12 sm:flex-row sm:items-center sm:gap-10 sm:pt-16 lg:pt-20"
        >
          <p className="max-w-[137px] text-[15px] leading-[140%] tracking-[-0.04em] text-white/50">
            Trusted by experts at leading fabs
          </p>
          <ul
            className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:gap-x-10"
            aria-label="Trusted fabs"
          >
            {FAB_LOGOS.map((name) => (
              <li key={name} data-dph-logo>
                <span className="text-[clamp(1.25rem,2.5vw,1.875rem)] font-semibold tracking-[0.06em] text-white/30 uppercase">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dph-btn {
              transition: transform 180ms ease, filter 180ms ease, background-color 180ms ease;
            }
            @media (hover: hover) and (pointer: fine) {
              .dph-btn:hover {
                transform: translateY(-2px);
                filter: saturate(1.05);
              }
              a.dph-btn[href="#request"]:hover {
                background: ${RETICLE_MAGENTA} !important;
                color: white !important;
              }
              a.dph-btn[href="#request"] span:hover,
              a.dph-btn[href="#request"]:hover span {
                background: white !important;
                color: ${RETICLE_MAGENTA} !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}
