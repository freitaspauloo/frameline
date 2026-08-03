import Link from "next/link";

import { Logo01 } from "@/components/relay-ui";
import {
  MarketingRuledCell,
  MarketingRuledGrid,
  MarketingSection,
  marketingPadX,
} from "@/components/marketing-shell";
import { cn } from "@/lib/utils";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/collections", label: "Collections" },
      { href: "/materials", label: "Materials" },
      { href: "/free", label: "Free" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/licensing", label: "Licensing" },
      { href: "/docs/examples", label: "Examples" },
      { href: "/shadcn", label: "Design system" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/changelog", label: "Changelog" },
      { href: "/license", label: "License" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account/sign-in", label: "Sign in" },
      { href: "/account", label: "Account" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
] as const;

export function MarketingFooter() {
  return (
    <MarketingSection>
      <MarketingRuledGrid cols={2} className="lg:grid-cols-[1.2fr_2fr]">
        <MarketingRuledCell className="space-y-4 lg:col-span-1">
          <Link className="inline-flex items-center gap-2" href="/">
            <Logo01 className="size-8" />
            <span className="font-heading text-sm font-semibold tracking-tight">
              Frameline
            </span>
          </Link>
          <p className="max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
            Design assets for the AI era — shippable surface so you don’t ship
            the default look.
          </p>
        </MarketingRuledCell>

        <MarketingRuledCell>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="space-y-3">
                <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  {column.title}
                </p>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </MarketingRuledCell>
      </MarketingRuledGrid>

      <div
        className={cn(
          "flex flex-col gap-3 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between",
          marketingPadX,
        )}
      >
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Frameline. All rights reserved.
        </p>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Sera · Stone · Blue
        </p>
      </div>
    </MarketingSection>
  );
}
