import { NextResponse } from "next/server";

import { readAnonId } from "@/lib/anonymous-id";
import { getDemoEmail } from "@/lib/auth";
import { readEvents, recordEvent } from "@/lib/events";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getMaterial } from "@/materials/catalog";
import { getScreenBySlug } from "@/screens/catalog";

/**
 * Install / copy beacon for materials.
 *
 * Materials are copied entirely client-side (JSX snippet or CLI command), so
 * unlike screens there is no server choke point. This beacon is the only
 * record that a material copy happened; it now lands in the event stream
 * instead of a local JSON file so it survives a deploy.
 */

const INSTALL_PATHS = new Set(["cli", "jsx", "paste", "prompt", "code"]);

export async function GET() {
  const events = await readEvents({ names: ["install_intent"], limit: 50_000 });

  const bySlug: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  for (const event of events) {
    const slug = event.slug ?? "unknown";
    bySlug[slug] = (bySlug[slug] ?? 0) + 1;
    const source = event.source ?? "unknown";
    bySource[source] = (bySource[source] ?? 0) + 1;
  }

  return NextResponse.json({
    count: events.length,
    bySlug,
    bySource,
  });
}

export async function POST(request: Request) {
  const limited = rateLimit(`install:${clientIp(request)}`, {
    limit: 40,
    windowMs: 60_000,
  });
  if (!limited.ok) return rateLimitResponse(limited);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const slugRaw = "slug" in body ? body.slug : undefined;
  const sourceRaw = "source" in body ? body.source : undefined;
  const pathRaw = "path" in body ? body.path : undefined;
  const copyIdRaw = "copyId" in body ? body.copyId : undefined;

  if (typeof slugRaw !== "string" || !slugRaw.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing slug" },
      { status: 400 },
    );
  }

  const slug = slugRaw.trim().slice(0, 64);
  if (!getMaterial(slug) && !getScreenBySlug(slug)) {
    return NextResponse.json(
      { ok: false, error: "Unknown material or screen slug" },
      { status: 400 },
    );
  }

  const source =
    typeof sourceRaw === "string" && sourceRaw.trim()
      ? sourceRaw.trim().slice(0, 64)
      : undefined;

  let installPath: string | undefined;
  if (typeof pathRaw === "string" && pathRaw.trim()) {
    const normalized = pathRaw.trim().toLowerCase();
    if (!INSTALL_PATHS.has(normalized)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid path. Expected cli, jsx, paste, prompt, or code.",
        },
        { status: 400 },
      );
    }
    installPath = normalized;
  }

  const copyId =
    typeof copyIdRaw === "string" && copyIdRaw.trim()
      ? copyIdRaw.trim().slice(0, 64)
      : undefined;

  await recordEvent({
    name: "install_intent",
    email: await getDemoEmail(),
    anonId: readAnonId(request),
    slug,
    copyId,
    source,
    request,
    props: { path: installPath },
  });

  return NextResponse.json({ ok: true });
}
