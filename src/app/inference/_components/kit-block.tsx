import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface KitBlockProps {
  /** Human label for the block. */
  title: string;
  /** Import path the block came from, so it can be lifted straight out. */
  source: string;
  note?: string;
  className?: string;
  /** Lets a demo opt out of the default padding when it needs full bleed. */
  bodyClassName?: string;
  children: ReactNode;
}

export function KitBlock({
  title,
  source,
  note,
  className,
  bodyClassName,
  children,
}: KitBlockProps) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col overflow-hidden border border-border bg-card",
        className,
      )}
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border px-4 py-3">
        <h3 className="font-medium text-foreground text-sm">{title}</h3>
        <code className="font-mono text-[11px] text-muted-foreground">
          {source}
        </code>
        {note ? (
          <p className="w-full text-muted-foreground text-xs">{note}</p>
        ) : null}
      </header>
      <div className={cn("min-w-0 flex-1 p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export interface KitSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function KitSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: KitSectionProps) {
  return (
    <section className="scroll-mt-20 border-t border-border" id={id}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12">
        <header className="flex flex-col gap-2">
          <Badge className="w-fit font-mono text-[10px]" variant="outline">
            {eyebrow}
          </Badge>
          <h2 className="font-medium text-2xl text-foreground tracking-tight">
            {title}
          </h2>
          <p className="max-w-2xl text-muted-foreground text-sm">
            {description}
          </p>
        </header>
        {children}
      </div>
    </section>
  );
}
