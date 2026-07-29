import { WireframeMaterialPreview } from "@/components/wireframes/material-preview";
import {
  WfBtn,
  WfLabel,
  WfMuted,
  WfTitle,
} from "@/components/wireframes/primitives";
import { WireframeShell } from "@/components/wireframes/shell";

export default function WireframeHomePage() {
  return (
    <WireframeShell
      flow="Main"
      nextHref="/wireframes/materials"
      nextLabel="Catalog"
      route="/wireframes/home"
      title="Home"
    >
      <section className="overflow-hidden rounded-relay-lg border border-relay-border bg-relay-white">
        <div className="grid gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-16">
          <div className="space-y-5">
            <WfLabel>Frameline</WfLabel>
            <WfTitle>Surface materials for design engineers</WfTitle>
            <WfMuted className="max-w-md text-base">
              Production-ready gradients, textures, and motion — install as typed
              React components. Browse the catalog, then free install or buy.
            </WfMuted>
            <div className="flex flex-wrap gap-3 pt-2">
              <WfBtn href="/wireframes/materials">Browse materials</WfBtn>
              <WfBtn href="/wireframes/pricing" variant="secondary">
                Pricing
              </WfBtn>
            </div>
          </div>

          <div className="relative min-h-56 overflow-hidden rounded-relay-lg bg-relay-ink lg:min-h-72">
            <WireframeMaterialPreview slug="aurora-mesh" />
          </div>
        </div>

        <div className="grid gap-4 border-t border-relay-border px-6 py-8 sm:grid-cols-3 lg:px-10">
          {[
            ["Install in under a minute", "CLI or copy-paste JSX"],
            ["Token-bound by default", "Fits your theme, not ours"],
            ["Free to evaluate", "Paid for signature depth"],
          ].map(([title, body]) => (
            <div key={title} className="space-y-1.5">
              <p className="text-sm font-medium text-relay-ink">{title}</p>
              <p className="text-sm text-relay-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </WireframeShell>
  );
}
