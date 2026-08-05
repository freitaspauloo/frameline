import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

type WaitlistEntry = {
  email: string;
  source?: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const WAITLIST_PATH = path.join(DATA_DIR, "waitlist.json");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await readFile(WAITLIST_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(WAITLIST_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export async function GET() {
  const entries = await readWaitlist();
  return NextResponse.json({ count: entries.length });
}

export async function POST(request: Request) {
  const limited = rateLimit(`waitlist:${clientIp(request)}`);
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

  const emailRaw = "email" in body ? body.email : undefined;
  const sourceRaw = "source" in body ? body.source : undefined;

  if (typeof emailRaw !== "string") {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }

  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const source =
    typeof sourceRaw === "string" && sourceRaw.trim()
      ? sourceRaw.trim().slice(0, 64)
      : undefined;

  if (hasDatabaseUrl()) {
    const prisma = getPrisma();
    await prisma.emailCapture.upsert({
      where: {
        email_source: { email, source: "waitlist" },
      },
      create: {
        email,
        source: "waitlist",
        consent: true,
      },
      update: {},
    });
    return NextResponse.json({ ok: true, mode: "db" as const });
  }

  const entries = await readWaitlist();
  if (!entries.some((e) => e.email === email)) {
    entries.push({
      email,
      source,
      createdAt: new Date().toISOString(),
    });
    await writeWaitlist(entries);
  }

  return NextResponse.json({ ok: true, mode: "demo" as const });
}
