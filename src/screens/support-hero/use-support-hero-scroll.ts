"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

import { gsap } from "@/lib/gsap-client"

function readScrollY(node: HTMLElement | null, eventTarget?: EventTarget | null) {
  let y = window.scrollY || document.documentElement.scrollTop || 0
  if (eventTarget instanceof HTMLElement) {
    y = Math.max(y, eventTarget.scrollTop || 0)
  }
  let cur: HTMLElement | null = node?.parentElement ?? null
  while (cur) {
    y = Math.max(y, cur.scrollTop || 0)
    cur = cur.parentElement
  }
  return y
}

export function useSupportHeroScroll(scopeRef: RefObject<HTMLElement | null>) {
  const lastScrollY = useRef(0)
  const [navCompact, setNavCompact] = useState(false)

  useEffect(() => {
    const root = scopeRef.current
    if (!root) return

    lastScrollY.current = readScrollY(root)

    const onScroll = (event?: Event) => {
      const y = readScrollY(root, event?.target ?? null)
      const prev = lastScrollY.current
      const delta = y - prev
      lastScrollY.current = y

      if (y <= 16) {
        setNavCompact(false)
        return
      }
      if (delta > 2) {
        setNavCompact(true)
        return
      }
      if (delta < -2) {
        setNavCompact(false)
      }
    }

    document.addEventListener("scroll", onScroll, { passive: true, capture: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    onScroll()

    return () => {
      document.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [scopeRef])

  useEffect(() => {
    const nav = scopeRef.current?.querySelector<HTMLElement>("[data-sh-nav]")
    if (!nav) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nav.style.maxWidth = navCompact ? "980px" : "1340px"
      return
    }

    gsap.to(nav, {
      maxWidth: navCompact ? 980 : 1340,
      duration: 0.32,
      ease: "power3.out",
      overwrite: "auto",
    })
  }, [navCompact, scopeRef])

  return navCompact
}
