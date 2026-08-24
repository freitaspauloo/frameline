import { readFile } from "node:fs/promises";
import path from "node:path";

import { appBaseUrl } from "@/lib/app-url";
import type { Entitlement } from "@/lib/domain";
import { canAccessMaterial, isFreeMaterial } from "@/lib/entitlements";
import { resolveRegistryToken } from "@/lib/fulfillment";
import { assetUrl, installCommand } from "@/lib/registry-urls";
import { getMaterial } from "@/materials";
import { getScreenBySlug } from "@/screens/catalog";
import { getScreenFileSpec } from "@/screens/copy-payload";

/**
 * Shared resolver behind both registry endpoints.
 *
 * /r/{name}.json is the URL the install docs advertise and the one embedded in
 * copied payloads; /api/registry/{slug} is the original path kept for
 * compatibility. Both must serve byte-identical bodies, so the logic lives here.
 */

export type RegistryOutcome =
  | { ok: true; status: 200; kind: "material" | "screen"; body: unknown }
  | { ok: false; status: number; body: unknown };

export type RegistryRequest = {
  slug: string;
  /** Bearer token from the Authorization header, if any. */
  token?: string | null;
  /** Correlation id minted when the payload was copied. */
  copyId?: string | null;
};

function entitlementCoversSlug(entitlement: Entitlement, slug: string): boolean {
  const scope = entitlement.materialScope;
  if (scope.kind === "all") return true;
  return scope.materialSlugs.includes(slug);
}

function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function placeholderContent(
  title: string,
  slug: string,
  componentPath: string,
): string {
  return [
    `/**`,
    ` * Frameline registry stub — ${title}`,
    ` *`,
    ` * Copy the real source from the Frameline repo:`,
    ` *   ${componentPath}`,
    ` *`,
    ` * Then wire imports for MaterialShell / shader deps as in that file.`,
    ` * Install hint: ${installCommand(slug)}`,
    ` */`,
    ``,
    `export function ${toPascalCase(slug)}() {`,
    `  return null;`,
    `}`,
    ``,
  ].join("\n");
}

async function readSource(relativePath: string): Promise<string | null> {
  try {
    return await readFile(path.join(process.cwd(), relativePath), "utf8");
  } catch {
    return null;
  }
}

async function resolveMaterial(
  slug: string,
  request: RegistryRequest,
): Promise<RegistryOutcome> {
  const material = getMaterial(slug);
  if (!material) return { ok: false, status: 404, body: { error: "Not found" } };

  const free = isFreeMaterial(material);

  if (!free) {
    const token = request.token?.trim();
    if (!token) {
      return {
        ok: false,
        status: 403,
        body: {
          error: "Entitlement required",
          message:
            "Paid registry sources require a Frameline access token. Purchase a license, then pass Authorization: Bearer <token>.",
        },
      };
    }

    const resolved = await resolveRegistryToken(token);
    if (!resolved) {
      return { ok: false, status: 403, body: { error: "Invalid token" } };
    }

    const allowed =
      canAccessMaterial(resolved.entitlement.planKey, material.tier) &&
      entitlementCoversSlug(resolved.entitlement, material.slug);

    if (!allowed) {
      return {
        ok: false,
        status: 403,
        body: {
          error: "Not entitled",
          message: "This token does not unlock this material.",
        },
      };
    }
  }

  const componentPath = `src/materials/${material.slug}.tsx`;
  const targetPath = `components/${material.slug}.tsx`;
  const source = await readSource(componentPath);
  const content =
    source ?? placeholderContent(material.title, material.slug, componentPath);
  const status = source
    ? free
      ? "source-free"
      : "source-entitled"
    : free
      ? "stub-free"
      : "stub-entitled";

  return {
    ok: true,
    status: 200,
    kind: "material",
    body: {
      name: material.slug,
      type: "registry:ui",
      title: material.title,
      description: material.description,
      dependencies: [],
      registryDependencies: [],
      files: [
        {
          path: targetPath,
          type: "registry:component",
          target: targetPath,
          content,
        },
      ],
      meta: {
        tier: material.tier,
        framelineType: material.type,
        registry: `@frameline/${material.slug}`,
        install: installCommand(material.slug, request.copyId),
        sourceHint: componentPath,
        status,
      },
    },
  };
}

async function resolveScreen(
  slug: string,
  request: RegistryRequest,
): Promise<RegistryOutcome> {
  const entry = getScreenBySlug(slug);
  if (!entry) return { ok: false, status: 404, body: { error: "Not found" } };

  const spec = getScreenFileSpec(slug);
  const canonical = entry.slug;

  // Screens are the paid product, so the manifest never ships source unless the
  // caller holds an entitlement. Unauthenticated callers get the shape of the
  // work — file list, install note, asset URLs — which is what an agent needs
  // to plan, and what makes this URL worth fetching in the first place.
  let entitled = false;
  const token = request.token?.trim();
  if (token) {
    const resolved = await resolveRegistryToken(token);
    if (
      resolved &&
      (resolved.entitlement.planKey === "screen" ||
        resolved.entitlement.planKey === "screen_year" ||
        resolved.entitlement.planKey === "screen_lifetime") &&
      entitlementCoversSlug(resolved.entitlement, canonical)
    ) {
      entitled = true;
    }
  }

  const files = await Promise.all(
    (spec?.files ?? []).map(async (relativePath) => ({
      path: relativePath,
      type: "registry:component" as const,
      ...(entitled ? { content: (await readSource(relativePath)) ?? "" } : {}),
    })),
  );

  return {
    ok: true,
    status: 200,
    kind: "screen",
    body: {
      name: canonical,
      type: "registry:screen",
      title: entry.title,
      description: entry.description,
      files,
      meta: {
        tier: entry.tier,
        price: entry.priceLabel,
        entitled,
        note: spec?.note ?? null,
        poster: assetUrl(entry.poster, request.copyId),
        detail: `${appBaseUrl()}/materials/${canonical}`,
        ...(entitled
          ? {}
          : {
              message:
                "Screen source requires a license. Pass Authorization: Bearer <token> to receive file contents.",
              purchase: `${appBaseUrl()}/checkout?plan=screen&material=${canonical}`,
            }),
      },
    },
  };
}

/** Resolve a material or screen by slug. Materials win on a name collision. */
export async function resolveRegistryItem(
  request: RegistryRequest,
): Promise<RegistryOutcome> {
  const slug = request.slug.trim().replace(/\.json$/i, "");
  if (!slug) return { ok: false, status: 404, body: { error: "Not found" } };

  if (getMaterial(slug)) return resolveMaterial(slug, request);
  if (getScreenBySlug(slug)) return resolveScreen(slug, request);

  return {
    ok: false,
    status: 404,
    body: { error: "Material or screen not found", slug },
  };
}

/** Extract a Bearer token from an Authorization header. */
export function bearerToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}
