export type PicdropTheme = "pink" | "cyan" | "lime"

export const PICDROP_THEMES: PicdropTheme[] = ["pink", "cyan", "lime"]

export const THEME_LABELS: Record<PicdropTheme, string> = {
  pink: "Reticle Pink",
  cyan: "Cyan Blue",
  lime: "Lime Green",
}

const DEV_BASE = "/dev/picdrop-dashboard"

export function themeDashboardPath(theme: PicdropTheme) {
  if (theme === "pink") return `${DEV_BASE}/live`
  return `${DEV_BASE}/${theme}`
}

export function themeSkeletonPath(theme: PicdropTheme) {
  if (theme === "pink") return `${DEV_BASE}/skeleton`
  return `${DEV_BASE}/${theme}/skeleton`
}

export const PICDROP_PREVIEW_TABS = [
  { href: `${DEV_BASE}/skeleton`, label: "Pink Skel", swatch: "#FF4DA6" },
  { href: `${DEV_BASE}/cyan/skeleton`, label: "Cyan Skel", swatch: "#06B6D4" },
  { href: `${DEV_BASE}/lime/skeleton`, label: "Lime Skel", swatch: "#84CC16" },
  { href: `${DEV_BASE}/live`, label: "Pink Live", swatch: "#FF4DA6", devOnly: true },
  { href: `${DEV_BASE}/cyan`, label: "Cyan Live", swatch: "#06B6D4", devOnly: true },
  { href: `${DEV_BASE}/lime`, label: "Lime Live", swatch: "#84CC16", devOnly: true },
] as const
