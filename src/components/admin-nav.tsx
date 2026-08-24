"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Admin navigation that carries the `?demo=1` bypass across pages.
 *
 * Without this, following any sidebar link from a demo session drops the flag
 * and lands on the access gate, which makes the console look broken to anyone
 * browsing it locally.
 */
/** Internal admin link that carries the `?demo=1` bypass, like AdminNav. */
export function AdminLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo") === "1";
  const target =
    demo && href.startsWith("/admin") && !href.includes("?")
      ? `${href}?demo=1`
      : href;

  return (
    <Link className={className} href={target}>
      {children}
    </Link>
  );
}

export function AdminNav({
  items,
  className,
  linkClassName,
}: {
  items: ReadonlyArray<{ href: string; label: string }>;
  className?: string;
  linkClassName?: string;
}) {
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo") === "1";

  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          className={linkClassName}
          href={demo ? `${item.href}?demo=1` : item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
