import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { RelaySendArrow } from "./prompt-input";

/** Figma System · CommandBar (22:21) */
export function RelayCommandBar({
  className,
  placeholder = "Describe a step and Relay will build it…",
  onSubmit,
}: {
  className?: string;
  placeholder?: string;
  onSubmit?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[520px] items-center justify-between rounded-relay-pill border border-relay-border bg-relay-white py-2 pl-5 pr-2",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="size-4 shrink-0 rounded-relay-sm bg-relay-blue" />
        <span className="text-sm text-relay-tertiary">{placeholder}</span>
      </div>
      <button
        className="flex size-9 shrink-0 items-center justify-center rounded-relay-pill bg-relay-blue text-relay-white transition-colors hover:bg-relay-blue-deep"
        onClick={onSubmit}
        type="button"
      >
        <RelaySendArrow />
      </button>
    </div>
  );
}

/** Figma System · Input (38:3) */
export function RelayInput({
  className,
  placeholder = "Name your agent",
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "w-full max-w-[280px] rounded-relay-md border border-relay-border bg-relay-white px-4 py-3 text-sm text-relay-ink outline-none placeholder:text-relay-tertiary focus:border-relay-blue/30 focus:ring-3 focus:ring-ring",
        className,
      )}
      placeholder={placeholder}
      {...props}
    />
  );
}

/** Figma System · StatusPill (22:17) */
export function RelayStatusPill({
  className,
  label = "Running",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-relay-pill bg-relay-blue-tint px-3 py-1 text-xs font-medium text-relay-blue-deep",
        className,
      )}
    >
      <span className="size-[7px] shrink-0 rounded-full bg-relay-blue" />
      {label}
    </span>
  );
}

/** Figma System · Avatar (51:32) */
export function RelayAvatar({
  className,
  initial = "P",
}: {
  className?: string;
  initial?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-relay-pill bg-relay-blue-tint text-[13px] font-semibold text-relay-blue-deep",
        className,
      )}
    >
      {initial}
    </span>
  );
}

/** Figma System · NavItem (51:27) */
export function RelayNavItem({
  className,
  active = false,
  icon,
  children,
}: {
  className?: string;
  active?: boolean;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-[38px] w-[208px] items-center gap-2 rounded-relay-md pl-3 text-[13px] font-medium",
        active
          ? "bg-relay-blue-tint text-relay-blue"
          : "text-relay-secondary",
        className,
      )}
    >
      {icon}
      {children}
    </div>
  );
}

export type RelayNodeType = "trigger" | "ai" | "condition" | "action";

const nodeStyles: Record<
  RelayNodeType,
  { iconBg: string; iconColor: string; detail: string }
> = {
  trigger: { iconBg: "bg-relay-muted", iconColor: "text-relay-secondary", detail: "trigger · webhook" },
  ai: { iconBg: "bg-relay-blue-tint", iconColor: "text-relay-blue", detail: "ai · classify" },
  condition: { iconBg: "bg-relay-muted", iconColor: "text-relay-secondary", detail: "condition · branch" },
  action: { iconBg: "bg-relay-muted", iconColor: "text-relay-secondary", detail: "action · send" },
};

/** Figma System · Node (38:4) */
export function RelayNode({
  className,
  type = "trigger",
  title = "Title",
  detail,
  icon,
}: {
  className?: string;
  type?: RelayNodeType;
  title?: string;
  detail?: string;
  icon: ReactNode;
}) {
  const style = nodeStyles[type];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-relay-lg border border-relay-border bg-relay-white py-3 pl-3 pr-4 shadow-relay-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-[30px] shrink-0 items-center justify-center rounded-relay-sm",
          style.iconBg,
          style.iconColor,
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-relay-ink">{title}</span>
        <span className="text-xs text-relay-secondary">
          {detail ?? style.detail}
        </span>
      </div>
    </div>
  );
}
