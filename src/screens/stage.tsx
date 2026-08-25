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
  height = SCREEN_STAGE_HEIGHT,
  width = SCREEN_STAGE_WIDTH,
}: {
  background?: string;
  children: ReactNode;
  className?: string;
  embed?: boolean;
  height?: number;
  width?: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage) return;

    const fit = () => {
      const box = embed ? viewport : document.documentElement;
      const sx = box.clientWidth / width;
      const sy = box.clientHeight / height;
      const scale = Math.min(sx, sy);
      stage.style.setProperty("--stage-scale", String(scale));
      stage.style.transform = `scale(${scale})`;
    };

    fit();
    const observer = embed ? new ResizeObserver(fit) : null;
    observer?.observe(viewport);
    window.addEventListener("resize", fit);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [embed, height, width]);

  const stageStyle: CSSProperties = {
    width,
    height,
    ...(background ? { background } : null),
  };

  return (
    <div
      className={cn(styles.viewport, embed && styles.embed, className)}
      ref={viewportRef}
      style={background ? { background } : undefined}
    >
      <div className={cn(styles.stage, "stage")} ref={stageRef} style={stageStyle}>
        {children}
      </div>
    </div>
  );
}
