/** Domain types aligned with PRD §10 — mirrored by prisma/schema.prisma. */

export type MaterialStatus = "draft" | "published" | "unpublished";

export type OrderStatus = "pending" | "paid" | "refunded";

export type LicensePlanKey =
  | "free"
  | "test"
  | "static"
  | "personal"
  | "team"
  | "screen"
  | "screen_year";

export type EntitlementStatus = "active" | "revoked";

export type MaterialScope =
  | { kind: "all" }
  | { kind: "set"; materialSlugs: string[] };

export type Entitlement = {
  id: string;
  orderId: string | null;
  userEmail: string;
  planKey: LicensePlanKey;
  licenseVersion: string;
  materialScope: MaterialScope;
  status: EntitlementStatus;
  grantedAt: string;
  revokedAt: string | null;
};

export type RegistryToken = {
  id: string;
  userEmail: string;
  /** Store hashes only in production; demo may use a redacted display value. */
  tokenHash: string;
  entitlementId: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type EmailCaptureSource =
  | "free_install"
  | "waitlist"
  | "newsletter";

export type EmailCapture = {
  email: string;
  source: EmailCaptureSource;
  consent: boolean;
  createdAt: string;
};

export type UserRole = "buyer" | "admin";

export type DomainUser = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type Order = {
  id: string;
  email: string;
  userId: string | null;
  paymentProviderRef: string | null;
  status: OrderStatus;
  planKey: LicensePlanKey;
  licenseVersion: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  refundedAt?: string | null;
  canceledAt?: string | null;
};
