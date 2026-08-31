"use client";

import { useEffect } from "react";

/**
 * Dialogs, menus and tooltips portal to <body>, outside this route's `dark`
 * wrapper, so the theme class has to sit on <html> for as long as the
 * playground is mounted. Restores whatever was there on the way out.
 */
export function InferenceDarkScope() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      return;
    }

    root.classList.add("dark");
    return () => root.classList.remove("dark");
  }, []);

  return null;
}
