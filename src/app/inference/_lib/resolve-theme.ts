import type { CSSProperties } from "react";

import themeRegistry from "@/app/inference/_data/shadcn-theme-registry.json";

import type { InferencePresetConfig } from "./preset-config";

type CssVarMap = Record<string, string>;

const RADIUS_VALUES: Record<string, string> = {
  default: "0.625rem",
  none: "0",
  small: "0.45rem",
  medium: "0.625rem",
  large: "0.875rem",
};

const FONT_FAMILIES: Record<string, string> = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  "noto-sans": "'Noto Sans', ui-sans-serif, system-ui, sans-serif",
  "nunito-sans": "'Nunito Sans', ui-sans-serif, system-ui, sans-serif",
  figtree: "'Figtree', ui-sans-serif, system-ui, sans-serif",
  roboto: "'Roboto', ui-sans-serif, system-ui, sans-serif",
  raleway: "'Raleway', ui-sans-serif, system-ui, sans-serif",
  "dm-sans": "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  "public-sans": "'Public Sans', ui-sans-serif, system-ui, sans-serif",
  outfit: "'Outfit', ui-sans-serif, system-ui, sans-serif",
  "jetbrains-mono": "'JetBrains Mono', ui-monospace, monospace",
  geist: "var(--font-geist-sans, 'Geist', ui-sans-serif, system-ui, sans-serif)",
  "geist-mono": "var(--font-geist-mono, 'Geist Mono', ui-monospace, monospace)",
  lora: "'Lora', ui-serif, Georgia, serif",
  merriweather: "'Merriweather', ui-serif, Georgia, serif",
  "playfair-display": "'Playfair Display', ui-serif, Georgia, serif",
  "noto-serif": "'Noto Serif', ui-serif, Georgia, serif",
  "roboto-slab": "'Roboto Slab', ui-serif, Georgia, serif",
  oxanium: "'Oxanium', ui-sans-serif, system-ui, sans-serif",
  manrope: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  "space-grotesk": "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  montserrat: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
  "ibm-plex-sans": "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
  "source-sans-3": "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
  "instrument-sans": "'Instrument Sans', ui-sans-serif, system-ui, sans-serif",
  "eb-garamond": "'EB Garamond', ui-serif, Georgia, serif",
  "instrument-serif": "'Instrument Serif', ui-serif, Georgia, serif",
  "libre-baskerville": "'Libre Baskerville', ui-serif, Georgia, serif",
  "dm-serif-display": "'DM Serif Display', ui-serif, Georgia, serif",
  "source-serif-4": "'Source Serif 4', ui-serif, Georgia, serif",
  "libre-franklin": "'Libre Franklin', ui-sans-serif, system-ui, sans-serif",
  "pt-serif": "'PT Serif', ui-serif, Georgia, serif",
  "ibm-plex-serif": "'IBM Plex Serif', ui-serif, Georgia, serif",
  "ibm-plex-mono": "'IBM Plex Mono', ui-monospace, monospace",
  "source-code-pro": "'Source Code Pro', ui-monospace, monospace",
  "fira-code": "'Fira Code', ui-monospace, monospace",
  "roboto-mono": "'Roboto Mono', ui-monospace, monospace",
  "space-mono": "'Space Mono', ui-monospace, monospace",
  "red-hat-mono": "'Red Hat Mono', ui-monospace, monospace",
  "fragment-mono": "'Fragment Mono', ui-monospace, monospace",
  "geist-pixel-square": "var(--font-geist-pixel-square, monospace)",
  "geist-pixel-circle": "var(--font-geist-pixel-circle, monospace)",
  "geist-pixel-line": "var(--font-geist-pixel-line, monospace)",
  "geist-pixel-grid": "var(--font-geist-pixel-grid, monospace)",
  "geist-pixel-triangle": "var(--font-geist-pixel-triangle, monospace)",
};

function mergeVars(base: CssVarMap, overlay: CssVarMap): CssVarMap {
  return { ...base, ...overlay };
}

function applyChartOverride(
  vars: CssVarMap,
  chartThemeName: string,
  mode: "light" | "dark",
): CssVarMap {
  const chartTheme =
    themeRegistry.themes[chartThemeName as keyof typeof themeRegistry.themes];
  if (!chartTheme) {
    return vars;
  }

  const next = { ...vars };
  const chartVars = chartTheme[mode] as Record<string, string>;
  for (let index = 1; index <= 5; index += 1) {
    const key = `chart-${index}`;
    if (chartVars[key]) {
      next[key] = chartVars[key];
    }
  }
  return next;
}

function applyMenuAccent(vars: CssVarMap, menuAccent: InferencePresetConfig["menuAccent"]) {
  if (menuAccent !== "bold") {
    return vars;
  }

  return {
    ...vars,
    accent: vars.primary ?? vars.accent,
    "accent-foreground":
      vars["primary-foreground"] ?? vars["accent-foreground"],
  };
}

/** Resolve dark-mode CSS variables for the inference sandbox. */
export function resolveInferenceThemeVars(
  config: InferencePresetConfig,
): CssVarMap {
  const base =
    themeRegistry.bases[config.baseColor as keyof typeof themeRegistry.bases];
  const theme =
    themeRegistry.themes[config.theme as keyof typeof themeRegistry.themes];

  if (!base?.dark) {
    return {};
  }

  let vars = mergeVars(base.dark, theme?.dark ?? {});

  vars = applyChartOverride(
    vars,
    config.chartColor ?? config.theme,
    "dark",
  );
  vars = applyMenuAccent(vars, config.menuAccent);

  const radius = RADIUS_VALUES[config.radius];
  if (radius && config.radius !== "default") {
    vars.radius = radius;
  }

  const fontFamily = FONT_FAMILIES[config.font] ?? FONT_FAMILIES.inter;
  const headingFamily =
    config.fontHeading === "inherit"
      ? fontFamily
      : (FONT_FAMILIES[config.fontHeading] ?? fontFamily);

  return {
    ...vars,
    "--font-sans": fontFamily,
    "--font-heading": headingFamily,
  };
}

export function varsToStyle(vars: CssVarMap): CSSProperties {
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    style[key.startsWith("--") ? key : `--${key}`] = value;
  }
  return style as CSSProperties;
}

export function themeSwatchColor(vars: CssVarMap) {
  return vars.primary ?? vars["sidebar-primary"] ?? "oklch(0.7 0 0)";
}
