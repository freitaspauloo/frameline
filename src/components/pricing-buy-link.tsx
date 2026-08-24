"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { recordWtpIntent } from "@/lib/wtp-intent";
import { cn } from "@/lib/utils";

/**
 * Pricing CTA that beacons plan interest before navigating to checkout.
 * Does not block navigation — beacon is fire-and-forget.
 */
export function PricingBuyLink({
  href,
  plan,
  material,
  label,
  primary,
  className,
}: {
  href: string;
  plan: "screen" | "screen_year" | "screen_lifetime";
  material?: string;
  label: string;
  primary?: boolean;
  className?: string;
}) {
  return (
    <Button
      className={cn("w-full", className)}
      nativeButton={false}
      render={
        <Link
          href={href}
          onClick={() => {
            recordWtpIntent({
              plan,
              material,
              source: "pricing",
            });
          }}
        />
      }
      size="lg"
      variant={primary ? "default" : "outline"}
    >
      {label}
    </Button>
  );
}
