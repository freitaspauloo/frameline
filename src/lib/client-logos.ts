/** Real clients shipped through DUDESIGN — see freitaspauloo/dudesign. */
export const CLIENT_LOGOS = [
  { name: "Audi", src: "/clients/audi.svg", scale: 1.45 },
  { name: "Samsung", src: "/clients/samsung.svg", scale: 1.1 },
  { name: "3M", src: "/clients/3m.svg", scale: 1.05 },
  { name: "Ford", src: "/clients/ford.svg", scale: 1.35 },
  { name: "Sony Honda", src: "/clients/sony-honda.svg", scale: 1 },
  { name: "Afeela", src: "/clients/afeela.svg", scale: 0.9 },
  { name: "Costco", src: "/clients/costco.svg", scale: 0.95 },
] as const;

export type ClientLogo = (typeof CLIENT_LOGOS)[number];
