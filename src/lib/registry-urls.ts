import { appBaseUrl } from "@/lib/app-url";

/**
 * URL builders for links that end up inside copied code.
 *
 * Deliberately dependency-free (beyond the base URL) so both the registry
 * resolver and the copy payload builders can use them without importing each
 * other.
 */

function withCopyId(url: string, copyId?: string | null): string {
  if (!copyId) return url;
  return `${url}${url.includes("?") ? "&" : "?"}c=${encodeURIComponent(copyId)}`;
}

/** Public URL for a registry item — the one that belongs in copied code. */
export function registryUrl(slug: string, copyId?: string | null): string {
  return withCopyId(`${appBaseUrl()}/r/${slug}.json`, copyId);
}

/**
 * Hosted URL for a static asset, served by /a/[...path].
 * Takes the same path the asset has under `public/`, so `/screens/x/hero.mp4`
 * becomes `https://frameline.ai/a/screens/x/hero.mp4`.
 */
export function assetUrl(publicPath: string, copyId?: string | null): string {
  const clean = publicPath.startsWith("/") ? publicPath : `/${publicPath}`;
  return withCopyId(`${appBaseUrl()}/a${clean}`, copyId);
}

/** Media and font references inside screen source that we can host. */
const ASSET_REFERENCE =
  /\/(?:screens|fonts)\/[A-Za-z0-9._/-]+\.(?:mp4|webm|mov|png|jpe?g|webp|avif|gif|svg|woff2?|ttf|otf)/g;

/**
 * Point a screen's media at Frameline instead of the reader's empty `public/`.
 *
 * Two things fall out of this: the pasted screen renders immediately instead of
 * showing broken media until someone hand-places files, and the first render
 * tells us the code was pasted and run.
 */
export function rewriteAssetReferences(
  source: string,
  copyId?: string | null,
): string {
  return source.replace(ASSET_REFERENCE, (match) => assetUrl(match, copyId));
}

/**
 * shadcn-compatible install command.
 * The URL form needs no components.json setup, so it works on a cold machine
 * and carries the copy id that links the install back to the copy.
 */
export function installCommand(slug: string, copyId?: string | null): string {
  return `npx shadcn@latest add ${registryUrl(slug, copyId)}`;
}
