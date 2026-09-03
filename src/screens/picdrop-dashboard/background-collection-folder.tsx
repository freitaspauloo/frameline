"use client"

import { cn } from "@/lib/utils"

type CollectionFolderPreviewProps = {
  id: string
  name: string
  previews: string[]
  subtitle?: string
  tone?: "light" | "dark"
  grayscale?: boolean
  className?: string
  frameClassName?: string
}

export function CollectionFolderPreview({
  name,
  previews,
  subtitle,
  tone = "light",
  grayscale = false,
  className,
  frameClassName,
}: CollectionFolderPreviewProps) {
  const images = previews.slice(0, 3)

  return (
    <article className={cn("group flex flex-col gap-2.5", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
          frameClassName,
        )}
      >
        <div
          className={cn(
            "absolute inset-0",
            tone === "light" ? "bg-[#f8f8f8]" : "bg-zinc-900",
          )}
        />

        <div className="absolute inset-x-3 top-3 bottom-8">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={cn(
                "absolute overflow-hidden rounded-md border border-black/10 bg-white shadow-sm",
                index === 0 && "left-0 top-0 z-10 h-[58%] w-[72%]",
                index === 1 && "right-0 top-[18%] z-20 h-[52%] w-[58%]",
                index === 2 && "bottom-0 left-[14%] z-30 h-[48%] w-[62%]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className={cn(
                  "size-full object-cover transition duration-300 group-hover:scale-[1.02]",
                  grayscale && "grayscale",
                )}
              />
            </div>
          ))}
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-7 border-t border-black/5",
            tone === "light" ? "bg-[#efefef]" : "bg-zinc-800",
          )}
        />
      </div>

      <div className="min-w-0 px-0.5">
        <p className="truncate text-[13px] font-semibold text-zinc-900">{name}</p>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
    </article>
  )
}
