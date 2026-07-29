import Link from "next/link";

import { WfBadge, WfLabel, WfMuted } from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

const MAIN = [
  { href: "/wireframes/home", label: "Home", route: "/" },
  { href: "/wireframes/materials", label: "Catalog", route: "/materials" },
  {
    href: "/wireframes/materials/aurora-mesh",
    label: "Material",
    route: "/materials/{slug}",
  },
] as const;

const FREE = [
  {
    href: "/wireframes/docs/installation",
    label: "Install",
    route: "/docs/installation",
  },
] as const;

const PAID = [
  { href: "/wireframes/pricing", label: "Pricing", route: "/pricing" },
  {
    href: "/wireframes/checkout",
    label: "Checkout",
    route: "Stripe hosted",
  },
  {
    href: "/wireframes/orders/demo",
    label: "Confirmation",
    route: "/orders/{token}",
  },
  { href: "/wireframes/account", label: "Account", route: "/account" },
] as const;

const MORE = [
  { href: "/wireframes/collections", label: "Collections", route: "/collections" },
  { href: "/wireframes/docs", label: "Docs hub", route: "/docs" },
  { href: "/wireframes/account/sign-in", label: "Sign in", route: "/account/sign-in" },
  { href: "/wireframes/about", label: "About", route: "/about" },
  { href: "/wireframes/license", label: "License", route: "/license" },
] as const;

function StepList({
  steps,
}: {
  steps: readonly { href: string; label: string; route: string }[];
}) {
  return (
    <ol className="mt-4 space-y-2">
      {steps.map((step, i) => (
        <li key={step.href}>
          <Link
            className="group flex items-start gap-3 rounded-relay-md border border-relay-border bg-relay-white px-3 py-2.5 transition-colors hover:border-relay-blue/40 hover:bg-relay-blue-tint/40"
            href={step.href}
          >
            <span className="font-mono text-[11px] text-relay-tertiary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-relay-ink group-hover:text-relay-blue-deep">
                {step.label}
              </span>
              <span className="font-mono text-[11px] text-relay-tertiary">
                {step.route}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function WireframesIndexPage() {
  return (
    <WireframeShell flow="Shared" route="/wireframes" title="Screen map">
      <div className="max-w-2xl space-y-3">
        <WfLabel>Architecture</WfLabel>
        <h1 className="text-3xl font-semibold tracking-tight text-relay-ink sm:text-4xl">
          One path — then free or paid
        </h1>
        <WfMuted>
          Live click-through using Frameline look and feel. Main path first;
          fork only at the material.
        </WfMuted>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-relay-lg border border-relay-border bg-relay-white p-5">
          <div className="flex items-center justify-between gap-2">
            <WfLabel>Main</WfLabel>
            <WfBadge>Everyone</WfBadge>
          </div>
          <p className="mt-2 text-sm font-medium text-relay-ink">
            Home → Catalog → Material
          </p>
          <StepList steps={MAIN} />
        </section>

        <section className="rounded-relay-lg border border-emerald-200 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between gap-2">
            <WfLabel className="text-emerald-800">Free</WfLabel>
            <WfBadge tone="free">Just take it</WfBadge>
          </div>
          <p className="mt-2 text-sm font-medium text-relay-ink">Install</p>
          <StepList steps={FREE} />
          <p className="mt-4">
            <Link
              className="text-sm text-relay-blue hover:text-relay-blue-deep"
              href="/wireframes/materials/aurora-mesh"
            >
              Try free material →
            </Link>
          </p>
        </section>

        <section className="rounded-relay-lg border border-relay-blue/25 bg-relay-blue-tint/30 p-5">
          <div className="flex items-center justify-between gap-2">
            <WfLabel className="text-relay-blue-deep">Paid</WfLabel>
            <WfBadge tone="paid">Pay → download</WfBadge>
          </div>
          <p className="mt-2 text-sm font-medium text-relay-ink">
            Pricing → Checkout → Done → Account
          </p>
          <StepList steps={PAID} />
          <p className="mt-4">
            <Link
              className="text-sm text-relay-blue hover:text-relay-blue-deep"
              href="/wireframes/materials/ink-dither?tier=paid"
            >
              Try paid material →
            </Link>
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-relay-lg border border-relay-border bg-relay-white p-5">
        <WfLabel>More screens</WfLabel>
        <div className="mt-4 flex flex-wrap gap-2">
          {MORE.map((item) => (
            <Link
              key={item.href}
              className="rounded-relay-md border border-relay-border px-3 py-2 text-sm text-relay-ink hover:border-relay-blue/40 hover:bg-relay-panel"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </WireframeShell>
  );
}
