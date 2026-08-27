import { NextResponse } from "next/server";

import { isAdminEmail, resolveDemoUser } from "@/lib/auth";
import {
  removeCatalogOverrides,
  writeCatalogOverridesBulk,
} from "@/lib/demo-catalog";

const ACTIONS = ["draft", "published", "delete", "reset"] as const;
type BulkAction = (typeof ACTIONS)[number];

function isAction(value: unknown): value is BulkAction {
  return typeof value === "string" && ACTIONS.includes(value as BulkAction);
}

async function requireAdmin() {
  const user = await resolveDemoUser();
  if (!user || user.role !== "admin" || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const actionRaw = "action" in body ? body.action : undefined;
  const slugsRaw = "slugs" in body ? body.slugs : undefined;

  if (!isAction(actionRaw)) {
    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  }

  if (!Array.isArray(slugsRaw) || slugsRaw.some((slug) => typeof slug !== "string")) {
    return NextResponse.json({ ok: false, error: "Invalid slugs" }, { status: 400 });
  }

  const slugs = [...new Set(slugsRaw.map((slug) => slug.trim()).filter(Boolean))];
  if (slugs.length === 0) {
    return NextResponse.json({ ok: false, error: "No slugs provided" }, { status: 400 });
  }

  try {
    if (actionRaw === "reset") {
      const count = await removeCatalogOverrides(slugs);
      return NextResponse.json({ ok: true, count, action: actionRaw });
    }

    const status = actionRaw === "delete" ? "draft" : actionRaw;
    const count = await writeCatalogOverridesBulk(slugs, { status });
    if (count === 0) {
      return NextResponse.json(
        { ok: false, error: "No matching catalog slugs" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, count, action: actionRaw });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
