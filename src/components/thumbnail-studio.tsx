"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { STUDIO_KEY_HEADER } from "@/lib/studio-keys";
import type { ThumbnailTarget } from "@/lib/thumbnail-targets";
import { cn } from "@/lib/utils";
import {
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
  type MaterialThumbnail,
} from "@/materials/thumbnails";

type FitMode = "crop" | "fit";

type RowStatus =
  | { state: "idle" }
  | { state: "working" }
  | { state: "done" }
  | { state: "error"; message: string };

export type ThumbnailStudioItem = ThumbnailTarget & {
  thumbnail?: MaterialThumbnail;
};

const LABEL =
  "text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode that image"));
    };
    image.src = url;
  });
}

/**
 * Every catalog card is a 16:10 box, so uploads are normalized to one size and
 * format in the browser. Keeps the committed assets small and consistent, and
 * avoids needing an image pipeline on the server.
 */
async function normalizeImage(
  file: File,
  fit: FitMode,
): Promise<{ blob: Blob; width: number; height: number }> {
  const image = await loadImage(file);
  const sourceWidth = image.naturalWidth || THUMBNAIL_WIDTH;
  const sourceHeight = image.naturalHeight || THUMBNAIL_HEIGHT;

  const canvas = document.createElement("canvas");
  canvas.width = THUMBNAIL_WIDTH;
  canvas.height = THUMBNAIL_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser");
  ctx.imageSmoothingQuality = "high";

  const scale =
    fit === "crop"
      ? Math.max(
          THUMBNAIL_WIDTH / sourceWidth,
          THUMBNAIL_HEIGHT / sourceHeight,
        )
      : Math.min(
          THUMBNAIL_WIDTH / sourceWidth,
          THUMBNAIL_HEIGHT / sourceHeight,
        );

  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  ctx.drawImage(
    image,
    (THUMBNAIL_WIDTH - drawWidth) / 2,
    (THUMBNAIL_HEIGHT - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.92);
  });
  if (!blob) throw new Error("Could not encode that image");

  return { blob, width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT };
}

function slugFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Match a dropped file to a card by slug, then by squashed title. */
function matchTarget(
  fileName: string,
  items: ThumbnailStudioItem[],
): ThumbnailStudioItem | undefined {
  const candidate = slugFromFileName(fileName);
  if (!candidate) return undefined;

  const bySlug = items.find((item) => item.slug === candidate);
  if (bySlug) return bySlug;

  const squashed = candidate.replace(/-/g, "");
  return items.find(
    (item) =>
      item.slug.replace(/-/g, "") === squashed ||
      item.title.toLowerCase().replace(/[^a-z0-9]/g, "") === squashed,
  );
}

