"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "@/lib/gsap-client"

import {
  runPicdropDashboardMotion,
  runPicdropDashboardSkeletonMotion,
} from "./picdrop-dashboard-motion"
import type { PicdropTheme } from "./themes"

function mountMotion(
  root: HTMLElement,
  run: (root: HTMLElement) => void,
  readyClass: string,
) {
  root.classList.remove(readyClass)
  root.querySelectorAll(".pd-skel-bone--live").forEach((el) => {
    el.classList.remove("pd-skel-bone--live")
  })

  let ctx: gsap.Context | undefined
  const frame = requestAnimationFrame(() => {
    ctx = gsap.context(() => run(root), root)
  })

  return () => {
    cancelAnimationFrame(frame)
    ctx?.revert()
    root.classList.remove(readyClass)
  }
}

export function usePicdropDashboardMotion(theme: PicdropTheme) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    return mountMotion(root, runPicdropDashboardMotion, "picdrop-dashboard--ready")
  }, [theme])

  return rootRef
}

export function usePicdropSkeletonMotion(theme: PicdropTheme) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    return mountMotion(root, runPicdropDashboardSkeletonMotion, "picdrop-skeleton--ready")
  }, [theme])

  return rootRef
}
