import Link from "next/link";

import { Logo01, RelayButton } from "@/components/relay-ui";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/materials", label: "Materials" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs/installation", label: "Docs" },
];

export function MarketingNavbar({
  className,
  tone = "solid",
}: {
  className?: string;
  tone?: "solid" | "overlay";
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md",
        tone === "overlay"
          ? "border-relay-ink/5 bg-relay-white/55"
          : "border-relay-border/80 bg-background/90",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6 lg:px-8">
        <Link className="flex shrink-0 items-center gap-2" href="/">
          <Logo01 className="size-10" />
          <span className="hidden font-heading text-sm font-medium tracking-tight sm:inline">
            Frameline
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="text-sm text-relay-secondary transition-colors hover:text-relay-ink"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <RelayButton
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<Link href="/account/sign-in" />}
            variant="nav-secondary"
          >
            Log in
          </RelayButton>
          <RelayButton
            nativeButton={false}
            render={<Link href="/materials" />}
            variant="nav-cta"
          >
            Browse materials
          </RelayButton>
        </div>
      </div>
    </header>
  );
}