export function ThumbnailStudio({
  items,
  studioKey,
}: {
  items: ThumbnailStudioItem[];
  studioKey: string;
}) {
  const router = useRouter();
  const [fit, setFit] = React.useState<FitMode>("crop");
  const [statuses, setStatuses] = React.useState<Record<string, RowStatus>>({});
  const [bulkNote, setBulkNote] = React.useState<string | null>(null);
  const [bulkActive, setBulkActive] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const setStatus = React.useCallback((slug: string, status: RowStatus) => {
    setStatuses((prev) => ({ ...prev, [slug]: status }));
  }, []);

  const upload = React.useCallback(
    async (slug: string, file: File) => {
      setStatus(slug, { state: "working" });
      try {
        const { blob, width, height } = await normalizeImage(file, fit);
        const body = new FormData();
        body.append("slug", slug);
        body.append(
          "file",
          new File([blob], `${slug}.webp`, { type: "image/webp" }),
        );
        body.append("width", String(width));
        body.append("height", String(height));

        const response = await fetch("/api/studio/thumbnails", {
          method: "POST",
          headers: { [STUDIO_KEY_HEADER]: studioKey },
          body,
        });
        const payload = (await response.json()) as {
          ok: boolean;
          error?: string;
        };
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error ?? `Upload failed (${response.status})`);
        }
        setStatus(slug, { state: "done" });
        router.refresh();
      } catch (err) {
        setStatus(slug, {
          state: "error",
          message: err instanceof Error ? err.message : "Upload failed",
        });
      }
    },
    [fit, router, setStatus, studioKey],
  );

  const remove = React.useCallback(
    async (slug: string) => {
      setStatus(slug, { state: "working" });
      try {
        const response = await fetch(
          `/api/studio/thumbnails?slug=${encodeURIComponent(slug)}`,
          { method: "DELETE", headers: { [STUDIO_KEY_HEADER]: studioKey } },
        );
        const payload = (await response.json()) as {
          ok: boolean;
          error?: string;
        };
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error ?? `Remove failed (${response.status})`);
        }
        setStatus(slug, { state: "idle" });
        router.refresh();
      } catch (err) {
        setStatus(slug, {
          state: "error",
          message: err instanceof Error ? err.message : "Remove failed",
        });
      }
    },
    [router, setStatus, studioKey],
  );

  const uploadBatch = React.useCallback(
    async (files: File[]) => {
      const matched: { item: ThumbnailStudioItem; file: File }[] = [];
      const unmatched: string[] = [];

      for (const file of files) {
        const item = matchTarget(file.name, items);
        if (item) matched.push({ item, file });
        else unmatched.push(file.name);
      }

      setBulkNote(
        matched.length === 0
          ? `No filenames matched a slug — ${unmatched.join(", ")}`
          : `Matched ${matched.length} of ${files.length}${
              unmatched.length ? ` · skipped ${unmatched.join(", ")}` : ""
            }`,
      );

      for (const { item, file } of matched) {
        await upload(item.slug, file);
      }
    },
    [items, upload],
  );

  const visible = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      `${item.slug} ${item.title} ${item.kind}`.toLowerCase().includes(needle),
    );
  }, [items, query]);

  const uploadedCount = items.filter((item) => item.thumbnail).length;

  return (
    <div className="space-y-8">
      <header className="space-y-4 border-b border-border pb-8">
        <div>
          <p className={LABEL}>Frameline · thumbnail studio</p>
          <h1 className="mt-2 font-heading text-2xl font-medium tracking-tight">
            Catalog thumbnails
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Drop an image on any card to set the still shown in the catalog
            grid, on the detail page before the shader warms up, and on share
            cards. Images are resized to {THUMBNAIL_WIDTH}×{THUMBNAIL_HEIGHT}{" "}
            WebP in your browser before upload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="font-mono text-[11px] text-muted-foreground">
            {uploadedCount} / {items.length} have a thumbnail
          </p>
          <div className="flex items-center gap-2">
            <span className={LABEL}>Fit</span>
            {(["crop", "fit"] as const).map((mode) => (
              <button
                className={cn(
                  "border px-2.5 py-1 font-mono text-[11px] transition-colors",
                  fit === mode
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
                key={mode}
                onClick={() => setFit(mode)}
                type="button"
              >
                {mode === "crop" ? "Crop to 16:10" : "Fit whole image"}
              </button>
            ))}
          </div>
          <input
            aria-label="Filter catalog"
            className="h-9 min-w-48 flex-1 border border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name or slug…"
            type="search"
            value={query}
          />
        </div>

        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed px-6 py-8 text-center transition-colors",
            bulkActive
              ? "border-foreground bg-muted"
              : "border-border hover:border-foreground",
          )}
          onDragLeave={() => setBulkActive(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setBulkActive(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setBulkActive(false);
            const files = Array.from(event.dataTransfer.files);
            if (files.length) void uploadBatch(files);
          }}
        >
          <span className="text-sm font-medium">
            Drop many images here to match them by filename
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            aurora-mesh.png → Aurora Mesh · ink-dither.jpg → Ink Dither
          </span>
          <input
            accept="image/*"
            className="sr-only"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              if (files.length) void uploadBatch(files);
            }}
            type="file"
          />
        </label>
        {bulkNote ? (
          <p className="font-mono text-[11px] text-muted-foreground">
            {bulkNote}
          </p>
        ) : null}
      </header>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing matches that filter.</p>
      ) : (
        <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <ThumbnailCard
              item={item}
              key={item.slug}
              onRemove={() => void remove(item.slug)}
              onUpload={(file) => void upload(item.slug, file)}
              status={statuses[item.slug] ?? { state: "idle" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThumbnailCard({
  item,
  onRemove,
  onUpload,
  status,
}: {
  item: ThumbnailStudioItem;
  onRemove: () => void;
  onUpload: (file: File) => void;
  status: RowStatus;
}) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const src = item.thumbnail
    ? `${item.thumbnail.path}?v=${item.thumbnail.hash}`
    : item.defaultPoster;
  const gradient = item.fallbackColors?.length
    ? `linear-gradient(135deg, ${item.fallbackColors.join(", ")})`
    : undefined;

  return (
    <div className="bg-background p-4">
      <div
        className={cn(
          "relative aspect-[16/10] cursor-pointer overflow-hidden border transition-colors",
          dragging ? "border-foreground" : "border-border",
        )}
        onClick={() => inputRef.current?.click()}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) onUpload(file);
        }}
        style={src ? undefined : { backgroundImage: gradient }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- local asset, no optimizer in this tool
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={src}
          />
        ) : null}

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-background/80 text-center text-sm font-medium opacity-0 transition-opacity",
            (dragging || status.state === "working") && "opacity-100",
          )}
        >
          {status.state === "working" ? "Uploading…" : "Drop to replace"}
        </div>

        <input
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onUpload(file);
          }}
          ref={inputRef}
          type="file"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.title}</p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            {item.slug} · {item.kind}
          </p>
        </div>
        {item.thumbnail ? (
          <Button onClick={onRemove} size="xs" type="button" variant="outline">
            Remove
          </Button>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-2 font-mono text-[11px]",
          status.state === "error" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {status.state === "error"
          ? status.message
          : status.state === "done"
            ? "Saved"
            : item.thumbnail
              ? `Uploaded ${new Date(item.thumbnail.updatedAt).toLocaleString()}`
              : item.defaultPoster
                ? "Using bundled poster"
                : "No thumbnail — live shader only"}
      </p>
    </div>
  );
}
