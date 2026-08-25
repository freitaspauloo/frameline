"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GeistSans } from "geist/font/sans";
import { useRef } from "react";

import { useHoverCapable } from "@/hooks/use-hover-capable";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

import {
  ART_HOVER_SCALE,
  ART_IDLE_SCALE_MAX,
  ART_IDLE_SCALE_MIN,
  SOFTWAVE_FEATURE_CARDS,
  type SoftwaveFeatureCard,
} from "./constants";
import styles from "./softwave-feature-cards.module.css";

function measureCaptionHeight(caption: HTMLElement) {
  if (caption.scrollHeight > 0) return caption.scrollHeight;

  gsap.set(caption, { height: "auto", visibility: "hidden" });
  const height = caption.offsetHeight;
  gsap.set(caption, { height: 0, visibility: "visible", opacity: 0 });
  return height;
}

function FeatureCard({
  card,
  index,
}: {
  card: SoftwaveFeatureCard;
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLImageElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const titleLineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const hoverTween = useRef<gsap.core.Timeline | null>(null);
  const idleArtTween = useRef<gsap.core.Tween | null>(null);
  const isHovered = useRef(false);
  const canHover = useHoverCapable();
  const reduced = useReducedMotion();

  const startIdleArt = () => {
    const art = artRef.current;
    if (!art || reduced || isHovered.current) return;

    idleArtTween.current?.kill();

    idleArtTween.current = gsap.fromTo(
      art,
      { scale: ART_IDLE_SCALE_MIN, x: 0, y: 0 },
      {
        scale: ART_IDLE_SCALE_MAX,
        duration: 12 + index * 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
    );
  };

  const stopIdleArt = () => {
    idleArtTween.current?.kill();
    idleArtTween.current = null;
  };

  const setHover = (active: boolean) => {
    const art = artRef.current;
    const number = numberRef.current;
    const scrim = scrimRef.current;
    const copy = copyRef.current;
    const caption = captionRef.current;
    const card = cardRef.current;

    if (!art || !number || !scrim || !copy || !caption || !card || reduced) return;

    isHovered.current = active;

    const openHeight = measureCaptionHeight(caption);
    const lift = card.offsetHeight * 0.018;

    if (active) stopIdleArt();

    hoverTween.current?.kill();
    hoverTween.current = gsap.timeline({ defaults: { overwrite: "auto" } });

    if (active) {
      hoverTween.current
        .to(
          art,
          { scale: ART_HOVER_SCALE, x: 0, y: 0, duration: 0.9, ease: "power2.out" },
          0,
        )
        .to(
          scrim,
          { opacity: 1, duration: 0.55, ease: "power2.out" },
          0,
        )
        .to(
          copy,
          { y: -lift, duration: 0.62, ease: "power3.out" },
          0,
        )
        .to(
          caption,
          {
            height: openHeight,
            opacity: 0.5,
            y: 0,
            filter: "blur(0px)",
            duration: 0.52,
            ease: "power3.out",
          },
          0.06,
        );
      return;
    }

    hoverTween.current
      .to(
        art,
        {
          scale: ART_IDLE_SCALE_MIN,
          x: 0,
          y: 0,
          duration: 0.75,
          ease: "power2.inOut",
          onComplete: () => {
            if (!isHovered.current) startIdleArt();
          },
        },
        0,
      )
      .to(
        scrim,
        { opacity: 0, duration: 0.45, ease: "power2.in" },
        0,
      )
      .to(
        copy,
        { y: 0, duration: 0.52, ease: "power3.inOut" },
        0,
      )
      .to(
        caption,
        {
          height: 0,
          opacity: 0,
          y: card.offsetHeight * 0.008,
          filter: "blur(6px)",
          duration: 0.38,
          ease: "power2.in",
        },
        0,
      );
  };

  useGSAP(
    () => {
      const root = cardRef.current;
      const art = artRef.current;
      const number = numberRef.current;
      const scrim = scrimRef.current;
      const copy = copyRef.current;
      const caption = captionRef.current;
      const titleLines = titleLineRefs.current.filter(Boolean) as HTMLSpanElement[];

      if (!root || !art || !number || !scrim || !copy || !caption) return;

      if (reduced) {
        stopIdleArt();
        gsap.set([root, art, number, scrim, copy, caption, ...titleLines], {
          clearProps: "all",
          opacity: 1,
          height: "auto",
          filter: "none",
          y: 0,
          scale: 1,
        });
        gsap.set(scrim, { opacity: 0 });
        gsap.set(caption, { opacity: 0, height: 0 });
        return;
      }

      const enterDelay = 0.06 + index * 0.11;
      const fromScale = index % 2 === 0 ? 1.18 : 1.14;

      gsap.set(root, { autoAlpha: 0, scale: 0.94, filter: "brightness(0.72)" });
      gsap.set(art, { scale: fromScale, x: 0, y: 0, filter: "saturate(0.7)" });
      gsap.set(scrim, { opacity: 0 });
      gsap.set(number, { autoAlpha: 0, y: 28, scale: 0.92, filter: "blur(10px)" });
      gsap.set(copy, { autoAlpha: 0, y: 36, filter: "blur(8px)" });
      gsap.set(titleLines, { yPercent: 115, opacity: 0, filter: "blur(6px)" });
      gsap.set(caption, { opacity: 0, height: 0, y: 10, filter: "blur(6px)" });

      const tl = gsap.timeline({ delay: enterDelay, defaults: { ease: "power3.out" } });

      tl.to(root, {
        autoAlpha: 1,
        scale: 1,
        filter: "brightness(1)",
        duration: 0.95,
      })
        .to(
          art,
          {
            scale: ART_IDLE_SCALE_MIN,
            x: 0,
            y: 0,
            filter: "saturate(1)",
            duration: 1.15,
            ease: "power2.out",
          },
          0,
        )
        .to(
          number,
          {
            autoAlpha: 0.5,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.82,
            ease: "power4.out",
          },
          0.12,
        )
        .to(
          copy,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.78,
          },
          0.18,
        )
        .to(
          titleLines,
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.72,
            stagger: 0.07,
            ease: "power4.out",
          },
          0.22,
        )
        .call(startIdleArt);

      return () => {
        stopIdleArt();
      };
    },
    { scope: cardRef, dependencies: [index, reduced] },
  );

  return (
    <article
      ref={cardRef}
      className={styles.card}
      data-swfc-card
      tabIndex={canHover ? -1 : 0}
      onPointerEnter={() => {
        if (canHover) setHover(true);
      }}
      onPointerLeave={() => {
        if (canHover) setHover(false);
      }}
      onFocus={() => {
        if (!canHover) setHover(true);
      }}
      onBlur={() => {
        if (!canHover) setHover(false);
      }}
      aria-label={`${card.line1} ${card.line2}`}
    >
      <div className={styles.cardArtWrap} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- dev-only gradient art from Paper export */}
        <img
          ref={artRef}
          className={styles.cardArt}
          src={card.art}
          alt=""
          draggable={false}
          data-swfc-art
        />
        <div ref={scrimRef} className={styles.cardScrim} data-swfc-scrim />
      </div>

      <span ref={numberRef} className={styles.cardNumber} data-swfc-number aria-hidden>
        {card.number}
      </span>

      <div ref={copyRef} className={styles.cardCopy} data-swfc-copy>
        <h3 className={styles.cardTitle} data-swfc-title>
          {[card.line1, card.line2].map((line, lineIndex) => (
            <span key={line} className={styles.cardTitleLine}>
              <span
                ref={(node) => {
                  titleLineRefs.current[lineIndex] = node;
                }}
                className={styles.cardTitleLineInner}
                data-swfc-title-line
              >
                {line}
              </span>
            </span>
          ))}
        </h3>
        <p ref={captionRef} className={styles.cardCaption} data-swfc-caption>
          {card.caption}
        </p>
      </div>
    </article>
  );
}

/** Softwave feature cards — dev preview only, not wired into Frameline catalog. */
export function SoftwaveFeatureCards({ className }: { className?: string }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || reduced) return;

      gsap.fromTo(
        grid,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: "power1.out" },
      );
    },
    { scope: gridRef, dependencies: [reduced] },
  );

  return (
    <section
      className={cn(styles.root, GeistSans.className, className)}
      aria-label="Softwave features"
    >
      <div ref={gridRef} className={styles.grid} data-swfc-grid>
        {SOFTWAVE_FEATURE_CARDS.map((card, index) => (
          <FeatureCard key={card.number} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
