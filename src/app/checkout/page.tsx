import Link from "next/link";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { RelayButton } from "@/components/relay-ui";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; material?: string }>;
}) {
  const { plan = "personal", material } = await searchParams;
  const amount = plan === "team" ? "$299" : "$99";
  const confirmHref = `/orders/demo?plan=${plan}${material ? `&material=${material}` : ""}`;

  return (
    <div className="min-h-dvh bg-relay-canvas text-relay-ink">
      <MarketingNavbar />
      <main className="mx-auto max-w-md px-6 py-16 lg:px-8">
        <div className="rounded-relay-lg border border-relay-border bg-relay-white p-6 shadow-relay-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-relay-secondary">
            Checkout · demo
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {plan === "team" ? "Team" : "Personal"} license
          </h1>
          <p className="mt-2 text-sm text-relay-secondary">
            Demo checkout — no real charge. Completing goes to confirmation.
          </p>

          <div className="mt-6 space-y-3">
            <label className="block space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-relay-secondary">
                Email
              </span>
              <input
                className="h-11 w-full rounded-relay-md border border-relay-border bg-relay-panel px-3 text-sm outline-none focus:border-relay-blue focus:ring-3 focus:ring-ring"
                defaultValue="you@studio.dev"
                type="email"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-relay-secondary">
                Card
              </span>
              <input
                className="h-11 w-full rounded-relay-md border border-relay-border bg-relay-panel px-3 text-sm outline-none focus:border-relay-blue focus:ring-3 focus:ring-ring"
                defaultValue="•••• •••• •••• 4242"
                readOnly
                type="text"
              />
            </label>
          </div>

          <RelayButton
            className="mt-6 w-full"
            nativeButton={false}
            render={<Link href={confirmHref} />}
          >
            Pay {amount}
          </RelayButton>

          <p className="mt-4 text-center text-xs text-relay-tertiary">
            Later this becomes Stripe Checkout.
          </p>
        </div>
      </main>
    </div>
  );
}
