import Stripe from "stripe";

import type { CheckoutPlanKey } from "@/lib/license-plans";
import { getLicensePlan } from "@/lib/license-plans";

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
    input.plan === "static" && input.material
      ? `Frameline Static — ${input.material}`
      : `Frameline ${license.name}`;

  return client.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: license.amountCents,
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
    success_url: `${base}/orders/{CHECKOUT_SESSION_ID}?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(input.email)}&plan=${encodeURIComponent(input.plan)}${input.material ? `&material=${encodeURIComponent(input.material)}` : ""}`,
    cancel_url: `${base}/checkout?plan=${encodeURIComponent(input.plan)}${input.material ? `&material=${encodeURIComponent(input.material)}` : ""}&cancelled=1`,
  });
}
