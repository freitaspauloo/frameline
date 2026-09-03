import type { CSSProperties } from "react";

export type SupportHeroTheme = {
  id: "pink" | "lime" | "cyan";
  label: string;
  tint: string;
  accent: string;
  brand: string;
  accentRgb: string;
  skeletonBg: string;
};

export const SUPPORT_HERO_THEME_PINK: SupportHeroTheme = {
  id: "pink",
  label: "Reticle Pink",
  tint: "#D600BF",
  accent: "#FF4DA6",
  brand: "#A8006B",
  accentRgb: "255, 77, 166",
  skeletonBg: "linear-gradient(145deg, #0a1620 0%, #101820 38%, #0d1420 100%)",
};

export const SUPPORT_HERO_THEME_LIME: SupportHeroTheme = {
  id: "lime",
  label: "Lime Green",
  tint: "#84CC16",
  accent: "#A3E635",
  brand: "#3F6212",
  accentRgb: "163, 230, 53",
  skeletonBg: "linear-gradient(145deg, #0a1408 0%, #101a0c 38%, #0d1208 100%)",
};

export const SUPPORT_HERO_THEME_CYAN: SupportHeroTheme = {
  id: "cyan",
  label: "Cyan Blue",
  tint: "#00C8FF",
  accent: "#00C8FF",
  brand: "#1500BF",
  accentRgb: "0, 200, 255",
  skeletonBg: "linear-gradient(145deg, #0e2a3d 0%, #1a4a6a 38%, #061a2a 100%)",
};

export const SUPPORT_HERO_THEMES = {
  pink: SUPPORT_HERO_THEME_PINK,
  lime: SUPPORT_HERO_THEME_LIME,
  cyan: SUPPORT_HERO_THEME_CYAN,
} as const;

export const SUPPORT_HERO_PREVIEW_TABS = [
  { href: "/dev/support-hero", label: "Pink", swatch: SUPPORT_HERO_THEME_PINK.accent },
  {
    href: "/dev/support-hero/skeleton",
    label: "Pink Skel",
    swatch: SUPPORT_HERO_THEME_PINK.accent,
  },
  { href: "/dev/support-hero/lime", label: "Lime", swatch: SUPPORT_HERO_THEME_LIME.accent },
  {
    href: "/dev/support-hero/lime/skeleton",
    label: "Lime Skel",
    swatch: SUPPORT_HERO_THEME_LIME.accent,
  },
  { href: "/dev/support-hero/cyan", label: "Cyan", swatch: SUPPORT_HERO_THEME_CYAN.accent },
  {
    href: "/dev/support-hero/cyan/skeleton",
    label: "Cyan Skel",
    swatch: SUPPORT_HERO_THEME_CYAN.accent,
  },
] as const;

export function supportHeroThemeStyle(theme: SupportHeroTheme): CSSProperties {
  return {
    ["--sh-tint" as string]: theme.tint,
    ["--sh-accent" as string]: theme.accent,
    ["--sh-brand" as string]: theme.brand,
    ["--sh-accent-rgb" as string]: theme.accentRgb,
    ["--sh-skeleton-bg" as string]: theme.skeletonBg,
  };
}
