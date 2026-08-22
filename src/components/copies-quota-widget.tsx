import { cn } from "@/lib/utils";

/**
 * Quota chip for the $0 free tier. Sits in page chrome (white gutter),
 * never overlaid on a screen/material asset.
 */
export function CopiesQuotaWidget({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-live="polite"
      className={cn("pointer-events-none", className)}
      data-frameline-quota
    >
      <div className="inline-flex max-w-[min(18rem,calc(100vw-2rem))] items-center gap-2 border border-[#3A58F0]/35 bg-[#EEF2FF] px-2.5 py-1.5">
        <span className="font-mono text-[9px] font-semibold tracking-[0.16em] text-[#3A58F0] uppercase">
          Frameline
        </span>
        <span aria-hidden className="h-3 w-px shrink-0 bg-[#3A58F0]/30" />
        <span className="font-mono text-[10px] tracking-[0.12em] text-[#1A2A6B] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
