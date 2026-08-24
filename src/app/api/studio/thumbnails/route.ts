import { NextResponse } from "next/server";

import { isStudioAuthorized } from "@/lib/studio-auth";
import { STUDIO_KEY_HEADER } from "@/lib/studio-keys";
import {
  ACCEPTED_THUMBNAIL_MIME_TYPES,
  MAX_THUMBNAIL_BYTES,
  deleteThumbnail,
  extensionForMimeType,
  readThumbnailManifest,
  saveThumbnail,
} from "@/lib/thumbnail-store";
import { isThumbnailTargetSlug } from "@/lib/thumbnail-targets";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401 },
  );
}

async function authorize(request: Request): Promise<boolean> {
  const headerKey = request.headers.get(STUDIO_KEY_HEADER) ?? undefined;
  return isStudioAuthorized(headerKey);
}

function parseDimension(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string") return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 10000) {
    return undefined;
  }
  return parsed;
}

export async function GET(request: Request) {
  if (!(await authorize(request))) return unauthorized();
  return NextResponse.json({ ok: true, thumbnails: await readThumbnailManifest() });
}

export async function POST(request: Request) {
  if (!(await authorize(request))) return unauthorized();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Expected multipart form data" },
      { status: 400 },
    );
  }

  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "slug required" },
      { status: 400 },
    );
  }
  if (!isThumbnailTargetSlug(slug)) {
    return NextResponse.json(
      { ok: false, error: `Unknown slug: ${slug}` },
      { status: 404 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "file required" },
      { status: 400 },
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ ok: false, error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_THUMBNAIL_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: `File is larger than ${Math.round(MAX_THUMBNAIL_BYTES / 1024 / 1024)}MB`,
      },
      { status: 413 },
    );
  }
  if (!extensionForMimeType(file.type)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Unsupported type ${file.type || "unknown"} — use ${ACCEPTED_THUMBNAIL_MIME_TYPES.join(", ")}`,
      },
      { status: 415 },
    );
  }

  const width = parseDimension(form.get("width"));
  const height = parseDimension(form.get("height"));
  if (!width || !height) {
    return NextResponse.json(
      { ok: false, error: "width and height required" },
      { status: 400 },
    );
  }

  try {
    const thumbnail = await saveThumbnail({
      slug,
      bytes: Buffer.from(await file.arrayBuffer()),
      mimeType: file.type,
      width,
      height,
    });
    return NextResponse.json({ ok: true, slug, thumbnail });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await authorize(request))) return unauthorized();

  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "slug required" },
      { status: 400 },
    );
  }

  try {
    const removed = await deleteThumbnail(slug);
    return NextResponse.json({ ok: true, slug, removed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
