import { gsap } from "@/lib/gsap-client"

/** Smooth enter — no bounce, no harsh expo */
const EASE = "power2.out"
const EASE_DRIFT = "sine.inOut"

const REDUCED_MOTION_SELECTOR =
  "[data-pd-animate], [data-pd-sidebar], [data-pd-nav], [data-pd-sidebar-footer], [data-pd-storage-fill]"

const SKEL_REDUCED_SELECTOR =
  "[data-pd-skel-sidebar], [data-pd-skel-section], [data-pd-skel-row], [data-pd-skel-bone]"

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function showAll(root: HTMLElement, selector: string) {
  gsap.set(root.querySelectorAll(selector), {
    autoAlpha: 1,
    x: 0,
    y: 0,
    scale: 1,
    scaleX: 1,
    clearProps: "transform,filter",
  })
}

export function runPicdropDashboardMotion(root: HTMLElement) {
  if (prefersReducedMotion()) {
    showAll(root, REDUCED_MOTION_SELECTOR)
    root.classList.add("picdrop-dashboard--ready")
    return
  }

  const sidebar = root.querySelector<HTMLElement>("[data-pd-sidebar]")
  const navItems = gsap.utils.toArray<HTMLElement>("[data-pd-nav]", root)
  const sidebarFooter = root.querySelector<HTMLElement>("[data-pd-sidebar-footer]")
  const storageFill = root.querySelector<HTMLElement>("[data-pd-storage-fill]")
  const enters = gsap.utils.toArray<HTMLElement>("[data-pd-enter]", root)
  const stats = gsap.utils.toArray<HTMLElement>("[data-pd-stat]", root)
  const galleries = gsap.utils.toArray<HTMLElement>("[data-pd-gallery]", root)
  const feedbackPanel = root.querySelector<HTMLElement>("[data-pd-feedback-panel]")
  const feedbackItems = gsap.utils.toArray<HTMLElement>("[data-pd-feedback]", root)
  const tableSection = root.querySelector<HTMLElement>("[data-pd-table]")
  const rows = gsap.utils.toArray<HTMLElement>("[data-pd-row]", root)

  if (!sidebar) return

  gsap.set(sidebar, { autoAlpha: 0, x: -28 })
  gsap.set(navItems, { autoAlpha: 0, x: -12 })
  if (sidebarFooter) gsap.set(sidebarFooter, { autoAlpha: 0, y: 16 })
  if (storageFill) gsap.set(storageFill, { scaleX: 0, transformOrigin: "left center" })
  gsap.set(enters, { autoAlpha: 0, y: 18 })
  gsap.set(stats, { autoAlpha: 0, y: 16 })
  gsap.set(galleries, { autoAlpha: 0, y: 20 })
  if (feedbackPanel) gsap.set(feedbackPanel, { autoAlpha: 0, y: 18 })
  gsap.set(feedbackItems, { autoAlpha: 0, y: 12 })
  if (tableSection) gsap.set(tableSection, { autoAlpha: 0, y: 20 })
  gsap.set(rows, { autoAlpha: 0, y: 10 })

  const tl = gsap.timeline({
    defaults: { ease: EASE, force3D: true },
    onComplete: () => root.classList.add("picdrop-dashboard--ready"),
  })

  // Phase 1 — sidebar shell
  tl.to(sidebar, { autoAlpha: 1, x: 0, duration: 0.85 }, 0)
    .to(navItems, { autoAlpha: 1, x: 0, duration: 0.75, stagger: { each: 0.045 } }, 0.1)
    .to(sidebarFooter, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.22)

  if (storageFill) {
    tl.to(storageFill, { scaleX: 1, duration: 1.15, ease: "power1.inOut" }, 0.3)
  }

  // Phase 2 — main header + welcome (slight overlap with sidebar)
  tl.to(enters, { autoAlpha: 1, y: 0, duration: 0.85, stagger: { each: 0.12 } }, 0.18)

  // Phase 3 — stats row
  tl.to(stats, { autoAlpha: 1, y: 0, duration: 0.8, stagger: { each: 0.07 } }, 0.38)

  // Phase 4 — galleries
  tl.to(galleries, { autoAlpha: 1, y: 0, duration: 0.85, stagger: { each: 0.09 } }, 0.52)

  // Phase 5 — feedback column
  if (feedbackPanel) {
    tl.to(feedbackPanel, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.58)
  }
  tl.to(feedbackItems, { autoAlpha: 1, y: 0, duration: 0.7, stagger: { each: 0.04 } }, 0.66)

  // Phase 6 — table block
  if (tableSection) {
    tl.to(tableSection, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.72)
  }
  tl.to(rows, { autoAlpha: 1, y: 0, duration: 0.65, stagger: { each: 0.035 } }, 0.82)

  // Accent pulse — subtle theme-colored finish on CTAs + logo
  tl.fromTo(
    root.querySelectorAll<HTMLElement>(".picdrop-accent-icon, .picdrop-primary-btn, .picdrop-upgrade-btn"),
    { scale: 1 },
    { scale: 1.04, duration: 0.45, yoyo: true, repeat: 1, ease: EASE_DRIFT, stagger: 0.06 },
    0.95,
  )
}

