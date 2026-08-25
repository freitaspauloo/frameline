"use client";

import type { ComponentType } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SeriesPoint } from "@/lib/metrics";

const chartConfig = {
  value: {
    label: "Events",
    color: "var(--relay-blue)",
  },
} satisfies ChartConfig;

function formatTick(date: string): string {
  const parts = date.split("-");
  if (parts.length >= 3) return `${parts[1]}/${parts[2]}`;
  return date;
}

export function AnalyticsAreaChart({
  points,
  emptyLabel = "No data in this period.",
}: {
  points: readonly SeriesPoint[];
  emptyLabel?: string;
}) {
  if (points.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  const data = points.map((point) => ({
    ...point,
    label: formatTick(point.date),
  }));

  const total = points.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={chartConfig} className="aspect-[5/2] h-44 w-full">
        <AreaChart data={data} margin={{ left: 4, right: 4, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis
            axisLine={false}
            dataKey="label"
            minTickGap={28}
            tickLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as { date?: string } | undefined;
                  return row?.date ?? "";
                }}
              />
            }
          />
          <Area
            dataKey="value"
            fill="var(--color-value)"
            fillOpacity={0.12}
            stroke="var(--color-value)"
            strokeWidth={1.5}
            type="monotone"
          />
        </AreaChart>
      </ChartContainer>
      <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>{points[0]?.date}</span>
        <span className="tabular-nums text-foreground">{total} total</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}
