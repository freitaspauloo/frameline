import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { getMaterial } from "@/materials";
import { isFreeMaterial } from "@/lib/entitlements";

/**
 * Registry read stub (WP6 / WP9).
 * Free materials return the real component source from disk when available.
 * Paid materials return 403 until a Bearer fl_demo_ / fl_live_ token is present.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const material = getMaterial(slug);

  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  const free = isFreeMaterial(material);

  if (!free) {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json(
        {
          error: "Entitlement required",
          message:
            "Paid registry sources require a Frameline access token. Purchase a license, then pass Authorization: Bearer <token>.",
        },
        { status: 403 },
      );
    }
    if (!token.startsWith("fl_demo_") && !token.startsWith("fl_live_")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  }

  const componentPath = `src/materials/${material.slug}.tsx`;
  const targetPath = `components/${material.slug}.tsx`;

  let content: string;
  let status: string;

  if (free) {
    const diskPath = path.join(process.cwd(), "src/materials", `${material.slug}.tsx`);
    try {
      content = await readFile(diskPath, "utf8");
      status = "source-free";
    } catch {
      content = placeholderContent(material.title, material.slug, componentPath);
      status = "stub-free";
    }
  } else {
    content = placeholderContent(material.title, material.slug, componentPath);
    status = "stub-entitled";
  }

  return NextResponse.json({
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
      install: `npx shadcn@latest add @frameline/${material.slug}`,
      sourceHint: componentPath,
      status,
    },
  });
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
    ` * Install hint: npx shadcn@latest add @frameline/${slug}`,
    ` */`,
    ``,
    `export function ${toPascalCase(slug)}() {`,
    `  return null;`,
    `}`,
    ``,
  ].join("\n");
}

function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
