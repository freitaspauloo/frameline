import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { IconChevron } from "./icons";

type RelayChipProps = {
  className?: string;
  children: ReactNode;
};

/** Figma System · Chip (22:15) */
export function RelayChip({ className, children }: RelayChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-relay-sm bg-relay-muted px-3 py-2 text-xs font-medium text-relay-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Model selector pill from Relay · Chat toolbar */
export function RelayModelChip({
  className,
  label = "Auto",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-relay-pill bg-relay-muted px-2.5 py-1.5 text-[13px] text-relay-secondary transition-colors hover:text-relay-ink",
        className,
      )}
      type="button"
    >
      {label}
      <IconChevron className="size-5" />
    </button>
  );
}
