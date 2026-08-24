import { agentClass, agentLabel, type AgentKind } from "@/lib/agent-detect";
import { readEvents, type EventRecord } from "@/lib/events";
import { readDemoOrders, type DemoOrder } from "@/lib/fulfillment";
import { getLicensePlan } from "@/lib/license-plans";
import { countUsers, readUsers } from "@/lib/users";

/**
 * Dashboard rollups.
 *
 * Everything here reads through the storage-agnostic helpers, so the numbers
 * are identical whether the instance is on Postgres or the `.data` fallback.
 */

export type RevenueSummary = {
  grossCents: number;
  refundedCents: number;
  netCents: number;
  paidOrders: number;
  refundedOrders: number;
  /** Normalized monthly recurring revenue from active subscriptions. */
  mrrCents: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  arpuCents: number;
  byPlan: Array<{ plan: string; orders: number; grossCents: number }>;
  subscriptions: SubscriptionBreakdown;
};

export type SubscriptionBreakdown = {
  monthly: { active: number; mrrCents: number; grossCents: number };
  yearly: { active: number; mrrCents: number; grossCents: number };
  lifetime: { count: number; grossCents: number };
};

export type FunnelSummary = {
  copies: number;
  blocked: number;
  registryFetches: number;
  assetFetches: number;
  /** Copies whose code was later resolved or rendered somewhere. */
  copiesUsed: number;
  useRate: number;
  medianSecondsToUse: number | null;
};

export type SeriesPoint = { date: string; value: number };

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function isSubscriptionPlan(planKey: string): boolean {
  return planKey === "screen" || planKey === "screen_year";
}

function isLifetimePlan(planKey: string): boolean {
  return planKey === "screen_lifetime";
}

/** Per-month value of a plan, so yearly and monthly can be added together. */
function monthlyValueCents(planKey: string): number {
  const plan = getLicensePlan(planKey);
  if (!plan) return 0;
  if (plan.interval === "month") return plan.amountCents;
  if (plan.interval === "year") return Math.round(plan.amountCents / 12);
  return 0;
}

export async function revenueSummary(): Promise<RevenueSummary> {
  const orders = await readDemoOrders();
  const paid = orders.filter((o) => o.status === "paid");
  const refunded = orders.filter((o) => o.status === "refunded");

  const grossCents = paid.reduce((sum, o) => sum + o.total, 0);
  const refundedCents = refunded.reduce((sum, o) => sum + o.total, 0);

  const activeSubs = paid.filter(
    (o) => isSubscriptionPlan(o.planKey) && !o.canceledAt,
  );
  const canceledSubs = orders.filter(
    (o) => isSubscriptionPlan(o.planKey) && Boolean(o.canceledAt),
  );

  const mrrCents = activeSubs.reduce(
    (sum, o) => sum + monthlyValueCents(o.planKey),
    0,
  );

  const byPlanMap = new Map<string, { orders: number; grossCents: number }>();
  for (const order of paid) {
    const current = byPlanMap.get(order.planKey) ?? { orders: 0, grossCents: 0 };
    current.orders += 1;
    current.grossCents += order.total;
    byPlanMap.set(order.planKey, current);
  }

  const customers = new Set(paid.map((o) => o.email)).size;

  const monthlyPaid = paid.filter(
    (o) => o.planKey === "screen" && !o.canceledAt,
  );
  const yearlyPaid = paid.filter(
    (o) => o.planKey === "screen_year" && !o.canceledAt,
  );
  const lifetimePaid = paid.filter((o) => isLifetimePlan(o.planKey));

  return {
    grossCents,
    refundedCents,
    netCents: grossCents - refundedCents,
    paidOrders: paid.length,
    refundedOrders: refunded.length,
    mrrCents,
    activeSubscriptions: activeSubs.length,
    canceledSubscriptions: canceledSubs.length,
    arpuCents: customers ? Math.round(grossCents / customers) : 0,
    byPlan: [...byPlanMap.entries()]
      .map(([plan, value]) => ({ plan, ...value }))
      .sort((a, b) => b.grossCents - a.grossCents),
    subscriptions: {
      monthly: {
        active: monthlyPaid.length,
        mrrCents: monthlyPaid.length * monthlyValueCents("screen"),
        grossCents: monthlyPaid.reduce((sum, o) => sum + o.total, 0),
      },
      yearly: {
        active: yearlyPaid.length,
        mrrCents: yearlyPaid.reduce(
          (sum, o) => sum + monthlyValueCents(o.planKey),
          0,
        ),
        grossCents: yearlyPaid.reduce((sum, o) => sum + o.total, 0),
      },
      lifetime: {
        count: lifetimePaid.length,
        grossCents: lifetimePaid.reduce((sum, o) => sum + o.total, 0),
      },
    },
  };
}

