"use client";

import * as React from "react";

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
        "pointer-events-none fixed bottom-4 left-4 z-[60] sm:bottom-6 sm:left-6",
        className,
      )}
      data-frameline-quota
    >
      <div className="inline-flex max-w-[min(18rem,calc(100vw-2rem))] items-center gap-2 border border-[#3A58F0]/35 bg-[#EEF2FF]/95 px-3 py-2 shadow-sm backdrop-blur-sm">
        <span className="font-mono text-[9px] font-semibold tracking-[0.18em] text-[#3A58F0] uppercase">
          Frameline
        </span>
        <span aria-hidden className="h-3 w-px shrink-0 bg-[#3A58F0]/30" />
        <span className="font-mono text-[10px] tracking-[0.14em] text-[#1A2A6B] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Page-level copies chip. Fixed bottom-left of the viewport so it never
 * sits on a screen or material asset.
 */
export function CopiesQuotaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [label, setLabel] = React.useState(DEFAULT_LABEL);
  const value = React.useMemo(() => ({ label, setLabel }), [label]);

  return (
    <CopiesQuotaContext.Provider value={value}>
      {children}
      <CopiesQuotaChip label={label} />
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
  return <CopiesQuotaChip label={label} className={className} />;
}
