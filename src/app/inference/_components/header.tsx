import { RiFlashlightLine } from "@remixicon/react";

import { Badge } from "@/components/ui/badge";

const SECTION_LINKS = [
  { href: "#workspace", label: "Workspace" },
  { href: "#conversation", label: "Conversation" },
  { href: "#composer", label: "Composers" },
  { href: "#agents", label: "Agents & tools" },
  { href: "#knowledge", label: "Sources" },
  { href: "#dev", label: "Code & signals" },
  { href: "#primitives", label: "Primitives" },
];

export function InferenceHeader() {
  return (
    <header className="sticky top-0 z-30 border-border border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-6 items-center justify-center bg-foreground text-background">
            <RiFlashlightLine className="size-3.5" />
          </span>
          <h1 className="font-medium text-sm tracking-tight">
            Inference · AI UI kit
          </h1>
        </div>
        <Badge className="font-mono text-[10px]" variant="outline">
          scratch base
        </Badge>
        <p className="order-last w-full text-muted-foreground text-xs sm:order-none sm:w-auto sm:flex-1">
          Forked shadcn / AI Elements blocks for the next product. Static mock
          state, no model calls. Not a Frameline surface.
        </p>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {SECTION_LINKS.map((link) => (
            <a
              className="text-muted-foreground text-xs transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
