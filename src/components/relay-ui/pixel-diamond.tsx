import { cn } from "@/lib/utils";

/** Fable 5 · pixel-diamond palette derived from reference art */
const PIXEL_DIAMOND = {
  core: "#E25555",
  mid: "#F0A8A8",
  edge: "#FCEAEA",
  grid: 13,
  center: 6,
} as const;

const DIAMOND_ROW_WIDTHS = [1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3, 1] as const;

function pixelColor(row: number, col: number): string {
  const { center, core, mid, edge } = PIXEL_DIAMOND;
  const dr = Math.abs(row - center);
  const dc = Math.abs(col - center);
  const dist = Math.hypot(dr, dc) / center;

  if (dist < 0.35) return core;
  if (dist < 0.65) return mid;
  return edge;
}

function buildDiamondPixels() {
  const pixels: { row: number; col: number; color: string }[] = [];

  DIAMOND_ROW_WIDTHS.forEach((width, row) => {
    const startCol = Math.floor((PIXEL_DIAMOND.grid - width) / 2);
    for (let i = 0; i < width; i++) {
      const col = startCol + i;
      pixels.push({ row, col, color: pixelColor(row, col) });
    }
  });

  return pixels;
}

const DIAMOND_PIXELS = buildDiamondPixels();

type PixelDiamondProps = {
  className?: string;
  /** Pixel size in SVG units (default 4 → 52×52 viewBox) */
  pixelSize?: number;
};

/**
 * Pixel-art diamond with radial red glow — recreated from reference asset.
 * Fable 5: tokens first, grid-generated geometry, no raster dependency.
 */
export function PixelDiamond({ className, pixelSize = 4 }: PixelDiamondProps) {
  const size = PIXEL_DIAMOND.grid * pixelSize;

  return (
    <svg
      aria-hidden
      className={cn("shrink-0", className)}
      fill="none"
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {DIAMOND_PIXELS.map(({ row, col, color }) => (
        <rect
          key={`${row}-${col}`}
          fill={color}
          height={pixelSize}
          width={pixelSize}
          x={col * pixelSize}
          y={row * pixelSize}
        />
      ))}
    </svg>
  );
}

export { PIXEL_DIAMOND };
