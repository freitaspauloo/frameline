#!/usr/bin/env node
/**
 * Wipe analytics and commerce test data so the dashboard starts at zero.
 * Keeps waitlist / email captures and the material catalog (file-backed).
 *
 * Usage: node scripts/reset-analytics-data.mjs
 * Requires DATABASE_URL.
 */

import { PrismaClient } from "@prisma/client";

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  const before = {
    events: await prisma.event.count(),
    orders: await prisma.order.count(),
    users: await prisma.user.count(),
    entitlements: await prisma.entitlement.count(),
    tokens: await prisma.registryToken.count(),
  };

  console.log("Before:", before);

  await prisma.registryToken.deleteMany();
  await prisma.entitlement.deleteMany();
  await prisma.order.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const after = {
    events: await prisma.event.count(),
    orders: await prisma.order.count(),
    users: await prisma.user.count(),
    entitlements: await prisma.entitlement.count(),
    tokens: await prisma.registryToken.count(),
    waitlist: await prisma.emailCapture.count({ where: { source: "waitlist" } }),
  };

  console.log("After:", after);
  console.log("Analytics baseline reset — counting from now.");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
