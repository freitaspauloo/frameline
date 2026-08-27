"use client";

import { useLayoutEffect, useRef } from "react";

import { useInferenceTheme } from "@/app/inference/_components/theme/theme-provider";

function toCustomProp(key: string) {
  return key.startsWith("--") ? key : `--${key}`;
}

/**
 * Pushes playground theme tokens onto <html> so Tailwind semantic colors
 * (bg-primary, bg-background, …) and portaled popovers all pick them up.
 * globals.css defines .dark vars on :root; inline properties win over those.
 */
export function InferenceThemeScope() {
  const { themeVars } = useInferenceTheme();
  const addedDarkClass = useRef(false);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!root.classList.contains("dark")) {
      root.classList.add("dark");
      addedDarkClass.current = true;
    }

    const keys = Object.keys(themeVars);
    for (const key of keys) {
      root.style.setProperty(toCustomProp(key), themeVars[key]!);
    }

    return () => {
      for (const key of keys) {
        root.style.removeProperty(toCustomProp(key));
      }
      if (addedDarkClass.current) {
        root.classList.remove("dark");
        addedDarkClass.current = false;
      }
    };
  }, [themeVars]);

  return null;
}
