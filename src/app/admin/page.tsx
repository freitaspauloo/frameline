import Link from "next/link";

import {
  MATERIALS_CATALOG,
  MATERIALS_COLLECTIONS,
} from "@/materials";

export default function AdminDashboardPage() {
  const materialCount = MATERIALS_CATALOG.length;
  const collectionCount = MATERIALS_COLLECTIONS.length;
  const freeCount = MATERIALS_CATALOG.filter((m) => m.tier === "free").length;
  const paidCount = materialCount - freeCount;

  const stats = [
    { label: "Materials", value: materialCount, href: "/admin/materials" },
    {
      label: "Collections",
      value: collectionCount,
      href: "/admin/collections",
    },
    { label: "Orders (demo)", value: 1, href: "/admin/orders" },
    { label: "Waitlist", value: "—", href: null },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Catalog snapshot. Orders and waitlist fill in after Stripe webhooks.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
        {stats.map((stat) => {
          const inner = (
            <>
              <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </dt>
              <dd className="mt-3 font-mono text-2xl tabular-nums text-foreground">
                {stat.value}
              </dd>
            </>
          );
          return (
            <div className="bg-background p-4" key={stat.label}>
              {stat.href ? (
                <Link className="block hover:opacity-80" href={stat.href}>
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </dl>

      <div className="border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          Free SKUs:{" "}
          <span className="font-mono text-foreground">{freeCount}</span>
          {" · "}
          Paid SKUs:{" "}
          <span className="font-mono text-foreground">{paidCount}</span>
        </p>
      </div>
    </div>
  );
}
