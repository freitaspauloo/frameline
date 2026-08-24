import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { isAdminEmail } from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";

/**
 * User records.
 *
 * Frameline authenticates through Firebase and carries identity in cookies, so
 * until now nothing ever wrote the Prisma `User` table and there was no way to
 * count signups. This module owns that record, with the same Postgres/`.data`
 * split the rest of the app uses.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_PATH = path.join(DATA_DIR, "users.json");

export type AppUser = {
  id: string;
  email: string;
  firebaseUid: string | null;
  displayName: string | null;
  role: "buyer" | "admin";
  createdAt: string;
  lastSeenAt: string | null;
};

export type UpsertUserInput = {
  email: string;
  firebaseUid?: string | null;
  displayName?: string | null;
};

async function readUserFile(): Promise<AppUser[]> {
  try {
    const raw = await readFile(USERS_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as AppUser[]) : [];
  } catch {
    return [];
  }
}

async function writeUserFile(users: AppUser[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_PATH, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

/**
 * Create or refresh the user for `email`.
 * `created` distinguishes a signup from a returning sign-in.
 */
export async function upsertUser(
  input: UpsertUserInput,
): Promise<{ user: AppUser; created: boolean }> {
  const email = input.email.trim().toLowerCase();
  const role = isAdminEmail(email) ? "admin" : "buyer";
  const now = new Date();

  if (hasDatabaseUrl()) {
    const prisma = getPrisma();
    const existing = await prisma.user.findUnique({ where: { email } });
    const row = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        role,
        firebaseUid: input.firebaseUid?.trim() || null,
        displayName: input.displayName?.trim() || null,
        lastSeenAt: now,
      },
      update: {
        role,
        lastSeenAt: now,
        // Never blank out details a later sign-in did not supply.
        ...(input.firebaseUid?.trim()
          ? { firebaseUid: input.firebaseUid.trim() }
          : {}),
        ...(input.displayName?.trim()
          ? { displayName: input.displayName.trim() }
          : {}),
      },
    });

    return {
      created: !existing,
      user: {
        id: row.id,
        email: row.email,
        firebaseUid: row.firebaseUid,
        displayName: row.displayName,
        role: row.role,
        createdAt: row.createdAt.toISOString(),
        lastSeenAt: row.lastSeenAt?.toISOString() ?? null,
      },
    };
  }

  const users = await readUserFile();
  const index = users.findIndex((u) => u.email === email);

  if (index >= 0) {
    const merged: AppUser = {
      ...users[index],
      role,
      lastSeenAt: now.toISOString(),
      firebaseUid: input.firebaseUid?.trim() || users[index].firebaseUid,
      displayName: input.displayName?.trim() || users[index].displayName,
    };
    users[index] = merged;
    await writeUserFile(users);
    return { user: merged, created: false };
  }

  const user: AppUser = {
    id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
    email,
    firebaseUid: input.firebaseUid?.trim() || null,
    displayName: input.displayName?.trim() || null,
    role,
    createdAt: now.toISOString(),
    lastSeenAt: now.toISOString(),
  };
  users.push(user);
  await writeUserFile(users);
  return { user, created: true };
}

/** Never throws — used on paths where a missing user must not break the flow. */
export async function ensureUser(
  input: UpsertUserInput,
): Promise<{ user: AppUser; created: boolean } | null> {
  try {
    return await upsertUser(input);
  } catch (err) {
    console.error("[users] upsert failed", err);
    return null;
  }
}

export async function readUsers(): Promise<AppUser[]> {
  try {
    if (hasDatabaseUrl()) {
      const rows = await getPrisma().user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5_000,
      });
      return rows.map((row) => ({
        id: row.id,
        email: row.email,
        firebaseUid: row.firebaseUid,
        displayName: row.displayName,
        role: row.role,
        createdAt: row.createdAt.toISOString(),
        lastSeenAt: row.lastSeenAt?.toISOString() ?? null,
      }));
    }
    const users = await readUserFile();
    return [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    console.error("[users] read failed", err);
    return [];
  }
}

export async function countUsers(): Promise<number> {
  try {
    if (hasDatabaseUrl()) return await getPrisma().user.count();
    return (await readUserFile()).length;
  } catch {
    return 0;
  }
}
