import { NextResponse } from "next/server";

import { fulfillDemoOrder } from "@/lib/fulfillment";
import {
  getLicensePlan,
  isCheckoutPlan,
} from "@/lib/license-plans";

export async function POST(request: Request) {
  let body: { plan?: string; email?: string; material?: string } = {};
  try {
    body = (await request.json()) as {
      plan?: string;
      email?: string;
      material?: string;
    };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
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
  const license = getLicensePlan(plan);

  if (!process.env.STRIPE_SECRET_KEY) {
    const fulfilled = await fulfillDemoOrder({
      email,
      plan,
      material,
      paymentProviderRef: null,
    });

    const qs = new URLSearchParams({
      plan,
      email,
      orderId: fulfilled.orderId,
    });
    if (material) qs.set("material", material);

    return NextResponse.json({
      ok: true,
      mode: "demo" as const,
      plan,
      email,
      material,
      amountCents: license?.amountCents,
      orderId: fulfilled.orderId,
      registryToken: fulfilled.registryToken,
      redirectTo: `/orders/demo?${qs.toString()}`,
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "stripe" as const,
    plan,
    email,
    material,
    message: "Stripe session creation stub — wire stripe SDK next",
  });
}
