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

/** Public URL for a screen asset, served by /a/[...path]. */
export function assetUrl(
  slug: string,
  file: string,
  copyId?: string | null,
): string {
  return withCopyId(`${appBaseUrl()}/a/${slug}/${file}`, copyId);
}

/**
 * shadcn-compatible install command.
 * The URL form needs no components.json setup, so it works on a cold machine
 * and carries the copy id that links the install back to the copy.
 */
export function installCommand(slug: string, copyId?: string | null): string {
  return `npx shadcn@latest add ${registryUrl(slug, copyId)}`;
}
