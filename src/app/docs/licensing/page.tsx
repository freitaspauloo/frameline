import Link from "next/link";

import {
  DocsCallout,
  DocsH2,
  DocsP,
  DocsShell,
  DocsTable,
  DocsUl,
} from "@/components/docs-shell";

export default function LicensingDocsPage() {
  return (
    <DocsShell
      currentPath="/docs/licensing"
      description="Plain-language rights for Free, Personal, and Team. Perpetual, non-exclusive, non-transferable — version pinned on every order. Full legal terms live on the license page."
      title="Licensing"
    >
      <DocsP>
        Buyers should never need a lawyer to license a background. This page is
        the human summary used at point of sale. Authoritative terms:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/license"
        >
          /license
        </Link>
        . Pricing and checkout:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/pricing"
        >
          /pricing
        </Link>
        .
      </DocsP>

      <DocsH2 id="tiers">Rights by tier</DocsH2>
      <DocsTable
        headers={["Tier", "Permitted", "Not permitted"]}
        rows={[
          [
            "Free",
            "Unlimited personal and commercial use of designated free materials in your own products and client work.",
            "Redistributing or reselling the source; including it in a competing asset library or template product.",
          ],
          [
            "Personal",
            "One individual; unlimited personal and commercial projects owned by that individual; static exports for decks, social, and marketing.",
            "Use across a team; deliverables handed to third-party clients as their own asset; redistribution or resale of source.",
          ],
          [
            "Team",
            "Up to a defined seat count within one organization; unlimited projects; client work where the material ships inside a client deliverable; static exports; invoice-suitable receipt.",
            "Redistribution or resale of source; sublicensing the library to clients as a standalone asset; inclusion in templates or asset packs for sale.",
          ],
        ]}
      />

      <DocsH2 id="principles">Licensing principles</DocsH2>
      <DocsUl>
        <li>
          All tiers are perpetual, non-exclusive, and non-transferable.
        </li>
        <li>
          Licenses are versioned. Every order pins the plan and license version
          in force at purchase — later changes never apply retroactively.
        </li>
        <li>
          One universal prohibition: redistributing or reselling source
          packages, including inside templates, starter kits, or asset bundles.
        </li>
        <li>
          Client-work rights are explicit. If you ship work product to a client
          and the material travels with that deliverable, you need Team (or a
          later Extended / Agency tier). Personal covers projects you own, not
          assets the client walks away with as theirs.
        </li>
      </DocsUl>

      <DocsH2 id="faq">Common questions</DocsH2>
      <DocsUl>
        <li>
          <span className="font-medium text-foreground">
            Can I use Free materials in a client project?
          </span>{" "}
          Yes — free SKUs allow commercial and client use. You still may not
          resell the source or pack it into a competing library.
        </li>
        <li>
          <span className="font-medium text-foreground">
            Does Personal cover my agency’s whole studio?
          </span>{" "}
          No. Personal is one individual. Shared seats and client deliverable
          rights are Team.
        </li>
        <li>
          <span className="font-medium text-foreground">
            Can my client reuse the material in other products?
          </span>{" "}
          Not as a standalone licensed asset. Team lets the material ship inside
          the deliverable you built; it does not sublicense Frameline to your
          client as a library.
        </li>
        <li>
          <span className="font-medium text-foreground">
            Are updates included?
          </span>{" "}
          Purchases include access to entitled materials under the pinned license
          version. Catalog additions follow your plan’s material scope (see your
          receipt).
        </li>
      </DocsUl>

      <DocsCallout title="Need the full text?">
        Plain language wins for comprehension; counsel still wants the long
        form. Read{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/license"
        >
          License terms
        </Link>{" "}
        or{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/about"
        >
          About Frameline
        </Link>{" "}
        for product context. Receipts always list plan key and license version.
      </DocsCallout>
    </DocsShell>
  );
}
