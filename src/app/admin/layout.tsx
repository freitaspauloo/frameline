import Link from "next/link";
import { Suspense } from "react";

import { AdminAccessGate } from "@/components/admin-access-gate";
import { AdminNav } from "@/components/admin-nav";
import { resolveDemoUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/materials", label: "Materials" },
  { href: "/admin/signups", label: "Signups" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inbox", label: "Inbox" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await resolveDemoUser();
  const serverAllowed = user?.role === "admin";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh max-w-7xl border-x border-border">
        <aside className="hidden w-52 shrink-0 border-r border-border md:block">
          <div className="border-b border-border px-4 py-5">
            <Link
              className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase hover:text-foreground"
              href="/"
            >
              Frameline
            </Link>
            <p className="mt-2 text-sm font-medium">Admin</p>
          </div>
          <Suspense fallback={null}>
            <AdminNav
              className="flex flex-col py-2"
              items={NAV}
              linkClassName={cn(
                "border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors last:border-b-0 hover:bg-muted hover:text-foreground",
              )}
            />
          </Suspense>
          {user ? (
            <p className="mt-auto border-t border-border px-4 py-4 font-mono text-[10px] break-all text-muted-foreground">
              {user.email}
            </p>
          ) : null}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 md:px-6">
            <Suspense fallback={null}>
              <AdminNav
                className="flex gap-3 overflow-x-auto md:hidden"
                items={NAV}
                linkClassName="shrink-0 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase hover:text-foreground"
              />
            </Suspense>
            <p className="hidden font-mono text-[11px] text-muted-foreground md:block">
              Utilitarian console · demo auth
            </p>
            <Link
              className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase hover:text-foreground"
              href="/account/sign-in"
            >
              Sign in
            </Link>
          </header>
          <main className="flex-1 px-4 py-8 md:px-6">
            <Suspense
              fallback={
                <p className="text-sm text-muted-foreground">Loading…</p>
              }
            >
              <AdminAccessGate serverAllowed={serverAllowed}>
                {children}
              </AdminAccessGate>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
