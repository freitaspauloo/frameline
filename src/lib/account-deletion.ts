import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import { getResend } from "@/lib/email";
import { captureException } from "@/lib/monitoring";
import { deleteNurtureSubscriptionByEmail } from "@/lib/nurture";
import { revokeAccessForEmail } from "@/lib/fulfillment";
import { releaseSignupNotification } from "@/lib/users";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_PATH = path.join(DATA_DIR, "users.json");
const WAITLIST_PATH = path.join(DATA_DIR, "waitlist.json");

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeJsonArray(filePath: string, data: unknown[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** Best-effort remove from Resend Audiences (no segment id required). */
async function removeResendAudienceContact(email: string): Promise<void> {
  const client = getResend();
  if (!client) return;
  try {
    const { error } = await client.contacts.remove(email);
    if (error) {
      captureException(error, { route: "account/resend-remove", email });
    }
  } catch (err) {
    captureException(err, { route: "account/resend-remove", email });
  }
}

/**
 * Remove app-side identity and marketing state for `email`.
 * Does not delete Firebase Auth or Stripe — call those from the API layer when configured.
 */
export async function purgeFramelineAccountData(emailRaw: string): Promise<void> {
  const email = emailRaw.trim().toLowerCase();

  await revokeAccessForEmail(email);
  await deleteNurtureSubscriptionByEmail(email);
  await removeResendAudienceContact(email);
  // Clear welcome claim before row removal so a leftover profile cannot block re-signup mail.
  await releaseSignupNotification(email);

  if (hasDatabaseUrl()) {
    const prisma = getPrisma();
    await prisma.$transaction(async (tx) => {
      await tx.order.updateMany({
        where: { email },
        data: { userId: null },
      });
      await tx.user.deleteMany({ where: { email } });
      await tx.emailCapture.deleteMany({ where: { email } });
    });
  }

  const [users, waitlist] = await Promise.all([
    readJsonArray<{ email: string }>(USERS_PATH),
    readJsonArray<{ email: string }>(WAITLIST_PATH),
  ]);
  const nextUsers = users.filter((u) => u.email !== email);
  if (nextUsers.length !== users.length) {
    await writeJsonArray(USERS_PATH, nextUsers);
  }
  const nextWait = waitlist.filter((e) => e.email !== email);
  if (nextWait.length !== waitlist.length) {
    await writeJsonArray(WAITLIST_PATH, nextWait);
  }
}
