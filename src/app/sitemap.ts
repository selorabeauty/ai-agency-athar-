import type { MetadataRoute } from "next";
import { industryPages, servicePages } from "@/lib/seo-pages";

const baseUrl = "https://atherdigitalagency.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/services",
    ...servicePages.map((p) => `/services/${p.slug}`),
    ...industryPages.map((p) => `/industries/${p.slug}`),
    "/tabuk",
    "/work",
    "/contact",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/services") || route === "/tabuk" ? 0.8 : 0.7,
  }));
}
