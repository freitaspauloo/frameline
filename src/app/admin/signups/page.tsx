import Link from "next/link";

import { percent, StatGrid } from "@/components/admin-metrics";
import { readEvents } from "@/lib/events";
import { readDemoOrders } from "@/lib/fulfillment";
import { getLicensePlan } from "@/lib/license-plans";
import { signupSummary } from "@/lib/metrics";
import { readUsers } from "@/lib/users";

export const dynamic = "force-dynamic";

const AUTH_LABEL: Record<string, string> = {
  google: "Google",
  email: "Email",
  unknown: "Unknown",
};

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminSignupsPage() {
  const [users, signups, orders, signupEvents] = await Promise.all([
    readUsers(),
    signupSummary(),
    readDemoOrders(),
    readEvents({ names: ["signup"], limit: 50_000 }),
  ]);

  const authByEmail = new Map<
    string,
    { method: string; source: string | null }
  >();
  for (const event of signupEvents) {
    const email = event.email?.trim().toLowerCase();
    if (!email || authByEmail.has(email)) continue;
    authByEmail.set(email, {
      method:
        (event.props?.authMethod as string | undefined)?.trim() || "unknown",
      source: event.source,
    });
  }

  const planByEmail = new Map<string, string>();
  for (const order of orders) {
    if (order.status !== "paid") continue;
    const email = order.email.trim().toLowerCase();
    if (!planByEmail.has(email)) planByEmail.set(email, order.planKey);
  }

  const rows = users.map((user) => {
    const email = user.email.toLowerCase();
    const auth = authByEmail.get(email);
    const planKey = planByEmail.get(email);
    const license = planKey ? getLicensePlan(planKey) : null;

    return {
      ...user,
      authMethod: auth?.method ?? "unknown",
      authSource: auth?.source ?? null,
      planLabel: license?.name ?? (planKey ? planKey : null),
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Signups
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Accounts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every user record from Postgres when{" "}
          <span className="font-mono">DATABASE_URL</span> is set; otherwise{" "}
          <span className="font-mono">.data/users.json</span>. Auth method comes
          from the first signup event per email.
        </p>
      </div>

      <StatGrid
        columns={4}
        stats={[
          { label: "Total", value: signups.total },
          { label: "Last 30 days", value: signups.last30 },
          {
            label: "Signup → paid",
            value: percent(signups.paidConversion),
          },
          {
            label: "Paying",
            value: planByEmail.size,
            hint: `${rows.length} accounts`,
          },
        ]}
      />

      {signups.byAuthMethod.length > 0 ? (
        <div className="border border-border px-4 py-4">
          <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            By auth method
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground">
            {signups.byAuthMethod.map((row) => (
              <li key={row.method}>
                <span className="text-foreground">
                  {AUTH_LABEL[row.method] ?? row.method}
                </span>
                {" · "}
                {row.count}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="border border-border px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No signups yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Accounts appear after Google or email sign-in via{" "}
            <span className="font-mono">/api/auth/session</span> or{" "}
            <span className="font-mono">/api/auth/magic-link</span>.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Email
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Name
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Signed up
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Last seen
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Auth
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Plan
                </th>
                <th className="px-3 py-2 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => (
                <tr className="border-b border-border" key={user.id}>
                  <td className="px-3 py-2.5 font-mono text-[11px]">
                    {user.email}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
                    {user.displayName?.trim() || "—"}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {formatWhen(user.createdAt)}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {formatWhen(user.lastSeenAt)}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">
                    {AUTH_LABEL[user.authMethod] ?? user.authMethod}
                    {user.authSource ? (
                      <span className="text-muted-foreground">
                        {" · "}
                        {user.authSource}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px]">
                    {user.planLabel ? (
                      <Link
                        className="underline underline-offset-4 hover:text-muted-foreground"
                        href="/admin/orders"
                      >
                        {user.planLabel}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                    {user.role === "admin" ? (
                      <span className="text-foreground">admin</span>
                    ) : (
                      "buyer"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        {rows.length === 0
          ? "Empty until someone signs in and a user row is created."
          : `${rows.length} account${rows.length === 1 ? "" : "s"} · ${signups.last30} in the last 30 days.`}
      </p>
    </div>
  );
}
