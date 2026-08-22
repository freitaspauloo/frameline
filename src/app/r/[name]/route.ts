import { NextResponse } from "next/server";

import { describeClient } from "@/lib/agent-detect";
import { recordEvent } from "@/lib/events";
import {
  clientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import {
  bearerToken,
  resolveRegistryItem,
} from "@/lib/registry";

/**
 * Public registry endpoint — `GET /r/{name}.json`.
 *
 * This is the URL the install docs have always advertised and the one embedded
 * in copied payloads. It is also the usage signal: a request here means the
 * copied code was pasted somewhere and something tried to resolve it. That
 * works for any agent, IDE, or CLI, because they all speak plain HTTP.
 *
 * `?c=<copyId>` ties the fetch back to the clipboard copy that produced it.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const limited = rateLimit(`registry:${clientIp(request)}`, {
    limit: 120,
    windowMs: 60_000,
  });
  if (!limited.ok) return rateLimitResponse(limited);

  const { name } = await params;
  const url = new URL(request.url);
  const copyId = url.searchParams.get("c")?.trim() || null;
  const token = bearerToken(request);

  const outcome = await resolveRegistryItem({ slug: name, token, copyId });
  const slug = name.replace(/\.json$/i, "");

  // A generic Node runtime asking for a registry manifest is the shadcn CLI.
  const client = describeClient(request, "shadcn-cli");

  await recordEvent({
    name: "registry_fetch",
    slug,
    copyId,
    source: "registry",
    request,
    agentKind: client.kind,
    props: {
      status: outcome.status,
      entitled: Boolean(token),
      agentClass: client.class,
      kind: outcome.ok ? outcome.kind : null,
    },
  });

  return NextResponse.json(outcome.body, {
    status: outcome.status,
    headers: {
      // Must not be cached by a CDN: every resolve is a usage signal.
      "Cache-Control": "no-store",
    },
  });
}
