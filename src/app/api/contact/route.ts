import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { sendContactNotification } from "@/lib/email";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

type ContactEntry = {
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const CONTACT_PATH = path.join(DATA_DIR, "contact.json");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readContact(): Promise<ContactEntry[]> {
  try {
    const raw = await readFile(CONTACT_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ContactEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeContact(entries: ContactEntry[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CONTACT_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export async function GET() {
  const entries = await readContact();
  return NextResponse.json({ count: entries.length });
}

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${clientIp(request)}`);
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

  const nameRaw = "name" in body ? body.name : undefined;
  const emailRaw = "email" in body ? body.email : undefined;
  const messageRaw = "message" in body ? body.message : undefined;

  if (typeof nameRaw !== "string" || !nameRaw.trim()) {
    return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });
  }
  if (typeof emailRaw !== "string") {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }
  if (typeof messageRaw !== "string" || !messageRaw.trim()) {
    return NextResponse.json(
      { ok: false, error: "Message required" },
      { status: 400 },
    );
  }

  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const name = nameRaw.trim().slice(0, 120);
  const message = messageRaw.trim().slice(0, 4000);

  const entries = await readContact();
  entries.push({
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  });
  await writeContact(entries);

  const mailed = await sendContactNotification({ name, email, message });

  return NextResponse.json({
    ok: true,
    message: mailed.ok && !("skipped" in mailed && mailed.skipped)
      ? "Message saved and emailed to the team."
      : "Saved to the demo inbox (.data/contact.json).",
    emailed: mailed.ok && !("skipped" in mailed && mailed.skipped),
  });
}
