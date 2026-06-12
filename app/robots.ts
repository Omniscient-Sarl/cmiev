import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/llms.txt"],
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://cmiev.ch/sitemap.xml",
  };
}
