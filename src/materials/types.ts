import type { CSSProperties } from "react";

export type MaterialUseContext =
  | "hero"
  | "section"
  | "card"
  | "empty"
  | "loading"
  | "auth";

export type MaterialTier = "free" | "personal" | "team";

/** Browse hubs on the marketing site — maps to Grainient-style category tiles. */
export type MaterialType = "mesh" | "dither" | "grain";

export type MaterialCatalogEntry = {
  slug: string;
  title: string;
  description: string;
  type: MaterialType;
  useContexts: MaterialUseContext[];
  tier: MaterialTier;
  tags: string[];
  /** CSS colors used for static / reduced-motion fallback */
  fallbackColors: string[];
};

export type MaterialCollection = {
  slug: string;
  title: string;
  description: string;
  /** Featured on homepage “Popular collections” */
  featured?: boolean;
  materialSlugs: string[];
};

export type MaterialSurfaceProps = {
  className?: string;
  style?: CSSProperties;
};
