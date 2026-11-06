import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { appBaseUrl } from "@/lib/app-url";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";
import { emailFrom, getResend, type SendResult } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { captureException } from "@/lib/monitoring";
import {
  isNurtureDue,
  nurtureIssueAt,
  renderNurtureEmail,
  type NurtureIssueId,
} from "@/lib/nurture-issues";

export {
  isNurtureDue,
  NURTURE_INTERVAL_DAYS,
  NURTURE_INTERVAL_MS,
  NURTURE_ISSUES,
  nurtureIssueAt,
  renderNurtureEmail,
} from "@/lib/nurture-issues";

const DATA_DIR = path.join(process.cwd(), ".data");
const NURTURE_PATH = path.join(DATA_DIR, "nurture.json");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NurtureSource = "account" | "waitlist";

export type NurtureSubscription = {
  id: string;
  email: string;
  source: NurtureSource;
  issueIndex: number;
  enrolledAt: string;
  lastSentAt: string | null;
  lastIssueId: string | null;
  unsubscribedAt: string | null;
};

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

function unsubscribeSecret(): string {
  return (
    process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    "frameline-dev-unsubscribe"
  );
}

export function nurtureUnsubscribeToken(email: string): string {
  return createHmac("sha256", unsubscribeSecret())
    .update(`nurture:${email.trim().toLowerCase()}`)
    .digest("hex");
}

export function nurtureUnsubscribeUrl(
  email: string,
  baseUrl = appBaseUrl(),
): string {
  const url = new URL("/unsubscribe", `${baseUrl.replace(/\/$/, "")}/`);
  url.searchParams.set("email", email.trim().toLowerCase());
  url.searchParams.set("token", nurtureUnsubscribeToken(email));
  return url.toString();
}

export function nurtureOneClickUrl(
  email: string,
  baseUrl = appBaseUrl(),
): string {
  const url = new URL("/api/unsubscribe", `${baseUrl.replace(/\/$/, "")}/`);
  url.searchParams.set("email", email.trim().toLowerCase());
  url.searchParams.set("token", nurtureUnsubscribeToken(email));
  return url.toString();
}

