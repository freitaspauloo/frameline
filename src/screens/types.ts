export type ScreenTier = "paid";

export type ScreenCatalogEntry = {
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  priceLabel: string;
  tier: ScreenTier;
  /** Short tagline for index cards */
  blurb: string;
  poster: string;
  /** Previous product slugs that still resolve to this layout. */
  aliases?: readonly string[];
};

export type ScreenCopyPath = "prompt" | "code";
