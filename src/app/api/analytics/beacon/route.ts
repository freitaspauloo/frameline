import { NextResponse } from "next/server";

import { readAnonId } from "@/lib/anonymous-id";
import { type EventName, recordEvent } from "@/lib/events";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

const BEACON_NAMES = new Set<EventName>([
  "page_view",
  "click",
  "material_view",
]);

export async function POST(request: Request) {
  const limited = rateLimit(`analytics-beacon:${clientIp(request)}`, {
    limit: 120,
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

  const nameRaw = "name" in body ? body.name : undefined;
  if (typeof nameRaw !== "string" || !BEACON_NAMES.has(nameRaw as EventName)) {
    return NextResponse.json({ ok: false, error: "Invalid event name" }, { status: 400 });
  }

  const name = nameRaw as EventName;
  const pathRaw = "path" in body ? body.path : undefined;
  const slugRaw = "slug" in body ? body.slug : undefined;
  const labelRaw = "label" in body ? body.label : undefined;
  const hrefRaw = "href" in body ? body.href : undefined;
  const elementRaw = "element" in body ? body.element : undefined;

  const path =
    typeof pathRaw === "string" && pathRaw.trim()
      ? pathRaw.trim().slice(0, 512)
      : undefined;
  const slug =
    typeof slugRaw === "string" && slugRaw.trim()
      ? slugRaw.trim().slice(0, 64)
      : undefined;
  const label =
    typeof labelRaw === "string" && labelRaw.trim()
      ? labelRaw.trim().slice(0, 128)
      : undefined;
  const href =
    typeof hrefRaw === "string" && hrefRaw.trim()
      ? hrefRaw.trim().slice(0, 512)
      : undefined;
  const element =
    typeof elementRaw === "string" && elementRaw.trim()
      ? elementRaw.trim().slice(0, 32)
      : undefined;

  if (path?.startsWith("/admin")) {
    return NextResponse.json({ ok: true, skipped: "admin" });
  }

  await recordEvent({
    name,
    anonId: readAnonId(request),
    slug,
    source: path,
    request,
    props: {
      ...(label ? { label } : {}),
      ...(href ? { href } : {}),
      ...(element ? { element } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
