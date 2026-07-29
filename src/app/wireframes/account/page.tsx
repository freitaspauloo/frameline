import Link from "next/link";

import {
  WfBlock,
  WfBtn,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";
import { MATERIALS_CATALOG } from "@/materials";

export default function WireframeAccountPage() {
  return (
    <WireframeShell
      flow="Account"
      nextHref="/wireframes/materials/ink-dither?entitled=1"
      nextLabel="Reinstall material"
      route="/wireframes/account"
      title="Account"
    >
      <div className="mb-8 space-y-2">
        <WfTitle>Your licenses</WfTitle>
        <WfMuted>
          Grab installs again anytime — no separate return journey.
        </WfMuted>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ul className="space-y-3">
          {MATERIALS_CATALOG.map((item) => (
            <li key={item.slug}>
              <Link
                className="flex items-center justify-between gap-3 rounded-relay-lg border border-relay-border bg-relay-white px-4 py-3.5 transition-colors hover:border-relay-blue/40"
                href={`/wireframes/materials/${item.slug}?entitled=1`}
              >
                <div>
                  <p className="text-sm font-medium text-relay-ink">
                    {item.title}
                  </p>
                  <p className="font-mono text-[11px] text-relay-secondary">
                    {item.tier} · v0.1.0
                  </p>
                </div>
                <span className="font-mono text-[11px] text-relay-blue">
                  Install →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="space-y-4 rounded-relay-lg border border-relay-border bg-relay-white p-5">
          <p className="text-sm font-medium text-relay-ink">Registry token</p>
          <WfBlock className="border-0 p-3 font-mono text-[11px]" dark>
            fl_live_••••••••••••••••
          </WfBlock>
          <WfBtn className="w-full" variant="secondary">
            Regenerate token
          </WfBtn>
          <p className="text-sm text-relay-secondary">
            Use this token with the Frameline registry CLI.
          </p>
        </div>
      </div>
    </WireframeShell>
  );
}
