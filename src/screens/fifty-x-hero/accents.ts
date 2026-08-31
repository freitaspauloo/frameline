export type ForgeAiAccent = {
  id: "blue" | "pink" | "lime";
  brand: string;
  accent: string;
  rgb: string;
  /** Full-screen color blend over the hero plate (pink / lime variants). */
  tint?: string;
};

export const FORGEAI_BLUE: ForgeAiAccent = {
  id: "blue",
  brand: "#1500BF",
  accent: "#3567FF",
  rgb: "53, 103, 255",
};

/** Magenta tint — login pill stays dark enough for white label text. */
export const FORGEAI_PINK: ForgeAiAccent = {
  id: "pink",
  brand: "#A8006B",
  accent: "#FF4DA6",
  rgb: "255, 77, 166",
  tint: "#D600BF",
};

/** Lime tint — deep green brand for contrast on white CTAs. */
export const FORGEAI_LIME: ForgeAiAccent = {
  id: "lime",
  brand: "#3F6212",
  accent: "#A3E635",
  rgb: "163, 230, 53",
  tint: "#84CC16",
};

export function forgeAiAccentStyle(accent: ForgeAiAccent): Record<string, string> {
  return {
    "--fx-brand": accent.brand,
    "--fx-accent": accent.accent,
    "--fx-accent-rgb": accent.rgb,
  };
}
