export type HomeTimelineEntry = {
  year: string;
  company: string;
  role: string;
  href?: string;
};

export type HomeFeaturedProject = {
  title: string;
  client: string;
  href: string;
  image: { src: string; alt: string };
};

export const homeTimeline: HomeTimelineEntry[] = [
  {
    year: "2026",
    company: "DUDESIGN",
    role: "Founder & Product Designer",
    href: "https://dudesign.us",
  },
  {
    year: "2025",
    company: "xix3D",
    role: "Senior Product Designer",
    href: "https://xix3d.com",
  },
  {
    year: "2024",
    company: "xix3D",
    role: "Product Designer",
    href: "https://xix3d.com",
  },
  { year: "2023", company: "SMPL - MKT & Consulting", role: "Visual Designer" },
];

/** Featured grid on the Paper homepage frame (15H-0). */
export const homeFeaturedProjects: HomeFeaturedProject[] = [
  {
    title: "Personal AI workspace",
    client: "ALIGNED AI",
    href: "/work/aligned-ai",
    image: {
      src: "/work/cases/aligned.webp",
      alt: "Aligned AI personal workspace interface",
    },
  },
  {
    title: "BuiltOps / Losani",
    client: "LOSANI",
    href: "/work/builtops",
    image: {
      src: "/work/06.webp",
      alt: "BuiltOps modular community microsite platform",
    },
  },
];
