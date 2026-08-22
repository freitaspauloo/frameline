import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { describeClient } from "@/lib/agent-detect";
import { recordEvent } from "@/lib/events";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

/**
 * Hosted screen media — `GET /a/screens/{slug}/{file}`.
 *
 * Copied screen source points here instead of at the reader's own `public/`
 * folder, so a pasted screen renders without any manual asset placement. The
 * first render is also the signal that the code was pasted and run: unlike a
 * registry resolve, this fires from the browser of whoever is building with it.
 */

/** Only these trees are exposed; everything else in public/ stays private. */
const ALLOWED_ROOTS = new Set(["screens", "fonts"]);

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

function parseRange(
  header: string | null,
  size: number,
): { start: number; end: number } | null {
  if (!header?.startsWith("bytes=")) return null;
  const [startRaw, endRaw] = header.slice(6).split("-");
  const start = startRaw ? Number.parseInt(startRaw, 10) : 0;
  const end = endRaw ? Number.parseInt(endRaw, 10) : size - 1;
  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
    return null;
  }
  return { start, end: Math.min(end, size - 1) };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const limited = rateLimit(`asset:${clientIp(request)}`, {
    limit: 300,
    windowMs: 60_000,
  });
  if (!limited.ok) return rateLimitResponse(limited);

  const { path: segments } = await params;
  const relative = segments.join("/");

  if (!segments.length || !ALLOWED_ROOTS.has(segments[0])) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  // Reject traversal before touching the filesystem.
  if (segments.some((segment) => segment === ".." || segment.includes("\0"))) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.join(publicDir, relative);
  if (!filePath.startsWith(`${publicDir}${path.sep}`)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  let size: number;
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not a file");
    size = info.size;
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const copyId = url.searchParams.get("c")?.trim() || null;
  const range = parseRange(request.headers.get("range"), size);

  // Video players issue many range requests for one playback; only the opening
  // request counts as a view.
  if (!range || range.start === 0) {
    const client = describeClient(request);
    const slug = segments[0] === "screens" ? (segments[1] ?? null) : null;
    await recordEvent({
      name: "asset_fetch",
      slug,
      copyId,
      source: "asset",
      request,
      agentKind: client.kind,
      props: { file: relative, agentClass: client.class },
    });
  }

  const contentType =
    CONTENT_TYPES[path.extname(filePath).toLowerCase()] ??
    "application/octet-stream";

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    // Cached long enough that one project does not emit an event per reload,
    // short enough that continued use keeps showing up.
    "Cache-Control": "public, max-age=3600, must-revalidate",
    // Pasted code runs on someone else's origin.
    "Access-Control-Allow-Origin": "*",
  };

  if (range) {
    const stream = createReadStream(filePath, {
      start: range.start,
      end: range.end,
    });
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${range.start}-${range.end}/${size}`,
        "Content-Length": String(range.end - range.start + 1),
      },
    });
  }

  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: { ...headers, "Content-Length": String(size) },
  });
}
