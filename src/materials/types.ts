import type { CSSProperties } from "react";

export type MaterialUseContext =
  | "hero"
  | "section"
  | "card"
  | "empty"
  | "loading"
  | "auth";

export type MaterialTier = "free" | "personal" | "team";

export type MaterialCatalogEntry = {
  slug: string;
  title: string;
  description: string;
  useContexts: MaterialUseContext[];
  tier: MaterialTier;
  tags: string[];
  /** CSS colors used for static / reduced-motion fallback */
  fallbackColors: string[];
};

export type MaterialSurfaceProps = {
  className?: string;
  style?: CSSProperties;
};
