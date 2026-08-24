import Link from "next/link";

import { AdminLink } from "@/components/admin-nav";
import { notFound } from "next/navigation";

import {
  BarList,
  formatTimestamp,
  Panel,
  percent,
  StatGrid,
} from "@/components/admin-metrics";
import { agentLabel } from "@/lib/agent-detect";
import { readEvents } from "@/lib/events";
import { getMaterial } from "@/materials/catalog";
import { getScreenBySlug } from "@/screens/catalog";

export const dynamic = "force-dynamic";

export default async function AdminAssetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = getMaterial(slug);
  const screen = getScreenBySlug(slug);
  const events = await readEvents({ slug, limit: 500 });

  // Unknown slugs with no history are a typo, not an empty asset.
  if (!material && !screen && events.length === 0) notFound();

  const title = material?.title ?? screen?.title ?? slug;
  const kind = material ? "Material" : screen ? "Screen" : "Unknown";

  const copies = events.filter((e) => e.name === "copy");
  const blocked = events.filter((e) => e.name === "copy_blocked");
  const registryFetches = events.filter((e) => e.name === "registry_fetch");
  const assetFetches = events.filter((e) => e.name === "asset_fetch");
  const installs = events.filter((e) => e.name === "install_intent");

  const usedCopyIds = new Set(
    [...registryFetches, ...assetFetches]
      .map((e) => e.copyId)
      .filter((id): id is string => Boolean(id)),
  );
  const copiesUsed = copies.filter(
    (copy) => copy.copyId && usedCopyIds.has(copy.copyId),
  ).length;

  const agentCounts = new Map<string, number>();
  for (const event of [...registryFetches, ...assetFetches]) {
    const kindKey = event.agentKind ?? "unknown";
    agentCounts.set(kindKey, (agentCounts.get(kindKey) ?? 0) + 1);
  }

  const detailHref = material
    ? `/materials/${slug}`
    : screen
      ? `/materials/${screen.slug}`
      : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {kind}
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-mono">{slug}</span>
          {detailHref ? (
            <>
              {" · "}
              <Link
                className="text-foreground underline underline-offset-4"
                href={detailHref}
              >
                View public page
              </Link>
            </>
          ) : null}
          {" · "}
          <AdminLink
            className="text-foreground underline underline-offset-4"
            href="/admin/analytics"
          >
            All analytics
          </AdminLink>
        </p>
      </div>

      <StatGrid
        stats={[
          { label: "Copies", value: copies.length },
          { label: "Paywalled", value: blocked.length },
          { label: "Registry", value: registryFetches.length },
          { label: "Assets", value: assetFetches.length },
          { label: "Installs", value: installs.length },
          {
            label: "Used",
            value: copiesUsed,
            hint: copies.length
              ? percent(copiesUsed / copies.length)
              : undefined,
          },
        ]}
      />

      <Panel
        description="Tools that resolved this asset's manifest or media."
        title="Fetched by"
      >
        <BarList
          empty="No downstream fetches for this asset yet."
          rows={[...agentCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([kindKey, count]) => ({
              label: agentLabel(kindKey),
              value: count,
            }))}
        />
      </Panel>

      <Panel description="Newest 30 events for this asset." title="Timeline">
        {events.length === 0 ? (
          <p className="font-mono text-[11px] text-muted-foreground">
            No events yet.
          </p>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {events.slice(0, 30).map((event) => (
              <li
                className="flex flex-col gap-1 px-3 py-2.5 font-mono text-[11px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                key={event.id}
              >
                <span className="text-foreground">
                  {event.name}
                  {event.agentKind && event.agentKind !== "unknown" ? (
                    <>
                      {" · "}
                      <span className="text-muted-foreground">via</span>{" "}
                      {agentLabel(event.agentKind)}
                    </>
                  ) : null}
                  {event.copyId ? (
                    <>
                      {" · "}
                      <span className="text-muted-foreground">copy</span>{" "}
                      {event.copyId.slice(0, 12)}
                    </>
                  ) : null}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {formatTimestamp(event.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
