import { cn } from "@/lib/utils"

export function FramelineBrand({ className }: { className?: string }) {
  return (
    <div data-pd-brand className={cn("flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/relay/logo-mark.svg"
        alt=""
        aria-hidden
        className="size-[18px] shrink-0 object-contain"
        draggable={false}
      />
      <span className="text-[15px] font-semibold tracking-[-0.03em] text-zinc-900">frameline.ai</span>
    </div>
  )
}
