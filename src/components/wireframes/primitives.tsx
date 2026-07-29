import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function WfBlock({
  className,
  dark,
  children,
}: {
  className?: string;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-relay-lg border border-relay-border",
        dark
          ? "bg-relay-ink text-relay-white"
          : "bg-relay-panel text-relay-secondary",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function WfBar({
  className,
  dark,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-2.5 rounded-relay-sm",
        dark ? "bg-relay-ink" : "bg-relay-border",
        className,
      )}
    />
  );
}

export function WfBtn({
  children,
  className,
  href,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary";
}) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-relay-md px-4 py-3 text-[13px] font-medium transition-colors",
    variant === "primary"
      ? "bg-relay-blue text-relay-white hover:bg-relay-blue-deep"
      : "border border-relay-border bg-relay-white text-relay-ink hover:bg-relay-panel",
    className,
  );
  if (href) {
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} type="button">
      {children}
    </button>
  );
}

export function WfLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.14em] text-relay-secondary",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function WfTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function WfMuted({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm leading-relaxed text-relay-secondary", className)}>
      {children}
    </p>
  );
}

export function WfBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "free" | "paid";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        tone === "free" && "bg-emerald-50 text-emerald-800",
        tone === "paid" && "bg-relay-blue-tint text-relay-blue-deep",
        tone === "neutral" && "bg-relay-muted text-relay-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
