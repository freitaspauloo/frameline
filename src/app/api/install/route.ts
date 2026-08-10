import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getMaterial } from "@/materials/catalog";

/**
 * Fake npx / copy-install logger — Discovery Gate G4.
 * Appends to .data/installs.json on this instance.
 */

type InstallIntentEntry = {
  slug: string;
  source?: string;
  path?: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const INSTALLS_PATH = path.join(DATA_DIR, "installs.json");

const INSTALL_PATHS = new Set(["cli", "jsx", "paste"]);

async function readInstalls(): Promise<InstallIntentEntry[]> {
  try {
    const raw = await readFile(INSTALLS_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as InstallIntentEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeInstalls(entries: InstallIntentEntry[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(INSTALLS_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

export async function GET() {
  const entries = await readInstalls();
  const bySlug: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  for (const entry of entries) {
    bySlug[entry.slug] = (bySlug[entry.slug] ?? 0) + 1;
    const source = entry.source ?? "unknown";
    bySource[source] = (bySource[source] ?? 0) + 1;
  }
  return NextResponse.json({
    count: entries.length,
    bySlug,
    bySource,
  });
}

export async function POST(request: Request) {
  const limited = rateLimit(`install:${clientIp(request)}`, {
    limit: 40,
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

  const slugRaw = "slug" in body ? body.slug : undefined;
  const sourceRaw = "source" in body ? body.source : undefined;
  const pathRaw = "path" in body ? body.path : undefined;

  if (typeof slugRaw !== "string" || !slugRaw.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing slug" },
      { status: 400 },
    );
  }

  const slug = slugRaw.trim().slice(0, 64);
  if (!getMaterial(slug)) {
    return NextResponse.json(
      { ok: false, error: "Unknown material slug" },
      { status: 400 },
    );
  }

  const source =
    typeof sourceRaw === "string" && sourceRaw.trim()
      ? sourceRaw.trim().slice(0, 64)
      : undefined;

  let installPath: string | undefined;
  if (typeof pathRaw === "string" && pathRaw.trim()) {
    const normalized = pathRaw.trim().toLowerCase();
    if (!INSTALL_PATHS.has(normalized)) {
      return NextResponse.json(
        { ok: false, error: "Invalid path. Expected cli, jsx, or paste." },
        { status: 400 },
      );
    }
    installPath = normalized;
  }

  const entries = await readInstalls();
  entries.push({
    slug,
    source,
    path: installPath,
    createdAt: new Date().toISOString(),
  });
  await writeInstalls(entries);

  return NextResponse.json({ ok: true });
}
