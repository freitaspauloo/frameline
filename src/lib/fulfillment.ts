import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { nanoid } from "nanoid";

import type { Entitlement, Order, RegistryToken } from "@/lib/domain";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import {
  getLicensePlan,
  LICENSE_PLAN_VERSION,
  type CheckoutPlanKey,
} from "@/lib/license-plans";
import {
  hashRegistryToken,
  mintDemoRegistryToken,
  mintRegistryToken,
} from "@/lib/tokens";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_PATH = path.join(DATA_DIR, "orders.json");
const ENTITLEMENTS_PATH = path.join(DATA_DIR, "entitlements.json");

/** Order row for admin / confirmation — domain Order plus install metadata. */
export type DemoOrder = Order & {
  materialSlug: string | null;
  /** Plaintext token when freshly minted; null on later DB reads (hash-only). */
  registryToken: string | null;
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

function materialScopeForPlan(
  plan: CheckoutPlanKey,
  material?: string,
): Entitlement["materialScope"] {
  if (plan === "static" && material) {
    return { kind: "set", materialSlugs: [material] };
  }
  return { kind: "all" };
}

function parseMaterialScope(raw: unknown): Entitlement["materialScope"] {
  if (!raw || typeof raw !== "object") return { kind: "all" };
  const scope = raw as Entitlement["materialScope"];
  if (scope.kind === "all") return { kind: "all" };
  if (
    scope.kind === "set" &&
    Array.isArray(scope.materialSlugs) &&
    scope.materialSlugs.every((s) => typeof s === "string")
  ) {
    return { kind: "set", materialSlugs: scope.materialSlugs };
  }
  return { kind: "all" };
}

function materialSlugFromScope(
  scope: Entitlement["materialScope"],
): string | null {
  if (scope.kind === "set" && scope.materialSlugs[0]) {
    return scope.materialSlugs[0];
  }
  return null;
}

function toIso(d: Date | string): string {
  return typeof d === "string" ? d : d.toISOString();
}

// ——— File-backed demo store (no DATABASE_URL) ———

export async function readDemoOrders(): Promise<DemoOrder[]> {
  if (hasDatabaseUrl()) {
    return readOrdersFromDb();
  }
  const parsed = await readJsonFile<unknown>(ORDERS_PATH, []);
  return Array.isArray(parsed) ? (parsed as DemoOrder[]) : [];
}

export async function readDemoEntitlements(): Promise<DemoEntitlementStore> {
  if (hasDatabaseUrl()) {
    return readEntitlementsFromDb();
  }
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
  if (hasDatabaseUrl()) {
    return getOrderByIdFromDb(id);
  }
  const orders = await readDemoOrders();
  return orders.find((o) => o.id === id);
}

/** Prefer exact id; otherwise latest paid order for email (+ optional plan). */
export async function findDemoOrder(opts: {
  id?: string;
  email?: string;
  plan?: string;
  paymentProviderRef?: string;
}): Promise<DemoOrder | undefined> {
  if (opts.paymentProviderRef && hasDatabaseUrl()) {
    const byRef = await getOrderByPaymentRefFromDb(opts.paymentProviderRef);
    if (byRef) return byRef;
  }

  if (opts.id) {
    const byId = await getDemoOrderById(opts.id);
    if (byId) return byId;
  }

  const email = opts.email?.trim().toLowerCase();
  if (!email) return undefined;

  if (hasDatabaseUrl()) {
    return findPaidOrderFromDb({ email, plan: opts.plan });
  }

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

/**
 * Idempotent fulfillment — Postgres when DATABASE_URL is set, else `.data/` files.
 * Grants entitlement and mints a registry bearer token (returned once in plaintext).
 */
export async function fulfillDemoOrder(
  input: FulfillInput,
): Promise<FulfillResult> {
  if (hasDatabaseUrl()) {
    return fulfillOrderInDb(input);
  }
  return fulfillOrderInFiles(input);
}

/** Resolve a registry bearer token to an active entitlement (DB or file store). */
export async function resolveRegistryToken(token: string): Promise<{
  email: string;
  entitlement: Entitlement;
} | null> {
  if (!token.startsWith("fl_demo_") && !token.startsWith("fl_live_")) {
    return null;
  }

  if (hasDatabaseUrl()) {
    const prisma = getPrisma();
    const hash = hashRegistryToken(token);
    const row = await prisma.registryToken.findFirst({
      where: {
        revokedAt: null,
        OR: [{ tokenHash: hash }, { tokenHash: token }],
      },
      include: { entitlement: true },
    });
    if (!row || row.entitlement.status !== "active") return null;

    await prisma.registryToken.update({
      where: { id: row.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      email: row.userEmail,
      entitlement: {
        id: row.entitlement.id,
        orderId: row.entitlement.orderId,
        userEmail: row.entitlement.userEmail,
        planKey: row.entitlement.planKey as Entitlement["planKey"],
        licenseVersion: row.entitlement.licenseVersion,
        materialScope: parseMaterialScope(row.entitlement.materialScope),
        status: row.entitlement.status,
        grantedAt: toIso(row.entitlement.grantedAt),
        revokedAt: row.entitlement.revokedAt
          ? toIso(row.entitlement.revokedAt)
          : null,
      },
    };
  }

  const store = await readDemoEntitlements();
  const tokenRow = store.tokens.find(
    (t) => t.tokenHash === token && !t.revokedAt,
  );
  if (!tokenRow) return null;
  const entitlement = store.entitlements.find(
    (e) => e.id === tokenRow.entitlementId && e.status === "active",
  );
  if (!entitlement) return null;
  return { email: tokenRow.userEmail, entitlement };
}

// ——— Postgres ———

async function readOrdersFromDb(): Promise<DemoOrder[]> {
  const prisma = getPrisma();
  const rows = await prisma.order.findMany({
    include: { entitlements: { include: { tokens: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapDbOrder);
}

async function readEntitlementsFromDb(): Promise<DemoEntitlementStore> {
  const prisma = getPrisma();
  const [ents, tokens] = await Promise.all([
    prisma.entitlement.findMany({ orderBy: { grantedAt: "desc" } }),
    prisma.registryToken.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return {
    entitlements: ents.map((e) => ({
      id: e.id,
      orderId: e.orderId,
      userEmail: e.userEmail,
      planKey: e.planKey as Entitlement["planKey"],
      licenseVersion: e.licenseVersion,
      materialScope: parseMaterialScope(e.materialScope),
      status: e.status,
      grantedAt: toIso(e.grantedAt),
      revokedAt: e.revokedAt ? toIso(e.revokedAt) : null,
    })),
    tokens: tokens.map((t) => ({
      id: t.id,
      userEmail: t.userEmail,
      tokenHash: t.tokenHash,
      entitlementId: t.entitlementId,
      createdAt: toIso(t.createdAt),
      lastUsedAt: t.lastUsedAt ? toIso(t.lastUsedAt) : null,
      revokedAt: t.revokedAt ? toIso(t.revokedAt) : null,
    })),
  };
}

async function getOrderByIdFromDb(id: string): Promise<DemoOrder | undefined> {
  const prisma = getPrisma();
  const row = await prisma.order.findUnique({
    where: { id },
    include: { entitlements: { include: { tokens: true } } },
  });
  return row ? mapDbOrder(row) : undefined;
}

async function getOrderByPaymentRefFromDb(
  paymentProviderRef: string,
): Promise<DemoOrder | undefined> {
  const prisma = getPrisma();
  const row = await prisma.order.findFirst({
    where: { paymentProviderRef },
    include: { entitlements: { include: { tokens: true } } },
  });
  return row ? mapDbOrder(row) : undefined;
}

async function findPaidOrderFromDb(opts: {
  email: string;
  plan?: string;
}): Promise<DemoOrder | undefined> {
  const prisma = getPrisma();
  const plan = opts.plan?.trim().toLowerCase();
  const row = await prisma.order.findFirst({
    where: {
      email: opts.email,
      status: "paid",
      ...(plan ? { planKey: plan } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { entitlements: { include: { tokens: true } } },
  });
  return row ? mapDbOrder(row) : undefined;
}

function mapDbOrder(row: {
  id: string;
  email: string;
  userId: string | null;
  paymentProviderRef: string | null;
  status: Order["status"];
  planKey: string;
  licenseVersion: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  entitlements: Array<{
    id: string;
    materialScope: unknown;
    tokens: Array<{ tokenHash: string }>;
  }>;
}): DemoOrder {
  const entitlement = row.entitlements[0];
  const scope = parseMaterialScope(entitlement?.materialScope);
  return {
    id: row.id,
    email: row.email,
    userId: row.userId,
    paymentProviderRef: row.paymentProviderRef,
    status: row.status,
    planKey: row.planKey as Order["planKey"],
    licenseVersion: row.licenseVersion,
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
    createdAt: toIso(row.createdAt),
    materialSlug: materialSlugFromScope(scope),
    // Hash-only at rest — plaintext is returned only from fulfillResult.
    registryToken: null,
    entitlementId: entitlement?.id ?? "",
  };
}

async function fulfillOrderInDb(input: FulfillInput): Promise<FulfillResult> {
  const prisma = getPrisma();
  const email = input.email.trim().toLowerCase();
  const plan = input.plan;
  const material = input.material?.trim() || undefined;
  const paymentProviderRef = input.paymentProviderRef?.trim() || null;

  if (paymentProviderRef) {
    const existing = await getOrderByPaymentRefFromDb(paymentProviderRef);
    if (existing) {
      return {
        orderId: existing.id,
        registryToken: existing.registryToken ?? "",
        entitlementId: existing.entitlementId,
        created: false,
        order: existing,
      };
    }
  }

  const license = getLicensePlan(plan);
  const amountCents = license?.amountCents ?? 0;
  const plaintextToken = mintRegistryToken();
  const tokenHash = hashRegistryToken(plaintextToken);
  const materialScope = materialScopeForPlan(plan, material);

  const created = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        email,
        userId: null,
        paymentProviderRef,
        status: "paid",
        planKey: plan,
        licenseVersion: LICENSE_PLAN_VERSION,
        subtotal: amountCents,
        tax: 0,
        total: amountCents,
      },
    });

    const entitlement = await tx.entitlement.create({
      data: {
        orderId: order.id,
        userEmail: email,
        planKey: plan,
        licenseVersion: LICENSE_PLAN_VERSION,
        materialScope,
        status: "active",
      },
    });

    await tx.registryToken.create({
      data: {
        userEmail: email,
        tokenHash,
        entitlementId: entitlement.id,
      },
    });

    return { order, entitlement };
  });

  const order: DemoOrder = {
    id: created.order.id,
    email: created.order.email,
    userId: created.order.userId,
    paymentProviderRef: created.order.paymentProviderRef,
    status: created.order.status,
    planKey: created.order.planKey as Order["planKey"],
    licenseVersion: created.order.licenseVersion,
    subtotal: created.order.subtotal,
    tax: created.order.tax,
    total: created.order.total,
    createdAt: toIso(created.order.createdAt),
    materialSlug: material ?? null,
    registryToken: plaintextToken,
    entitlementId: created.entitlement.id,
  };

  return {
    orderId: order.id,
    registryToken: plaintextToken,
    entitlementId: created.entitlement.id,
    created: true,
    order,
  };
}

// ——— File fallback ———

async function fulfillOrderInFiles(input: FulfillInput): Promise<FulfillResult> {
  const email = input.email.trim().toLowerCase();
  const plan = input.plan;
  const material = input.material?.trim() || undefined;
  const paymentProviderRef = input.paymentProviderRef?.trim() || null;

  const orders = await readJsonFile<DemoOrder[]>(ORDERS_PATH, []).then((p) =>
    Array.isArray(p) ? p : [],
  );

  if (paymentProviderRef) {
    const existing = orders.find(
      (o) => o.paymentProviderRef === paymentProviderRef,
    );
    if (existing) {
      return {
        orderId: existing.id,
        registryToken: existing.registryToken ?? "",
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
  const registryToken = mintDemoRegistryToken();

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

  const store = await readJsonFile<Partial<DemoEntitlementStore>>(
    ENTITLEMENTS_PATH,
    { entitlements: [], tokens: [] },
  );
  const entitlements = Array.isArray(store.entitlements)
    ? store.entitlements
    : [];
  const tokens = Array.isArray(store.tokens) ? store.tokens : [];

  orders.push(order);
  entitlements.push(entitlement);
  tokens.push(tokenRecord);

  await writeJsonFile(ORDERS_PATH, orders);
  await writeJsonFile(ENTITLEMENTS_PATH, { entitlements, tokens });

  return {
    orderId,
    registryToken,
    entitlementId,
    created: true,
    order,
  };
}
