import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { classifyAgent } from "@/lib/agent-detect";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import { clientIp } from "@/lib/rate-limit";

/**
 * First-party analytics stream.
 *
 * Mirrors the storage split used by src/lib/fulfillment.ts: Postgres when
 * DATABASE_URL is set, `.data/events.json` otherwise, so the admin dashboard
 * works in local development without a database.
 *
 * recordEvent never throws. Analytics must not be able to break a checkout,
 * a copy, or a sign-in.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const EVENTS_PATH = path.join(DATA_DIR, "events.json");

/** Keep the file fallback bounded; the database path is unbounded. */
const FILE_EVENT_CAP = 20_000;

export type EventName =
  | "signup"
  | "signin"
  | "waitlist_join"
  | "page_view"
  | "click"
  | "material_view"
  | "copy"
  | "copy_blocked"
  | "install_intent"
  | "wtp_intent"
  | "checkout_started"
  | "order_paid"
  | "order_refunded"
  | "subscription_renewed"
  | "subscription_canceled"
  | "registry_fetch"
  | "asset_fetch";

export type RecordEventInput = {
  name: EventName;
  email?: string | null;
  anonId?: string | null;
  slug?: string | null;
  plan?: string | null;
  copyId?: string | null;
  source?: string | null;
  /** Supplies User-Agent and client IP; omit for server-originated events. */
  request?: Request | null;
  /** Overrides User-Agent classification (e.g. a known registry client). */
  agentKind?: string | null;
  props?: Record<string, unknown> | null;
};

export type EventRecord = {
  id: string;
  name: string;
  subjectId: string;
  email: string | null;
  anonId: string | null;
  slug: string | null;
  plan: string | null;
  copyId: string | null;
  source: string | null;
  agentKind: string | null;
  userAgent: string | null;
  ipHash: string | null;
  props: Record<string, unknown> | null;
  createdAt: string;
};

export type EventQuery = {
  names?: EventName[];
  since?: Date;
  slug?: string;
  copyId?: string;
  limit?: number;
};

/**
 * One-way IP fingerprint for abuse triage and unique counts.
 * Salted so the hashes are not reversible via a rainbow table of the IPv4 space.
 */
export function hashIp(ip: string): string | null {
  const normalized = ip.trim();
  if (!normalized || normalized === "unknown") return null;
  const salt =
    process.env.EVENT_IP_SALT?.trim() ||
    process.env.SCREEN_QUOTA_SECRET?.trim() ||
    "frameline-dev-event-salt";
  return createHash("sha256")
    .update(`${salt}:${normalized}`)
    .digest("hex")
    .slice(0, 32);
}

/** `email:<addr>` when known so pre-signup anon activity can be stitched later. */
export function subjectIdFor(
  email: string | null | undefined,
  anonId: string | null | undefined,
): string {
  const normalized = email?.trim().toLowerCase();
  if (normalized) return `email:${normalized}`;
  const anon = anonId?.trim();
  if (anon) return anon;
  return "anon:unknown";
}

function normalize(input: RecordEventInput) {
  const email = input.email?.trim().toLowerCase() || null;
  const anonId = input.anonId?.trim() || null;
  const userAgent = input.request?.headers.get("user-agent") ?? null;
  const agentKind = input.agentKind ?? classifyAgent(userAgent);
  const ipHash = input.request ? hashIp(clientIp(input.request)) : null;

  return {
    name: input.name,
    subjectId: subjectIdFor(email, anonId),
    email,
    anonId,
    slug: input.slug?.trim() || null,
    plan: input.plan?.trim() || null,
    copyId: input.copyId?.trim() || null,
    source: input.source?.trim() || null,
    agentKind,
    // Long UAs are mostly version noise; keep enough to reclassify later.
    userAgent: userAgent ? userAgent.slice(0, 512) : null,
    ipHash,
    props: input.props ?? null,
  };
}

async function readEventFile(): Promise<EventRecord[]> {
  try {
    const raw = await readFile(EVENTS_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as EventRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeEventFile(entries: EventRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(EVENTS_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

/**
 * Append one event. Returns true when persisted.
 * Swallows every error by design — callers should not branch on analytics.
 */
export async function recordEvent(input: RecordEventInput): Promise<boolean> {
  try {
    const row = normalize(input);

    if (hasDatabaseUrl()) {
      await getPrisma().event.create({
        data: {
          ...row,
          props: (row.props ?? undefined) as never,
        },
      });
      return true;
    }

    const entries = await readEventFile();
    entries.push({
      id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
      ...row,
      createdAt: new Date().toISOString(),
    });
    await writeEventFile(
      entries.length > FILE_EVENT_CAP
        ? entries.slice(entries.length - FILE_EVENT_CAP)
        : entries,
    );
    return true;
  } catch (err) {
    console.error("[events] failed to record", input.name, err);
    return false;
  }
}

/** Read events newest-first. Returns [] on any failure. */
export async function readEvents(query: EventQuery = {}): Promise<EventRecord[]> {
  const limit = query.limit ?? 5_000;

  try {
    if (hasDatabaseUrl()) {
      const rows = await getPrisma().event.findMany({
        where: {
          ...(query.names?.length ? { name: { in: query.names } } : {}),
          ...(query.since ? { createdAt: { gte: query.since } } : {}),
          ...(query.slug ? { slug: query.slug } : {}),
          ...(query.copyId ? { copyId: query.copyId } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        subjectId: row.subjectId,
        email: row.email,
        anonId: row.anonId,
        slug: row.slug,
        plan: row.plan,
        copyId: row.copyId,
        source: row.source,
        agentKind: row.agentKind,
        userAgent: row.userAgent,
        ipHash: row.ipHash,
        props: (row.props as Record<string, unknown> | null) ?? null,
        createdAt: row.createdAt.toISOString(),
      }));
    }

    const entries = await readEventFile();
    const names = query.names ? new Set<string>(query.names) : null;
    const sinceMs = query.since?.getTime();

    return entries
      .filter((entry) => {
        if (names && !names.has(entry.name)) return false;
        if (query.slug && entry.slug !== query.slug) return false;
        if (query.copyId && entry.copyId !== query.copyId) return false;
        if (sinceMs && new Date(entry.createdAt).getTime() < sinceMs) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  } catch (err) {
    console.error("[events] failed to read", err);
    return [];
  }
}

/** Count events by name in one pass. */
export async function countEventsByName(
  since?: Date,
): Promise<Record<string, number>> {
  const events = await readEvents({ since, limit: 50_000 });
  const counts: Record<string, number> = {};
  for (const event of events) {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
  }
  return counts;
}
