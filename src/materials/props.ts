/**
 * Props-as-data registry for material detail configurators and docs.
 * Interactive controls are derived from these defs in the detail page.
 */

export type MaterialPropDef = {
  key: string;
  label: string;
  kind: "number" | "color" | "colors";
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string | string[];
  description?: string;
};

function n(
  key: string,
  label: string,
  defaultValue: number,
  opts: { min?: number; max?: number; step?: number; description?: string } = {},
): MaterialPropDef {
  return { key, label, kind: "number", defaultValue, ...opts };
}

function color(
  key: string,
  label: string,
  defaultValue: string,
  description?: string,
): MaterialPropDef {
  return { key, label, kind: "color", defaultValue, description };
}

function colors(
  key: string,
  label: string,
  defaultValue: string[],
  description?: string,
): MaterialPropDef {
  return { key, label, kind: "colors", defaultValue, description };
}

/** Number prop exposed in the configurator (has min/max). */
function field(
  key: string,
  label: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number,
  description?: string,
): MaterialPropDef {
  return n(key, label, defaultValue, { min, max, step, description });
}

export const MATERIAL_PROPS: Record<string, MaterialPropDef[]> = {
  "aurora-mesh": [
    field("speed", "Speed", 0.47, 0, 2, 0.01, "Animation speed"),
    field("distortion", "Distortion", 0.8, 0, 1, 0.01, "Mesh warp amount"),
    field("swirl", "Swirl", 0.5, 0, 1, 0.01, "Rotational flow"),
    field("scale", "Scale", 0.69, 0.2, 2, 0.01, "Pattern scale"),
    colors("colors", "Colors", ["#E3FFFE", "#C5F0FF", "#FF008D", "#B700FF"], "Mesh color stops"),
  ],
  "ink-dither": [
    field("speed", "Speed", 0.35, 0, 2, 0.01, "Animation speed"),
    field("size", "Size", 3, 1, 12, 0.5, "Dither cell size"),
    color("colorBack", "Back", "#FFFFFF", "Background color"),
    color("colorFront", "Front", "#2D6BFF", "Foreground color"),
  ],
  "grain-field": [
    field("speed", "Speed", 0.4, 0, 2, 0.01, "Animation speed"),
    field("softness", "Softness", 0.65, 0, 1, 0.01, "Edge softness"),
    field("intensity", "Intensity", 0.45, 0, 1, 0.01, "Grain strength"),
    field("noise", "Noise", 0.35, 0, 1, 0.01, "Noise amount"),
    colors("colors", "Colors", ["#F4F1EA", "#D4C4A8", "#2D6BFF", "#0A0A0A"], "Grain color stops"),
  ],
  "neuro-veil": [
    field("speed", "Speed", 0.6, 0, 2, 0.01, "Animation speed"),
    field("brightness", "Brightness", 0.08, 0, 1, 0.01, "Overall brightness"),
    field("contrast", "Contrast", 0.35, 0, 1, 0.01, "Contrast amount"),
    field("scale", "Scale", 1, 0.2, 2, 0.01, "Pattern scale"),
    color("colorFront", "Front", "#E8F0FF", "Highlight color"),
    color("colorMid", "Mid", "#2D6BFF", "Midtone color"),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
  ],
  "tide-wave": [
    field("scale", "Scale", 0.7, 0.2, 2, 0.01, "Pattern scale"),
    field("shape", "Shape", 1.2, 0, 3, 0.01, "Wave shape"),
    field("frequency", "Frequency", 0.45, 0, 2, 0.01, "Wave frequency"),
    field("amplitude", "Amplitude", 0.4, 0, 1, 0.01, "Wave height"),
    field("spacing", "Spacing", 1.1, 0, 2, 0.01, "Band spacing"),
    n("proportion", "Proportion", 0.35, { description: "Fill proportion (preview-only default)" }),
    field("softness", "Softness", 0.15, 0, 1, 0.01, "Edge softness"),
    color("colorFront", "Front", "#2D6BFF", "Wave color"),
    color("colorBack", "Back", "#0B1C2D", "Background color"),
  ],
  "cell-voronoi": [
    field("speed", "Speed", 0.4, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 0.55, 0.2, 2, 0.01, "Cell scale"),
    field("distortion", "Distortion", 0.35, 0, 0.5, 0.01, "Cell warp"),
    field("gap", "Gap", 0.03, 0, 0.1, 0.005, "Gap between cells"),
    field("glow", "Glow", 0.15, 0, 1, 0.01, "Edge glow"),
    colors("colors", "Colors", ["#F4F1EA", "#C8BBA8", "#2D6BFF"], "Cell fill colors"),
    color("colorGap", "Gap", "#0A0A0A", "Gap color"),
    color("colorGlow", "Glow", "#FFFFFF", "Glow color"),
  ],
  "ink-swirl": [
    field("speed", "Speed", 0.32, 0, 2, 0.01, "Animation speed"),
    field("bandCount", "Bands", 4, 0, 15, 1, "Number of ink bands"),
    field("twist", "Twist", 0.45, 0, 1, 0.01, "Twist amount"),
    field("center", "Center", 0.2, 0, 1, 0.01, "Center bias"),
    field("softness", "Softness", 0.2, 0, 1, 0.01, "Edge softness"),
    field("noise", "Noise", 0.15, 0, 1, 0.01, "Noise amount"),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
    colors("colors", "Colors", ["#2D6BFF", "#5B8CFF", "#1A3A8F"], "Band colors"),
  ],
  "signal-dots": [
    field("size", "Size", 2.5, 1, 20, 0.5, "Dot size"),
    field("gapX", "Gap X", 28, 8, 80, 1, "Horizontal gap"),
    field("gapY", "Gap Y", 28, 8, 80, 1, "Vertical gap"),
    n("sizeRange", "Size range", 0, { description: "Dot size variation (preview-only default)" }),
    field("opacityRange", "Opacity range", 0.15, 0, 1, 0.01, "Opacity variation"),
    color("colorBack", "Back", "#F7F5F0", "Background color"),
    color("colorFill", "Fill", "#2D6BFF", "Dot fill"),
    color("colorStroke", "Stroke", "#2D6BFF", "Dot stroke"),
  ],
  "ember-warp": [
    field("speed", "Speed", 0.7, 0, 2, 0.01, "Animation speed"),
    field("proportion", "Proportion", 0.45, 0, 1, 0.01, "Fill proportion"),
    field("softness", "Softness", 0.85, 0, 1, 0.01, "Edge softness"),
    field("distortion", "Distortion", 0.3, 0, 1, 0.01, "Warp amount"),
    field("swirl", "Swirl", 0.65, 0, 1, 0.01, "Rotational flow"),
    field("shapeScale", "Shape scale", 0.12, 0, 1, 0.01, "Shape scale"),
    colors("colors", "Colors", ["#0A0A0A", "#C45C26", "#1A1210", "#E8A05C"], "Warp color stops"),
  ],
  "halo-rays": [
    field("speed", "Speed", 0.65, 0, 2, 0.01, "Animation speed"),
    field("density", "Density", 0.35, 0, 1, 0.01, "Ray density"),
    field("spotty", "Spotty", 0.28, 0, 1, 0.01, "Spotty variation"),
    n("midIntensity", "Mid intensity", 0.45, { description: "Mid-ray intensity (preview-only default)" }),
    field("midSize", "Mid size", 0.22, 0, 1, 0.01, "Mid-ray size"),
    field("intensity", "Intensity", 0.75, 0, 1, 0.01, "Overall intensity"),
    field("bloom", "Bloom", 0.35, 0, 1, 0.01, "Bloom amount"),
    field("scale", "Scale", 1, 0.2, 2, 0.01, "Pattern scale"),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
    color("colorBloom", "Bloom", "#2D6BFF", "Bloom color"),
    colors("colors", "Colors", ["#2D6BFF", "#5B8CFF", "#E8F0FF", "#1A3A8F"], "Ray colors"),
  ],
  "ink-metaballs": [
    field("speed", "Speed", 0.55, 0, 2, 0.01, "Animation speed"),
    field("count", "Count", 12, 1, 20, 1, "Blob count"),
    field("size", "Size", 0.72, 0, 1, 0.01, "Blob size"),
    field("scale", "Scale", 1.2, 0.2, 4, 0.01, "Field scale"),
    color("colorBack", "Back", "#F4F1EA", "Background color"),
    colors("colors", "Colors", ["#2D6BFF", "#C8BBA8", "#0A0A0A", "#5B8CFF"], "Blob colors"),
  ],
  "smoke-ring": [
    field("speed", "Speed", 0.45, 0, 2, 0.01, "Animation speed"),
    field("noiseScale", "Noise scale", 2.4, 0.01, 5, 0.01, "Noise frequency"),
    field("noiseIterations", "Iterations", 6, 1, 8, 1, "Noise octaves"),
    field("radius", "Radius", 0.32, 0, 1, 0.01, "Ring radius"),
    field("thickness", "Thickness", 0.55, 0.01, 1, 0.01, "Ring thickness"),
    field("innerShape", "Inner shape", 0.75, 0, 4, 0.01, "Inner falloff"),
    field("scale", "Scale", 0.9, 0.2, 2, 0.01, "Pattern scale"),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
    colors("colors", "Colors", ["#E8E4DC", "#2D6BFF", "#C8BBA8"], "Smoke colors"),
  ],
  "simplex-field": [
    field("speed", "Speed", 0.4, 0, 2, 0.01, "Animation speed"),
    field("softness", "Softness", 0.35, 0, 1, 0.01, "Band softness"),
    field("stepsPerColor", "Steps", 2, 1, 10, 1, "Steps per color"),
    field("scale", "Scale", 0.7, 0.2, 2, 0.01, "Pattern scale"),
    colors(
      "colors",
      "Colors",
      ["#F4F1EA", "#2D6BFF", "#C8BBA8", "#0A0A0A", "#E8E4DC"],
      "Noise color stops",
    ),
  ],
  "halftone-signal": [
    field("speed", "Speed", 0.2, 0, 2, 0.01, "Animation speed"),
    field("size", "Size", 0.55, 0, 1, 0.01, "Dot size"),
    field("radius", "Radius", 1.2, 0, 2, 0.01, "Dot radius"),
    field("contrast", "Contrast", 0.45, 0, 1, 0.01, "Contrast"),
    field("grainMixer", "Grain mixer", 0.15, 0, 1, 0.01, "Grain mix"),
    field("grainOverlay", "Grain overlay", 0.18, 0, 1, 0.01, "Grain overlay"),
    color("colorBack", "Back", "#F4F1EA", "Background color"),
    color("colorFront", "Front", "#2D6BFF", "Foreground color"),
  ],
  "liquid-chrome": [
    field("speed", "Speed", 0.8, 0, 2, 0.01, "Animation speed"),
    field("distortion", "Distortion", 0.12, 0, 1, 0.01, "Surface warp"),
    field("repetition", "Repetition", 2.2, 1, 10, 0.1, "Pattern repetition"),
    n("shiftRed", "Shift red", 0.25, { description: "Red channel shift (preview-only default)" }),
    n("shiftBlue", "Shift blue", 0.35, { description: "Blue channel shift (preview-only default)" }),
    field("contour", "Contour", 0.35, 0, 1, 0.01, "Contour strength"),
    field("softness", "Softness", 0.15, 0, 1, 0.01, "Edge softness"),
    field("angle", "Angle", 70, 0, 360, 1, "Light angle"),
    field("scale", "Scale", 0.85, 0.2, 2, 0.01, "Pattern scale"),
    color("colorBack", "Back", "#1A1A1C", "Background color"),
    color("colorTint", "Tint", "#2D6BFF", "Metal tint"),
  ],
  "panel-glass": [
    field("speed", "Speed", 1, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 0.9, 0.2, 2, 0.01, "Pattern scale"),
    field("angle1", "Angle 1", 0.3, -1, 1, 0.01, "Panel angle A"),
    field("angle2", "Angle 2", 0.3, -1, 1, 0.01, "Panel angle B"),
    field("length", "Length", 1, 0, 3, 0.01, "Panel length"),
    field("blur", "Blur", 0.25, 0, 0.5, 0.01, "Blur amount"),
    field("fadeIn", "Fade in", 0.85, 0, 1, 0.01, "Fade in"),
    field("fadeOut", "Fade out", 0.3, 0, 1, 0.01, "Fade out"),
    field("density", "Density", 1.6, 0.25, 7, 0.05, "Panel density"),
    n("gradient", "Gradient", 0, { description: "Gradient mix (preview-only default)" }),
    color("colorBack", "Back", "#FFFFFF", "Background color"),
    colors("colors", "Colors", ["#00CFFF", "#FF2D55", "#34C759", "#AF52DE"], "Panel colors"),
  ],
  "orbit-dots": [
    field("speed", "Speed", 0.45, 0, 3, 0.01, "Animation speed"),
    field("scale", "Scale", 0.7, 0.2, 2, 0.01, "Pattern scale"),
    field("size", "Size", 0.55, 0, 1, 0.01, "Dot size"),
    field("sizeRange", "Size range", 0.25, 0, 1, 0.01, "Size variation"),
    field("spreading", "Spreading", 0.85, 0, 1, 0.01, "Orbit spread"),
    field("stepsPerColor", "Steps", 3, 1, 8, 1, "Steps per color"),
    color("colorBack", "Back", "#F7F5F0", "Background color"),
    colors("colors", "Colors", ["#2D6BFF", "#5B8CFF", "#E8F0FF"], "Orbit colors"),
  ],
  "spiral-ink": [
    field("speed", "Speed", 0.55, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 1, 0.2, 2, 0.01, "Pattern scale"),
    field("density", "Density", 0.85, 0, 2, 0.01, "Stroke density"),
    n("distortion", "Distortion", 0.15, { description: "Path warp (preview-only default)" }),
    field("strokeWidth", "Stroke", 0.55, 0, 1, 0.01, "Stroke width"),
    n("strokeTaper", "Stroke taper", 0.12, { description: "Stroke taper (preview-only default)" }),
    n("strokeCap", "Stroke cap", 0.4, { description: "Stroke cap (preview-only default)" }),
    field("noise", "Noise", 0.2, 0, 1, 0.01, "Noise amount"),
    n("noiseFrequency", "Noise frequency", 0.28, {
      description: "Noise frequency (preview-only default)",
    }),
    field("softness", "Softness", 0.08, 0, 1, 0.01, "Edge softness"),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
    color("colorFront", "Front", "#2D6BFF", "Ink color"),
  ],
  "perlin-moss": [
    field("speed", "Speed", 0.15, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 1.4, 0.2, 4, 0.01, "Pattern scale"),
    field("proportion", "Proportion", 0.55, 0, 1, 0.01, "Fill proportion"),
    field("softness", "Softness", 0.35, 0, 1, 0.01, "Edge softness"),
    field("octaveCount", "Octaves", 4, 1, 8, 1, "Noise octaves"),
    field("persistence", "Persistence", 0.7, 0, 1, 0.01, "Octave persistence"),
    field("lacunarity", "Lacunarity", 2.2, 1, 4, 0.05, "Octave frequency ratio"),
    color("colorBack", "Back", "#1A2E1A", "Background color"),
    color("colorFront", "Front", "#7CB87C", "Moss color"),
  ],
  "pulse-frame": [
    field("speed", "Speed", 0.7, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 0.75, 0.2, 2, 0.01, "Frame scale"),
    field("roundness", "Roundness", 0.2, 0, 1, 0.01, "Corner roundness"),
    field("thickness", "Thickness", 0.12, 0, 1, 0.01, "Border thickness"),
    field("softness", "Softness", 0.7, 0, 1, 0.01, "Edge softness"),
    n("intensity", "Intensity", 0.25, { description: "Glow intensity (preview-only default)" }),
    field("bloom", "Bloom", 0.3, 0, 1, 0.01, "Bloom amount"),
    field("spots", "Spots", 4, 1, 10, 1, "Spot count"),
    n("spotSize", "Spot size", 0.45, { description: "Spot size (preview-only default)" }),
    field("pulse", "Pulse", 0.3, 0, 1, 0.01, "Pulse amount"),
    field("smoke", "Smoke", 0.25, 0, 1, 0.01, "Smoke amount"),
    n("smokeSize", "Smoke size", 0.55, { description: "Smoke size (preview-only default)" }),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
    colors("colors", "Colors", ["#2D6BFF", "#5B8CFF", "#AF52DE"], "Border colors"),
  ],
  "water-sheet": [
    field("speed", "Speed", 0.7, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 0.85, 0.2, 2, 0.01, "Pattern scale"),
    field("size", "Size", 1.1, 0.2, 3, 0.01, "Caustic size"),
    field("waves", "Waves", 0.35, 0, 1, 0.01, "Wave amount"),
    field("caustic", "Caustic", 0.18, 0, 1, 0.01, "Caustic strength"),
    field("highlights", "Highlights", 0.12, 0, 1, 0.01, "Highlight amount"),
    field("layering", "Layering", 0.55, 0, 1, 0.01, "Layer depth"),
    field("edges", "Edges", 0.75, 0, 1, 0.01, "Edge definition"),
    color("colorBack", "Back", "#1A4A6B", "Background color"),
    color("colorHighlight", "Highlight", "#E8F4FF", "Highlight color"),
  ],
  "still-mesh": [
    field("positions", "Positions", 18, 1, 40, 1, "Mesh control points"),
    field("waveX", "Wave X", 0.7, 0, 1, 0.01, "Horizontal wave"),
    field("waveY", "Wave Y", 0.85, 0, 1, 0.01, "Vertical wave"),
    field("mixing", "Mixing", 0.7, 0, 1, 0.01, "Color mixing"),
    field("grainMixer", "Grain mixer", 0.08, 0, 1, 0.01, "Grain mix"),
    field("grainOverlay", "Grain overlay", 0.12, 0, 1, 0.01, "Grain overlay"),
    field("rotation", "Rotation", 200, 0, 360, 1, "Rotation degrees"),
    n("waveXShift", "Wave X shift", 0.4, { description: "Horizontal wave shift" }),
    n("waveYShift", "Wave Y shift", 0.3, { description: "Vertical wave shift" }),
    colors("colors", "Colors", ["#FF6B35", "#1A1210", "#2D6BFF", "#F4E8D8"], "Mesh color stops"),
  ],
  "paper-tooth": [
    field("contrast", "Contrast", 0.35, 0, 1, 0.01, "Texture contrast"),
    field("roughness", "Roughness", 0.45, 0, 1, 0.01, "Surface roughness"),
    field("fiber", "Fiber", 0.35, 0, 1, 0.01, "Fiber amount"),
    field("fiberSize", "Fiber size", 0.22, 0, 1, 0.01, "Fiber scale"),
    field("crumples", "Crumples", 0.25, 0, 1, 0.01, "Crumple amount"),
    field("folds", "Folds", 0.4, 0, 1, 0.01, "Fold amount"),
    field("scale", "Scale", 0.65, 0.2, 2, 0.01, "Pattern scale"),
    n("crumpleSize", "Crumple size", 0.4, { description: "Crumple scale" }),
    n("foldCount", "Fold count", 4, { description: "Number of folds" }),
    n("fade", "Fade", 0.1, { description: "Edge fade" }),
    n("drops", "Drops", 0.15, { description: "Drop marks" }),
    n("seed", "Seed", 7.2, { description: "Noise seed" }),
    color("colorFront", "Front", "#C8BBA8", "Foreground color"),
    color("colorBack", "Back", "#F7F5F0", "Background color"),
  ],
  "gem-haze": [
    field("speed", "Speed", 0.65, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 0.7, 0.2, 2, 0.01, "Pattern scale"),
    field("size", "Size", 0.85, 0, 2, 0.01, "Gem size"),
    field("outerGlow", "Outer glow", 0.6, 0, 1, 0.01, "Outer glow"),
    field("innerGlow", "Inner glow", 0.9, 0, 1, 0.01, "Inner glow"),
    field("innerDistortion", "Inner distortion", 0.75, 0, 1, 0.01, "Inner warp"),
    field("outerDistortion", "Outer distortion", 0.55, 0, 1, 0.01, "Outer warp"),
    field("angle", "Angle", 15, 0, 360, 1, "Rotation angle"),
    n("offset", "Offset", 0.05, { description: "Center offset" }),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
    color("colorInner", "Inner", "#1A1A2E", "Inner color"),
    colors("colors", "Colors", ["#2D6BFF", "#AF52DE", "#E8F0FF"], "Smoke colors"),
  ],
  "cmyk-halftone": [
    field("size", "Size", 0.28, 0, 1, 0.01, "Dot size"),
    field("contrast", "Contrast", 1, 0, 2, 0.01, "Contrast"),
    field("softness", "Softness", 0.7, 0, 1, 0.01, "Dot softness"),
    field("grainMixer", "Grain mixer", 0.05, 0, 1, 0.01, "Grain mix"),
    field("grainOverlay", "Grain overlay", 0.08, 0, 1, 0.01, "Grain overlay"),
    field("scale", "Scale", 1, 0.2, 2, 0.01, "Pattern scale"),
    n("grainSize", "Grain size", 0.4, { description: "Grain scale" }),
    n("gridNoise", "Grid noise", 0.25, { description: "Grid noise" }),
    n("floodC", "Flood C", 0.2, { description: "Cyan flood" }),
    n("floodM", "Flood M", 0.1, { description: "Magenta flood" }),
    n("floodY", "Flood Y", 0.05, { description: "Yellow flood" }),
    n("floodK", "Flood K", 0.05, { description: "Black flood" }),
    n("gainC", "Gain C", 0.35, { description: "Cyan gain" }),
    n("gainM", "Gain M", 0.15, { description: "Magenta gain" }),
    n("gainY", "Gain Y", 0.2, { description: "Yellow gain" }),
    n("gainK", "Gain K", 0.1, { description: "Black gain" }),
    color("colorBack", "Back", "#FBFAF5", "Background color"),
    color("colorC", "Cyan", "#00B4FF", "Cyan plate"),
    color("colorM", "Magenta", "#FC519F", "Magenta plate"),
    color("colorY", "Yellow", "#FFD800", "Yellow plate"),
    color("colorK", "Key", "#231F20", "Black plate"),
  ],
  "radial-still": [
    field("radius", "Radius", 0.9, 0, 2, 0.01, "Radial radius"),
    field("focalDistance", "Focal distance", 0.65, 0, 1, 0.01, "Focal distance"),
    field("focalAngle", "Focal angle", 40, 0, 360, 1, "Focal angle"),
    field("falloff", "Falloff", 0.2, 0, 1, 0.01, "Edge falloff"),
    field("mixing", "Mixing", 0.55, 0, 1, 0.01, "Color mixing"),
    field("distortion", "Distortion", 0.15, 0, 1, 0.01, "Warp amount"),
    field("scale", "Scale", 1, 0.2, 2, 0.01, "Pattern scale"),
    n("distortionShift", "Distortion shift", 0.1, { description: "Warp shift" }),
    n("distortionFreq", "Distortion freq", 10, { description: "Warp frequency" }),
    n("grainMixer", "Grain mixer", 0.06, { description: "Grain mix" }),
    n("grainOverlay", "Grain overlay", 0.1, { description: "Grain overlay" }),
    color("colorBack", "Back", "#0A0A0A", "Background color"),
    colors("colors", "Colors", ["#2D6BFF", "#5B8CFF", "#E8F0FF"], "Radial color stops"),
  ],
  "mesh-still": [
    field("positions", "Positions", 4, 1, 40, 1, "Mesh control points"),
    field("waveX", "Wave X", 0.5, 0, 1, 0.01, "Horizontal wave"),
    field("waveY", "Wave Y", 0.9, 0, 1, 0.01, "Vertical wave"),
    field("mixing", "Mixing", 0.55, 0, 1, 0.01, "Color mixing"),
    field("grainOverlay", "Grain overlay", 0.05, 0, 1, 0.01, "Grain overlay"),
    field("rotation", "Rotation", 0, 0, 360, 1, "Rotation degrees"),
    n("waveXShift", "Wave X shift", 0.15, { description: "Horizontal wave shift" }),
    n("waveYShift", "Wave Y shift", 0.55, { description: "Vertical wave shift" }),
    n("grainMixer", "Grain mixer", 0, { description: "Grain mix" }),
    colors("colors", "Colors", ["#013B65", "#03738C", "#A3D3FF", "#F2FAEF"], "Mesh color stops"),
  ],
  "aurora-dusk": [
    field("speed", "Speed", 0.32, 0, 2, 0.01, "Animation speed"),
    field("distortion", "Distortion", 0.65, 0, 1, 0.01, "Mesh warp amount"),
    field("swirl", "Swirl", 0.7, 0, 1, 0.01, "Rotational flow"),
    field("scale", "Scale", 0.85, 0.2, 2, 0.01, "Pattern scale"),
    colors("colors", "Colors", ["#1A1210", "#C45C26", "#E8A05C", "#2D4A6B"], "Mesh color stops"),
  ],
  "ink-dither-soft": [
    field("speed", "Speed", 0.2, 0, 2, 0.01, "Animation speed"),
    field("size", "Size", 4.5, 1, 12, 0.5, "Dither cell size"),
    color("colorBack", "Back", "#E8E4DC", "Background color"),
    color("colorFront", "Front", "#6B7A99", "Foreground color"),
  ],
  "grain-night": [
    field("speed", "Speed", 0.25, 0, 2, 0.01, "Animation speed"),
    field("softness", "Softness", 0.8, 0, 1, 0.01, "Edge softness"),
    field("intensity", "Intensity", 0.55, 0, 1, 0.01, "Grain strength"),
    field("noise", "Noise", 0.5, 0, 1, 0.01, "Noise amount"),
    colors("colors", "Colors", ["#0A0A0A", "#1A1A2E", "#2D4A6B", "#0D1520"], "Grain color stops"),
  ],
  "wave-ribbon": [
    field("scale", "Scale", 1.4, 0.2, 2, 0.01, "Pattern scale"),
    field("shape", "Shape", 0.6, 0, 3, 0.01, "Wave shape"),
    field("frequency", "Frequency", 1.1, 0, 2, 0.01, "Wave frequency"),
    field("amplitude", "Amplitude", 0.22, 0, 1, 0.01, "Wave height"),
    field("spacing", "Spacing", 0.55, 0, 2, 0.01, "Band spacing"),
    field("softness", "Softness", 0.08, 0, 1, 0.01, "Edge softness"),
    n("proportion", "Proportion", 0.5, { description: "Fill proportion" }),
    color("colorFront", "Front", "#5B8CFF", "Wave color"),
    color("colorBack", "Back", "#0A1628", "Background color"),
  ],
  "voronoi-soft": [
    field("speed", "Speed", 0.25, 0, 2, 0.01, "Animation speed"),
    field("scale", "Scale", 0.7, 0.2, 2, 0.01, "Cell scale"),
    field("distortion", "Distortion", 0.2, 0, 0.5, 0.01, "Cell warp"),
    field("gap", "Gap", 0.02, 0, 0.1, 0.005, "Gap between cells"),
    field("glow", "Glow", 0.08, 0, 1, 0.01, "Edge glow"),
    colors("colors", "Colors", ["#F5E6F0", "#D4E8F0", "#E8F0D4"], "Cell fill colors"),
    color("colorGap", "Gap", "#F7F5F0", "Gap color"),
    color("colorGlow", "Glow", "#FFFFFF", "Glow color"),
  ],
  "sera-wash": [
    field("angle", "Angle", 125, 0, 360, 1, "Gradient angle"),
    field("opacity", "Opacity", 1, 0, 1, 0.01, "Layer opacity"),
    field("speed", "Speed", 1, 0, 2, 0.01, "Wash drift speed"),
    colors("colors", "Colors", ["#F7F5F0", "#E8F0FF", "#D4C4A8", "#C5F0FF", "#F4F1EA"], "Wash color stops"),
  ],
  "stone-band": [
    field("bandCount", "Bands", 5, 2, 8, 1, "Number of horizontal bands"),
    field("opacity", "Opacity", 1, 0, 1, 0.01, "Layer opacity"),
    field("speed", "Speed", 0.4, 0, 2, 0.01, "Band drift speed"),
    colors("colors", "Colors", ["#E8E4DC", "#C8BBA8", "#A89880", "#D4C4A8", "#F4F1EA"], "Band colors"),
  ],
  "blue-signal": [
    field("angle", "Angle", 135, 0, 360, 1, "Wash angle"),
    field("opacity", "Opacity", 1, 0, 1, 0.01, "Layer opacity"),
    field("speed", "Speed", 0.6, 0, 2, 0.01, "Wash drift speed"),
    color("colorBack", "Back", "#E8F0FF", "Background stop"),
    color("colorMid", "Mid", "#5B8CFF", "Midtone stop"),
    color("colorFront", "Front", "#2D6BFF", "Brand blue stop"),
  ],
  "dusk-veil": [
    field("angle", "Angle", 160, 0, 360, 1, "Veil angle"),
    field("opacity", "Opacity", 0.92, 0, 1, 0.01, "Overlay opacity"),
    field("speed", "Speed", 0.35, 0, 2, 0.01, "Breathing speed"),
    colors("colors", "Colors", ["#0A0A0A", "#1A1210", "#2D4A6B", "#0A0A0ACC"], "Veil color stops"),
  ],
  "grid-ghost": [
    field("cellSize", "Cell size", 24, 8, 64, 1, "Grid cell size in px"),
    field("opacity", "Opacity", 1, 0, 1, 0.01, "Layer opacity"),
    field("speed", "Speed", 0.5, 0, 2, 0.01, "Pulse speed"),
    color("colorBack", "Back", "#F7F5F0", "Background color"),
    color("colorLine", "Line", "#2D6BFF33", "Grid line color"),
  ],
  "stripe-quiet": [
    field("angle", "Angle", 45, 0, 360, 1, "Stripe angle"),
    field("stripeWidth", "Stripe width", 12, 2, 48, 1, "Stripe width in px"),
    field("opacity", "Opacity", 1, 0, 1, 0.01, "Layer opacity"),
    field("speed", "Speed", 0.25, 0, 2, 0.01, "Drift speed"),
    color("colorA", "Color A", "#F4F1EA", "Primary stripe"),
    color("colorB", "Color B", "#E8E4DC", "Alternate stripe"),
  ],
  "glow-rim": [
    field("intensity", "Intensity", 0.65, 0, 1, 0.01, "Rim falloff"),
    field("opacity", "Opacity", 1, 0, 1, 0.01, "Layer opacity"),
    field("speed", "Speed", 0.45, 0, 2, 0.01, "Pulse speed"),
    color("colorCore", "Core", "#0A0A0A", "Center color"),
    color("colorRim", "Rim", "#2D6BFF", "Rim light color"),
  ],
  "fog-layer": [
    field("opacity", "Opacity", 0.95, 0, 1, 0.01, "Layer opacity"),
    field("speed", "Speed", 0.4, 0, 2, 0.01, "Fog drift speed"),
    colors("colors", "Colors", ["#E8E4DC", "#C8BBA8", "#F7F5F0", "#D4C4A8"], "Fog layer colors"),
  ],
};

const FALLBACK_PROPS: MaterialPropDef[] = MATERIAL_PROPS["grain-field"]!;

/** Prop defs for a material slug (falls back to grain-field). */
export function getMaterialProps(slug: string): MaterialPropDef[] {
  return MATERIAL_PROPS[slug] ?? FALLBACK_PROPS;
}

/** Defaults object derived from prop defs. */
export function getMaterialPropDefaults(
  slug: string,
): Record<string, number | string | string[]> {
  const defaults: Record<string, number | string | string[]> = {};
  for (const def of getMaterialProps(slug)) {
    defaults[def.key] = def.defaultValue;
  }
  return defaults;
}
