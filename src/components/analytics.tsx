import Script from "next/script";

/**
 * Optional Plausible analytics. No-op unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  if (!domain) return null;

  return (
    <Script
      async
      data-domain={domain}
      defer
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
