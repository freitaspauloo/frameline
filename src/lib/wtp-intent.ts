/**
 * Fire-and-forget WTP intent beacon. Never throws into the UI path.
 */
export function recordWtpIntent(payload: {
  plan: string;
  material?: string | null;
  email?: string | null;
  source?: string;
}) {
  const body = {
    plan: payload.plan,
    material: payload.material || undefined,
    email: payload.email || undefined,
    source: payload.source,
  };

  void fetch("/api/intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    /* non-blocking */
  });
}
