"use client";

import gsap from "gsap";
import { GeistSans } from "geist/font/sans";
import { useEffect, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const HERO_BG =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/axion-hero/ascii_hero_bg.webp";

const RETICLE_MAGENTA = "#D600BF";
const RETICLE_DARK = "#000000";

const NAV_LINKS = ["Portfolio", "Company", "Careers", "Inspect"] as const;
const FAB_LOGOS = ["TSMC", "ASML", "KLA", "Applied", "Lam"] as const;

const MARQUEE_FABS = Array.from({ length: 4 }, () => [...FAB_LOGOS]).flat();

type DecayParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rot: number;
  rotV: number;
};

export type ReticleAsciiHeroProps = {
  className?: string;
  embed?: boolean;
};

function DeteriorationCursor({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<DecayParticle[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const rafRef = useRef(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const spawn = (x: number, y: number, burst = 3) => {
      for (let i = 0; i < burst; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 2.4;
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 18,
          y: y + (Math.random() - 0.5) * 18,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          life: 1,
          maxLife: 0.55 + Math.random() * 0.7,
          size: 9 + Math.random() * 14,
          rot: Math.random() * Math.PI,
          rotV: (Math.random() - 0.5) * 0.18,
        });
      }
      if (particlesRef.current.length > 220) {
        particlesRef.current.splice(0, particlesRef.current.length - 220);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };

      const now = performance.now();
      if (now - lastSpawnRef.current > 16) {
        spawn(pointerRef.current.x, pointerRef.current.y, 2 + ((Math.random() * 3) | 0));
        lastSpawnRef.current = now;
      }
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    parent.addEventListener("pointerdown", onMove);

    const tick = () => {
      const { width, height } = parent.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const ptr = pointerRef.current;
      if (ptr.active) {
        const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 120);
        g.addColorStop(0, "rgba(0,0,0,0.55)");
        g.addColorStop(0.35, "rgba(214,0,191,0.22)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(ptr.x - 130, ptr.y - 130, 260, 260);

        ctx.save();
        for (let i = 0; i < 5; i++) {
          const sy = ptr.y - 50 + Math.random() * 100;
          const sh = 1 + Math.random() * 3;
          const ox = (Math.random() - 0.5) * 28;
          ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.08})`;
          ctx.fillRect(ptr.x - 90 + ox, sy, 180, sh);
          ctx.fillStyle = `rgba(214,0,191,${0.06 + Math.random() * 0.12})`;
          ctx.fillRect(ptr.x - 70 - ox, sy + 2, 140, 1);
        }
        ctx.restore();
      }

      const next: DecayParticle[] = [];
      for (const p of particlesRef.current) {
        p.life -= 0.016 / p.maxLife;
        if (p.life <= 0) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.vx *= 0.985;
        p.rot += p.rotV;

        const alpha = Math.max(0, p.life);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle =
          p.life > 0.45
            ? "rgba(255,255,255,0.85)"
            : p.life > 0.2
              ? "rgba(214,0,191,0.8)"
              : "rgba(122,16,72,0.5)";
        ctx.font = `${p.size * (0.7 + p.life * 0.5)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const jx = p.life < 0.35 ? (Math.random() - 0.5) * 4 : 0;
        const jy = p.life < 0.35 ? (Math.random() - 0.5) * 4 : 0;
        ctx.fillText("@", jx, jy);
        ctx.restore();

        next.push(p);
      }
      particlesRef.current = next;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      parent.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto absolute inset-y-0 right-0 z-[15] hidden w-1/2 touch-none lg:block",
        className,
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full cursor-default" />
    </div>
  );
}

/**
 * Dark ASCII hero — magenta color blend, @ deterioration cursor, GSAP entrance.
 */
export function ReticleAsciiHero({ className, embed = false }: ReticleAsciiHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const bg = root.querySelector<HTMLElement>("[data-ah-bg]");
      const overlay = root.querySelector<HTMLElement>("[data-ah-overlay]");
      const header = root.querySelector<HTMLElement>("[data-ah-header]");
      const navItems = gsap.utils.toArray<HTMLElement>("[data-ah-nav-item]", root);
      const enters = gsap.utils.toArray<HTMLElement>("[data-ah-enter]", root);
      const softEnters = gsap.utils.toArray<HTMLElement>("[data-ah-enter-soft]", root);
      const logos = gsap.utils.toArray<HTMLElement>("[data-ah-logo]", root);
      const cursor = root.querySelector<HTMLElement>("[data-ah-cursor]");

      gsap.set(bg, { opacity: 0, scale: 1.06 });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(header, { opacity: 0, y: -14, filter: "blur(6px)" });
      gsap.set(navItems, { opacity: 0, y: 8 });
      gsap.set(enters, { opacity: 0, y: 22, filter: "blur(8px)" });
      gsap.set(softEnters, { opacity: 0, y: 14 });
      gsap.set(logos, { opacity: 0, y: 10 });
      gsap.set(cursor, { opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(bg, { opacity: 1, scale: 1, duration: 1.2 }, 0)
        .to(overlay, { opacity: 1, duration: 0.95 }, 0.08)
        .to(header, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, 0.1)
        .to(navItems, { opacity: 1, y: 0, duration: 0.65, stagger: 0.06 }, 0.18)
        .to(enters, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.09 }, 0.24)
        .to(softEnters, { opacity: 1, y: 0, duration: 0.75, stagger: 0.07 }, 0.38)
        .to(logos, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.52)
        .to(cursor, { opacity: 1, duration: 0.8 }, 0.65);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn(
        GeistSans.className,
        "relative overflow-hidden text-white antialiased",
        embed ? "h-full min-h-0" : "min-h-dvh",
        className,
      )}
      style={{ backgroundColor: RETICLE_DARK }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ah-marquee {
              from { transform: translateX(-50%); }
              to { transform: translateX(0); }
            }
            .ah-marquee-track {
              animation: ah-marquee 28s linear infinite;
              width: max-content;
            }
            .ah-marquee-track:hover {
              animation-play-state: paused;
            }
            .ah-btn {
              transition: transform 180ms ease, filter 180ms ease, background-color 180ms ease, color 180ms ease;
            }
            .ah-cta-white {
              transition: transform 180ms ease, background-color 180ms ease, color 180ms ease;
            }
            @media (hover: hover) and (pointer: fine) {
              .ah-btn:hover {
                transform: translateY(-2px);
                filter: saturate(1.08);
              }
              .ah-cta-white:hover {
                background-color: ${RETICLE_MAGENTA};
                color: #fff;
              }
              .ah-link:hover {
                color: rgba(255,255,255,0.95);
              }
            }
          `,
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote hero art */}
        <img
          data-ah-bg
          src={HERO_BG}
          alt=""
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          data-ah-overlay
          className="absolute inset-0"
          style={{ background: RETICLE_MAGENTA, mixBlendMode: "color" }}
        />
        <div className="absolute inset-y-0 left-0 w-[52%] max-w-2xl bg-gradient-to-r from-black/92 via-black/55 to-transparent" />
      </div>

      <div data-ah-cursor>
        <DeteriorationCursor />
      </div>

      <header
        data-ah-header
        className={cn(
          GeistSans.className,
          "relative z-20 bg-[#050B11]/45 backdrop-blur-md supports-[backdrop-filter]:bg-[#050B11]/30",
        )}
      >
        <div
          className={cn(
            GeistSans.className,
            "mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6 lg:px-10",
          )}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-[0.08em] text-white">
              Reticle
            </span>
          </div>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                data-ah-nav-item
                href={`#${label.toLowerCase()}`}
                className="text-[12px] font-medium tracking-wide text-zinc-400 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            data-ah-nav-item
            href="#request"
            className="ah-cta-white inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-[12px] font-semibold text-zinc-950"
          >
            Request Info
          </a>
        </div>
      </header>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-[1200px] flex-col px-6 sm:px-8 lg:px-10">
        <div className="grid flex-1 items-center gap-8 pb-12 pt-8 sm:gap-10 sm:pb-14 lg:grid-cols-2 lg:gap-8 lg:pb-16 lg:pt-6">
          <div className="pointer-events-auto relative z-10 max-w-xl">
            <div
              data-ah-enter
              className="inline-flex items-center gap-2 px-0 py-1.5 text-[11px] font-medium tracking-[0.06em] text-white/70 uppercase"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: RETICLE_MAGENTA }}
                aria-hidden
              />
              Classified across <span className="font-bold text-white">40M+</span> dies
            </div>

            <h1
              data-ah-enter
              className={cn(
                GeistSans.className,
                "mt-5 max-w-[26rem] text-[clamp(2.25rem,5.5vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.05em] text-white sm:max-w-[28rem]",
              )}
            >
              Catch killer defects before
              <br />
              they leave the line
            </h1>

            <p
              data-ah-enter
              className="mt-4 max-w-md text-[14px] leading-relaxed text-white/50 sm:text-[15px]"
            >
              In-line classification, ranked review, and fab-native inspection built for
              production volume.
            </p>

            <div data-ah-enter className="mt-6 flex flex-wrap items-center gap-3">
              <a
                id="request"
                href="#request"
                className="ah-btn ah-cta-white inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-[13px] font-semibold text-zinc-950"
              >
                Request Info
                <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href="#inspect"
                className="ah-link inline-flex h-11 items-center rounded-lg border border-white/12 bg-white/[0.04] px-5 text-[13px] font-medium text-white/85 transition-colors hover:bg-white/[0.08]"
              >
                View Inspection
              </a>
            </div>

            <div className="mt-12 w-full max-w-[20rem] sm:mt-14 sm:max-w-[22rem]">
              <p
                data-ah-enter-soft
                className="text-[11px] font-medium tracking-[0.14em] text-white/35 uppercase"
              >
                Trusted fabs
              </p>
              <div
                data-ah-enter-soft
                className="relative mt-3.5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
              >
                <div className="ah-marquee-track flex opacity-60">
                  {[0, 1].map((copy) => (
                    <div
                      key={copy}
                      className="flex shrink-0 items-center gap-x-7 pr-7"
                      aria-hidden={copy === 1}
                    >
                      {MARQUEE_FABS.map((name, index) => (
                        <span
                          key={`${copy}-${name}-${index}`}
                          data-ah-logo
                          className="shrink-0 text-[13px] font-semibold tracking-[0.12em] text-white/70 uppercase"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden min-h-[20rem] lg:block" aria-hidden />
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
