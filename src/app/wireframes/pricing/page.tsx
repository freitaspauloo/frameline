import {
  WfBtn,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Install and ship materials. Same craft bar.",
    cta: false,
  },
  {
    name: "Screen",
    price: "$9",
    blurb: "Unlimited prompt + code copies for one template.",
    cta: true,
  },
] as const;

export default function WireframePricingPage() {
  return (
    <WireframeShell
      flow="Paid"
      nextHref="/wireframes/checkout"
      nextLabel="Checkout"
      route="/wireframes/pricing"
      title="Pricing"
    >
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <WfTitle>Choose a license</WfTitle>
        <WfMuted>
          Plain-language rights. Pay once — reinstall from Account anytime.
        </WfMuted>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {TIERS.map((tier) => (
          <div
            className="flex flex-col rounded-relay-lg border border-relay-border bg-relay-white p-5"
            key={tier.name}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-relay-secondary">
              {tier.name}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-relay-ink">
              {tier.price}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-relay-secondary">
              {tier.blurb}
            </p>
            <div className="mt-auto pt-6">
              {tier.cta ? (
                <WfBtn className="w-full" href="/wireframes/checkout">
                  Continue to checkout
                </WfBtn>
              ) : (
                <WfBtn
                  className="w-full"
                  href="/wireframes/materials"
                  variant="secondary"
                >
                  Browse free
                </WfBtn>
              )}
            </div>
          </div>
        ))}
      </div>
    </WireframeShell>
  );
}
