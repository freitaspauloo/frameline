"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Dithering,
  type PaperShaderElement,
} from "@paper-design/shaders-react";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Resting look — also the exact frame reduced-motion users get. */
const REST = { scale: 0.85, size: 2.5, speed: 0.4 };
/** Look once the hero has fully scrolled past: coarser, slower, drifting up. */
const PAST = { scale: 1.16, size: 3.6, speed: 0.12, offsetY: 0.14 };
/** How far the pattern leans toward the pointer, in shader offset units. */
const POINTER_REACH = 0.05;
/** Extra pixel size at page load — the print "develops" down to REST.size. */
const DEVELOP_SIZE = 6;

const SHADER_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  height: "100%",
  width: "100%",
};

/**
 * Full-bleed hero dither wired straight to the shader mount.
 *
 * Scroll position, pointer position and the load-in "develop" all write to a
 * single mutable frame state that is flushed once per GSAP tick — React never
 * re-renders, and the shader is parked the moment it leaves the viewport.
 */
export function HeroDither({
  className,
  colorBack,
  colorFront,
}: {
  className?: string;
  colorBack: string;
  colorFront: string;
}) {
  const reduced = useReducedMotion();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const shaderRef = React.useRef<PaperShaderElement>(null);

  useGSAP(
    () => {
      const host = hostRef.current;
      if (reduced || !host) return;

      const live = { develop: 1, pointerX: 0, pointerY: 0, progress: 0 };
      const pointer = { x: 0, y: 0 };
      let running = false;

      const draw = () => {
        const mount = shaderRef.current?.paperShaderMount;
        if (!mount) return;

        live.pointerX += (pointer.x - live.pointerX) * 0.06;
        live.pointerY += (pointer.y - live.pointerY) * 0.06;

        const p = live.progress;
        mount.setUniforms({
          u_scale: gsap.utils.interpolate(REST.scale, PAST.scale, p),
          u_pxSize:
            gsap.utils.interpolate(REST.size, PAST.size, p) +
            live.develop * DEVELOP_SIZE,
          u_offsetX: live.pointerX,
          u_offsetY: live.pointerY - PAST.offsetY * p,
        });
        mount.setSpeed(gsap.utils.interpolate(REST.speed, PAST.speed, p));
      };

      const start = () => {
        if (running) return;
        running = true;
        gsap.ticker.add(draw);
      };

      const stop = () => {
        if (!running) return;
        running = false;
        gsap.ticker.remove(draw);
        shaderRef.current?.paperShaderMount?.setSpeed(0);
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else stop();
        },
        { rootMargin: "120px 0px", threshold: 0 },
      );
      io.observe(host);

      gsap.to(live, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: host,
          start: "top center",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to(live, {
        develop: 0,
        delay: 0.15,
        duration: 1.9,
        ease: "power2.out",
      });

      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const onPointerMove = (event: PointerEvent) => {
        pointer.x =
          ((event.clientX / window.innerWidth) * 2 - 1) * POINTER_REACH;
        pointer.y =
          ((event.clientY / window.innerHeight) * 2 - 1) * POINTER_REACH * 0.6;
      };
      if (finePointer) {
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
      }

      return () => {
        io.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        stop();
      };
    },
    { dependencies: [reduced] },
  );

  return (
    <div
      ref={hostRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <Dithering
        ref={shaderRef}
        className="absolute inset-0 h-full w-full"
        colorBack={colorBack}
        colorFront={colorFront}
        maxPixelCount={1_280_000}
        minPixelRatio={1}
        scale={REST.scale}
        shape="swirl"
        size={REST.size}
        speed={reduced ? 0 : REST.speed}
        style={SHADER_STYLE}
        type="4x4"
      />
    </div>
  );
}
