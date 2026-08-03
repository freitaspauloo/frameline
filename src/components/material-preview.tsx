"use client";

import * as React from "react";

import { type MaterialCatalogEntry } from "@/materials";
import { usePrefersReducedMotion } from "@/materials/hooks";
import { renderMaterial } from "@/materials/renderers";

function PreviewSurface({
  entry,
  forceStatic,
}: {
  entry: MaterialCatalogEntry;
  forceStatic: boolean;
}) {
  const common = "absolute inset-0 h-full w-full";
  const node = renderMaterial(entry.slug, {
    className: common,
    forceStatic,
    props: {},
  });

  if (node) return node;

  return (
    <div
      className={common}
      style={{
        backgroundImage: `linear-gradient(135deg, ${entry.fallbackColors.join(", ")})`,
      }}
    />
  );
}

/**
 * Catalog / grid preview. Animates only while in the viewport;
 * off-screen and prefers-reduced-motion always use the static shell.
 */
export function MaterialPreview({
  entry,
  forceStatic = false,
}: {
  entry: MaterialCatalogEntry;
  /** When true, always show the static shell (ignores intersection). */
  forceStatic?: boolean;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([obs]) => {
        setInView(obs?.isIntersecting ?? false);
      },
      { rootMargin: "80px 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staticMode =
    forceStatic || prefersReducedMotion || !inView;

  return (
    <div ref={rootRef} className="absolute inset-0 h-full w-full">
      <PreviewSurface entry={entry} forceStatic={staticMode} />
    </div>
  );
}
