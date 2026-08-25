/** Screens whose catalog posters need the Reticle magenta color blend. */
export const MAGENTA_POSTER_SLUGS = new Set([
  "dark-pill-hero",
  "spaceman-moon",
]);

export function screenPosterNeedsMagentaTint(slug: string): boolean {
  return MAGENTA_POSTER_SLUGS.has(slug);
}
