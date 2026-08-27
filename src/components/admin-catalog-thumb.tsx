"use client";

import Link from "next/link";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { MaterialCatalogEntry } from "@/materials";
import {
  getMaterialThumbnailSrc,
  THUMBNAIL_ASPECT_RATIO,
} from "@/materials/thumbnails";

export function AdminCatalogThumb({
  slug,
  title,
  href,
  poster,
  fallbackColors,
}: {
  slug: string;
  title: string;
  href?: string;
  poster?: string;
  fallbackColors?: readonly string[];
}) {
  const materialSrc = poster ? undefined : getMaterialThumbnailSrc(slug);
  const src = poster ?? materialSrc ?? null;

  const preview = (
    <AspectRatio
      className="w-20 overflow-hidden border border-border bg-foreground"
      ratio={THUMBNAIL_ASPECT_RATIO}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- studio stills / screen posters
        <img
          alt=""
          className="size-full object-cover"
          loading="lazy"
          src={src}
        />
      ) : (
        <div
          aria-hidden
          className="size-full"
          style={{
            backgroundImage: fallbackColors?.length
              ? `linear-gradient(135deg, ${fallbackColors.join(", ")})`
              : undefined,
            backgroundColor: fallbackColors?.length ? undefined : "var(--foreground)",
          }}
        />
      )}
    </AspectRatio>
  );

  if (!href) return preview;

  return (
    <Link
      className="block shrink-0 transition-opacity hover:opacity-80"
      href={href}
      title={`View ${title}`}
    >
      {preview}
    </Link>
  );
}

/** @deprecated Use AdminCatalogThumb */
export function AdminMaterialThumb({
  entry,
  href,
}: {
  entry: MaterialCatalogEntry;
  href?: string;
}) {
  return (
    <AdminCatalogThumb
      fallbackColors={entry.fallbackColors}
      href={href}
      slug={entry.slug}
      title={entry.title}
    />
  );
}
