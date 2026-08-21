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
      description="Plain-language rights for Free ($0) materials and Screen ($9) templates. Perpetual, non-exclusive, non-transferable — version pinned on every order. Full legal terms live on the license page."
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
            "Free · $0",
            "Unlimited personal and commercial use of Frameline materials in your own products and client work.",
            "Redistributing or reselling the source; including it in a competing asset library or template product.",
          ],
          [
            "Screen · $9",
            "Unlimited Copy prompt + Copy code for the purchased screen template; commercial use of that screen source in your projects.",
            "Material registry treated as a paid unlock; redistributing the screen as a competing template kit.",
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
          Materials are free. The only paid SKU is a screen template unlock at
          $9.
        </li>
      </DocsUl>

      <DocsH2 id="faq">Common questions</DocsH2>
      <DocsUl>
        <li>
          <span className="font-medium text-foreground">
            Can I use Free materials in a client project?
          </span>{" "}
          Yes — materials allow commercial and client use. You still may not
          resell the source or pack it into a competing library.
        </li>
        <li>
          <span className="font-medium text-foreground">
            What does $9 unlock?
          </span>{" "}
          Unlimited prompt and code copies for one screen template. Materials
          stay $0.
        </li>
        <li>
          <span className="font-medium text-foreground">
            Are updates included?
          </span>{" "}
          Purchases include access to the purchased screen under the pinned
          license version. Catalog additions follow your plan’s material scope
          (see your receipt).
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
