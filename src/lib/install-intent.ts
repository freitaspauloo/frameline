/**
 * Fire-and-forget fake-install beacon (Discovery Gate G4).
 * Records CLI / copy-paste intent without blocking the copy UX.
 */
export function recordInstallIntent(payload: {
  slug: string;
  source?: string;
  path?: "cli" | "jsx" | "paste" | "prompt" | "code";
  /** Ties this copy to the registry or asset fetch it causes once pasted. */
  copyId?: string;
}) {
  const body = {
    slug: payload.slug,
    source: payload.source,
    path: payload.path,
    copyId: payload.copyId,
  };

  void fetch("/api/install", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    /* non-blocking */
  });
}
