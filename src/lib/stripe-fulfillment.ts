import { fulfillDemoOrder, type FulfillResult } from "@/lib/fulfillment";
import { isCheckoutPlan } from "@/lib/license-plans";
import { getStripe } from "@/lib/stripe";

/**
 * Idempotent fulfill from a Stripe Checkout session id.
 * Used by the success page when the webhook has not landed yet (or as backup).
 */
export async function fulfillStripeSessionId(
  sessionId: string,
): Promise<FulfillResult | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return null;
  }

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

  if (!isCheckoutPlan(plan) || !email.includes("@")) {
    return null;
  }

  return fulfillDemoOrder({
    email,
    plan,
    material,
    paymentProviderRef: session.id,
  });
}
