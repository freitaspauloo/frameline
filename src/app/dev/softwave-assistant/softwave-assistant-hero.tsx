"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistSans } from "geist/font/sans";
import { GeistPixelSquare } from "geist/font/pixel";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

import { DitherField } from "@/screens/bridge-dither/dither-field";
import {
  BACKER_LOGOS,
  COMPOSE_PLACEHOLDER,
  DITHER_SRC,
  HEADLINE,
  NAV_LINKS,
  QUICK_ACTIONS,
  SOCIAL_PROOF,
  SUBHEADLINE,
  TRUST_LABEL,
} from "./constants";
import styles from "./softwave-assistant-hero.module.css";

const AVATAR_COLORS = ["#5475b8", "#7c9fd4", "#3d5f9e"] as const;

/** Softwave Assistant Hero — dev preview only, not in Frameline catalog. */
export function SoftwaveAssistantHero({ className }: { className?: string }) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [artReady, setArtReady] = useState(false);

  const handleArtReady = useCallback(() => {
    setArtReady(true);
  }, []);

  useEffect(() => {
    if (reduced) {
      setArtReady(true);
      return;
    }
    const fallback = window.setTimeout(() => setArtReady(true), 900);
    return () => window.clearTimeout(fallback);
  }, [reduced]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !artReady) return;

      if (reduced) {
        gsap.set(
          [
            "[data-swa-dither]",
            "[data-swa-brand]",
            "[data-swa-nav]",
            "[data-swa-headline]",
            "[data-swa-copy]",
            "[data-swa-cta]",
            "[data-swa-proof]",
            "[data-swa-compose]",
            "[data-swa-quick]",
            "[data-swa-trust]",
            "[data-swa-logo]",
          ],
          { autoAlpha: 1, y: 0, clearProps: "transform" },
        );
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set("[data-swa-dither]", { autoAlpha: 0, scale: 1.04 });
        gsap.set("[data-swa-brand]", { autoAlpha: 0, y: -12 });
        gsap.set("[data-swa-nav]", { autoAlpha: 0, y: -8 });
        gsap.set("[data-swa-headline]", { autoAlpha: 0, y: 18 });
        gsap.set("[data-swa-copy]", { autoAlpha: 0, y: 14 });
        gsap.set("[data-swa-cta]", { autoAlpha: 0, y: 12, scale: 0.96 });
        gsap.set("[data-swa-proof]", { autoAlpha: 0, y: 10 });
        gsap.set("[data-swa-compose]", { autoAlpha: 0, y: 24, scale: 0.98 });
        gsap.set("[data-swa-quick]", { autoAlpha: 0, y: 12 });
        gsap.set("[data-swa-trust]", { autoAlpha: 0, y: 10 });
        gsap.set("[data-swa-logo]", { autoAlpha: 0, y: 8 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-swa-dither]", { autoAlpha: 1, scale: 1, duration: 1.1 }, 0.08)
          .to("[data-swa-brand]", { autoAlpha: 1, y: 0, duration: 0.5 }, 0.12)
          .to("[data-swa-nav]", { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.05 }, 0.18)
          .to("[data-swa-headline]", { autoAlpha: 1, y: 0, duration: 0.65 }, 0.22)
          .to("[data-swa-copy]", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.32)
          .to("[data-swa-cta]", { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, 0.4)
          .to("[data-swa-proof]", { autoAlpha: 1, y: 0, duration: 0.45 }, 0.48)
          .to("[data-swa-compose]", { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.4)" }, 0.52)
          .to("[data-swa-quick]", { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 }, 0.62)
          .to("[data-swa-trust]", { autoAlpha: 1, y: 0, duration: 0.4 }, 0.72)
          .to("[data-swa-logo]", { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0.78);
      }, root);

      return () => ctx.revert();
    },
    { scope, dependencies: [artReady, reduced] },
  );

  return (
    <section
      ref={scope}
      className={cn(
        GeistSans.className,
        styles.root,
        "relative min-h-dvh w-full overflow-x-hidden bg-white text-zinc-950 antialiased",
        className,
      )}
    >
      <header className="relative z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <a
            href="#top"
            data-swa-brand
            className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em]"
          >
            <span className={styles.mark} aria-hidden>
              O
            </span>
            Softwave
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                data-swa-nav
                className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#waitlist"
            data-swa-nav
            className="inline-flex h-9 items-center justify-center rounded-full border border-[rgba(84,117,184,0.34)] bg-[#10121c] px-4 text-[13px] font-semibold tracking-[-0.02em] text-white"
          >
            Join Waitlist
          </a>
        </div>
      </header>

      <div className="relative z-20 mx-auto flex w-full max-w-[820px] flex-col items-center px-5 pb-10 pt-10 text-center sm:px-8 sm:pb-12 sm:pt-12">
        <h1
          data-swa-headline
          className={cn(
            GeistPixelSquare.className,
            "max-w-[18ch] text-[clamp(2rem,5.8vw,3.75rem)] leading-[1.08] tracking-[-0.04em] text-zinc-950 sm:max-w-[22ch]",
          )}
        >
          {HEADLINE}
        </h1>

        <p
          data-swa-copy
          className="mt-4 max-w-[42rem] text-[15px] leading-relaxed text-zinc-500 sm:text-base"
        >
          {SUBHEADLINE}
        </p>

        <div data-swa-cta className="mt-7">
          <a href="#waitlist" className={styles.ctaPrimary}>
            Get Early Access
            <span className={styles.ctaIcon} aria-hidden>
              <ArrowUpRight />
            </span>
          </a>
        </div>

        <div
          data-swa-proof
          className="mt-5 inline-flex items-center gap-2.5 text-[13px] font-medium text-zinc-600"
        >
          <div className={styles.avatarStack} aria-hidden>
            {AVATAR_COLORS.map((color) => (
              <span
                key={color}
                className={styles.avatar}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span>{SOCIAL_PROOF}</span>
        </div>
      </div>

      <div className={styles.ditherBand}>
        <div data-swa-dither className="absolute inset-0">
          <DitherField
            src={DITHER_SRC}
            cellSize={3}
            disturbRadius={40}
            className="z-0"
            onReady={handleArtReady}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "#5475b8", mixBlendMode: "color", opacity: 0.72 }}
            aria-hidden
          />
        </div>

        <div className={styles.composeShell}>
          <div data-swa-compose className={styles.composeBox}>
            <div className={styles.composeInput}>{COMPOSE_PLACEHOLDER}</div>
            <div className={styles.composeToolbar}>
              <span className={styles.attachBtn}>
                <AtIcon />
                Attach
              </span>
              <span className={styles.toolSelect}>
                Select tool
                <ChevronDown />
              </span>
              <button type="button" className={styles.submitBtn} aria-label="Send">
                <ArrowUp />
              </button>
            </div>
          </div>

          <div className={styles.quickActions}>
            {QUICK_ACTIONS.map((label) => (
              <span key={label} data-swa-quick className={styles.quickAction}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-20 px-5 pb-10 pt-8 text-center sm:px-8">
        <p data-swa-trust className="text-[12px] font-medium text-zinc-400">
          {TRUST_LABEL}
        </p>
        <ul className={cn(styles.logoRow, "mt-4")} aria-label="Trusted by">
          {BACKER_LOGOS.map((name) => (
            <li key={name} data-swa-logo>
              <span className={styles.logoWord}>{name}</span>
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
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

function ArrowUp() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
      <path
        d="M8 12V4M8 4 4.5 7.5M8 4l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
      <path
        d="M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.5 6.5V9a2 2 0 0 0 4 0V8a6 6 0 1 0-2.2 4.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3 opacity-60">
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
