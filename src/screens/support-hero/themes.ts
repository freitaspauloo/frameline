import type { SupportHeroTheme } from "./accents";
import { SUPPORT_HERO_DEV_BASE } from "./constants";

export type { SupportHeroTheme };

export const SUPPORT_HERO_THEMES: SupportHeroTheme[] = ["pink", "lime", "cyan"];

const DEV_BASE = SUPPORT_HERO_DEV_BASE.replace("https://frameline.ai", "");

export function themeHeroPath(theme: SupportHeroTheme) {
  if (theme === "pink") return DEV_BASE;
  return `${DEV_BASE}/${theme}`;
}

export function themeSkeletonPath(theme: SupportHeroTheme) {
  if (theme === "pink") return `${DEV_BASE}/skeleton`;
  return `${DEV_BASE}/${theme}/skeleton`;
}

export const SUPPORT_HERO_PREVIEW_TABS = [
  { href: `${DEV_BASE}/skeleton`, label: "Pink Skel", swatch: "#D600BF" },
  { href: `${DEV_BASE}/lime/skeleton`, label: "Lime Skel", swatch: "#84CC16" },
  { href: `${DEV_BASE}/cyan/skeleton`, label: "Cyan Skel", swatch: "#06B6D4" },
  { href: DEV_BASE, label: "Pink Live", swatch: "#D600BF", devOnly: true },
  { href: `${DEV_BASE}/lime`, label: "Lime Live", swatch: "#84CC16", devOnly: true },
  { href: `${DEV_BASE}/cyan`, label: "Cyan Live", swatch: "#06B6D4", devOnly: true },
] as const;
