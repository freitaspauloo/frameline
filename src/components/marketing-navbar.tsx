import Link from "next/link";

import { Logo01 } from "@/components/relay-ui";
import { Button } from "@/components/ui/button";
import {
  MarketingRailCross,
  marketingPadX,
} from "@/components/marketing-shell";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/materials", label: "Materials" },
  { href: "/docs/installation", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function MarketingNavbar({
  className,
}: {
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 overflow-visible border-b border-border bg-white",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl overflow-visible">
        <MarketingRailCross edge="bottom" />
        <div
          className={cn(
            "grid h-16 grid-cols-[1fr_auto_1fr] items-center",
            marketingPadX,
          )}
        >
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-none px-2.5 py-1.5 text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            aria-label="Frameline home"
            className="justify-self-center"
            href="/"
          >
            <Logo01 className="size-8" />
          </Link>

          <div className="flex items-center justify-end gap-2">
            <Button
              className="hidden sm:inline-flex"
              nativeButton={false}
              render={<Link href="/account/sign-in" />}
              size="sm"
              variant="ghost"
            >
              Log in
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/materials" />}
              size="sm"
            >
              Browse materials
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
