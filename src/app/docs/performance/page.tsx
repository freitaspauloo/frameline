import Link from "next/link";

import {
  DocsCallout,
  DocsCode,
  DocsH2,
  DocsP,
  DocsShell,
  DocsTable,
  DocsUl,
} from "@/components/docs-shell";

export default function PerformanceDocsPage() {
  return (
    <DocsShell
      currentPath="/docs/performance"
      description="Every material publishes a measured performance note. Use budgets, pause-when-offscreen, and the CSS-only tier so surfaces stay beautiful without taxing the rest of the page."
      title="Performance"
    >
      <DocsP>
        Frameline’s production bar includes documented cost per material —
        approximate bundle impact, rendering technique, and a note from mid-tier
        device testing. Treat those numbers as release criteria, not marketing
        fluff.
      </DocsP>

      <DocsH2 id="budgets">Perf budgets</DocsH2>
      <DocsTable
        headers={["Tier", "Technique", "Target"]}
        rows={[
          [
            "CSS-only",
            "Gradients, filters, noise via CSS",
            "Negligible JS; fine for many instances",
          ],
          [
            "Canvas / light WebGL",
            "Single full-bleed hero or section",
            "One active instance in view; pause offscreen",
          ],
          [
            "Heavy WebGL",
            "Multi-pass or high-res shaders",
            "Hero-only; prefer static export elsewhere",
          ],
        ]}
      />
      <DocsUl>
        <li>
          Read the specs block on each material page before committing to a
          technique in a dense dashboard layout.
        </li>
        <li>
          Prefer one live material per viewport. Stacking multiple WebGL
          canvases is the fastest way to miss frame budgets.
        </li>
        <li>
          Measure on a mid-tier laptop or phone — not only on a workstation GPU.
        </li>
      </DocsUl>

      <DocsH2 id="intersection-previews">Intersection-activated previews</DocsH2>
      <DocsP>
        Catalog and collection grids use intersection-activated previews:
        WebGL / canvas only mounts while a card is near the viewport. Off-screen
        tiles stay on the static CSS shell, so scrolling a dense grid does not
        mean forty live shaders. Prefer the same pattern in your own lists —
        activate on enter, freeze on leave.
      </DocsP>
      <DocsP>
        On detail pages and single heroes, also pause when the material leaves
        the viewport or the document is hidden:
      </DocsP>
      <DocsCode>{`useEffect(() => {
  const el = ref.current
  if (!el) return

  const io = new IntersectionObserver(
    ([entry]) => setActive(entry.isIntersecting),
    { rootMargin: "100px" },
  )
  io.observe(el)

  const onVis = () => setActive(document.visibilityState === "visible")
  document.addEventListener("visibilitychange", onVis)

  return () => {
    io.disconnect()
    document.removeEventListener("visibilitychange", onVis)
  }
}, [])`}</DocsCode>
      <DocsP>
        Shipped materials that animate should already honor this contract. If
        you fork the source, keep the observer — silent GPU work in a scrolled-away
        footer is a common regression.
      </DocsP>

      <DocsH2 id="css-only">CSS-only tier (8 materials)</DocsH2>
      <DocsP>
        Eight catalog materials are CSS-only — no WebGL, negligible JS — and
        publish honest “negligible GPU” perf notes:
      </DocsP>
      <DocsUl>
        <li>
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/sera-wash"
          >
            Sera Wash
          </Link>
          ,{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/stone-band"
          >
            Stone Band
          </Link>
          ,{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/blue-signal"
          >
            Blue Signal
          </Link>
          ,{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/dusk-veil"
          >
            Dusk Veil
          </Link>
        </li>
        <li>
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/grid-ghost"
          >
            Grid Ghost
          </Link>
          ,{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/stripe-quiet"
          >
            Stripe Quiet
          </Link>
          ,{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/glow-rim"
          >
            Glow Rim
          </Link>
          ,{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
            href="/materials/fog-layer"
          >
            Fog Layer
          </Link>
        </li>
      </DocsUl>
      <DocsP>
        Use CSS-only materials (or forced static mode on WebGL materials) when:
      </DocsP>
      <DocsUl>
        <li>Email, PDF, or static export contexts.</li>
        <li>Low-power devices or data-saver preferences.</li>
        <li>
          Dense UI where many surfaces appear (cards in a grid, table empty
          states).
        </li>
        <li>
          Environments where WebGL is blocked or flaky (locked-down enterprise
          browsers).
        </li>
      </DocsUl>
      <DocsCode>{`<GrainField forceStatic className="absolute inset-0" aria-hidden />`}</DocsCode>

      <DocsCallout title="Measured notes">
        Material pages list dependencies and approximate bundle impact. After
        install, confirm with your own bundler analyzer — tree-shaking and peer
        versions can shift the number. If a material exceeds its published note
        in your build, open a support ticket with the measurement; we treat
        production perf defects as stop-the-line.
      </DocsCallout>

      <DocsP>
        Pair with{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/accessibility#reduced-motion"
        >
          reduced-motion fallbacks
        </Link>{" "}
        — both paths should land on the same static composition when motion is
        off or WebGL fails.
      </DocsP>
    </DocsShell>
  );
}
