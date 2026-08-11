import type { ReactNode } from "react";
import Link from "next/link";

import { LogoMark } from "@/components/relay-ui";
import { cn } from "@/lib/utils";

import { WfLabel } from "./primitives";

const NAV = [
  { href: "/wireframes", label: "Map" },
  { href: "/wireframes/home", label: "Home" },
  { href: "/wireframes/materials", label: "Catalog" },
  { href: "/wireframes/materials/aurora-mesh", label: "Material" },
  { href: "/wireframes/pricing", label: "Pricing" },
  { href: "/wireframes/checkout", label: "Checkout" },
  { href: "/wireframes/orders/demo", label: "Confirm" },
  { href: "/wireframes/account", label: "Account" },
  { href: "/wireframes/docs/installation", label: "Install" },
] as const;

export function WireframeShell({
  route,
  title,
  flow,
  children,
  nextHref,
  nextLabel,
}: {
  route: string;
  title: string;
  flow: "Main" | "Free" | "Paid" | "Account" | "Docs" | "Shared";
  children: ReactNode;
  nextHref?: string;
  nextLabel?: string;
}) {
  return (
    <div className="min-h-dvh bg-relay-canvas text-relay-ink">
      <header className="sticky top-0 z-50 border-b border-relay-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6 lg:px-8">
          <Link className="flex shrink-0 items-center gap-2" href="/wireframes">
            <LogoMark className="size-9" />
            <span className="hidden text-sm font-medium tracking-tight sm:inline">
              Frameline
            </span>
            <span className="hidden font-mono text-[11px] text-relay-tertiary sm:inline">
              wireframes
            </span>
          </Link>

          <nav className="hidden items-center gap-1 overflow-x-auto md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                className={cn(
                  "rounded-relay-sm px-2.5 py-1.5 font-mono text-[11px] text-relay-secondary transition-colors hover:bg-relay-panel hover:text-relay-ink",
                  route === item.href &&
                    "bg-relay-ink text-relay-white hover:bg-relay-ink hover:text-relay-white",
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            className="ml-auto text-sm text-relay-secondary transition-colors hover:text-relay-ink"
            href="/materials"
          >
            Live catalog →
          </Link>
        </div>
      </header>

      <div className="border-b border-relay-border bg-relay-white/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-2.5 lg:px-8">
          <div className="flex items-center gap-3">
            <WfLabel>{flow}</WfLabel>
            <span className="font-mono text-[12px] text-relay-tertiary">
              {route}
            </span>
            <span className="text-sm font-medium text-relay-ink">{title}</span>
          </div>
          {nextHref ? (
            <Link
              className="font-mono text-[12px] text-relay-blue hover:text-relay-blue-deep"
              href={nextHref}
            >
              Next: {nextLabel ?? nextHref} →
            </Link>
          ) : null}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}
