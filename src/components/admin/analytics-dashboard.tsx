"use client";

import type { ComponentType } from "react";
import {
  RiArrowRightUpLine,
  RiCursorLine,
  RiEyeLine,
  RiFileCopyLine,
  RiLockLine,
  RiPulseLine,
  RiRobot2Line,
  RiUserAddLine,
} from "@remixicon/react";

import { AdminAssetThumb } from "@/components/admin-asset-thumb";
import { AdminLink } from "@/components/admin-nav";
import { AnalyticsAreaChart } from "@/components/admin/analytics-charts";
import { percent } from "@/components/admin-metrics";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AssetCatalogMeta } from "@/lib/asset-catalog";
import type { EventRecord } from "@/lib/events";
import type {
  FunnelSummary,
  SignupSummary,
  TrafficSummary,
  UsageBySlugRow,
} from "@/lib/metrics";

const AGENT_GROUP_LABEL: Record<string, string> = {
  agent: "AI agent",
  ide: "IDE",
  cli: "CLI",
  browser: "Browser",
  bot: "Crawler",
  unknown: "Unknown",
};

const AUTH_LABEL: Record<string, string> = {
  google: "Google",
  email: "Email",
  unknown: "Unknown",
};

const EVENT_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  page_view: "secondary",
  click: "secondary",
  material_view: "secondary",
  copy: "default",
  registry_fetch: "default",
  asset_fetch: "default",
  install_intent: "outline",
  signup: "outline",
  signin: "outline",
  copy_blocked: "destructive",
  checkout_started: "outline",
  order_paid: "default",
};

type RankRow = { label: string; value: number; sublabel?: string; href?: string };

type AgentRow = {
  kind: string;
  label: string;
  group: string;
  count: number;
};

