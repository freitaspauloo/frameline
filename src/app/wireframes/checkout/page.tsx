import {
  WfBtn,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default function WireframeCheckoutPage() {
  return (
    <WireframeShell
      flow="Paid"
      nextHref="/wireframes/orders/demo"
      nextLabel="Confirmation"
      route="/wireframes/checkout"
      title="Checkout"
    >
      <div className="mx-auto max-w-md rounded-relay-lg border border-dashed border-relay-blue/40 bg-relay-white p-6 shadow-relay-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-relay-secondary">
          Hosted · Stripe
        </p>
        <WfTitle className="mt-3 text-2xl sm:text-3xl">Checkout</WfTitle>
        <WfMuted className="mt-2">
          Guest pay. Email captured for receipt and account access.
        </WfMuted>

        <div className="mt-6 space-y-3">
          <label className="block space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-relay-secondary">
              Email
            </span>
            <input
              className="h-11 w-full rounded-relay-md border border-relay-border bg-relay-panel px-3 text-sm text-relay-ink outline-none focus:border-relay-blue focus:ring-3 focus:ring-ring"
              defaultValue="you@studio.dev"
              type="email"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-relay-secondary">
              Card
            </span>
            <input
              className="h-11 w-full rounded-relay-md border border-relay-border bg-relay-panel px-3 text-sm text-relay-ink outline-none focus:border-relay-blue focus:ring-3 focus:ring-ring"
              defaultValue="•••• •••• •••• 4242"
              readOnly
              type="text"
            />
          </label>
        </div>

        <WfBtn className="mt-6 w-full" href="/wireframes/orders/demo">
          Pay $9
        </WfBtn>
      </div>
    </WireframeShell>
  );
}
