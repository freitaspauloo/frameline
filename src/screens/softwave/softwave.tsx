"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import styles from "./softwave.module.css";

const HERO_POSTER = "/screens/softwave/hero.png";
const HERO_VIDEO = "/screens/softwave/hero.mp4";

const NAV_LINKS = [
  { label: "Archive", href: "#archive" },
  { label: "Broadcast", href: "#broadcast" },
  { label: "Studio", href: "#studio" },
] as const;

const HEADLINE_COPY = "Artificial minds, analog warmth.";
const LEDE_COPY =
  "We train models like mixtapes, layered, imperfect, unforgettable, then run them fast enough to feel like a double-click on a sunny desktop.";

function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

function AnimatedWords({
  text,
  wordClassName,
  wordDataAttr,
}: {
  text: string;
  wordClassName: string;
  wordDataAttr: string;
}) {
  const words = splitWords(text);
  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className={styles.textWordMask}>
          <span className={wordClassName} {...{ [wordDataAttr]: true }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

type FeaturePin = {
  id: string;
  label: string;
  side: "left" | "right";
  x: string;
  size: "short" | "tall";
  icon: "signal" | "list" | "playlist" | "shield";
};

const FEATURE_PINS: FeaturePin[] = [
  {
    id: "static",
    label: "Parse the static",
    icon: "signal",
    side: "left",
    x: "5.5%",
    size: "short",
  },
  {
    id: "sort",
    label: "Sort every take",
    icon: "list",
    side: "left",
    x: "21%",
    size: "tall",
  },
  {
    id: "queue",
    label: "Queue the best cuts",
    icon: "playlist",
    side: "right",
    x: "21%",
    size: "tall",
  },
  {
    id: "signal",
    label: "Hold the signal clean",
    icon: "shield",
    side: "right",
    x: "5.5%",
    size: "short",
  },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PinIcon({ name }: { name: FeaturePin["icon"] }) {
  if (name === "signal") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M19 3h2v18h-2zm-4 4h2v14h-2zm-4 4h2v10h-2zm-4 4h2v6H7zm-4 4h2v2H3z"
        />
      </svg>
    );
  }
  if (name === "list") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M6 6H4v2h2zm14 0H8v2h12zM4 11h2v2H4zm16 0H8v2h12zM4 16h2v2H4zm16 0H8v2h12z"
        />
      </svg>
    );
  }
  if (name === "playlist") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M10 13h6V5h6v4h-4v10h-8zm2 2v2h4v-2zM2 17h6v2H2zm6-4H2v2h6zM2 9h12v2H2zm12-4H2v2h12z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M4 2h16v2H4zM2 4h2v10H2zm18 0h2v10h-2zM4 14h2v2H4zm2 2h2v2H6zm4 4h4v2h-4zm10-6h-2v2h2zm-2 2h-2v2h2zm-2 2h-2v2h2zm-6 0H8v2h2z"
      />
    </svg>
  );
}

function NavFlipLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={styles.navLink} data-sw-nav-link>
      <span className={styles.navLinkClip}>
        <span className={styles.navLinkStack} data-sw-nav-stack>
          <span className={styles.navLinkLine}>{label}</span>
          <span className={styles.navLinkLine} aria-hidden>
            {label}
          </span>
        </span>
      </span>
    </a>
  );
}

function MotionToggleIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M6 6h12v12H6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  );
}

export type SoftwaveProps = {
  className?: string;
  embed?: boolean;
};

