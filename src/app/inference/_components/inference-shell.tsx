"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useInferenceTheme } from "@/app/inference/_components/theme/theme-provider";
import {
  InferenceThemePanel,
  InferenceThemePanelMobile,
} from "@/app/inference/_components/theme/theme-panel";
import { cn } from "@/lib/utils";

import { InferenceHeader } from "./header";
import { InferenceNav } from "./inference-nav";

export function InferenceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { themeStyle } = useInferenceTheme();
  const isWorkspace =
    pathname === "/inference/workspace" || pathname === "/inference";

  return (
    <div className="flex min-h-svh" style={themeStyle}>
      <aside className="hidden w-52 shrink-0 border-border border-r md:block">
        <div className="border-border border-b px-4 py-5">
          <p className="font-medium text-sm">Inference</p>
          <p className="mt-1 text-muted-foreground text-xs">AI UI kit</p>
        </div>
        <InferenceNav
          activeLinkClassName="bg-muted text-foreground"
          className="flex flex-col py-2"
          linkClassName="border-border border-b px-4 py-3 text-sm text-muted-foreground transition-colors last:border-b-0 hover:bg-muted hover:text-foreground"
        />
      </aside>

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <InferenceHeader />
        <InferenceNav
          activeLinkClassName="text-foreground"
          className="flex gap-3 overflow-x-auto border-border border-b px-4 py-2 md:hidden"
          linkClassName="shrink-0 text-muted-foreground text-xs transition-colors hover:text-foreground"
        />
        <div className="flex min-h-0 flex-1">
          <main
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col",
              isWorkspace ? "overflow-hidden" : "overflow-auto",
            )}
          >
            {children}
          </main>
          <InferenceThemePanel />
        </div>
      </div>
    </div>
  );
}
