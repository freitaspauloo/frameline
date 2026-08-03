import Link from "next/link";

import {
  DocsCallout,
  DocsCode,
  DocsH2,
  DocsInlineCode,
  DocsP,
  DocsShell,
  DocsUl,
} from "@/components/docs-shell";

export default function AccessibilityDocsPage() {
  return (
    <DocsShell
      currentPath="/docs/accessibility"
      description="Animated materials must not fight assistive tech or motion sensitivity. Frameline’s bar: real static fallbacks, decorative ARIA, and documented contrast for text layered on top."
      title="Accessibility"
    >
      <DocsP>
        Surfaces are visual craft, not content. Treat them as decoration: hide
        them from the accessibility tree, keep focusable UI outside the canvas,
        and always ship a considered reduced-motion composition.
      </DocsP>

      <DocsH2 id="reduced-motion">prefers-reduced-motion</DocsH2>
      <DocsP>
        Materials wrap motion in a shell that reads{" "}
        <DocsInlineCode>(prefers-reduced-motion: reduce)</DocsInlineCode>. When
        it matches, the live renderer is not mounted — a static gradient (or
        still) takes its place.
      </DocsP>
      <DocsCode>{`// Pattern used by MaterialShell
const reduced = usePrefersReducedMotion()
const showStatic = forceStatic || !mounted || reduced

return showStatic
  ? <div aria-hidden style={fallbackGradient} />
  : children`}</DocsCode>
      <DocsUl>
        <li>
          A frozen frame of an animation is not enough. Fallbacks use the same
          token colors arranged as a deliberate still composition.
        </li>
        <li>
          Test with OS settings and DevTools emulation — both should trigger the
          static path.
        </li>
        <li>
          Do not reintroduce motion with CSS keyframes on the fallback layer.
        </li>
      </DocsUl>

      <DocsH2 id="decorative">Decorative ARIA</DocsH2>
      <DocsUl>
        <li>
          Mark the material root{" "}
          <DocsInlineCode>aria-hidden</DocsInlineCode> (or{" "}
          <DocsInlineCode>role=&quot;presentation&quot;</DocsInlineCode>) when it
          does not convey meaning.
        </li>
        <li>
          Never put interactive controls inside the WebGL/canvas tree. Keep CTAs,
          links, and form fields in a sibling layer with normal document order.
        </li>
        <li>
          Materials must not trap focus or steal pointer events from overlays —
          use <DocsInlineCode>pointer-events-none</DocsInlineCode> on the surface
          when content sits above it.
        </li>
        <li>
          If you need an accessible name for a marketing demo, put it on the
          section heading — not on the canvas.
        </li>
      </DocsUl>

      <DocsH2 id="contrast">Contrast for layered text</DocsH2>
      <DocsP>
        Each material’s detail page includes contrast guidance for foreground
        text. Rules of thumb:
      </DocsP>
      <DocsUl>
        <li>
          Prefer light text on dark-tinted scrims (
          <DocsInlineCode>bg-black/40</DocsInlineCode> or a tokenized overlay)
          rather than guessing against a busy mesh.
        </li>
        <li>
          High-frequency dither and grain can reduce effective contrast —
          increase type weight or add a solid panel behind copy.
        </li>
        <li>
          Check both light and dark token sets; a pass in one theme is not a
          pass in the other.
        </li>
      </DocsUl>

      <DocsCallout title="Configurator a11y">
        On frameline.ai, material configurators are keyboard-operable with
        labeled controls. When you build your own props UI, mirror that:
        every slider and color field needs a visible label and a focus ring that
        meets WCAG.
      </DocsCallout>

      <DocsP>
        Also see{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/performance"
        >
          performance pause behavior
        </Link>{" "}
        (background tabs) and{" "}
        <Link
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          href="/docs/troubleshooting#webgl"
        >
          WebGL failures
        </Link>
        .
      </DocsP>
    </DocsShell>
  );
}
