const DEMO_ADMIN_FALLBACK = "admin@frameline.ai";

export const ADMIN_EMAILS: string[] = (() => {
  const raw = process.env.FRAMELINE_ADMIN_EMAILS;
  if (!raw?.trim()) return [DEMO_ADMIN_FALLBACK];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
})();

/** Exact match against FRAMELINE_ADMIN_EMAILS (or the demo fallback). */
export function isListedAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return Boolean(normalized) && ADMIN_EMAILS.includes(normalized);
}

export function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (isListedAdminEmail(normalized)) return true;
  // Demo: any signed-in address containing "admin"
  if (normalized.includes("admin")) return true;
  return false;
}
