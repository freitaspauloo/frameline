import type {
  PRESET_BASE_COLORS,
  PRESET_CHART_COLORS,
  PRESET_FONT_HEADINGS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRESET_STYLES,
  PRESET_THEMES,
  PresetConfig,
} from "shadcn/preset";
import {
  DEFAULT_PRESET_CONFIG,
  PRESET_BASE_COLORS as BASE_COLORS,
  PRESET_CHART_COLORS as CHART_COLORS,
  PRESET_FONT_HEADINGS as FONT_HEADINGS,
  PRESET_FONTS as FONTS,
  PRESET_ICON_LIBRARIES as ICON_LIBRARIES,
  PRESET_MENU_ACCENTS as MENU_ACCENTS,
  PRESET_MENU_COLORS as MENU_COLORS,
  PRESET_RADII as RADII,
  PRESET_STYLES as STYLES,
  PRESET_THEMES as THEMES,
} from "shadcn/preset";

export type InferencePresetConfig = PresetConfig;

export const INFERENCE_DEFAULT_PRESET: InferencePresetConfig = {
  ...DEFAULT_PRESET_CONFIG,
  style: "nova",
  baseColor: "neutral",
  theme: "neutral",
  chartColor: "neutral",
  iconLibrary: "lucide",
  font: "inter",
  fontHeading: "inherit",
  radius: "default",
  menuAccent: "subtle",
  menuColor: "default",
};

export const STYLE_OPTIONS = STYLES.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const BASE_COLOR_OPTIONS = BASE_COLORS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const THEME_OPTIONS = THEMES.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const CHART_COLOR_OPTIONS = CHART_COLORS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const FONT_OPTIONS = FONTS.map((value) => ({
  label: value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
  value,
}));

export const FONT_HEADING_OPTIONS = FONT_HEADINGS.map((value) => ({
  label:
    value === "inherit"
      ? "Inherit"
      : value
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
  value,
}));

export const ICON_LIBRARY_OPTIONS = ICON_LIBRARIES.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const RADIUS_OPTIONS = RADII.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const MENU_ACCENT_OPTIONS = MENU_ACCENTS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const MENU_COLOR_OPTIONS = MENU_COLORS.map((value) => ({
  label: value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
  value,
}));

/** Themes available for a given base color (matches shadcn create). */
export function themesForBaseColor(baseColor: InferencePresetConfig["baseColor"]) {
  return THEME_OPTIONS.filter(
    (option) =>
      option.value === baseColor || !BASE_COLORS.includes(option.value as (typeof BASE_COLORS)[number]),
  );
}

export type InferencePresetField = keyof InferencePresetConfig;

export {
  BASE_COLORS,
  CHART_COLORS,
  FONT_HEADINGS,
  FONTS,
  ICON_LIBRARIES,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  THEMES,
};

export type {
  PRESET_BASE_COLORS,
  PRESET_CHART_COLORS,
  PRESET_FONT_HEADINGS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRESET_STYLES,
  PRESET_THEMES,
};
