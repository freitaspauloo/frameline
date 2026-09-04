import { cn } from "@/lib/utils"

type FramelineBrandProps = {
  className?: string
  compact?: boolean
  size?: "default" | "nav"
}

const MARK_SIZE = {
  default: "size-[16px] sm:size-[18px]",
  nav: "size-[22px] sm:size-[26px]",
} as const

export function FramelineBrand({
  className,
  compact = false,
  size = "default",
}: FramelineBrandProps) {
  return (
    <a
      href="https://frameline.ai"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/8",
        className,
      )}
      aria-label="Frameline — frameline.ai"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark */}
      <img
        src="/brand/frameline-mark.svg"
        alt=""
        aria-hidden
        className={cn("shrink-0", MARK_SIZE[size])}
        draggable={false}
      />
      {!compact && (
        <span className="hidden text-[12px] font-semibold tracking-[-0.03em] text-white/85 transition-colors group-hover:text-white sm:inline">
          frameline.ai
        </span>
      )}
    </a>
  )
}
