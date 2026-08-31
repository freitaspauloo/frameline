"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "./stage.module.css";

/** Canonical storefront plate — posters and catalog thumbs are always 16:9. */
export const SCREEN_STAGE_WIDTH = 1920;
export const SCREEN_STAGE_HEIGHT = 1080;

export function ScreenStage({
  background,
  children,
  className,
  embed = false,
  fit = "contain",
  height = SCREEN_STAGE_HEIGHT,
  width = SCREEN_STAGE_WIDTH,
}: {
  background?: string;
  children: ReactNode;
  className?: string;
  embed?: boolean;
  /** contain = letterbox; width = fill viewport width (Paper 1440×1080 heroes). */
  fit?: "contain" | "width";
  height?: number;
  width?: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage) return;

    const applyFit = () => {
      const box = embed ? viewport : document.documentElement;
      const sx = box.clientWidth / width;
      const sy = box.clientHeight / height;
      const scale = fit === "width" ? sx : Math.min(sx, sy);
      stage.style.setProperty("--stage-scale", String(scale));
      stage.style.transformOrigin = fit === "width" ? "top left" : "center center";
      stage.style.transform = `scale(${scale})`;

      if (embed && fit === "width") {
        viewport.style.height = `${height * scale}px`;
      } else if (embed) {
        viewport.style.height = "";
      }
    };

    applyFit();
    const observer = embed ? new ResizeObserver(applyFit) : null;
    observer?.observe(viewport);
    window.addEventListener("resize", applyFit);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", applyFit);
    };
  }, [embed, fit, height, width]);

  const stageStyle: CSSProperties = {
    width,
    height,
    ...(background ? { background } : null),
  };

  return (
    <div
      className={cn(
        styles.viewport,
        embed && styles.embed,
        embed && fit === "width" && styles.embedWidth,
        className,
      )}
      ref={viewportRef}
      style={background ? { background } : undefined}
    >
      <div className={cn(styles.stage, "stage")} ref={stageRef} style={stageStyle}>
        {children}
      </div>
    </div>
  );
}
