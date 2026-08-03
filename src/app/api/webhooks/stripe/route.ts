import { NextResponse } from "next/server";

import { fulfillDemoOrder } from "@/lib/fulfillment";
import { isCheckoutPlan } from "@/lib/license-plans";

/**
 * Stripe webhook stub.
 * Without STRIPE_WEBHOOK_SECRET: accept demo JSON and run fulfillment.
 * With secret present: signature verify is not wired yet → 501.
 */
export async function POST(request: Request) {
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        ok: false,
        error: "signature verify not wired",
      },
      { status: 501 },
    );
  }

  let body: {
    type?: string;
    email?: string;
    plan?: string;
    material?: string;
    paymentProviderRef?: string;
    id?: string;
  } = {};

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (body.type !== "checkout.session.completed") {
    return NextResponse.json(
      {
        ok: false,
        error: 'Expected type "checkout.session.completed"',
      },
      { status: 400 },
    );
  }

  const plan = body.plan?.trim().toLowerCase() ?? "";
  if (!isCheckoutPlan(plan)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid plan. Expected static, personal, or team.",
      },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required" },
      { status: 400 },
    );
  }

  const material = body.material?.trim() || undefined;
  const paymentProviderRef =
    body.paymentProviderRef?.trim() || body.id?.trim() || null;

  const result = await fulfillDemoOrder({
    email,
    plan,
    material,
    paymentProviderRef,
  });

  return NextResponse.json({
    ok: true,
    mode: "demo" as const,
    created: result.created,
    orderId: result.orderId,
    registryToken: result.registryToken,
    entitlementId: result.entitlementId,
  });
}
