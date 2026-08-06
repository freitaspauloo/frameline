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
export const CHECKOUT_PLAN_KEYS = [
  "test",
  "static",
  "personal",
  "team",
] as const;
export type CheckoutPlanKey = (typeof CHECKOUT_PLAN_KEYS)[number];

export const LICENSE_PLANS: LicensePlanDefinition[] = [
  {
    key: "free",
    name: "Free",
    priceLabel: "$0",
    amountCents: 0,
    summary: "Excellent free materials. Same craft bar as paid.",
    permitted: [
      "Install free SKUs into your projects",
      "Commercial use of free materials",
      "Copy / CLI install without an account",
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

/** @deprecated Prefer isCheckoutPlan — kept for API stub callers. */
export function isLicensePlan(value: string): value is CheckoutPlanKey {
  return isCheckoutPlan(value);
}

/** Compact meta for checkout API / UI that only needs paid React plans. */
export const LICENSE_PLAN_META: Record<
  "personal" | "team",
  { label: string; amountCents: number; amountLabel: string }
> = {
  personal: { label: "Personal", amountCents: 9900, amountLabel: "$99" },
  team: { label: "Team", amountCents: 29900, amountLabel: "$299" },
};

/** Alias used by early stubs — personal | team only. */
export type LicensePlan = "personal" | "team";
