import { createHash, randomBytes } from "node:crypto";

/** SHA-256 hex digest for registry bearer tokens. */
export function hashRegistryToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Mint a new registry bearer token (`fl_live_…`). */
export function mintRegistryToken(): string {
  return `fl_live_${randomBytes(18).toString("base64url")}`;
}

export function mintDemoRegistryToken(): string {
  return `fl_demo_${randomBytes(12).toString("base64url")}`;
}
