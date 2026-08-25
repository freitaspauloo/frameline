"use client";

import Link from "next/link";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { AssetCatalogMeta } from "@/lib/asset-catalog";
import { THUMBNAIL_ASPECT_RATIO } from "@/materials/thumbnails";
import { cn } from "@/lib/utils";

export function AdminAssetThumb({
  meta,
  href,
  className,
  size = "md",
}: {
  meta: AssetCatalogMeta;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const widthClass =
    size === "sm" ? "w-14" : size === "lg" ? "w-28" : "w-20";

  const preview = (
    <AspectRatio
      className={cn(
        "overflow-hidden border border-border bg-foreground",
        widthClass,
        className,
      )}
      ratio={THUMBNAIL_ASPECT_RATIO}
    >
      {meta.thumbnailSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- catalog stills and screen posters
        <img
          alt=""
          className="size-full object-cover"
          loading="lazy"
          src={meta.thumbnailSrc}
        />
      ) : (
        <div
          aria-hidden
          className="size-full"
          style={{
            backgroundImage: meta.fallbackColors?.length
              ? `linear-gradient(135deg, ${meta.fallbackColors.join(", ")})`
              : "linear-gradient(135deg, #2d6bff, #0b0d12)",
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
      title={meta.title}
    >
      {preview}
    </Link>
  );
}
