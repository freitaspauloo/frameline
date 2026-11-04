export type ClientLogo = {
  name: string;
  src: string;
  /** Cropped viewBox width ÷ height. */
  aspect: number;
  /** Optical nudge on top of equal-area sizing — dense, solid marks read heavier. */
  optical?: number;
};

/**
 * Real clients shipped through DUDESIGN — see freitaspauloo/dudesign.
 *
 * Each SVG's viewBox is cropped to the glyph so LogoWall can size every mark
 * to the same visual area from `aspect`.
 */
export const CLIENT_LOGOS: readonly ClientLogo[] = [
  { name: "Audi", src: "/clients/audi.svg", aspect: 2.89 },
  { name: "Samsung", src: "/clients/samsung.svg", aspect: 6.54 },
  { name: "3M", src: "/clients/3m.svg", aspect: 1.9, optical: 0.85 },
  { name: "Ford", src: "/clients/ford.svg", aspect: 2.67 },
  { name: "Sony Honda", src: "/clients/sony-honda.svg", aspect: 3.53 },
  { name: "Afeela", src: "/clients/afeela.svg", aspect: 5.89 },
  { name: "Costco", src: "/clients/costco.svg", aspect: 3.4 },
];
