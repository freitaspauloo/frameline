import Link from "next/link";
import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingNavbar } from "@/components/marketing-navbar";
import {
  MarketingPageHeader,
  MarketingSection,
  MarketingShell,
  marketingPad,
  marketingPadX,
} from "@/components/marketing-shell";
import { cn } from "@/lib/utils";

export const DOCS_NAV = [
  {
    href: "/docs",
    label: "Overview",
    description: "How docs are organized and where to start.",
  },
  {
    href: "/docs/installation",
    label: "Installation",
    description: "CLI, copy-paste, and registry tokens.",
  },
  {
    href: "/docs/theming",
    label: "Theming",
    description: "Token binding, CSS variables, dark mode.",
  },
  {
    href: "/docs/accessibility",
    label: "Accessibility",
    description: "Reduced motion, fallbacks, contrast.",
  },
  {
    href: "/docs/performance",
    label: "Performance",
    description: "Budgets, pause-on-idle, CSS-only tier.",
  },
  {
    href: "/docs/examples",
    label: "Examples",
    description: "Hero, card, auth shell, empty state.",
  },
  {
    href: "/docs/troubleshooting",
    label: "Troubleshooting",
    description: "Hydration, WebGL, tokens, install 403.",
  },
  {
    href: "/docs/licensing",
    label: "Licensing",
    description: "Free, Personal, and Team rights.",
  },
] as const;

export type DocsNavHref = (typeof DOCS_NAV)[number]["href"];

export function DocsShell({
  children,
  currentPath,
  description,
  eyebrow = "Docs",
  title,
}: {
  children: ReactNode;
  currentPath: DocsNavHref;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}) {
  return (
    <MarketingShell>
      <MarketingNavbar />
      <MarketingSection>
        <MarketingPageHeader
          description={description}
          eyebrow={eyebrow}
          title={title}
        />

        <div className="relative grid overflow-visible lg:grid-cols-[15rem_minmax(0,1fr)] lg:divide-x lg:divide-border">
          <DocsSidebar currentPath={currentPath} />
          <article className={cn(marketingPad, "min-w-0")}>{children}</article>
        </div>
      </MarketingSection>
      <MarketingFooter />
    </MarketingShell>
  );
}

function DocsSidebar({ currentPath }: { currentPath: DocsNavHref }) {
  return (
    <nav
      aria-label="Documentation"
      className={cn(
        "border-b border-border lg:border-b-0",
        marketingPadX,
        "py-8 lg:py-12",
      )}
    >
      <p className="mb-4 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
        Guides
      </p>
      <ul className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
        {DOCS_NAV.map((item) => {
          const active = item.href === currentPath;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block border border-transparent px-3 py-2 text-sm transition-colors lg:border-0 lg:border-l-2 lg:px-4",
                  active
                    ? "border-foreground bg-foreground text-background lg:border-foreground lg:bg-transparent lg:text-foreground lg:font-medium"
                    : "text-muted-foreground hover:border-border hover:text-foreground lg:border-transparent lg:hover:border-border",
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Section heading inside a docs article. */
export function DocsH2({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <h2
      className="font-heading mt-12 scroll-mt-24 text-xl font-medium tracking-tight text-foreground first:mt-0"
      id={id}
    >
      {children}
    </h2>
  );
}

export function DocsP({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function DocsUl({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground">
      {children}
    </ul>
  );
}

export function DocsCode({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-6 overflow-x-auto border border-border bg-foreground p-5 font-mono text-[13px] leading-relaxed text-background">
      {children}
    </pre>
  );
}

export function DocsInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem] text-foreground">
      {children}
    </code>
  );
}

export function DocsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="mt-6 overflow-x-auto border border-border">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-b-0 align-top"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-4 py-3 leading-relaxed text-muted-foreground",
                    j === 0 && "font-medium text-foreground",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocsCallout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <aside className="mt-8 border border-border border-l-[3px] border-l-foreground px-5 py-4">
      <p className="text-[0.625rem] font-semibold tracking-widest text-foreground uppercase">
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </aside>
  );
}
