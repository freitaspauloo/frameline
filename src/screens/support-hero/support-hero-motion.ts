import { gsap, shouldRunMotion } from "@/lib/gsap-client"

const SOFT = "power3.out"
const REVEAL_SELECTOR =
  "[data-sh-bg], [data-sh-overlay], [data-sh-nav], [data-sh-nav-item], [data-sh-enter], [data-sh-dashboard], [data-sh-skel-bg-art], [data-sh-skel-overlay], [data-sh-skel-nav], [data-sh-skel-nav-bone], [data-sh-skel-content-bone], [data-sh-skel-dashboard]"

export type SupportHeroMotionSelectors = {
  bg: string
  overlay: string
  nav: string
  navItem: string
  enter: string
  dashboard: string
}

export const SUPPORT_HERO_MOTION: SupportHeroMotionSelectors = {
  bg: "[data-sh-bg]",
  overlay: "[data-sh-overlay]",
  nav: "[data-sh-nav]",
  navItem: "[data-sh-nav-item]",
  enter: "[data-sh-enter]",
  dashboard: "[data-sh-dashboard]",
}

export const SUPPORT_HERO_SKEL_MOTION: SupportHeroMotionSelectors = {
  bg: "[data-sh-skel-bg-art]",
  overlay: "[data-sh-skel-overlay]",
  nav: "[data-sh-skel-nav]",
  navItem: "[data-sh-skel-nav-bone]",
  enter: "[data-sh-skel-content-bone]",
  dashboard: "[data-sh-skel-dashboard]",
}

export type SupportHeroMotionOptions = {
  navBoneClip?: boolean
  contentBoneClip?: boolean
}

function revealFallback(root: HTMLElement) {
  root.classList.remove("sh-motion-pending")
  root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
    el.style.visibility = "visible"
    el.style.opacity = "1"
  })
}

/** GSAP entrance timeline — mounted in useLayoutEffect before paint. */
export function mountSupportHeroMotion(
  root: HTMLElement,
  selectors: SupportHeroMotionSelectors,
  options?: SupportHeroMotionOptions,
) {
  if (!shouldRunMotion()) {
    revealFallback(root)
    return () => {}
  }

  const safety = window.setTimeout(() => revealFallback(root), 2500)

  try {
    const ctx = gsap.context(() => {
      const bg = root.querySelector<HTMLElement>(selectors.bg)
      const overlays = gsap.utils.toArray<HTMLElement>(selectors.overlay, root)
      const nav = root.querySelector<HTMLElement>(selectors.nav)
      const navItems = gsap.utils.toArray<HTMLElement>(selectors.navItem, root)
      const enters = gsap.utils.toArray<HTMLElement>(selectors.enter, root)
      const dashboard = root.querySelector<HTMLElement>(selectors.dashboard)

      if (!bg || !nav || !dashboard) {
        revealFallback(root)
        return
      }

      gsap.set(bg, { autoAlpha: 0, scale: 1.1, transformOrigin: "50% 50%" })
      gsap.set(overlays, { autoAlpha: 0 })
      gsap.set(nav, { autoAlpha: 0, y: 28, filter: "blur(12px)" })
      gsap.set(navItems, { autoAlpha: 0, y: 18 })
      gsap.set(enters, { autoAlpha: 0, y: 36, filter: "blur(12px)" })
      gsap.set(dashboard, { autoAlpha: 0, y: 64, scale: 0.92 })

      const clipRound = options?.navBoneClip ? "8px" : "4px"
      gsap.set(navItems, { clipPath: `inset(0 100% 0 0 round ${clipRound})` })

      if (options?.contentBoneClip) {
        gsap.set(enters, { clipPath: "inset(0 100% 0 0 round 8px)" })
      }

      const tl = gsap.timeline({
        defaults: { ease: SOFT },
        delay: 0.08,
        onComplete: () => {
          window.clearTimeout(safety)
          revealFallback(root)
          gsap.set(navItems, { clearProps: "clipPath" })
          if (options?.contentBoneClip) {
            gsap.set(enters, { clearProps: "clipPath" })
          }
        },
      })

      tl.to(bg, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "expo.out" }, 0)
        .to(overlays, { autoAlpha: 1, duration: 1.1, stagger: 0.12 }, 0.14)
        .to(nav, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "expo.out" }, 0.1)
        .to(
          navItems,
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0 round 8px)",
            duration: 0.82,
            stagger: 0.07,
            ease: "power4.inOut",
          },
          0.2,
        )

      if (options?.contentBoneClip) {
        tl.to(
          enters,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            clipPath: "inset(0 0% 0 0 round 8px)",
            duration: 0.88,
            stagger: 0.09,
            ease: "power4.inOut",
          },
          0.32,
        )
      } else {
        tl.to(
          enters,
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.11, ease: "expo.out" },
          0.32,
        )
      }

      tl.to(
        dashboard,
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.25, ease: "expo.out" },
        0.55,
      )
    }, root)

    return () => {
      window.clearTimeout(safety)
      ctx.revert()
    }
  } catch {
    window.clearTimeout(safety)
    revealFallback(root)
    return () => {}
  }
}

/** Continuous GSAP shimmer on skeleton bones after entrance. */
export function mountSkeletonShimmer(root: HTMLElement) {
  if (!shouldRunMotion()) return () => {}

  const bones = gsap.utils.toArray<HTMLElement>(
    "[data-sh-skel-nav-bone], [data-sh-skel-content-bone], [data-sh-skel-dashboard]",
    root,
  )
  if (!bones.length) return () => {}

  const ctx = gsap.context(() => {
    gsap.to(bones, {
      opacity: 0.55,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { each: 0.07 },
    })
  }, root)

  return () => ctx.revert()
}
