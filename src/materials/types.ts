import type { CSSProperties } from "react";

export type MaterialUseContext =
  | "hero"
  | "section"
  | "card"
  | "empty"
  | "loading"
  | "auth";

export const MATERIAL_USE_CONTEXTS: {
  value: MaterialUseContext;
  label: string;
  description: string;
}[] = [
  {
    value: "hero",
    label: "Hero",
    description:
      "Full-bleed first-viewport surfaces that hold brand and a clear CTA.",
  },
  {
    value: "section",
    label: "Section",
    description:
      "Band and strip materials for marketing sections and mid-page atmosphere.",
  },
  {
    value: "card",
    label: "Card",
    description:
      "Quiet fields for cards, panels, and compact product surfaces.",
  },
  {
    value: "empty",
    label: "Empty",
    description:
      "Empty-state textures that feel intentional without stealing focus.",
  },
  {
    value: "loading",
    label: "Loading",
    description:
      "Loading shells and progress-adjacent surfaces with calm motion.",
  },
  {
    value: "auth",
    label: "Auth",
    description:
      "Sign-in and account shells — atmosphere without competing with forms.",
  },
];

export function isMaterialUseContext(
  value: string,
): value is MaterialUseContext {
  return MATERIAL_USE_CONTEXTS.some((c) => c.value === value);
}

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
  /** How the live surface is drawn */
  renderingTechnique?: "webgl" | "css";
  /** Short note on GPU cost / when to prefer static */
  perfNotes?: string;
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
