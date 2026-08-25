"use client";

import gsap from "gsap";
import { GeistSans } from "geist/font/sans";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ReticleMark } from "@/screens/reticle-mark";

const HERO_BG =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/mexin-hero/hero-bg.png";
const HERO_BG_FALLBACK = "/dev/mexin-hero/hero.png";

const NAV_LINKS = ["Portfolio", "Company", "Careers", "Inspect"] as const;

const FAB_LOGOS = ["TSMC", "ASML", "KLA", "Applied", "Lam"] as const;

const RETICLE_MAGENTA = "#D600BF";

/**
 * Reticle floating nav hero — dev preview only.
 * Light canvas, pill nav, magenta color-blend over abstract art, GSAP entrance.
 */
export function MexinHero({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const [bgSrc, setBgSrc] = useState(HERO_BG);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const bg = root.querySelector<HTMLElement>("[data-mx-bg]");
      const blur = root.querySelector<HTMLElement>("[data-mx-blur]");
      const gradient = root.querySelector<HTMLElement>("[data-mx-gradient]");
      const nav = root.querySelector<HTMLElement>("[data-mx-nav]");
      const navItems = gsap.utils.toArray<HTMLElement>("[data-mx-nav-item]", root);
      const enters = gsap.utils.toArray<HTMLElement>("[data-mx-enter]", root);
      const logos = gsap.utils.toArray<HTMLElement>("[data-mx-logo]", root);

      gsap.set(bg, { opacity: 0, scale: 1.04 });
      gsap.set([blur, gradient], { opacity: 0 });
      gsap.set(nav, { opacity: 0, y: 18, filter: "blur(6px)" });
      gsap.set(navItems, { opacity: 0, y: 10 });
      gsap.set(enters, { opacity: 0, y: 18, filter: "blur(6px)" });
      gsap.set(logos, { opacity: 0, y: 10 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(bg, { opacity: 1, scale: 1, duration: 1.15 }, 0)
        .to([blur, gradient], { opacity: 1, duration: 0.9, stagger: 0.08 }, 0.12)
        .to(nav, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, 0.04)
        .to(navItems, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.12)
        .to(enters, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, stagger: 0.08 }, 0.2)
        .to(logos, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.5);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn(
        GeistSans.className,
        "relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#f7f4f1] text-[#1a1a1a] antialiased",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote marketing hero art */}
        <img
          data-mx-bg
          src={bgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          onError={() => {
            if (bgSrc !== HERO_BG_FALLBACK) setBgSrc(HERO_BG_FALLBACK);
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: RETICLE_MAGENTA, mixBlendMode: "color" }}
        />
        <div data-mx-blur className="absolute inset-0 backdrop-blur-[5px]" />
        <div
          data-mx-gradient
          className="absolute inset-y-0 left-0 w-[48%] max-w-2xl bg-gradient-to-r from-[#f7f4f1]/85 via-[#f7f4f1]/35 to-transparent"
        />
      </div>

      <header className="relative z-20 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
        <nav
          data-mx-nav
          className="flex w-full max-w-[1347px] shrink-0 items-center justify-between rounded-[40px] bg-white py-[5px] pl-5 pr-2.5 shadow-[0_4px_15px_0_rgba(0,0,0,0.05)]"
          aria-label="Primary"
        >
          <a
            data-mx-nav-item
            href="#top"
            className="flex shrink-0 items-center gap-2.5"
          >
            <ReticleMark className="size-7" />
            <span className="text-[15px] font-normal tracking-[-0.04em] text-[#10121c]">
              Reticle
            </span>
          </a>

          <div className="hidden min-w-0 items-center gap-7 md:flex">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                data-mx-nav-item
                href={`#${label.toLowerCase()}`}
                className="mx-link text-[13.5px] font-medium tracking-[-0.02em] text-[#1a1a1a] transition-opacity"
              >
                {label}
              </a>
            ))}
          </div>

          <a
            data-mx-nav-item
            href="#request"
            className="mx-btn mx-nav-cta inline-flex min-w-[84px] max-w-[480px] shrink-0 items-center justify-center gap-5 rounded-[40px] border border-[rgba(214,0,191,0.34)] bg-[#10121c] py-[7px] pl-[22px] pr-[7px] text-[13px] font-semibold tracking-[-0.02em] text-white"
          >
            Request Info
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white text-[#10121c]">
              <ArrowUpRight className="size-3.5" />
            </span>
          </a>
        </nav>
      </header>

      <div className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-8 pt-28 sm:px-8 sm:pb-10 lg:px-14 lg:pb-12">
        <div className="mt-auto w-full max-w-[914px]">
          <div
            data-mx-enter
            className="inline-flex items-center gap-x-1 rounded-[5px] border border-black/10 bg-black/5 px-2.5 py-1.5 text-[12.5px] font-medium tracking-[-0.02em] text-[#2a2a2a]"
          >
            <span>Classified across</span>
            <span className="font-bold">40M+</span>
            <span>dies</span>
          </div>

          <h1
            data-mx-enter
            className="mt-5 w-full max-w-[780px] text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.015] tracking-[-0.06em] text-black/90 [font-feature-settings:'dlig'_on] sm:text-[68px] sm:leading-[69px] sm:tracking-[-4.08px]"
          >
            We build yield inspection for fabs ready to dominate production
            volume
          </h1>

          <div
            data-mx-enter
            className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <a
              href="#request"
              className="mx-btn inline-flex min-w-[84px] max-w-[480px] items-center justify-center gap-5 rounded-[40px] border border-[rgba(214,0,191,0.34)] py-2.5 pl-[25px] pr-2.5 text-[14px] font-semibold tracking-[-0.02em] text-white"
              style={{ backgroundColor: RETICLE_MAGENTA }}
            >
              Request Info
              <span
                className="inline-flex size-8 items-center justify-center rounded-full bg-white"
                style={{ color: RETICLE_MAGENTA }}
              >
                <ArrowUpRight className="size-3.5" />
              </span>
            </a>
            <a
              href="#portfolio"
              className="mx-link text-[14px] font-semibold tracking-[-0.02em] text-[#1a1a1a] underline-offset-4 transition-opacity hover:underline"
            >
              View Inspection
            </a>
          </div>
        </div>

        <div className="mt-10 flex w-full flex-col items-end justify-center gap-[60px] py-2.5 sm:mt-12">
          <ul
            className="flex max-w-full flex-row flex-wrap items-center justify-end gap-x-[18px] gap-y-4 opacity-55"
            aria-label="Trusted fabs"
          >
            {FAB_LOGOS.map((name) => (
              <li
                key={name}
                data-mx-logo
                className="flex h-[35px] w-fit items-center justify-center"
              >
                <span className="text-[13px] font-semibold tracking-[0.12em] text-[#10121c] uppercase">
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
            .mx-btn {
              transition: transform 180ms ease, filter 180ms ease, background-color 180ms ease;
            }
            @media (hover: hover) and (pointer: fine) {
              .mx-btn:hover {
                transform: translateY(-2px);
                filter: saturate(1.05);
              }
              .mx-nav-cta:hover {
                background: ${RETICLE_MAGENTA} !important;
              }
              .mx-link:hover {
                opacity: 0.65;
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