export function runPicdropDashboardSkeletonMotion(root: HTMLElement) {
  if (prefersReducedMotion()) {
    showAll(root, SKEL_REDUCED_SELECTOR)
    root.classList.add("picdrop-skeleton--ready")
    root.querySelectorAll(".pd-skel-bone").forEach((bone) => bone.classList.add("pd-skel-bone--live"))
    return
  }

  const sidebar = root.querySelector<HTMLElement>("[data-pd-skel-sidebar]")
  const bones = gsap.utils.toArray<HTMLElement>("[data-pd-skel-bone]:not([data-pd-skel-row])", root)
  const sections = gsap.utils.toArray<HTMLElement>("[data-pd-skel-section]", root)
  const tableRows = gsap.utils.toArray<HTMLElement>("[data-pd-skel-row]", root)

  if (!sidebar) return

  gsap.set(sidebar, { autoAlpha: 0, x: -24 })
  gsap.set(bones, { autoAlpha: 0, y: 14 })
  gsap.set(sections, { autoAlpha: 0, y: 18 })
  gsap.set(tableRows, { autoAlpha: 0, y: 10 })

  const tl = gsap.timeline({
    defaults: { ease: EASE, force3D: true },
    onComplete: () => {
      root.classList.add("picdrop-skeleton--ready")
      root.querySelectorAll(".pd-skel-bone").forEach((bone) => bone.classList.add("pd-skel-bone--live"))
    },
  })

  tl.to(sidebar, { autoAlpha: 1, x: 0, duration: 0.8 }, 0)
    .to(bones, { autoAlpha: 1, y: 0, duration: 0.7, stagger: { each: 0.028 } }, 0.08)
    .to(sections, { autoAlpha: 1, y: 0, duration: 0.85, stagger: { each: 0.14 } }, 0.22)
    .to(tableRows, { autoAlpha: 1, y: 0, duration: 0.65, stagger: { each: 0.03 } }, 0.38)

  // Shimmer + accent pulse on key bones after entrance
  tl.call(() => {
    root.querySelectorAll<HTMLElement>(".pd-skel-bone--accent").forEach((bone, index) => {
      gsap.fromTo(
        bone,
        { scale: 1 },
        { scale: 1.03, duration: 0.5, yoyo: true, repeat: 1, ease: EASE_DRIFT, delay: index * 0.05 },
      )
    })

    bones.forEach((bone, index) => {
      gsap.to(bone, {
        opacity: 0.62,
        duration: 1.6 + (index % 5) * 0.08,
        repeat: -1,
        yoyo: true,
        ease: EASE_DRIFT,
      })
    })
  }, undefined, 0.55)
}
