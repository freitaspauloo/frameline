import { installCommand } from "@/lib/registry-urls";

import { getMaterialComponentName } from "./component-names";

/** JSX usage for a material with the configurator's current props. */
export function buildJsxSnippet(slug: string, props: Record<string, unknown>) {
  const entries = Object.entries(props).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  const propsStr = entries
    .map(([k, v]) => {
      if (typeof v === "number") return `  ${k}={${v}}`;
      if (typeof v === "boolean") return v ? `  ${k}` : null;
      if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
      return `  ${k}=${JSON.stringify(String(v))}`;
    })
    .filter(Boolean)
    .join("\n");

  const name = getMaterialComponentName(slug);

  return `import { ${name} } from "@/materials";\n\n<${name}\n${propsStr}\n  className="absolute inset-0"\n/>`;
}

/** Brief for an AI coding tool: install the material, then render it as tuned. */
export function buildMaterialPrompt(
  slug: string,
  title: string,
  props: Record<string, unknown>,
) {
  return [
    `Add the Frameline "${title}" material to this project as a full-bleed background.`,
    "",
    `1. Install it: ${installCommand(slug)}`,
    "2. Render it inside a relatively positioned container, behind the content, with exactly these props:",
    "",
    buildJsxSnippet(slug, props),
    "",
    "Keep the props as given — they come from the live configurator on frameline.ai.",
  ].join("\n");
}
