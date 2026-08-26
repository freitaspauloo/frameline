import { readFile } from "node:fs/promises";
import path from "node:path";
import { AdminLink } from "@/components/admin-nav";

import {
  BarList,
  Panel,
  percent,
  StatGrid,
  type Stat,
} from "@/components/admin-metrics";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import { readDemoOrders } from "@/lib/fulfillment";
import {
  formatCents,
  funnelSummary,
  revenueSummary,
  signupSummary,
  trafficSummary,
} from "@/lib/metrics";
import { MATERIALS_CATALOG } from "@/materials";

async function readWaitlistCount(): Promise<number> {
  if (hasDatabaseUrl()) {
    try {
      return await getPrisma().emailCapture.count({
        where: { source: "waitlist" },
      });
    } catch {
      return 0;
    }
  }
  const waitlistPath = path.join(process.cwd(), ".data", "waitlist.json");
  try {
    const raw = await readFile(waitlistPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

async function readContactCount(): Promise<number> {
  const contactPath = path.join(process.cwd(), ".data", "contact.json");
  try {
    const raw = await readFile(contactPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const materialCount = MATERIALS_CATALOG.length;
  const freeCount = MATERIALS_CATALOG.filter((m) => m.tier === "free").length;
  const paidCount = materialCount - freeCount;

  const [orders, waitlistCount, inboxCount, revenue, signups, funnel, traffic] =
    await Promise.all([
      readDemoOrders(),
      readWaitlistCount(),
      readContactCount(),
      revenueSummary(),
      signupSummary(),
      funnelSummary(),
      trafficSummary(),
    ]);

  const stats: Stat[] = [
    { label: "Visits", value: traffic.pageViews, hint: `${traffic.uniqueVisitors} unique` },
    { label: "Signups", value: signups.total, href: "/admin/signups" },
    {
      label: "MRR",
      value: formatCents(revenue.mrrCents),
      hint: `${revenue.activeSubscriptions} active`,
    },
    {
      label: "Net revenue",
      value: formatCents(revenue.netCents),
      hint: `${revenue.paidOrders} orders`,
      href: "/admin/orders",
    },
    { label: "Copies", value: funnel.copies, href: "/admin/analytics" },
    { label: "Paywall hits", value: funnel.blocked, href: "/admin/analytics" },
    { label: "Waitlist", value: waitlistCount },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revenue, catalog, and high-level counts. Usage charts, funnels, and
          asset breakdowns live in{" "}
          <AdminLink
            className="text-foreground underline underline-offset-4"
            href="/admin/analytics"
          >
            Analytics
          </AdminLink>
          .
        </p>
      </div>

      <StatGrid stats={stats} />

      <Panel
        description="Revenue recognized from paid orders. MRR normalizes yearly plans to a monthly figure so both plans can be added together."
        meta={
          <p className="font-mono text-sm tabular-nums text-foreground">
            {formatCents(revenue.grossCents)} gross
          </p>
        }
        title="Revenue"
      >
        <StatGrid
          columns={4}
          stats={[
            { label: "Gross", value: formatCents(revenue.grossCents) },
            {
              label: "Refunded",
              value: formatCents(revenue.refundedCents),
              hint: `${revenue.refundedOrders} orders`,
            },
            { label: "ARPU", value: formatCents(revenue.arpuCents) },
            {
              label: "Churned subs",
              value: revenue.canceledSubscriptions,
            },
          ]}
        />
        <div className="mt-6">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Subscriptions
          </p>
          <StatGrid
            columns={3}
            stats={[
              {
                label: "Monthly",
                value: revenue.subscriptions.monthly.active,
                hint: `${formatCents(revenue.subscriptions.monthly.mrrCents)} MRR`,
              },
              {
                label: "Yearly",
                value: revenue.subscriptions.yearly.active,
                hint: `${formatCents(revenue.subscriptions.yearly.mrrCents)} MRR`,
              },
              {
                label: "Lifetime",
                value: revenue.subscriptions.lifetime.count,
                hint: formatCents(revenue.subscriptions.lifetime.grossCents),
              },
            ]}
          />
        </div>
        <div className="mt-6">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            By plan
          </p>
          <div className="mt-3">
            <BarList
              empty="No paid orders yet."
              rows={revenue.byPlan.map((row) => ({
                label: row.plan,
                value: row.grossCents,
                sublabel: `${row.orders} orders · ${formatCents(row.grossCents)}`,
              }))}
            />
          </div>
        </div>
      </Panel>

      <Panel title="Catalog">
        <StatGrid
          columns={4}
          stats={[
            { label: "Materials", value: materialCount, href: "/admin/materials" },
            {
              label: "Signups",
              value: signups.total,
              href: "/admin/signups",
            },
            { label: "Orders", value: orders.length, href: "/admin/orders" },
            { label: "Inbox", value: inboxCount, href: "/admin/inbox" },
          ]}
        />
      </Panel>

      <div className="border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          Free SKUs:{" "}
          <span className="font-mono text-foreground">{freeCount}</span>
          {" · "}
          Paid SKUs:{" "}
          <span className="font-mono text-foreground">{paidCount}</span>
          {" · "}
          Signup → paid:{" "}
          <span className="font-mono text-foreground">
            {percent(signups.paidConversion)}
          </span>
        </p>
      </div>
    </div>
  );
}
