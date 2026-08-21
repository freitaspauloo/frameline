import { NextResponse } from "next/server";

import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { fulfillStripeSessionId } from "@/lib/stripe-fulfillment";

/** Backup fulfill when returning from Stripe to a screen detail page. */
export async function POST(request: Request) {
  const limited = rateLimit(`screen-fulfill:${clientIp(request)}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (!limited.ok) return rateLimitResponse(limited);

  let body: { sessionId?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "sessionId required" },
      { status: 400 },
    );
  }

  try {
    const result = await fulfillStripeSessionId(sessionId);
    if (!result) {
      return NextResponse.json({
        ok: true,
        fulfilled: false,
        note: "No Stripe session or not paid yet (demo mode may already be fulfilled).",
      });
    }
    return NextResponse.json({
      ok: true,
      fulfilled: true,
      orderId: result.orderId,
      entitlementId: result.entitlementId,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Fulfillment failed" },
      { status: 500 },
    );
  }
}
