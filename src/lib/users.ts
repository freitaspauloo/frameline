import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Prisma } from "@prisma/client";

import { isAdminEmail } from "@/lib/admin-emails";
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
  signupNotifiedAt?: string | null;
};

function mapUser(row: {
  id: string;
  email: string;
  firebaseUid: string | null;
  displayName: string | null;
  role: "buyer" | "admin";
  createdAt: Date;
  lastSeenAt: Date | null;
  signupNotifiedAt?: Date | null;
}): AppUser {
  return {
    id: row.id,
    email: row.email,
    firebaseUid: row.firebaseUid,
    displayName: row.displayName,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    lastSeenAt: row.lastSeenAt?.toISOString() ?? null,
    signupNotifiedAt: row.signupNotifiedAt?.toISOString() ?? null,
  };
}

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

/** Serialize JSON-file mutations so parallel signups cannot both report created. */
let userFileChain: Promise<void> = Promise.resolve();

function withUserFile<T>(fn: () => Promise<T>): Promise<T> {
  const run = userFileChain.then(fn, fn);
  userFileChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/**
 * Create or refresh the user for `email`.
 * `created` distinguishes a signup from a returning sign-in.
 */
export async function upsertUser(
  input: UpsertUserInput,
): Promise<{ user: AppUser; created: boolean }> {
  const email = input.email.trim().toLowerCase();
  const role: "buyer" | "admin" = isAdminEmail(email) ? "admin" : "buyer";
  const now = new Date();

  if (hasDatabaseUrl()) {
    const prisma = getPrisma();
    const createData = {
      email,
      role,
      firebaseUid: input.firebaseUid?.trim() || null,
      displayName: input.displayName?.trim() || null,
      lastSeenAt: now,
    };
    const updateData = {
      role,
      lastSeenAt: now,
      ...(input.firebaseUid?.trim()
        ? { firebaseUid: input.firebaseUid.trim() }
        : {}),
      ...(input.displayName?.trim()
        ? { displayName: input.displayName.trim() }
        : {}),
    };

    // Create-first so two parallel signups cannot both see `created: true`
    // (findUnique + upsert races and double-fires the Resend welcome).
    try {
      const row = await prisma.user.create({ data: createData });
      return { created: true, user: mapUser(row) };
    } catch (err) {
      if (
        !(err instanceof Prisma.PrismaClientKnownRequestError) ||
        err.code !== "P2002"
      ) {
        throw err;
      }
      const row = await prisma.user.update({
        where: { email },
        data: updateData,
      });
      return { created: false, user: mapUser(row) };
    }
  }

  return withUserFile(async () => {
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
  });
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

export async function findUserByEmail(
  emailRaw: string,
): Promise<AppUser | null> {
  const email = emailRaw.trim().toLowerCase();
  if (!email) return null;
  try {
    if (hasDatabaseUrl()) {
      const row = await getPrisma().user.findUnique({ where: { email } });
      return row ? mapUser(row) : null;
    }
    const users = await readUserFile();
    return users.find((u) => u.email === email) ?? null;
  } catch (err) {
    console.error("[users] find failed", err);
    return null;
  }
}

/**
 * Whether a Frameline user row exists for this email.
 * `null` means the store could not be read — callers should not treat that as deletion.
 */
export async function hasStoredUser(
  emailRaw: string,
): Promise<boolean | null> {
  const email = emailRaw.trim().toLowerCase();
  if (!email) return false;
  try {
    if (hasDatabaseUrl()) {
      const row = await getPrisma().user.findUnique({
        where: { email },
        select: { id: true },
      });
      return Boolean(row);
    }
    const users = await readUserFile();
    return users.some((u) => u.email === email);
  } catch (err) {
    console.error("[users] hasStoredUser failed", err);
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
      return rows.map(mapUser);
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

/**
 * Atomically claim the right to fire the Resend `user.signed_up` event.
 * Returns false if this email was already claimed (or the user row is missing).
 */
export async function claimSignupNotification(emailRaw: string): Promise<boolean> {
  const email = emailRaw.trim().toLowerCase();
  const now = new Date();

  try {
    if (hasDatabaseUrl()) {
      const result = await getPrisma().user.updateMany({
        where: { email, signupNotifiedAt: null },
        data: { signupNotifiedAt: now },
      });
      return result.count === 1;
    }

    return withUserFile(async () => {
      const users = await readUserFile();
      const index = users.findIndex((u) => u.email === email);
      if (index < 0) return false;
      if (users[index].signupNotifiedAt) return false;
      users[index] = {
        ...users[index],
        signupNotifiedAt: now.toISOString(),
      };
      await writeUserFile(users);
      return true;
    });
  } catch (err) {
    console.error("[users] claim signup notify failed", err);
    return false;
  }
}

/** Undo a claim when the Resend event fails, so a retry can send. */
export async function releaseSignupNotification(
  emailRaw: string,
): Promise<void> {
  const email = emailRaw.trim().toLowerCase();
  try {
    if (hasDatabaseUrl()) {
      await getPrisma().user.updateMany({
        where: { email },
        data: { signupNotifiedAt: null },
      });
      return;
    }
    await withUserFile(async () => {
      const users = await readUserFile();
      const index = users.findIndex((u) => u.email === email);
      if (index < 0) return;
      users[index] = { ...users[index], signupNotifiedAt: null };
      await writeUserFile(users);
    });
  } catch (err) {
    console.error("[users] release signup notify failed", err);
  }
}
