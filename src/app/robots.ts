import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dev/", "/live/", "/capture/", "/admin/"],
    },
    sitemap: "https://frameline.ai/sitemap.xml",
  };
}
