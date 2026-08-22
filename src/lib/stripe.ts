import Stripe from "stripe";

import type { CheckoutPlanKey } from "@/lib/license-plans";
import { getLicensePlan, isScreenPlan } from "@/lib/license-plans";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

export function appBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export async function createCheckoutSession(input: {
  email: string;
  plan: CheckoutPlanKey;
  material?: string;
}): Promise<Stripe.Checkout.Session> {
  const client = getStripe();
  if (!client) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  const license = getLicensePlan(input.plan);
  if (!license || license.amountCents <= 0) {
    throw new Error("Invalid license plan for Stripe checkout");
  }

  const base = appBaseUrl();
  const productName =
    isScreenPlan(input.plan) && input.material
      ? `Frameline Screen — ${input.material}`
      : `Frameline ${license.name}`;

  const successUrl =
    isScreenPlan(input.plan) && input.material
      ? `${base}/materials/${encodeURIComponent(input.material)}?unlocked=1&session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(input.email)}&plan=${encodeURIComponent(input.plan)}`
      : `${base}/orders/{CHECKOUT_SESSION_ID}?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(input.email)}&plan=${encodeURIComponent(input.plan)}${input.material ? `&material=${encodeURIComponent(input.material)}` : ""}`;

  const cancelUrl =
    isScreenPlan(input.plan) && input.material
      ? `${base}/materials/${encodeURIComponent(input.material)}?cancelled=1`
      : `${base}/checkout?plan=${encodeURIComponent(input.plan)}${input.material ? `&material=${encodeURIComponent(input.material)}` : ""}&cancelled=1`;

  const recurring = license.interval
    ? { interval: license.interval }
    : undefined;

  return client.checkout.sessions.create({
    mode: recurring ? "subscription" : "payment",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: license.amountCents,
          ...(recurring ? { recurring } : {}),
          product_data: {
            name: productName,
            description: license.summary,
          },
        },
      },
    ],
    metadata: {
      plan: input.plan,
      email: input.email,
      ...(input.material ? { material: input.material } : {}),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}
