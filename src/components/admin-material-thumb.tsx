import Link from "next/link";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { MaterialCatalogEntry } from "@/materials";
import {
  getMaterialThumbnailSrc,
  THUMBNAIL_ASPECT_RATIO,
} from "@/materials/thumbnails";

export function AdminMaterialThumb({
  entry,
  href,
}: {
  entry: MaterialCatalogEntry;
  href?: string;
}) {
  const src = getMaterialThumbnailSrc(entry.slug);

  const preview = (
    <AspectRatio
      className="w-20 overflow-hidden border border-border bg-foreground"
      ratio={THUMBNAIL_ASPECT_RATIO}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- studio stills are pre-sized WebPs
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
            backgroundImage: `linear-gradient(135deg, ${entry.fallbackColors.join(", ")})`,
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
      title={`View ${entry.title}`}
    >
      {preview}
    </Link>
  );
}