/** Softwave — vintage desktop hero with bliss hill art, pixel headline, glass pills. */
export function Softwave({ className, embed = false }: SoftwaveProps) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [artReady, setArtReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [motionPlaying, setMotionPlaying] = useState(true);

  const handleArtLoad = useCallback(() => {
    setArtReady(true);
  }, []);

  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
    setArtReady(true);
  }, []);

  const toggleMotion = useCallback(() => {
    const video = videoRef.current;
    setMotionPlaying((playing) => {
      const next = !playing;
      if (video) {
        if (next) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const nodes = [document.documentElement, document.body];
    nodes.forEach((node) => node.classList.add("softwave-active"));
    const prevTitle = document.title;
    document.title = "Softwave — Artificial minds, analog warmth.";

    const frame = requestAnimationFrame(() => setMotionReady(true));
    return () => {
      cancelAnimationFrame(frame);
      nodes.forEach((node) => node.classList.remove("softwave-active"));
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      setArtReady(true);
      setMotionPlaying(false);
      return;
    }
    const fallback = window.setTimeout(() => setArtReady(true), 250);
    return () => window.clearTimeout(fallback);
  }, [reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || !motionPlaying) {
      video?.pause();
      return;
    }

    const play = () => {
      video.play().catch(() => {});
    };

    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, [reduced, artReady, motionPlaying]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !motionReady) return;

      if (reduced) {
        gsap.set(
          [
            "[data-sw-bg]",
            "[data-sw-nav]",
            "[data-sw-headline]",
            "[data-sw-headline-word]",
            "[data-sw-lede]",
            "[data-sw-lede-word]",
            "[data-sw-cta]",
            "[data-sw-trust]",
            "[data-sw-logo]",
            "[data-sw-pin-wrap]",
            "[data-sw-pin-chip]",
            "[data-sw-pin-line]",
            "[data-sw-mobile-pin]",
            "[data-sw-motion-toggle]",
          ],
          { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform,filter" },
        );
        return;
      }

      const ctx = gsap.context(() => {
        const bg = root.querySelector<HTMLElement>("[data-sw-bg]");
        const nav = root.querySelector<HTMLElement>("[data-sw-nav]");
        const headline = root.querySelector<HTMLElement>("[data-sw-headline]");
        const headlineWords = gsap.utils.toArray<HTMLElement>(
          "[data-sw-headline-word]",
          root,
        );
        const lede = root.querySelector<HTMLElement>("[data-sw-lede]");
        const ledeWords = gsap.utils.toArray<HTMLElement>(
          "[data-sw-lede-word]",
          root,
        );
        const ctas = gsap.utils.toArray<HTMLElement>("[data-sw-cta]", root);
        const trust = root.querySelector<HTMLElement>("[data-sw-trust]");
        const logos = gsap.utils.toArray<HTMLElement>("[data-sw-logo]", root);

        gsap.set(bg, { autoAlpha: 0, scale: 1.05 });
        gsap.set(nav, { autoAlpha: 0, y: -16 });
        if (headline) gsap.set(headline, { autoAlpha: 1 });
        gsap.set(headlineWords, {
          yPercent: 120,
          rotateX: -68,
          opacity: 0,
          filter: "blur(5px)",
          transformOrigin: "50% 100%",
        });
        if (lede) gsap.set(lede, { autoAlpha: 1 });
        gsap.set(ledeWords, {
          yPercent: 110,
          opacity: 0,
          filter: "blur(4px)",
        });
        gsap.set(ctas, {
          autoAlpha: 1,
          scale: 0.86,
          y: 22,
          filter: "blur(6px)",
        });
        gsap.set(trust, { autoAlpha: 0, y: 12 });
        gsap.set(logos, { autoAlpha: 0, y: 10 });

        const pinWraps = gsap.utils.toArray<HTMLElement>(
          "[data-sw-pin-wrap]",
          root,
        );
        const mobilePins = gsap.utils.toArray<HTMLElement>(
          "[data-sw-mobile-pin]",
          root,
        );

        pinWraps.forEach((wrap) => {
          const chip = wrap.querySelector<HTMLElement>("[data-sw-pin-chip]");
          const line = wrap.querySelector<HTMLElement>("[data-sw-pin-line]");
          gsap.set(wrap, { autoAlpha: 1, y: 0 });
          if (line) {
            gsap.set(line, {
              autoAlpha: 0,
              scaleY: 0,
              transformOrigin: "top center",
            });
          }
          if (chip) {
            gsap.set(chip, { autoAlpha: 0, y: 16, filter: "blur(6px)" });
          }
        });
        gsap.set(mobilePins, { autoAlpha: 0, y: 14, scale: 0.96 });

        const motionToggle = root.querySelector<HTMLElement>(
          "[data-sw-motion-toggle]",
        );
        if (motionToggle) {
          gsap.set(motionToggle, { autoAlpha: 0, y: 12 });
        }

        const master = gsap.timeline({ defaults: { ease: "power3.out" } });

        master
          .to(bg, { autoAlpha: 1, scale: 1, duration: 1.05 }, 0)
          .to(nav, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.04)
          .to(
            headlineWords,
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.84,
              stagger: { each: 0.055, from: "start" },
              ease: "power4.out",
            },
            0.1,
          )
          .to(
            ledeWords,
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.48,
              stagger: { each: 0.018, from: "start" },
              ease: "power3.out",
            },
            0.34,
          )
          .to(
            ctas,
            {
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.62,
              stagger: 0.09,
              ease: "back.out(1.35)",
            },
            0.52,
          )
          .to(trust, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.64)
          .to(
            logos,
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 },
            0.72,
          );

        if (headlineWords.length > 0) {
          master.to(
            headlineWords,
            {
              opacity: 0.76,
              duration: 0.05,
              stagger: 0.018,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
            },
            0.74,
          );
        }

        pinWraps.forEach((wrap, index) => {
          const chip = wrap.querySelector<HTMLElement>("[data-sw-pin-chip]");
          const line = wrap.querySelector<HTMLElement>("[data-sw-pin-line]");
          const start = 0.78 + index * 0.1;

          if (line) {
            master.to(
              line,
              {
                autoAlpha: 1,
                scaleY: 1,
                duration: 0.95,
                ease: "power2.inOut",
              },
              start,
            );
          }
          if (chip) {
            master.to(
              chip,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power3.out",
              },
              start + 0.16,
            );
          }
        });

        master.to(
          mobilePins,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.84,
        );

        if (motionToggle) {
          master.to(
            motionToggle,
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
            0.96,
          );
        }

        const floatTweens = new Map<HTMLElement, gsap.core.Tween>();

        master.call(() => {
          pinWraps.forEach((wrap, index) => {
            floatTweens.set(
              wrap,
              gsap.to(wrap, {
                y: -7,
                duration: 2.7 + index * 0.35,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: index * 0.14,
              }),
            );
          });
        });

        const hoverMedia = gsap.matchMedia();
        hoverMedia.add("(hover: hover) and (pointer: fine)", () => {
          const cleanups: Array<() => void> = [];

          const navLinks = gsap.utils.toArray<HTMLElement>(
            "[data-sw-nav-link]",
            root,
          );

          navLinks.forEach((link) => {
            const stack = link.querySelector<HTMLElement>("[data-sw-nav-stack]");
            if (!stack) return;

            const onEnter = () => {
              gsap.to(stack, {
                yPercent: -50,
                duration: 0.42,
                ease: "power3.out",
                overwrite: "auto",
              });
              gsap.to(link, {
                opacity: 1,
                duration: 0.22,
                overwrite: "auto",
              });
            };

            const onLeave = () => {
              gsap.to(stack, {
                yPercent: 0,
                duration: 0.36,
                ease: "power3.inOut",
                overwrite: "auto",
              });
              gsap.to(link, {
                opacity: 0.82,
                duration: 0.22,
                overwrite: "auto",
              });
            };

            link.addEventListener("pointerenter", onEnter);
            link.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              link.removeEventListener("pointerenter", onEnter);
              link.removeEventListener("pointerleave", onLeave);
            });
          });

          pinWraps.forEach((wrap) => {
            const chip = wrap.querySelector<HTMLElement>("[data-sw-pin-chip]");
            const line = wrap.querySelector<HTMLElement>("[data-sw-pin-line]");
            const icon = chip?.querySelector<SVGElement>("svg");
            if (!chip || !line) return;

            const onEnter = () => {
              floatTweens.get(wrap)?.pause();
              gsap.set(wrap, { zIndex: 6 });
              gsap.to(wrap, {
                y: -12,
                duration: 0.48,
                ease: "power3.out",
                overwrite: "auto",
              });
              gsap.to(line, {
                scaleY: 1.18,
                duration: 0.52,
                ease: "power2.out",
                transformOrigin: "top center",
                overwrite: "auto",
              });
              gsap.to(chip, {
                y: -4,
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                borderColor: "rgba(255, 255, 255, 1)",
                color: "#101828",
                boxShadow: "0 10px 28px rgba(16, 36, 72, 0.22)",
                duration: 0.32,
                ease: "power2.out",
                overwrite: "auto",
              });
              if (icon) {
                gsap.to(icon, {
                  scale: 1.08,
                  duration: 0.28,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }
            };

            const onLeave = () => {
              gsap.set(wrap, { zIndex: "auto" });
              gsap.to(wrap, {
                y: 0,
                duration: 0.42,
                ease: "power2.inOut",
                overwrite: "auto",
                onComplete: () => {
                  floatTweens.get(wrap)?.restart();
                },
              });
              gsap.to(line, {
                scaleY: 1,
                duration: 0.38,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              gsap.to(chip, {
                y: 0,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                duration: 0.34,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              if (icon) {
                gsap.to(icon, {
                  scale: 1,
                  duration: 0.28,
                  overwrite: "auto",
                });
              }
            };

            const onMove = (event: PointerEvent) => {
              if (event.pointerType !== "mouse") return;
              const rect = wrap.getBoundingClientRect();
              if (rect.height <= 0) return;
              const t = Math.max(
                0,
                Math.min(1, (event.clientY - rect.top) / rect.height),
              );
              gsap.to(wrap, {
                y: -6 - (1 - t) * 8,
                duration: 0.22,
                ease: "power2.out",
                overwrite: "auto",
              });
              gsap.to(line, {
                scaleY: 1 + (1 - t) * 0.14,
                duration: 0.22,
                ease: "power2.out",
                transformOrigin: "top center",
                overwrite: "auto",
              });
            };

            wrap.addEventListener("pointerenter", onEnter);
            wrap.addEventListener("pointerleave", onLeave);
            wrap.addEventListener("pointermove", onMove);
            cleanups.push(() => {
              wrap.removeEventListener("pointerenter", onEnter);
              wrap.removeEventListener("pointerleave", onLeave);
              wrap.removeEventListener("pointermove", onMove);
            });
          });

          mobilePins.forEach((chip) => {
            const icon = chip.querySelector<SVGElement>("svg");

            const onEnter = () => {
              gsap.to(chip, {
                y: -5,
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                borderColor: "rgba(255, 255, 255, 1)",
                color: "#101828",
                boxShadow: "0 10px 28px rgba(16, 36, 72, 0.22)",
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
              if (icon) {
                gsap.to(icon, { scale: 1.08, duration: 0.28, overwrite: "auto" });
              }
            };

            const onLeave = () => {
              gsap.to(chip, {
                y: 0,
                scale: 1,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                duration: 0.32,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              if (icon) {
                gsap.to(icon, { scale: 1, duration: 0.28, overwrite: "auto" });
              }
            };

            chip.addEventListener("pointerenter", onEnter);
            chip.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              chip.removeEventListener("pointerenter", onEnter);
              chip.removeEventListener("pointerleave", onLeave);
            });
          });

          if (motionToggle) {
            const icon = motionToggle.querySelector<SVGElement>("svg");

            const onEnter = () => {
              gsap.to(motionToggle, {
                y: -4,
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                borderColor: "rgba(255, 255, 255, 1)",
                color: "#101828",
                boxShadow: "0 10px 28px rgba(16, 36, 72, 0.22)",
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
              if (icon) {
                gsap.to(icon, { scale: 1.08, duration: 0.28, overwrite: "auto" });
              }
            };

            const onLeave = () => {
              gsap.to(motionToggle, {
                y: 0,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                duration: 0.32,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              if (icon) {
                gsap.to(icon, { scale: 1, duration: 0.28, overwrite: "auto" });
              }
            };

            motionToggle.addEventListener("pointerenter", onEnter);
            motionToggle.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              motionToggle.removeEventListener("pointerenter", onEnter);
              motionToggle.removeEventListener("pointerleave", onLeave);
            });
          }

          return () => {
            cleanups.forEach((cleanup) => cleanup());
          };
        });

        return () => {
          hoverMedia.revert();
          floatTweens.forEach((tween) => tween.kill());
        };
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef, dependencies: [motionReady, reduced] },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      className={cn(
        styles.root,
        embed && styles.rootEmbed,
        motionReady && styles.motionReady,
        !motionPlaying && styles.motionPaused,
        className,
      )}
    >
      <div className={styles.media} aria-hidden>
        <div className={styles.heroFrame}>
          <div className={styles.heroStage} data-sw-bg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.heroPoster}
              src={HERO_POSTER}
              alt=""
              onLoad={handleArtLoad}
            />
            {!reduced ? (
              <video
                ref={videoRef}
                className={cn(
                  styles.heroVideo,
                  videoReady && motionPlaying && styles.heroVideoReady,
                )}
                poster={HERO_POSTER}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onLoadedData={handleVideoReady}
                onCanPlay={handleVideoReady}
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
            ) : null}
          </div>
        </div>
        <div className={styles.shimmer} />
        <div className={styles.vignette} />
      </div>

      <header className={styles.header}>
        <div className={styles.navBar} data-sw-nav>
          <a href="#top" className={styles.brand}>
            <span className={styles.mark} aria-hidden>
              O
            </span>
            Softwave
          </a>
          <nav className={styles.navLinks} aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavFlipLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
          <div className={styles.navEnd}>
            <a href="#waitlist" className={styles.glassBtn}>
              Join Waitlist
            </a>
          </div>
        </div>
      </header>

      <div className={styles.copy}>
        <h1 className={styles.headline} data-sw-headline>
          <AnimatedWords
            text={HEADLINE_COPY}
            wordClassName={styles.headlineWord}
            wordDataAttr="data-sw-headline-word"
          />
        </h1>
        <p className={styles.lede} data-sw-lede>
          <AnimatedWords
            text={LEDE_COPY}
            wordClassName={styles.ledeWord}
            wordDataAttr="data-sw-lede-word"
          />
        </p>
      </div>

      <div className={styles.actions}>
        <a href="#archive" className={styles.btnGhost} data-sw-cta>
          Browse the Archive
        </a>
        <a href="#waitlist" className={styles.btnPrimary} data-sw-cta>
          Get Early Access
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className={styles.trusted}>
        <p className={styles.trustedLabel} data-sw-trust>
          Backed by
        </p>
        <div className={styles.logos} aria-label="Backed by">
          <div data-sw-logo aria-hidden>
            <svg width="17" height="21" viewBox="0 0 814 1000">
              <path
                fill="#fff"
                d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.4 123.1s-85.5-39.5-163.3-39.5c-76.5 0-103.7 40.8-165.9 40.8s-109.3-57.6-156.1-127.3C46.5 791.9 0 663.4 0 541.3c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.6c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
              />
            </svg>
          </div>
          <div data-sw-logo aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
          </div>
          <div data-sw-logo aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"
              />
            </svg>
          </div>
          <div data-sw-logo aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M17.143 3.429v3.428h-3.429v3.429h-3.428V6.857H6.857V3.43H3.43v13.714H0v3.428h10.286v-3.428H6.857v-3.429h3.429v3.429h3.429v-3.429h3.428v3.429h-3.428v3.428H24v-3.428h-3.43V3.429z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.pins} aria-label="Product features">
        {FEATURE_PINS.map((pin) => (
          <div
            key={pin.id}
            className={cn(
              styles.pin,
              pin.size === "tall" ? styles.pinTall : styles.pinShort,
            )}
            data-sw-pin-wrap
            data-sw-pin-size={pin.size}
            style={{ [pin.side]: pin.x }}
          >
            <a
              href={`#${pin.id}`}
              className={styles.pinChip}
              data-sw-pin-chip
            >
              <PinIcon name={pin.icon} />
              {pin.label}
            </a>
            <div className={styles.pinLine} data-sw-pin-line />
          </div>
        ))}
      </div>

      <div className={styles.mobileChips}>
        {FEATURE_PINS.map((pin) => (
          <a
            key={pin.id}
            href={`#${pin.id}`}
            className={styles.mobileChip}
            data-sw-mobile-pin
          >
            <PinIcon name={pin.icon} />
            {pin.label}
          </a>
        ))}
      </div>

      {!reduced ? (
        <div className={styles.motionToggleWrap}>
          <button
            type="button"
            className={styles.motionToggle}
            data-sw-motion-toggle
            onClick={toggleMotion}
            aria-pressed={!motionPlaying}
          >
            <MotionToggleIcon playing={motionPlaying} />
            {motionPlaying ? "Stop Animation" : "Play Animation"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
