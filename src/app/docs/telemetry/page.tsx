import Link from "next/link";

import {
  DocsCallout,
  DocsCode,
  DocsH2,
  DocsInlineCode,
  DocsP,
  DocsShell,
  DocsTable,
  DocsUl,
} from "@/components/docs-shell";

export const metadata = {
  title: "Telemetry — Frameline docs",
  description:
    "What Frameline records when you copy a material or screen, what the copied code fetches, and how to turn it off.",
};

export default function TelemetryDocsPage() {
  return (
    <DocsShell
      currentPath="/docs/telemetry"
      description="Copied code points at Frameline for its manifest and media, so pasting it makes requests we can see. Here is exactly what those are and how to remove them."
      title="Telemetry"
    >
      <DocsP>
        Frameline counts copies, and it counts what happens to the code after
        you copy it. That second part is only possible because the payload you
        copy contains Frameline URLs — a manifest link, and hosted media. When
        your editor, agent, or browser resolves one of those, we see a request.
        Nothing is hidden in the code, and nothing runs on your machine to
        report back.
      </DocsP>

      <DocsCallout title="No tracking code in what you paste">
        The copied source contains no analytics snippet, no beacon, and no
        install hook. It is the same component source we ship, with asset paths
        pointing at our CDN instead of an empty folder in your project.
      </DocsCallout>

      <DocsH2 id="what-is-recorded">What is recorded</DocsH2>
      <DocsTable
        headers={["Event", "When", "What it carries"]}
        rows={[
          [
            "copy",
            "You press Copy prompt or Copy code",
            "Slug, which path, whether you own it, a random copy id",
          ],
          [
            "registry_fetch",
            "Something resolves /r/{name}.json",
            "Slug, copy id, User-Agent, hashed IP",
          ],
          [
            "asset_fetch",
            "Hosted media loads from /a/…",
            "Slug, file, copy id, User-Agent, hashed IP",
          ],
          [
            "order / subscription events",
            "Checkout, renewal, refund, cancellation",
            "Email, plan, amount",
          ],
        ]}
      />

      <DocsP>
        The copy id is a random string minted per copy. Its only job is to link
        a copy to the fetch it later causes, so we can tell which materials get
        used rather than just clicked. It is not derived from your account, and
        signed-out copies stay anonymous.
      </DocsP>

      <DocsH2 id="ip-addresses">IP addresses</DocsH2>
      <DocsP>
        Raw IP addresses are never stored. They are salted and hashed on
        arrival, and only the truncated hash is written, which supports abuse
        triage and rough unique counts without being reversible.
      </DocsP>

      <DocsH2 id="user-agents">User agents</DocsH2>
      <DocsP>
        We classify the User-Agent into a tool — Cursor, Claude Code, Copilot,
        Windsurf, a shadcn CLI run, a plain browser — and keep the raw string so
        new tools can be recognized later. We do not fingerprint beyond this.
      </DocsP>

      <DocsH2 id="opting-out">Opting out</DocsH2>
      <DocsP>
        Self-host the assets. Download the media, drop it under your own{" "}
        <DocsInlineCode>public/</DocsInlineCode> directory, and replace the
        Frameline URLs in the copied source with local paths:
      </DocsP>
      <DocsCode>{`// before
<video poster="https://frameline.ai/a/screens/spaceman-moon/poster.png?c=…"
       src="https://frameline.ai/a/screens/spaceman-moon/hero.mp4?c=…" />

// after — self-hosted, no requests to Frameline
<video poster="/screens/spaceman-moon/poster.png"
       src="/screens/spaceman-moon/hero.mp4" />`}</DocsCode>
      <DocsP>
        Deleting the manifest comment at the top of the copied file removes the
        other link. Neither change affects your license or how the component
        behaves.
      </DocsP>

      <DocsH2 id="not-collected">What we never collect</DocsH2>
      <DocsUl>
        <li>Your source code, project names, or file contents.</li>
        <li>Anything from your editor beyond the User-Agent it sends.</li>
        <li>Raw IP addresses.</li>
        <li>Third-party analytics — no data is sold or shared.</li>
      </DocsUl>

      <DocsP>
        Questions or a deletion request:{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/contact"
        >
          /contact
        </Link>
        . Licensing terms are separate and live at{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/licensing"
        >
          /docs/licensing
        </Link>
        .
      </DocsP>
    </DocsShell>
  );
}
