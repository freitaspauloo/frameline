import { ATHERA_ASSETS } from "./constants"

type FramelineBrandProps = {
  className?: string
}

export function FramelineBrand({ className = "" }: FramelineBrandProps) {
  return (
    <div
      data-hero-dashboard-brand
      className={`flex items-center gap-1.5 rounded-md bg-white py-0.5 pl-0.5 pr-2 ${className}`.trim()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- dev preview brand mark */}
      <img alt="" className="size-[18px] shrink-0" src={ATHERA_ASSETS.framelineLogo} />
      <span className="text-[15px] font-semibold tracking-[-0.03em] text-zinc-900">
        frameline.ai
      </span>
    </div>
  )
}
