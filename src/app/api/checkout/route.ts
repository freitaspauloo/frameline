import { NextResponse } from "next/server";

import { recordEvent } from "@/lib/events";
import { fulfillDemoOrder } from "@/lib/fulfillment";
import {
  getLicensePlan,
  isCheckoutPlan,
  isScreenUnlockPlan,
  isTestCheckoutAllowed,
} from "@/lib/license-plans";
import { captureException } from "@/lib/monitoring";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { createCheckoutSession, getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const limited = rateLimit(`checkout:${clientIp(request)}`);
  if (!limited.ok) return rateLimitResponse(limited);

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
        error: "Invalid plan. Expected screen, screen_year, or screen_lifetime.",
      },
      { status: 400 },
    );
  }
  if (plan === "test" && !isTestCheckoutAllowed()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Test plan is disabled. Use screen — or set FRAMELINE_ALLOW_TEST_PLAN=true.",
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

  await recordEvent({
    name: "checkout_started",
    email,
    plan,
    slug: material,
    source: getStripe() ? "stripe" : "demo",
    request,
  });

  if (!getStripe()) {
    try {
      const fulfilled = await fulfillDemoOrder({
        email,
        plan,
        material,
        paymentProviderRef: null,
      });

      if (fulfilled.created) {
        await recordEvent({
          name: "order_paid",
          email,
          plan,
          slug: material,
          source: "demo",
          request,
          props: {
            orderId: fulfilled.orderId,
            amountCents: license?.amountCents ?? 0,
          },
        });
      }

      const qs = new URLSearchParams({
        plan,
        email,
        orderId: fulfilled.orderId,
        token: fulfilled.registryToken,
      });
      if (material) qs.set("material", material);

      const redirectTo =
        isScreenUnlockPlan(plan) && material
          ? `/materials/${encodeURIComponent(material)}?unlocked=1&${qs.toString()}`
          : `/orders/${fulfilled.orderId}?${qs.toString()}`;

      return NextResponse.json({
        ok: true,
        mode: "demo" as const,
        plan,
        email,
        material,
        amountCents: license?.amountCents,
        orderId: fulfilled.orderId,
        registryToken: fulfilled.registryToken,
        redirectTo,
      });
    } catch (err) {
      captureException(err, { route: "checkout", plan, email });
      return NextResponse.json(
        { ok: false, error: "Fulfillment failed" },
        { status: 500 },
      );
    }
  }

  try {
    const session = await createCheckoutSession({ email, plan, material });
    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "Stripe did not return a checkout URL" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "stripe" as const,
      plan,
      email,
      material,
      amountCents: license?.amountCents,
      sessionId: session.id,
      redirectTo: session.url,
    });
  } catch (err) {
    captureException(err, { route: "checkout", plan, email, mode: "stripe" });
    return NextResponse.json(
      { ok: false, error: "Could not start Stripe Checkout" },
      { status: 500 },
    );
  }
}
