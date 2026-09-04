"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "@/lib/gsap-client"

import {
  runPicdropDashboardMotion,
  runPicdropDashboardSkeletonMotion,
} from "./picdrop-dashboard-motion"
import type { PicdropTheme } from "./themes"

function revealWithoutMotion(root: HTMLElement, readyClass: string) {
  root.classList.add(readyClass)
  root.querySelectorAll(".pd-skel-bone").forEach((bone) => {
    bone.classList.add("pd-skel-bone--live")
  })
}

function mountMotion(
  root: HTMLElement,
  run: (root: HTMLElement) => gsap.core.Timeline | void,
  readyClass: string,
) {
  root.classList.remove(readyClass)
  root.querySelectorAll(".pd-skel-bone--live").forEach((el) => {
    el.classList.remove("pd-skel-bone--live")
  })

  let ctx: gsap.Context | undefined
  let cancelled = false
  let fallback: ReturnType<typeof window.setTimeout> | undefined

  const clearFallback = () => {
    if (fallback !== undefined) {
      window.clearTimeout(fallback)
      fallback = undefined
    }
  }

  const start = () => {
    if (cancelled) return
    try {
      ctx = gsap.context(() => {
        const timeline = run(root)
        timeline?.eventCallback("onComplete", clearFallback)
      }, root)
    } catch {
      clearFallback()
      revealWithoutMotion(root, readyClass)
    }
  }

  // Double rAF so layout is settled before GSAP sets initial states
  const frame = requestAnimationFrame(() => {
    requestAnimationFrame(start)
  })

  fallback = window.setTimeout(() => {
    if (!root.classList.contains(readyClass)) {
      ctx?.revert()
      revealWithoutMotion(root, readyClass)
    }
  }, 4000)

  return () => {
    cancelled = true
    clearFallback()
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
