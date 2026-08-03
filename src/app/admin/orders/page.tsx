import Link from "next/link";

import { readDemoOrders } from "@/lib/fulfillment";
import { getLicensePlan } from "@/lib/license-plans";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default async function AdminOrdersPage() {
  const orders = await readDemoOrders();
  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Orders
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Fulfillment</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Demo orders from{" "}
          <span className="font-mono">.data/orders.json</span>
          {" — "}
          checkout or webhook without Stripe secrets.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="border border-border px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No orders yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Complete demo checkout or POST{" "}
            <span className="font-mono">
              {"{ type: \"checkout.session.completed\", email, plan }"}
            </span>{" "}
            to{" "}
            <span className="font-mono">/api/webhooks/stripe</span>.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Order
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Email
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Plan
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Total
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((order) => {
                const license = getLicensePlan(order.planKey);
                const qs = new URLSearchParams({
                  plan: order.planKey,
                  email: order.email,
                  orderId: order.id,
                });
                if (order.materialSlug) qs.set("material", order.materialSlug);
                return (
                  <tr className="border-b border-border" key={order.id}>
                    <td className="px-3 py-2.5 font-mono text-[11px]">
                      <Link
                        className="underline underline-offset-4 hover:text-muted-foreground"
                        href={`/orders/demo?${qs.toString()}`}
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                      {order.email}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px]">
                      {license?.name ?? order.planKey}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] tabular-nums">
                      {formatCents(order.total)}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                      {order.status} · fulfilled
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        {sorted.length === 0
          ? "Empty until demo checkout or webhook fulfillment writes the store."
          : `${sorted.length} order${sorted.length === 1 ? "" : "s"} in demo store.`}
      </p>
    </div>
  );
}
