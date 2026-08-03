import Link from "next/link";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Orders
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Fulfillment</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Orders appear after Stripe webhook fulfillment.
        </p>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[32rem] text-left text-sm">
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
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-3 py-2.5 font-mono text-[11px]">
                <Link
                  className="underline underline-offset-4 hover:text-muted-foreground"
                  href="/orders/demo?plan=personal"
                >
                  demo
                </Link>
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                you@studio.dev
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px]">personal</td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                demo · fulfilled
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        Empty beyond the sample row until checkout webhooks land.
      </p>
    </div>
  );
}
