"use client";

import * as React from "react";

import { type MaterialCatalogEntry } from "@/materials";
import { usePrefersReducedMotion } from "@/materials/hooks";
import { renderMaterial } from "@/materials/renderers";
import { getMaterialThumbnailSrc } from "@/materials/thumbnails";

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
 * off-screen and prefers-reduced-motion fall back to the uploaded
 * thumbnail, or the CSS shell when a material has none.
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
  const thumbnailSrc = getMaterialThumbnailSrc(entry.slug);

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
      {staticMode && thumbnailSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- catalog stills are pre-sized, the optimizer adds nothing
        <img
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
          src={thumbnailSrc}
        />
      ) : (
        <PreviewSurface entry={entry} forceStatic={staticMode} />
      )}
    </div>
  );
}
