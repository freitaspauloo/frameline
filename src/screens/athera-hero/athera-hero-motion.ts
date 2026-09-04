import { gsap, shouldRunMotion } from "@/lib/gsap-client"

const SOFT = "power3.out"

function motionProfile(): "full" | "reduced" {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/dev/athera-hero")) {
    return "full"
  }
  if (!shouldRunMotion()) return "reduced"
  const forced =
    new URLSearchParams(window.location.search).get("motion") === "force" ||
    window.localStorage.getItem("athera-force-motion") === "1"
  if (forced) return "full"
  return "full"
}

function finish(root: HTMLElement, mode: "hero" | "skeleton") {
  const preloader = root.querySelector<HTMLElement>("[data-hero-preloader]")
  if (preloader) preloader.style.display = "none"
  root.classList.add(mode === "hero" ? "athera-hero--ready" : "athera-skeleton--ready")
  root.classList.remove("athera-motion-pending")
}

function runPreloader(
  root: HTMLElement,
  tl: gsap.core.Timeline,
  profile: "full" | "reduced",
) {
  const ring = root.querySelector<HTMLElement>("[data-hero-preloader-ring]")
  const dot = root.querySelector<HTMLElement>("[data-hero-preloader-dot]")
  const preloader = root.querySelector<HTMLElement>("[data-hero-preloader]")

  const spinDuration = profile === "full" ? 1 : 0.45
  const fadeAt = profile === "full" ? 0.9 : 0.42

  if (ring) {
    gsap.set(ring, { rotate: 0, scale: 0.75, opacity: 0.35, transformOrigin: "50% 50%" })
    tl.to(ring, { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" }, 0)
    tl.to(
      ring,
      { rotate: 360, duration: spinDuration, ease: "none", repeat: profile === "full" ? 1 : 0 },
      0,
    )
  }
  if (dot) {
    gsap.set(dot, { scale: 0.45, opacity: 0.35 })
    tl.to(dot, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, 0.06)
    if (profile === "full") {
      tl.to(
        dot,
        { scale: 0.8, opacity: 0.75, duration: 0.28, yoyo: true, repeat: 2, ease: "sine.inOut" },
        0.28,
      )
    }
  }
  if (preloader) {
    gsap.set(preloader, { autoAlpha: 1 })
    tl.to(preloader, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, fadeAt)
  }

  return fadeAt + 0.15
}

export function mountHeroMotion(root: HTMLElement): gsap.core.Timeline | null {
  const profile = motionProfile()

  root.classList.remove("athera-hero--ready", "athera-skeleton--ready")
  root.classList.add("athera-motion-pending")

  const preloader = root.querySelector<HTMLElement>("[data-hero-preloader]")
  if (preloader) preloader.style.display = ""

  const bg = root.querySelector<HTMLElement>("[data-hero-bg]")
  const overlays = gsap.utils.toArray<HTMLElement>("[data-hero-overlay]", root)
  const nav = root.querySelector<HTMLElement>("[data-hero-nav]")
  const navItems = gsap.utils.toArray<HTMLElement>("[data-hero-nav-item]", root)
  const enters = gsap.utils.toArray<HTMLElement>("[data-hero-enter]", root)
  const dashboard = root.querySelector<HTMLElement>("[data-hero-dashboard]")
  const glow = root.querySelector<HTMLElement>("[data-hero-accent-glow]")

  if (!bg || !nav || !dashboard) {
    finish(root, "hero")
    return null
  }

  const allContent = [bg, ...overlays, nav, ...navItems, ...enters, dashboard, glow].filter(
    Boolean,
  ) as HTMLElement[]

  gsap.set(allContent, { autoAlpha: 0 })
  gsap.set(nav, { y: profile === "full" ? 24 : 12 })
  gsap.set(navItems, { y: 12 })
  gsap.set(enters, { y: profile === "full" ? 28 : 14 })
  gsap.set(bg, { scale: profile === "full" ? 1.08 : 1.03, transformOrigin: "50% 50%" })
  gsap.set(dashboard, { x: profile === "full" ? 56 : 24, scale: 0.96 })

  const contentStart = profile === "full" ? 1.05 : 0.55
  const dur = profile === "full" ? 1 : 0.55
  const stagger = profile === "full" ? 0.07 : 0.04

  const tl = gsap.timeline({
    defaults: { ease: SOFT },
    onComplete: () => {
      finish(root, "hero")
      gsap.set(allContent, { clearProps: "transform,filter,clipPath" })
      if (profile === "full" && glow) {
        gsap.to(glow, {
          opacity: 0.88,
          scale: 1.05,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "50% 45%",
        })
      }
      if (profile === "full") {
        const blend = root.querySelector<HTMLElement>(".athera-accent-blend")
        if (blend) {
          gsap.to(blend, {
            opacity: 0.62,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        }
      }
    },
  })

  runPreloader(root, tl, profile)

  tl.to(bg, { autoAlpha: 1, scale: 1, duration: dur * 1.2, ease: "expo.out" }, contentStart)
    .to(overlays, { autoAlpha: 1, duration: dur, stagger: 0.08 }, contentStart + 0.1)
    .to(nav, { autoAlpha: 1, y: 0, duration: dur, ease: "expo.out" }, contentStart + 0.08)
    .to(
      navItems,
      { autoAlpha: 1, y: 0, duration: dur * 0.85, stagger },
      contentStart + 0.16,
    )
    .to(
      enters,
      { autoAlpha: 1, y: 0, duration: dur * 0.9, stagger },
      contentStart + 0.24,
    )
    .to(
      dashboard,
      { autoAlpha: 1, x: 0, scale: 1, duration: dur * 1.1, ease: "expo.out" },
      contentStart + 0.38,
    )

  if (glow) {
    tl.to(glow, { autoAlpha: 1, duration: dur * 0.8 }, contentStart + 0.42)
  }

  return tl
}

export function mountSkeletonMotion(
  root: HTMLElement,
  onLoaded?: () => void,
): gsap.core.Timeline | null {
  const profile = motionProfile()

  root.classList.remove("athera-hero--ready", "athera-skeleton--ready")
  root.classList.add("athera-motion-pending")

  const preloader = root.querySelector<HTMLElement>("[data-hero-preloader]")
  if (preloader) preloader.style.display = ""

  const navItems = gsap.utils.toArray<HTMLElement>("[data-skel-nav-bone]", root)
  const contentBones = gsap.utils.toArray<HTMLElement>("[data-skel-content-bone]", root)
  const dashboard = root.querySelector<HTMLElement>("[data-skel-dashboard]")
  const blend = root.querySelector<HTMLElement>("[data-skel-blend] .athera-accent-blend")
  const allBones = [...navItems, ...contentBones, dashboard, blend].filter(Boolean) as HTMLElement[]

  if (!navItems.length || !contentBones.length || !dashboard) {
    finish(root, "skeleton")
    onLoaded?.()
    return null
  }

  gsap.set(allBones, { autoAlpha: 0 })
  gsap.set(navItems, { y: 16 })
  gsap.set(contentBones, { y: 22 })
  gsap.set(dashboard, { x: 40, scale: 0.95 })
  if (blend) gsap.set(blend, { opacity: 0 })

  const contentStart = profile === "full" ? 1.05 : 0.55
  const dur = profile === "full" ? 0.9 : 0.5
  const stagger = profile === "full" ? 0.07 : 0.04

  const tl = gsap.timeline({
    defaults: { ease: SOFT },
    onComplete: () => {
      finish(root, "skeleton")
      gsap.set(allBones, { clearProps: "transform,clipPath" })
      onLoaded?.()
    },
  })

  runPreloader(root, tl, profile)

  tl.to(
    navItems,
    { autoAlpha: 1, y: 0, duration: dur, stagger },
    contentStart + 0.08,
  )
    .to(
      contentBones,
      { autoAlpha: 1, y: 0, duration: dur, stagger },
      contentStart + 0.2,
    )
    .to(
      dashboard,
      { autoAlpha: 1, x: 0, scale: 1, duration: dur * 1.1, ease: "expo.out" },
      contentStart + 0.34,
    )

  if (blend) {
    tl.to(blend, { opacity: 0.72, duration: dur }, contentStart + 0.42)
  }

  return tl
}

export function mountSkeletonShimmer(root: HTMLElement) {
  if (motionProfile() === "reduced") return () => {}

  const bones = gsap.utils.toArray<HTMLElement>(
    "[data-skel-nav-bone], [data-skel-content-bone]",
    root,
  )
  const shimmers = gsap.utils.toArray<HTMLElement>(".athera-skel-shimmer", root)
  const tweens: gsap.core.Tween[] = []

  if (bones.length) {
    tweens.push(
      gsap.to(bones, {
        opacity: 0.58,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.07 },
      }),
    )
  }

  shimmers.forEach((el, i) => {
    gsap.set(el, { xPercent: -120 })
    tweens.push(
      gsap.to(el, {
        xPercent: 120,
        duration: 1.35,
        repeat: -1,
        ease: "none",
        delay: i * 0.05,
      }),
    )
  })

  const blend = root.querySelector<HTMLElement>("[data-skel-blend] .athera-accent-blend")
  if (blend) {
    tweens.push(
      gsap.to(blend, {
        opacity: 0.55,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }),
    )
  }

  return () => tweens.forEach((t) => t.kill())
}

export function safetyReveal(root: HTMLElement, mode: "hero" | "skeleton", onDone?: () => void) {
  gsap.utils
    .toArray<HTMLElement>(
      "[data-hero-bg], [data-hero-overlay], [data-hero-nav], [data-hero-nav-item], [data-hero-enter], [data-hero-dashboard], [data-hero-accent-glow], [data-skel-nav-bone], [data-skel-content-bone], [data-skel-dashboard]",
      root,
    )
    .forEach((el) => gsap.set(el, { autoAlpha: 1, clearProps: "all" }))
  finish(root, mode)
  onDone?.()
}