export type AnalyticsDashboardProps = {
  traffic: TrafficSummary;
  signups: SignupSummary;
  funnel: FunnelSummary;
  usage: UsageBySlugRow[];
  agents: AgentRow[];
  recent: EventRecord[];
  assetMeta: Record<string, AssetCatalogMeta>;
};

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="border-relay-border bg-relay-canvas/40 shadow-none" size="sm">
      <CardHeader className="border-b border-relay-border/80">
        <CardDescription className="flex items-center gap-2 text-relay-secondary">
          <Icon className="text-relay-blue" />
          {label}
        </CardDescription>
        {hint ? (
          <CardAction>
            <Badge className="bg-relay-blue-tint text-relay-blue-deep" variant="secondary">
              {hint}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="font-mono text-3xl tabular-nums tracking-tight text-relay-ink">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function RankedList({
  rows,
  empty,
}: {
  rows: readonly RankRow[];
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <Empty className="border border-dashed border-relay-border py-8">
        <EmptyHeader>
          <EmptyTitle>No rows yet</EmptyTitle>
          <EmptyDescription>{empty}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => {
        const pct = Math.round((row.value / max) * 100);
        const inner = (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-relay-ink">{row.label}</p>
                {row.sublabel ? (
                  <p className="mt-0.5 truncate font-mono text-[11px] text-relay-secondary">
                    {row.sublabel}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 font-mono text-sm tabular-nums text-relay-secondary">
                {row.value}
              </span>
            </div>
            <Progress className="bg-relay-muted [&>[data-slot=progress-indicator]]:bg-relay-blue" value={pct} />
          </>
        );

        return (
          <li key={`${row.label}-${row.sublabel ?? ""}`}>
            {row.href ? (
              <AdminLink className="block rounded-none hover:opacity-80" href={row.href}>
                {inner}
              </AdminLink>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MostUsedAssets({
  usage,
  assetMeta,
}: {
  usage: UsageBySlugRow[];
  assetMeta: Record<string, AssetCatalogMeta>;
}) {
  const top = usage.slice(0, 6);
  if (top.length === 0) {
    return (
      <Empty className="border border-dashed border-relay-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RiFileCopyLine />
          </EmptyMedia>
          <EmptyTitle>No asset activity yet</EmptyTitle>
          <EmptyDescription>
            Views, copies, and installs will rank materials and screens here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const maxUses = Math.max(...top.map((row) => row.uses), 1);

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {top.map((row, index) => {
        const meta = assetMeta[row.slug];
        const title = meta?.title ?? row.slug;
        const pct = Math.round((row.uses / maxUses) * 100);

        return (
          <li key={row.slug}>
            <AdminLink
              className="group flex h-full gap-4 border border-relay-border bg-relay-canvas/30 p-3 transition-colors hover:border-relay-blue/40 hover:bg-relay-blue-tint/30"
              href={`/admin/assets/${row.slug}`}
            >
              {meta ? (
                <AdminAssetThumb href={meta.href} meta={meta} size="lg" />
              ) : (
                <div className="aspect-[16/10] w-28 shrink-0 border border-relay-border bg-relay-muted" />
              )}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 font-heading text-sm leading-snug text-relay-ink group-hover:text-relay-blue-deep">
                      {title}
                    </p>
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-relay-tertiary">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-relay-secondary">
                    {row.slug}
                    {meta ? (
                      <span className="ml-2 text-relay-tertiary">· {meta.kind}</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2 font-mono text-[11px]">
                    <span className="text-relay-secondary">
                      {row.uses} uses · {row.views} views
                    </span>
                    <span className="tabular-nums text-relay-ink">{pct}%</span>
                  </div>
                  <Progress
                    className="h-1 bg-relay-muted [&>[data-slot=progress-indicator]]:bg-relay-blue"
                    value={pct}
                  />
                </div>
              </div>
            </AdminLink>
          </li>
        );
      })}
    </ul>
  );
}

function formatTimestamp(iso: string | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AnalyticsDashboard({
  traffic,
  signups,
  funnel,
  usage,
  agents,
  recent,
  assetMeta,
}: AnalyticsDashboardProps) {
  const agentTotal = agents.reduce((sum, row) => sum + row.count, 0);
  const automated = agents
    .filter((row) => row.group === "agent" || row.group === "ide")
    .reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 border-b border-relay-border pb-6">
        <Badge className="w-fit bg-relay-blue-tint text-relay-blue-deep" variant="secondary">
          Analytics
        </Badge>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-instrument text-3xl tracking-tight text-relay-ink md:text-4xl">
              Usage & attribution
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-relay-secondary">
              Visits, signups, copies, and downstream fetches — matched back to
              the material or screen that started the journey.
            </p>
          </div>
          <Badge className="w-fit border-relay-border text-relay-secondary" variant="outline">
            Live · last 30 days
          </Badge>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          hint={`${traffic.uniqueVisitors} unique`}
          icon={RiEyeLine}
          label="Page views"
          value={traffic.pageViews}
        />
        <AdminLink className="block transition-opacity hover:opacity-80" href="/admin/signups">
          <MetricCard
            hint={`${signups.last30} in 30d`}
            icon={RiUserAddLine}
            label="Signups"
            value={signups.last30}
          />
        </AdminLink>
        <MetricCard
          hint={`${funnel.blocked} paywalled`}
          icon={RiFileCopyLine}
          label="Copies"
          value={funnel.copies}
        />
        <MetricCard
          hint={`${signups.total} all time`}
          icon={RiArrowRightUpLine}
          label="Conversion"
          value={percent(signups.paidConversion)}
        />
      </div>

      <Card className="border-relay-border bg-relay-canvas/20 shadow-none">
        <CardHeader className="border-b border-relay-border/80">
          <CardTitle className="font-heading text-relay-ink">Most used assets</CardTitle>
          <CardDescription>
            Ranked by copies and installs in the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MostUsedAssets assetMeta={assetMeta} usage={usage} />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border-relay-border bg-relay-canvas/20 shadow-none xl:col-span-2">
          <CardHeader className="border-b border-relay-border/80">
            <CardTitle className="font-heading text-relay-ink">Site traffic</CardTitle>
            <CardDescription>
              Unique visitors and page views over the last 30 days.
            </CardDescription>
            <CardAction>
              <Badge className="bg-relay-blue-tint text-relay-blue-deep" variant="secondary">
                {traffic.clicks} clicks
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <AnalyticsAreaChart points={traffic.viewsSeries} />
            <Separator className="bg-relay-border" />
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <p className="text-[0.625rem] font-semibold tracking-widest text-relay-secondary uppercase">
                  Top pages
                </p>
                <RankedList
                  empty="Page views will appear here once people browse the site."
                  rows={traffic.topPages.map((row) => ({
                    label: row.path,
                    value: row.count,
                  }))}
                />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-[0.625rem] font-semibold tracking-widest text-relay-secondary uppercase">
                  Top clicks
                </p>
                <RankedList
                  empty="Link and button clicks will show up here."
                  rows={traffic.topClicks.map((row) => ({
                    label: row.label,
                    value: row.count,
                    sublabel: row.href,
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-relay-border bg-relay-canvas/20 shadow-none">
          <CardHeader className="border-b border-relay-border/80">
            <CardTitle className="font-heading text-relay-ink">Signups</CardTitle>
            <CardDescription>New accounts per day.</CardDescription>
            <CardAction>
              <AdminLink
                className="text-[0.625rem] font-semibold tracking-widest text-relay-blue uppercase underline-offset-4 hover:underline"
                href="/admin/signups"
              >
                All accounts
              </AdminLink>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <AnalyticsAreaChart
              emptyLabel="Signups will chart here once accounts are created."
              points={signups.series}
            />
            {signups.byAuthMethod.length > 0 ? (
              <>
                <Separator className="bg-relay-border" />
                <div className="flex flex-col gap-4">
                  <p className="text-[0.625rem] font-semibold tracking-widest text-relay-secondary uppercase">
                    By auth method
                  </p>
                  <RankedList
                    empty=""
                    rows={signups.byAuthMethod.map((row) => ({
                      label: AUTH_LABEL[row.method] ?? row.method,
                      value: row.count,
                    }))}
                  />
                </div>
              </>
            ) : (
              <Empty className="border border-dashed border-relay-border py-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <RiUserAddLine />
                  </EmptyMedia>
                  <EmptyTitle>No signups yet</EmptyTitle>
                  <EmptyDescription>
                    Google and email signups will split here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-relay-border bg-relay-canvas/20 shadow-none">
          <CardHeader className="border-b border-relay-border/80">
            <CardTitle className="font-heading text-relay-ink">Copy → use funnel</CardTitle>
            <CardDescription>
              A copy counts as used when its manifest or hosted media is fetched
              later — proof the payload was pasted somewhere.
            </CardDescription>
            <CardAction>
              <Badge className="bg-relay-blue text-white">{percent(funnel.useRate)} used</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Copies", value: funnel.copies, icon: RiFileCopyLine },
                { label: "Paywalled", value: funnel.blocked, icon: RiLockLine },
                { label: "Used", value: funnel.copiesUsed, icon: RiPulseLine },
                {
                  label: "Registry",
                  value: funnel.registryFetches,
                  icon: RiRobot2Line,
                },
                { label: "Assets", value: funnel.assetFetches, icon: RiEyeLine },
                {
                  label: "Median",
                  value:
                    funnel.medianSecondsToUse === null
                      ? "—"
                      : `${funnel.medianSecondsToUse}s`,
                  icon: RiCursorLine,
                },
              ].map((stat) => (
                <div
                  className="flex flex-col gap-2 border border-relay-border/80 bg-relay-panel/50 p-4"
                  key={stat.label}
                >
                  <div className="flex items-center gap-2 text-relay-secondary">
                    <stat.icon className="text-relay-blue" />
                    <span className="text-[0.625rem] font-semibold tracking-widest uppercase">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-mono text-2xl tabular-nums text-relay-ink">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-relay-border bg-relay-canvas/20 shadow-none">
          <CardHeader className="border-b border-relay-border/80">
            <CardTitle className="font-heading text-relay-ink">Fetches by agent / IDE</CardTitle>
            <CardDescription>
              Classified from User-Agent when code is resolved.
            </CardDescription>
            <CardAction>
              <Badge className="bg-relay-blue-tint text-relay-blue-deep" variant="secondary">
                {agentTotal
                  ? `${percent(automated / agentTotal)} agents & IDEs`
                  : "waiting"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <RankedList
              empty="Registry and asset fetches will rank agents and IDEs here."
              rows={agents.map((row) => ({
                label: row.label,
                value: row.count,
                sublabel: AGENT_GROUP_LABEL[row.group] ?? row.group,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-relay-border bg-relay-canvas/20 shadow-none">
        <CardHeader className="border-b border-relay-border/80">
          <CardTitle className="font-heading text-relay-ink">All assets</CardTitle>
          <CardDescription>
            Full breakdown of views, copies, paywall hits, and downstream usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {usage.length === 0 ? (
            <Empty className="mx-(--card-spacing) mb-(--card-spacing) border border-dashed border-relay-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <RiFileCopyLine />
                </EmptyMedia>
                <EmptyTitle>No asset activity</EmptyTitle>
                <EmptyDescription>
                  Open a material, copy code, or resolve a manifest to populate
                  this table.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16" />
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Uses</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Copies</TableHead>
                  <TableHead className="text-right">Blocked</TableHead>
                  <TableHead className="text-right">Registry</TableHead>
                  <TableHead className="text-right">Assets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usage.map((row) => {
                  const meta = assetMeta[row.slug];
                  return (
                    <TableRow key={row.slug}>
                      <TableCell className="py-3">
                        {meta ? (
                          <AdminAssetThumb
                            href={`/admin/assets/${row.slug}`}
                            meta={meta}
                            size="sm"
                          />
                        ) : (
                          <div className="aspect-[16/10] w-14 border border-relay-border bg-relay-muted" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <AdminLink
                            className="truncate font-medium text-relay-ink underline-offset-4 hover:text-relay-blue hover:underline"
                            href={`/admin/assets/${row.slug}`}
                          >
                            {meta?.title ?? row.slug}
                          </AdminLink>
                          <span className="truncate font-mono text-[11px] text-relay-secondary">
                            {row.slug}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-relay-ink">
                        {row.uses}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.views}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.copies}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.blocked}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.registryFetches}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.assetFetches}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-relay-border bg-relay-canvas/20 shadow-none">
        <CardHeader className="border-b border-relay-border/80">
          <CardTitle className="font-heading text-relay-ink">Recent activity</CardTitle>
          <CardDescription>Newest events across the stream.</CardDescription>
          <CardAction>
            <Badge className="border-relay-border text-relay-secondary" variant="outline">
              {recent.length} shown
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {recent.length === 0 ? (
            <Empty className="mx-(--card-spacing) mb-(--card-spacing) border border-dashed border-relay-border">
              <EmptyHeader>
                <EmptyTitle>No events yet</EmptyTitle>
                <EmptyDescription>
                  Traffic, copies, and signups will stream here in real time.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y divide-relay-border">
              {recent.map((event) => (
                <li
                  className="flex flex-col gap-3 px-(--card-spacing) py-4 sm:flex-row sm:items-center sm:justify-between"
                  key={event.id}
                >
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={EVENT_VARIANT[event.name] ?? "secondary"}>
                        {event.name.replaceAll("_", " ")}
                      </Badge>
                      {event.slug ? (
                        <Badge className="border-relay-border" variant="outline">
                          {event.slug}
                        </Badge>
                      ) : null}
                      {event.agentKind && event.agentKind !== "unknown" ? (
                        <Badge variant="ghost">via {event.agentKind}</Badge>
                      ) : null}
                    </div>
                    {event.copyId ? (
                      <p className="font-mono text-[11px] text-relay-secondary">
                        copy {event.copyId.slice(0, 16)}…
                      </p>
                    ) : null}
                  </div>
                  <time
                    className="shrink-0 font-mono text-[11px] tabular-nums text-relay-secondary"
                    dateTime={event.createdAt}
                  >
                    {formatTimestamp(event.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