/**
 * Copy-to-use funnel.
 *
 * A copy counts as "used" when a later registry or asset fetch carries the same
 * copyId — that is, the payload was pasted somewhere and something resolved it.
 */
export async function funnelSummary(since?: Date): Promise<FunnelSummary> {
  const events = await readEvents({
    names: ["copy", "copy_blocked", "registry_fetch", "asset_fetch"],
    since,
    limit: 50_000,
  });

  const copies = events.filter((e) => e.name === "copy");
  const blocked = events.filter((e) => e.name === "copy_blocked");
  const registryFetches = events.filter((e) => e.name === "registry_fetch");
  const assetFetches = events.filter((e) => e.name === "asset_fetch");

  const firstUseByCopyId = new Map<string, number>();
  for (const event of [...registryFetches, ...assetFetches]) {
    if (!event.copyId) continue;
    const at = new Date(event.createdAt).getTime();
    const existing = firstUseByCopyId.get(event.copyId);
    if (existing === undefined || at < existing) {
      firstUseByCopyId.set(event.copyId, at);
    }
  }

  const latencies: number[] = [];
  let copiesUsed = 0;
  for (const copy of copies) {
    if (!copy.copyId) continue;
    const usedAt = firstUseByCopyId.get(copy.copyId);
    if (usedAt === undefined) continue;
    copiesUsed += 1;
    latencies.push((usedAt - new Date(copy.createdAt).getTime()) / 1000);
  }

  latencies.sort((a, b) => a - b);
  const median = latencies.length
    ? latencies[Math.floor(latencies.length / 2)]
    : null;

  return {
    copies: copies.length,
    blocked: blocked.length,
    registryFetches: registryFetches.length,
    assetFetches: assetFetches.length,
    copiesUsed,
    useRate: copies.length ? copiesUsed / copies.length : 0,
    medianSecondsToUse: median === null ? null : Math.round(median),
  };
}

/** Copies, paywall hits, views, and downstream usage per material or screen. Newest-first by copy count. */
export async function usageBySlug(since?: Date): Promise<
  Array<{
    slug: string;
    views: number;
    copies: number;
    blocked: number;
    registryFetches: number;
    assetFetches: number;
    installs: number;
  }>
> {
  const events = await readEvents({
    names: [
      "material_view",
      "copy",
      "copy_blocked",
      "registry_fetch",
      "asset_fetch",
      "install_intent",
    ],
    since,
    limit: 50_000,
  });

  const rows = new Map<
    string,
    {
      slug: string;
      views: number;
      copies: number;
      blocked: number;
      registryFetches: number;
      assetFetches: number;
      installs: number;
    }
  >();

  for (const event of events) {
    if (!event.slug) continue;
    const row = rows.get(event.slug) ?? {
      slug: event.slug,
      views: 0,
      copies: 0,
      blocked: 0,
      registryFetches: 0,
      assetFetches: 0,
      installs: 0,
    };
    if (event.name === "material_view") row.views += 1;
    if (event.name === "copy") row.copies += 1;
    if (event.name === "copy_blocked") row.blocked += 1;
    if (event.name === "registry_fetch") row.registryFetches += 1;
    if (event.name === "asset_fetch") row.assetFetches += 1;
    if (event.name === "install_intent") row.installs += 1;
    rows.set(event.slug, row);
  }

  return [...rows.values()].sort(
    (a, b) =>
      b.copies - a.copies ||
      b.blocked - a.blocked ||
      b.registryFetches - a.registryFetches ||
      a.slug.localeCompare(b.slug),
  );
}

