/** Real clients shipped through DUDESIGN — see freitaspauloo/dudesign. */
export const CLIENT_LOGOS = [
  { name: "Audi", src: "/clients/audi.svg" },
  { name: "Samsung", src: "/clients/samsung.svg" },
  { name: "3M", src: "/clients/3m.svg" },
  { name: "Ford", src: "/clients/ford.svg" },
  { name: "Sony Honda", src: "/clients/sony-honda.svg" },
  { name: "Afeela", src: "/clients/afeela.svg" },
  { name: "Costco", src: "/clients/costco.svg" },
] as const;

export type ClientLogo = (typeof CLIENT_LOGOS)[number];
