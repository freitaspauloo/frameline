import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { nanoid } from "nanoid";

import type { Entitlement, Order, RegistryToken } from "@/lib/domain";
import {
  getLicensePlan,
  LICENSE_PLAN_VERSION,
  type CheckoutPlanKey,
} from "@/lib/license-plans";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_PATH = path.join(DATA_DIR, "orders.json");
const ENTITLEMENTS_PATH = path.join(DATA_DIR, "entitlements.json");

/** Demo order row — domain Order plus install metadata. */
export type DemoOrder = Order & {
  materialSlug: string | null;
  registryToken: string;
  entitlementId: string;
};

export type DemoEntitlementStore = {
  entitlements: Entitlement[];
  tokens: RegistryToken[];
};

export type FulfillInput = {
  email: string;
  plan: CheckoutPlanKey;
  material?: string;
  /** When set, retries with the same ref return the existing order. */
  paymentProviderRef?: string | null;
};

export type FulfillResult = {
  orderId: string;
  registryToken: string;
  entitlementId: string;
  created: boolean;
  order: DemoOrder;
};

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readDemoOrders(): Promise<DemoOrder[]> {
  const parsed = await readJsonFile<unknown>(ORDERS_PATH, []);
  return Array.isArray(parsed) ? (parsed as DemoOrder[]) : [];
}

export async function readDemoEntitlements(): Promise<DemoEntitlementStore> {
  const parsed = await readJsonFile<Partial<DemoEntitlementStore>>(
    ENTITLEMENTS_PATH,
    { entitlements: [], tokens: [] },
  );
  return {
    entitlements: Array.isArray(parsed.entitlements) ? parsed.entitlements : [],
    tokens: Array.isArray(parsed.tokens) ? parsed.tokens : [],
  };
}

export async function getDemoOrderById(
  id: string,
): Promise<DemoOrder | undefined> {
  const orders = await readDemoOrders();
  return orders.find((o) => o.id === id);
}

/** Prefer exact id; otherwise latest paid order for email (+ optional plan). */
export async function findDemoOrder(opts: {
  id?: string;
  email?: string;
  plan?: string;
}): Promise<DemoOrder | undefined> {
  if (opts.id) {
    const byId = await getDemoOrderById(opts.id);
    if (byId) return byId;
  }

  const email = opts.email?.trim().toLowerCase();
  if (!email) return undefined;

  const orders = await readDemoOrders();
  const plan = opts.plan?.trim().toLowerCase();
  const matches = orders
    .filter((o) => {
      if (o.email !== email) return false;
      if (plan && o.planKey !== plan) return false;
      return o.status === "paid";
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return matches[0];
}

function materialScopeForPlan(
  plan: CheckoutPlanKey,
  material?: string,
): Entitlement["materialScope"] {
  if (plan === "static" && material) {
    return { kind: "set", materialSlugs: [material] };
  }
  return { kind: "all" };
}

/**
 * Idempotent demo fulfillment — writes `.data/orders.json` + `.data/entitlements.json`.
 * Grants entitlement and mints `fl_demo_<nanoid>` registry token.
 */
export async function fulfillDemoOrder(
  input: FulfillInput,
): Promise<FulfillResult> {
  const email = input.email.trim().toLowerCase();
  const plan = input.plan;
  const material = input.material?.trim() || undefined;
  const paymentProviderRef = input.paymentProviderRef?.trim() || null;

  const orders = await readDemoOrders();

  if (paymentProviderRef) {
    const existing = orders.find(
      (o) => o.paymentProviderRef === paymentProviderRef,
    );
    if (existing) {
      return {
        orderId: existing.id,
        registryToken: existing.registryToken,
        entitlementId: existing.entitlementId,
        created: false,
        order: existing,
      };
    }
  }

  const license = getLicensePlan(plan);
  const amountCents = license?.amountCents ?? 0;
  const now = new Date().toISOString();
  const orderId = `ord_${nanoid(12)}`;
  const entitlementId = `ent_${nanoid(12)}`;
  const tokenId = `tok_${nanoid(12)}`;
  const registryToken = `fl_demo_${nanoid(16)}`;

  const order: DemoOrder = {
    id: orderId,
    email,
    userId: null,
    paymentProviderRef,
    status: "paid",
    planKey: plan,
    licenseVersion: LICENSE_PLAN_VERSION,
    subtotal: amountCents,
    tax: 0,
    total: amountCents,
    createdAt: now,
    materialSlug: material ?? null,
    registryToken,
    entitlementId,
  };

  const entitlement: Entitlement = {
    id: entitlementId,
    orderId,
    userEmail: email,
    planKey: plan,
    licenseVersion: LICENSE_PLAN_VERSION,
    materialScope: materialScopeForPlan(plan, material),
    status: "active",
    grantedAt: now,
    revokedAt: null,
  };

  const tokenRecord: RegistryToken = {
    id: tokenId,
    userEmail: email,
    tokenHash: registryToken,
    entitlementId,
    createdAt: now,
    lastUsedAt: null,
    revokedAt: null,
  };

  const store = await readDemoEntitlements();
  orders.push(order);
  store.entitlements.push(entitlement);
  store.tokens.push(tokenRecord);

  await writeJsonFile(ORDERS_PATH, orders);
  await writeJsonFile(ENTITLEMENTS_PATH, store);

  return {
    orderId,
    registryToken,
    entitlementId,
    created: true,
    order,
  };
}
