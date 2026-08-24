import { timingSafeEqual } from "node:crypto";

import { isAdminEmail, resolveDemoUser } from "@/lib/auth";

/**
 * The thumbnail studio writes into `public/` and `src/`, so it only exists
 * where the working tree is writable — a machine with `FRAMELINE_STUDIO_TOKEN`
 * set. Deployments leave the token unset and the route 404s.
 */
export function getStudioToken(): string | undefined {
  const token = process.env.FRAMELINE_STUDIO_TOKEN?.trim();
  return token ? token : undefined;
}

export function isStudioEnabled(): boolean {
  return getStudioToken() !== undefined;
}

function matchesToken(candidate: string, token: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** A shared link key, or a signed-in admin on the same machine, unlocks it. */
export async function isStudioAuthorized(
  candidateKey: string | undefined,
): Promise<boolean> {
  const token = getStudioToken();
  if (!token) return false;

  if (candidateKey && matchesToken(candidateKey, token)) return true;

  const user = await resolveDemoUser();
  return Boolean(user && user.role === "admin" && isAdminEmail(user.email));
}
