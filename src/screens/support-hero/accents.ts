export type SupportHeroTheme = "pink" | "lime" | "cyan";

export type SupportHeroAccent = {
  id: SupportHeroTheme;
  label: string;
  swatch: string;
  tint: string;
  accent: string;
  accentRgb: string;
  ink: string;
};

export const SUPPORT_HERO_PINK: SupportHeroAccent = {
  id: "pink",
  label: "Reticle Pink",
  swatch: "#D600BF",
  tint: "#D600BF",
  accent: "#D600BF",
  accentRgb: "214, 0, 191",
  ink: "#10121c",
};

export const SUPPORT_HERO_LIME: SupportHeroAccent = {
  id: "lime",
  label: "Lime Green",
  swatch: "#84CC16",
  tint: "#84CC16",
  accent: "#A3E635",
  accentRgb: "163, 230, 53",
  ink: "#10121c",
};

export const SUPPORT_HERO_CYAN: SupportHeroAccent = {
  id: "cyan",
  label: "Cyan Blue",
  swatch: "#06B6D4",
  tint: "#06B6D4",
  accent: "#22D3EE",
  accentRgb: "6, 182, 212",
  ink: "#10121c",
};

export const SUPPORT_HERO_ACCENTS: Record<SupportHeroTheme, SupportHeroAccent> = {
  pink: SUPPORT_HERO_PINK,
  lime: SUPPORT_HERO_LIME,
  cyan: SUPPORT_HERO_CYAN,
};

export function getSupportHeroAccent(theme: SupportHeroTheme = "pink") {
  return SUPPORT_HERO_ACCENTS[theme];
}
