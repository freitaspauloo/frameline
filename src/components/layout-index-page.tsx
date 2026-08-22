import Link from "next/link";

import { LAYOUT_ROUTES } from "@/lib/layout-routes";

function Path({ href }: { href: string }) {
  return (
    <Link
      className="rounded-md bg-[#2a2a2a] px-1.5 py-0.5 font-mono text-[0.95em] text-[#6ea8fe] no-underline hover:underline"
      href={href}
    >
      {href}
    </Link>
  );
}

export function LayoutIndexPage() {
  return (
    <main className="min-h-dvh bg-black px-6 py-16 text-[#e8e8e8]">
      <div className="mx-auto max-w-xl space-y-8 text-[16px] leading-relaxed">
        <p>Routes are named for the layout now. Old URLs still work as aliases.</p>
        <ol className="list-decimal space-y-2.5 pl-6">
          {LAYOUT_ROUTES.map((route) => (
            <li key={route.href}>
              <span className="font-medium">{route.name}</span>
              {" — "}
              {"also" in route && route.also ? (
                <>
                  <Path href={route.also} />
                  {" (also "}
                  <Path href={route.href} />)
                </>
              ) : (
                <Path href={route.href} />
              )}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
