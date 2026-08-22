import { AdminLink } from "@/components/admin-nav";
import type { SeriesPoint } from "@/lib/metrics";

/**
 * Presentational pieces shared by the admin dashboard, analytics, and
 * per-asset pages. Server components — no client JS.
 */

export function Panel({
  title,
  meta,
  description,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {meta ? (
          <div className="flex flex-wrap items-center gap-3">{meta}</div>
        ) : null}
      </div>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export type Stat = {
  label: string;
  value: string | number;
  hint?: string;
  href?: string | null;
};

export function StatGrid({
  stats,
  columns = 6,
}: {
  stats: readonly Stat[];
  columns?: 3 | 4 | 6;
}) {
  const columnClass =
    columns === 3
      ? "sm:grid-cols-3"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-3 lg:grid-cols-6";

  return (
    <dl className={`grid grid-cols-2 gap-px border border-border bg-border ${columnClass}`}>
      {stats.map((stat) => {
        const inner = (
          <>
            <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              {stat.label}
            </dt>
            <dd className="mt-3 font-mono text-2xl tabular-nums text-foreground">
              {stat.value}
            </dd>
            {stat.hint ? (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {stat.hint}
              </p>
            ) : null}
          </>
        );
        return (
          <div className="bg-background p-4" key={stat.label}>
            {stat.href ? (
              <AdminLink className="block hover:opacity-80" href={stat.href}>
                {inner}
              </AdminLink>
            ) : (
              inner
            )}
          </div>
        );
      })}
    </dl>
  );
}

export type BarRow = {
  label: string;
  value: number;
  sublabel?: string;
  href?: string;
};

export function BarList({
  rows,
  empty = "Nothing yet.",
}: {
  rows: readonly BarRow[];
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">{empty}</p>
    );
  }

  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className="divide-y divide-border border border-border">
      {rows.map((row) => {
        const content = (
          <>
            <div className="flex items-baseline justify-between gap-4 font-mono text-[11px]">
              <span className="truncate text-foreground">
                {row.label}
                {row.sublabel ? (
                  <span className="ml-2 text-muted-foreground">
                    {row.sublabel}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {row.value}
              </span>
            </div>
            <div className="mt-2 h-px w-full bg-border">
              <div
                className="h-px bg-foreground"
                style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
              />
            </div>
          </>
        );

        return (
          <li className="px-3 py-2.5" key={row.label}>
            {row.href ? (
              <AdminLink className="block hover:opacity-80" href={row.href}>
                {content}
              </AdminLink>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Inline SVG trend line — avoids shipping a chart library to the admin. */
export function Sparkline({
  points,
  height = 48,
}: {
  points: readonly SeriesPoint[];
  height?: number;
}) {
  if (points.length === 0) {
    return (
      <p className="font-mono text-[11px] text-muted-foreground">No data.</p>
    );
  }

  const width = 100;
  const max = Math.max(...points.map((p) => p.value), 1);
  const step = points.length > 1 ? width / (points.length - 1) : width;

  const path = points
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.value / max) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const total = points.reduce((sum, point) => sum + point.value, 0);

  return (
    <div>
      <svg
        aria-hidden
        className="w-full text-foreground"
        height={height}
        preserveAspectRatio="none"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex items-baseline justify-between font-mono text-[11px] text-muted-foreground">
        <span>{points[0]?.date}</span>
        <span className="tabular-nums text-foreground">{total} total</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export function formatTimestamp(iso: string | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.toISOString().replace("T", " ").slice(0, 19)}Z`;
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
