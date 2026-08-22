import type { LicensePlanKey } from "@/lib/domain";

export const LICENSE_PLAN_VERSION = "2026.1";

export type LicensePlanDefinition = {
  key: LicensePlanKey;
  name: string;
  priceLabel: string;
  amountCents: number;
  summary: string;
  permitted: string[];
  notPermitted: string[];
};

/** Plans sold at checkout (excludes free catalog tier). */
export const CHECKOUT_PLAN_KEYS = ["test", "screen"] as const;
export type CheckoutPlanKey = (typeof CHECKOUT_PLAN_KEYS)[number];

/** Customer-facing pricing — Free ($0) and Screen ($9) only. */
export const PUBLIC_PRICING_KEYS = ["free", "screen"] as const;
export type PublicPricingKey = (typeof PUBLIC_PRICING_KEYS)[number];

export const LICENSE_PLANS: LicensePlanDefinition[] = [
  {
    key: "free",
    name: "Free",
    priceLabel: "$0",
    amountCents: 0,
    summary: "1 free copy per week. Then $9 for unlimited prompt + code.",
    permitted: [
      "1 free prompt or code copy per week",
      "Install materials into your projects",
      "Commercial use of free materials",
    ],
    notPermitted: [
      "Redistribute source packages",
      "Resell materials in templates or asset kits",
    ],
  },
  {
    key: "test",
    name: "Test",
    // Stripe's USD charge floor is $0.50 — use that for live smoke payments.
    priceLabel: "$0.50",
    amountCents: 50,
    summary: "Live Stripe smoke charge. Confirms checkout, webhook, and receipt.",
    permitted: [
      "End-to-end payment path verification",
      "Order + Resend receipt when configured",
    ],
    notPermitted: [
      "Registry / React component install",
      "Commercial license rights",
    ],
  },
  {
    key: "static",
    name: "Static",
    priceLabel: "$19",
    amountCents: 1900,
    summary: "Still exports for decks, social, and non-React surfaces.",
    permitted: [
      "Download static frames / loops for the selected material",
      "Use in decks, social, and video",
    ],
    notPermitted: [
      "Registry / React component install",
      "Redistribute source packages",
    ],
  },
  {
    key: "personal",
    name: "Personal",
    priceLabel: "$99",
    amountCents: 9900,
    summary: "All personal materials · commercial rights · updates.",
    permitted: [
      "All personal-tier SKUs via registry",
      "Commercial projects under your name",
      "Email receipt + account reinstall",
    ],
    notPermitted: [
      "Client deliverables under a studio seat",
      "Redistribute source packages",
    ],
  },
  {
    key: "team",
    name: "Team",
    priceLabel: "$299",
    amountCents: 29900,
    summary: "Client-work rights · seats · invoice-ready.",
    permitted: [
      "Everything in Personal",
      "Client deliverables and multi-seat clarity",
      "Priority support",
    ],
    notPermitted: [
      "Redistribute source packages",
      "Resell materials in templates or asset kits",
    ],
  },
  {
    key: "screen",
    name: "Screen",
    priceLabel: "$9",
    amountCents: 900,
    summary: "Unlimited prompt + code copies for one screen template.",
    permitted: [
      "Unlimited Copy prompt + Copy code for the purchased screen",
      "Commercial use of the screen source in your projects",
    ],
    notPermitted: [
      "Material registry / React shader installs",
      "Redistribute as a competing template kit",
    ],
  },
];

export function getLicensePlan(
  key: string | undefined,
): LicensePlanDefinition | undefined {
  if (!key) return undefined;
  return LICENSE_PLANS.find((p) => p.key === key);
}

export function isCheckoutPlan(value: string): value is CheckoutPlanKey {
  return (CHECKOUT_PLAN_KEYS as readonly string[]).includes(value);
}

export function getPublicPricingPlans(): LicensePlanDefinition[] {
  return LICENSE_PLANS.filter((plan) =>
    (PUBLIC_PRICING_KEYS as readonly string[]).includes(plan.key),
  );
}

/** Plans shown on public checkout (excludes internal $0.50 smoke SKU). */
export function isPublicCheckoutPlan(
  value: string,
): value is Exclude<CheckoutPlanKey, "test"> {
  return value === "screen";
}

/** Re-enable `plan=test` with FRAMELINE_ALLOW_TEST_PLAN=true in env. */
export function isTestCheckoutAllowed(): boolean {
  return process.env.FRAMELINE_ALLOW_TEST_PLAN?.trim() === "true";
}

/** @deprecated Prefer isCheckoutPlan — kept for API stub callers. */
export function isLicensePlan(value: string): value is CheckoutPlanKey {
  return isCheckoutPlan(value);
}

/** Compact meta for checkout API / UI that only needs the paid screen SKU. */
export const LICENSE_PLAN_META: Record<
  "screen",
  { label: string; amountCents: number; amountLabel: string }
> = {
  screen: { label: "Screen", amountCents: 900, amountLabel: "$9" },
};

/** Alias used by early stubs — paid screen SKU only. */
export type LicensePlan = "screen";
