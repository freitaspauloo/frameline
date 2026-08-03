import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

import { readDemoOrders } from "@/lib/fulfillment";
import {
  MATERIALS_CATALOG,
  MATERIALS_COLLECTIONS,
} from "@/materials";

async function readWaitlistCount(): Promise<number> {
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

type WtpIntentEntry = {
  plan?: string;
};

async function readWtpByPlan(): Promise<{
  total: number;
  byPlan: Record<string, number>;
}> {
  const wtpPath = path.join(process.cwd(), ".data", "wtp.json");
  try {
    const raw = await readFile(wtpPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { total: 0, byPlan: {} };
    const byPlan: Record<string, number> = {};
    for (const entry of parsed as WtpIntentEntry[]) {
      const plan = typeof entry.plan === "string" ? entry.plan : "unknown";
      byPlan[plan] = (byPlan[plan] ?? 0) + 1;
    }
    return { total: parsed.length, byPlan };
  } catch {
    return { total: 0, byPlan: {} };
  }
}

export default async function AdminDashboardPage() {
  const materialCount = MATERIALS_CATALOG.length;
  const collectionCount = MATERIALS_COLLECTIONS.length;
  const freeCount = MATERIALS_CATALOG.filter((m) => m.tier === "free").length;
  const paidCount = materialCount - freeCount;

  const orders = await readDemoOrders();
  const waitlistCount = await readWaitlistCount();
  const inboxCount = await readContactCount();
  const wtp = await readWtpByPlan();

  const stats = [
    { label: "Materials", value: materialCount, href: "/admin/materials" },
    {
      label: "Collections",
      value: collectionCount,
      href: "/admin/collections",
    },
    { label: "Orders", value: orders.length, href: "/admin/orders" },
    { label: "Inbox", value: inboxCount, href: "/admin/inbox" },
    { label: "Waitlist", value: waitlistCount, href: null },
  ] as const;

  const planOrder = ["static", "personal", "team"] as const;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Catalog snapshot plus demo store counts from{" "}
          <span className="font-mono">.data/</span>.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
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

      <section className="border border-border p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            WTP intent
          </h2>
          <p className="font-mono text-sm tabular-nums text-foreground">
            {wtp.total} total
          </p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Fake-door plan clicks from{" "}
          <span className="font-mono">.data/wtp.json</span> (pricing Buy +
          checkout submit). Counts are instance-local — not Gate 01 metrics.
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-px border border-border bg-border">
          {planOrder.map((plan) => (
            <div className="bg-background p-4" key={plan}>
              <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {plan}
              </dt>
              <dd className="mt-3 font-mono text-2xl tabular-nums text-foreground">
                {wtp.byPlan[plan] ?? 0}
              </dd>
            </div>
          ))}
        </dl>
      </section>

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
