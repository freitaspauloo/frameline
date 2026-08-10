"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { animate, useReducedMotion } from "motion/react"

import { useHoverCapable } from "@/hooks/use-hover-capable"
import { SPRING_PRESS } from "@/lib/ease"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-colors outline-none select-none will-change-transform focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-11 gap-1.5 px-8 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  pressScale = 0.97,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    pressScale?: number
  }) {
  const reduce = useReducedMotion()
  const canHover = useHoverCapable()
  const isLink = variant === "link"
  const ref = React.useRef<HTMLButtonElement | null>(null)
  const pressed = React.useRef(false)

  const setScale = React.useEffectEvent((scale: number) => {
    const node = ref.current
    if (!node || reduce || isLink) return
    void animate(node, { scale }, SPRING_PRESS)
  })

  return (
    <ButtonPrimitive
      {...props}
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerDown={(event) => {
        pressed.current = true
        setScale(pressScale)
        onPointerDown?.(event)
      }}
      onPointerUp={(event) => {
        pressed.current = false
        setScale(canHover ? 1.02 : 1)
        onPointerUp?.(event)
      }}
      onPointerLeave={(event) => {
        pressed.current = false
        setScale(1)
        onPointerLeave?.(event)
      }}
      onPointerCancel={(event) => {
        pressed.current = false
        setScale(1)
        onPointerCancel?.(event)
      }}
      onMouseEnter={(event) => {
        if (canHover && !pressed.current) setScale(1.02)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        if (!pressed.current) setScale(1)
        onMouseLeave?.(event)
      }}
    />
  )
}

export { Button, buttonVariants }
