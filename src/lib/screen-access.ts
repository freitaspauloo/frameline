import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import { readDemoEntitlements } from "@/lib/fulfillment";

const DATA_DIR = path.join(process.cwd(), ".data");
const QUOTA_PATH = path.join(DATA_DIR, "screen-quota.json");

export type ScreenQuotaKey = {
  subject: string; // user email or anon id
  slug: string;
  day: string; // YYYYMMDD UTC
};

type QuotaFile = {
  used: Array<{ subject: string; slug: string; day: string; at: string }>;
};

function utcDay(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

async function readQuotaFile(): Promise<QuotaFile> {
  try {
    const raw = await readFile(QUOTA_PATH, "utf8");
    const parsed = JSON.parse(raw) as QuotaFile;
    return { used: Array.isArray(parsed.used) ? parsed.used : [] };
  } catch {
    return { used: [] };
  }
}

async function writeQuotaFile(data: QuotaFile) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(QUOTA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/**
 * True when the subject already owns unlimited copies for this screen
 * (paid `screen` plan scoped to the slug, or any `all` personal/team grant
 * that we treat as not covering screens — screens require planKey === "screen").
 */
export async function ownsScreen(
  email: string | null | undefined,
  slug: string,
): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return false;

  const store = await readDemoEntitlements();
  return store.entitlements.some((ent) => {
    if (ent.status !== "active") return false;
    if (ent.userEmail.toLowerCase() !== normalized) return false;
    if (
      ent.planKey !== "screen" &&
      ent.planKey !== "screen_year" &&
      ent.planKey !== "screen_lifetime"
    )
      return false;
    if (ent.materialScope.kind === "all") return true;
    return ent.materialScope.materialSlugs.includes(slug);
  });
}

export async function hasUsedFreeCopyToday(input: {
  subject: string;
  slug: string;
}): Promise<boolean> {
  const day = utcDay();

  if (hasDatabaseUrl()) {
    try {
      const prisma = getPrisma();
      // Soft table via raw file fallback if model missing — use file always for quota
      // until a ScreenCopyQuota model exists. Prefer file store for portability.
      void prisma;
    } catch {
      /* fall through */
    }
  }

  const file = await readQuotaFile();
  return file.used.some(
    (row) =>
      row.subject === input.subject &&
      row.slug === input.slug &&
      row.day === day,
  );
}

export async function recordFreeCopyUsed(input: {
  subject: string;
  slug: string;
}): Promise<void> {
  const day = utcDay();
  const file = await readQuotaFile();
  const already = file.used.some(
    (row) =>
      row.subject === input.subject &&
      row.slug === input.slug &&
      row.day === day,
  );
  if (already) return;
  file.used.push({
    subject: input.subject,
    slug: input.slug,
    day,
    at: new Date().toISOString(),
  });
  // Keep file bounded
  if (file.used.length > 5000) {
    file.used = file.used.slice(-4000);
  }
  await writeQuotaFile(file);
}

export function screenQuotaSubject(input: {
  email?: string | null;
  anonymousId: string;
}): string {
  const email = input.email?.trim().toLowerCase();
  if (email && email.includes("@")) return `email:${email}`;
  return `anon:${input.anonymousId}`;
}

export { utcDay };
