import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { isCheckoutPlan } from "@/lib/license-plans";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

/**
 * Fake-door WTP beacon — records plan interest without blocking checkout UX.
 * Appends to .data/wtp.json on this instance.
 */

type WtpIntentEntry = {
  plan: string;
  material?: string;
  email?: string;
  source?: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const WTP_PATH = path.join(DATA_DIR, "wtp.json");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readIntents(): Promise<WtpIntentEntry[]> {
  try {
    const raw = await readFile(WTP_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as WtpIntentEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeIntents(entries: WtpIntentEntry[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(WTP_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export async function GET() {
  const entries = await readIntents();
  const byPlan: Record<string, number> = {};
  for (const entry of entries) {
    byPlan[entry.plan] = (byPlan[entry.plan] ?? 0) + 1;
  }
  return NextResponse.json({ count: entries.length, byPlan });
}

export async function POST(request: Request) {
  const limited = rateLimit(`intent:${clientIp(request)}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (!limited.ok) return rateLimitResponse(limited);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const planRaw = "plan" in body ? body.plan : undefined;
  const materialRaw = "material" in body ? body.material : undefined;
  const emailRaw = "email" in body ? body.email : undefined;
  const sourceRaw = "source" in body ? body.source : undefined;

  if (typeof planRaw !== "string" || !isCheckoutPlan(planRaw.trim().toLowerCase())) {
    return NextResponse.json(
      { ok: false, error: "Invalid plan. Expected static, personal, or team." },
      { status: 400 },
    );
  }

  const plan = planRaw.trim().toLowerCase();

  const material =
    typeof materialRaw === "string" && materialRaw.trim()
      ? materialRaw.trim().slice(0, 64)
      : undefined;

  let email: string | undefined;
  if (typeof emailRaw === "string" && emailRaw.trim()) {
    const normalized = emailRaw.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    email = normalized;
  }

  const source =
    typeof sourceRaw === "string" && sourceRaw.trim()
      ? sourceRaw.trim().slice(0, 64)
      : undefined;

  const entries = await readIntents();
  entries.push({
    plan,
    material,
    email,
    source,
    createdAt: new Date().toISOString(),
  });
  await writeIntents(entries);

  return NextResponse.json({ ok: true });
}
