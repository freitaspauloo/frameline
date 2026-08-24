import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { recordEvent } from "@/lib/events";
import {
  fulfillDemoOrder,
  markOrderRefunded,
  markSubscriptionCanceled,
} from "@/lib/fulfillment";
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

    switch (event.type) {
      case "checkout.session.completed":
        return fulfillFromStripeSession(
          event.data.object as Stripe.Checkout.Session,
        );
      case "invoice.paid":
        return handleInvoicePaid(event.data.object as Stripe.Invoice);
      case "customer.subscription.deleted":
        return handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
      case "charge.refunded":
        return handleChargeRefunded(event.data.object as Stripe.Charge);
      default:
        return NextResponse.json({ ok: true, ignored: event.type });
    }
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
        error: "Invalid plan. Expected test or screen.",
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

    if (result.created) {
      await recordEvent({
        name: "order_paid",
        email,
        plan,
        slug: material,
        source: "demo-webhook",
        request,
        props: { orderId: result.orderId },
      });
    }

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

function stripeId(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

/**
 * Subscription renewals. Without this, a $9/mo customer looked like a single
 * $9 sale forever, so MRR and lifetime value were both wrong.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const billingReason = invoice.billing_reason ?? "";
  // The first invoice of a subscription is already recorded by
  // checkout.session.completed; counting it here would double the revenue.
  if (billingReason === "subscription_create") {
    return NextResponse.json({ ok: true, skipped: "subscription_create" });
  }
  if (!billingReason.startsWith("subscription")) {
    return NextResponse.json({ ok: true, ignored: billingReason || "invoice" });
  }

  const email = invoice.customer_email?.trim().toLowerCase();
  const subscriptionId = stripeId(
    (invoice as unknown as { subscription?: unknown }).subscription,
  );
  const customerId = stripeId(invoice.customer);

  if (!email) {
    return NextResponse.json({ ok: true, skipped: "no customer email" });
  }

  // Subscription metadata is set at checkout so renewals stay attributable;
  // the amount is the fallback when an older subscription lacks it.
  const subscriptionMetadata =
    (invoice as unknown as {
      subscription_details?: { metadata?: Record<string, string> | null };
    }).subscription_details?.metadata ?? {};

  const planFromMetadata = subscriptionMetadata.plan?.trim();
  const plan =
    planFromMetadata === "screen_year" || planFromMetadata === "screen"
      ? planFromMetadata
      : invoice.amount_paid >= 4900
        ? "screen_year"
        : "screen";

  const material =
    subscriptionMetadata.material?.trim() ||
    invoice.metadata?.material?.trim() ||
    undefined;

  try {
    const result = await fulfillDemoOrder({
      email,
      plan,
      material,
      // Invoice id keeps renewals idempotent across webhook retries.
      paymentProviderRef: invoice.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    });

    await recordEvent({
      name: "subscription_renewed",
      email,
      plan,
      slug: material,
      source: "stripe",
      props: {
        orderId: result.orderId,
        amountCents: invoice.amount_paid,
        subscriptionId,
      },
    });

    return NextResponse.json({ ok: true, renewed: true, orderId: result.orderId });
  } catch (err) {
    captureException(err, { route: "webhooks/stripe", phase: "invoice.paid" });
    return NextResponse.json(
      { ok: false, error: "Renewal fulfillment failed" },
      { status: 500 },
    );
  }
}

/** Subscription actually ended — stop access and record the churn. */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const result = await markSubscriptionCanceled(subscription.id);
    await recordEvent({
      name: "subscription_canceled",
      email: result?.email ?? null,
      plan: result?.planKey ?? null,
      source: "stripe",
      props: {
        subscriptionId: subscription.id,
        orderId: result?.orderId ?? null,
        matched: Boolean(result),
      },
    });
    return NextResponse.json({ ok: true, canceled: Boolean(result) });
  } catch (err) {
    captureException(err, {
      route: "webhooks/stripe",
      phase: "subscription.deleted",
    });
    return NextResponse.json(
      { ok: false, error: "Cancellation failed" },
      { status: 500 },
    );
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const result = await markOrderRefunded({
      stripeCustomerId: stripeId(charge.customer),
      email: charge.billing_details?.email ?? charge.receipt_email ?? null,
    });
    await recordEvent({
      name: "order_refunded",
      email: result?.email ?? null,
      plan: result?.planKey ?? null,
      source: "stripe",
      props: {
        orderId: result?.orderId ?? null,
        amountRefundedCents: charge.amount_refunded,
        matched: Boolean(result),
      },
    });
    return NextResponse.json({ ok: true, refunded: Boolean(result) });
  } catch (err) {
    captureException(err, {
      route: "webhooks/stripe",
      phase: "charge.refunded",
    });
    return NextResponse.json(
      { ok: false, error: "Refund handling failed" },
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
      stripeCustomerId: stripeId(session.customer),
      stripeSubscriptionId: stripeId(session.subscription),
    });

    if (result.created) {
      await recordEvent({
        name: "order_paid",
        email,
        plan,
        slug: material,
        source: "stripe",
        props: {
          orderId: result.orderId,
          amountCents: session.amount_total ?? null,
        },
      });
    }

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
