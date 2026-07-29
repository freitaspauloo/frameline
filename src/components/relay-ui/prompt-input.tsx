"use client";

import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

/** Figma Screens · PromptInput (111:285) */
export function RelayPromptInput({
  className,
  children,
  ...props
}: PropsWithChildren<ComponentPropsWithoutRef<"div">>) {
  return (
    <div
      className={cn(
        "flex min-h-[148px] w-full max-w-[760px] flex-col gap-4 rounded-relay-lg border border-relay-border bg-relay-white pt-6 pb-[18px] pl-6 pr-5 shadow-relay-lg transition-[box-shadow,border-color] focus-within:border-relay-blue/30 focus-within:shadow-relay-lg-focus",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function RelayPromptToolbar({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>{children}</div>
  );
}

export function RelaySendArrow() {
  return (
    <span aria-hidden className="text-base font-semibold leading-none">
      ↑
    </span>
  );
}
