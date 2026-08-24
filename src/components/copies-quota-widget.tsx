"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { LogoMark } from "@/components/relay-ui";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "1 free copy per week";

type CopiesQuotaContextValue = {
  label: string;
  setLabel: (label: string) => void;
};

const CopiesQuotaContext = React.createContext<CopiesQuotaContextValue | null>(
  null,
);

function CopiesQuotaChip({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed bottom-4 left-4 z-[9999] sm:bottom-6 sm:left-6",
        className,
      )}
      data-frameline-quota
    >
      <div className="inline-flex max-w-[min(22rem,calc(100vw-2rem))] items-center gap-2.5 border border-[#3A58F0] bg-[#EEF2FF] px-3 py-2 shadow-[0_8px_24px_rgba(26,42,107,0.18)]">
        <LogoMark aria-hidden className="size-5 shrink-0" />
        <span className="font-mono text-[10px] tracking-[0.14em] text-[#1A2A6B] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Viewport-fixed copies chip. Portaled to document.body so Lenis, transforms,
 * and page overflow cannot pin it to an asset or scroll it away.
 */
export function CopiesQuotaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [label, setLabel] = React.useState(DEFAULT_LABEL);
  const [mounted, setMounted] = React.useState(false);
  const value = React.useMemo(() => ({ label, setLabel }), [label]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chip = <CopiesQuotaChip label={label} />;

  return (
    <CopiesQuotaContext.Provider value={value}>
      {children}
      {mounted ? createPortal(chip, document.body) : chip}
    </CopiesQuotaContext.Provider>
  );
}

/** Override the dock label on a specific page (e.g. remaining weekly copies). */
export function useCopiesQuotaLabel(label: string) {
  const ctx = React.useContext(CopiesQuotaContext);
  const setLabel = ctx?.setLabel;

  React.useEffect(() => {
    if (!setLabel) return;
    setLabel(label);
    return () => setLabel(DEFAULT_LABEL);
  }, [setLabel, label]);
}

/** @deprecated Prefer CopiesQuotaProvider — kept for one-off mounts. */
export function CopiesQuotaWidget({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chip = <CopiesQuotaChip label={label} className={className} />;
  if (!mounted) return chip;
  return createPortal(chip, document.body);
}
