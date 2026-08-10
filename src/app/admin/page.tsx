import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import { readDemoOrders } from "@/lib/fulfillment";
import {
  MATERIALS_CATALOG,
  MATERIALS_COLLECTIONS,
} from "@/materials";

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

type WtpIntentEntry = {
  plan?: string;
  material?: string;
  email?: string;
  source?: string;
  createdAt?: string;
};

async function readWtp(): Promise<{
  total: number;
  byPlan: Record<string, number>;
  recent: WtpIntentEntry[];
  rawJson: string;
}> {
  const wtpPath = path.join(process.cwd(), ".data", "wtp.json");
  try {
    const raw = await readFile(wtpPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return { total: 0, byPlan: {}, recent: [], rawJson: "[]\n" };
    }
    const entries = parsed as WtpIntentEntry[];
    const byPlan: Record<string, number> = {};
    for (const entry of entries) {
      const plan = typeof entry.plan === "string" ? entry.plan : "unknown";
      byPlan[plan] = (byPlan[plan] ?? 0) + 1;
    }
    const recent = [...entries].reverse().slice(0, 5);
    return {
      total: entries.length,
      byPlan,
      recent,
      rawJson: `${JSON.stringify(entries, null, 2)}\n`,
    };
  } catch {
    return { total: 0, byPlan: {}, recent: [], rawJson: "[]\n" };
  }
}

type InstallIntentEntry = {
  slug?: string;
  source?: string;
  path?: string;
  createdAt?: string;
};

async function readInstalls(): Promise<{
  total: number;
  bySource: Record<string, number>;
  bySlug: Record<string, number>;
  recent: InstallIntentEntry[];
  rawJson: string;
}> {
  const installsPath = path.join(process.cwd(), ".data", "installs.json");
  try {
    const raw = await readFile(installsPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return {
        total: 0,
        bySource: {},
        bySlug: {},
        recent: [],
        rawJson: "[]\n",
      };
    }
    const entries = parsed as InstallIntentEntry[];
    const bySource: Record<string, number> = {};
    const bySlug: Record<string, number> = {};
    for (const entry of entries) {
      const source = typeof entry.source === "string" ? entry.source : "unknown";
      bySource[source] = (bySource[source] ?? 0) + 1;
      const slug = typeof entry.slug === "string" ? entry.slug : "unknown";
      bySlug[slug] = (bySlug[slug] ?? 0) + 1;
    }
    const recent = [...entries].reverse().slice(0, 5);
    return {
      total: entries.length,
      bySource,
      bySlug,
      recent,
      rawJson: `${JSON.stringify(entries, null, 2)}\n`,
    };
  } catch {
    return {
      total: 0,
      bySource: {},
      bySlug: {},
      recent: [],
      rawJson: "[]\n",
    };
  }
}

function formatTs(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().replace("T", " ").slice(0, 19) + "Z";
}

export default async function AdminDashboardPage() {
  const materialCount = MATERIALS_CATALOG.length;
  const collectionCount = MATERIALS_COLLECTIONS.length;
  const freeCount = MATERIALS_CATALOG.filter((m) => m.tier === "free").length;
  const paidCount = materialCount - freeCount;

  const orders = await readDemoOrders();
  const waitlistCount = await readWaitlistCount();
  const inboxCount = await readContactCount();
  const wtp = await readWtp();
  const installs = await readInstalls();

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
    { label: "Installs", value: installs.total, href: null },
  ] as const;

  const planOrder = ["static", "personal", "team"] as const;
  const sourceOrder = ["home", "free", "material-detail"] as const;
  const wtpDownloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(wtp.rawJson)}`;
  const installsDownloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(installs.rawJson)}`;
  const topSlugs = Object.entries(installs.bySlug)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Catalog snapshot plus orders/waitlist from Postgres when configured
          (else local <span className="font-mono">.data/</span>).
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
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
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-sm tabular-nums text-foreground">
              {wtp.total} total
            </p>
            <a
              className="font-mono text-[11px] text-foreground underline underline-offset-4 hover:text-muted-foreground"
              download="wtp.json"
              href={wtpDownloadHref}
            >
              Download wtp.json
            </a>
          </div>
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

        <div className="mt-6">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Last 5
          </p>
          {wtp.recent.length === 0 ? (
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              No intents yet.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border border border-border">
              {wtp.recent.map((entry, i) => (
                <li
                  className="flex flex-col gap-1 px-3 py-2.5 font-mono text-[11px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  key={`${entry.createdAt ?? "x"}-${entry.plan ?? "p"}-${i}`}
                >
                  <span className="text-foreground">
                    <span className="text-muted-foreground">plan</span>{" "}
                    {entry.plan ?? "unknown"}
                    {entry.material ? (
                      <>
                        {" · "}
                        <span className="text-muted-foreground">sku</span>{" "}
                        {entry.material}
                      </>
                    ) : null}
                    {entry.source ? (
                      <>
                        {" · "}
                        <span className="text-muted-foreground">src</span>{" "}
                        {entry.source}
                      </>
                    ) : null}
                    {entry.email ? (
                      <>
                        {" · "}
                        <span className="text-muted-foreground">email</span>{" "}
                        {entry.email}
                      </>
                    ) : null}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatTs(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="border border-border p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            Install intent
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-sm tabular-nums text-foreground">
              {installs.total} total
            </p>
            <a
              className="font-mono text-[11px] text-foreground underline underline-offset-4 hover:text-muted-foreground"
              download="installs.json"
              href={installsDownloadHref}
            >
              Download installs.json
            </a>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Fake npx / copy beacons from{" "}
          <span className="font-mono">.data/installs.json</span> (home, free,
          material detail). Instance-local — Gate G4 needs a durable store in
          production.
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-px border border-border bg-border">
          {sourceOrder.map((source) => (
            <div className="bg-background p-4" key={source}>
              <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {source}
              </dt>
              <dd className="mt-3 font-mono text-2xl tabular-nums text-foreground">
                {installs.bySource[source] ?? 0}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Top SKUs
            </p>
            {topSlugs.length === 0 ? (
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                No installs yet.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-border border border-border">
                {topSlugs.map(([slug, count]) => (
                  <li
                    className="flex items-baseline justify-between gap-4 px-3 py-2.5 font-mono text-[11px]"
                    key={slug}
                  >
                    <span className="text-foreground">{slug}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Last 5
            </p>
            {installs.recent.length === 0 ? (
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                No installs yet.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-border border border-border">
                {installs.recent.map((entry, i) => (
                  <li
                    className="flex flex-col gap-1 px-3 py-2.5 font-mono text-[11px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    key={`${entry.createdAt ?? "x"}-${entry.slug ?? "s"}-${i}`}
                  >
                    <span className="text-foreground">
                      <span className="text-muted-foreground">sku</span>{" "}
                      {entry.slug ?? "unknown"}
                      {entry.path ? (
                        <>
                          {" · "}
                          <span className="text-muted-foreground">path</span>{" "}
                          {entry.path}
                        </>
                      ) : null}
                      {entry.source ? (
                        <>
                          {" · "}
                          <span className="text-muted-foreground">src</span>{" "}
                          {entry.source}
                        </>
                      ) : null}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {formatTs(entry.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
