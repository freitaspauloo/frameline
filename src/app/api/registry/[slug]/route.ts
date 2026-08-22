import { NextResponse } from "next/server";

import { describeClient } from "@/lib/agent-detect";
import { recordEvent } from "@/lib/events";
import { bearerToken, resolveRegistryItem } from "@/lib/registry";

/**
 * Registry read (WP6 / WP9) — kept for compatibility.
 * `/r/{name}.json` is the advertised URL; both share src/lib/registry.ts.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const copyId = url.searchParams.get("c")?.trim() || null;
  const token = bearerToken(request);

  const outcome = await resolveRegistryItem({ slug, token, copyId });
  const client = describeClient(request, "shadcn-cli");

  await recordEvent({
    name: "registry_fetch",
    slug: slug.replace(/\.json$/i, ""),
    copyId,
    source: "registry-legacy",
    request,
    agentKind: client.kind,
    props: {
      status: outcome.status,
      entitled: Boolean(token),
      agentClass: client.class,
      kind: outcome.ok ? outcome.kind : null,
    },
  });

  return NextResponse.json(outcome.body, { status: outcome.status });
}
