export type AtheraThemeId = "pink" | "cyan" | "lime"

export type AtheraTheme = {
  id: AtheraThemeId
  label: string
  tabLabel: string
  accent: string
}

export const ATHERA_THEME_PINK: AtheraTheme = {
  id: "pink",
  label: "Reticle Pink",
  tabLabel: "Pink",
  accent: "#FF4DA6",
}

export const ATHERA_THEME_CYAN: AtheraTheme = {
  id: "cyan",
  label: "Cyan Blue",
  tabLabel: "Cyan",
  accent: "#22D3EE",
}

export const ATHERA_THEME_LIME: AtheraTheme = {
  id: "lime",
  label: "Lime Green",
  tabLabel: "Lime",
  accent: "#A3E635",
}

export const ATHERA_THEMES: Record<AtheraThemeId, AtheraTheme> = {
  pink: ATHERA_THEME_PINK,
  cyan: ATHERA_THEME_CYAN,
  lime: ATHERA_THEME_LIME,
}

const DEV_BASE = "/dev/athera-hero"

export const ATHERA_PREVIEW_TABS = [
  { href: DEV_BASE, label: "Pink", swatch: ATHERA_THEME_PINK.accent },
  { href: `${DEV_BASE}/skeleton`, label: "Pink Skel", swatch: ATHERA_THEME_PINK.accent },
  { href: `${DEV_BASE}/cyan`, label: "Cyan", swatch: ATHERA_THEME_CYAN.accent },
  { href: `${DEV_BASE}/cyan/skeleton`, label: "Cyan Skel", swatch: ATHERA_THEME_CYAN.accent },
  { href: `${DEV_BASE}/lime`, label: "Lime", swatch: ATHERA_THEME_LIME.accent },
  { href: `${DEV_BASE}/lime/skeleton`, label: "Lime Skel", swatch: ATHERA_THEME_LIME.accent },
] as const
