"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { INFERENCE_NAV } from "@/app/inference/_lib/nav";
import { cn } from "@/lib/utils";

export function InferenceNav({
  className,
  linkClassName,
  activeLinkClassName,
}: {
  className?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {INFERENCE_NAV.map((item) => {
        const active =
          pathname === item.href ||
          (pathname === "/inference" && item.href === "/inference/workspace");

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              linkClassName,
              active && activeLinkClassName,
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
