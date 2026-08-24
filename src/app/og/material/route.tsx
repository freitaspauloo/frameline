import { ImageResponse } from "next/og";

import { getMaterial } from "@/materials/catalog";
import { getMaterialThumbnail } from "@/materials/thumbnails";

const SIZE = { width: 1200, height: 630 };

/**
 * Satori needs the bytes inline. Failing to load the still is not worth a
 * broken share card, so callers fall back to the gradient.
 */
async function loadThumbnailDataUri(
  slug: string,
  requestUrl: string,
): Promise<string | undefined> {
  const thumbnail = getMaterialThumbnail(slug);
  if (!thumbnail) return undefined;

  try {
    const url = new URL(thumbnail.path, requestUrl);
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) return undefined;

    const contentType = response.headers.get("content-type") ?? "image/webp";
    const base64 = Buffer.from(await response.arrayBuffer()).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return undefined;
  }
}

function surfaceGradient(colors: string[] | undefined): string {
  const stops = colors?.filter(Boolean) ?? [];
  if (stops.length === 0) {
    return "linear-gradient(135deg, #2D6BFF 0%, #0A0A0A 55%, #F7F5F0 100%)";
  }
  if (stops.length === 1) {
    return `linear-gradient(135deg, ${stops[0]} 0%, #0A0A0A 70%)`;
  }
  if (stops.length === 2) {
    return `linear-gradient(135deg, ${stops[0]} 0%, ${stops[1]} 55%, #0A0A0A 100%)`;
  }
  const a = stops[0];
  const b = stops[1];
  const c = stops[2];
  const d = stops[3] ?? stops[0];
  return `linear-gradient(135deg, ${a} 0%, ${b} 35%, ${c} 70%, ${d} 100%)`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim() ?? "";
  const material = slug ? getMaterial(slug) : undefined;

  const title = material?.title ?? "Frameline";
  const tier = material ? "Free" : "Materials";
  const type = material?.type ?? "surface";
  const colors = material?.fallbackColors ?? ["#2D6BFF", "#0A0A0A", "#F7F5F0"];
  const accent = colors[0] ?? "#2D6BFF";
  const surface = surfaceGradient(colors);
  const thumbnail = material
    ? await loadThumbnailDataUri(material.slug, request.url)
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0A0A0A",
          position: "relative",
        }}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element -- satori renders raw JSX, next/image does not apply
          <img
            alt=""
            height={SIZE.height}
            src={thumbnail}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "cover",
            }}
            width={SIZE.width}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              backgroundImage: surface,
              opacity: 0.92,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.88) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
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
                  color: "#FFFFFF",
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
                color: "rgba(255,255,255,0.72)",
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
                color: "rgba(255,255,255,0.72)",
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
                color: "#FFFFFF",
                fontFamily: "Georgia, serif",
                maxWidth: 980,
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </div>
    ),
    SIZE,
  );
}
