import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  MaterialThumbnail,
  MaterialThumbnailManifest,
} from "@/materials/thumbnails";

const PROJECT_ROOT = process.cwd();
const MANIFEST_PATH = path.join(
  PROJECT_ROOT,
  "src",
  "materials",
  "thumbnails.json",
);
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public", "thumbnails");
const PUBLIC_PREFIX = "/thumbnails";

/**
 * Uploads are normalized to WebP client-side; the rest are accepted so a
 * pre-rendered still can be dropped in untouched.
 */
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/avif": "avif",
  "image/gif": "gif",
};

export const ACCEPTED_THUMBNAIL_MIME_TYPES = Object.keys(EXTENSION_BY_MIME);
export const MAX_THUMBNAIL_BYTES = 8 * 1024 * 1024;

export function extensionForMimeType(mimeType: string): string | undefined {
  return EXTENSION_BY_MIME[mimeType];
}

export async function readThumbnailManifest(): Promise<MaterialThumbnailManifest> {
  try {
    const raw = await readFile(MANIFEST_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as MaterialThumbnailManifest;
  } catch {
    return {};
  }
}

async function writeThumbnailManifest(manifest: MaterialThumbnailManifest) {
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );
  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify(sorted, null, 2)}\n`,
    "utf8",
  );
}

/** Remove any previously stored file for a slug, whatever its extension. */
async function removeStoredFiles(slug: string) {
  await Promise.all(
    Object.values(EXTENSION_BY_MIME).map((ext) =>
      rm(path.join(PUBLIC_DIR, `${slug}.${ext}`), { force: true }),
    ),
  );
}

export type SaveThumbnailInput = {
  slug: string;
  bytes: Buffer;
  mimeType: string;
  width: number;
  height: number;
};

export async function saveThumbnail({
  slug,
  bytes,
  mimeType,
  width,
  height,
}: SaveThumbnailInput): Promise<MaterialThumbnail> {
  const extension = extensionForMimeType(mimeType);
  if (!extension) {
    throw new Error(`Unsupported image type: ${mimeType}`);
  }

  await mkdir(PUBLIC_DIR, { recursive: true });
  await removeStoredFiles(slug);

  const fileName = `${slug}.${extension}`;
  await writeFile(path.join(PUBLIC_DIR, fileName), bytes);

  const thumbnail: MaterialThumbnail = {
    path: `${PUBLIC_PREFIX}/${fileName}`,
    width,
    height,
    hash: createHash("sha256").update(bytes).digest("hex").slice(0, 10),
    updatedAt: new Date().toISOString(),
  };

  const manifest = await readThumbnailManifest();
  manifest[slug] = thumbnail;
  await writeThumbnailManifest(manifest);

  return thumbnail;
}

export async function deleteThumbnail(slug: string): Promise<boolean> {
  const manifest = await readThumbnailManifest();
  if (!(slug in manifest)) return false;

  delete manifest[slug];
  await removeStoredFiles(slug);
  await writeThumbnailManifest(manifest);
  return true;
}
