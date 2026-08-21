import type { Entitlement, LicensePlanKey } from "@/lib/domain";
import { LICENSE_PLAN_VERSION } from "@/lib/license-plans";
import type { MaterialCatalogEntry, MaterialTier } from "@/materials";

export function isFreeMaterial(_material: MaterialCatalogEntry): boolean {
  // Materials are $0 — only screen templates are paid.
  return true;
}

/**
 * Whether a buyer plan unlocks a material's catalog tier.
 * Materials are free; screen purchases do not gate registry source.
 */
export function canAccessMaterial(
  _planKey: LicensePlanKey,
  _materialTier: MaterialTier,
): boolean {
  return true;
}

export function materialUnlockedByEntitlements(
  material: MaterialCatalogEntry,
  entitlements: Entitlement[],
): boolean {
  if (isFreeMaterial(material)) return true;

  return entitlements.some((e) => {
    if (e.status !== "active") return false;
    if (!canAccessMaterial(e.planKey, material.tier)) return false;
    if (e.materialScope.kind === "all") return true;
    return e.materialScope.materialSlugs.includes(material.slug);
  });
}

/** Demo entitlements for the account page — free SKUs only until checkout. */
export function getDemoEntitlements(email = "you@studio.dev"): Entitlement[] {
  return [
    {
      id: "ent_demo_free",
      orderId: null,
      userEmail: email,
      planKey: "free",
      licenseVersion: LICENSE_PLAN_VERSION,
      materialScope: { kind: "all" },
      status: "active",
      grantedAt: "2026-01-01T00:00:00.000Z",
      revokedAt: null,
    },
  ];
}

export function partitionCatalogByAccess(
  catalog: MaterialCatalogEntry[],
  entitlements: Entitlement[],
): {
  entitled: MaterialCatalogEntry[];
  locked: MaterialCatalogEntry[];
} {
  const entitled: MaterialCatalogEntry[] = [];
  const locked: MaterialCatalogEntry[] = [];

  for (const material of catalog) {
    if (materialUnlockedByEntitlements(material, entitlements)) {
      entitled.push(material);
    } else {
      locked.push(material);
    }
  }

  return { entitled, locked };
}
