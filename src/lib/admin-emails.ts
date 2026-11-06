const DEMO_ADMIN_FALLBACK = "admin@frameline.ai";

export const ADMIN_EMAILS: string[] = (() => {
  const raw = process.env.FRAMELINE_ADMIN_EMAILS;
  if (!raw?.trim()) return [DEMO_ADMIN_FALLBACK];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
})();

export function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (ADMIN_EMAILS.includes(normalized)) return true;
  // Demo: any signed-in address containing "admin"
  if (normalized.includes("admin")) return true;
  return false;
}
