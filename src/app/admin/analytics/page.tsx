import { AdminLink } from "@/components/admin-nav";

import {
  BarList,
  formatTimestamp,
  Panel,
  percent,
  Sparkline,
  StatGrid,
} from "@/components/admin-metrics";
import { readEvents } from "@/lib/events";
import {
  fetchesByAgent,
  funnelSummary,
  signupSummary,
  trafficSummary,
  usageBySlug,
} from "@/lib/metrics";

export const dynamic = "force-dynamic";

const AGENT_GROUP_LABEL: Record<string, string> = {
  agent: "AI agent",
  ide: "IDE",
  cli: "CLI",
  browser: "Browser",
  bot: "Crawler",
  unknown: "Unknown",
};

export default async function AdminAnalyticsPage() {
  const [signups, funnel, usage, agents, recent, traffic] = await Promise.all([
    signupSummary(),
    funnelSummary(),
    usageBySlug(),
    fetchesByAgent(),
    readEvents({ limit: 25 }),
    trafficSummary(),
  ]);

  const agentTotal = agents.reduce((sum, row) => sum + row.count, 0);
  const automated = agents
    .filter((row) => row.group === "agent" || row.group === "ide")
    .reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Analytics
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">
          Usage and attribution
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Copied code carries a manifest URL and hosted media. When an agent,
          IDE, or CLI resolves either one, that fetch is recorded here and
          matched back to the copy that produced it.
        </p>
      </div>

      <StatGrid
        stats={[
          { label: "Page views", value: traffic.pageViews, hint: `${traffic.uniqueVisitors} unique` },
          { label: "Clicks", value: traffic.clicks },
          { label: "Signups", value: signups.total, hint: `${signups.last30} in 30d` },
          {
            label: "Signup → paid",
            value: percent(signups.paidConversion),
          },
          { label: "Copies", value: funnel.copies },
          { label: "Paywalled", value: funnel.blocked },
          {
            label: "Registry fetches",
            value: funnel.registryFetches,
          },
          { label: "Asset fetches", value: funnel.assetFetches },
        ]}
      />

      <Panel
        description="Unique visitors and page views over the last 30 days."
        title="Site traffic"
      >
        <Sparkline points={traffic.viewsSeries} />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Top pages
            </p>
            <div className="mt-3">
              <BarList
                empty="No page views yet."
                rows={traffic.topPages.map((row) => ({
                  label: row.path,
                  value: row.count,
                }))}
              />
            </div>
          </div>
          <div>
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Top clicks
            </p>
            <div className="mt-3">
              <BarList
                empty="No clicks yet."
                rows={traffic.topClicks.map((row) => ({
                  label: row.label,
                  value: row.count,
                  sublabel: row.href,
                }))}
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        description="New user records per day over the last 30 days."
        title="Signups"
      >
        <Sparkline points={signups.series} />
        {signups.byAuthMethod.length > 0 ? (
          <div className="mt-6">
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              By auth method
            </p>
            <div className="mt-3">
              <BarList
                rows={signups.byAuthMethod.map((row) => ({
                  label: row.method,
                  value: row.count,
                }))}
              />
            </div>
          </div>
        ) : null}
      </Panel>

      <Panel
        description="Which tool resolved Frameline code. Classified from the User-Agent; the raw string is stored so new tools can be reclassified later."
        meta={
          <p className="font-mono text-sm tabular-nums text-foreground">
            {agentTotal
              ? `${percent(automated / agentTotal)} agents & IDEs`
              : "no fetches yet"}
          </p>
        }
        title="Fetches by agent / IDE"
      >
        <BarList
          empty="No registry or asset fetches yet."
          rows={agents.map((row) => ({
            label: row.label,
            value: row.count,
            sublabel: AGENT_GROUP_LABEL[row.group] ?? row.group,
          }))}
        />
      </Panel>

      <Panel
        description="Per material and screen: clipboard copies, paywall hits, and the downstream fetches that prove the code was actually used."
        title="Assets"
      >
        {usage.length === 0 ? (
          <p className="font-mono text-[11px] text-muted-foreground">
            No asset activity yet.
          </p>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[36rem] border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-3 py-2 font-normal">Slug</th>
                  <th className="px-3 py-2 text-right font-normal">Views</th>
                  <th className="px-3 py-2 text-right font-normal">Copies</th>
                  <th className="px-3 py-2 text-right font-normal">Blocked</th>
                  <th className="px-3 py-2 text-right font-normal">Registry</th>
                  <th className="px-3 py-2 text-right font-normal">Assets</th>
                  <th className="px-3 py-2 text-right font-normal">Installs</th>
                </tr>
              </thead>
              <tbody>
                {usage.map((row) => (
                  <tr className="border-b border-border last:border-b-0" key={row.slug}>
                    <td className="px-3 py-2">
                      <AdminLink
                        className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                        href={`/admin/assets/${row.slug}`}
                      >
                        {row.slug}
                      </AdminLink>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.views}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.copies}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.blocked}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {row.registryFetches}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {row.assetFetches}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.installs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel
        description="Newest 25 events across the whole stream."
        title="Recent activity"
      >
        {recent.length === 0 ? (
          <p className="font-mono text-[11px] text-muted-foreground">
            No events yet.
          </p>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {recent.map((event) => (
              <li
                className="flex flex-col gap-1 px-3 py-2.5 font-mono text-[11px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                key={event.id}
              >
                <span className="text-foreground">
                  {event.name}
                  {event.slug ? (
                    <>
                      {" · "}
                      <span className="text-muted-foreground">sku</span>{" "}
                      {event.slug}
                    </>
                  ) : null}
                  {event.agentKind && event.agentKind !== "unknown" ? (
                    <>
                      {" · "}
                      <span className="text-muted-foreground">via</span>{" "}
                      {event.agentKind}
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
