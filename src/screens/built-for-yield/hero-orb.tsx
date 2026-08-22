"use client";

import { useEffect, useRef } from "react";
import { MODE_FRAMES, paintFrame, resolvePreset } from "thinking-orbs/engine";

const CSS_SIZE = 1600;
const SPEED_MUL = 1 / 3;

export function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { mode, speed, opts } = resolvePreset("composing", 64);
    const frame = MODE_FRAMES[mode];
    const clock = speed * SPEED_MUL;
    const dpr = 2;

    canvas.width = Math.round(CSS_SIZE * dpr);
    canvas.height = Math.round(CSS_SIZE * dpr);
    canvas.style.width = `${CSS_SIZE}px`;
    canvas.style.height = `${CSS_SIZE}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;

    const paintAt = (seconds: number) => {
      const t = seconds * clock;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, CSS_SIZE, CSS_SIZE);
      paintFrame(ctx, frame(CSS_SIZE, t, opts), true);
    };

    const draw = () => {
      if (!running) return;
      paintAt(performance.now() / 1000);
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="orb-canvas"
      width={CSS_SIZE}
      height={CSS_SIZE}
      aria-label="Composing"
    />
  );
}
