#!/usr/bin/env node
/**
 * Lightweight smoke checks — no Playwright, no server required for unit path.
 *
 * Optional live checks when SMOKE_BASE_URL is set:
 *   SMOKE_BASE_URL=http://localhost:3000 pnpm smoke
 */

import { runCatalogSmoke } from "./smoke-catalog.mjs";

function fail(message) {
  console.error(`FAIL  ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`ok    ${message}`);
}

async function runUnit() {
  console.log("— unit (catalog / plans / collections) —");
  try {
    const summary = runCatalogSmoke();
    ok(
      `catalog=${summary.catalog} free=${summary.free} collections=${summary.collections} plans=${summary.plans.join(",")}`,
    );
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }
}

async function runLive(baseUrl) {
  console.log(`— live (${baseUrl}) —`);
  const root = baseUrl.replace(/\/$/, "");

  async function check(label, fn) {
    try {
      await fn();
      ok(label);
    } catch (err) {
      fail(`${label}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  await check("GET /api/registry/aurora-mesh → 200", async () => {
    const res = await fetch(`${root}/api/registry/aurora-mesh`);
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
  });

  await check("GET /api/registry/ember-warp → 403", async () => {
    const res = await fetch(`${root}/api/registry/ember-warp`);
    if (res.status !== 403) {
      throw new Error(`expected 403, got ${res.status}`);
    }
  });

  await check("POST /api/checkout (demo) → 200", async () => {
    const res = await fetch(`${root}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: "personal",
        email: "smoke@frameline.test",
        material: "aurora-mesh",
      }),
    });
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`checkout not ok: ${JSON.stringify(data)}`);
    }
  });

  await check("POST /api/intent → 200", async () => {
    const res = await fetch(`${root}/api/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: "personal",
        source: "smoke",
        material: "aurora-mesh",
      }),
    });
    if (res.status !== 200) {
      throw new Error(`expected 200, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`intent not ok: ${JSON.stringify(data)}`);
    }
  });
}

const baseUrl = process.env.SMOKE_BASE_URL?.trim();

await runUnit();
if (baseUrl) {
  await runLive(baseUrl);
} else {
  console.log("skip  live checks (set SMOKE_BASE_URL to enable)");
}

if (process.exitCode) {
  console.error("\nSmoke failed.");
  process.exit(process.exitCode);
}

console.log("\nSmoke passed.");
