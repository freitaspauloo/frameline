import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { fulfillDemoOrder } from "@/lib/fulfillment";
import { isCheckoutPlan } from "@/lib/license-plans";
import { captureException } from "@/lib/monitoring";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe webhook.
 * With STRIPE_WEBHOOK_SECRET: verify signature and fulfill checkout.session.completed.
 * Without secret: accept demo JSON for local/smoke fulfillment.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const stripe = getStripe();

  if (webhookSecret && stripe) {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { ok: false, error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    const rawBody = await request.text();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      captureException(err, { route: "webhooks/stripe", phase: "verify" });
      return NextResponse.json(
        { ok: false, error: "Invalid signature" },
        { status: 400 },
      );
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ ok: true, ignored: event.type });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    return fulfillFromStripeSession(session);
  }

  if (webhookSecret && !stripe) {
    return NextResponse.json(
      {
        ok: false,
        error: "STRIPE_WEBHOOK_SECRET set but STRIPE_SECRET_KEY missing",
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

  try {
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
  } catch (err) {
    captureException(err, { route: "webhooks/stripe", plan, email });
    return NextResponse.json(
      { ok: false, error: "Fulfillment failed" },
      { status: 500 },
    );
  }
}

async function fulfillFromStripeSession(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const plan = (metadata.plan ?? "").trim().toLowerCase();
  const email = (
    metadata.email ||
    session.customer_email ||
    session.customer_details?.email ||
    ""
  )
    .trim()
    .toLowerCase();
  const material = metadata.material?.trim() || undefined;

  if (!isCheckoutPlan(plan)) {
    captureException(new Error("Stripe session missing valid plan"), {
      route: "webhooks/stripe",
      sessionId: session.id,
    });
    return NextResponse.json(
      { ok: false, error: "Invalid plan in session metadata" },
      { status: 400 },
    );
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "Missing customer email on session" },
      { status: 400 },
    );
  }

  try {
    const result = await fulfillDemoOrder({
      email,
      plan,
      material,
      paymentProviderRef: session.id,
    });

    return NextResponse.json({
      ok: true,
      mode: "stripe" as const,
      created: result.created,
      orderId: result.orderId,
      entitlementId: result.entitlementId,
    });
  } catch (err) {
    captureException(err, {
      route: "webhooks/stripe",
      plan,
      email,
      sessionId: session.id,
    });
    return NextResponse.json(
      { ok: false, error: "Fulfillment failed" },
      { status: 500 },
    );
  }
}