/** Which agents and IDEs are pulling Frameline code. */
export async function fetchesByAgent(since?: Date): Promise<
  Array<{ kind: string; label: string; group: string; count: number }>
> {
  const events = await readEvents({
    names: ["registry_fetch", "asset_fetch"],
    since,
    limit: 50_000,
  });

  const counts = new Map<string, number>();
  for (const event of events) {
    const kind = event.agentKind ?? "unknown";
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([kind, count]) => ({
      kind,
      label: agentLabel(kind),
      group: agentClass(kind as AgentKind),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Daily counts for the last `days`, oldest first, with zero-filled gaps. */
export function dailySeries(
  items: Array<{ createdAt: string }>,
  days = 30,
): SeriesPoint[] {
  const buckets = new Map<string, number>();
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setUTCDate(day.getUTCDate() - i);
    buckets.set(day.toISOString().slice(0, 10), 0);
  }

  for (const item of items) {
    const key = item.createdAt.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([date, value]) => ({ date, value }));
}

export type SignupSummary = {
  total: number;
  last30: number;
  series: SeriesPoint[];
  paidConversion: number;
  byAuthMethod: Array<{ method: string; count: number }>;
};

export type TrafficSummary = {
  pageViews: number;
  uniqueVisitors: number;
  clicks: number;
  viewsSeries: SeriesPoint[];
  topPages: Array<{ path: string; count: number }>;
  topClicks: Array<{ label: string; count: number; href?: string }>;
};

export async function trafficSummary(since?: Date): Promise<TrafficSummary> {
  const events = await readEvents({
    names: ["page_view", "click"],
    since,
    limit: 50_000,
  });

  const pageViews = events.filter((e) => e.name === "page_view");
  const clicks = events.filter((e) => e.name === "click");
  const visitors = new Set(
    pageViews.map((e) => e.subjectId || e.ipHash || e.id),
  );

  const pageCounts = new Map<string, number>();
  for (const event of pageViews) {
    const path = event.source ?? "unknown";
    pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1);
  }

  const clickCounts = new Map<
    string,
    { label: string; count: number; href?: string }
  >();
  for (const event of clicks) {
    const label =
      (event.props?.label as string | undefined)?.trim() || "Unlabeled";
    const href = (event.props?.href as string | undefined)?.trim();
    const key = `${label}::${href ?? ""}`;
    const current = clickCounts.get(key) ?? { label, count: 0, href };
    current.count += 1;
    clickCounts.set(key, current);
  }

  return {
    pageViews: pageViews.length,
    uniqueVisitors: visitors.size,
    clicks: clicks.length,
    viewsSeries: dailySeries(pageViews),
    topPages: [...pageCounts.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
    topClicks: [...clickCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
  };
}

export async function signupSummary(): Promise<SignupSummary> {
  const [users, orders, total, signupEvents] = await Promise.all([
    readUsers(),
    readDemoOrders(),
    countUsers(),
    readEvents({ names: ["signup"], limit: 50_000 }),
  ]);

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = users.filter(
    (u) => new Date(u.createdAt).getTime() >= cutoff,
  );
  const payingEmails = new Set(
    orders.filter((o) => o.status === "paid").map((o) => o.email),
  );

  // Only count buyers who actually have a user record. Orders predating user
  // records would otherwise push this above 100%.
  const payingUsers = users.filter((u) => payingEmails.has(u.email)).length;

  const authCounts = new Map<string, number>();
  for (const event of signupEvents) {
    const method =
      (event.props?.authMethod as string | undefined)?.trim() || "unknown";
    authCounts.set(method, (authCounts.get(method) ?? 0) + 1);
  }

  return {
    total,
    last30: recent.length,
    series: dailySeries(users),
    paidConversion: total ? payingUsers / total : 0,
    byAuthMethod: [...authCounts.entries()]
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/** Recent activity for one material or screen. */
export async function recentEventsForSlug(
  slug: string,
  limit = 50,
): Promise<EventRecord[]> {
  return readEvents({ slug, limit });
}

export type { DemoOrder };
