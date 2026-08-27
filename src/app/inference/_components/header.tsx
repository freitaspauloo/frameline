import { RiFlashlightLine } from "@remixicon/react";

import { InferenceThemePanelMobile } from "@/app/inference/_components/theme/theme-panel";
import { Badge } from "@/components/ui/badge";

export function InferenceHeader() {
  return (
    <header className="shrink-0 border-border border-b bg-background/85 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3">
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
        <p className="w-full text-muted-foreground text-xs sm:w-auto sm:flex-1">
          Forked shadcn / AI Elements blocks for the next product. Static mock
          state, no model calls. Not a Frameline surface.
        </p>
        <InferenceThemePanelMobile />
      </div>
    </header>
  );
}
