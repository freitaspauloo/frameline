"use client";

import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const ORANGE_DOT = "#EA580C";
const ORANGE_RGB = [234, 88, 12] as const;

const NAV_LINKS = ["Solutions", "Work", "About", "Insights"] as const;

const BRIDGE_SRC =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/oasis-hero/bridge-dither.png";

const PROGRESSIVE_WHITE_STEPS = [
  { alpha: 0.72, from: "0%", to: "38%" },
  { alpha: 0.45, from: "8%", to: "52%" },
  { alpha: 0.28, from: "20%", to: "68%" },
  { alpha: 0.14, from: "36%", to: "84%" },
  { alpha: 0.06, from: "55%", to: "100%" },
] as const;

/** Stepped progressive white fade — works in overlay iframes (no backdrop-filter). */
function ProgressiveBlurEdge({
  edge,
  className,
}: {
  edge: "top" | "bottom";
  className?: string;
}) {
  const dir = edge === "top" ? "to bottom" : "to top";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-0 w-full",
        edge === "top" ? "top-0" : "bottom-0",
        className,
      )}
      aria-hidden
    >
      {PROGRESSIVE_WHITE_STEPS.map((step) => (
        <div
          key={`${edge}-${step.alpha}`}
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(255,255,255,${step.alpha})`,
            maskImage: `linear-gradient(${dir}, black ${step.from}, transparent ${step.to})`,
            WebkitMaskImage: `linear-gradient(${dir}, black ${step.from}, transparent ${step.to})`,
          }}
        />
      ))}
    </div>
  );
}

type Dot = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
};

type DitherFieldProps = {
  src: string;
  className?: string;
  cellSize?: number;
  disturbRadius?: number;
};

function DitherField({
  src,
  className,
  cellSize = 3,
  disturbRadius = 150,
}: DitherFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!canvas || !wrap || !img) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dots: Dot[] = [];
    let raf = 0;
    let running = true;
    let dpr = 1;
    let width = 0;
    let height = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let targetX = -9999;
    let targetY = -9999;
    let hasPointer = false;
    let frameReady = false;
    let allowParticles = false;
    let canvasShowsArt = false;
    let dotSize = 2;
    let objectUrl: string | null = null;
    let artBitmap: ImageBitmap | HTMLImageElement | null = null;

    const rest = document.createElement("canvas");
    const restCtx = rest.getContext("2d", { alpha: false });
    if (!restCtx) return;

    const sample = document.createElement("canvas");
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });

    const syncImgFit = (frameW: number) => {
      if (frameW >= 1024) {
        img.style.objectFit = "cover";
        img.style.objectPosition = "center center";
      } else {
        img.style.objectFit = "contain";
        img.style.objectPosition = "center bottom";
      }
    };

    const setCanvasVisible = (visible: boolean) => {
      canvasShowsArt = visible;
      canvas.style.opacity = visible ? "1" : "0";
    };

    const measureFrame = () => {
      const parent = wrap.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      const nextW = Math.max(
        1,
        Math.floor(parentRect?.width || wrap.getBoundingClientRect().width || window.innerWidth),
      );
      const nextH = Math.max(
        1,
        Math.floor(
          parentRect?.height ||
            wrap.getBoundingClientRect().height ||
            Math.min(window.innerHeight, document.documentElement.clientHeight),
        ),
      );
      return { nextW, nextH };
    };

    const blitRest = () => {
      if (!frameReady || rest.width === 0 || rest.height === 0) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(rest, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const sizeSurfaces = () => {
      const { nextW, nextH } = measureFrame();
      width = nextW;
      height = nextH;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      syncImgFit(width);

      wrap.style.width = "100%";
      wrap.style.height = "100%";
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      rest.width = Math.floor(width * dpr);
      rest.height = Math.floor(height * dpr);
      restCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      restCtx.fillStyle = "#ffffff";
      restCtx.fillRect(0, 0, width, height);
    };

    const bitmapSize = (bitmap: ImageBitmap | HTMLImageElement) => {
      if ("naturalWidth" in bitmap) {
        return { iw: bitmap.naturalWidth, ih: bitmap.naturalHeight };
      }
      return { iw: bitmap.width, ih: bitmap.height };
    };

    const rebuild = () => {
      try {
        sizeSurfaces();

        const bitmap = artBitmap;
        if (!bitmap) {
          dots = [];
          allowParticles = false;
          frameReady = false;
          setCanvasVisible(false);
          return;
        }

        const { iw, ih } = bitmapSize(bitmap);
        if (iw === 0 || ih === 0) {
          dots = [];
          allowParticles = false;
          frameReady = false;
          setCanvasVisible(false);
          return;
        }

        const fillWidth = width >= 1024;
        const scale = fillWidth ? width / iw : Math.min(width / iw, height / ih);
        const drawW = Math.max(1, Math.round(iw * scale));
        const drawH = Math.max(1, Math.round(ih * scale));
        const dx = Math.floor((width - drawW) / 2);
        const dy = fillWidth ? Math.floor((height - drawH) / 2) : Math.max(0, height - drawH);

        const step = Math.max(2, Math.round(cellSize));
        dotSize = step;

        restCtx.imageSmoothingEnabled = false;
        restCtx.drawImage(bitmap, 0, 0, iw, ih, dx, dy, drawW, drawH);

        const recolor = restCtx.getImageData(0, 0, width, height);
        const px = recolor.data;
        for (let i = 0; i < px.length; i += 4) {
          const lum =
            0.2126 * (px[i] ?? 255) + 0.7152 * (px[i + 1] ?? 255) + 0.0722 * (px[i + 2] ?? 255);
          if (lum < 128) {
            px[i] = ORANGE_RGB[0];
            px[i + 1] = ORANGE_RGB[1];
            px[i + 2] = ORANGE_RGB[2];
          }
        }
        restCtx.putImageData(recolor, 0, 0);

        const wash = restCtx.createLinearGradient(0, 0, width * 0.38, 0);
        wash.addColorStop(0, "rgba(255,255,255,0.55)");
        wash.addColorStop(0.55, "rgba(255,255,255,0.18)");
        wash.addColorStop(1, "rgba(255,255,255,0)");
        restCtx.fillStyle = wash;
        restCtx.fillRect(0, 0, width * 0.42, height);

        frameReady = true;
        blitRest();
        setCanvasVisible(true);

        if (!sampleCtx) {
          dots = [];
          allowParticles = false;
          return;
        }

        sample.width = width;
        sample.height = height;
        sampleCtx.setTransform(1, 0, 0, 1, 0, 0);
        sampleCtx.drawImage(rest, 0, 0, rest.width, rest.height, 0, 0, width, height);

        let data: Uint8ClampedArray;
        try {
          data = sampleCtx.getImageData(0, 0, width, height).data;
        } catch {
          dots = [];
          allowParticles = false;
          return;
        }

        const next: Dot[] = [];
        const x0 = Math.max(0, dx);
        const y0 = Math.max(0, dy);
        const x1 = Math.min(width, dx + drawW);
        const y1 = Math.min(height, dy + drawH);

        for (let y = y0; y < y1; y += step) {
          for (let x = x0; x < x1; x += step) {
            let sum = 0;
            let count = 0;
            for (let oy = 0; oy < step; oy++) {
              for (let ox = 0; ox < step; ox++) {
                const ix = Math.min(width - 1, x + ox);
                const iy = Math.min(height - 1, y + oy);
                const i = (iy * width + ix) * 4;
                sum +=
                  0.2126 * (data[i] ?? 255) +
                  0.7152 * (data[i + 1] ?? 255) +
                  0.0722 * (data[i + 2] ?? 255);
                count++;
              }
            }
            const lum = sum / Math.max(1, count);
            if (lum > 110) continue;

            next.push({
              x,
              y,
              baseX: x,
              baseY: y,
              vx: 0,
              vy: 0,
            });
          }
        }

        dots = next;
        allowParticles = next.length > 0;
      } catch (error) {
        console.error("[DitherField] failed to build field", error);
        dots = [];
        allowParticles = false;
        frameReady = false;
        setCanvasVisible(false);
      }
    };

    const syncPointer = (clientX: number, clientY: number) => {
      const rect = wrap.getBoundingClientRect();
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!inside) {
        hasPointer = false;
        targetX = -9999;
        targetY = -9999;
        return;
      }

      hasPointer = true;
      targetX = clientX - rect.left;
      targetY = clientY - rect.top;
    };

    const onPointerMove = (event: PointerEvent) => {
      syncPointer(event.clientX, event.clientY);
    };

    const onPointerLeaveWindow = () => {
      hasPointer = false;
      targetX = -9999;
      targetY = -9999;
    };

    const draw = () => {
      if (!running) return;
      raf = window.requestAnimationFrame(draw);
      if (!frameReady || !canvasShowsArt) return;

      if (hasPointer) {
        pointerX += (targetX - pointerX) * 0.5;
        pointerY += (targetY - pointerY) * 0.5;
      } else {
        pointerX += (targetX - pointerX) * 0.14;
        pointerY += (targetY - pointerY) * 0.14;
      }

      blitRest();
      if (!allowParticles || dots.length === 0) return;

      const radius = disturbRadius;
      const radiusSq = radius * radius;
      const affectSq = (radius * 1.4) ** 2;
      const voidRadius = Math.max(14, radius * 0.36);
      const active: Dot[] = [];

      for (const dot of dots) {
        const bdx = dot.baseX - pointerX;
        const bdy = dot.baseY - pointerY;
        const baseDistSq = bdx * bdx + bdy * bdy;
        const moving = Math.abs(dot.vx) + Math.abs(dot.vy) > 0.025;
        const near = hasPointer && baseDistSq < affectSq;

        if (!near && !moving) {
          if (dot.x !== dot.baseX || dot.y !== dot.baseY) {
            dot.x = dot.baseX;
            dot.y = dot.baseY;
            dot.vx = 0;
            dot.vy = 0;
          }
          continue;
        }

        let forceX = 0;
        let forceY = 0;

        if (hasPointer) {
          const pdx = dot.x - pointerX;
          const pdy = dot.y - pointerY;
          const distSq = pdx * pdx + pdy * pdy;

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq) || 0.0001;
            const nx = pdx / dist;
            const ny = pdy / dist;
            const t = 1 - dist / radius;
            const falloff = t * t * (3 - 2 * t);
            const push = voidRadius + falloff * (radius * 0.65);
            const extra = Math.max(0, push - dist);

            forceX = nx * (extra + falloff * 30);
            forceY = ny * (extra + falloff * 30);

            if (dist < voidRadius) {
              dot.x = pointerX + nx * voidRadius;
              dot.y = pointerY + ny * voidRadius;
              forceX += nx * (voidRadius - dist) * 2.2;
              forceY += ny * (voidRadius - dist) * 2.2;
            }
          }
        }

        const ax = (dot.baseX + forceX - dot.x) * 0.2;
        const ay = (dot.baseY + forceY - dot.y) * 0.2;
        dot.vx = (dot.vx + ax) * 0.75;
        dot.vy = (dot.vy + ay) * 0.75;
        dot.x += dot.vx;
        dot.y += dot.vy;
        active.push(dot);
      }

      if (active.length === 0) return;

      const clearPad = radius + voidRadius + dotSize * 2;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pointerX, pointerY, clearPad, 0, Math.PI * 2);
      ctx.fill();

      for (const dot of active) {
        ctx.fillRect(dot.baseX - 1, dot.baseY - 1, dotSize + 2, dotSize + 2);
      }

      ctx.fillStyle = ORANGE_DOT;
      for (const dot of active) {
        ctx.fillRect(dot.x, dot.y, dotSize, dotSize);
      }
    };

    const revokeObjectUrl = () => {
      if (!objectUrl) return;
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    };

    const closeBitmap = () => {
      if (artBitmap && "close" in artBitmap && typeof artBitmap.close === "function") {
        try {
          artBitmap.close();
        } catch {
          /* ignore */
        }
      }
      artBitmap = null;
    };

    const waitForHtmlImage = (el: HTMLImageElement, url: string, cors: boolean) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const onLoad = () => {
          cleanup();
          resolve(el);
        };
        const onError = () => {
          cleanup();
          reject(new Error("image load failed"));
        };
        const cleanup = () => {
          el.removeEventListener("load", onLoad);
          el.removeEventListener("error", onError);
        };
        el.addEventListener("load", onLoad);
        el.addEventListener("error", onError);
        if (cors) el.crossOrigin = "anonymous";
        else el.removeAttribute("crossOrigin");
        el.src = url;
        if (el.complete && el.naturalWidth > 0) {
          cleanup();
          resolve(el);
        }
      });

    const loadArt = async () => {
      try {
        const res = await fetch(src, { mode: "cors", credentials: "omit", cache: "no-store" });
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const blob = await res.blob();
        if (!running) return;

        const bitmap = await createImageBitmap(blob);
        if (!running) {
          bitmap.close();
          return;
        }

        closeBitmap();
        artBitmap = bitmap;

        revokeObjectUrl();
        objectUrl = URL.createObjectURL(blob);
        img.removeAttribute("crossOrigin");
        img.src = objectUrl;

        rebuild();
        return;
      } catch (error) {
        console.warn("[DitherField] blob/ImageBitmap path failed, trying CORS Image", error);
      }

      try {
        const bust = `${src}${src.includes("?") ? "&" : "?"}__cors=1`;
        const probe = new Image();
        probe.decoding = "async";
        await waitForHtmlImage(probe, bust, true);
        if (!running) return;
        closeBitmap();
        artBitmap = probe;
        rebuild();
        return;
      } catch (error) {
        console.warn("[DitherField] CORS Image failed, display-only fallback", error);
      }

      if (img.complete && img.naturalWidth > 0) {
        closeBitmap();
        artBitmap = img;
        rebuild();
      }
    };

    sizeSurfaces();
    setCanvasVisible(false);
    void loadArt();

    const onResize = () => {
      rebuild();
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            rebuild();
          })
        : null;
    if (wrap.parentElement) resizeObserver?.observe(wrap.parentElement);
    else resizeObserver?.observe(wrap);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeaveWindow);
    document.addEventListener("mouseleave", onPointerLeaveWindow);
    window.addEventListener("resize", onResize);
    raf = window.requestAnimationFrame(draw);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      revokeObjectUrl();
      closeBitmap();
      resizeObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("blur", onPointerLeaveWindow);
      document.removeEventListener("mouseleave", onPointerLeaveWindow);
      window.removeEventListener("resize", onResize);
    };
  }, [src, cellSize, disturbRadius]);

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 h-full w-full bg-white", className)}
      aria-hidden
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        style={{ objectFit: "contain", objectPosition: "center bottom" }}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full touch-none opacity-0"
      />
    </div>
  );
}

export default function OasisHeroDevPage() {
  return (
    <section
      className={cn(
        inter.className,
        "relative h-dvh min-h-dvh w-full overflow-hidden bg-white text-orange-950 antialiased",
      )}
    >
      <DitherField src={BRIDGE_SRC} cellSize={3} disturbRadius={40} className="z-0" />

      <div className="pointer-events-none absolute inset-0 z-10 flex min-h-dvh w-full flex-col">
        <ProgressiveBlurEdge
          edge="top"
          className="h-[min(68vh,34rem)] sm:h-[min(62vh,36rem)] lg:h-[min(58vh,40rem)]"
        />
        <ProgressiveBlurEdge
          edge="bottom"
          className="h-[min(16vh,7rem)] sm:h-[min(14vh,6rem)] lg:h-[min(12vh,5.5rem)]"
        />

        <header className="pointer-events-auto relative z-20">
          <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6">
            <div className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-8">
              <a href="#top" className="inline-flex shrink-0 items-center gap-2 sm:gap-2.5">
                <OasisMark className="size-4 text-orange-600 sm:size-[18px]" />
                <span className="text-[14px] font-semibold tracking-[-0.02em] text-orange-950 sm:text-[15px]">
                  Oasis
                </span>
              </a>

              <nav className="hidden items-center gap-5 md:flex lg:gap-6" aria-label="Primary">
                {NAV_LINKS.map((label) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase()}`}
                    className="text-[12px] font-medium text-orange-600/70 transition-colors hover:text-orange-950 lg:text-[13px]"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            <a
              href="#start"
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-orange-600 px-3.5 text-[12px] font-medium text-white transition-colors hover:bg-orange-700 sm:h-9 sm:px-4 sm:text-[13px]"
            >
              Get started
            </a>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 pb-5 pt-4 sm:px-8 sm:pb-8 sm:pt-6 lg:px-10 lg:pb-10 lg:pt-8">
          <h1
            className={cn(
              GeistPixelSquare.className,
              "relative z-10 max-w-[16ch] text-[clamp(2rem,7.5vw,5.5rem)] leading-[1.12] tracking-[-0.04em] text-orange-950 sm:max-w-[18ch] sm:leading-[1.15] sm:tracking-[-0.05em] lg:text-[88px] lg:tracking-[-6px]",
            )}
          >
            AI system deserves software-grade security.
          </h1>
        </div>
      </div>
    </section>
  );
}

function OasisMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      <path
        d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