export function verifyNurtureToken(email: string, token: string): boolean {
  const expected = nurtureUnsubscribeToken(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function readFileStore(): Promise<NurtureSubscription[]> {
  try {
    const raw = await readFile(NURTURE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as NurtureSubscription[]) : [];
  } catch {
    return [];
  }
}

async function writeFileStore(rows: NurtureSubscription[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(NURTURE_PATH, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

function rowFromPrisma(row: {
  id: string;
  email: string;
  source: string;
  issueIndex: number;
  enrolledAt: Date;
  lastSentAt: Date | null;
  lastIssueId: string | null;
  unsubscribedAt: Date | null;
}): NurtureSubscription {
  return {
    id: row.id,
    email: row.email,
    source: row.source === "waitlist" ? "waitlist" : "account",
    issueIndex: row.issueIndex,
    enrolledAt: row.enrolledAt.toISOString(),
    lastSentAt: row.lastSentAt?.toISOString() ?? null,
    lastIssueId: row.lastIssueId,
    unsubscribedAt: row.unsubscribedAt?.toISOString() ?? null,
  };
}

/** Never throws — signup / waitlist must not fail because mail enrollment did. */
export async function enrollNurture(
  emailRaw: string,
  source: NurtureSource,
): Promise<NurtureSubscription | null> {
  const email = emailRaw.trim().toLowerCase();
  if (!isValidEmail(email)) return null;

  try {
    const existing = await getNurtureSubscription(email);
    if (existing) return existing;

    const now = new Date();
    let created: NurtureSubscription;

    if (hasDatabaseUrl()) {
      const row = await getPrisma().nurtureSubscription.create({
        data: { email, source },
      });
      created = rowFromPrisma(row);
    } else {
      created = {
        id: `nurture_${randomBytes(8).toString("hex")}`,
        email,
        source,
        issueIndex: 0,
        enrolledAt: now.toISOString(),
        lastSentAt: null,
        lastIssueId: null,
        unsubscribedAt: null,
      };
      const rows = await readFileStore();
      if (rows.some((row) => row.email === email)) {
        return rows.find((row) => row.email === email) ?? created;
      }
      rows.push(created);
      await writeFileStore(rows);
    }

    await recordEvent({
      name: "nurture_enrolled",
      email,
      source,
    });
    await syncResendContact(email, false);
    return created;
  } catch (err) {
    captureException(err, { route: "nurture/enroll", email });
    return null;
  }
}

export async function getNurtureSubscription(
  emailRaw: string,
): Promise<NurtureSubscription | null> {
  const email = emailRaw.trim().toLowerCase();
  try {
    if (hasDatabaseUrl()) {
      const row = await getPrisma().nurtureSubscription.findUnique({
        where: { email },
      });
      return row ? rowFromPrisma(row) : null;
    }
    const rows = await readFileStore();
    return rows.find((row) => row.email === email) ?? null;
  } catch (err) {
    captureException(err, { route: "nurture/get", email });
    return null;
  }
}

export async function countNurture(opts?: {
  subscribedOnly?: boolean;
}): Promise<number> {
  try {
    if (hasDatabaseUrl()) {
      return await getPrisma().nurtureSubscription.count({
        where: opts?.subscribedOnly ? { unsubscribedAt: null } : undefined,
      });
    }
    const rows = await readFileStore();
    return opts?.subscribedOnly
      ? rows.filter((row) => !row.unsubscribedAt).length
      : rows.length;
  } catch {
    return 0;
  }
}

export async function unsubscribeNurture(
  emailRaw: string,
): Promise<{ ok: true; already?: boolean } | { ok: false; error: string }> {
  const email = emailRaw.trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email" };

  try {
    const existing = await getNurtureSubscription(email);
    if (!existing) {
      return { ok: false, error: "Email is not on the list" };
    }
    if (existing.unsubscribedAt) {
      return { ok: true, already: true };
    }

    const now = new Date();
    if (hasDatabaseUrl()) {
      await getPrisma().nurtureSubscription.update({
        where: { email },
        data: { unsubscribedAt: now },
      });
    } else {
      const rows = await readFileStore();
      const index = rows.findIndex((row) => row.email === email);
      if (index >= 0) {
        rows[index] = { ...rows[index], unsubscribedAt: now.toISOString() };
        await writeFileStore(rows);
      }
    }

    await recordEvent({ name: "nurture_unsubscribed", email });
    await syncResendContact(email, true);
    return { ok: true };
  } catch (err) {
    captureException(err, { route: "nurture/unsubscribe", email });
    return { ok: false, error: "Could not unsubscribe" };
  }
}

export function listDueNurture(
  rows: NurtureSubscription[],
  now = new Date(),
): NurtureSubscription[] {
  return rows.filter((row) =>
    isNurtureDue({
      enrolledAt: row.enrolledAt,
      lastSentAt: row.lastSentAt,
      unsubscribedAt: row.unsubscribedAt,
      now,
    }),
  );
}

async function loadAllSubscriptions(): Promise<NurtureSubscription[]> {
  if (hasDatabaseUrl()) {
    const rows = await getPrisma().nurtureSubscription.findMany({
      where: { unsubscribedAt: null },
      orderBy: { enrolledAt: "asc" },
      take: 5_000,
    });
    return rows.map(rowFromPrisma);
  }
  return (await readFileStore()).filter((row) => !row.unsubscribedAt);
}

async function markSent(
  email: string,
  issueIndex: number,
  issueId: string,
  sentAt: Date,
) {
  if (hasDatabaseUrl()) {
    await getPrisma().nurtureSubscription.update({
      where: { email },
      data: {
        issueIndex,
        lastIssueId: issueId,
        lastSentAt: sentAt,
      },
    });
    return;
  }
  const rows = await readFileStore();
  const index = rows.findIndex((row) => row.email === email);
  if (index < 0) return;
  rows[index] = {
    ...rows[index],
    issueIndex,
    lastIssueId: issueId,
    lastSentAt: sentAt.toISOString(),
  };
  await writeFileStore(rows);
}

async function syncResendContact(email: string, unsubscribed: boolean) {
  const client = getResend();
  const segmentId = process.env.RESEND_SEGMENT_ID?.trim();
  if (!client || !segmentId) return;

  try {
    const { error } = await client.contacts.create({
      email,
      unsubscribed,
      segments: [{ id: segmentId }],
    });
    if (error) {
      await client.contacts.update({
        email,
        unsubscribed,
      });
    }
  } catch (err) {
    captureException(err, { route: "nurture/resend-contact", email });
  }
}

/** Remove biweekly enrollment for `email` — safe when missing. */
export async function deleteNurtureSubscriptionByEmail(
  emailRaw: string,
): Promise<void> {
  const email = emailRaw.trim().toLowerCase();
  try {
    if (hasDatabaseUrl()) {
      await getPrisma().nurtureSubscription.deleteMany({ where: { email } });
      return;
    }
    const rows = await readFileStore();
    const next = rows.filter((row) => row.email !== email);
    if (next.length !== rows.length) await writeFileStore(next);
  } catch (err) {
    captureException(err, { route: "nurture/delete", email });
  }
}

export async function sendNurtureIssue(input: {
  email: string;
  issueIndex: number;
}): Promise<SendResult & { issueId?: NurtureIssueId }> {
  const client = getResend();
  if (!client) {
    return { ok: true, skipped: true, reason: "RESEND_API_KEY not set" };
  }

  const email = input.email.trim().toLowerCase();
  const issue = nurtureIssueAt(input.issueIndex);
  const unsubscribeUrl = nurtureUnsubscribeUrl(email);
  const rendered = renderNurtureEmail(issue, { email, unsubscribeUrl });
  const oneClick = nurtureOneClickUrl(email);

  try {
    const { data, error } = await client.emails.send({
      from: emailFrom(),
      to: [email],
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      headers: {
        "List-Unsubscribe": `<${oneClick}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      tags: [
        { name: "category", value: "nurture" },
        { name: "issue", value: issue.id },
      ],
    });

    if (error) {
      captureException(error, { route: "nurture/send", email, issue: issue.id });
      return { ok: false, error: error.message };
    }
    if (!data?.id) {
      return { ok: false, error: "Resend returned no email id" };
    }
    return { ok: true, id: data.id, issueId: issue.id };
  } catch (err) {
    captureException(err, { route: "nurture/send", email, issue: issue.id });
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send nurture mail",
    };
  }
}

export type NurtureRunResult = {
  ok: true;
  dryRun: boolean;
  due: number;
  sent: number;
  skipped: number;
  failed: number;
  issues: Array<{ email: string; issueId: string; status: string }>;
};

export async function runNurtureDue(opts?: {
  now?: Date;
  limit?: number;
  dryRun?: boolean;
}): Promise<NurtureRunResult> {
  const now = opts?.now ?? new Date();
  const limit = Math.max(1, Math.min(opts?.limit ?? 80, 200));
  const dryRun = Boolean(opts?.dryRun);

  const due = listDueNurture(await loadAllSubscriptions(), now).slice(0, limit);
  const issues: NurtureRunResult["issues"] = [];
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of due) {
    const issue = nurtureIssueAt(row.issueIndex);
    if (dryRun) {
      issues.push({
        email: row.email,
        issueId: issue.id,
        status: "due",
      });
      continue;
    }

    const result = await sendNurtureIssue({
      email: row.email,
      issueIndex: row.issueIndex,
    });

    if ("skipped" in result && result.skipped) {
      skipped += 1;
      issues.push({
        email: row.email,
        issueId: issue.id,
        status: `skipped:${result.reason}`,
      });
      continue;
    }

    if (!result.ok) {
      failed += 1;
      issues.push({
        email: row.email,
        issueId: issue.id,
        status: `error:${result.error}`,
      });
      continue;
    }

    await markSent(row.email, row.issueIndex + 1, issue.id, now);
    await recordEvent({
      name: "nurture_sent",
      email: row.email,
      source: row.source,
      props: { issueId: issue.id, resendId: result.id },
    });
    sent += 1;
    issues.push({ email: row.email, issueId: issue.id, status: "sent" });
  }

  return {
    ok: true,
    dryRun,
    due: due.length,
    sent,
    skipped,
    failed,
    issues,
  };
}
