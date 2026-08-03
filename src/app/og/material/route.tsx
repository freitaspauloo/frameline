import { ImageResponse } from "next/og";

import { getMaterial } from "@/materials/catalog";

const SIZE = { width: 1200, height: 630 };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim() ?? "";
  const material = slug ? getMaterial(slug) : undefined;

  const title = material?.title ?? "Frameline";
  const tier = material
    ? material.tier === "free"
      ? "Free"
      : material.tier === "team"
        ? "Team"
        : "Personal"
    : "Materials";
  const type = material?.type ?? "surface";
  const accent = material?.fallbackColors?.[0] ?? "#2D6BFF";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F5F0",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: accent,
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
              }}
            >
              Frameline
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B6B6B",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            {tier}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B6B6B",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            {`${type} material`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#0A0A0A",
              fontFamily: "Georgia, serif",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 12,
            width: "100%",
            background: `linear-gradient(90deg, ${accent} 0%, #0A0A0A 55%, #F7F5F0 100%)`,
          }}
        />
      </div>
    ),
    SIZE,
  );
}
