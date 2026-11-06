import type { MetadataRoute } from "next";

const baseUrl = "https://atherdigitalagency.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/sign"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
