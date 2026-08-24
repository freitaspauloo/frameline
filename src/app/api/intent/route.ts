import { NextResponse } from "next/server";

import { readAnonId } from "@/lib/anonymous-id";
import { readEvents, recordEvent } from "@/lib/events";
import { isCheckoutPlan } from "@/lib/license-plans";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

/**
 * Willingness-to-pay beacon — records plan interest without blocking checkout.
 * Persisted through the event stream so pricing interest can be joined against
 * the copies and orders from the same subject.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const events = await readEvents({ names: ["wtp_intent"], limit: 50_000 });

  const byPlan: Record<string, number> = {};
  for (const event of events) {
    const plan = event.plan ?? "unknown";
    byPlan[plan] = (byPlan[plan] ?? 0) + 1;
  }

  return NextResponse.json({ count: events.length, byPlan });
}

export async function POST(request: Request) {
  const limited = rateLimit(`intent:${clientIp(request)}`, {
    limit: 30,
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

  const planRaw = "plan" in body ? body.plan : undefined;
  const materialRaw = "material" in body ? body.material : undefined;
  const emailRaw = "email" in body ? body.email : undefined;
  const sourceRaw = "source" in body ? body.source : undefined;

  if (typeof planRaw !== "string" || !isCheckoutPlan(planRaw.trim().toLowerCase())) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid plan. Expected test or screen.",
      },
      { status: 400 },
    );
  }

  const plan = planRaw.trim().toLowerCase();

  const material =
    typeof materialRaw === "string" && materialRaw.trim()
      ? materialRaw.trim().slice(0, 64)
      : undefined;

  let email: string | undefined;
  if (typeof emailRaw === "string" && emailRaw.trim()) {
    const normalized = emailRaw.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    email = normalized;
  }

  const source =
    typeof sourceRaw === "string" && sourceRaw.trim()
      ? sourceRaw.trim().slice(0, 64)
      : undefined;

  await recordEvent({
    name: "wtp_intent",
    email,
    anonId: readAnonId(request),
    slug: material,
    plan,
    source,
    request,
  });

  return NextResponse.json({ ok: true });
}
