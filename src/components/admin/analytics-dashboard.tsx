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
import type { EventRecord } from "@/lib/events";
import type {
  FunnelSummary,
  SignupSummary,
  TrafficSummary,
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

type UsageRow = {
  slug: string;
  views: number;
  copies: number;
  blocked: number;
  registryFetches: number;
  assetFetches: number;
  installs: number;
};

export type AnalyticsDashboardProps = {
  traffic: TrafficSummary;
  signups: SignupSummary;
  funnel: FunnelSummary;
  usage: UsageRow[];
  agents: AgentRow[];
  recent: EventRecord[];
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
    <Card size="sm">
      <CardHeader className="border-b border-border/60">
        <CardDescription className="flex items-center gap-2">
          <Icon />
          {label}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">{hint ?? "30d"}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-3xl tabular-nums tracking-tight">{value}</p>
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
      <Empty className="border border-dashed py-8">
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
                <p className="truncate text-sm font-medium">{row.label}</p>
                {row.sublabel ? (
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                    {row.sublabel}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
                {row.value}
              </span>
            </div>
            <Progress value={pct} />
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
}: AnalyticsDashboardProps) {
  const agentTotal = agents.reduce((sum, row) => sum + row.count, 0);
  const automated = agents
    .filter((row) => row.group === "agent" || row.group === "ide")
    .reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Badge variant="secondary">Analytics</Badge>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-instrument text-3xl tracking-tight text-foreground md:text-4xl">
              Usage & attribution
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Visits, signups, copies, and downstream fetches — matched back to
              the material or screen that started the journey.
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
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
        <MetricCard
          hint={`${signups.last30} in 30d`}
          icon={RiUserAddLine}
          label="Signups"
          value={signups.total}
        />
        <MetricCard
          hint={`${funnel.blocked} paywalled`}
          icon={RiFileCopyLine}
          label="Copies"
          value={funnel.copies}
        />
        <MetricCard
          hint="signup → paid"
          icon={RiArrowRightUpLine}
          label="Conversion"
          value={percent(signups.paidConversion)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Site traffic</CardTitle>
            <CardDescription>
              Unique visitors and page views over the last 30 days.
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{traffic.clicks} clicks</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <AnalyticsAreaChart points={traffic.viewsSeries} />
            <Separator />
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
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
                <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
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

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Signups</CardTitle>
            <CardDescription>New accounts per day.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <AnalyticsAreaChart
              emptyLabel="Signups will chart here once accounts are created."
              points={signups.series}
            />
            {signups.byAuthMethod.length > 0 ? (
              <>
                <Separator />
                <div className="flex flex-col gap-4">
                  <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
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
              <Empty className="border border-dashed py-6">
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
        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Copy → use funnel</CardTitle>
            <CardDescription>
              A copy counts as used when its manifest or hosted media is fetched
              later — proof the payload was pasted somewhere.
            </CardDescription>
            <CardAction>
              <Badge>{percent(funnel.useRate)} used</Badge>
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
                  className="flex flex-col gap-2 border border-border/60 bg-muted/20 p-4"
                  key={stat.label}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <stat.icon />
                    <span className="text-[0.625rem] font-semibold tracking-widest uppercase">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-mono text-2xl tabular-nums">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Fetches by agent / IDE</CardTitle>
            <CardDescription>
              Classified from User-Agent when code is resolved.
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">
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

      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Assets</CardTitle>
          <CardDescription>
            Views, copies, paywall hits, and downstream usage per material or
            screen.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {usage.length === 0 ? (
            <Empty className="mx-(--card-spacing) mb-(--card-spacing) border border-dashed">
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
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Copies</TableHead>
                  <TableHead className="text-right">Blocked</TableHead>
                  <TableHead className="text-right">Registry</TableHead>
                  <TableHead className="text-right">Assets</TableHead>
                  <TableHead className="text-right">Installs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usage.map((row) => (
                  <TableRow key={row.slug}>
                    <TableCell className="font-medium">
                      <AdminLink
                        className="text-foreground underline-offset-4 hover:underline"
                        href={`/admin/assets/${row.slug}`}
                      >
                        {row.slug}
                      </AdminLink>
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
                    <TableCell className="text-right font-mono tabular-nums">
                      {row.installs}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Newest events across the stream.</CardDescription>
          <CardAction>
            <Badge variant="outline">{recent.length} shown</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {recent.length === 0 ? (
            <Empty className="mx-(--card-spacing) mb-(--card-spacing) border border-dashed">
              <EmptyHeader>
                <EmptyTitle>No events yet</EmptyTitle>
                <EmptyDescription>
                  Traffic, copies, and signups will stream here in real time.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y divide-border">
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
                        <Badge variant="outline">{event.slug}</Badge>
                      ) : null}
                      {event.agentKind && event.agentKind !== "unknown" ? (
                        <Badge variant="ghost">via {event.agentKind}</Badge>
                      ) : null}
                    </div>
                    {event.copyId ? (
                      <p className="font-mono text-[11px] text-muted-foreground">
                        copy {event.copyId.slice(0, 16)}…
                      </p>
                    ) : null}
                  </div>
                  <time
                    className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground"
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
